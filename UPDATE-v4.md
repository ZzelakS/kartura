# Karturah v4 — About logo and favicon

- About page now uses the same transparent logo PNG as the footer, with no white container background.
- Added src/app/icon.png: a transparent 64×64 gold K favicon. Next.js automatically serves and links this icon across the app.
- Previous karturah.co configuration, footer transparency, and removal of the Tap to resonate control are retained.
- Commerce and backend behavior are unchanged.

The favicon was created using built-in ImageGen from the supplied logo, then resized for browser use. Prompt: “Create a favicon asset by extracting ONLY the existing large gold K monogram from the supplied Karturah logo. Preserve that exact K shape, its elegant high-contrast serif strokes and curved leg, and its original muted gold color. Remove all other text and the white background. Genuine transparent alpha background. Center the isolated K in a square composition and scale it to fill about 82% of the square height, with balanced margins. Crisp clean edges, flat gold, no glow, no shadow, no border, no new design. This will be used as a small browser favicon.”

This source package has not been deployed to Vercel. Retain your existing environment variables. Install with npm ci, build with npm run build, and start with npm start.
