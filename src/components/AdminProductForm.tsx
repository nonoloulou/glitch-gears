"use client";

import { useRef, useState } from "react";
import type { Product, ProductFormData } from "@/lib/types";
import { uploadProductImage } from "@/lib/storage";
import { parseTagsInput, tagsToInput } from "@/lib/utils";

type AdminProductFormProps = {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
};

const emptyForm: ProductFormData = {
  name: "",
  type: "",
  price: 0,
  discount_price: null,
  quantity: 0,
  tags: [],
  image_url: null,
};

export default function AdminProductForm({
  product,
  onSubmit,
  onCancel,
}: AdminProductFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ProductFormData>(
    product
      ? {
          name: product.name,
          type: product.type,
          price: product.price,
          discount_price: product.discount_price,
          quantity: product.quantity,
          tags: product.tags,
          image_url: product.image_url,
        }
      : emptyForm
  );
  const [tagsInput, setTagsInput] = useState(
    product ? tagsToInput(product.tags) : ""
  );
  const [hasDiscount, setHasDiscount] = useState(
    product?.discount_price != null
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
      const url = await uploadProductImage(file);
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
      await onSubmit({
        ...form,
        tags: parseTagsInput(tagsInput),
        discount_price: hasDiscount ? form.discount_price : null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="soft-card space-y-6 p-6">
      <h3 className="text-lg font-medium text-white">
        {product ? "Edit product" : "Add product"}
      </h3>

      {error && (
        <div className="rounded-2xl border border-neutral-700 bg-neutral-900/80 px-4 py-3 text-sm text-neutral-300">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm text-text-secondary">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="soft-input"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-text-secondary">Type / Category</label>
          <input
            required
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="soft-input"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-text-secondary">Quantity</label>
          <input
            required
            type="number"
            min={0}
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: parseInt(e.target.value, 10) || 0 })
            }
            className="soft-input"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-text-secondary">Price ($)</label>
          <input
            required
            type="number"
            min={0}
            step="0.01"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: parseFloat(e.target.value) || 0 })
            }
            className="soft-input"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={hasDiscount}
              onChange={(e) => {
                setHasDiscount(e.target.checked);
                if (!e.target.checked) {
                  setForm({ ...form, discount_price: null });
                }
              }}
              className="rounded"
            />
            Discount price ($)
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            disabled={!hasDiscount}
            value={form.discount_price ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                discount_price: e.target.value
                  ? parseFloat(e.target.value)
                  : null,
              })
            }
            className="soft-input mt-2 disabled:opacity-40"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm text-text-secondary">
            Tags (comma-separated)
          </label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="wireless, audio, sale"
            className="soft-input"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm text-text-secondary">
            Product image
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
          {form.image_url && (
            <p className="mt-2 truncate text-xs text-text-muted">
              {form.image_url}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving || uploading} className="soft-button">
          {saving ? "Saving…" : product ? "Update product" : "Add product"}
        </button>
        <button type="button" onClick={onCancel} className="soft-button-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
