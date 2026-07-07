"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Product, ProductFormData, Promotion, PromotionFormData } from "@/lib/types";
import AdminProductForm from "@/components/AdminProductForm";
import AdminPromotionForm from "@/components/AdminPromotionForm";
import TypeManager from "@/components/TypeManager";
import { formatPrice } from "@/lib/utils";

type Tab = "products" | "promotions";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showPromotionForm, setShowPromotionForm] = useState(false);

  const fetchProducts = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProducts((data ?? []) as Product[]);
  }, []);

  const fetchPromotions = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setPromotions((data ?? []) as Promotion[]);
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchPromotions()]);
      setLoading(false);
    }
    load();
  }, [fetchProducts, fetchPromotions]);

  async function handleSignOut() {
    await createClient().auth.signOut();
    window.location.href = "/admin/login";
  }

  async function saveProduct(data: ProductFormData) {
    const supabase = createClient();
    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update(data)
        .eq("id", editingProduct.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("products").insert(data);
      if (error) throw error;
    }
    setShowProductForm(false);
    setEditingProduct(null);
    await fetchProducts();
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    await fetchProducts();
  }

  async function savePromotion(data: PromotionFormData) {
    const supabase = createClient();
    if (editingPromotion) {
      const { error } = await supabase
        .from("promotions")
        .update(data)
        .eq("id", editingPromotion.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("promotions").insert(data);
      if (error) throw error;
    }
    setShowPromotionForm(false);
    setEditingPromotion(null);
    await fetchPromotions();
  }

  async function deletePromotion(id: string) {
    if (!confirm("Delete this promotion?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("promotions").delete().eq("id", id);
    if (error) {
      alert(error.message);
      return;
    }
    await fetchPromotions();
  }

  function openNewProduct() {
    setEditingProduct(null);
    setShowProductForm(true);
  }

  function openEditProduct(product: Product) {
    setEditingProduct(product);
    setShowProductForm(true);
  }

  function openNewPromotion() {
    setEditingPromotion(null);
    setShowPromotionForm(true);
  }

  function openEditPromotion(promotion: Promotion) {
    setEditingPromotion(promotion);
    setShowPromotionForm(true);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage products and promotional banners.
          </p>
        </div>
        <button type="button" onClick={handleSignOut} className="soft-button-secondary">
          Sign out
        </button>
      </div>

      <div className="flex gap-2 rounded-2xl bg-surface-muted p-1.5">
        {(["products", "promotions"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium capitalize transition-all duration-300 ${
              tab === t
                ? "bg-slate-700 text-text-primary shadow-sm"
                : "text-text-secondary hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="soft-card animate-pulse p-12 text-center text-text-muted">
          Loading…
        </div>
      ) : tab === "products" ? (
        <div className="space-y-6">
          {!showProductForm && (
            <button type="button" onClick={openNewProduct} className="soft-button">
              Add product
            </button>
          )}

          {showProductForm && (
            <AdminProductForm
              product={editingProduct}
              onSubmit={saveProduct}
              onCancel={() => {
                setShowProductForm(false);
                setEditingProduct(null);
              }}
            />
          )}

          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="soft-card p-10 text-center text-text-secondary">
                No products yet. Add your first product above.
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="soft-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-sm text-text-secondary">
                      {product.type} · {formatPrice(product.price)}
                      {product.discount_price != null &&
                        ` → ${formatPrice(product.discount_price)}`}
                      {" · "}
                      {product.quantity} in stock
                    </p>
                    {product.tags.length > 0 && (
                      <p className="mt-1 truncate text-xs text-text-muted">
                        {product.tags.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditProduct(product)}
                      className="soft-button-secondary px-4 py-2 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProduct(product.id)}
                      className="rounded-2xl border border-neutral-700 px-4 py-2 text-xs text-neutral-400 transition-all duration-300 hover:border-neutral-500 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {!showPromotionForm && (
            <button type="button" onClick={openNewPromotion} className="soft-button">
              Add promotion
            </button>
          )}

          {showPromotionForm && (
            <AdminPromotionForm
              promotion={editingPromotion}
              onSubmit={savePromotion}
              onCancel={() => {
                setShowPromotionForm(false);
                setEditingPromotion(null);
              }}
            />
          )}

          <div className="space-y-4">
            {promotions.length === 0 ? (
              <div className="soft-card p-10 text-center text-text-secondary">
                No promotions yet. Add a banner for the homepage.
              </div>
            ) : (
              promotions.map((promotion) => (
                <div key={promotion.id} className="soft-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">{promotion.title}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            promotion.active
                              ? "bg-slate-700 text-slate-100"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {promotion.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="mt-2 max-w-xl text-sm text-text-secondary">
                        {promotion.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEditPromotion(promotion)}
                        className="soft-button-secondary px-4 py-2 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePromotion(promotion.id)}
                        className="rounded-2xl border border-neutral-700 px-4 py-2 text-xs text-neutral-400 transition-all duration-300 hover:border-neutral-500 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-slate-950/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <TypeManager />
      </div>
    </div>
  );
}
