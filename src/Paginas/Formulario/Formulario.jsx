import { useNavigate } from "react-router-dom";

export function Formularioo() {
  const navigate = useNavigate();
  const VistaMapa = () => {
    navigate("/mapa");
  };

  const irALogin = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 font-bold p-4">
      {/* Contenedor principal con tamaños responsive */}
      <div className="w-full max-w-xs md:max-w-md">
        {/* Título - más pequeño en móvil, más grande en PC */}
        <h1 className="text-xl md:text-3xl text-center mb-4">COMPLETA TUS DATOS</h1>

        {/* Campos de entrada - ancho ajustable */}
        <div className="flex flex-col items-center w-full mt-4 md:mt-8">
          <input
            type="text"
            placeholder="Campo 1"
            className="bg-transparent border-b-2 border-green-400 text-lg md:text-xl text-center focus:outline-none mb-4 w-full"
          />
          <input
            type="text"
            placeholder="Campo 2"
            className="bg-transparent border-b-2 border-green-400 text-lg md:text-xl text-center focus:outline-none mb-4 w-full"
          />
          <input
            type="text"
            placeholder="Campo 3"
            className="bg-transparent border-b-2 border-green-400 text-lg md:text-xl text-center focus:outline-none mb-4 w-full"
          />
          <input
            type="text"
            placeholder="Campo 4"
            className="bg-transparent border-b-2 border-green-400 text-lg md:text-xl text-center focus:outline-none mb-4 w-full"
          />
          <input
            type="text"
            placeholder="Campo 5"
            className="bg-transparent border-b-2 border-green-400 text-lg md:text-xl text-center focus:outline-none w-full"
          />
        </div>

        {/* Botón con lógica de redirección - ajustable */}
        <div className="flex justify-center mt-6 md:mt-10">
          <button
            onClick={VistaMapa}
            className="px-8 md:px-12 py-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full text-black font-bold text-sm md:text-base hover:scale-105 transition-transform duration-200"
          >
            Continuar
          </button>
        </div>

        {/* Texto para volver al login */}
        <div className="mt-8 text-center">
          <p
            onClick={irALogin}
            className="text-sm md:text-base underline cursor-pointer hover:text-green-200 transition-all duration-150"
          >
            ¿Ya tienes sesión? <span className="italic">Regresa acá</span>
          </p>
        </div>
      </div>
    </div>
  );
}
