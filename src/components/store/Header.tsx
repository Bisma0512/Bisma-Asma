import Link from "next/link";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { SiteLogo } from "@/components/SiteLogo";
import { formatPkr } from "@/lib/utils";
import { getCart, cartTotals } from "@/lib/cart";
import { getSession } from "@/lib/session";
import { PromoMarquee } from "@/components/store/PromoMarquee";
import { SignOutButton } from "@/components/auth/SignOutButton";

const NAV = [
  { href: "/shop/lips", label: "Lips" },
  { href: "/shop/cheeks", label: "Cheeks" },
  { href: "/shop/complexion", label: "Complexion" },
  { href: "/shop/eyes", label: "Eyes" },
  { href: "/shop/sets", label: "Sets" },
  { href: "/shop", label: "Shop All" },
];

type Props = {
  storeName: string;
  logoUrl?: string | null;
  banners?: { id: string; text: string }[];
};

export async function Header({ storeName, logoUrl, banners = [] }: Props) {
  const [cart, session] = await Promise.all([getCart(), getSession()]);
  const { count, total } = cartTotals(cart);
  const role = (session?.user as { role?: string } | undefined)?.role;

  return (
    <header className="sticky top-0 z-40 border-b border-outline/40 bg-background/90 backdrop-blur-md">
      <PromoMarquee banners={banners} />
      <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-4 md:px-8 lg:px-12">
        <SiteLogo storeName={storeName} logoUrl={logoUrl} />
        <nav className="ml-4 hidden items-center gap-5 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-espresso/80 transition hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <form action="/shop" className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe" />
            <input
              name="q"
              placeholder="Search lip oils, tints, bronzers…"
              className="w-48 rounded-full border border-outline bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary lg:w-64"
            />
          </form>
          <Link
            href={session ? (role === "ADMIN" ? "/admin" : "/account") : "/login"}
            className="rounded-full p-2 text-espresso hover:bg-surface-low"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>
          {session ? <SignOutButton variant="icon" label="Log out" /> : null}
          <Link
            href="/shop"
            className="hidden rounded-full p-2 text-espresso hover:bg-surface-low sm:inline-flex"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
          </Link>
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 rounded-full bg-espresso px-3 py-2 text-sm text-white transition hover:bg-primary"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">
              {count > 0 ? formatPkr(total) : "Bag"}
            </span>
            {count > 0 ? (
              <span className="rounded-full bg-primary-container px-1.5 text-xs text-espresso">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
      <nav className="flex gap-4 overflow-x-auto border-t border-outline/30 px-4 py-2 lg:hidden">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-espresso/70"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
