# Security Specification for Chilland.vn

## Data Invariants
1. A listing must have a valid code, category, title, area, price, and region.
2. A contact/lead must have a phone number and name.
3. Settings can only be modified by the admin.
4. Public can read listings and settings, but cannot delete or update them.
5. Clients can create contacts (leads) but cannot read or modify others' leads.

## The Dirty Dozen Payloads
1. Create a listing with a price <= 0.
2. Create a lead with an extremely long name (> 1000 characters).
3. Update a listing's ID.
4. Modify the 'broker' settings as an unauthenticated user.
5. Create a listing without a required field ('code').
6. Update 'createdAt' timestamp to past/future.
7. Attempt to read 'contacts' collection as public.
8. Delete a listing as public.
9. Inject HTML script into the 'description' field.
10. Update 'price' field using a string instead of a number.
11. Set 'listingId' in a contact to a non-existent ID.
12. Bulk download all leads by bypassing the 'list' rule.

## Test Runner Logic
- `match /listings/{id}`: `allow read: if true`. `allow write: if isAdmin()`.
- `match /contacts/{id}`: `allow create: if true`. `allow read, update, delete: if isAdmin()`.
- `match /settings/config`: `allow read: if true`. `allow write: if isAdmin()`.
