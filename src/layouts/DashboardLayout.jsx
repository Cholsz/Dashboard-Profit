
import Sidebar from '../components/Sidebar'

function DashboardLayout({ page, setPage, children }) {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <Sidebar page={page} setPage={setPage} />

      <main className="min-w-0 flex-1 p-5 sm:p-8">
        <header className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
          <h1 className="text-lg font-semibold text-slate-800">
            {page}
          </h1>
          <span className="text-sm text-slate-500">Owner Toko</span>
        </header>

        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
