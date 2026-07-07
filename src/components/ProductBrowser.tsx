'use client'

import { useMemo, useState } from 'react'

type Product = {
  id: string
  name: string
  description?: string
  price: number
  image_url: string | null
  tags: string[]
  type: string
  discount_price: number | null
  quantity: number
}

type Props = {
  products: Product[]
}

function normalizeTags(tags: string[] | string | null): string[] {
  if (!tags) return []
  
  // إذا كان مصفوفة، نرجعه مباشرة بعد تصفيته
  if (Array.isArray(tags)) return tags.filter(Boolean)
  
  // إذا وصلنا إلى هنا، فهذا يعني أن tags عبارة عن نص (string)
  // نقوم بتقسيمه إلى مصفوفة (بافتراض أنه مفصول بفاصلة أو مسافات)
  // أو إذا كان مجرد نص واحد، نضعه في مصفوفة
  return tags
    .split(',') // تقسيم النص إذا كان يحتوي على فواصل، يمكنك تغيير الفاصلة حسب حاجتك
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export default function ProductBrowser({ products }: Props) {
  const [selectedType, setSelectedType] = useState('All')
  const [selectedTag, setSelectedTag] = useState('All')
  const [search, setSearch] = useState('')

  const typeOptions = useMemo(() => {
    const types = new Set<string>()
    products.forEach((product) => {
      if (product.type) types.add(product.type)
    })
    return ['All', ...Array.from(types).sort()]
  }, [products])

  const tagOptions = useMemo(() => {
    const tags = new Set<string>()
    products.forEach((product) => {
      normalizeTags(product.tags).forEach((tag) => tags.add(tag))
    })
    return ['All', ...Array.from(tags).sort()]
  }, [products])

  const filteredProducts = useMemo(() => {
    const activeType = selectedType === 'All' ? null : selectedType
    const activeTag = selectedTag === 'All' ? null : selectedTag.toLowerCase()
    const query = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesType = activeType ? product.type === activeType : true
      const matchesTag = activeTag
        ? normalizeTags(product.tags).some(
            (tag) => tag.toLowerCase() === activeTag
          )
        : true
      const matchesSearch = query
        ? `${product.name} ${product.description ?? ''}`
            .toLowerCase()
            .includes(query)
        : true
      return matchesType && matchesTag && matchesSearch
    })
  }, [products, selectedType, selectedTag, search])

  return (
    <div className="rounded-2xl bg-neutral-950/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <label className="sr-only" htmlFor="product-search">
              Search products
            </label>
            <input
              id="product-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products"
              className="w-full rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-text-primary shadow-soft outline-none transition focus:border-neutral-600"
            />
          </div>

          <div className="min-w-[200px] rounded-2xl bg-neutral-900 p-3 shadow-soft">
            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-text-secondary">
              Filter by type
            </label>
            <select
              value={selectedType}
              onChange={(event) => setSelectedType(event.target.value)}
              className="w-full rounded-2xl bg-neutral-950 px-3 py-3 text-text-primary outline-none"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 overflow-x-auto pb-1">
          {tagOptions.map((tag) => {
            const active = tag === selectedTag
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  active
                    ? 'bg-neutral-200/10 text-neutral-100 shadow-soft'
                    : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-3xl bg-neutral-900 p-5 shadow-soft"
            >
              <div className="mb-4 h-52 overflow-hidden rounded-3xl bg-neutral-800">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-text-secondary">
                    No image
                  </div>
                )}
              </div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs uppercase tracking-[0.18em] text-text-secondary">
                  {product.type || 'Uncategorized'}
                </span>
                <span className="text-lg font-semibold text-text-primary">
                  {product.price.toFixed(2)} DA
                </span>
              </div>
              <h2 className="mb-3 text-xl font-semibold text-text-primary">
                {product.name}
              </h2>
              <p className="mb-4 text-sm leading-6 text-text-secondary">
                {product.description ?? ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {normalizeTags(product.tags).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-text-secondary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full rounded-3xl bg-neutral-900/80 p-8 text-center text-text-secondary">
            No products match this filter.
          </div>
        )}
      </div>
    </div>
  )
}
