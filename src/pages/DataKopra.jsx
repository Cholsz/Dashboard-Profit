
import { useState } from 'react'
import PageHeader from '../components/PageHeader'

function DataKopra({ notas, setNotas }) {
  const [kataKunci, setKataKunci] = useState('')
  const [notaDipilih, setNotaDipilih] = useState(null)

  function rupiah(nilai) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(nilai || 0)
  }

  function hapusNota(id) {
    const yakin = window.confirm('Yakin ingin menghapus nota ini?')

    if (!yakin) return

    setNotas(notas.filter((nota) => nota.id !== id))

    if (notaDipilih?.id === id) {
      setNotaDipilih(null)
    }
  }

  const dataNota = notas.filter((nota) => {
    const tanggal = nota.tanggal || ''
    const id = String(nota.id)
    const kata = kataKunci.toLowerCase()

    return tanggal.includes(kata) || id.includes(kata)
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Kopra"
        description="Daftar nota timbangan yang telah disimpan."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Riwayat Nota
            </h2>
            <p className="text-sm text-slate-500">
              {dataNota.length} nota ditemukan
            </p>
          </div>

          <input
            type="text"
            value={kataKunci}
            onChange={(e) => setKataKunci(e.target.value)}
            placeholder="Cari tanggal atau ID nota..."
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500"
          />
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">ID Nota</th>
                <th className="px-4 py-3">Bruto</th>
                <th className="px-4 py-3">Netto</th>
                <th className="px-4 py-3">Nilai Kopra</th>
                <th className="px-4 py-3">Sisa Pembayaran</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {dataNota.map((nota) => (
                <tr key={nota.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{nota.tanggal}</td>
                  <td className="px-4 py-3">{nota.id}</td>
                  <td className="px-4 py-3">
                    {(nota.bruto || 0).toLocaleString('id-ID')} kg
                  </td>
                  <td className="px-4 py-3">
                    {(nota.netto || 0).toLocaleString('id-ID')} kg
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {rupiah(nota.totalNilai)}
                  </td>
                  <td className="px-4 py-3 font-medium text-emerald-700">
                    {rupiah(nota.sisaPembayaran)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setNotaDipilih(nota)}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        Detail
                      </button>

                      <button
                        onClick={() => hapusNota(nota.id)}
                        className="font-medium text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {dataNota.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-10 text-center text-slate-500"
                  >
                    Belum ada nota yang tersimpan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {notaDipilih && (
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Detail Nota Timbangan
              </h2>
              <p className="text-sm text-slate-500">
                Tanggal: {notaDipilih.tanggal}
              </p>
            </div>

            <button
              onClick={() => setNotaDipilih(null)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
            >
              Tutup
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Bruto</p>
              <p className="mt-1 font-semibold">
                {notaDipilih.bruto} kg
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Tarra</p>
              <p className="mt-1 font-semibold">
                {notaDipilih.tarra} kg
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Potongan Berat</p>
              <p className="mt-1 font-semibold">
                {(notaDipilih.beratPotongan || 0).toLocaleString('id-ID')} kg
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">Netto</p>
              <p className="mt-1 font-semibold text-emerald-700">
                {notaDipilih.netto} kg
              </p>
            </div>
          </div>

          <h3 className="mt-6 font-semibold text-slate-800">
            Rincian Harga
          </h3>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-3">Jenis Kopra</th>
                  <th className="px-3 py-3">Berat</th>
                  <th className="px-3 py-3">Harga/kg</th>
                  <th className="px-3 py-3">Total</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {(notaDipilih.barisHarga || []).map((baris) => (
                  <tr key={baris.id}>
                    <td className="px-3 py-3">{baris.jenis}</td>
                    <td className="px-3 py-3">{baris.berat} kg</td>
                    <td className="px-3 py-3">{rupiah(baris.harga)}</td>
                    <td className="px-3 py-3">{rupiah(baris.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-6 font-semibold text-slate-800">
            Biaya dan Pembayaran
          </h3>

          <div className="mt-3 space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span>Upah Buruh</span>
              <span>{rupiah(notaDipilih.upahBuruh)}</span>
            </div>

            <div className="flex justify-between gap-3">
              <span>Panjar Sopir</span>
              <span>{rupiah(notaDipilih.panjarSopir)}</span>
            </div>

            <div className="flex justify-between gap-3">
              <span>Biaya Lainnya</span>
              <span>{rupiah(notaDipilih.biayaLain)}</span>
            </div>

            <div className="flex justify-between gap-3 border-t pt-3">
              <span>Total Nilai Kopra</span>
              <span className="font-semibold">
                {rupiah(notaDipilih.totalNilai)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span>Total Biaya / Panjar</span>
              <span>{rupiah(notaDipilih.totalBiaya)}</span>
            </div>

            <div className="flex justify-between gap-3 rounded-lg bg-emerald-50 p-4 text-base">
              <span className="font-semibold text-emerald-800">
                Sisa Pembayaran
              </span>
              <span className="font-bold text-emerald-800">
                {rupiah(notaDipilih.sisaPembayaran)}
              </span>
            </div>

            {notaDipilih.catatan && (
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="font-medium">Catatan</p>
                <p className="mt-1 text-slate-600">
                  {notaDipilih.catatan}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default DataKopra
