import { useNavigate } from "react-router-dom";

export function InicioSesion() {
    const navigate = useNavigate();
  
  const InicioCorrecto = () => {

    navigate("/formulario");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-green-400 font-bold">
      {/* Título */}
      <h1 className="text-2xl">BIKE MONITORING</h1>
      
      {/* Íconos (puedes agregar iconos reales con react-icons) */}
      <div className="flex justify-between w-32 mt-4">
        <span className="text-2xl">📍</span>
        <span className="text-2xl">🔔</span>
      </div>

      {/* Imagen de bicicleta (puedes reemplazar con un SVG) */}
      <div className="my-6">
        🚲
      </div>
      
      {/* Campos de entrada */}
      <div className="flex flex-col items-center w-full max-w-xs">
        <input
          type="text"
          placeholder="Nombre"
          className="bg-transparent border-b-2 border-green-400 text-xl text-center focus:outline-none mb-4"
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="bg-transparent border-b-2 border-green-400 text-xl text-center focus:outline-none"
        />
      </div>

      {/* Botón con lógica de redirección */}
      <button 
        onClick={InicioCorrecto} 
        className="mt-6 px-10 py-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full text-black font-bold"
      >
        Iniciar sesión
      </button>
    </div>
  );
};