import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importación faltante
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig"; // Importación necesaria

function Perfil() {
    const [datosPerfil, setDatosPerfil] = useState(null);
    const [error, setError] = useState('');

    const { token, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { // Corregido: sintaxis de useEffect
        const cargarPerfil = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/auth/perfil`, { // Corregido: comillas invertidas
                    headers: {
                        'Authorization': `Bearer ${token}` // Corregido: comillas invertidas
                    }
                });

                if (!response.ok) {
                    throw new Error('No se pudo cargar el perfil, inicie sesión nuevamente');
                }

                const datos = await response.json();
                setDatosPerfil(datos);
            } catch (err) {
                setError(err.message);
            }
        };

        if (token) {
            cargarPerfil();
        }
    }, [token]);

    const manejarLogout = async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }

            })

        } catch (err) {
            console.log("Error de red al intentar revocar al token: " + err)

        }
        logout();
        navigate('/login')
    }

    // Manejo de carga o error antes de renderizar
    if (error) return <div className="login-page"><div className="auth-container">Error: {error}</div></div>;
    if (!datosPerfil) return <div className="login-page"><div className="auth-container">Cargando...</div></div>;

    return (
        <div className="login-page">
            <div className="auth-container">
                <div className="icon-circle">👤</div>
                <h2>Perfil de Usuario</h2>

                <div className="perfil-info">
                    <p><strong>Mensaje:</strong> {datosPerfil.Mensaje}</p>
                    <p><strong>Usuario:</strong> {datosPerfil.Usuario}</p>
                    <p><strong>Rol:</strong> {datosPerfil.rol_detectado}</p>
                    <p><strong>Status:</strong> {datosPerfil.status}</p>
                </div>

                <button onClick={manejarLogout} className="btn-logout">Cerrar Sesión</button>

                <button onClick={() => navigate("/vehiculos")} className="btn-logout">Gestionar Vehiculos</button>

                <button onClick={() => navigate("/celulares")} className="btn-logout">Gestionar Celulares</button>

            </div>
        </div>
    );
}

export default Perfil;