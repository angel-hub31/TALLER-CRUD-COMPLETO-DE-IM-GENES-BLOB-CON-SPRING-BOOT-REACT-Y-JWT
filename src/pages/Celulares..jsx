import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";
import ListaCelulares from "../components/ListaCelulares";


function Celulares() {

    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [detalle, setDetalle] = useState("");
    const [archivo, setArchivo] = useState(null);

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [listaCelulares, setListaCelulares] = useState([]);

    const navigate = useNavigate();

    const { token } = useAuth();

    const cargarCelulares = useCallback(async () => {

        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/celulares`
            );
            // CAMBIO: ya no enviamos token porque GET es público

            if (!response.ok) {
                throw new Error("Error cargando celulares");
            }
            const data = await response.json();
            setListaCelulares(data);
        } catch (error) {
            setErrorMsg(error.message);
        }

    }, []);

    useEffect(() => {

        cargarCelulares();
    }, [cargarCelulares]);

    const manejarArchivo = (e) => {
        setArchivo(e.target.files[0]);
    };

    const manejarSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!archivo) {

            setErrorMsg("Debe seleccionar una imagen");
            return;
        }

        const formData = new FormData();

        formData.append("marca", marca);
        formData.append("modelo", modelo);
        formData.append("detalle", detalle);
        formData.append("file", archivo);
        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/celulares/registrar`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    body: formData
                }
            );

            if (!response.ok) {
                const mensaje = await response.text();
                throw new Error(mensaje);
            }
            setSuccessMsg(
                "Celular registrado correctamente"
            );
            setMarca("");
            setModelo("");
            setDetalle("");
            setArchivo(null);
            cargarCelulares();

        } catch (error) {
            setErrorMsg(error.message);
        }
    }

    return (

        <div className="page">

            <button
                className="volver"
                onClick={() => navigate("/perfil")}
            >
                ← Volver
            </button>

            <h1>
                 GESTIÓN DE CELULARES
            </h1>

            <div className="form-card">

                <h2>
                    Registrar celular
                </h2>

                <form onSubmit={manejarSubmit}>
                    <input
                        placeholder="Marca"
                        value={marca}
                        onChange={e => setMarca(e.target.value)}
                    />

                    <input
                        placeholder="Modelo"
                        value={modelo}
                        onChange={e => setModelo(e.target.value)}
                    />

                    <input
                        placeholder="Detalle"
                        value={detalle}
                        onChange={e => setDetalle(e.target.value)}
                    />

                    <label>
                        Imagen
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={manejarArchivo}
                    />

                    <button className="guardar">
                        Registrar
                    </button>
                </form>
            </div>
            {
                errorMsg &&
                <div className="error">
                    {errorMsg}
                </div>
            }
            {
                successMsg &&
                <div className="success">
                    {successMsg}
                </div>
            }
            <ListaCelulares
                celulares={listaCelulares}
                recargarLista={cargarCelulares}
            />
        </div>
    )
}
export default Celulares;