# Flutterwave Subscription Payment Test Script

## Objective
Verify subscription payments via Flutterwave for different subscription plans with multiple payment options.

## Prerequisites
- Flutterwave public key set in app environment
- Backend services updated to Flutterwave endpoints functioning correctly
- User logged into the app
- Subscription plans available for selection

## Test Procedure

### 1. Select a subscription plan
- Navigate to Subscription Screen
- Choose any available subscription plan

### 2. Select payment method
- Open payment method selector
- Test with "Card" payment option:
  - Use saved card if available or enter new card details
- Test with "USSD" option
- Test with "Bank transfer" option
- Test any additional options like QR if available

### 3. Initiate payment
- Press the "Continue" or "Pay" button
- Flutterwave payment modal/view opens with selected payment method

### 4. Complete payment
- For Card: Enter valid card details or select saved card, authorize payment
- For USSD or Bank transfer: follow prompts to complete payment

### 5. Verify callbacks
- Confirm `onRedirect` fires with successful status
- Confirm transaction reference (`tx_ref`) received

### 6. Confirm subscription update
- Verify subscription status updates on frontend UI
- Confirm backend subscription data updated correctly

### 7. Test payment failure/cancellation
- Cancel payment modal before completion
- Input invalid card details (for Card payment)
- Confirm appropriate error messages/alerts appear

## Expected Results
- Payment succeeds and subscription is updated
- UI response is smooth and shows feedback modals
- Callbacks execute correctly
- Failed or cancelled payments handled gracefully

---

# Flutterwave Top-Up Payment Test Script

## Objective
Verify wallet top-up payments via Flutterwave with multiple payment options.

## Prerequisites
- Flutterwave public key configured
- Backend wallet services integrated with Flutterwave
- User logged into the app with wallet available

## Test Procedure

### 1. Enter top-up amount
- Navigate to top-up/payment screen
- Input various top-up amounts (e.g., 1000, 5000)

### 2. Select payment method
- Choose from "Card", "USSD", "Bank transfer", etc.

### 3. Start payment
- Press the "Continue" or "Pay" button
- Confirm Flutterwave modal appears with right options

### 4. Complete payment
- For Card, test saved card and new card entry flows
- For USSD, Bank transfer, follow prompts to pay

### 5. Observe callbacks
- Ensure `onRedirect` callback fires correctly
- Transaction reference (`tx_ref`) captured and sent to backend

### 6. Confirm wallet balance update
- Verify wallet balance updates correctly post-payment on frontend
- Check backend wallet balance records updated

### 7. Payment failure and cancellations
- Cancel payment process midway
- Try invalid payment details
- Confirm errors/alerts shown and handled safely

## Expected Results
- Wallet balance updates after successful payment
- User informed of success/failure promptly
- Saved card prompts and flows function correctly
- App gracefully handles payment errors and cancellations

---

These scripts form the foundation for manual or automated testing of the critical payment flows after migration.
