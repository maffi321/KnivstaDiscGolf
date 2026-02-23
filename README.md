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
- `link` (optional external URL)
