import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Bell, Shield, Settings as SettingsIcon, Camera, Save, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

function Settings() {
  const { admin, updateProfile } = useAuth();
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    phone: admin?.phone || '',
    avatar: admin?.avatar || 'https://i.pravatar.cc/150?img=1',
  });

  useEffect(() => {
    if (admin) {
      setProfileData({
        name: admin.name || '',
        email: admin.email || '',
        phone: admin.phone || '',
        avatar: admin.avatar || 'https://i.pravatar.cc/150?img=1',
      });
    }
  }, [admin]);

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotification: true,
    pushNotification: true,
    reportNotification: true,
  });

  const addToast = (message, type = 'info') => {
    const id = Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarUrl = reader.result;
        setProfileData((prev) => ({
          ...prev,
          avatar: avatarUrl,
        }));
        updateProfile({ avatar: avatarUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate save
      setTimeout(() => {
        updateProfile(profileData);
        addToast('Profil berhasil disimpan', 'success');
        setLoading(false);
      }, 800);
    } catch (error) {
      addToast('Gagal menyimpan profil', 'error');
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      addToast('Semua field harus diisi', 'warning');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast('Password baru tidak cocok', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      addToast('Password minimal 6 karakter', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Simulate password change
      setTimeout(() => {
        addToast('Password berhasil diubah', 'success');
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setLoading(false);
      }, 800);
    } catch (error) {
      addToast('Gagal mengubah password', 'error');
      setLoading(false);
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
    addToast('Pengaturan notifikasi berhasil disimpan', 'success');
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User, color: 'indigo' },
    { id: 'password', label: 'Keamanan', icon: Key, color: 'emerald' },
    { id: 'notifications', label: 'Notifikasi', icon: Bell, color: 'violet' },
  ];

  return (
    <div className="p-8 relative z-10">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30">
              <SettingsIcon className="text-blue-400" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Pengaturan</h1>
              <p className="text-slate-400 mt-1">Kelola profil, keamanan, dan preferensi sistem</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      isActive
                        ? `bg-${tab.color}-600 text-white shadow-sm`
                        : 'text-slate-400 hover:bg-slate-700/30 hover:text-slate-200'
                    }`}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <User className="text-blue-400" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Edit Profil</h2>
                <p className="text-slate-400">Perbarui informasi profil Anda</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-8">
              {/* Avatar Section */}
              <div className="flex items-start gap-8">
                <div className="relative">
                  <img
                    src={profileData.avatar}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-600"
                  />
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">Foto Profil</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Upload foto profil baru. Ukuran file maksimal 5MB dengan format JPG, PNG, atau GIF.
                  </p>
                  <div className="text-xs text-slate-500">
                    Rekomendasi: Gunakan foto dengan rasio 1:1 untuk hasil terbaik
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">
                    <User size={16} className="inline mr-2" />
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">
                    <Mail size={16} className="inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Masukkan alamat email"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">
                    📱 Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="+62 812-3456-7890"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-700/50">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Simpan Profil
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <Key className="text-emerald-400" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Keamanan Akun</h2>
                <p className="text-slate-400">Ubah password untuk menjaga keamanan akun</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="max-w-md space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  Password Lama
                </label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Masukkan password lama"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  Password Baru
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-300">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Ulangi password baru"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="text-yellow-400 mt-0.5" size={16} />
                  <div className="text-sm text-yellow-300">
                    <strong>Tips Keamanan:</strong> Gunakan kombinasi huruf besar, kecil, angka, dan simbol.
                    Hindari menggunakan informasi pribadi yang mudah ditebak.
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                    Mengubah...
                  </>
                ) : (
                  <>
                    <Key size={20} />
                    Ubah Password
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Bell className="text-purple-400" size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Pengaturan Notifikasi</h2>
                <p className="text-slate-400">Kelola preferensi notifikasi sistem</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <Mail className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Notifikasi Email</h3>
                      <p className="text-sm text-slate-400">Terima notifikasi via email untuk aktivitas penting</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotification}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailNotification: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-800/50 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <Bell className="text-emerald-400" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Notifikasi Push</h3>
                      <p className="text-sm text-slate-400">Terima notifikasi push di browser untuk update real-time</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotification}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          pushNotification: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-800/50 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Shield className="text-orange-600" size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Notifikasi Laporan</h3>
                      <p className="text-sm text-slate-400">Diberitahu saat ada laporan analisis baru selesai</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.reportNotification}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          reportNotification: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-800/50 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-700/50">
                <button
                  onClick={handleSaveNotifications}
                  className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  <Save size={20} />
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          </div>
        )}

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

export default Settings;
