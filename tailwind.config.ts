import type { Config } from "tailwindcss";

/**
 * Colours are role names, not literal shades, and resolve through CSS variables
 * so both themes share one set of utility classes.
 *
 *   ink    page surface
 *   bark   alternate section surface
 *   linen  primary text
 *   muted  secondary text
 *   amber  accent and calls to action
 *   sage   labels and confirmations
 *
 * In dark mode ink is near-black and linen is near-white. In light mode they
 * swap roles. Nothing in the components has to know which is active.
 */
const withAlpha = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: withAlpha("--c-ink"),
        bark: withAlpha("--c-bark"),
        amber: withAlpha("--c-amber"),
        sage: withAlpha("--c-sage"),
        linen: withAlpha("--c-linen"),
        muted: withAlpha("--c-muted"),
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wordmark: "0.16em",
      },
      maxWidth: {
        prose: "48ch",
      },
    },
  },
  plugins: [],
};

export default config;
