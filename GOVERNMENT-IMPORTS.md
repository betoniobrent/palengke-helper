# Government price imports

The `Government price imports` GitHub Actions workflow checks DA and DTI daily at
09:17 Asia/Manila (GitHub may delay scheduled runs). It also supports **Run workflow**
in the repository Actions tab. It publishes validated reports directly to Supabase;
price changes do not require redeploying Cloudflare or keeping a computer running.

Sources:
- DA: https://www.da.gov.ph/price-monitoring/ (weekly NCR market prices)
- DTI: https://www.dti.gov.ph/dti-consumer-space/dti-latest-srps-basic-necessities-prime-commodities
  (BNPC suggested retail prices, preserving pack sizes and regional exceptions)

The same JavaScript parsers power browser uploads and scheduled imports. DTI uses
the PDF's table geometry to keep its three columns and wrapped product names apart.
Dates come from the document. DA weekly reports use the period's end date, retaining
the full period in notes. DTI uses the printed effective date.

## Validation and publication

- Only allowlisted government PDF hosts are downloaded, including redirect checks.
- Extraction must account for every price cell. Unsupported layouts stop the import.
- Dates, positive prices, paired ranges, names, units, categories, and duplicates are checked.
- DA requires at least 50 rows, DTI at least 100; DTI has one SRP per product.
- Relative to the previous published set, row counts must remain within 80–125%.
  A matched product's price moving below 50% or above 150% requires manual review.
- Each agency is replaced atomically. A DTI update never unpublishes DA rows.
- SHA-256 document hashes make repeat imports no-ops. Older reports cannot replace
  newer published prices. Revised documents with the same date are revalidated.
- Errors fail that agency's job and leave its previous prices published. The other
  agency still runs. GitHub Actions logs show the reason; notifications follow the
  repository owner's GitHub notification settings. No independent alert service is configured.
- Public `price_imports` records show successful document hashes, dates, source URLs,
  row counts and import timestamps. Check Actions for failed or unchanged checks.

## Credentials and maintenance

Apply `migrations/20260928_government_imports.sql` once. It preserves existing DA rows
and adds source metadata, provenance and a narrowly scoped publishing RPC.
Store a random 32-byte hex token as GitHub repository secret `GOVERNMENT_IMPORT_TOKEN`.
Store only its SHA-256 hash in `private.price_import_credentials`, under the name
`government-import`. This secret authorizes only validated price imports, not general
database access. Never commit the token or use a Supabase service-role key in the browser.

To stop publishing immediately, set `enabled=false` for that credential in Supabase,
or disable the workflow in GitHub. Rotate by updating the token hash and repository secret.
GitHub can disable schedules in inactive public repositories; check Actions periodically.

If validation fails because a legitimate report changed significantly, upload the
official PDF in `/admin/`, verify the draft, and publish manually. This records its
hash so automation will not overwrite that review with the same document.

## Checks

```
npm ci --ignore-scripts --omit=optional
node --test tests/*.test.cjs
node scripts/import-government-prices.cjs DA --dry-run
node scripts/import-government-prices.cjs DTI --dry-run
```

`migrations/verify_government_imports.sql` runs publication, isolation, credential,
idempotency and failure-preservation tests inside a transaction and rolls them back.
The older verification file targets the original single-source publisher.

PDF.js is pinned to the browser's 3.11.174 build; `isEvalSupported:false` is mandatory
in both paths. Optional canvas/rendering dependencies are not needed for extraction.
Fixture tests cover the supplied 100-row DA and 167-row DTI reports.
