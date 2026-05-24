import React, { useState, useEffect } from 'react';
import { Download, Printer, FileText, BarChart3, Users, Target, Award } from 'lucide-react';
import Toast from '../components/Toast';
import API from '../services/api';

function Report() {
  const [alternatif, setAlternatif] = useState([]);
  const [kriteria, setKriteria] = useState([]);
  const [nilai, setNilai] = useState([]);
  const [hasil, setHasil] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [altRes, kritRes, nilRes, hasilRes] = await Promise.all([
        API.get('/alternatif'),
        API.get('/kriteria'),
        API.get('/nilai'),
        API.get('/hasil'),
      ]);

      setAlternatif(altRes.data);
      setKriteria(kritRes.data);
      setNilai(nilRes.data);
      setHasil(hasilRes.data.sort((a, b) => b.skor - a.skor));
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast('Gagal memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addToast = (message, type = 'info') => {
    const id = Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handlePrint = () => {
    window.print();
    addToast('Membuka dialog cetak...', 'info');
  };

  const handleDownloadPDF = async () => {
    try {
      // Using html2pdf library
      const element = document.getElementById('report-content');
      const opt = {
        margin: 10,
        filename: 'Laporan_SPK_Parfum.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      };

      // Load html2pdf from CDN if not already loaded
      if (typeof html2pdf === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => {
          html2pdf().set(opt).from(element).save();
          addToast('PDF berhasil diunduh', 'success');
        };
        document.head.appendChild(script);
      } else {
        html2pdf().set(opt).from(element).save();
        addToast('PDF berhasil diunduh', 'success');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      addToast('Gagal membuat PDF', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <FileText className="text-indigo-600" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Laporan SPK Parfum</h1>
              <p className="text-gray-600 mt-1">Laporan lengkap hasil analisis Sistem Penunjang Keputusan</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              <Printer size={20} />
              Cetak Laporan
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div id="report-content" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8 print:shadow-none print:p-6">
          {/* Report Header */}
          <div className="text-center border-b-2 border-indigo-600 pb-6 print:break-inside-avoid">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Award className="text-indigo-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">SPK PARFUM</h2>
            <p className="text-gray-600 text-lg">Sistem Penunjang Keputusan Pemilihan Parfum Terbaik</p>
            <p className="text-sm text-gray-500 mt-3">Tanggal: {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>

          {/* Executive Summary */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border border-green-200 print:break-inside-avoid">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="text-green-600" size={24} />
              Ringkasan Eksekutif
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{alternatif.length}</div>
                <div className="text-sm text-gray-600">Alternatif</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-green-600">{kriteria.length}</div>
                <div className="text-sm text-gray-600">Kriteria</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">{nilai.length}</div>
                <div className="text-sm text-gray-600">Data Penilaian</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-orange-600">{hasil.length}</div>
                <div className="text-sm text-gray-600">Hasil Ranking</div>
              </div>
            </div>
            {hasil.length > 0 && (
              <div className="bg-white p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-2">Rekomendasi Utama:</h4>
                <p className="text-gray-700">
                  <strong className="text-green-600">{hasil[0].nama}</strong> adalah parfum paling potensial
                  dengan skor <strong>{parseFloat(hasil[0].skor).toFixed(4)}</strong>
                </p>
              </div>
            )}
          </div>

          {/* Alternatif Section */}
          <div className="print:break-inside-avoid">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">1. Daftar Alternatif (Parfum)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">No</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Nama Parfum</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Deskripsi</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Range Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {alternatif.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-900">{item.nama}</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">{item.deskripsi}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.kelompok_harga}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Kriteria Section */}
          <div className="print:break-inside-avoid">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="text-green-600" size={20} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">2. Daftar Kriteria Penilaian</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">No</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Nama Kriteria</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Tipe</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Bobot</th>
                  </tr>
                </thead>
                <tbody>
                  {kriteria.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 text-center font-medium">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-900">{item.nama}</td>
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.tipe === 'benefit' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {item.tipe === 'benefit' ? 'Benefit' : 'Cost'}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                        {Number(item.bobot).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Hasil Section */}
          {hasil.length > 0 && (
            <div className="print:break-inside-avoid">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Award className="text-yellow-600" size={20} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">3. Hasil Perangkingan TOPSIS</h3>
              </div>

              {/* Winner Highlight */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 mb-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-3">
                    <Award className="text-yellow-600" size={24} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Parfum Terbaik</h4>
                  <p className="text-2xl font-bold text-green-600 mb-2">{hasil[0].nama}</p>
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    Skor: {parseFloat(hasil[0].skor).toFixed(4)}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Ranking</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Nama Parfum</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Skor TOPSIS</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Persentase</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hasil.map((item, index) => {
                      const maxScore = Math.max(...hasil.map(h => parseFloat(h.skor)));
                      const percentage = (parseFloat(item.skor) / maxScore) * 100;

                      return (
                        <tr key={item.id} className={index === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            {index === 0 ? (
                              <div className="flex items-center justify-center gap-2">
                                <Award className="text-yellow-500" size={16} />
                                <span className="font-bold text-green-600">1</span>
                              </div>
                            ) : (
                              <span className="font-medium">{index + 1}</span>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 font-semibold text-gray-900">{item.nama}</td>
                          <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-900">
                            {parseFloat(item.skor).toFixed(4)}
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-600 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{percentage.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            {index === 0 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Award size={12} className="mr-1" />
                                Terbaik
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Ranking {index + 1}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Analysis Summary */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Analisis Hasil
                </h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Hasil perangkingan menunjukkan bahwa <strong>{hasil[0]?.nama}</strong> memiliki skor tertinggi
                  dengan nilai <strong>{parseFloat(hasil[0]?.skor).toFixed(4)}</strong>. Parfum ini berhasil
                  mengungguli {hasil.length - 1} alternatif lainnya berdasarkan kombinasi semua kriteria penilaian
                  yang telah ditentukan dalam analisis SPK menggunakan metode TOPSIS.
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 border-t border-gray-200 pt-6 print:break-inside-avoid">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Award className="text-green-600" size={16} />
              <span className="font-medium">Sistem Penunjang Keputusan Parfum</span>
            </div>
            <p>Laporan ini dihasilkan secara otomatis pada {new Date().toLocaleString('id-ID')}</p>
            <p className="text-xs mt-1">Metode: AHP + TOPSIS | Framework: React + Tailwind CSS</p>
          </div>
        </div>

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

      <style>{`
        @media print {
          body { margin: 0; padding: 0; background: white; }
          .print\\:break-inside-avoid { break-inside: avoid; }
          button, .fixed { display: none !important; }
          .shadow-sm, .shadow { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Report;
