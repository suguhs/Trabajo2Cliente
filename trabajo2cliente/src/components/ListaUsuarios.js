
import { useState, useEffect } from "react";
import { getAllUsuarios, deleteUsuario, updateUsuario, addUsuario } from "../usuariosServer";
import FormUsuario from "./FormularioUsu";

const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const datosUsuarios = await getAllUsuarios();
            setUsuarios(datosUsuarios);
        } catch (error) {
            console.error("Error al obtener la lista de usuarios:", error);
        }
    };

    const abrirFormulario = (usuario = null) => {
        setUsuarioSeleccionado(usuario);
        setMostrarFormulario(true);
    };

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
        setUsuarioSeleccionado(null);
    };

    const manejarEliminacion = async (id) => {
        const mensajeError = `Hubo un problema al eliminar el usuario con ID ${id}`;
        try {
            const resultado = await deleteUsuario(id);
            console.log(resultado);
            if (!resultado) {
                alert(mensajeError);
            } else {
                alert(`Usuario con ID ${id} eliminado correctamente.`);
                cargarUsuarios();
            }
        } catch (error) {
            alert(mensajeError);
        }
    };

    const manejarGuardado = async (usuario) => {
        try {
            if (usuario.id_usu) {
                await updateUsuario(usuario);
                alert(`Usuario con ID ${usuario.id_usu} actualizado exitosamente.`);
            } else {
                const nuevoUsuario = await addUsuario(usuario);
                alert(`Nuevo usuario agregado con ID ${nuevoUsuario.id_usu}.`);
            }
            cargarUsuarios();
            cerrarFormulario();
        } catch (error) {
            alert("Ocurrió un error al guardar los datos del usuario.");
        }
    };

    return (
        <div className="contenedor-usuarios">
            <button onClick={() => abrirFormulario()} className="btn-agregar">
                Nuevo Usuario
            </button>

            <table className="tabla-usuarios">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Fecha de Nacimiento</th>
                        <th>Usuario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios?.map((usuario) => (
                        <tr key={usuario.id_usu} className="fila-usuario">
                            <td>{usuario.id_usu}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.apellidos}</td>
                            <td>{usuario.fecha_nacimiento}</td>
                            <td>{usuario.usuario}</td>
                            <td>
                                <button onClick={() => abrirFormulario(usuario)} className="btn-editar">
                                    Editar
                                </button>
                                <button onClick={() => manejarEliminacion(usuario.id_usu)} className="btn-eliminar">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {mostrarFormulario && (
                <FormUsuario usuario={usuarioSeleccionado} onSave={manejarGuardado} onCancel={cerrarFormulario} />
            )}
        </div>
    );
};

export default ListaUsuarios;
