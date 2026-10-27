const menus = [
  'Dashboard',
  'Nota Timbangan',
  'Penjualan Kopra',
  'Data Kopra',
  'Biaya Operasional',
  'Laporan Laba',
]

function Sidebar({ page, setPage }) {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-slate-900 p-5 text-white">
      <div className="mb-8 border-b border-slate-700 pb-5">
        <h1 className="text-xl font-bold">
          Manajemen<span className="text-emerald-400">.</span>
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Pengelolaan
        </p>
      </div>

      <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">
        Menu utama
      </p>

      <nav className="space-y-1">
        {menus.map((menu) => (
          <button
            key={menu}
            onClick={() => setPage(menu)}
            className={`w-full rounded-lg px-4 py-3 text-left text-sm ${
              page === menu
                ? 'bg-emerald-400 font-semibold text-slate-900'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {menu}
          </button>
        ))}
      </nav>

      <div className="mt-auto border-t border-slate-700 pt-5 text-sm text-slate-400">
        Dashboard Laba Kopra
      </div>
    </aside>
  )
}

export default Sidebar