
import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { formatCurrency } from '../utils/formatCurrency'

function Returns({ sales, returns, setReturns, setProducts }) {
  const [saleId, setSaleId] = useState('')
  const [qty, setQty] = useState(1)

  function saveReturn(event) {
    event.preventDefault()

    const sale = sales.find((item) => item.id === Number(saleId))
    const returned = returns
      .filter((item) => item.saleId === Number(saleId))
      .reduce((sum, item) => sum + item.qty, 0)

    if (!sale || qty < 1 || qty > sale.qty - returned) {
      alert('Jumlah retur tidak valid.')
      return
    }

    setReturns((old) => [{
      id: Date.now(),
      saleId: sale.id,
      productId: sale.productId,
      productName: sale.productName,
      qty: Number(qty),
      amount: sale.price * Number(qty),
      date: new Date().toISOString().slice(0, 10),
    }, ...old])

    setProducts((old) => old.map((item) =>
      item.id === sale.productId
        ? { ...item, stock: item.stock + Number(qty) }
        : item
    ))

    setSaleId('')
    setQty(1)
  }

  return (
    <>
      <PageHeader title="Retur" description="Catat barang yang dikembalikan pelanggan." />

      <form onSubmit={saveReturn} className="mb-6 grid gap-4 rounded-xl border bg-white p-5 sm:grid-cols-3">
        <select className="rounded-lg border p-2.5" value={saleId} onChange={(e) => setSaleId(e.target.value)} required>
          <option value="">Pilih transaksi</option>
          {sales.map((item) => <option key={item.id} value={item.id}>{item.id} - {item.productName}</option>)}
        </select>
        <input className="rounded-lg border p-2.5" type="number" min="1" value={qty} onChange={(e) => setQty(Number(e.target.value))} required />
        <button className="rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold">Simpan Retur</button>
      </form>

      <section className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50"><tr><th className="p-4">Tanggal</th><th className="p-4">Produk</th><th className="p-4">Jumlah</th><th className="p-4">Nilai retur</th></tr></thead>
          <tbody>
            {returns.map((item) => <tr key={item.id} className="border-t"><td className="p-4">{item.date}</td><td className="p-4">{item.productName}</td><td className="p-4">{item.qty}</td><td className="p-4">{formatCurrency(item.amount)}</td></tr>)}
            {!returns.length && <tr><td colSpan="4" className="p-6 text-center text-slate-500">Belum ada retur.</td></tr>}
          </tbody>
        </table>
      </section>
    </>
  )
}

export default Returns
