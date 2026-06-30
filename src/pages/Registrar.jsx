import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";

function Registrar() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('USER');
    const [mensaje, setMensaje] = useState('');

    const navigate = useNavigate();

    const manejarRegistro = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/auth/registrar`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, rol })
            });

            if (response.status === 201) {
                setMensaje("¡Registro exitoso! Redirigiendo al login...");
                setTimeout(() => navigate('/login'), 2000);
            } else {
                throw new Error("Error al registrar usuario");
            }
        } catch (err) {
            setMensaje(err.message);
        }
    };
return (
        <div className="login-page">
            <div className="auth-container">
                <div className="icon-circle">👤</div>
                <h2>Crear Cuenta</h2>
                
                <form onSubmit={manejarRegistro}>
                    {/* Input con etiqueta incluida en el placeholder */}
                    <input 
                        type="text" 
                        placeholder="Usuario" 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    
                    <label style={{ fontSize: '0.8rem', color: '#666' }}>Selecciona tu rol:</label>
                    <select onChange={(e) => setRol(e.target.value)} style={{marginBottom: '20px'}}>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                    
                    <button type="submit">CREAR CUENTA</button>
                    
                    <p style={{ marginTop: '15px' }}>
                        <Link to="/login">Volver al Login</Link>
                    </p>
                </form>
                {mensaje && <p style={{ color: mensaje.includes('exitoso') ? 'green' : 'red' }}>{mensaje}</p>}
            </div>
        </div>
    );
}

export default Registrar;