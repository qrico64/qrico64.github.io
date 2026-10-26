# Personal research website

A white, minimal academic portfolio for GitHub Pages. The introduction and contact
links stay above **Papers**, **Demos**, and **Timeline**. Papers opens by default.
This is plain HTML, CSS, and JavaScript: there are no packages or build steps.

The paper titles, authors, dates, links, portrait, illustrations, and videos are
placeholders. The Tesla internship and two ICPC World Finals appearances come
from your supplied background. Confirm all details before publishing.

## 1. Preview locally

Open Terminal in this directory and run:

```sh
python3 tools/serve.py 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000>. Keep that Terminal running; press **Control+C** to
stop it. After editing a file, save it and refresh the browser. You can also open
`index.html` directly, but a local server is the preferred preview method.

This uses Python's built-in file server and handles canceled browser transfers
without printing `BrokenPipeError` or `ConnectionResetError` tracebacks. Browsers
can close a video request early after reading metadata, seeking, or leaving the
page. If the video plays, this traceback is harmless; the server keeps running.
Other server errors are still reported.

Try all three tabs, the Demo / Related paper links, browser Back/Forward, and a
narrow browser window. In the tabs, Left/Right and Home/End move between panels.
Links like `/#demos`, `/#timeline`, and `/#demo-01` can be shared directly.
Without JavaScript, all sections remain readable on one page.

An optional dependency-free check catches duplicate IDs and missing local media,
links, and fragment targets:

```sh
python3 tools/check_site.py
```

It does not validate external URLs or replace a browser check.

## 2. Know where to edit

| File / folder | What it controls |
| --- | --- |
| `index.html` | All visible content, links, media references, and search description |
| `styles.css` | Typography, colors, spacing, and mobile layouts |
| `script.js` | Accessible tabs, shareable hashes, and pausing hidden videos |
| `assets/images/` | Portrait, paper figures, and demo posters |
| `assets/videos/` | Short MP4 clips used in the Demos tab |
| `assets/documents/` | Public documents such as your résumé |
| `.nojekyll` | Makes GitHub Pages serve the static files without Jekyll processing |
| `docs/pdf-hosting.md` | Keeping paper PDFs out of cooperating search engines |

Search `index.html` for `EDIT:`, `Your Name`, and `[` to locate placeholders.
The `.svg` and `.mp4` files included here are original, labeled placeholders.

### Name, bio, and contact links

In `index.html`, update the `<title>`, description `<meta>`, `<h1>`, bio,
availability sentence, location, and footer name. Replace the bracketed fields
with your university, advisor, lab, interests, and graduation / availability date.
You can wrap university, lab, or advisor names in links.

The contact row uses non-clickable `<span class="link-placeholder">` elements
so the starter does not send visitors to fake profiles. Replace them with anchors:

```html
<nav class="contact-links" aria-label="Contact and profiles">
  <a href="mailto:your.name@example.edu">Email</a>
  <a href="https://github.com/YOUR_USERNAME">GitHub</a>
  <a href="https://www.linkedin.com/in/YOUR_PROFILE/">LinkedIn</a>
  <a href="https://scholar.google.com/citations?user=YOUR_ID">Scholar</a>
  <a href="assets/documents/resume.pdf">Résumé ↗</a>
</nav>
```

Remove any profile you don't use. Put your actual résumé in
`assets/documents/resume.pdf` before adding that link. This résumé is a **public
document** and may be indexed; if you want it unindexed too, use the PDF-hosting
approach described below instead.

### Portrait and images

Add your portrait as `assets/images/portrait.jpg`, then update the profile image:

```html
<img src="assets/images/portrait.jpg" width="400" height="460"
     alt="Portrait of Your Name">
```

The CSS crops it to the existing portrait frame. Adjust `.portrait img` if you
prefer a different shape. Use a compressed JPG or WebP rather than a huge camera
original. The supplied SVG favicon is optional; replace or remove its `<link>`.

### Papers

Each paper is an `<article class="paper">` in the `PAPERS` section. For each:

1. Change the title, author list, status, venue, and summary. Wrap your name in
   `<strong>`. Confirm the exact venue/workshop and status of the second paper;
   submitted work should not be labeled accepted.
2. Add an overview figure to `assets/images/` and update the image's `src` and
   `alt`. The preview frame is approximately 3:2. Edit `.paper-image` for a
   different ratio if the figure would otherwise be cropped.
3. Replace the PDF / Code / Project placeholder spans with actual links. Remove
   resources you don't have.
4. Keep a unique article `id`; the Demos and Timeline sections link to it.

Example resource row:

```html
<div class="paper-links" aria-label="Paper resources">
  <a href="https://YOUR-PDF-HOST.pages.dev/papers/paper-one.pdf">PDF</a>
  <a href="https://github.com/YOUR_USERNAME/YOUR_PROJECT">Code</a>
  <a href="https://YOUR_PROJECT.github.io/">Project</a>
  <a href="#demo-01">Demo ↗</a>
</div>
```

**For PDFs you want excluded from search, first follow
[the PDF-hosting guide](docs/pdf-hosting.md).** The example above deliberately
links to a separate PDF host, where response headers can be configured.

If you decide a document can be fully public and searchable, you can instead
put it in `assets/documents/paper-one.pdf` and link to that relative path.
Uploading it there does not apply `noindex`.

To add a third paper, copy a whole `<article class="paper">…</article>` block,
give it a unique `id`, and replace its contents.

### Robot videos

Replace `assets/videos/demo-01.mp4` and `demo-02.mp4` with your real clips, or add
new files and update each `<source src="…">`. Replace the SVG posters with an
actual still frame. For example:

