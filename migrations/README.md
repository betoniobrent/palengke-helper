# Apply the September 2026 fixes

For an existing Supabase project, run `20260926_fix_permissions_and_grocery_upsert.sql`
in the Supabase SQL editor. New projects can use the updated `supabase_tables.sql`.
Deploy the updated frontend files after applying the migration.

The migration adds the unique index required by grocery-list upserts and changes
admin authorization to the signed JWT's `app_metadata.role`. A client-editable
profile role no longer grants admin access. Profile writes must match the role
assigned in trusted account metadata. Set admin roles through the Supabase dashboard
or a trusted server, then sign in again to refresh the JWT.

The migration is transactional and does not delete existing lists. If duplicate
`(user_id, list_name)` pairs already exist, it stops without applying changes.
Inspect duplicates with:

```sql
SELECT user_id, list_name, count(*)
FROM public.user_grocery_lists
GROUP BY user_id, list_name
HAVING count(*) > 1;
```

Preserve each list's contents and resolve duplicate names before rerunning.

After applying, verify that a regular user cannot save a profile with role `admin`
or write market prices, while an admin assigned through account metadata can.
Save and reload a grocery list to verify persistence.

Local regression checks: `node --test tests/regressions.test.cjs`.
