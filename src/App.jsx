import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";
import Alternatif from "./pages/Alternatif";
import AHP from "./pages/AHP";
import TOPSIS from "./pages/TOPSIS";
import Hasil from "./pages/Hasil";
import Kriteria from "./pages/Kriteria";
import Report from "./pages/Report";
import Settings from "./pages/Settings";
import Database from "./pages/Database";

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm md:hidden"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 ml-0 md:ml-64 relative z-10 transition-all duration-300">
        <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-slate-800/90 p-2 text-slate-100 shadow-lg shadow-slate-950/20 transition hover:bg-slate-700/95"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="text-sm font-semibold text-slate-100 tracking-wide">SPK Parfum</div>
          </div>
        </div>

        <main className="min-h-screen mx-auto w-full max-w-[1800px] px-4 py-4 md:px-6 lg:px-8 xl:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DashboardPage />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/alternatif"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Alternatif />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/kriteria"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Kriteria />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/ahp"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <AHP />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/topsis"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <TOPSIS />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/hasil"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Hasil />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Report />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/database"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Database />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;