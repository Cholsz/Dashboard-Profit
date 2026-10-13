
import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { formatCurrency } from '../utils/formatCurrency'

const emptyForm = {
  name: '',
  category: '',
  cost: '',
  price: '',
  stock: '',
}

function Products({ products, setProducts }) {
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)

  function saveProduct(event) {
    event.preventDefault()

    const product = {
      id: editingId ?? Date.now(),
      name: form.name.trim(),
      category: form.category.trim(),
      cost: Number(form.cost),
      price: Number(form.price),
      stock: Number(form.stock),
    }

    if (!product.name || product.price < 0 || product.cost < 0 || product.stock < 0) {
      return
    }

    if (editingId) {
      setProducts((old) =>
        old.map((item) => item.id === editingId ? product : item)
      )
    } else {
      setProducts((old) => [...old, product])
    }

    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  function editProduct(product) {
    setForm({
      name: product.name,
      category: product.category,
      cost: String(product.cost),
      price: String(product.price),
      stock: String(product.stock),
    })
    setEditingId(product.id)
    setShowForm(true)
  }

  function deleteProduct(product) {
    if (!window.confirm(`Hapus ${product.name}?`)) return

    setProducts((old) => old.filter((item) => item.id !== product.id))
  }

  const filtered = products.filter((item) =>
    `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <PageHeader
        title="Produk"
        description="Kelola daftar produk, harga, dan stok toko."
        action={
          <button
            onClick={() => {
              setForm(emptyForm)
              setEditingId(null)
              setShowForm(!showForm)
            }}
            className="rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            + Tambah Produk
          </button>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard title="Jenis Produk" value={products.length} />
        <StatCard
          title="Total Stok"
          value={products.reduce((sum, item) => sum + item.stock, 0)}
        />
        <StatCard
          title="Stok Menipis"
          value={products.filter((item) => item.stock <= 6).length}
        />
      </div>

      {showForm && (
        <form
          onSubmit={saveProduct}
          className="mb-6 grid gap-4 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2"
        >
          <label className="text-sm">
            Nama produk
            <input
              className="mt-1 w-full rounded-lg border p-2.5"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </label>

          <label className="text-sm">
            Kategori
            <input
              className="mt-1 w-full rounded-lg border p-2.5"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            />
          </label>

          <label className="text-sm">
            Harga modal
            <input
              type="number"
              min="0"
              className="mt-1 w-full rounded-lg border p-2.5"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              required
            />
          </label>

          <label className="text-sm">
            Harga jual
            <input
              type="number"
              min="0"
              className="mt-1 w-full rounded-lg border p-2.5"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </label>

          <label className="text-sm">
            Stok
            <input
              type="number"
              min="0"
              className="mt-1 w-full rounded-lg border p-2.5"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
            />
          </label>

          <div className="flex items-end gap-2">
            <button className="rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold">
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border px-4 py-2.5"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="p-5">
          <input
            placeholder="Cari nama produk atau kategori..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border p-2.5 sm:max-w-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4">Nama</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Modal</th>
                <th className="p-4">Jual</th>
                <th className="p-4">Stok</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-4 font-medium">{item.name}</td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">{formatCurrency(item.cost)}</td>
                  <td className="p-4">{formatCurrency(item.price)}</td>
                  <td className="p-4">{item.stock}</td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => editProduct(item)} className="text-blue-600">Edit</button>
                      <button onClick={() => deleteProduct(item)} className="text-red-600">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-500">
                    Produk tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default Products
