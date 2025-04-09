import { useState } from "react";
import { FaPowerOff } from "react-icons/fa";

export function Alarma() {
  const [activa, setActiva] = useState(true);

  const toggleAlarma = () => {
    setActiva(!activa);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 font-bold p-4">
      {/* Título */}
      <h1 className="text-xl md:text-3xl mb-6 flex items-center gap-2">
        <FaPowerOff className="text-green-400 text-2xl md:text-3xl" />
        Alarma Mnonitoring
      </h1>

      {/* Estado de la alarma */}
      <h2 className="text-lg md:text-2xl mb-10 text-center">
        {activa ? "Alarma Activa" : "Alarma Desactivada"}
      </h2>

      {/* Botón para encender/apagar */}
      <button
        onClick={toggleAlarma}
        className={`flex items-center justify-center px-6 py-3 rounded-full text-black font-bold text-lg md:text-xl transition-all duration-300 ${
          activa
            ? "bg-red-400 hover:bg-red-500"
            : "bg-green-400 hover:bg-green-500"
        }`}
      >
        <FaPowerOff className="mr-2" />
        {activa ? "Apagar Alarma" : "Encender Alarma"}
      </button>
    </div>
  );
}
