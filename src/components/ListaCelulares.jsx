import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config/apiConfig";
import { useNavigate } from "react-router-dom";


function ListaCelulares({
    celulares,
    recargarLista
}) {


    const [fotosUrl, setFotosUrl] = useState({});

    const [mensaje, setMensaje] = useState("");

    const { token } = useAuth();

    const navigate = useNavigate();

    const eliminarCelular = async (id) => {
        if (window.confirm("¿Eliminar celular?")) {
            const res = await fetch(
                `${API_BASE_URL}/auth/celulares/${id}`,
                {

                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {
                setMensaje("Eliminado exitosamente");


                setTimeout(() => setMensaje(""), 6000);
                recargarLista();
            }

        }
    };

    useEffect(() => {
        const cargarFotos = async () => {
            for (const celular of celulares) {

                try {

                    const res = await fetch(
                        `${API_BASE_URL}/auth/celulares/${celular.id}/foto`

                    );

                    if (res.ok) {

                        const blob = await res.blob();
                        setFotosUrl(prev => ({
                            ...prev,
                            [celular.id]: URL.createObjectURL(blob)
                        }));

                    }

                } catch (error) {

                    console.log(error);
                }
            }
        };
        if (celulares.length > 0) {
            cargarFotos();
        }

    }, [celulares]);

    return (
        <div className="lista-container">
            <h2 className="titulo-lista">
                Catálogo de celulares
            </h2>

            {mensaje && <div className="mensaje-exito">{mensaje}</div>}
            <div className="cards">

                {
                    celulares.map(celular => (
                        <div className="card-celular"
                            key={celular.id}>
                            {
                                fotosUrl[celular.id] &&
                                <img
                                    src={fotosUrl[celular.id]}
                                    className="foto-celular"
                                />
                            }
                            <div className="info">
                                <h3>
                                    {celular.marca}
                                </h3>
                                <p>
                                    Marca:
                                    <strong>
                                        {celular.marca}
                                    </strong>
                                </p>
                                <p>
                                    Modelo:
                                    <strong>
                                        {celular.modelo}
                                    </strong>
                                </p>

                                <p>
                                    Detalle:
                                    <strong>
                                        {celular.detalle}
                                    </strong>
                                </p>

                                <div className="acciones">

                                    <button
                                        className="editar"
                                        onClick={() =>
                                            navigate(`/celulares/editar/${celular.id}`)
                                        }
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="eliminar"
                                        onClick={() =>
                                            eliminarCelular(celular.id)
                                        }
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>

    )

}

export default ListaCelulares;