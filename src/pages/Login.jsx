import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig";

function Login() {
    const [username, setUsername] = useState(''); // Corregido: nombre de variable
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Corregido: uso de setError

    const navigate = useNavigate();
    const { login } = useAuth();

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Usuario o contraseña incorrecta');
            }

            const datos = await response.json();
            login(datos.token);
            navigate('/perfil');

        } catch (error) {
            setError(error.message);
        }
    }

  return (
        <div className="login-page">
            <div className="auth-container">
                <div className="icon-circle">👤</div>
                <h2>Login</h2>
                
                <form onSubmit={manejarSubmit}>
                    <input 
                        type="text" 
                        placeholder="Usuario" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <button type="submit">INGRESAR</button>
                    
                    {/* Botón de nueva cuenta que navega sin enviar formulario */}
                    <button 
                        type="button" 
                        onClick={() => navigate('/registrar')}
                        style={{ backgroundColor: '#555' }}
                    >
                        NUEVA CUENTA
                    </button>
                </form>

                <p style={{ marginTop: '15px' }}>
                    ¿No tienes cuenta? <Link to="/registrar">Regístrate</Link>
                </p>
                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </div>
        </div>
    );
}

export default Login;