'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type ProductType = {
  id: string
  name: string
}

export default function TypeManager() {
  const [types, setTypes] = useState<ProductType[]>([])
  const [newTypeName, setNewTypeName] = useState('')
  const [editing, setEditing] = useState<ProductType | null>(null)
  const [editingName, setEditingName] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    loadTypes()
  }, [])

  async function loadTypes() {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('product_types')
      .select('id,name')
      .order('name', { ascending: true })

    if (error) {
      setMessage(error.message)
      return
    }
    setTypes(data ?? [])
  }

  async function createType() {
    if (!newTypeName.trim()) return
    const supabase = createClient()
    const { error } = await supabase
      .from('product_types')
      .insert({ name: newTypeName.trim() })

    if (error) {
      setMessage(error.message)
      return
    }
    setNewTypeName('')
    setMessage(null)
    loadTypes()
  }

  async function saveEdit() {
    if (!editing || !editingName.trim()) return
    const supabase = createClient()
    const { error } = await supabase
      .from('product_types')
      .update({ name: editingName.trim() })
      .eq('id', editing.id)

    if (error) {
      setMessage(error.message)
      return
    }
    setEditing(null)
    setEditingName('')
    setMessage(null)
    loadTypes()
  }

  async function deleteType(typeToDelete: ProductType) {
    const supabase = createClient()
    const { data: linked, error: linkError } = await supabase
      .from('products')
      .select('id')
      .eq('product_type_id', typeToDelete.id)
      .limit(1)

    if (linkError) {
      setMessage(linkError.message)
      return
    }
    if (linked?.length) {
      setMessage(`Cannot delete "${typeToDelete.name}" because it is still used by products.`)
      return
    }

    const { error } = await supabase
      .from('product_types')
      .delete()
      .eq('id', typeToDelete.id)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage(null)
    loadTypes()
  }

  return (
    <div className="rounded-2xl bg-slate-950/80 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Product Types</h2>
          <p className="mt-2 text-sm text-slate-400">
            Rename or delete types, and create new ones for your products.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={newTypeName}
            onChange={(event) => setNewTypeName(event.target.value)}
            placeholder="New type name"
            className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-white outline-none"
          />
          <button
            type="button"
            onClick={createType}
            className="rounded-2xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Add type
          </button>
        </div>
      </div>

      {message ? (
        <div className="mb-4 rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {message}
        </div>
      ) : null}

      <div className="grid gap-4">
        {types.map((type) => (
          <div
            key={type.id}
            className="flex flex-col gap-3 rounded-3xl bg-slate-900 p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              {editing?.id === type.id ? (
                <input
                  value={editingName}
                  onChange={(event) => setEditingName(event.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none"
                />
              ) : (
                <p className="text-lg font-semibold text-white">{type.name}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {editing?.id === type.id ? (
                <>
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="rounded-2xl bg-white px-4 py-2 font-semibold text-slate-950 transition hover:bg-slate-200"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(null)
                      setEditingName('')
                      setMessage(null)
                    }}
                    className="rounded-2xl bg-slate-800 px-4 py-2 text-slate-300 transition hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(type)
                      setEditingName(type.name)
                      setMessage(null)
                    }}
                    className="rounded-2xl bg-slate-800 px-4 py-2 text-slate-300 transition hover:bg-slate-700"
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteType(type)}
                    className="rounded-2xl bg-red-500/10 px-4 py-2 text-red-200 transition hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
