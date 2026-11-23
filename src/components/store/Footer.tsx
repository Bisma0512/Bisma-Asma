import Link from "next/link";
import { SiteLogo } from "@/components/SiteLogo";
import { SocialLinks } from "@/components/SocialLinks";

type Props = {
  storeName: string;
  logoUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
};

export function Footer({
  storeName,
  logoUrl,
  facebookUrl,
  instagramUrl,
}: Props) {
  return (
    <footer className="mt-16 border-t border-outline/50 bg-surface-low">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="space-y-4 md:col-span-1">
          <SiteLogo storeName={storeName} logoUrl={logoUrl} />
          <p className="text-sm leading-relaxed text-taupe">
            Pakistani makeup essentials crafted for luminous everyday beauty.
            Shop lips, cheeks, complexion and more — delivered COD across
            Pakistan.
          </p>
          <SocialLinks facebookUrl={facebookUrl} instagramUrl={instagramUrl} />
        </div>
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-espresso">
            Collections
          </h3>
          <ul className="space-y-2 text-sm text-taupe">
            <li>
              <Link href="/shop/lips">Lips</Link>
            </li>
            <li>
              <Link href="/shop/cheeks">Cheeks</Link>
            </li>
            <li>
              <Link href="/shop/complexion">Complexion</Link>
            </li>
            <li>
              <Link href="/shop/eyes">Eyes</Link>
            </li>
            <li>
              <Link href="/shop/sets">Sets</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-espresso">
            Client Care
          </h3>
          <ul className="space-y-2 text-sm text-taupe">
            <li>
              <Link href="/track">Track Order</Link>
            </li>
            <li>
              <Link href="/account">My Account</Link>
            </li>
            <li>
              <Link href="/cart">Bag</Link>
            </li>
            <li>
              <Link href="/checkout">Checkout (COD)</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-espresso">
            Atelier Ethos
          </h3>
          <ul className="space-y-2 text-sm text-taupe">
            <li>100% Vegan formulas</li>
            <li>Clean beauty standards</li>
            <li>Cash on Delivery</li>
            <li>Nationwide Pakistan shipping</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-outline/40 px-4 py-4 text-center text-xs text-taupe">
        © {new Date().getFullYear()} {storeName}. All rights reserved.
      </div>
    </footer>
  );
}
