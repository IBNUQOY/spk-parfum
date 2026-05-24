import React, { useState, useEffect, useMemo } from "react";
import { Plus, Edit2, Trash2, Target, BarChart3, Search } from "lucide-react";
import Toast from "../components/Toast";
import { getKriteria, createKriteria, updateKriteria, deleteKriteria } from "../services/api";

function Kriteria() {
  const [kriteria, setKriteria] = useState([]);
  const [formData, setFormData] = useState({ nama: "", tipe: "benefit", bobot: 1 });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchKriteria();
  }, []);

  const fetchKriteria = async () => {
    try {
      setLoading(true);
      const response = await getKriteria();
      setKriteria(response.data);
    } catch (error) {
      console.error("Error fetching kriteria:", error);
      addToast("Gagal memuat data kriteria", "error");
    } finally {
      setLoading(false);
    }
  };

  const addToast = (message, type = "info") => {
    const id = Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const totalBobot = useMemo(
    () => kriteria.reduce((sum, item) => sum + Number(item.bobot), 0),
    [kriteria]
  );

  const normalizedKriteria = useMemo(
    () =>
      kriteria.map((item) => ({
        ...item,
        weight: totalBobot ? Number(item.bobot) / totalBobot : 0,
      })),
    [kriteria, totalBobot]
  );

  const filteredKriteria = kriteria.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort filtered kriteria berdasarkan nama (A-Z)
  const sortedFilteredKriteria = [...filteredKriteria].sort((a, b) => {
    return a.nama.localeCompare(b.nama);
  });

  // Sort normalized kriteria berdasarkan nama (A-Z)
  const sortedNormalizedKriteria = [...normalizedKriteria].sort((a, b) => {
    return a.nama.localeCompare(b.nama);
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      addToast("Nama kriteria harus diisi", "warning");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        nama: formData.nama.trim(),
        tipe: formData.tipe,
        bobot: Number(formData.bobot) || 1,
      };

      if (editingId) {
        await updateKriteria(editingId, payload);
        addToast("Kriteria berhasil diupdate", "success");
      } else {
        await createKriteria(payload);
        addToast("Kriteria berhasil ditambahkan", "success");
      }

      setFormData({ nama: "", tipe: "benefit", bobot: 1 });
      setEditingId(null);
      setShowForm(false);
      await fetchKriteria();
    } catch (error) {
      console.error("Error saving kriteria:", error);
      addToast("Gagal menyimpan kriteria. Periksa koneksi server.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({ nama: item.nama, tipe: item.tipe || "benefit", bobot: item.bobot });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kriteria ini?")) {
      try {
        setLoading(true);
        await deleteKriteria(id);
        addToast("Kriteria berhasil dihapus", "success");
        await fetchKriteria();
      } catch (error) {
        console.error("Error deleting kriteria:", error);
        addToast("Gagal menghapus kriteria", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const getTipeColor = (tipe) => {
    return tipe === "benefit"
      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
      : "bg-red-500/20 text-red-300 border border-red-500/30";
  };

  const getTipeLabel = (tipe) => {
    return tipe === "benefit" ? "Benefit" : "Cost";
  };

  return (
    <div className="p-8 relative z-10">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30">
              <Target className="text-blue-400" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Manajemen Kriteria</h1>
              <p className="text-slate-400 mt-1">Kelola parameter penilaian untuk analisis SPK</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
              <div className="text-2xl font-bold text-blue-400">{kriteria.length}</div>
              <div className="text-sm text-slate-400">Total Kriteria</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
              <div className="text-2xl font-bold text-emerald-400">
                {kriteria.filter(k => k.tipe === "benefit").length}
              </div>
              <div className="text-sm text-slate-400">Kriteria Benefit</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
              <div className="text-2xl font-bold text-red-400">
                {kriteria.filter(k => k.tipe === "cost").length}
              </div>
              <div className="text-sm text-slate-400">Kriteria Cost</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
              <div className="text-2xl font-bold text-blue-400">{totalBobot}</div>
              <div className="text-sm text-slate-400">Total Bobot</div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="text"
                  placeholder="Cari kriteria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/80"
                />
              </div>
            </div>
            <button
              onClick={() => {
                setFormData({ nama: "", tipe: "benefit", bobot: 1 });
                setEditingId(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition font-medium shadow-lg shadow-blue-500/25"
            >
              <Plus size={20} />
              Tambah Kriteria
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Edit2 className="text-blue-400" size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">
                {editingId ? "Edit Kriteria" : "Tambah Kriteria Baru"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Nama Kriteria *
                </label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama kriteria"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/80"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Tipe Kriteria
                </label>
                <select
                  name="tipe"
                  value={formData.tipe}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/80"
                >
                  <option value="benefit">Benefit (Semakin tinggi semakin baik)</option>
                  <option value="cost">Cost (Semakin rendah semakin baik)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Bobot
                </label>
                <input
                  type="number"
                  name="bobot"
                  value={formData.bobot}
                  onChange={handleInputChange}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/80"
                />
              </div>

              <div className="md:col-span-3 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition font-medium disabled:opacity-50"
                >
                  <Plus size={20} />
                  {editingId ? "Update" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ nama: "", tipe: "benefit", bobot: 1 });
                    setEditingId(null);
                  }}
                  className="flex items-center gap-2 bg-slate-700 text-white px-6 py-3 rounded-lg hover:bg-slate-600 transition font-medium"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bobot Summary */}
        {kriteria.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <BarChart3 className="text-blue-400" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">Ringkasan Bobot Kriteria</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedNormalizedKriteria.map((item) => (
                <div key={item.id} className="bg-slate-700/50 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{item.nama}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getTipeColor(item.tipe)}`}>
                      {getTipeLabel(item.tipe)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${item.weight * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-cyan-400">
                      {(item.weight * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Bobot: {item.bobot}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-600 border-t-blue-500"></div>
              <span className="ml-3 text-slate-400">Memuat data...</span>
            </div>
          ) : filteredKriteria.length === 0 ? (
            <div className="text-center py-12">
              <Target className="mx-auto text-slate-500 mb-4" size={48} />
              <h3 className="text-lg font-medium text-white mb-2">
                {kriteria.length === 0 ? "Belum ada data kriteria" : "Tidak ada kriteria yang sesuai"}
              </h3>
              <p className="text-slate-400">
                {kriteria.length === 0 ? "Tambahkan kriteria penilaian pertama Anda" : "Coba ubah kata kunci pencarian"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-950 to-purple-950">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Nama Kriteria
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Bobot
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      Bobot Normalisasi
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {sortedFilteredKriteria.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-700/30">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{item.nama}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipeColor(item.tipe)}`}>
                          {getTipeLabel(item.tipe)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {item.bobot}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-700 rounded-full h-2 max-w-24">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${(Number(item.bobot) / totalBobot) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-cyan-400">
                            {totalBobot ? ((Number(item.bobot) / totalBobot) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="flex items-center gap-1 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition text-sm"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1 bg-red-500/20 text-red-300 px-3 py-1 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition text-sm"
                          >
                            <Trash2 size={16} />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Toast Notifications */}
        <div className="fixed bottom-4 right-4 space-y-3 z-50">
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

export default Kriteria;
