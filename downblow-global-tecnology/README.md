# Downblow Global Tecnology

A premium Nigerian gadget-store starter website for Downblow Global Tecnology.

## Included
- Luxury black/gold responsive storefront
- Uploaded official logo
- Product catalogue with featured current-market reference prices
- iPhone catalogue reference list from iPhone 6 through iPhone 18 Pro Max
- iPhone 18 Pro Max preorder flow with configurable deposit placeholder
- Cart
- Checkout form
- Nationwide delivery structure with location-based fee configuration
- Server-side Paystack initialization and verification endpoints
- Order/payment success page
- WhatsApp and contact links

## Important before production
1. Copy `.env.example` to `.env`.
2. Add your real Paystack secret and public keys.
3. Change the preorder deposit in `server.js` from the placeholder ₦500,000 to the official Downblow amount.
4. Configure real delivery fees in `server.js`.
5. Add a real database before accepting orders at scale. The starter currently demonstrates the payment flow but does not persist orders.
6. Review all product prices, conditions, stock and specifications before publishing. Market-reference prices are not Downblow's official prices.

## Run locally
```bash
npm install
npm start
```
Open http://localhost:3000

## Paystack
Never put the Paystack secret key in browser/frontend code. Keep it in `.env` and initialize/verify transactions server-side.

## Market reference used for the starter
Current Nigerian catalogue references were checked from Miller Gadgets for selected products such as iPhone 17 Pro Max, iPhone 16 Pro Max, iPhone 15 Pro Max, Samsung Galaxy S25 Ultra, Google Pixel 10 Pro XL and MacBook Air M4. These should be rechecked before publication because prices and availability change.
