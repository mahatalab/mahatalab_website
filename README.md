# Mahata Lab Website

Static site for the Bacteria and Phage Genetics Lab, NISER Bhubaneswar. No build step, no server needed.

## Run locally
Double-click `index.html`. The editor is at `admin/index.html` (also reachable from the small "Edit Website" link in the footer).

## Folder guide
- `index.html` – page shell
- `css/style.css` – all design (colours and fonts are CSS variables at the top)
- `js/app.js` – page renderer
- `content/site.js` – **all text, links and picture paths** (this is the only file that changes when you edit)
- `admin/` – the no-code editor
- `assets/img/` – logos and research illustrations; `assets/team/` – team photos; `assets/uploads/` – pictures added via the editor

## Deploy on GitHub Pages
1. Create a GitHub repository and upload everything in this folder (keep `.nojekyll`).
2. Repository **Settings → Pages →** deploy from branch `main`, folder `/ (root)`.
3. The site appears at `https://<username>.github.io/<repo>/`.

## Editing without code
Open **Edit Website**, pick a section on the left, change text (rich-text toolbar: bold, italic, underline, size, colour, highlight, link), upload pictures, add/delete/reorder news, publications, team members and research themes. The right pane is a live preview. "Menu order" reorders or hides menu items.
- **Save draft** keeps changes in this browser. **Download site.js** gives you the content file to upload manually.
- **Publish to GitHub** writes `content/site.js` (and new pictures to `assets/uploads/`) straight to your repository.

### GitHub token (important)
No token is stored in the code. Create a *fine-grained Personal Access Token* limited to this one repository with **Contents: Read and write**, and paste it into the editor each time. It stays in memory only. Owner, repo and branch are remembered in your browser. Click **Connect (test)** before your first publish.

## Credits
Website developed by Samchita Sarangi · Website maintained by Dr. Tridib Mahata. Change these in *Site settings*.
