
import PageHeader from '../components/PageHeader'
import { formatCurrency } from '../utils/formatCurrency'

function Inventory({ products }) {
  return (
    <>
      <PageHeader title="Persediaan" description="Pantau jumlah stok dan nilai modal barang." />

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full min-w-[550px] text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">Produk</th>
              <th className="p-4">Stok</th>
              <th className="p-4">Modal per unit</th>
              <th className="p-4">Nilai persediaan</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4">{item.stock}</td>
                <td className="p-4">{formatCurrency(item.cost)}</td>
                <td className="p-4">{formatCurrency(item.stock * item.cost)}</td>
                <td className="p-4">
                  <span className={item.stock <= 6 ? 'text-amber-600' : 'text-emerald-600'}>
                    {item.stock <= 6 ? 'Stok menipis' : 'Tersedia'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Inventory
