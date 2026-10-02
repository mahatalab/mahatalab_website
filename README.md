# Mahata Lab website

Static site (GitHub Pages) + built-in editor. **Content** is in `content/site.js`; **design** is in `css/style.css` and `js/app.js`. Routine changes never require touching code.

## Deploy
1. Create a GitHub repository and upload everything in this folder (keep `.nojekyll`).
2. Settings → Pages → deploy from branch `main`, folder `/ (root)`.
3. Site: `https://<user>.github.io/<repo>/` — editor: `.../admin/`.

## Test locally
Just double-click `index.html` (or `admin/index.html`) — no server needed.

## Editing (admin/)
Open the site → footer → **Edit Website**. Choose a section on the left; add / edit / delete / reorder (↑ ↓) items; rich-text toolbar gives bold, italic, underline, size, colour, highlight, links. **Preview** shows the whole site with your unsaved changes. **Save draft** keeps them in this browser. **Publish to GitHub** commits `content/site.js` and any uploaded images (`assets/uploads/`) to your repo; Pages updates in 1–2 minutes.
Site Settings: lab name, subtitle, logo, favicon, colours, fonts, base font size, footer, social links. Home → Order controls which home sections appear and in what order.

## GitHub authentication (security)
No token exists anywhere in the code or repo. You paste a token into the editor's password field each session; it lives only in browser memory and is never saved (only owner/repo/branch are remembered).
**Limitation:** true OAuth needs a small server (GitHub's token exchange needs a secret and blocks browser CORS), which GitHub Pages cannot host. The simplest secure option is a **fine-grained personal access token**: GitHub → Settings → Developer settings → Fine-grained tokens → repository access: *only this repo* → permission *Contents: Read and write* → short expiry. Both the lab desktop and the professor's computer can each make their own. Anyone without a token can open the editor but cannot publish.

## Content notes
- All text is from `Mahata_Lab_Website_Content.docx`. Missing items are blank/hidden: DOIs, team photos and bios, research subsections, hero image, logo, favicon, gallery photos.
- News item 1 contains a marked **[PLACEHOLDER]** where the docx asked for student names/institutes.
- The docx's "dark green/black theme" note was overridden by the Scientific Plum palette you specified.