```html
<video controls playsinline preload="none"
       poster="assets/images/grasping-poster.jpg"
       width="1280" height="720"
       aria-label="Robot grasping objects in an unfamiliar scene"
       aria-describedby="demo-01-caption">
  <source src="assets/videos/grasping.mp4" type="video/mp4">
  <p><a href="assets/videos/grasping.mp4">Download the clip.</a></p>
</video>
```

Update the `<figcaption>` directly underneath. Describe the task, what the
viewer should notice, and your contribution in one or two sentences. Label
simulation footage and accelerated playback where applicable. Update the
Related paper link, or remove it for projects without a paper. If the clip
contains speech or meaningful sound, add a WebVTT captions track.

Use MP4 with H.264 video and a broadly supported pixel format (`yuv420p`).
The starter clips have no audio. `preload="none"` requests that the browser defer
video loading until playback; posters provide an immediate preview. Switching
away from Demos pauses the videos. Nothing autoplays.

If you have FFmpeg installed, this creates a small, silent demo clip from your
own video (change filenames as needed):

```sh
ffmpeg -i input.mov -vf "scale=1280:-2" -c:v libx264 -crf 25 -preset medium \
  -pix_fmt yuv420p -movflags +faststart -an assets/videos/grasping.mp4
```

Keep individual clips small (a few MB is a useful target). For long videos, use
an external video host and an embed or link. GitHub blocks regular Git files
larger than 100 MiB; see [GitHub's large-file documentation](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github).

To add another demo, copy an entire `<figure class="demo">…</figure>`. Give the
figure and caption unique IDs, update `aria-describedby` to match the new
caption ID, and update the related links.

### Timeline

Replace `[Month]` and `[Year]` and organize entries into actual year groups,
newest first. The current `Earlier` group is a placeholder until you add dates.
Copy a `<div class="timeline-year">` for each additional year, then add entries:

```html
<li>
  <time class="timeline-date" datetime="2026-09">Sep</time>
  <p>Our <a href="#paper-accepted">paper</a> was accepted to
     <strong>CoRL 2026</strong>.</p>
</li>
```

The date above is an example, not an assertion of your acceptance date. Add real
internship dates, both ICPC years and team/result links, education milestones,
paper acceptances, and project releases. Keep each entry brief.

## 3. Publish at YOUR_USERNAME.github.io

These instructions assume you are creating a **new, empty repository** for the
site. This folder has not been initialized as a Git repository or published.

### Create the repository

On GitHub, create a **public** repository named exactly
`YOUR_USERNAME.github.io`, replacing `YOUR_USERNAME` with your GitHub username
(lowercase). The account must be the owner of the repository. Leave the options
to initialize a README, license, and `.gitignore` **unchecked**, since the files
are already here. If you already have a repository with that name, use its
existing checkout instead of overwriting its history with these commands.

GitHub's naming rule and public-repository availability are documented in
[Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

### Commit and push these files

Run from this directory, after replacing the username in the remote URL:

```sh
git init -b main
git add index.html styles.css script.js .nojekyll .gitignore README.md assets docs tools
git status
git commit -m "Add personal research website"
git remote add origin https://github.com/qrico64/qrico64.github.io.git
git push -u origin main
```

The explicit `git add` list includes the site files. The unrelated `.vsix` file
already in this directory is left alone and ignored. Do not commit unindexed
papers to this public repository; use the separate hosting instructions.

If Git asks for identity, set your own `user.name` and `user.email` as prompted.
For GitHub authentication, use your configured SSH key, GitHub CLI login, or a
personal access token with the needed repository permissions. GitHub account
passwords cannot be used as Git HTTPS passwords. GitHub Desktop is another way
to add this local repository and publish it if you prefer a graphical interface.

### Enable Pages

In the GitHub repository:

1. Open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Choose **main** and **/ (root)**, then **Save**.
4. Watch the deployment in the **Actions** tab. Once it completes, visit
   `https://YOUR_USERNAME.github.io/`.

GitHub says publication can take up to 10 minutes after a push. See
[publishing-source settings](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
and [site creation](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
No build command or custom workflow is needed for this static site.

### Make future updates

Edit files, preview them locally, and then run:

```sh
python3 tools/check_site.py
git add index.html styles.css script.js assets
git diff --cached --stat
git commit -m "Update papers and demos"
git push
```

Add any edited documentation by filename too. Pages will publish the update.
Paths are case-sensitive online: `Portrait.jpg` and `portrait.jpg` are different.
If deployment fails, inspect the Pages workflow in **Actions**. If your browser
shows an old version after a successful deployment, try a hard refresh.

## 4. Paper PDFs and search visibility

**GitHub Pages alone cannot provide the PDF-specific `noindex` header.** A
`robots.txt` block, an obscure filename, a `download` link, or `noindex` on an
HTML wrapper is not an equivalent solution.

Recommended arrangement: keep the website on GitHub Pages, host the PDFs on a
service that lets you send `X-Robots-Tag: noindex` for the actual PDF response,
and link to those files from Papers. This leaves the website searchable while
asking cooperating search engines to exclude the PDF URLs.

Follow **[docs/pdf-hosting.md](docs/pdf-hosting.md)** for a concrete Cloudflare
Pages Direct Upload recipe and verification command. There is no working PDF
host configured yet, and this starter does not include any paper PDFs.

`noindex` is a search-engine directive, not access control. Anyone with a public
PDF link can open, download, and share it. If you need controlled access, keep
the file behind authentication or share it on request.
