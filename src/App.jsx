
import { useEffect, useState } from 'react'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Sales from './pages/Sales'
import Inventory from './pages/Inventory'
import Expenses from './pages/Expenses'
import Returns from './pages/Returns'
import Reports from './pages/Reports'
import Cashflow from './pages/Cashflow'
import NotaTimbangan from './pages/NotaTimbangan'
import DataKopra from './pages/DataKopra'
import BiayaOperasional from './pages/BiayaOperasional'
import LaporanLaba from './pages/LaporanLaba'
import PenjualanKopra from './pages/PenjualanKopra'

const initialProducts = [
  { id: 1, name: 'Beras Premium 5 kg', category: 'Sembako', cost: 65000, price: 75000, stock: 25 },
  { id: 2, name: 'Minyak Goreng 2 L', category: 'Sembako', cost: 30000, price: 35000, stock: 4 },
  { id: 3, name: 'Gula Pasir 1 kg', category: 'Sembako', cost: 15000, price: 18000, stock: 6 },
]

function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [page, setPage] = useState('Dashboard')
  const [products, setProducts] = useState(() => loadData('salespro_products', initialProducts))
  const [sales, setSales] = useState(() => loadData('salespro_sales', []))
  const [expenses, setExpenses] = useState(() => loadData('salespro_expenses', []))
  const [returns, setReturns] = useState(() => loadData('salespro_returns', []))
  const [notas, setNotas] = useState(() => loadData('koprapro_notas', []))
  const [biaya, setBiaya] = useState(() => loadData('koprapro_biaya', []))
  const [penjualanKopra, setPenjualanKopra] = useState(() => loadData('koprapro_penjualan', []))

  useEffect(() => {
    localStorage.setItem('koprapro_notas', JSON.stringify(notas))
  }, [notas])
  useEffect(() => {
    localStorage.setItem('salespro_products', JSON.stringify(products))
  }, [products])

  useEffect(() => {
    localStorage.setItem('salespro_sales', JSON.stringify(sales))
  }, [sales])

  useEffect(() => {
    localStorage.setItem('salespro_expenses', JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem('salespro_returns', JSON.stringify(returns))
  }, [returns])
  useEffect(() => {
    localStorage.setItem('koprapro_biaya', JSON.stringify(biaya))
  }, [biaya])
  useEffect(() => {
    localStorage.setItem(
      'koprapro_penjualan',
      JSON.stringify(penjualanKopra)
    )
  }, [penjualanKopra])

  let content

  switch (page) {
    case 'Produk':
      content = <Products products={products} setProducts={setProducts} />
      break
    case 'Penjualan':
      content = <Sales products={products} setProducts={setProducts} sales={sales} setSales={setSales} />
      break
    case 'Persediaan':
      content = <Inventory products={products} />
      break
    case 'Pengeluaran':
      content = <Expenses expenses={expenses} setExpenses={setExpenses} />
      break
    case 'Retur':
      content = <Returns sales={sales} returns={returns} setReturns={setReturns} setProducts={setProducts} />
      break
    case 'Laporan':
      content = <Reports sales={sales} expenses={expenses} returns={returns} />
      break
    case 'Arus Kas':
      content = <Cashflow sales={sales} expenses={expenses} returns={returns} />
      break
    case 'Nota Timbangan':
      content = <NotaTimbangan notas={notas} setNotas={setNotas} />
      break
    case 'Data Kopra':
      content = <DataKopra notas={notas} setNotas={setNotas} />
      break
    case 'Biaya Operasional':
      content = (
        <BiayaOperasional biaya={biaya} setBiaya={setBiaya} />
      )
      break
    case 'Laporan Laba':
      content = (
        <LaporanLaba
          notas={notas}
          biaya={biaya}
          penjualan={penjualanKopra}
        />
      )
      break
    case 'Penjualan Kopra':
      content = (
        <PenjualanKopra
          penjualan={penjualanKopra}
          setPenjualan={setPenjualanKopra}
        />
      )
      break
    default:
      content = <Dashboard notas={notas} />
      }

  return (
    <DashboardLayout page={page} setPage={setPage}>
      {content}
    </DashboardLayout>
  )
}

export default App
