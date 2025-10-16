;; DSTOCK Token - SIP-010 Fungible Token

(impl-trait .sip-010-trait.sip-010-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant ERR_UNAUTHORIZED (err u100))
(define-constant ERR_NOT_ENOUGH_BALANCE (err u101))

;; Token definition
(define-fungible-token dstock)

;; SIP-010 Functions

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) ERR_UNAUTHORIZED)
    (try! (ft-transfer? dstock amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)
  )
)

(define-read-only (get-name)
  (ok "Digital Stock Token")
)

(define-read-only (get-symbol)
  (ok "DSTOCK")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance dstock account))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply dstock))
)

(define-read-only (get-token-uri)
  (ok (some u"https://stockify.btc/token-metadata.json"))
)

;; Mint and Burn (only callable by contract owner/stockify-core)

(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) ERR_UNAUTHORIZED)
    (ft-mint? dstock amount recipient)
  )
)

(define-public (burn (amount uint) (owner principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) ERR_UNAUTHORIZED)
    (ft-burn? dstock amount owner)
  )
)
