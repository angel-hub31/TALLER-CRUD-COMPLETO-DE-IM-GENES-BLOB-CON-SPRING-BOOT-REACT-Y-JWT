import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";
import ListaVehiculos from "../components/ListaVehiculos";

function Vehiculos() {
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [archivo, setArchivo] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [succesMsg, setSuccesMsg] = useState("");
    const [listaVehiculos, setListaVehiculos] = useState([]);

    const navigate = useNavigate();
    const { token } = useAuth();

    const cargarVehiculos = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/vehiculos`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("No se pudo obtener la lista de vehículos");
            const datos = await response.json();
            setListaVehiculos(datos);
        } catch (error) {
            setErrorMsg(error.message);
        }
    }, [token]);

    useEffect(() => {
        cargarVehiculos();
    }, [cargarVehiculos]);

    const manejarArchivo = (e) => setArchivo(e.target.files[0]);

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccesMsg("");

        if (!archivo) {
            setErrorMsg("Debe seleccionar una foto del archivo");
            return;
        }

        const formData = new FormData();
        formData.append("file", archivo);
        formData.append("marca", marca);
        formData.append("modelo", modelo);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/vehiculos/registrar`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            if (!response.ok) throw new Error("No se pudo registrar el vehículo");
            
            setSuccesMsg("Vehículo registrado con éxito");
            setMarca(""); setModelo(""); setArchivo(null);
            cargarVehiculos();
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    return (
        <div className="page">
            <button className="volver" onClick={() => navigate("/perfil")}>← Volver</button>

            <h1>Gestión de Vehículos</h1>

            <div className="form-card">
                <h2>Registrar nuevo vehículo</h2>
                <form onSubmit={manejarSubmit}>
                    <input type="text" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} required />
                    <input type="text" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} required />
                    <input type="file" accept="image/*" onChange={manejarArchivo} />
                    <button type="submit" style={{ width: "100%" }}>Registrar Vehículo</button>
                </form>
                
                {errorMsg && <p style={{ color: "#ff3860" }}>{errorMsg}</p>}
                {succesMsg && <p style={{ color: "#00ff99" }}>{succesMsg}</p>}
            </div>

            {/* Este contenedor permite que ListaVehiculos se despliegue horizontalmente */}
            <div className="cards">
                <ListaVehiculos vehiculos={listaVehiculos} />
            </div>
        </div>
    );
}

export default Vehiculos;