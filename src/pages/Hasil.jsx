import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, TrendingUp, BarChart3, Target, Download, Trash2 } from "lucide-react";
import Toast from "../components/Toast";
import API from "../services/api";

function Hasil() {
  const [hasilData, setHasilData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const addToast = (message, type = "info") => {
    const id = Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.get("/hasil");
      setHasilData(response.data.sort((a, b) => b.skor - a.skor));
    } catch (error) {
      console.error("Error fetching data:", error);
      addToast("Gagal memuat data hasil", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data hasil ini?")) {
      try {
        setLoading(true);
        await API.delete(`/hasil/${id}`);
        addToast("Hasil berhasil dihapus", "success");
        await fetchData();
      } catch (error) {
        console.error("Error:", error);
        addToast("Gagal menghapus data", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua hasil ranking?")) {
      try {
        setLoading(true);
        // Delete all results
        for (const item of hasilData) {
          await API.delete(`/hasil/${item.id}`);
        }
        addToast("Semua hasil berhasil dihapus", "success");
        await fetchData();
      } catch (error) {
        console.error("Error:", error);
        addToast("Gagal menghapus data", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const topResult = hasilData[0];
  const alasanTop = topResult
    ? `${topResult.nama} memiliki skor tertinggi ${parseFloat(topResult.skor).toFixed(4)}, sehingga dinilai paling potensial untuk dipromosikan. Parfum ini menunjukkan performa terbaik dalam memenuhi semua kriteria penilaian yang telah ditentukan dalam analisis SPK.`
    : "";

  const getRankingIcon = (index) => {
    switch (index) {
      case 0: return <Trophy className="text-yellow-500" size={24} />;
      case 1: return <Medal className="text-gray-400" size={24} />;
      case 2: return <Award className="text-amber-600" size={24} />;
      default: return <span className="text-lg font-bold text-gray-500">{index + 1}</span>;
    }
  };

  const getRankingColor = (index) => {
    switch (index) {
      case 0: return 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200';
      case 1: return 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200';
      case 2: return 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200';
      default: return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <Trophy className="text-emerald-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Hasil Ranking SPK</h1>
              <p className="text-gray-600 mt-1">Hasil akhir perangkingan alternatif parfum menggunakan metode AHP dan TOPSIS</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{hasilData.length}</div>
              <div className="text-sm text-gray-600">Total Hasil</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">
                {hasilData.length > 0 ? hasilData[0]?.nama : '-'}
              </div>
              <div className="text-sm text-gray-600">Pemenang</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {hasilData.length > 0 ? parseFloat(hasilData[0]?.skor).toFixed(4) : '0.0000'}
              </div>
              <div className="text-sm text-gray-600">Skor Tertinggi</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-orange-600">
                {hasilData.length > 1 ? ((parseFloat(hasilData[0]?.skor) - parseFloat(hasilData[1]?.skor)) * 100).toFixed(2) : '0.00'}%
              </div>
              <div className="text-sm text-gray-600">Margin Keunggulan</div>
            </div>
          </div>
        </div>

        {/* Winner Section */}
        {topResult && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full mb-6">
                <Trophy className="text-yellow-600" size={40} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Parfum Paling Potensial</h2>
              <h3 className="text-4xl font-bold text-emerald-600 mb-4">{topResult.nama}</h3>
              <div className="inline-flex items-center gap-3 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-full text-lg font-semibold mb-6">
                <Target size={20} />
                Skor Akhir: {parseFloat(topResult.skor).toFixed(4)}
              </div>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                {alasanTop}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        {hasilData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <BarChart3 className="text-indigo-600" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Perangkingan Lengkap</h3>
                  <p className="text-sm text-gray-600">Detail hasil analisis SPK untuk semua alternatif</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.href = '/report'}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                >
                  <Download size={16} />
                  Buat Laporan
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
                >
                  Hapus Semua
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-3 text-gray-600">Memuat data...</span>
            </div>
          ) : hasilData.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Hasil Ranking</h3>
              <p className="text-gray-600 mb-4">
                Lakukan analisis AHP dan TOPSIS terlebih dahulu untuk mendapatkan hasil ranking.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => window.location.href = '/ahp'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Analisis AHP
                </button>
                <button
                  onClick={() => window.location.href = '/topsis'}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Analisis TOPSIS
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Ranking
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Alternatif
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Skor Akhir
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Persentase
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {hasilData.map((item, index) => {
                    const maxScore = Math.max(...hasilData.map(h => parseFloat(h.skor)));
                    const percentage = (parseFloat(item.skor) / maxScore) * 100;

                    return (
                      <tr key={item.id} className={`hover:bg-gray-50 ${index < 3 ? getRankingColor(index) : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {getRankingIcon(index)}
                            <span className="text-lg font-bold text-gray-900">#{index + 1}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{item.nama}</div>
                          <div className="text-xs text-gray-500">ID: {item.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-lg font-bold text-gray-900">{parseFloat(item.skor).toFixed(4)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-emerald-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-700">{percentage.toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {index === 0 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Trophy size={12} className="mr-1" />
                              Juara 1
                            </span>
                          ) : index === 1 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <Medal size={12} className="mr-1" />
                              Juara 2
                            </span>
                          ) : index === 2 ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              <Award size={12} className="mr-1" />
                              Juara 3
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Ranking {index + 1}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-lg hover:bg-red-100 transition text-sm mx-auto"
                          >
                            <Trash2 size={16} />
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top 3 Summary */}
        {hasilData.length >= 3 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {hasilData.slice(0, 3).map((item, index) => (
              <div key={item.id} className={`p-6 rounded-xl shadow-sm border ${getRankingColor(index)}`}>
                <div className="flex items-center gap-3 mb-4">
                  {getRankingIcon(index)}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.nama}</h3>
                    <p className="text-sm text-gray-600">Peringkat {index + 1}</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {parseFloat(item.skor).toFixed(4)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${(parseFloat(item.skor) / parseFloat(hasilData[0].skor)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toast Notifications */}
        <div className="fixed bottom-4 right-4 z-50">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Hasil;
