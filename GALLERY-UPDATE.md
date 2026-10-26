# Gallery update

Added a responsive masonry gallery to the homepage, with all 18 supplied photographs and four supplied videos. Gallery links appear in desktop and mobile navigation. Filters show all moments, photographs, or films.

Click any tile to open the native modal lightbox. Images are displayed uncropped. Videos have native playback controls and play only when requested. Previous/next buttons, keyboard arrows (outside video controls), Escape-to-close, image swipe gestures, background scroll locking, modal focus containment and focus restoration are included. Video elements unmount on navigation/close, stopping playback. Motion effects respect reduced-motion preferences.

Assets are bundled in public/gallery and listed in src/data/gallery.json. The original media files are preserved. No third-party gallery dependency was added. Existing business logic, Convex backend and About text are unchanged.

Validation: production build and type checks passed; all 22 asset paths verified. Browser interaction and cross-device video playback have not been manually verified in this update.

Setup: retain your existing .env.local or hosting environment variables, run npm ci then npm run build. This archive contains the full modified source and assets; credentials, node_modules, build caches and Git metadata are excluded. No live deployment was performed.
