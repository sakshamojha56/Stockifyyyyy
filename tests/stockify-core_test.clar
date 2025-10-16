;; Stockify Core Test Suite

(define-constant wallet-1 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)
(define-constant wallet-2 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG)

;; Test: Buy stock successfully
(define-public (test-mint-stock-success)
  (let (
    (initial-balance (stx-get-balance wallet-1))
  )
    ;; Mint 5 shares of AAPL
    (contract-call? .stockify-core mint-stock "AAPL" u5 u200000000)
    
    ;; Verify shares were added
    (asserts! 
      (is-eq (contract-call? .stockify-core get-shares wallet-1 "AAPL") u5)
      (err u1))
    
    (ok true)
  )
)

;; Test: Sell stock successfully
(define-public (test-redeem-stock-success)
  (begin
    ;; First buy some shares
    (try! (contract-call? .stockify-core mint-stock "TSLA" u10 u300000000))
    
    ;; Then sell some
    (try! (contract-call? .stockify-core redeem-stock "TSLA" u5 u200000000))
    
    ;; Verify remaining shares
    (asserts! 
      (is-eq (contract-call? .stockify-core get-shares tx-sender "TSLA") u5)
      (err u2))
    
    (ok true)
  )
)

;; Test: Cannot sell more than owned
(define-public (test-redeem-stock-insufficient)
  (let (
    (result (contract-call? .stockify-core redeem-stock "GOOGL" u100 u100000000))
  )
    (asserts! (is-err result) (err u3))
    (ok true)
  )
)

;; Test: Price registry works
(define-public (test-get-price)
  (let (
    (aapl-price (contract-call? .stockify-core get-price "AAPL"))
  )
    (asserts! (is-some aapl-price) (err u4))
    (ok true)
  )
)

;; Test: Transaction history tracking
(define-public (test-transaction-history)
  (begin
    ;; Make a purchase
    (try! (contract-call? .stockify-core mint-stock "NVDA" u3 u500000000))
    
    ;; Check transaction was recorded
    (let (
      (nonce (contract-call? .stockify-core get-user-nonce tx-sender))
      (tx-details (contract-call? .stockify-core get-transaction tx-sender nonce))
    )
      (asserts! (is-some tx-details) (err u5))
      (ok true)
    )
  )
)
