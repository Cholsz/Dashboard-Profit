
import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { formatCurrency } from '../utils/formatCurrency'

function Expenses({ expenses, setExpenses }) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  function saveExpense(event) {
    event.preventDefault()

    if (!name.trim() || Number(amount) <= 0) return

    setExpenses((old) => [{
      id: Date.now(),
      name: name.trim(),
      amount: Number(amount),
      date: new Date().toISOString().slice(0, 10),
    }, ...old])

    setName('')
    setAmount('')
  }

  return (
    <>
      <PageHeader title="Pengeluaran" description="Catat biaya operasional toko." />

      <form onSubmit={saveExpense} className="mb-6 grid gap-4 rounded-xl border bg-white p-5 sm:grid-cols-3">
        <input className="rounded-lg border p-2.5" placeholder="Contoh: Listrik toko" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="rounded-lg border p-2.5" type="number" min="1" placeholder="Nominal (Rp)" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <button className="rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold">Simpan Pengeluaran</button>
      </form>

      <section className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50"><tr><th className="p-4">Tanggal</th><th className="p-4">Keterangan</th><th className="p-4">Nominal</th></tr></thead>
          <tbody>
            {expenses.map((item) => <tr key={item.id} className="border-t"><td className="p-4">{item.date}</td><td className="p-4">{item.name}</td><td className="p-4">{formatCurrency(item.amount)}</td></tr>)}
            {!expenses.length && <tr><td colSpan="3" className="p-6 text-center text-slate-500">Belum ada pengeluaran.</td></tr>}
          </tbody>
        </table>
      </section>
    </>
  )
}

export default Expenses
