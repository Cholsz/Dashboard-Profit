
import { useState } from 'react'
import PageHeader from '../components/PageHeader'

function PenjualanKopra({ penjualan, setPenjualan }) {
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [berat, setBerat] = useState('')
  const [harga, setHarga] = useState('')
  const [biaya, setBiaya] = useState('')
  const [keterangan, setKeterangan] = useState('')

  const rupiah = (nilai) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(nilai || 0)

  const totalPenjualan = (Number(berat) || 0) * (Number(harga) || 0)
  const totalBersih = totalPenjualan - (Number(biaya) || 0)

  function simpanPenjualan(e) {
    e.preventDefault()

    if (!tanggal || Number(berat) <= 0 || Number(harga) <= 0) {
      alert('Tanggal, berat, dan harga jual wajib diisi.')
      return
    }

    if (Number(biaya) < 0 || Number(biaya) > totalPenjualan) {
      alert('Biaya penjualan tidak boleh negatif atau melebihi nilai penjualan.')
      return
    }

    const dataBaru = {
      id: Date.now(),
      tanggal,
      berat: Number(berat),
      harga: Number(harga),
      biaya: Number(biaya) || 0,
      totalPenjualan,
      totalBersih,
      keterangan: keterangan.trim(),
    }

    setPenjualan([...penjualan, dataBaru])

    setBerat('')
    setHarga('')
    setBiaya('')
    setKeterangan('')

    alert('Penjualan kopra berhasil disimpan.')
  }

  function hapusPenjualan(id) {
    if (!window.confirm('Yakin ingin menghapus penjualan ini?')) return

    setPenjualan(penjualan.filter((item) => item.id !== id))
  }

  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500'

  const totalTercatat = penjualan.reduce(
    (total, item) => total + (Number(item.totalPenjualan) || 0),
    0
  )

  const totalBiaya = penjualan.reduce(
    (total, item) => total + (Number(item.biaya) || 0),
    0
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Penjualan Kopra"
        description="Catat hasil penjualan kopra dan biaya penjualannya."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Input Penjualan
        </h2>

        <form onSubmit={simpanPenjualan} className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Tanggal Penjualan
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className={inputClass}
                required
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Berat Terjual (kg)
              <input
                type="number"
                min="0.01"
                step="any"
                value={berat}
                onChange={(e) => setBerat(e.target.value)}
                className={inputClass}
                placeholder="Contoh: 900"
                required
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Harga Jual per kg (Rp)
              <input
                type="number"
                min="0.01"
                step="any"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                className={inputClass}
                placeholder="Contoh: 12000"
                required
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Biaya Penjualan (Rp)
              <input
                type="number"
                min="0"
                step="any"
                value={biaya}
                onChange={(e) => setBiaya(e.target.value)}
                className={inputClass}
                placeholder="Contoh: 100000"
              />
            </label>

            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Keterangan
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className={inputClass}
                placeholder="Contoh: Penjualan kopra periode Oktober"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Total Penjualan</p>
              <p className="mt-1 text-xl font-bold text-slate-900">
                {rupiah(totalPenjualan)}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">
                Setelah Biaya Penjualan
              </p>
              <p className="mt-1 text-xl font-bold text-emerald-700">
                {rupiah(totalBersih)}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Simpan Penjualan
          </button>
        </form>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Penjualan</p>
          <p className="mt-2 text-2xl font-bold">{rupiah(totalTercatat)}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Biaya Penjualan</p>
          <p className="mt-2 text-2xl font-bold">{rupiah(totalBiaya)}</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Riwayat Penjualan
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Berat</th>
                <th className="px-4 py-3">Harga/kg</th>
                <th className="px-4 py-3">Total Penjualan</th>
                <th className="px-4 py-3">Biaya</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {[...penjualan]
                .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
                .map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{item.tanggal}</td>
                    <td className="px-4 py-3">{item.berat} kg</td>
                    <td className="px-4 py-3">{rupiah(item.harga)}</td>
                    <td className="px-4 py-3 font-medium">
                      {rupiah(item.totalPenjualan)}
                    </td>
                    <td className="px-4 py-3">{rupiah(item.biaya)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => hapusPenjualan(item.id)}
                        className="text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}

              {penjualan.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Belum ada penjualan kopra.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default PenjualanKopra

