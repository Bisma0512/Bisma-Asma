import { getSiteSettings } from "@/lib/site";
import { updateSiteSettings } from "@/app/actions/admin";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export default async function AdminSettingsPage() {
  const site = await getSiteSettings();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl text-espresso">Site settings</h1>
        <p className="mt-1 text-taupe">
          Logo upload, store title, Facebook & Instagram links
        </p>
      </div>
      <form
        action={updateSiteSettings}
        className="space-y-4 rounded-2xl border border-outline/40 bg-white p-6"
      >
        <div>
          <label className="text-sm font-semibold">Store name</label>
          <input
            name="storeName"
            defaultValue={site.storeName}
            className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
          />
        </div>
        <ImageUploadField
          name="logoUrl"
          label="Logo image (upload)"
          defaultValue={site.logoUrl}
        />
        <div>
          <label className="text-sm font-semibold">Facebook URL</label>
          <input
            name="facebookUrl"
            defaultValue={site.facebookUrl ?? ""}
            className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">Instagram URL</label>
          <input
            name="instagramUrl"
            defaultValue={site.instagramUrl ?? ""}
            className="mt-1 w-full rounded-xl border border-outline px-3 py-2.5"
          />
        </div>
        <button className="rounded-full bg-espresso px-5 py-2.5 text-sm font-semibold text-white">
          Save settings
        </button>
      </form>
    </div>
  );
}
