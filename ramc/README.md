# Rajmunch — Company Website

A static, single-page website for Rajmunch (cake premixes, yeast, cocoa powder, seeds).
Built with plain HTML/CSS/JS + GSAP scroll animations. No build step, no framework.

## Files
- `index.html` — the whole page
- `css/style.css` — all styling
- `js/config.js` — ⭐ YOUR DETAILS (edit this file first)
- `js/main.js` — animations & link wiring
- `images/` — product photos + logo

## 1. Add your real details
Open `js/config.js` and replace the placeholders:
- phone / email / instagram / whatsapp
- address + city
- `mapQuery` (what the Google Map should show, e.g. "Rajmunch, Main Market, Jaipur")
- `meesho` / `flipkart` listing links (once your listings are live)

## 2. Swap placeholder visuals for real photos
Each product card has a colored tile with an emoji:

    <div class="product-tile tile-vanilla">
      <span class="product-emoji">🎂</span>
    </div>

Replace it with your photo:

    <div class="product-tile">
      <img src="images/vanilla-premix.jpg" alt="Vanilla Cake Premix" />
    </div>

(Keep the `<span class="badge">` if you want the "Bestseller" label.)
Square-ish photos (4:3) look best.

## 3. Run locally
Just open `index.html` in a browser. Or:

    cd ramc && python3 -m http.server 8080

→ http://localhost:8080

## 4. Deploy (free)
- **Netlify:** drag & drop the folder at https://app.netlify.com/drop
- **GitHub Pages:** push to a repo, enable Pages in settings
- **Vercel:** `vercel deploy`

## Notes
- Animations use GSAP + ScrollTrigger + Lenis from CDNs (needs internet).
  If the CDNs are unreachable, the site still works — content just appears
  without animation.
- WhatsApp buttons open wa.me with a pre-filled message per product.
- The cake premix cards are marked *Upcoming* — when you launch them, remove
  `class="soon"` from those cards, delete the `.soon-note` div, and add the
  Meesho/Flipkart buttons (copy the pattern from the yeast card).
