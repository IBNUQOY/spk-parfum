import { useState, useEffect } from 'react';
import { Zap, Package, Layers, Trophy, TrendingUp, Activity } from 'lucide-react';
import API from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ alternatif: 0, kriteria: 0, nilai: 0, hasil: 0 });
  const [topAlternatif, setTopAlternatif] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [altRes, kritRes, nilRes, hasilRes] = await Promise.all([
        API.get('/alternatif'), API.get('/kriteria'), API.get('/nilai'), API.get('/hasil')
      ]);
      setStats({ alternatif: altRes.data.length, kriteria: kritRes.data.length, nilai: nilRes.data.length, hasil: hasilRes.data.length });
      if (hasilRes.data.length > 0) {
        const sorted = hasilRes.data.sort((a, b) => b.skor - a.skor);
        setTopAlternatif(sorted[0]);
      }
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const statCards = [
    { label: 'Total Alternatif', value: stats.alternatif, icon: Package, gradient: 'from-blue-500 to-cyan-500', lightGradient: 'from-blue-500/20 to-cyan-500/20' },
    { label: 'Total Kriteria', value: stats.kriteria, icon: Layers, gradient: 'from-violet-500 to-purple-500', lightGradient: 'from-violet-500/20 to-purple-500/20' },
    { label: 'Data Nilai', value: stats.nilai, icon: Zap, gradient: 'from-amber-500 to-orange-500', lightGradient: 'from-amber-500/20 to-orange-500/20' },
    { label: 'Hasil Ranking', value: stats.hasil, icon: Trophy, gradient: 'from-emerald-500 to-teal-500', lightGradient: 'from-emerald-500/20 to-teal-500/20' }
  ];

  return (
    <div className='min-h-screen relative'>

      <div className='p-6 sm:p-8 max-w-7xl mx-auto relative z-10'>
        {/* Header Section */}
        <div className='mb-12'>
          <div className='inline-block mb-4'>
            <span className='text-sm font-semibold text-blue-400 bg-blue-500/10 px-4 py-1 rounded-full border border-blue-500/30'>Dashboard</span>
          </div>
          <h1 className='text-4xl sm:text-5xl font-bold text-white mb-3'>SPK Parfum</h1>
          <p className='text-base sm:text-lg text-slate-400'>Sistem Pendukung Keputusan untuk Seleksi Alternatif Parfum Terbaik</p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div 
                key={i} 
                className='group card'
              >
                <div className='relative'>
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-500`}></div>
                  
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.lightGradient} flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300`}>
                    <Icon size={28} className={`bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`} />
                  </div>
                  
                  <div className='text-sm font-medium text-slate-500 mb-2'>{card.label}</div>
                  <div className='text-4xl font-bold text-white mb-2'>{card.value}</div>
                  <div className='flex items-center gap-2 text-sm text-emerald-400'>
                    <TrendingUp size={14} />
                    <span>Active</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        {/* Main Content Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
          {/* Top Result Card */}
          <div className='lg:col-span-2 card'>
            <div className='mb-6'>
              <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold text-white'>Hasil Terbaik</h2>
                <div className='h-3 w-3 bg-emerald-500 rounded-full'></div>
              </div>
            </div>

            {loading ? (
              <div className='text-center py-16'>
                <div className='inline-block'>
                  <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full' style={{borderRadius: '50%', borderTop: '3px solid transparent'}}></div>
                </div>
                <p className='text-slate-400 mt-4'>Memuat data...</p>
              </div>
            ) : topAlternatif ? (
              <div className='bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-2xl p-10 border border-blue-500/30 backdrop-blur-sm group hover:border-blue-500/50 transition-all duration-300'>
                <div className='text-center'>
                  <div className='text-7xl mb-6'>
                    {/*<span>👑</span>*/}
                  </div>
                  <p className='text-slate-300 text-sm font-semibold mb-2 uppercase tracking-wider'>Pilihan Terbaik</p>
                  <h3 className='text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6'>{topAlternatif.nama}</h3>
                  <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                    <div className='px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full text-white font-bold shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300'>
                      Skor: {parseFloat(topAlternatif.skor).toFixed(4)}
                    </div>
                  </div>
                  <p className='text-slate-400 text-sm mt-6'>Berdasarkan perhitungan AHP dan TOPSIS</p>
                </div>
              </div>
            ) : (
              <div className='text-center py-12 rounded-2xl border-2 border-dashed border-slate-600/50'>
                <Activity size={40} className='text-slate-500 mx-auto mb-3' />
                <p className='text-slate-400'>Belum ada hasil. Lengkapi analisis terlebih dahulu.</p>
              </div>
            )}
          </div>

          {/* System Info Card */}
          <div className='card'>
            <h2 className='text-2xl font-bold text-white mb-6'>Informasi Sistem</h2>
            <div className='space-y-6'>
              <div>
                <h3 className='text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider'>Metode Analisis</h3>
                <div className='space-y-3'>
                  <div className='flex items-start gap-3'>
                    <div className='w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-1.5'></div>
                    <div>
                      <p className='text-sm font-semibold text-slate-200'>AHP</p>
                      <p className='text-xs text-slate-500'>Analytic Hierarchy Process</p>
                    </div>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-1.5'></div>
                    <div>
                      <p className='text-sm font-semibold text-slate-200'>TOPSIS</p>
                      <p className='text-xs text-slate-500'>Technique for Order Preference</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='h-px bg-gradient-to-r from-slate-700 to-transparent'></div>
              
              <div>
                <h3 className='text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider'>Status Sistem</h3>
                <div className='flex items-center gap-3'>
                  <div className={`w-3 h-3 rounded-full ${stats.hasil > 0 ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                  <span className='text-sm text-slate-300'>{stats.hasil > 0 ? 'Siap Digunakan' : 'Menunggu Data'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className='card'>
          <h2 className='text-2xl font-bold text-white mb-8'>Alur Kerja Sistem</h2>
          <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
            {[
              { step: 1, label: 'Alternatif', desc: 'Daftar produk', icon: 'list' },
              { step: 2, label: 'Kriteria', desc: 'Parameter', icon: 'check' },
              { step: 3, label: 'AHP', desc: 'Prioritas', icon: 'chart' },
              { step: 4, label: 'TOPSIS', desc: 'Ranking', icon: 'trending' },
              { step: 5, label: 'Hasil', desc: 'Keputusan', icon: 'award' }
            ].map((item, idx) => (
              <div key={item.step} className='relative group'>
                <div className='text-center'>
                  <div className='relative mb-4'>
                    <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300'></div>
                    <div className='relative w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/50 flex items-center justify-center text-lg font-bold text-white group-hover:border-blue-500 group-hover:bg-blue-500/40 transition-all duration-300'>
                      {item.step}
                    </div>
                  </div>
                  <h3 className='font-semibold text-slate-100 text-sm mb-1'>{item.label}</h3>
                  <p className='text-xs text-slate-500'>{item.desc}</p>
                </div>
                
                {idx < 4 && (
                  <div className='absolute top-6 -right-6 w-12 h-1 bg-gradient-to-r from-blue-500 to-transparent hidden md:block'></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
