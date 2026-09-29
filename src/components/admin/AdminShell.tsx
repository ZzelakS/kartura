"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { adminMe } from "@/lib/convex-functions";
import { site } from "@/lib/site.config";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { isConvexConfigured } from "@/lib/convex-url";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuthActions();
  const me = useQuery(adminMe, {});

  // The sign-in page renders on its own; middleware already keeps signed-in
  // visitors off it.
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-ink text-linen">{children}</div>;
  }

  // Without a deployment the query never resolves, so name the cause rather than
  // spinning on "Checking access" forever.
  if (!isConvexConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-6">
        <div className="max-w-[460px]">
          <h1 className="font-display text-2xl">Convex is not set up yet</h1>
          <p className="mt-4 text-[15px] leading-[1.8] text-muted">
            The dashboard needs a deployment before anyone can sign in. Run{" "}
            <code className="text-linen">npx convex dev</code>, then{" "}
            <code className="text-linen">npx @convex-dev/auth</code>, then add your address to{" "}
            <code className="text-linen">ADMIN_EMAILS</code> in the Convex settings.
          </p>
          <p className="mt-4 text-[14px] text-muted">
            The shop itself works meanwhile; it falls back on the seed catalogue.
          </p>
        </div>
      </div>
    );
  }

  if (me === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink text-[14px] text-muted">
        Checking access
      </div>
    );
  }

  // Signed in but not on the list. Authentication succeeded, authorization did not.
  if (!me.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink px-6">
        <div className="max-w-[420px]">
          <h1 className="font-display text-2xl">This account has no studio access</h1>
          <p className="mt-4 text-[15px] leading-[1.8] text-muted">
            {me.email ?? "You"} is signed in, but that address is not on the access list. Someone
            with dashboard access can add it to <code className="text-linen">ADMIN_EMAILS</code> in
            the Convex settings.
          </p>
          <button
            type="button"
            onClick={() => void signOut().then(() => router.push("/admin/login"))}
            className="mt-6 border border-linen/20 px-5 py-2.5 text-[13px] hover:border-linen/45"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink text-linen">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-linen/10 px-6 py-5 md:px-10">
        <div className="flex items-center gap-8">
          <Link href="/admin" className="font-display text-[20px] tracking-wordmark">
            {site.wordmark}
          </Link>
          <nav className="flex gap-6 text-[13px]">
            {nav.map((item) => {
              const active =
                item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? "text-linen" : "text-muted hover:text-linen"}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-5 text-[13px]">
          <ThemeToggle />
          <Link href="/" className="text-muted hover:text-linen">
            View shop
          </Link>
          <span className="hidden text-muted sm:inline">{me.email}</span>
          <button
            type="button"
            onClick={() => void signOut().then(() => router.push("/admin/login"))}
            className="text-muted hover:text-linen"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="px-6 py-10 md:px-10">{children}</main>
    </div>
  );
}
