import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const EstadisticasGlucosa = () => {
    const [idUsuario, setIdUsuario] = useState("");
    const [mes, setMes] = useState("");
    const [anio, setAnio] = useState("");
    const [estadisticas, setEstadisticas] = useState(null);
    const [error, setError] = useState(null);

    const obtenerEstadisticas = async (e) => {
        e.preventDefault();
        setError(null);

        if (!idUsuario || !mes || !anio) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/estadisticas.php?id_usu=${idUsuario}&mes=${mes}&anio=${anio}`);
            if (!response.ok) throw new Error("Error al obtener estadísticas");

            const data = await response.json();
            setEstadisticas({
                promedio: parseFloat(data.promedio) || 0,
                minimo: parseFloat(data.minimo) || 0,
                maximo: parseFloat(data.maximo) || 0,
            });
        } catch (error) {
            setError("No se pudieron obtener las estadísticas");
        }
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-xl w-full max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-center mb-4">Estadísticas de Glucosa</h2>

            <form onSubmit={obtenerEstadisticas} className="space-y-4">
                <input
                    type="number"
                    placeholder="ID Usuario"
                    value={idUsuario}
                    onChange={(e) => setIdUsuario(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Mes (1-12)"
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Año (Ej: 2024)"
                    value={anio}
                    onChange={(e) => setAnio(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
                    Obtener Estadísticas
                </button>
            </form>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}

            {estadisticas && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-center mb-3">Resultados</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={[estadisticas]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="promedio" hide />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="promedio" fill="#8884d8" name="Promedio" />
                            <Bar dataKey="minimo" fill="#82ca9d" name="Mínimo" />
                            <Bar dataKey="maximo" fill="#ff7300" name="Máximo" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default EstadisticasGlucosa;
