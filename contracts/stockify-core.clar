;; Stockify Core Contract - Tokenized Stock Trading

;; Constants
(define-constant contract-owner tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_PAUSED (err u101))
(define-constant ERR_INSUFFICIENT_BALANCE (err u102))
(define-constant ERR_INVALID_AMOUNT (err u103))
(define-constant ERR_TICKER_NOT_FOUND (err u104))
(define-constant ERR_PRICE_STALE (err u105))

;; Data Variables
(define-data-var contract-paused bool false)

;; Data Maps

;; Per-user, per-ticker holdings
(define-map positions 
  { user: principal, ticker: (string-ascii 10) }
  { shares: uint, avg-cost: uint }
)

;; Transaction history
(define-map transactions
  { user: principal, tx-id: uint }
  {
    ticker: (string-ascii 10),
    shares: uint,
    price: uint,
    action: (string-ascii 10),
    asset: (string-ascii 10),
    timestamp: uint,
    block: uint
  }
)

;; Price registry (ticker → mock price in micro-STX)
(define-map price-registry
  (string-ascii 10)
  uint
)

;; User nonce for transaction IDs
(define-map user-nonces principal uint)

;; Public Functions

;; Buy stocks with STX
(define-public (mint-stock
  (ticker (string-ascii 10))
  (shares uint)
  (max-unit-price uint)
)
  (let (
    (user tx-sender)
    (nonce (+ (default-to u0 (map-get? user-nonces user)) u1))
    (current-price (unwrap! (map-get? price-registry ticker) ERR_TICKER_NOT_FOUND))
    (total-cost (* shares current-price))
    (current-shares (get-shares user ticker))
    (current-avg-cost (default-to u0 (get avg-cost (map-get? positions { user: user, ticker: ticker }))))
    (new-shares (+ current-shares shares))
    (new-avg-cost (if (is-eq current-shares u0)
                     current-price
                     (/ (+ (* current-shares current-avg-cost) (* shares current-price)) new-shares)))
  )
    ;; Validations
    (asserts! (not (var-get contract-paused)) ERR_PAUSED)
    (asserts! (> shares u0) ERR_INVALID_AMOUNT)
    (asserts! (<= current-price max-unit-price) ERR_PRICE_STALE)
    
    ;; Transfer payment to contract
    (try! (stx-transfer? total-cost user (as-contract tx-sender)))
    
    ;; Update holdings
    (map-set positions
      { user: user, ticker: ticker }
      { shares: new-shares, avg-cost: new-avg-cost }
    )
    
    ;; Record transaction
    (map-set transactions
      { user: user, tx-id: nonce }
      {
        ticker: ticker,
        shares: shares,
        price: current-price,
        action: "BUY",
        asset: "STX",
        timestamp: stacks-block-height,
        block: stacks-block-height
      }
    )
    
    ;; Update nonce
    (map-set user-nonces user nonce)
    
    ;; Emit event
    (print {
      event: "stock-purchased",
      user: user,
      ticker: ticker,
      shares: shares,
      price: current-price,
      total: total-cost,
      tx-id: nonce,
      block: stacks-block-height
    })
    
    (ok { tx-id: nonce, shares: shares, price: current-price, total: total-cost })
  )
)

;; Sell stocks for STX
(define-public (redeem-stock
  (ticker (string-ascii 10))
  (shares uint)
  (min-unit-price uint)
)
  (let (
    (user tx-sender)
    (nonce (+ (default-to u0 (map-get? user-nonces user)) u1))
    (current-shares (get-shares user ticker))
    (current-price (unwrap! (map-get? price-registry ticker) ERR_TICKER_NOT_FOUND))
    (total-proceeds (* shares current-price))
    (new-shares (- current-shares shares))
    (current-avg-cost (default-to u0 (get avg-cost (map-get? positions { user: user, ticker: ticker }))))
  )
    ;; Validations
    (asserts! (not (var-get contract-paused)) ERR_PAUSED)
    (asserts! (> shares u0) ERR_INVALID_AMOUNT)
    (asserts! (>= current-shares shares) ERR_INSUFFICIENT_BALANCE)
    (asserts! (>= current-price min-unit-price) ERR_PRICE_STALE)
    
    ;; Update holdings
    (map-set positions
      { user: user, ticker: ticker }
      { shares: new-shares, avg-cost: current-avg-cost }
    )
    
    ;; Transfer proceeds to user
    (try! (as-contract (stx-transfer? total-proceeds tx-sender user)))
    
    ;; Record transaction
    (map-set transactions
      { user: user, tx-id: nonce }
      {
        ticker: ticker,
        shares: shares,
        price: current-price,
        action: "SELL",
        asset: "STX",
        timestamp: stacks-block-height,
        block: stacks-block-height
      }
    )
    
    ;; Update nonce
    (map-set user-nonces user nonce)
    
    ;; Emit event
    (print {
      event: "stock-sold",
      user: user,
      ticker: ticker,
      shares: shares,
      price: current-price,
      total: total-proceeds,
      tx-id: nonce,
      block: stacks-block-height
    })
    
    (ok { tx-id: nonce, shares: shares, price: current-price, total: total-proceeds })
  )
)

;; Read-only Functions

;; Get user's holdings for a ticker
(define-read-only (get-shares (user principal) (ticker (string-ascii 10)))
  (default-to u0 
    (get shares (map-get? positions { user: user, ticker: ticker }))
  )
)

;; Get user's position details
(define-read-only (get-position (user principal) (ticker (string-ascii 10)))
  (map-get? positions { user: user, ticker: ticker })
)

;; Get transaction details
(define-read-only (get-transaction (user principal) (tx-id uint))
  (map-get? transactions { user: user, tx-id: tx-id })
)

;; Get current price for ticker
(define-read-only (get-price (ticker (string-ascii 10)))
  (map-get? price-registry ticker)
)

;; Get user's transaction count
(define-read-only (get-user-nonce (user principal))
  (default-to u0 (map-get? user-nonces user))
)

;; Admin Functions

;; Set price for a ticker (mock oracle)
(define-public (set-price (ticker (string-ascii 10)) (price uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) ERR_UNAUTHORIZED)
    (ok (map-set price-registry ticker price))
  )
)

;; Pause/unpause contract
(define-public (set-paused (paused bool))
  (begin
    (asserts! (is-eq tx-sender contract-owner) ERR_UNAUTHORIZED)
    (ok (var-set contract-paused paused))
  )
)

;; Initialize default prices
(map-set price-registry "AAPL" u175000000) ;; $175 in micro-STX
(map-set price-registry "TSLA" u245000000) ;; $245
(map-set price-registry "GOOGL" u140000000) ;; $140
(map-set price-registry "MSFT" u380000000) ;; $380
(map-set price-registry "AMZN" u155000000) ;; $155
(map-set price-registry "NVDA" u485000000) ;; $485
(map-set price-registry "META" u315000000) ;; $315
(map-set price-registry "BRK.B" u385000000) ;; $385
(map-set price-registry "SPY" u450000000) ;; $450
(map-set price-registry "QQQ" u380000000) ;; $380
