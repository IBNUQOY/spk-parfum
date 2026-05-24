import React, { useEffect, useState } from "react";
import { Database as DatabaseIcon, RefreshCw } from "lucide-react";
import { getAlternatif, getKriteria, getNilai, getHasil } from "../services/api";

export default function Database() {
  const [alternatif, setAlternatif] = useState([]);
  const [kriteria, setKriteria] = useState([]);
  const [nilai, setNilai] = useState([]);
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [altRes, kriRes, nilRes, hasilRes] = await Promise.all([
        getAlternatif(),
        getKriteria(),
        getNilai(),
        getHasil(),
      ]);
      setAlternatif(altRes.data || []);
      setKriteria(kriRes.data || []);
      setNilai(nilRes.data || []);
      setHasil(hasilRes.data || []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data database. Pastikan konfigurasi Supabase sudah benar dan variabel lingkungan terisi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 relative z-10">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30">
                <DatabaseIcon className="text-blue-400" size={28} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Database Viewer</h1>
                <p className="text-slate-400 mt-1">Lihat data yang tersimpan di MySQL dari aplikasi ini.</p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchAll}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-900/80 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <RefreshCw size={18} />
            {loading ? "Memuat..." : "Muat ulang data"}
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Alternatif</h2>
              <span className="text-sm text-slate-400">{alternatif.length} item</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-slate-700/60 text-slate-400">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Nama</th>
                    <th className="px-3 py-2">Harga</th>
                    <th className="px-3 py-2">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {alternatif.map((item) => (
                    <tr key={item.id} className="border-b border-slate-800/60 hover:bg-slate-800/50">
                      <td className="px-3 py-2 text-slate-300">{item.id}</td>
                      <td className="px-3 py-2">{item.nama}</td>
                      <td className="px-3 py-2">{item.harga_detail}</td>
                      <td className="px-3 py-2">{item.rating}</td>
                    </tr>
                  ))}
                  {alternatif.length === 0 && !loading && (
                    <tr>
                      <td colSpan="4" className="px-3 py-4 text-slate-500">Tidak ada data alternatif.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Kriteria</h2>
              <span className="text-sm text-slate-400">{kriteria.length} item</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-slate-700/60 text-slate-400">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Nama</th>
                    <th className="px-3 py-2">Tipe</th>
                    <th className="px-3 py-2">Bobot</th>
                  </tr>
                </thead>
                <tbody>
                  {kriteria.map((item) => (
                    <tr key={item.id} className="border-b border-slate-800/60 hover:bg-slate-800/50">
                      <td className="px-3 py-2 text-slate-300">{item.id}</td>
                      <td className="px-3 py-2">{item.nama}</td>
                      <td className="px-3 py-2">{item.tipe}</td>
                      <td className="px-3 py-2">{item.bobot}</td>
                    </tr>
                  ))}
                  {kriteria.length === 0 && !loading && (
                    <tr>
                      <td colSpan="4" className="px-3 py-4 text-slate-500">Tidak ada data kriteria.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="grid gap-6 mt-6">
          <section className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Nilai</h2>
              <span className="text-sm text-slate-400">{nilai.length} item</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-slate-700/60 text-slate-400">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Alternatif</th>
                    <th className="px-3 py-2">Kriteria</th>
                    <th className="px-3 py-2">Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {nilai.map((item) => (
                    <tr key={item.id} className="border-b border-slate-800/60 hover:bg-slate-800/50">
                      <td className="px-3 py-2 text-slate-300">{item.id}</td>
                      <td className="px-3 py-2">{item.alternatifId}</td>
                      <td className="px-3 py-2">{item.kriteriaId}</td>
                      <td className="px-3 py-2">{item.nilai}</td>
                    </tr>
                  ))}
                  {nilai.length === 0 && !loading && (
                    <tr>
                      <td colSpan="4" className="px-3 py-4 text-slate-500">Tidak ada data nilai.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Hasil</h2>
              <span className="text-sm text-slate-400">{hasil.length} item</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-slate-200">
                <thead>
                  <tr className="border-b border-slate-700/60 text-slate-400">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Nama</th>
                    <th className="px-3 py-2">Skor</th>
                    <th className="px-3 py-2">Ranking</th>
                  </tr>
                </thead>
                <tbody>
                  {hasil.map((item) => (
                    <tr key={item.id} className="border-b border-slate-800/60 hover:bg-slate-800/50">
                      <td className="px-3 py-2 text-slate-300">{item.id}</td>
                      <td className="px-3 py-2">{item.nama}</td>
                      <td className="px-3 py-2">{item.skor}</td>
                      <td className="px-3 py-2">{item.ranking}</td>
                    </tr>
                  ))}
                  {hasil.length === 0 && !loading && (
                    <tr>
                      <td colSpan="4" className="px-3 py-4 text-slate-500">Tidak ada data hasil.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
