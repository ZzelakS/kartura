"use client";

import { useMemo, type ReactNode } from "react";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { CartProvider } from "@/lib/cart";
import { ThemeProvider } from "@/lib/theme";
import { CONVEX_URL } from "@/lib/convex-url";

export default function Providers({ children }: { children: ReactNode }) {
  const client = useMemo(() => new ConvexReactClient(CONVEX_URL), []);

  return (
    <ConvexAuthNextjsProvider client={client}>
      <ThemeProvider>
        <CartProvider>{children}</CartProvider>
      </ThemeProvider>
    </ConvexAuthNextjsProvider>
  );
}
