import React, { useEffect, useState } from "react";
import { Trophy, TrendingUp, Calculator, Star, Award, Target } from "lucide-react";
import {
  getAlternatif,
  getKriteria,
  getNilai,
  createHasil,
} from "../services/api";

function TOPSIS() {
  const [alternatif, setAlternatif] = useState([]);
  const [kriteria, setKriteria] = useState([]);
  const [nilai, setNilai] = useState([]);
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  const [alasan, setAlasan] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [altRes, kritRes, nilaiRes] = await Promise.all([
        getAlternatif(),
        getKriteria(),
        getNilai(),
      ]);

      setAlternatif(altRes.data);
      setKriteria(kritRes.data);
      setNilai(nilaiRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleHitung = async () => {
    if (kriteria.length === 0 || alternatif.length === 0 || nilai.length === 0) {
      alert("Data kriteria, alternatif, dan nilai harus lengkap sebelum melakukan perhitungan TOPSIS.");
      return;
    }

    setLoading(true);

    try {
      // Prefer bobot AHP dari DB (kriteria.bobot_ahp). Jika belum ada, fallback ke localStorage.
      let bobotAHP = [];
      if (kriteria && kriteria.length > 0) {
        bobotAHP = kriteria.map((k) => ({ id: k.id, bobot_ahp: Number(k.bobot_ahp) || 0 }));
      }

      const hasDbBobot = bobotAHP.some((b) => Number(b.bobot_ahp) > 0);
      if (!hasDbBobot) {
        const ls = JSON.parse(localStorage.getItem("bobotAHP") || "[]");
        bobotAHP = ls;
      }

      if (!bobotAHP || bobotAHP.length === 0 || !bobotAHP.some((b) => Number(b.bobot_ahp) > 0)) {
        setLoading(false);
        alert("Silakan lakukan perhitungan AHP terlebih dahulu.");
        return;
      }

      // Matriks Keputusan
      const matriks = alternatif.map((alt) => {
        const row = kriteria.map((krit) => {
          const nilaiItem = nilai.find(
            (n) => Number(n.alternatifId) === Number(alt.id) && Number(n.kriteriaId) === Number(krit.id)
          );
          return nilaiItem ? Number(nilaiItem.nilai) : 0;
        });
        return { alternatif: alt, nilai: row };
      });

      // Normalisasi Matriks
      const normalized = matriks.map((row) => {
        const normalizedRow = row.nilai.map((val, idx) => {
          const krit = kriteria[idx];
          const sumSquares = matriks.reduce((sum, r) => sum + Math.pow(r.nilai[idx], 2), 0);
          return val / Math.sqrt(sumSquares);
        });
        return { ...row, normalized: normalizedRow };
      });

      // Matriks Normalisasi Terbobot
      const weighted = normalized.map((row) => {
        const weightedRow = row.normalized.map((val, idx) => {
          const bobot = bobotAHP.find((b) => Number(b.id) === Number(kriteria[idx].id));
          return val * (bobot ? Number(bobot.bobot_ahp) : 0);
        });
        return { ...row, weighted: weightedRow };
      });

      // Solusi Ideal Positif dan Negatif
      const idealPositive = kriteria.map((krit, idx) => {
        if (krit.tipe === "benefit") {
          return Math.max(...weighted.map((row) => row.weighted[idx]));
        } else {
          return Math.min(...weighted.map((row) => row.weighted[idx]));
        }
      });

      const idealNegative = kriteria.map((krit, idx) => {
        if (krit.tipe === "benefit") {
          return Math.min(...weighted.map((row) => row.weighted[idx]));
        } else {
          return Math.max(...weighted.map((row) => row.weighted[idx]));
        }
      });

      // Jarak ke Solusi Ideal
      const distances = weighted.map((row) => {
        const distPositive = Math.sqrt(
          row.weighted.reduce((sum, val, idx) => sum + Math.pow(val - idealPositive[idx], 2), 0)
        );
        const distNegative = Math.sqrt(
          row.weighted.reduce((sum, val, idx) => sum + Math.pow(val - idealNegative[idx], 2), 0)
        );
        return { ...row, distPositive, distNegative };
      });

      // Skor Preferensi
      const preferences = distances.map((row) => {
        const skor = row.distNegative / (row.distPositive + row.distNegative);
        return {
          ...row,
          skor,
          ranking: 0, // akan di-set setelah sorting
        };
      });

      // Sort berdasarkan skor tertinggi
      const sortedPreferences = preferences
        .sort((a, b) => b.skor - a.skor)
        .map((item, index) => ({ ...item, ranking: index + 1 }));

      // Simpan hasil ke database
      const hasilData = sortedPreferences.map((item) => ({
        nama: item.alternatif.nama,
        skor: item.skor,
        ranking: item.ranking,
      }));

      // Simpan ke database
      for (const item of hasilData) {
        try {
          await createHasil(item);
        } catch (error) {
          console.error("Error saving hasil:", error);
        }
      }

      setHasil(sortedPreferences);

      // Generate alasan untuk pemenang
      const winner = sortedPreferences[0];
      const winnerName = winner.alternatif.nama;
      const winnerScore = winner.skor.toFixed(4);

      const reason = `${winnerName} menjadi parfum paling potensial dengan skor ${winnerScore} karena memiliki kombinasi terbaik dari semua kriteria penilaian. Parfum ini menunjukkan performa yang seimbang antara berbagai aspek seperti aroma, harga, dan kualitas yang dievaluasi.`;

      setAlasan(reason);
      setIsCalculated(true);

    } catch (error) {
      console.error("Error calculating TOPSIS:", error);
      alert("Terjadi kesalahan dalam perhitungan TOPSIS.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-300';
      case 'error': return 'bg-red-500/20 text-red-300 border border-red-500/30';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const dataStatus = [
    {
      label: 'Data Alternatif',
      count: alternatif.length,
      status: alternatif.length > 0 ? 'complete' : 'error',
      message: alternatif.length > 0 ? `${alternatif.length} alternatif tersedia` : 'Belum ada data alternatif'
    },
    {
      label: 'Data Kriteria',
      count: kriteria.length,
      status: kriteria.length > 0 ? 'complete' : 'error',
      message: kriteria.length > 0 ? `${kriteria.length} kriteria terdefinisi` : 'Belum ada data kriteria'
    },
    {
      label: 'Data Penilaian',
      count: nilai.length,
      status: nilai.length > 0 ? 'complete' : 'error',
      message: nilai.length > 0 ? `${nilai.length} data penilaian tersimpan` : 'Belum ada data penilaian'
    },
    {
      label: 'Bobot AHP',
      count: JSON.parse(localStorage.getItem("bobotAHP") || "[]").length,
      status: JSON.parse(localStorage.getItem("bobotAHP") || "[]").length > 0 ? 'complete' : 'error',
      message: JSON.parse(localStorage.getItem("bobotAHP") || "[]").length > 0 ? 'Bobot AHP tersedia' : 'Lakukan perhitungan AHP terlebih dahulu'
    }
  ];

  return (
    <div className="p-8 relative z-10">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Trophy className="text-emerald-400" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Analisis TOPSIS</h1>
              <p className="text-slate-400 mt-1">Technique for Order Preference by Similarity to Ideal Solution</p>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {dataStatus.map((item, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-400">{item.label}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status === 'complete' ? '✓' : item.status === 'warning' ? '⚠' : '✗'}
                    {item.status === 'complete' ? 'OK' : item.status === 'warning' ? 'Warning' : 'Error'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{item.count}</div>
                <div className="text-xs text-slate-500">{item.message}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Calculator className="text-emerald-400" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Perhitungan TOPSIS</h2>
                <p className="text-sm text-slate-400">Hitung perangkingan final menggunakan metode TOPSIS</p>
              </div>
            </div>
            <button
              onClick={handleHitung}
              disabled={loading || alternatif.length === 0 || kriteria.length === 0 || nilai.length === 0}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  Menghitung...
                </>
              ) : (
                <>
                  <Calculator size={20} />
                  Hitung TOPSIS
                </>
              )}
            </button>
          </div>

          {/* Prerequisites */}
          <div className="bg-slate-700/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Tahapan TOPSIS:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs font-bold text-blue-400">1</div>
                <span>Normalisasi Matriks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs font-bold text-purple-400">2</div>
                <span>Matriks Terbobot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">3</div>
                <span>Solusi Ideal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs font-bold text-emerald-400">4</div>
                <span>Skor Preferensi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hasil TOPSIS */}
        {hasil.length > 0 && (
          <div className="space-y-6">
            {/* Pemenang */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Award className="text-yellow-400" size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Hasil Akhir - Parfum Terbaik</h3>
              </div>

              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 border border-emerald-500/30">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
                    <Trophy className="text-emerald-400" size={32} />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">
                    {hasil[0]?.alternatif.nama}
                  </h4>
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-emerald-500/30">
                    <Star size={16} />
                    Skor: {hasil[0]?.skor.toFixed(4)}
                  </div>
                  <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
                    {alasan}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabel Hasil Lengkap */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <TrendingUp className="text-emerald-400" size={20} />
                </div>
                <h3 className="text-lg font-bold text-white">Perangkingan Lengkap</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-950 to-purple-950">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Ranking
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Alternatif
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Skor TOPSIS
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {hasil.map((item, index) => (
                      <tr key={index} className={`hover:bg-slate-700/30 ${index === 0 ? 'bg-emerald-500/10' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {index === 0 ? (
                              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <Trophy className="text-emerald-400" size={16} />
                              </div>
                            ) : (
                              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm font-medium text-slate-300">
                                {item.ranking}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{item.alternatif.nama}</div>
                          <div className="text-xs text-slate-500">{item.alternatif.kelompok_harga}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{item.skor.toFixed(4)}</div>
                          <div className="w-full bg-slate-700 rounded-full h-2 mt-1 max-w-24">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(item.skor / Math.max(...hasil.map(h => h.skor))) * 100}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {index === 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <Trophy size={12} className="mr-1" />
                              Terbaik
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                              Ranking {item.ranking}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Completion Message */}
        {isCalculated && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Trophy className="text-emerald-400" size={16} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-emerald-300 mb-2">Analisis TOPSIS Selesai</h4>
                <p className="text-slate-300 mb-3">
                  Perhitungan TOPSIS telah berhasil dilakukan. Hasil perangkingan telah disimpan ke database
                  dan dapat dilihat pada halaman Hasil untuk analisis lebih lanjut.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => window.location.href = '/hasil'}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
                  >
                    Lihat Hasil Lengkap
                  </button>
                  <button
                    onClick={() => window.location.href = '/report'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Buat Laporan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TOPSIS;