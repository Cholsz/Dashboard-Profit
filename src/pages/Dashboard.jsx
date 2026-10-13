
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'
import { formatCurrency } from '../utils/formatCurrency'

function Dashboard({ products, sales, expenses, returns }) {
  const omzet = sales.reduce((sum, item) => sum + item.total, 0)
  const hpp = sales.reduce((sum, item) => sum + item.cost * item.qty, 0)
  const nilaiRetur = returns.reduce((sum, item) => sum + item.amount, 0)
  const biaya = expenses.reduce((sum, item) => sum + item.amount, 0)
  const labaKotor = omzet - hpp - nilaiRetur
  const labaBersih = labaKotor - biaya

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan penjualan dan keuntungan toko."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Omzet" value={omzet} money />
        <StatCard title="Total HPP" value={hpp} money />
        <StatCard title="Laba Kotor" value={labaKotor} money />
        <StatCard title="Laba Bersih" value={labaBersih} money />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-semibold">Transaksi Terbaru</h3>

          {sales.length === 0 ? (
            <p className="text-sm text-slate-500">
              Belum ada transaksi penjualan.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="py-3">Produk</th>
                    <th className="py-3">Jumlah</th>
                    <th className="py-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.slice(0, 5).map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-3">{item.productName}</td>
                      <td className="py-3">{item.qty}</td>
                      <td className="py-3">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="mb-4 font-semibold">Stok Menipis</h3>

          {products.filter((item) => item.stock <= 6).length === 0 ? (
            <p className="text-sm text-slate-500">
              Tidak ada produk dengan stok menipis.
            </p>
          ) : (
            products
              .filter((item) => item.stock <= 6)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-3 border-b py-3 last:border-0"
                >
                  <span>{item.name}</span>
                  <span className="font-semibold text-amber-600">
                    {item.stock} unit
                  </span>
                </div>
              ))
          )}
        </section>
      </div>
    </>
  )
}

export default Dashboard
