import { useState, useEffect, createContext, useContext } from "react";


// Contexto para validaciones de usuario y contraseña
const ValidacionesContext = createContext();

export const ValidacionesProvider = ({ children }) => {
    const reglasValidacion = {
        usuarioPattern: /^[a-z][a-z0-9]{5,}$/,
        passwordPattern: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
    };
    return (
        <ValidacionesContext.Provider value={reglasValidacion}>
            {children}
        </ValidacionesContext.Provider>
    );
};

const FormularioUsu= ({ usuario, onSave, onCancel }) => {
    const { usuarioPattern, passwordPattern } = useContext(ValidacionesContext);

    const [nombre, setNombre] = useState(usuario?.nombre || "");
    const [apellidos, setApellidos] = useState(usuario?.apellidos || "");
    const [fechaNacimiento, setFechaNacimiento] = useState(usuario?.fecha_nacimiento || "");
    const [nombreUsuario, setNombreUsuario] = useState(usuario?.usuario || "");
    const [clave, setClave] = useState("");
    const [errores, setErrores] = useState({});

    useEffect(() => {
        if (usuario) {
            setNombre(usuario.nombre);
            setApellidos(usuario.apellidos);
            setFechaNacimiento(usuario.fecha_nacimiento);
            setNombreUsuario(usuario.usuario);
        }
    }, [usuario]);

    const validarDatos = () => {
        let erroresTemp = {};
        const fechaHoy = new Date();
        const fechaNac = new Date(fechaNacimiento);

        // Validación de fecha de nacimiento
        if (!fechaNacimiento || isNaN(fechaNac.getTime())) {
            erroresTemp.fechaNacimiento = "Por favor, introduce una fecha válida.";
        } else {
            let edad = fechaHoy.getFullYear() - fechaNac.getFullYear();
            const mesHoy = fechaHoy.getMonth();
            const diaHoy = fechaHoy.getDate();
            const mesNac = fechaNac.getMonth();
            const diaNac = fechaNac.getDate();

            if (mesHoy < mesNac || (mesHoy === mesNac && diaHoy < diaNac)) {
                edad--;
            }

            if (edad < 18) {
                erroresTemp.fechaNacimiento = "Debes ser mayor de edad para registrarte.";
            }
        }

        if (!nombre.trim()) erroresTemp.nombre = "El campo nombre es obligatorio.";
        if (!apellidos.trim()) erroresTemp.apellidos = "Por favor, introduce los apellidos.";
        if (!usuarioPattern.test(nombreUsuario)) erroresTemp.nombreUsuario = "El usuario debe iniciar con una letra y contener al menos 6 caracteres.";
        if (!usuario && !passwordPattern.test(clave)) erroresTemp.clave = "La contraseña debe tener mínimo 8 caracteres, una mayúscula y un número.";

        setErrores(erroresTemp);
        return Object.keys(erroresTemp).length === 0;
    };

    const manejarEnvio = (e) => {
        e.preventDefault();
        if (validarDatos()) {
            const usuarioGuardado = {
                ...(usuario || {}),
                nombre,
                apellidos,
                fecha_nacimiento: fechaNacimiento,
                usuario: nombreUsuario,
                ...(clave && { contra: clave }),
            };
            console.log(usuarioGuardado);
            onSave(usuarioGuardado);
        }
    };

    return (
        <form onSubmit={manejarEnvio}>
            <h2>{usuario ? "Editar Usuario" : "Registrar Usuario"}</h2>

            <label>
                Nombre:
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                {errores.nombre && <span>{errores.nombre}</span>}
            </label>

            <label>
                Apellidos:
                <input type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
                {errores.apellidos && <span>{errores.apellidos}</span>}
            </label>

            <label>
                Fecha de Nacimiento:
                <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required />
                {errores.fechaNacimiento && <span>{errores.fechaNacimiento}</span>}
            </label>

            <label>
                Usuario:
                <input 
                    type="text" 
                    value={nombreUsuario} 
                    onChange={(e) => setNombreUsuario(e.target.value)} 
                    required 
                    readOnly={!!usuario} 
                />
                {errores.nombreUsuario && <span>{errores.nombreUsuario}</span>}
            </label>

            <label>
                Contraseña:
                <input 
                    type="password" 
                    value={clave} 
                    onChange={(e) => setClave(e.target.value)} 
                    required={!usuario}
                />
                {errores.clave && <span>{errores.clave}</span>}
            </label>

            <button type="submit">{usuario ? "Guardar Cambios" : "Crear Cuenta"}</button>
            <button type="button" onClick={onCancel}>Cancelar</button>
        </form>
    );
};

export default FormularioUsu;
