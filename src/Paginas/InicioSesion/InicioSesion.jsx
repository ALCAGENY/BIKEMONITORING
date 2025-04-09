import { useNavigate } from "react-router-dom";

export function InicioSesion() {
  const navigate = useNavigate();
  const InicioCorrecto = () => {
    navigate("/formulario");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 font-bold p-4">
      {/* Contenedor principal con tamaños responsive */}
      <div className="w-full max-w-xs md:max-w-md">
        {/* Título - más pequeño en móvil, más grande en PC */}
        <h1 className="text-xl md:text-3xl text-center mb-4">BIKE MONITORING</h1>
        
        {/* Íconos - ajustados para ambos tamaños */}
        <div className="flex justify-center gap-8 md:gap-16 mt-2 md:mt-6">
          <span className="text-xl md:text-3xl">📍</span>
          <span className="text-xl md:text-3xl">🔔</span>
        </div>
        
        {/* Imagen de bicicleta - tamaño ajustable */}
        <div className="flex justify-center my-4 md:my-8">
          <span className="text-4xl md:text-6xl">🚲</span>
        </div>
        
        {/* Campos de entrada - ancho ajustable */}
        <div className="flex flex-col items-center w-full">
          <input
            type="text"
            placeholder="Nombre"
            className="bg-transparent border-b-2 border-green-400 text-lg md:text-xl text-center focus:outline-none mb-4 w-full"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="bg-transparent border-b-2 border-green-400 text-lg md:text-xl text-center focus:outline-none w-full"
          />
        </div>
        
        {/* Botón con lógica de redirección - ajustable */}
        <div className="flex justify-center mt-6 md:mt-10">
          <button
            onClick={InicioCorrecto}
            className="px-8 md:px-12 py-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full text-black font-bold text-sm md:text-base"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}