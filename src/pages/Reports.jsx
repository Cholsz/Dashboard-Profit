
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

function Reports({ sales, expenses, returns }) {
  const omzet = sales.reduce((sum, item) => sum + item.total, 0)
  const hpp = sales.reduce((sum, item) => sum + item.cost * item.qty, 0)
  const nilaiRetur = returns.reduce((sum, item) => sum + item.amount, 0)
  const biaya = expenses.reduce((sum, item) => sum + item.amount, 0)

  function exportCsv() {
    const rows = [
      ['Tanggal', 'Produk', 'Jumlah', 'Omzet', 'HPP'],
      ...sales.map((item) => [
        item.date, item.productName, item.qty, item.total, item.cost * item.qty,
      ]),
    ]

    const csv = rows.map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')
    ).join('\r\n')

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'laporan-penjualan.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <PageHeader
        title="Laporan"
        description="Ringkasan penjualan dan keuntungan toko."
        action={<button onClick={exportCsv} className="rounded-lg bg-emerald-500 px-4 py-2.5 font-semibold">Unduh CSV</button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Omzet" value={omzet} money />
        <StatCard title="HPP" value={hpp} money />
        <StatCard title="Retur" value={nilaiRetur} money />
        <StatCard title="Pengeluaran" value={biaya} money />
      </div>

      <p className="mt-5 rounded-xl border bg-white p-5 text-sm text-slate-600">
        Estimasi laba setelah HPP, retur, dan pengeluaran: {' '}
        <strong>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(omzet - hpp - nilaiRetur - biaya)}</strong>
      </p>
    </>
  )
}

export default Reports
