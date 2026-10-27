
import { useState } from 'react'
import PageHeader from '../components/PageHeader'

function LaporanLaba({ notas = [], biaya = [], penjualan = [] }) {
  const hariIni = new Date().toLocaleDateString('en-CA')

  const [tanggalMulai, setTanggalMulai] = useState(
    `${hariIni.slice(0, 7)}-01`
  )
  const [tanggalAkhir, setTanggalAkhir] = useState(hariIni)

  const rupiah = (nilai) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(nilai || 0)

  const notaTerpilih = notas.filter(
    (nota) =>
      nota.tanggal >= tanggalMulai &&
      nota.tanggal <= tanggalAkhir
  )

  const biayaTerpilih = biaya.filter(
    (item) =>
      item.tanggal >= tanggalMulai &&
      item.tanggal <= tanggalAkhir
  )

  const totalNetto = notaTerpilih.reduce(
    (total, nota) => total + (Number(nota.netto) || 0),
    0
  )

  const totalNilaiKopra = notaTerpilih.reduce(
    (total, nota) => total + (Number(nota.totalNilai) || 0),
    0
  )

  const penjualanTerpilih = penjualan.filter(
  (item) =>
    item.tanggal >= tanggalMulai &&
    item.tanggal <= tanggalAkhir
    )

    const totalPendapatan = penjualanTerpilih.reduce(
    (total, item) => total + (Number(item.totalPenjualan) || 0),
    0
    )

    const totalBiayaPenjualan = penjualanTerpilih.reduce(
    (total, item) => total + (Number(item.biaya) || 0),
    0
    )

    const pendapatanSetelahBiayaPenjualan =
    totalPendapatan - totalBiayaPenjualan

  const totalBiayaNota = notaTerpilih.reduce(
    (total, nota) =>
      total +
      (Number(nota.upahBuruh) || 0) +
      (Number(nota.biayaLain) || 0),
    0
  )

  const totalPanjar = notaTerpilih.reduce(
    (total, nota) => total + (Number(nota.panjarSopir) || 0),
    0
  )

  const totalBiayaTambahan = biayaTerpilih.reduce(
    (total, item) => total + (Number(item.jumlah) || 0),
    0
  )

  const totalPengeluaranTercatat =
    totalBiayaNota + totalBiayaTambahan

  const kartu = [
    {
      judul: 'Jumlah Nota',
      nilai: notaTerpilih.length.toLocaleString('id-ID'),
      keterangan: 'Transaksi dalam periode',
    },
    {
      judul: 'Total Netto',
      nilai: `${totalNetto.toLocaleString('id-ID', {
        maximumFractionDigits: 2,
      })} kg`,
      keterangan: 'Berat bersih tercatat',
    },
    {
      judul: 'Nilai Kopra',
      nilai: rupiah(totalNilaiKopra),
      keterangan: 'Nilai dari seluruh nota',
    },
    {
      judul: 'Biaya Operasional',
      nilai: rupiah(totalPengeluaranTercatat),
      keterangan: 'Biaya nota dan biaya tambahan',
    },
  ]

  function unduhCSV() {
    const baris = [
      ['Tanggal', 'ID Nota', 'Netto (kg)', 'Nilai Kopra (Rp)', 'Biaya Nota (Rp)', 'Panjar Sopir (Rp)', 'Sisa Pembayaran (Rp)'],
      ...notaTerpilih.map((nota) => [
        nota.tanggal,
        nota.id,
        nota.netto,
        nota.totalNilai,
        (Number(nota.upahBuruh) || 0) +
          (Number(nota.biayaLain) || 0),
        nota.panjarSopir || 0,
        nota.sisaPembayaran,
      ]),
    ]

    const csv = baris
      .map((barisData) =>
        barisData
          .map((nilai) => `"${String(nilai ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\r\n')

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `laporan-kopra-${tanggalMulai}-${tanggalAkhir}.csv`
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan Laba"
        description="Ringkasan nilai kopra dan pengeluaran berdasarkan periode."
      />

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-800">
          Filter Periode
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            Dari Tanggal
            <input
              type="date"
              value={tanggalMulai}
              max={tanggalAkhir}
              onChange={(e) => setTanggalMulai(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>

          <label className="text-sm font-medium text-slate-700">
            Sampai Tanggal
            <input
              type="date"
              value={tanggalAkhir}
              min={tanggalMulai}
              onChange={(e) => setTanggalAkhir(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
        </div>

        <button
          onClick={unduhCSV}
          className="mt-4 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Unduh Laporan CSV
        </button>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kartu.map((item) => (
          <div
            key={item.judul}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">{item.judul}</p>
            <p className="mt-3 break-words text-xl font-bold text-slate-900">
              {item.nilai}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {item.keterangan}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Rincian Keuangan
        </h2>

        <div className="mt-4 space-y-4">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-600">Total Nilai Kopra</span>
            <span className="font-medium">{rupiah(totalNilaiKopra)}</span>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-600">Pendapatan Penjualan</span>
            <span className="font-medium">
                {rupiah(totalPendapatan)}
            </span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-600">Biaya Penjualan</span>
            <span>{rupiah(totalBiayaPenjualan)}</span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-600">Pendapatan Setelah Biaya Penjualan</span>
            <span className="font-medium">
                {rupiah(pendapatanSetelahBiayaPenjualan)}
            </span>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-600">Biaya pada Nota</span>
            <span>{rupiah(totalBiayaNota)}</span>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-600">Biaya Operasional Tambahan</span>
            <span>{rupiah(totalBiayaTambahan)}</span>
          </div>

          <div className="flex justify-between gap-4 text-sm">
            <span className="text-slate-600">Panjar Sopir (informasi)</span>
            <span>{rupiah(totalPanjar)}</span>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-500">
              Total pengeluaran yang tercatat
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {rupiah(totalPengeluaranTercatat)}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-amber-50 p-4">
          <p className="font-semibold text-amber-900">
            Laba bersih belum dapat ditentukan
          </p>
          <p className="mt-1 text-sm text-amber-800">
            Nilai kopra dalam nota belum tentu merupakan pendapatan penjualan.
            Untuk menghitung laba, kita masih perlu mencatat hasil penjualan
            kopra, harga jual, dan memastikan biaya tidak tercatat dua kali.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Riwayat Nota
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">ID Nota</th>
                <th className="px-4 py-3">Netto</th>
                <th className="px-4 py-3">Nilai Kopra</th>
                <th className="px-4 py-3">Sisa Pembayaran</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {notaTerpilih.map((nota) => (
                <tr key={nota.id}>
                  <td className="px-4 py-3">{nota.tanggal}</td>
                  <td className="px-4 py-3">{nota.id}</td>
                  <td className="px-4 py-3">
                    {Number(nota.netto || 0).toLocaleString('id-ID')} kg
                  </td>
                  <td className="px-4 py-3">
                    {rupiah(nota.totalNilai)}
                  </td>
                  <td className="px-4 py-3">
                    {rupiah(nota.sisaPembayaran)}
                  </td>
                </tr>
              ))}

              {notaTerpilih.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Tidak ada nota pada periode ini.
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

export default LaporanLaba
