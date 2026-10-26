#!/usr/bin/env python3
"""Check local HTML references without dependencies or network access."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.references = []
        self.labels = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        for name in ("href", "src", "poster"):
            if attrs.get(name):
                self.references.append(attrs[name])
        for name in ("aria-labelledby", "aria-describedby"):
            self.labels.extend(attrs.get(name, "").split())


def main():
    pages = {}
    errors = []
    for path in sorted(ROOT.glob("*.html")):
        page = Page()
        page.feed(path.read_text(encoding="utf-8"))
        pages[path] = page
        for value, count in Counter(page.ids).items():
            if count > 1:
                errors.append(f"{path.name}: duplicate id {value!r}")
        for label in page.labels:
            if label not in page.ids:
                errors.append(f"{path.name}: missing accessible label target {label!r}")

    checked = 0
    for path, page in pages.items():
        for reference in page.references:
            url = urlsplit(reference)
            if url.scheme or url.netloc:
                continue
            checked += 1
            target = (path.parent / unquote(url.path)).resolve() if url.path else path
            if url.path.startswith("/"):
                target = (ROOT / unquote(url.path).lstrip("/")).resolve()
            if target.is_dir():
                target = target / "index.html"
            if not target.is_file():
                errors.append(f"{path.name}: missing file for {reference!r}")
            elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
                errors.append(f"{path.name}: missing fragment for {reference!r}")

    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"OK: {len(pages)} HTML page(s), {checked} local references, unique IDs and accessible label targets.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
