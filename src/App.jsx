import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Asegúrate de importar el Provider
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Registrar from './pages/Registrar';
import Vehiculos from './pages/Vehiculos';
import Celulares from './pages/Celulares.';
import EditarCelular from './pages/EditarCelular';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registrar" element={<Registrar />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/vehiculos" element={<Vehiculos />} />
            {/* Solo una vez */}
            <Route path="/celulares" element={<Celulares />} />
            <Route path="/celulares/editar/:id" element={<EditarCelular />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;