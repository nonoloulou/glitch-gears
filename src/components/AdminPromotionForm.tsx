"use client";

import { useRef, useState } from "react";
import type { Promotion, PromotionFormData } from "@/lib/types";
import { uploadPromotionImage } from "@/lib/storage";

type AdminPromotionFormProps = {
  promotion?: Promotion | null;
  onSubmit: (data: PromotionFormData) => Promise<void>;
  onCancel: () => void;
};

const emptyForm: PromotionFormData = {
  title: "",
  description: "",
  image_url: null,
  active: true,
};

export default function AdminPromotionForm({
  promotion,
  onSubmit,
  onCancel,
}: AdminPromotionFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<PromotionFormData>(
    promotion
      ? {
          title: promotion.title,
          description: promotion.description,
          image_url: promotion.image_url,
          active: promotion.active,
        }
      : emptyForm
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const url = await uploadPromotionImage(file);
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await onSubmit(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="soft-card space-y-6 p-6">
      <h3 className="text-lg font-medium text-white">
        {promotion ? "Edit promotion" : "Add promotion"}
      </h3>

      {error && (
        <div className="rounded-2xl border border-neutral-700 bg-neutral-900/80 px-4 py-3 text-sm text-neutral-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-text-secondary">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="soft-input"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-text-secondary">
            Description
          </label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="soft-input resize-none"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-text-secondary">
            Banner image
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="soft-input file:mr-4 file:rounded-xl file:border-0 file:bg-neutral-700 file:px-4 file:py-2 file:text-sm file:text-white"
          />
          {uploading && (
            <p className="mt-2 text-sm text-text-muted">Uploading…</p>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="rounded"
          />
          Show on homepage (active)
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving || uploading} className="soft-button">
          {saving ? "Saving…" : promotion ? "Update promotion" : "Add promotion"}
        </button>
        <button type="button" onClick={onCancel} className="soft-button-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
