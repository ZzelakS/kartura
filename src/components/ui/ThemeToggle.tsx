"use client";

import { useTheme } from "@/lib/theme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const goingLight = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={goingLight ? "Switch to light mode" : "Switch to dark mode"}
      title={goingLight ? "Light mode" : "Dark mode"}
      className={`flex h-8 w-8 items-center justify-center text-muted transition-colors hover:text-linen ${className}`}
    >
      {goingLight ? (
        <svg
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden
        >
          <circle cx="12" cy="12" r="4.2" />
          <path
            d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.5 1.5M17.1 17.1l1.5 1.5M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          aria-hidden
        >
          <path
            d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7Z"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
