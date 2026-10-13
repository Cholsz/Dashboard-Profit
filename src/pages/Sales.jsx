
import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { formatCurrency } from '../utils/formatCurrency'

function Sales({ products, setProducts, sales, setSales }) {
  const [productId, setProductId] = useState('')
  const [qty, setQty] = useState(1)

  function saveSale(event) {
    event.preventDefault()

    const product = products.find((item) => item.id === Number(productId))
    if (!product || qty < 1 || qty > product.stock) {
      alert('Stok tidak mencukupi.')
      return
    }

    const sale = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      qty: Number(qty),
      price: product.price,
      cost: product.cost,
      total: product.price * Number(qty),
      date: new Date().toISOString().slice(0, 10),
    }

    setSales((old) => [sale, ...old])
    setProducts((old) =>
      old.map((item) =>
        item.id === product.id
          ? { ...item, stock: item.stock - Number(qty) }
          : item
      )
    )

    setQty(1)
    setProductId('')
    alert('Transaksi berhasil dicatat.')
  }

  return (
    <>
      <PageHeader title="Penjualan" description="Catat transaksi penjualan toko." />

      <form onSubmit={saveSale} className="mb-6 grid gap-4 rounded-xl border bg-white p-5 sm:grid-cols-3">
        <label className="text-sm">
          Produk
          <select
            className="mt-1 w-full rounded-lg border p-2.5"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          >
            <option value="">Pilih produk</option>
            {products.filter((item) => item.stock > 0).map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — stok {item.stock}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          Jumlah
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border p-2.5"
            required
          />
        </label>

        <button className="self-end rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold">
          Simpan Transaksi
        </button>
      </form>

      <section className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Produk</th>
              <th className="p-4">Jumlah</th>
              <th className="p-4">Total</th>
              <th className="p-4">HPP</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.date}</td>
                <td className="p-4">{item.productName}</td>
                <td className="p-4">{item.qty}</td>
                <td className="p-4">{formatCurrency(item.total)}</td>
                <td className="p-4">{formatCurrency(item.cost * item.qty)}</td>
              </tr>
            ))}
            {!sales.length && (
              <tr><td colSpan="5" className="p-6 text-center text-slate-500">Belum ada transaksi.</td></tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  )
}

export default Sales
