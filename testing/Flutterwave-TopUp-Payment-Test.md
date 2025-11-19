# Flutterwave Top-Up Payment Test Script

## Objective
Verify wallet top-up payments via Flutterwave, testing different amounts and payment options.

## Prerequisites
- Flutterwave public key configured in environment
- Backend wallet top-up APIs integrated with Flutterwave
- User logged into the app with wallet balance accessible

## Test Procedure

### 1. Enter top-up amount
- Navigate to the wallet top-up screen
- Enter various amounts, e.g., 1000, 5000, 10000

### 2. Choose payment method
- Select from "Card", "USSD", "Bank Transfer", or other available Flutterwave options

### 3. Initiate payment
- Tap the "Pay" or "Continue" button to start payment flow
- Ensure Flutterwave modal/SDK view appears with chosen payment method

### 4. Complete payment
- For Card: use saved card if available or enter new card details and authorize transaction
- For USSD or Bank Transfer: follow on-screen instructions to complete payment

### 5. Monitor callbacks
- Verify that `onRedirect` callback triggers with correct payment status
- Capture and validate transaction reference (`tx_ref`)

### 6. Check wallet balance update
- Confirm wallet balance refreshes correctly in the UI after successful payment
- Confirm backend updates wallet balance and records payment accurately

### 7. Test error and cancellation cases
- Cancel the payment process midway and confirm cancellation handling
- Input invalid payment details and verify appropriate error notifications

## Expected Results
- Payments complete successfully with wallet balance updates
- App handles errors, cancellations gracefully
- Callbacks provide accurate data to transaction handlers
- UI provides clear feedback during payment flow

---

This completes the top-up payment test documentation.
