import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import FormularioPage from './features/formulario/pages/FormularioPage';
import EditarViajePage from './features/viaje/pages/EditarViajePage';
import DashboardPage from './features/admin/pages/DashboardPage';
import LogisticaPage from './features/admin/pages/LogisticaPage';
import ReportesPage from './features/admin/pages/ReportesPage';
import UsuariosPage from './features/admin/pages/UsuariosPage';
import ParticipantesPage from './features/admin/pages/ParticipantesPage';
import PagosPage from './features/admin/pages/PagosPage';
import LoginPage from './features/auth/pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors theme="light" style={{ zIndex: 999999 }} />
      <Routes>
        {/* ── Formulario público ── */}
        <Route
          path="/"
          element={
            <MainLayout>
              <FormularioPage />
            </MainLayout>
          }
        />
        <Route path="/editar-viaje/:token" element={<EditarViajePage />} />
        <Route path="/editar-viaje" element={<EditarViajePage />} />

        {/* ── Autenticación ── */}
        <Route path="/login" element={<LoginPage />} />

        {/* ── Panel Admin ── */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <DashboardPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/logistica"
          element={
            <AdminLayout>
              <LogisticaPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/reportes"
          element={
            <AdminLayout>
              <ReportesPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <AdminLayout>
              <UsuariosPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/participantes"
          element={
            <AdminLayout>
              <ParticipantesPage />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/pagos"
          element={
            <AdminLayout>
              <PagosPage />
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
