import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";


function EditarCelular() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [detalle, setDetalle] = useState("");
    const [archivo, setArchivo] = useState(null);
    const [msg, setMsg] = useState("");

    // Cargar datos actuales al abrir la página
    useEffect(() => {
        const fetchCelular = async () => {
            const res = await fetch(`${API_BASE_URL}/auth/celulares`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            const cel = data.find(c => c.id === parseInt(id));
            if (cel) {
                setMarca(cel.marca);
                setModelo(cel.modelo);
                setDetalle(cel.detalle);
            }
        };
        fetchCelular();
    }, [id, token]);

    const manejarSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("marca", marca);
        formData.append("modelo", modelo);
        formData.append("detalle", detalle)
        if (archivo) formData.append("file", archivo);

        const res = await fetch(`${API_BASE_URL}/auth/celulares/${id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData
        });

        if (res.ok) {
            alert("Actualizado con éxito");
            navigate("/celulares");
        } else {
            setMsg("Error al actualizar");
        }
    };

    return (
        <div className="editar-container">
            <div className="editar-box">

                <h1>
                    ✏️ Editar celular
                </h1>

                <p className="editar-descripcion">
                    Modifica la información del dispositivo
                </p>

                <form onSubmit={manejarSubmit}>

                    <label>
                        Marca
                    </label>

                    <input
                        value={marca}
                        onChange={
                            e => setMarca(e.target.value)
                        }
                        required
                    />

                    <label>
                        Modelo
                    </label>

                    <input
                        value={modelo}
                        onChange={
                            e => setModelo(e.target.value)
                        }
                        required
                    />

                    <label>
                        Detalle
                    </label>

                    <input
                        value={detalle}
                        onChange={
                            e => setDetalle(e.target.value)
                        }
                        required
                    />

                    <label>
                        Cambiar imagen
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={
                            e => setArchivo(e.target.files[0])
                        }
                    />

                    <button
                        className="btn-guardar"
                        type="submit"
                    >
                        Guardar cambios
                    </button>





                    <button
                        type="button"
                        className="btn-cancelar"
                        onClick={() =>
                            navigate("/celulares")
                        }
                    >
                        Cancelar
                    </button>

                </form>
                {
                    msg &&

                    <p className="mensaje-error">
                        {msg}
                    </p>
                }

            </div>
        </div>

    )
}
export default EditarCelular;