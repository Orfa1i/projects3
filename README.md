# Three Worlds: Kitten · Virtual Hospital · EcoBeauty

A three-page interactive presentation in plain HTML, CSS and JavaScript. It needs no build step and no internet connection.

Presenters: Mohammed Orfali (Kitten, Virtual Hospital); Zainab Kamil and Mohammed Orfali (EcoBeauty). Change them in `window.PRESENTERS` in `js/content.js`.

## Launch

1. Unzip the folder.
2. Double-click `index.html`. It opens in Chrome, Edge, Safari or Firefox.
3. Press **F** to go fullscreen.

If a browser blocks local files, serve the folder instead:

```
cd three-worlds
python3 -m http.server 8000
```

Then open http://localhost:8000

## Controls

| Action | Keys |
|---|---|
| Next | → · ↓ · Page Down · Space · clicker forward |
| Previous | ← · ↑ · Page Up · Shift+Space · clicker back |
| Jump to a page | 1 · 2 · 3 · Home · End · or click the page pills (top right) |
| Fullscreen | F |
| Motion on/off | M (reduced motion also follows the operating-system setting) |

Pages never change on their own. If you press twice during a transition, the second press runs straight after the first. The page number is kept in the address (`#1`, `#2`, `#3`), so reloading keeps your place. The cursor hides after 2.5 s of no movement.

## Where the content comes from

- **Kitten:** brand colors, the ECG telemetry motif, the AI-green pulse and the typefaces (League Spartan, Plus Jakarta Sans) come from the *Kitten Brand & Design Reference* artifact. The main screen is the DICOM viewer screenshot you supplied; behind it is a capture of the case table from the *Kitten — Cases* artifact. The summary-count row and sidebar badges are left out so the page shows no figures. The "mock PACS node" and "Not for diagnostic use" notes come from those same artifacts.
- **Virtual Hospital:** the logo, wording, safety notes and colors come from the *Virtual Hospital by Asklevia* landing page. The screens are captures of that page's AI differential card and the *Virtual Hospital Case Intake* page. The seven specialist agents (names, colors and animated avatar illustrations) come unchanged from the *Virtual Hospital Staff Roster* artifact and live in `js/agents.js`.
- **EcoBeauty:** the supplied logo, photograph and description.

## Changing text or images

Edit only `js/content.js`. Any empty field shows a dashed "Awaiting ·" placeholder. If a file path is wrong, the placeholder says "file not found" instead of breaking. `screens` takes up to three images: the first is the main screen and the others sit in front of or behind it in depth.

## Files

- `index.html`: structure of the three worlds and the shared controls
- `css/styles.css`: each world's atmosphere, layout and motion; the transition ring; reduced motion
- `js/app.js`: navigation, the capsule-portal transition, content binding, parallax
- `js/content.js`: all text and image paths
- `js/agents.js`: the seven Virtual Hospital agents
- `assets/fonts/`: Inter, League Spartan, Plus Jakarta Sans, Funnel Display, Host Grotesk, Cormorant Garamond, IBM Plex Mono (SIL Open Font License, from Fontsource)
- `assets/kitten/`, `assets/virtual-hospital/`: interface captures and the Virtual Hospital logo (SVG)
- `assets/ecobeauty/`: the supplied logo (white background made transparent) and the supplied bottle photograph. The white "EcoBeauty" wordmark baked into the photograph was softened out so it can sit behind the page without repeating the logo, and the right-hand bottles were cut out as a separate depth layer.

## Network dependencies

None. Fonts, images and code are all local. The optional reference video from the motion brief is not used.
