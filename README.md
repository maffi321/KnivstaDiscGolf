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

## GitHub Pages
Host by pushing this folder to a GitHub repo and enabling Pages from the `main` branch root.
