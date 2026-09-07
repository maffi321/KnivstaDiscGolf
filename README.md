# Knivsta Discgolf Website

Static site for Knivsta Discgolf (Sweden). Built with plain HTML/CSS and hosted via GitHub Pages.

## Structure
- `index.html` Home
- `about.html` About
- `membership.html` Membership (Google Form embed)
- `maintenance.html` Maintenance page
- `assets/` Styles, images, and config

## Maintenance Mode
Toggle maintenance mode in `assets/site-config.js`:

```js
window.SITE_CONFIG = {
  maintenance: true,
};
```

When enabled, all pages redirect to `maintenance.html`.

## Membership Form
Membership uses an embedded Google Form. To switch to a new spreadsheet/form, only update:
- `window.SITE_CONFIG.membershipForm.embedUrl`
- `window.SITE_CONFIG.membershipForm.openUrl`
- `window.SITE_CONFIG.membershipForm.title`

## GitHub Pages
Host by pushing this folder to a GitHub repo and enabling Pages from the `main` branch root.

## News (Google Sheets)
Add news items in a public Google Sheet and set its ID in `assets/site-config.js`.

columns:
- `id` (unique slug, optional)
- `date`
- `title`
- `summary`
- `body`
- `image` (optional image URL)
- `link` (optional external URL)
- `button_text` (optional button text for `link`)
- `doc1_title`, `doc1_url` (optional)
- `doc2_title`, `doc2_url` (optional)
- `doc3_title`, `doc3_url` (optional)
- `doc4_title`, `doc4_url` (optional)
- `doc5_title`, `doc5_url` (optional)
- `doc6_title`, `doc6_url` (optional)
- `doc7_title`, `doc7_url` (optional)

The news card always opens the local `news.html` detail page.
If `link` is set, the external link is shown below the full news text as a button.
Use `button_text` to choose the button label; otherwise it says `Öppna länk`.
If `image` is set, it is shown on the news card and the detail page.
If `docN_title` and `docN_url` are set, they are shown as buttons under `Handlingar` on the detail page.
