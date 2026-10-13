
import { formatCurrency } from '../utils/formatCurrency'

function StatCard({ title, value, money = false }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-3 break-words text-xl font-bold text-slate-800">
        {money ? formatCurrency(value) : value}
      </p>
    </div>
  )
}

export default StatCard
