VELORA WEBSITE — DEPLOYMENT PACKAGE (GitHub Pages / Netlify ready)
=====================================================================

FILES INCLUDED
--------------
index.html        Main page (all content and sections)
style.css         All styles
script.js         All interactivity (carousel, nav, modals, FAQ, scroll reveal, live forms)
assets/           Images (logo, 5 hero carousel photos, favicon)
.nojekyll         Tells GitHub Pages to skip Jekyll processing
README.txt        This file

All paths in index.html are relative, with no local computer paths,
so this works on GitHub Pages, Netlify, or any static host unchanged.

ALL THREE FORMS ARE NOW LIVE
-------------------------------
Every popup form on the site — Collaborate ("Start a Conversation"),
Talent ("Showcase Your Talent"), and Contact ("Send an Inquiry") — is
connected to Formspree and sends a real submission:

  Endpoint: https://formspree.io/f/xaenynyz
  Method:   POST

Each form sends via fetch() and shows one of three states without
ever leaving or reloading the page:
  - Submitting: button disables and shows a spinner + "Sending..."
    (or "Submitting..." for the Talent form)
  - Success:    an on-brand confirmation message specific to that form
  - Error:      a clear on-theme error message with a fallback email
                address, and the button re-enables so the visitor can
                try again

No form on the site says "not yet connected to a live inbox" anymore.

HERO CAROUSEL — ALL 5 SLIDES USE REAL PHOTOS
------------------------------------------------
assets/hero-1.jpg through hero-5.jpg, one per slide (Trust, Ideas,
Talent, Collaboration, What's Next).

HOW TO DEPLOY ON GITHUB PAGES
-------------------------------
1. Create a new PUBLIC repository on github.com.
2. Unzip this package, then upload its CONTENTS (index.html,
   style.css, script.js, assets/, .nojekyll) to the repo root - not
   the zip file, not a wrapping folder.
3. Commit the files.
4. Settings -> Pages -> Source: "Deploy from a branch" -> Branch:
   main -> Folder: / (root) -> Save.
5. Live at https://your-username.github.io/repo-name/ within a
   minute or two. All three forms work immediately, no extra
   configuration needed.

HOW TO DEPLOY ON NETLIFY
--------------------------
Drag the CONTENTS of the unzipped folder (not the .zip, not a
wrapping folder) into Netlify's "Deploy manually" drop zone.

VERIFICATION PERFORMED
------------------------
- Confirmed all three forms POST to https://formspree.io/f/xaenynyz
  with every field carrying a "name" attribute.
- Tested each form's full submit flow (loading, success, and error)
  by intercepting the network request and simulating both a
  successful and a failed Formspree response.
- Confirmed the Talent form's file upload field submits correctly as
  part of the multipart form data.
- Confirmed native browser validation still blocks invalid input
  (e.g. malformed email) before anything is sent.
- Confirmed all three modals are fully usable on a 390px mobile
  viewport.
- Confirmed style.css, script.js, and every image in assets/ load
  correctly over real HTTP.

Note on Formspree's own behavior: the first submission to a new
Formspree endpoint typically requires the account owner to confirm a
one-time verification email from Formspree before messages start
arriving in the inbox - that's on Formspree's side, not the code.
Since all three forms share the same endpoint, that confirmation only
needs to happen once.

FONTS
-----
Manrope and Inter load from Google Fonts, with "sans-serif" as a
fallback if that request is ever blocked.
