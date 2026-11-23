"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  name: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
};

export function ImageUploadField({
  name,
  label,
  defaultValue,
  required,
}: Props) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFileChange(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Upload failed");
      }
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{label}</label>
      <input type="hidden" name={name} value={url} required={required} />
      <div className="flex flex-wrap items-start gap-4">
        {url ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-outline bg-surface">
            <Image
              src={url}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-outline text-xs text-taupe">
            No image
          </div>
        )}
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            className="block w-full text-sm"
          />
          {uploading ? (
            <p className="text-xs text-taupe">Uploading…</p>
          ) : null}
          {error ? <p className="text-xs text-critical">{error}</p> : null}
          {url ? (
            <button
              type="button"
              className="text-xs font-semibold text-critical"
              onClick={() => setUrl("")}
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
