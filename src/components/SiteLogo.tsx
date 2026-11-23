import Link from "next/link";
import Image from "next/image";

type Props = {
  storeName: string;
  logoUrl?: string | null;
  className?: string;
  href?: string;
};

export function SiteLogo({
  storeName,
  logoUrl,
  className = "",
  href = "/",
}: Props) {
  return (
    <Link href={href} className={`inline-flex items-center gap-2 ${className}`}>
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={storeName}
          width={140}
          height={40}
          className="h-9 w-auto object-contain"
          unoptimized
        />
      ) : (
        <span className="font-display text-xl tracking-tight text-espresso md:text-2xl">
          {storeName}
        </span>
      )}
    </Link>
  );
}
