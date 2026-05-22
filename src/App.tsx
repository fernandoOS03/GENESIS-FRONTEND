import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import FormularioPage from './features/formulario/pages/FormularioPage';
import EditarViajePage from './features/viaje/pages/EditarViajePage';
import DashboardPage from './features/admin/pages/DashboardPage';
import LogisticaPage from './features/admin/pages/LogisticaPage';
import ReportesPage from './features/admin/pages/ReportesPage';

function App() {
  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
