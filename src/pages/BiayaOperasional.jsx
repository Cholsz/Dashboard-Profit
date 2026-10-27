
import { useState } from 'react'
import PageHeader from '../components/PageHeader'

function BiayaOperasional({ biaya, setBiaya }) {
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [kategori, setKategori] = useState('Upah Buruh')
  const [jumlah, setJumlah] = useState('')
  const [keterangan, setKeterangan] = useState('')

  const formatRupiah = (nilai) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(nilai || 0)

  const totalBiaya = biaya.reduce(
    (total, item) => total + (Number(item.jumlah) || 0),
    0
  )

  function simpanBiaya(e) {
    e.preventDefault()

    if (!tanggal || Number(jumlah) <= 0) {
      alert('Tanggal dan jumlah biaya wajib diisi.')
      return
    }

    const biayaBaru = {
      id: Date.now(),
      tanggal,
      kategori,
      jumlah: Number(jumlah),
      keterangan: keterangan.trim(),
    }

    setBiaya([...biaya, biayaBaru])

    setJumlah('')
    setKeterangan('')
    alert('Biaya operasional berhasil disimpan.')
  }

  function hapusBiaya(id) {
    if (!window.confirm('Yakin ingin menghapus biaya ini?')) return

    setBiaya(biaya.filter((item) => item.id !== id))
  }

  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500'

  const kategoriBiaya = [
    'Upah Buruh',
    'Transportasi',
    'Bahan Bakar',
    'Bongkar Muat',
    'Sewa',
    'Perawatan',
    'Biaya Lainnya',
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Biaya Operasional"
        description="Catat pengeluaran operasional usaha kopra."
      />

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Tambah Biaya
        </h2>

        <form onSubmit={simpanBiaya} className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Tanggal
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className={inputClass}
                required
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Kategori Biaya
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className={inputClass}
              >
                {kategoriBiaya.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Jumlah (Rp)
              <input
                type="number"
                min="1"
                step="any"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                className={inputClass}
                placeholder="Contoh: 150000"
                required
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Keterangan
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className={inputClass}
                placeholder="Contoh: Upah bongkar kopra"
              />
            </label>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Simpan Biaya
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">Total Biaya Tercatat</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {formatRupiah(totalBiaya)}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Riwayat Biaya
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Keterangan</th>
                <th className="px-4 py-3">Jumlah</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {[...biaya]
                .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
                .map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">{item.tanggal}</td>
                    <td className="px-4 py-3">{item.kategori}</td>
                    <td className="px-4 py-3">
                      {item.keterangan || '-'}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatRupiah(item.jumlah)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => hapusBiaya(item.id)}
                        className="text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}

              {biaya.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Belum ada biaya operasional.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BiayaOperasional
