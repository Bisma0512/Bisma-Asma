import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Settings,
  UserCircle,
  ExternalLink,
  Megaphone,
  Images,
  Users,
  Network,
} from "lucide-react";
import { SiteLogo } from "@/components/SiteLogo";
import { SocialLinks } from "@/components/SocialLinks";
import { SignOutButton } from "@/components/auth/SignOutButton";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/banners", label: "Banners", icon: Megaphone },
  { href: "/admin/slides", label: "Slides", icon: Images },
  { href: "/admin/dom-tree", label: "DOM Tree", icon: Network },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/profile", label: "Profile", icon: UserCircle },
];

type Props = {
  children: React.ReactNode;
  storeName: string;
  logoUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  user: { name: string; email: string; image?: string | null };
  pathname?: string;
};

export function AdminShell({
  children,
  storeName,
  logoUrl,
  facebookUrl,
  instagramUrl,
  user,
}: Props) {
  return (
    <div className="min-h-screen bg-surface-low md:grid md:grid-cols-[260px_1fr]">
      <aside className="border-b border-outline/40 bg-white md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex h-full flex-col p-5">
          <SiteLogo storeName={storeName} logoUrl={logoUrl} href="/admin" />
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-taupe">
            Operations Console
          </p>
          <nav className="mt-8 space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-espresso/80 transition hover:bg-champagne hover:text-espresso"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-4 pt-8">
            <SocialLinks
              facebookUrl={facebookUrl}
              instagramUrl={instagramUrl}
            />
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              View Live Storefront <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <SignOutButton variant="sidebar" label="Log out" />
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-outline/40 bg-white/80 px-4 py-4 backdrop-blur md:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-success">
              Store Status · Live
            </p>
            <p className="text-sm text-taupe">{storeName}</p>
          </div>
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 rounded-full border border-outline/50 bg-surface px-2 py-1.5 pr-4"
          >
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-champagne text-sm font-bold text-primary">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold text-espresso">
                {user.name}
              </span>
              <span className="block text-xs text-taupe">{user.email}</span>
            </span>
          </Link>
        </header>
        <div className="flex-1 px-4 py-8 md:px-8">{children}</div>
      </div>
    </div>
  );
}
