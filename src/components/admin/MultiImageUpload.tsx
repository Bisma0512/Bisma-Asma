"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  name: string;
  label: string;
  defaultUrls?: string[];
};

export function MultiImageUpload({ name, label, defaultUrls = [] }: Props) {
  const [urls, setUrls] = useState<string[]>(defaultUrls);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const next = [...urls];
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
        next.push(data.url);
      }
      setUrls(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{label}</label>
      <input type="hidden" name={name} value={urls.join("\n")} />
      <div className="flex flex-wrap gap-3">
        {urls.map((url) => (
          <div key={url} className="relative h-20 w-20 overflow-hidden rounded-lg border border-outline">
            <Image src={url} alt="" fill className="object-cover" unoptimized />
            <button
              type="button"
              className="absolute right-1 top-1 rounded bg-white/90 px-1 text-[10px] font-bold text-critical"
              onClick={() => setUrls((list) => list.filter((u) => u !== url))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input
        type="file"
        accept="image/*"
        multiple
        disabled={uploading}
        onChange={(e) => onFiles(e.target.files)}
        className="block w-full text-sm"
      />
      {uploading ? <p className="text-xs text-taupe">Uploading…</p> : null}
      {error ? <p className="text-xs text-critical">{error}</p> : null}
    </div>
  );
}
