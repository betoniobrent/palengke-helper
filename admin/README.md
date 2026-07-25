# Palengke Helper+ Admin - Market Prices

This is the admin interface for managing market prices.

## Setup

### 1. Supabase Credentials

Open `admin.js` and replace:

```js
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

with your actual Supabase URL and anon key.

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

Upload the `admin/` folder to any static host (Netlify, Vercel, GitHub Pages) or open `index.html` with Live Server.

## How to Use

1. **Login** with the admin email and password.
2. **Upload** the official DA Bantay Presyo PDF.
3. **Review** the parsed items. Edit names, categories, units, and prices. Remove incorrect rows. Add missing rows manually.
4. **Set the date** for this price data.
5. **Click "Publish Market Prices"** to make this set visible to users. The previous published set will be unpublished automatically.

## PDF Parsing Notes

The parser extracts text from the PDF and looks for price ranges like `120 - 150` or `₱120 - ₱150`. It then guesses the category based on keywords.

If the PDF layout is different, edit the `parseBantayPresyoText()` function in `admin.js` to match the structure.
