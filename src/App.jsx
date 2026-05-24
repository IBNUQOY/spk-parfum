import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>
      
      <Sidebar />
      <div className="flex-1 ml-64 relative z-10">
        {children}
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