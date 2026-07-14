# Lebanon Drug Prices Web Scraper API

An Express API that returns the latest marketed-drugs price spreadsheet published by Lebanon's Ministry of Public Health (MOPH).

Production API: https://ldp-web-scraper-api.vercel.app

## Endpoints

### `GET /getLink`

Returns the latest spreadsheet URL and its publication date.

Example response:

```json
{
  "status": 200,
  "version": "1.0",
  "downloadLink": "https://moph.gov.lb/userfiles/files/HealthCareSystem/Pharmaceuticals/DrugsPublicPriceList/10-7-2026/WebMarketed20260710.xls",
  "date": "10/7/2026"
}
```

### `GET /getLink/redirect`

Redirects to the latest spreadsheet when it is available. If retrieval fails, it returns the API error response instead.

### `GET /status`

Returns the operational status and API version.

### `GET /`

Returns `Hello world!` as a basic availability check.

## How retrieval works

The scraper requests the official MOPH price-list page and locates the first marketed spreadsheet link in the newest section:

https://moph.gov.lb/en/Pages/3/3101/drugs-public-price-list-

MOPH's Cloudflare configuration currently challenges requests from Vercel's server IPs. The application therefore:

1. Requests MOPH directly first.
2. Uses Jina Reader as a read-only fallback only when MOPH returns HTTP 403.
3. Parses the fallback Markdown for the same official MOPH spreadsheet URL.
4. Caches a successful Vercel response for one hour, with stale responses available while revalidation occurs.

The returned download link always points to `moph.gov.lb`; Jina Reader is only used to read the public listing page.

## Local development

Install dependencies:

```bash
npm install
```

Start the local server:

```bash
npm start
```

The API will be available at http://localhost:3000.

Run the tests:

```bash
npm test
```

## Vercel deployment

The Vercel function exports the Express app from `api/index.js`. The separate `server.js` entrypoint owns `app.listen()` only during local development.

Use the project-local Vercel CLI to avoid accidentally running an outdated global installation:

```bash
./node_modules/.bin/vercel deploy --prod --yes
```

If the GitHub project is connected to Vercel, pushing `main` can also trigger a production deployment automatically.

## Changes made on 2026-07-14

- Fixed `FUNCTION_INVOCATION_FAILED` by exporting the Express application as the Vercel handler.
- Moved the standalone HTTP listener into `server.js` for local development.
- Updated the scraper for MOPH's current list-based HTML instead of the removed `table.contentTable` structure.
- Added support for both `.xls` and `.xlsx` marketed spreadsheet links.
- Added a 15-second timeout to direct MOPH requests.
- Added the HTTP 403 reader fallback for Cloudflare-blocked Vercel requests.
- Return real HTTP error statuses instead of only placing the status inside JSON.
- Added error logging that preserves the underlying upstream failure.
- Added caching for successful `/getLink` responses.
- Added regression tests for the Express handler, health endpoints, current MOPH HTML, and fallback Markdown.

Production was verified to return HTTP 200 from `/getLink` with the latest MOPH spreadsheet URL.
