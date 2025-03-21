import "./App.css";
import ListaUsuarios from "./components/ListaUsuarios";
import { ValidacionesProvider } from "./components/FormularioUsu";
import EstadisticasGlucosa from "./components/EstadisticasGlucosa";

function App() {
    return (
        <ValidacionesProvider>
            <div className="App">
                <h1>Gestión de Usuarios</h1>
                <ListaUsuarios />
                
                {/* Sección de estadísticas de glucosa */}
                <div className="mt-10">
                    <h2>Estadísticas de Glucosa</h2>
                    <EstadisticasGlucosa />
                </div>
            </div>
        </ValidacionesProvider>
    );
}

export default App;
