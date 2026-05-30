import React, { useState, useEffect, useMemo } from "react";
import { Calculator, CheckCircle, BarChart3, Table2, AlertTriangle } from "lucide-react";
import { getKriteria, updateKriteria } from "../services/api";
import Toast from "../components/Toast";

export default function AHP() {
  const [kriteria, setKriteria] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getKriteria();
      setKriteria(res.data);
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

  // ===== STEP 1: Build Pairwise Comparison Matrix from weights =====
  const pairwiseMatrix = useMemo(() => {
    if (kriteria.length === 0) return [];
    const n = kriteria.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const wi = Number(kriteria[i].bobot) || 1;
        const wj = Number(kriteria[j].bobot) || 1;
        matrix[i][j] = wi / wj;
      }
    }
    return matrix;
  }, [kriteria]);

  // ===== STEP 2: Column sums =====
  const columnSums = useMemo(() => {
    if (pairwiseMatrix.length === 0) return [];
    const n = pairwiseMatrix.length;
    return Array.from({ length: n }, (_, j) =>
      pairwiseMatrix.reduce((sum, row) => sum + row[j], 0)
    );
  }, [pairwiseMatrix]);

  // ===== STEP 3: Normalized Matrix =====
  const normalizedMatrix = useMemo(() => {
    if (pairwiseMatrix.length === 0 || columnSums.length === 0) return [];
    return pairwiseMatrix.map((row) =>
      row.map((val, j) => (columnSums[j] !== 0 ? val / columnSums[j] : 0))
    );
  }, [pairwiseMatrix, columnSums]);

  // ===== STEP 4: Priority Weights (Row averages of normalized matrix) =====
  const priorityWeights = useMemo(() => {
    if (normalizedMatrix.length === 0) return [];
    const n = normalizedMatrix.length;
    return normalizedMatrix.map((row) =>
      row.reduce((sum, val) => sum + val, 0) / n
    );
  }, [normalizedMatrix]);

  // ===== STEP 5: Consistency Check =====
  const consistencyData = useMemo(() => {
    if (priorityWeights.length === 0 || pairwiseMatrix.length === 0) return null;
    const n = priorityWeights.length;

    // Weighted sum = pairwiseMatrix * priorityWeights
    const weightedSum = pairwiseMatrix.map((row) =>
      row.reduce((sum, val, j) => sum + val * priorityWeights[j], 0)
    );

    // Lambda values
    const lambdaValues = weightedSum.map((ws, i) =>
      priorityWeights[i] !== 0 ? ws / priorityWeights[i] : 0
    );

    const lambdaMax = lambdaValues.reduce((sum, val) => sum + val, 0) / n;

    const CI = n > 1 ? (lambdaMax - n) / (n - 1) : 0;

    // Random Index table
    const RI_TABLE = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59];
    const RI = n <= 15 ? RI_TABLE[n - 1] : 1.59;

    const CR = RI !== 0 ? CI / RI : 0;

    return {
      weightedSum,
      lambdaValues,
      lambdaMax,
      CI,
      RI,
      CR,
      isConsistent: CR < 0.1 || n <= 2,
    };
  }, [priorityWeights, pairwiseMatrix]);

  const handleHitung = () => {
    if (kriteria.length < 2) {
      addToast("Minimal 2 kriteria diperlukan untuk perhitungan AHP", "warning");
      return;
    }

    setCalculating(true);

    setTimeout(async () => {
      // Save weights to localStorage for TOPSIS
      const bobotAHP = kriteria.map((k, i) => ({
        id: k.id,
        nama: k.nama,
        tipe: k.tipe,
        bobot_ahp: priorityWeights[i],
      }));
      // save to localStorage (backwards compatibility)
      localStorage.setItem("bobotAHP", JSON.stringify(bobotAHP));

      // Persist bobot_ahp to database (kriteria.bobot_ahp)
      try {
        await Promise.all(
          bobotAHP.map((b) => updateKriteria(b.id, { bobot_ahp: b.bobot_ahp }))
        );
        addToast("Perhitungan AHP berhasil! Bobot tersimpan di database.", "success");
      } catch (err) {
        console.error("Gagal menyimpan bobot AHP:", err);
        addToast("Perhitungan selesai, tetapi gagal menyimpan bobot ke database.", "error");
      } finally {
        setCalculated(true);
        setCalculating(false);
      }
    }, 800);
  };

  const formatNum = (num, decimals = 4) => {
    if (typeof num !== "number" || isNaN(num)) return "0";
    return num.toFixed(decimals);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 relative z-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-600 border-t-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Memuat data kriteria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-5 md:p-8 relative z-10">
      <div className="max-w-7xl mx-auto p-0 sm:p-3 md:p-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30">
              <Calculator className="text-blue-400" size={32} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Analisis AHP</h1>
              <p className="text-slate-400 mt-1">Analytic Hierarchy Process — Penentuan Bobot Kriteria</p>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
              <div className="text-2xl font-bold text-blue-400">{kriteria.length}</div>
              <div className="text-sm text-slate-400">Total Kriteria</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
              <div className="text-2xl font-bold text-emerald-400">
                {calculated ? formatNum(consistencyData?.CR, 4) : "-"}
              </div>
              <div className="text-sm text-slate-400">Consistency Ratio (CR)</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <div className={`text-2xl font-bold ${calculated ? (consistencyData?.isConsistent ? 'text-emerald-400' : 'text-red-400') : 'text-slate-400'}`}>
                  {calculated ? (consistencyData?.isConsistent ? "KONSISTEN" : "TIDAK KONSISTEN") : "-"}
                </div>
              </div>
              <div className="text-sm text-slate-400">Status Konsistensi</div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Calculator className="text-blue-400" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Perhitungan AHP</h2>
                <p className="text-sm text-slate-400">Hitung bobot prioritas kriteria menggunakan metode AHP</p>
              </div>
            </div>
            <button
              onClick={handleHitung}
              disabled={calculating || kriteria.length < 2}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 sm:px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 w-full sm:w-auto justify-center text-sm sm:text-base"
            >
              {calculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                  Menghitung...
                </>
              ) : (
                <>
                  <Calculator size={20} />
                  Hitung AHP
                </>
              )}
            </button>
          </div>

          {/* Steps */}
          <div className="mt-4 sm:mt-6 bg-slate-700/50 rounded-xl p-3 sm:p-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">Tahapan AHP:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 text-sm">
              {[
                { step: 1, label: "Matriks Perbandingan", color: "indigo" },
                { step: 2, label: "Jumlah Kolom", color: "blue" },
                { step: 3, label: "Normalisasi", color: "violet" },
                { step: 4, label: "Bobot Prioritas", color: "emerald" },
                { step: 5, label: "Uji Konsistensi", color: "amber" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-2">
                  <div className={`w-7 h-7 bg-${item.color}-100 rounded-full flex items-center justify-center text-xs font-bold text-${item.color}-600`}>
                    {calculated ? "✓" : item.step}
                  </div>
                  <span className="text-slate-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== DETAILED CALCULATION TABLES ===== */}
        {calculated && kriteria.length >= 2 && (
          <div className="space-y-6">

            {/* TABLE 1: Pairwise Comparison Matrix */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                  <Table2 className="text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">1. Matriks Perbandingan Berpasangan</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Rasio kepentingan antar kriteria (w<sub>i</sub> / w<sub>j</sub>)</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                      <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Kriteria</th>
                      {kriteria.map((k) => (
                        <th key={k.id} className="px-4 py-3 text-center font-semibold">{k.nama}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {kriteria.map((k, i) => (
                      <tr key={k.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-blue-300 bg-slate-700/30">{k.nama}</td>
                        {pairwiseMatrix[i]?.map((val, j) => (
                          <td key={j} className={`px-4 py-3 text-center ${i === j ? 'bg-blue-900/30 font-bold text-blue-300' : 'text-slate-300'}`}>
                            {formatNum(val, 2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-blue-900/40 font-bold">
                      <td className="px-4 py-3 text-white">Jumlah Kolom</td>
                      {columnSums.map((val, j) => (
                        <td key={j} className="px-4 py-3 text-center text-blue-300">{formatNum(val, 2)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLE 2: Normalized Matrix */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-violet-900/300/20 rounded-lg border border-violet-500/30">
                  <Table2 className="text-violet-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">2. Matriks Normalisasi</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Setiap elemen dibagi dengan jumlah kolomnya</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-violet-600 text-white">
                      <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Kriteria</th>
                      {kriteria.map((k) => (
                        <th key={k.id} className="px-4 py-3 text-center font-semibold">{k.nama}</th>
                      ))}
                      <th className="px-4 py-3 text-center font-semibold bg-violet-700 rounded-tr-lg">Rata-rata (Bobot)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {kriteria.map((k, i) => (
                      <tr key={k.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-blue-300 bg-slate-700/30">{k.nama}</td>
                        {normalizedMatrix[i]?.map((val, j) => (
                          <td key={j} className="px-4 py-3 text-center text-slate-300">{formatNum(val)}</td>
                        ))}
                        <td className="px-4 py-3 text-center font-bold text-violet-300 bg-violet-900/30">
                          {formatNum(priorityWeights[i])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLE 3: Priority Weights Summary */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                  <BarChart3 className="text-emerald-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">3. Bobot Prioritas Kriteria</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Hasil akhir bobot yang akan digunakan di TOPSIS</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead>
                    <tr className="bg-emerald-600 text-white">
                      <th className="px-4 py-3 text-left font-semibold rounded-tl-lg whitespace-nowrap">No</th>
                      <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Kriteria</th>
                      <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">Tipe</th>
                      <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">Bobot Asli</th>
                      <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">Bobot AHP</th>
                      <th className="px-4 py-3 text-center font-semibold rounded-tr-lg whitespace-nowrap">Persentase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {kriteria.map((k, i) => (
                      <tr key={k.id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                        <td className="px-4 py-3 font-semibold text-white">{k.nama}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex whitespace-nowrap px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                            k.tipe === "benefit" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"
                          }`}>
                            {k.tipe === "benefit" ? "Benefit" : "Cost"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-slate-300">{Number(k.bobot).toFixed(2)}</td>
                        <td className="px-4 py-3 text-center font-bold text-emerald-400">{formatNum(priorityWeights[i])}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center gap-2 justify-center">
                            <div className="w-16 bg-slate-700 rounded-full h-2">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${priorityWeights[i] * 100}%` }}></div>
                            </div>
                            <span className="text-sm font-medium text-emerald-400">{(priorityWeights[i] * 100).toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-emerald-900/30 font-bold border-t-2 border-emerald-500/30">
                      <td colSpan="4" className="px-4 py-3 text-right text-white">Total</td>
                      <td className="px-4 py-3 text-center text-emerald-400">
                        {formatNum(priorityWeights.reduce((s, v) => s + v, 0))}
                      </td>
                      <td className="px-4 py-3 text-center text-emerald-400">100.0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLE 4: Consistency Check */}
            {consistencyData && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-3 sm:p-4 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${consistencyData.isConsistent ? 'bg-emerald-100' : 'bg-red-500/20'}`}>
                    {consistencyData.isConsistent ? (
                      <CheckCircle className="text-emerald-400" size={20} />
                    ) : (
                      <AlertTriangle className="text-red-400" size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">4. Uji Konsistensi</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Consistency Ratio (CR) harus &lt; 0.10 agar dianggap konsisten</p>
                  </div>
                </div>

                {/* Weighted Sum & Lambda */}
                <div className="overflow-x-auto mb-4 sm:mb-6 -mx-1 sm:mx-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-amber-600 text-white">
                        <th className="px-4 py-3 text-left font-semibold rounded-tl-lg">Kriteria</th>
                        <th className="px-4 py-3 text-center font-semibold">Bobot (w)</th>
                        <th className="px-4 py-3 text-center font-semibold">Weighted Sum</th>
                        <th className="px-4 py-3 text-center font-semibold rounded-tr-lg">λ (WS/w)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {kriteria.map((k, i) => (
                        <tr key={k.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-4 py-3 font-semibold text-white">{k.nama}</td>
                          <td className="px-4 py-3 text-center text-slate-300">{formatNum(priorityWeights[i])}</td>
                          <td className="px-4 py-3 text-center text-slate-300">{formatNum(consistencyData.weightedSum[i])}</td>
                          <td className="px-4 py-3 text-center font-bold text-amber-400">{formatNum(consistencyData.lambdaValues[i])}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Values */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                  <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-xs text-slate-400 mb-1">λ max</div>
                    <div className="text-xl font-bold text-white">{formatNum(consistencyData.lambdaMax)}</div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-xs text-slate-400 mb-1">CI (Consistency Index)</div>
                    <div className="text-xl font-bold text-white">{formatNum(consistencyData.CI)}</div>
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="text-xs text-slate-400 mb-1">RI (Random Index)</div>
                    <div className="text-xl font-bold text-white">{formatNum(consistencyData.RI, 2)}</div>
                  </div>
                  <div className={`p-4 rounded-xl border-2 ${consistencyData.isConsistent ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                    <div className="text-xs text-slate-400 mb-1">CR (Consistency Ratio)</div>
                    <div className={`text-xl font-bold ${consistencyData.isConsistent ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatNum(consistencyData.CR)}
                    </div>
                    <div className={`text-xs font-medium mt-1 ${consistencyData.isConsistent ? 'text-emerald-400' : 'text-red-400'}`}>
                      {consistencyData.isConsistent ? "✓ KONSISTEN (CR < 0.10)" : "✗ TIDAK KONSISTEN (CR ≥ 0.10)"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="text-emerald-400" size={16} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-emerald-300 mb-2">Perhitungan AHP Selesai</h4>
                  <p className="text-emerald-400 mb-3">
                    Bobot prioritas kriteria telah berhasil dihitung dan disimpan. Lanjutkan ke halaman TOPSIS untuk melakukan perangkingan alternatif.
                  </p>
                  <button
                    onClick={() => (window.location.href = "/topsis")}
                    className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition text-sm font-semibold shadow-lg shadow-emerald-500/25"
                  >
                    Lanjut ke TOPSIS →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {kriteria.length < 2 && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-12 text-center">
            <Calculator className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-white mb-2">Data Kriteria Belum Cukup</h3>
            <p className="text-slate-500 mb-4">Minimal 2 kriteria diperlukan untuk perhitungan AHP.</p>
            <button
              onClick={() => (window.location.href = "/kriteria")}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition text-sm font-semibold"
            >
              Kelola Kriteria
            </button>
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