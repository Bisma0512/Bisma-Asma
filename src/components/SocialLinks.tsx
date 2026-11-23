type Props = {
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  className?: string;
};

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SocialLinks({
  facebookUrl,
  instagramUrl,
  className = "",
}: Props) {
  if (!facebookUrl && !instagramUrl) return null;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {facebookUrl ? (
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="rounded-full border border-outline/60 p-2 text-espresso transition hover:border-primary hover:text-primary"
        >
          <FacebookIcon className="h-4 w-4" />
        </a>
      ) : null}
      {instagramUrl ? (
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="rounded-full border border-outline/60 p-2 text-espresso transition hover:border-primary hover:text-primary"
        >
          <InstagramIcon className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  );
}
