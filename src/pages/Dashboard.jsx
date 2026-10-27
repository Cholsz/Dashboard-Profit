
import PageHeader from '../components/PageHeader'

function Dashboard({ notas = [] }) {
  const rupiah = (nilai) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(nilai || 0)

  const angka = (nilai) =>
    new Intl.NumberFormat('id-ID', {
      maximumFractionDigits: 2,
    }).format(nilai || 0)

  const totalNota = notas.length

  const totalNetto = notas.reduce(
    (total, nota) => total + (Number(nota.netto) || 0),
    0
  )

  const totalNilai = notas.reduce(
    (total, nota) => total + (Number(nota.totalNilai) || 0),
    0
  )

  const totalBiaya = notas.reduce(
    (total, nota) => total + (Number(nota.totalBiaya) || 0),
    0
  )

  const totalSisa = notas.reduce(
    (total, nota) => total + (Number(nota.sisaPembayaran) || 0),
    0
  )

  const kartu = [
    {
      judul: 'Total Nota',
      nilai: angka(totalNota),
      satuan: 'transaksi',
    },
    {
      judul: 'Total Netto',
      nilai: angka(totalNetto),
      satuan: 'kg',
    },
    {
      judul: 'Total Nilai Kopra',
      nilai: rupiah(totalNilai),
    },
    {
      judul: 'Biaya dan Panjar',
      nilai: rupiah(totalBiaya),
    },
  ]

  const notaTerbaru = [...notas]
    .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Laba Kopra"
        description="Ringkasan transaksi dan nilai usaha kopra."
      />

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
            {item.satuan && (
              <p className="mt-1 text-xs text-slate-500">{item.satuan}</p>
            )}
          </div>
        ))}
      </div>

      <section className="rounded-xl bg-slate-900 p-6 text-white">
        <p className="text-sm text-slate-300">
          Total Sisa Pembayaran Sementara
        </p>
        <p className="mt-2 text-3xl font-bold text-emerald-400">
          {rupiah(totalSisa)}
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Nilai ini merupakan akumulasi nilai kopra dikurangi biaya dan panjar
          yang dicatat pada setiap nota, bukan laba bersih usaha.
        </p>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Nota Terbaru
          </h2>
          <p className="text-sm text-slate-500">
            Lima transaksi berdasarkan tanggal terbaru.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Netto</th>
                <th className="px-4 py-3">Nilai Kopra</th>
                <th className="px-4 py-3">Sisa Pembayaran</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {notaTerbaru.map((nota) => (
                <tr key={nota.id}>
                  <td className="px-4 py-3">{nota.tanggal}</td>
                  <td className="px-4 py-3">{angka(nota.netto)} kg</td>
                  <td className="px-4 py-3">{rupiah(nota.totalNilai)}</td>
                  <td className="px-4 py-3 font-medium text-emerald-700">
                    {rupiah(nota.sisaPembayaran)}
                  </td>
                </tr>
              ))}

              {notaTerbaru.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Belum ada transaksi. Silakan input nota timbangan terlebih dahulu.
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

export default Dashboard
