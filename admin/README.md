# Palengke Helper+ Admin - Market Prices

This is the admin interface for managing market prices.

## Setup

### 1. Supabase Credentials

The publisher uses the main site's `../supabase.js` public client configuration.
Only existing accounts with trusted `app_metadata.role = admin` can publish.
The local demo account in the separate admin app cannot publish.

### 2. Create an Admin User

In your Supabase Dashboard:

1. Go to **Authentication > Users**
2. Create a new user (e.g. `admin@yourdomain.com`)
3. Note the user's `id`
4. Go to **Table Editor > profiles** and insert a row with that `id`
5. Set the user's `role` to `admin` using SQL:

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'::jsonb
WHERE id = 'ADMIN_USER_ID';
```

Replace `ADMIN_USER_ID` with the actual UUID.

### 3. Deploy

This page deploys with the main Cloudflare site at `/admin/`. Apply
`migrations/20260927_pdf_price_publishing.sql` before deploying. It validates all
rows and replaces the active price batch atomically, keeping older rows unpublished.

## How to Use

1. **Login** with the admin email and password.
2. **Upload** the official DA Bantay Presyo PDF.
3. **Review** the parsed items. Edit names, categories, units, and prices. Remove incorrect rows. Add missing rows manually.
4. **Set the date and region** exactly as printed on the report, then check the review confirmation.
5. **Click "Publish Market Prices"** to make the complete report visible to users. The previous published set will be unpublished automatically. Reload the website's Market Prices page to fetch the update. No GitHub push is needed for price changes.

## PDF Parsing Notes

The parser extracts text from the PDF and looks for price ranges like `120 - 150` or `₱120 - ₱150`. It then guesses the category based on keywords.

The text parser is in `price-pipeline.js`. Scanned PDFs without text require manual
entry; no OCR is provided. Parsing is a draft: verify units, wrapped names, ranges,
and all source rows before publishing. Blank prices represent unavailable values.
At least one available price is required. Uploading a new file replaces the draft.

Run `node --test tests/*.test.cjs` locally. `migrations/verify_pdf_publishing.sql`
checks server authorization, empty batch rejection, publication and rollback inside
a transaction that is rolled back; no test prices remain live.
