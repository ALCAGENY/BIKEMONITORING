import { useNavigate } from "react-router-dom";

export function Formularioo() {

    const navigate = useNavigate();
    const VistaMapa = () => {
        navigate("/mapa");
    };

    return (

        <div className="flex flex-col items-center justify-center h-screen bg-black text-green-400 font-bold">
          {/* Título */}
          <h1 className="text-2xl">COMPLETA TUS DATOS</h1>
          
          {/* Campos de entrada */}
          <div className="flex flex-col items-center w-full max-w-xs mt-6">
            <input
              type="text"
              placeholder="Campo 1"
              className="bg-transparent border-b-2 border-green-400 text-xl text-center focus:outline-none mb-4"
            />
            <input
              type="text"
              placeholder="Campo 2"
              className="bg-transparent border-b-2 border-green-400 text-xl text-center focus:outline-none mb-4"
            />
            <input
              type="text"
              placeholder="Campo 3"
              className="bg-transparent border-b-2 border-green-400 text-xl text-center focus:outline-none mb-4"
            />
            <input
              type="text"
              placeholder="Campo 4"
              className="bg-transparent border-b-2 border-green-400 text-xl text-center focus:outline-none mb-4"
            />
            <input
              type="text"
              placeholder="Campo 5"
              className="bg-transparent border-b-2 border-green-400 text-xl text-center focus:outline-none"
            />
          </div>
    
          {/* Botón */}
          <button  
          onClick={VistaMapa}
          className="mt-6 px-10 py-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full text-black font-bold">
            Continuar
          </button>
        </div>
      );
    };