
import { useState } from 'react'
import PageHeader from '../components/PageHeader'

function NotaTimbangan({ notas, setNotas }) {
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().slice(0, 10)
  )
  const [bruto, setBruto] = useState('')
  const [tarra, setTarra] = useState('')
  const [persentasePotongan, setPersentasePotongan] = useState('')

  const [barisHarga, setBarisHarga] = useState([
    { id: 1, jenis: 'Kopra', berat: '', harga: '' },
  ])

  const [upahBuruh, setUpahBuruh] = useState('')
  const [panjarSopir, setPanjarSopir] = useState('')
  const [biayaLain, setBiayaLain] = useState('')
  const [catatan, setCatatan] = useState('')

  const angka = (nilai) => Number(nilai) || 0

  const beratSetelahTarra = Math.max(
    0,
    angka(bruto) - angka(tarra)
  )

  const beratPotongan =
    beratSetelahTarra * angka(persentasePotongan) / 100

  const netto = Math.max(0, beratSetelahTarra - beratPotongan)

  const totalNilai = barisHarga.reduce((total, baris) => {
    return total + angka(baris.berat) * angka(baris.harga)
  }, 0)

  const totalBiaya =
    angka(upahBuruh) + angka(panjarSopir) + angka(biayaLain)

  const sisaPembayaran = totalNilai - totalBiaya

  function tambahBaris() {
    setBarisHarga([
      ...barisHarga,
      {
        id: Date.now(),
        jenis: '',
        berat: '',
        harga: '',
      },
    ])
  }

  function ubahBaris(id, field, value) {
    setBarisHarga(
      barisHarga.map((baris) =>
        baris.id === id ? { ...baris, [field]: value } : baris
      )
    )
  }

  function hapusBaris(id) {
    setBarisHarga(barisHarga.filter((baris) => baris.id !== id))
  }

  function formatRupiah(nilai) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(nilai)
  }

  function simpanNota(e) {
    e.preventDefault()

    if (!tanggal || angka(bruto) <= 0) {
      alert('Tanggal dan bruto wajib diisi.')
      return
    }

    if (angka(tarra) < 0 || angka(tarra) > angka(bruto)) {
      alert('Nilai tarra tidak boleh melebihi bruto.')
      return
    }

    if (
      angka(persentasePotongan) < 0 ||
      angka(persentasePotongan) > 100
    ) {
      alert('Persentase potongan harus antara 0 sampai 100%.')
      return
    }

    if (
      barisHarga.length === 0 ||
      barisHarga.some(
        (baris) =>
          !baris.jenis.trim() ||
          angka(baris.berat) <= 0 ||
          angka(baris.harga) <= 0
      )
    ) {
      alert('Lengkapi jenis kopra, berat, dan harga setiap baris.')
      return
    }

    if (
      [upahBuruh, panjarSopir, biayaLain].some(
        (nilai) => angka(nilai) < 0
      )
    ) {
      alert('Biaya tidak boleh bernilai negatif.')
      return
    }

    const notaBaru = {
      id: Date.now(),
      tanggal,
      bruto: angka(bruto),
      tarra: angka(tarra),
      persentasePotongan: angka(persentasePotongan),
      beratPotongan,
      netto,
      barisHarga: barisHarga.map((baris) => ({
        ...baris,
        berat: angka(baris.berat),
        harga: angka(baris.harga),
        total: angka(baris.berat) * angka(baris.harga),
      })),
      totalNilai,
      upahBuruh: angka(upahBuruh),
      panjarSopir: angka(panjarSopir),
      biayaLain: angka(biayaLain),
      totalBiaya,
      sisaPembayaran,
      catatan,
    }

    setNotas([...notas, notaBaru])
    alert('Nota timbangan berhasil disimpan.')

    setBruto('')
    setTarra('')
    setPersentasePotongan('')
    setBarisHarga([
      { id: Date.now(), jenis: 'Kopra', berat: '', harga: '' },
    ])
    setUpahBuruh('')
    setPanjarSopir('')
    setBiayaLain('')
    setCatatan('')
  }

  const inputClass =
    'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'

  const labelClass = 'text-sm font-medium text-slate-700'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nota Timbangan"
        description="Input berat kopra, harga, dan biaya transaksi."
      />

      <form onSubmit={simpanNota} className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Informasi Timbangan
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className={labelClass}>
              Tanggal Transaksi
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className={inputClass}
                required
              />
            </label>

            <label className={labelClass}>
              Bruto (kg)
              <input
                type="number"
                min="0.01"
                step="any"
                value={bruto}
                onChange={(e) => setBruto(e.target.value)}
                className={inputClass}
                placeholder="Contoh: 1000"
                required
              />
            </label>

            <label className={labelClass}>
              Tarra (kg)
              <input
                type="number"
                min="0"
                step="any"
                value={tarra}
                onChange={(e) => setTarra(e.target.value)}
                className={inputClass}
                placeholder="Contoh: 20"
              />
            </label>

            <label className={labelClass}>
              Potongan (%)
              <input
                type="number"
                min="0"
                max="100"
                step="any"
                value={persentasePotongan}
                onChange={(e) => setPersentasePotongan(e.target.value)}
                className={inputClass}
                placeholder="Contoh: 2"
              />
            </label>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Setelah Tarra</p>
              <p className="mt-1 text-xl font-bold text-slate-800">
                {beratSetelahTarra.toLocaleString('id-ID')} kg
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Berat Potongan</p>
              <p className="mt-1 text-xl font-bold text-amber-600">
                {beratPotongan.toLocaleString('id-ID', {
                  maximumFractionDigits: 2,
                })} kg
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 p-4">
              <p className="text-sm text-emerald-700">Netto</p>
              <p className="mt-1 text-xl font-bold text-emerald-700">
                {netto.toLocaleString('id-ID', {
                  maximumFractionDigits: 2,
                })} kg
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Detail Harga Kopra
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Masukkan berat dan harga untuk setiap jenis kopra.
              </p>
            </div>

            <button
              type="button"
              onClick={tambahBaris}
              className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              + Tambah Baris
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {barisHarga.map((baris, index) => (
              <div
                key={baris.id}
                className="grid gap-3 rounded-lg border border-slate-200 p-4 md:grid-cols-4"
              >
                <label className={labelClass}>
                  Jenis Kopra
                  <input
                    value={baris.jenis}
                    onChange={(e) =>
                      ubahBaris(baris.id, 'jenis', e.target.value)
                    }
                    className={inputClass}
                    placeholder="Contoh: Kualitas A"
                    required
                  />
                </label>

                <label className={labelClass}>
                  Berat (kg)
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={baris.berat}
                    onChange={(e) =>
                      ubahBaris(baris.id, 'berat', e.target.value)
                    }
                    className={inputClass}
                    required
                  />
                </label>

                <label className={labelClass}>
                  Harga per kg (Rp)
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={baris.harga}
                    onChange={(e) =>
                      ubahBaris(baris.id, 'harga', e.target.value)
                    }
                    className={inputClass}
                    required
                  />
                </label>

                <div className="flex flex-col justify-end">
                  <p className="text-xs text-slate-500">Nilai Baris</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {formatRupiah(
                      angka(baris.berat) * angka(baris.harga)
                    )}
                  </p>

                  {barisHarga.length > 1 && (
                    <button
                      type="button"
                      onClick={() => hapusBaris(baris.id)}
                      className="mt-2 self-start text-sm text-red-600 hover:underline"
                    >
                      Hapus baris
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Total Nilai Kopra</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatRupiah(totalNilai)}
            </p>
          </div>

          <p className="mt-3 text-xs text-slate-500">
            Pastikan total berat pada detail harga sesuai dengan netto nota
            apabila seluruh kopra dijual berdasarkan berat netto.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Biaya Operasional
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <label className={labelClass}>
              Upah Buruh (Rp)
              <input
                type="number"
                min="0"
                step="any"
                value={upahBuruh}
                onChange={(e) => setUpahBuruh(e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </label>

            <label className={labelClass}>
              Panjar Sopir (Rp)
              <input
                type="number"
                min="0"
                step="any"
                value={panjarSopir}
                onChange={(e) => setPanjarSopir(e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </label>

            <label className={labelClass}>
              Biaya Lainnya (Rp)
              <input
                type="number"
                min="0"
                step="any"
                value={biayaLain}
                onChange={(e) => setBiayaLain(e.target.value)}
                className={inputClass}
                placeholder="0"
              />
            </label>
          </div>

          <label className={`${labelClass} mt-4 block`}>
            Catatan
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className={inputClass}
              rows="3"
              placeholder="Catatan tambahan (opsional)"
            />
          </label>
        </section>

        <section className="rounded-xl bg-slate-900 p-5 text-white">
          <h2 className="text-lg font-semibold">Ringkasan Nota</h2>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-300">Total Nilai Kopra</span>
              <span>{formatRupiah(totalNilai)}</span>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-slate-300">Total Biaya / Panjar</span>
              <span>{formatRupiah(totalBiaya)}</span>
            </div>

            <div className="border-t border-slate-700 pt-3">
              <p className="text-sm text-slate-300">
                Sisa Pembayaran Sementara
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">
                {formatRupiah(sisaPembayaran)}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Ini merupakan estimasi sisa pembayaran, bukan laba bersih.
            Laba perlu dihitung setelah seluruh pendapatan dan biaya usaha
            diketahui.
          </p>
        </section>

        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setBruto('')
              setTarra('')
              setPersentasePotongan('')
              setBarisHarga([
                { id: Date.now(), jenis: 'Kopra', berat: '', harga: '' },
              ])
              setUpahBuruh('')
              setPanjarSopir('')
              setBiayaLain('')
              setCatatan('')
            }}
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Reset Form
          </button>

          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Simpan Nota
          </button>
        </div>
      </form>
    </div>
  )
}

export default NotaTimbangan
