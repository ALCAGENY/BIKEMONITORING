import { useState, useEffect } from "react";

export function Mapa() {
  const [coordinates, setCoordinates] = useState({ lat: 19.4326, lng: -99.1332 });
  const [zoomLevel, setZoomLevel] = useState(15);
  const [command, setCommand] = useState("");
  
  // Simulación de actualización de coordenadas (reemplazar con datos reales del GPS)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simula pequeños cambios en las coordenadas (reemplazar con datos del sensor)
      setCoordinates(prev => ({
        lat: prev.lat + (Math.random() * 0.001 - 0.0005),
        lng: prev.lng + (Math.random() * 0.001 - 0.0005)
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      // Procesar comandos
      if (command.toLowerCase().startsWith("/zoom")) {
        const level = parseInt(command.split(" ")[1]);
        if (!isNaN(level) && level >= 1 && level <= 20) {
          setZoomLevel(level);
        }
      }
      setCommand("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-black text-green-400 font-bold p-4">
      {/* Título con ícono */}
      <div className="flex items-center space-x-2 mt-2 md:mt-4">
        <span className="text-xl md:text-2xl">📍</span>
        <h1 className="text-lg md:text-2xl">Monitoring GPS</h1>
      </div>
      
      {/* Mapa interactivo - reemplaza la imagen con un mapa real */}
      <div className="w-full max-w-xs md:max-w-lg my-4 md:my-6">
        <div className="relative bg-gray-800 rounded-lg overflow-hidden">
          <div className="w-full h-40 md:h-64 flex items-center justify-center border-2 border-green-500 rounded-lg text-center">
            {/* Aquí iría un mapa real - esta es una representación */}
            <div className="absolute inset-0 opacity-70 bg-gray-900">
              {/* Cuadrícula simulada del mapa */}
              <div className="w-full h-full grid grid-cols-5 grid-rows-5">
                {Array(25).fill().map((_, i) => (
                  <div key={i} className="border border-green-900"></div>
                ))}
              </div>
            </div>
            
            {/* Punto de ubicación en el mapa */}
            <div className="absolute" style={{
              top: `${50 + Math.sin(coordinates.lat) * 20}%`,
              left: `${50 + Math.sin(coordinates.lng) * 20}%`,
              transform: "translate(-50%, -50%)"
            }}>
              <div className="relative">
                <div className="w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute w-5 h-5 md:w-6 md:h-6 bg-green-400 rounded-full -top-1 -left-1 opacity-30 animate-ping"></div>
              </div>
            </div>
            
            {/* Información de coordenadas */}
            <div className="absolute bottom-2 left-2 text-xs md:text-sm bg-black bg-opacity-60 p-1 rounded">
              Lat: {coordinates.lat.toFixed(4)} | Lng: {coordinates.lng.toFixed(4)} | Zoom: {zoomLevel}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recuadro para comandos slash */}
      <div className="w-full max-w-xs md:max-w-lg my-2 md:my-4">
        <div className="relative">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleCommand}
            placeholder="/zoom 15 para ajustar el zoom"
            className="w-full bg-gray-900 border border-green-500 rounded-md py-2 px-3 text-sm md:text-base text-green-400 focus:outline-none focus:ring-1 focus:ring-green-500"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-green-600">
            Presiona Enter
          </div>
        </div>
        <p className="text-xs md:text-sm text-green-600 mt-1">
          Comandos disponibles: /zoom [1-20]
        </p>
      </div>
      
      {/* Ícono central */}
      <div className="my-2 md:my-4 text-xl md:text-2xl">⚪</div>
      
      {/* Barras con texto explicativo */}
      <div className="space-y-3 md:space-y-4 w-full max-w-xs md:max-w-lg">
        <div className="relative">
          <div className="h-2 md:h-3 bg-green-500 rounded-full"></div>
          <span className="absolute -top-5 left-0 text-xs md:text-sm">Intensidad de señal GPS</span>
        </div>
        <div className="relative">
          <div className="h-2 md:h-3 bg-green-500 w-4/5 rounded-full"></div>
          <span className="absolute -top-5 left-0 text-xs md:text-sm">Batería del dispositivo</span>
        </div>
        <div className="relative">
          <div className="h-2 md:h-3 bg-green-500 w-3/5 rounded-full"></div>
          <span className="absolute -top-5 left-0 text-xs md:text-sm">Precisión de la ubicación</span>
        </div>
      </div>
      
      {/* Guía de uso */}
      <div className="mt-4 w-full max-w-xs md:max-w-lg bg-gray-900 border border-green-500 rounded-md p-2 md:p-3 text-xs md:text-sm">
        <h3 className="font-bold text-center mb-1">Guía de uso rápido</h3>
        <ul className="list-disc pl-4 space-y-1">
          <li>El punto parpadeante muestra la ubicación actual del dispositivo</li>
          <li>Use el comando /zoom [nivel] para ajustar el zoom del mapa</li>
          <li>Las barras muestran el estado actual del sistema GPS</li>
          <li>La actualización de coordenadas ocurre cada 5 segundos</li>
        </ul>
      </div>
    </div>
  );
}