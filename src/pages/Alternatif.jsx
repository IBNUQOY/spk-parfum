import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Package, Search, Filter } from "lucide-react";
import Toast from "../components/Toast";
import {
  getAlternatif,
  createAlternatif,
  updateAlternatif,
  deleteAlternatif,
} from "../services/api";

function Alternatif() {
  const [alternatif, setAlternatif] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterHarga, setFilterHarga] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    kelompok_harga: "20rb-30rb",
    komisi: "",
    harga_detail: "",
    rating: "",
    klasifikasi: "UNISEX",
    jumlah_penjualan: "",
    konsentrasi: "",
  });

  const [editingId, setEditingId] = useState(null);

  const pilihanHarga = [
    "20rb-30rb",
    "30rb-50rb",
    "50rb-80rb",
    "80rb-120rb",
  ];

  const pilihanKlasifikasi = [
    "UNISEX",
    "PRIA",
    "WANITA",
  ];

  const pilihanKonsentrasi = [
    { label: "Eau de Cologne (EDC)", value: 1 },
    { label: "Eau de Toilette (EDT)", value: 2 },
    { label: "Eau de Parfum (EDP)", value: 3 },
    { label: "Extrait de Parfum", value: 4 },
  ];

  const getKonsentrasiLabel = (value) => {
    const found = pilihanKonsentrasi.find((k) => k.value === Number(value));
    return found ? found.label : "-";
  };

  const getKonsentrasiBadge = (value) => {
    const badges = {
      1: "bg-slate-500/20 text-slate-300 border-slate-500/30",
      2: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      3: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      4: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    };
    return badges[Number(value)] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAlternatif();
      setAlternatif(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      addToast("Gagal memuat data", "error");
    }
  };

  const addToast = (message, type = "info") => {
    const id = Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama.trim()) {
      addToast("Nama parfum harus diisi", "warning");
      return;
    }

    try {
      setLoading(true);
      if (editingId) {
        await updateAlternatif(editingId, formData);
        addToast("Data berhasil diupdate", "success");
      } else {
        await createAlternatif(formData);
        addToast("Data berhasil ditambahkan", "success");
      }

      setFormData({
        nama: "",
        deskripsi: "",
        kelompok_harga: "20rb-30rb",
        komisi: "",
        harga_detail: "",
        rating: "",
        klasifikasi: "UNISEX",
        jumlah_penjualan: "",
        konsentrasi: "",
      });

      setEditingId(null);
      setShowForm(false);
      await fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      addToast(`Gagal menyimpan data: ${error.message || error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setShowForm(true);
    setFormData({
      nama: item.nama,
      deskripsi: item.deskripsi,
      kelompok_harga: item.kelompok_harga,
      komisi: item.komisi || "",
      harga_detail: item.harga_detail || "",
      rating: item.rating || "",
      klasifikasi: item.klasifikasi || "UNISEX",
      jumlah_penjualan: item.jumlah_penjualan || "",
      konsentrasi: item.konsentrasi || "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus alternatif ini?")) {
      try {
        setLoading(true);
        await deleteAlternatif(id);
        addToast("Data berhasil dihapus", "success");
        await fetchData();
      } catch (error) {
        console.error("Error deleting data:", error);
        addToast("Gagal menghapus data", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      nama: "",
      deskripsi: "",
      kelompok_harga: "20rb-30rb",
      komisi: "",
      harga_detail: "",
      rating: "",
      klasifikasi: "UNISEX",
      jumlah_penjualan: "",
      konsentrasi: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Filter data berdasarkan search dan filter harga
  const filteredAlternatif = alternatif.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterHarga === "" || item.kelompok_harga === filterHarga;
    return matchesSearch && matchesFilter;
  });

  // Sort hasil filter berdasarkan nama (A-Z)
  const sortedFilteredAlternatif = [...filteredAlternatif].sort((a, b) => {
    return a.nama.localeCompare(b.nama);
  });

  const getHargaColor = (harga) => {
    const colors = {
      "20rb-30rb": "bg-green-100 text-green-800",
      "30rb-50rb": "bg-blue-100 text-blue-800",
      "50rb-80rb": "bg-yellow-100 text-yellow-800",
      "80rb-120rb": "bg-red-100 text-red-800",
    };
    return colors[harga] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen relative">

      <div className="max-w-7xl mx-auto p-8 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className='inline-block mb-4'>
            <span className='text-sm font-semibold text-blue-400 bg-blue-500/10 px-4 py-1 rounded-full border border-blue-500/30'>Manajemen Alternatif</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30">
              <Package className="text-blue-400" size={36} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Kelola Alternatif</h1>
              <p className="text-slate-400 mt-2">Daftar produk parfum yang akan dievaluasi dalam sistem</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            {[
              { label: 'Total Alternatif', value: alternatif.length, gradient: 'from-blue-500 to-cyan-500' },
              { label: 'Parfum Pria', value: alternatif.filter(a => a.klasifikasi === "PRIA").length, gradient: 'from-blue-600 to-blue-400' },
              { label: 'Parfum Wanita', value: alternatif.filter(a => a.klasifikasi === "WANITA").length, gradient: 'from-pink-500 to-rose-400' },
              { label: 'Unisex', value: alternatif.filter(a => a.klasifikasi === "UNISEX").length, gradient: 'from-purple-500 to-indigo-400' }
            ].map((stat, i) => (
              <div key={i} className="card group">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-500`}></div>
                <div className='relative'>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} bg-opacity-20 mb-4`}></div>
                  <div className='text-sm font-medium text-slate-400 mb-2'>{stat.label}</div>
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
                <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="text"
                  placeholder="Cari nama atau deskripsi parfum..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-12"
                />
              </div>
            </div>
            <div className="md:w-56">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={20} />
                <select
                  value={filterHarga}
                  onChange={(e) => setFilterHarga(e.target.value)}
                  className="form-select pl-12 appearance-none"
                >
                  <option value="">Semua Kelompok Harga</option>
                  {pilihanHarga.map((harga) => (
                    <option key={harga} value={harga}>{harga}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                setShowForm(true);
                setFormData({ 
                  nama: "", 
                  deskripsi: "", 
                  kelompok_harga: "20rb-30rb",
                  komisi: "",
                  harga_detail: "",
                  rating: "",
                  klasifikasi: "UNISEX",
                  jumlah_penjualan: "",
                  konsentrasi: "",
                });
                setEditingId(null);
              }}
              className="btn btn-primary flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              Tambah
            </button>
          </div>
        </div>

        {/* Form */}
        {(showForm || editingId) && (
                    <div className="card mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Edit2 className="text-blue-400" size={20} />
              </div>
              <h2 className="text-2xl font-bold text-white">
                {editingId ? "Edit Alternatif" : "Tambah Alternatif Baru"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">Nama Parfum *</label>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama parfum"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Klasifikasi</label>
                <select
                  name="klasifikasi"
                  value={formData.klasifikasi}
                  onChange={handleChange}
                  className="form-select"
                >
                  {pilihanKlasifikasi.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Kelompok Harga</label>
                <select
                  name="kelompok_harga"
                  value={formData.kelompok_harga}
                  onChange={handleChange}
                  className="form-select"
                >
                  {pilihanHarga.map((harga) => (
                    <option key={harga} value={harga}>{harga}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Harga Detail (Rp)</label>
                <input
                  type="number"
                  name="harga_detail"
                  value={formData.harga_detail}
                  onChange={handleChange}
                  placeholder="Contoh: 45000"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Komisi (Rp)</label>
                <input
                  type="number"
                  name="komisi"
                  value={formData.komisi}
                  onChange={handleChange}
                  placeholder="Contoh: 3840"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rating (1-5)</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="Contoh: 4.5"
                  min="1"
                  max="5"
                  step="0.1"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Jumlah Penjualan / Bulan</label>
                <input
                  type="number"
                  name="jumlah_penjualan"
                  value={formData.jumlah_penjualan}
                  onChange={handleChange}
                  placeholder="Contoh: 150"
                  min="0"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Jenis Konsentrasi Parfum</label>
                <select
                  name="konsentrasi"
                  value={formData.konsentrasi}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">-- Pilih Konsentrasi --</option>
                  {pilihanKonsentrasi.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label} (Nilai: {k.value})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Semakin tinggi nilai, semakin bagus kualitas dan ketahanan parfum</p>
              </div>

              <div className="md:col-span-2 form-group">
                <label className="form-label">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  placeholder="Masukkan deskripsi parfum (opsional)"
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="md:col-span-2 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <Plus size={20} />
                  {editingId ? "Update" : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data Table */}
                <div className="card">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="spinner"></div>
              <span className="ml-4 text-slate-400">Memuat data...</span>
            </div>
          ) : filteredAlternatif.length === 0 ? (
            <div className="empty-state">
              <Package className="empty-state-icon" size={48} />
              <h3 className="empty-state-text">
                {alternatif.length === 0 ? "Belum ada data alternatif" : "Tidak ada data yang sesuai filter"}
              </h3>
              <p className="empty-state-subtext">
                {alternatif.length === 0 ? "Tambahkan alternatif parfum pertama Anda" : "Coba ubah kata kunci pencarian atau filter"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Parfum</th>
                    <th>Klasifikasi</th>
                    <th>Harga Detail</th>
                    <th>Komisi</th>
                    <th>Rating</th>
                    <th>Penjualan/Bulan</th>
                    <th>Konsentrasi</th>
                    <th>Kelompok Harga</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFilteredAlternatif.map((item, index) => (
                    <tr key={item.id}>
                      <td className="font-medium text-slate-200">{index + 1}</td>
                      <td className="font-medium text-white">{item.nama}</td>
                      <td>
                        <span className={`badge-${
                          item.klasifikasi === 'PRIA' ? 'primary' :
                          item.klasifikasi === 'WANITA' ? 'danger' :
                          'warning'
                        }`}>
                          {item.klasifikasi || "-"}
                        </span>
                      </td>
                      <td className="text-slate-300">
                        {item.harga_detail ? `Rp ${item.harga_detail.toLocaleString('id-ID')}` : "-"}
                      </td>
                      <td className="text-slate-300">
                        {item.komisi ? `Rp ${item.komisi.toLocaleString('id-ID')}` : "-"}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-300">{item.rating || "-"}</span>
                          {item.rating && <span className="text-yellow-400">★</span>}
                        </div>
                      </td>
                      <td className="text-slate-300">
                        {item.jumlah_penjualan ? `${Number(item.jumlah_penjualan).toLocaleString('id-ID')} pcs` : "-"}
                      </td>
                      <td>
                        {item.konsentrasi ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getKonsentrasiBadge(item.konsentrasi)}`}>
                            {getKonsentrasiLabel(item.konsentrasi)}
                          </span>
                        ) : "-"}
                      </td>
                      <td>
                        <span className="badge-primary">{item.kelompok_harga}</span>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="btn-icon btn-edit"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn-icon btn-delete"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
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
      </div>

      {/* Toast notifications */}
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
  );
}

export default Alternatif;