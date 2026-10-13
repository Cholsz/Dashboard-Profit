
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { formatCurrency } from '../utils/formatCurrency'

function Cashflow({ sales, expenses, returns }) {
  const masuk = sales.reduce((sum, item) => sum + item.total, 0)
  const keluar = expenses.reduce((sum, item) => sum + item.amount, 0)
    + returns.reduce((sum, item) => sum + item.amount, 0)

  const rows = [
    ...sales.map((item) => ({
      id: `sale-${item.id}`,
      date: item.date,
      name: `Penjualan ${item.productName}`,
      amount: item.total,
      type: 'Masuk',
    })),
    ...expenses.map((item) => ({
      id: `expense-${item.id}`,
      date: item.date,
      name: item.name,
      amount: item.amount,
      type: 'Keluar',
    })),
    ...returns.map((item) => ({
      id: `return-${item.id}`,
      date: item.date,
      name: `Retur ${item.productName}`,
      amount: item.amount,
      type: 'Keluar',
    })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <PageHeader title="Arus Kas" description="Catatan uang masuk dan uang keluar." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Kas Masuk" value={masuk} money />
        <StatCard title="Kas Keluar" value={keluar} money />
        <StatCard title="Saldo Bersih" value={masuk - keluar} money />
      </div>

      <section className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[550px] text-left text-sm">
          <thead className="bg-slate-50"><tr><th className="p-4">Tanggal</th><th className="p-4">Keterangan</th><th className="p-4">Jenis</th><th className="p-4">Nominal</th></tr></thead>
          <tbody>
            {rows.map((item) => <tr key={item.id} className="border-t"><td className="p-4">{item.date}</td><td className="p-4">{item.name}</td><td className="p-4">{item.type}</td><td className="p-4">{formatCurrency(item.amount)}</td></tr>)}
            {!rows.length && <tr><td colSpan="4" className="p-6 text-center text-slate-500">Belum ada catatan arus kas.</td></tr>}
          </tbody>
        </table>
      </section>
    </>
  )
}

export default Cashflow
