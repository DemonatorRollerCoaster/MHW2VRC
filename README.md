# MHW 2 VRC

Simple static site with a reactive, colorful liquid background.


Preview locally (Flask)

Windows / macOS / Linux (Python 3.8+ recommended):

```bash
# create a venv (optional but recommended)
python -m venv .venv
# activate (Windows)
.venv\Scripts\activate
# activate (macOS / Linux)
source .venv/bin/activate

# install dependencies
pip install -r requirements.txt

# run the Flask dev server (this will auto-open your browser)
python app.py
```

The Flask server serves the files in this folder, including `index.html`, `styles.css`, and `script.js`.

Publish on GitHub Pages

- Create a new repository (e.g. `MHW2VRC`) and push this folder as the repository root.
- In the repo settings -> Pages, set the source to `main` (or `gh-pages`) branch and root. GitHub will host the site at `https://<username>.github.io/<repo>/`.

Alternatively put the site in a `docs/` folder on `main` and set Pages source to `/docs`.

Want me to initialize a Git repo and push it to GitHub for you? Ask and I can do that next.
