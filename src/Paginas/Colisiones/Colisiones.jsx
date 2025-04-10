import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

export function Colisiones() {
  const [isConnected, setIsConnected] = useState(false);
  const [collisions, setCollisions] = useState([]);
  const [estatus, setEstatus] = useState("Encender alarma");
  const [currentStatus, setCurrentStatus] = useState({
    isColliding: false,
    lastCollision: null,
    intensity: 0,
  });
  const socketRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/alert.mp3");
    socketRef.current = io("https://ws-node.zapto.org/");

    socketRef.current.on("connect", () => {
      console.log("Conectado al servidor Socket.IO");
      setIsConnected(true);

      socketRef.current.emit("subscribe_giroscopio");
      socketRef.current.emit("subscribe_vibracion");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Desconectado del servidor Socket.IO");
      setIsConnected(false);
    });

    socketRef.current.on("giroscopio", (data) => {
      try {
        const parsedData = JSON.parse(data);

        if (parsedData.valor === true || parsedData.valor === 1) {
          const now = new Date();

          const newCollision = {
            id: now.getTime(),
            timestamp: now,
            intensity: parsedData.intensidad || Math.random() * 10,
            message: parsedData.mensaje || "Colisión detectada",
          };

          setCurrentStatus({
            isColliding: true,
            lastCollision: now,
            intensity: newCollision.intensity,
          });

          setCollisions((prev) => [newCollision, ...prev.slice(0, 19)]);

          if (audioRef.current) {
            audioRef.current
              .play()
              .catch((e) => console.log("Error reproduciendo audio:", e));
          }
        } else {
          setCurrentStatus((prev) => ({
            ...prev,
            isColliding: false,
          }));
        }
      } catch (error) {
        console.error("Error al procesar datos de vibración:", error);
      }
    });

    socketRef.current.on("vibracion", (data) => {
      let newData = JSON.parse(data);
      console.log("Datos de vibración recibidos:", newData.valor);
      setCurrentStatus({
        isColliding: newData.valor,
        lastCollision: null,
        intensity: 0,
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const toggleAlarma = () => {
    const nuevoEstatus =
      estatus === "Encender alarma" ? "Apagar alarma" : "Encender alarma";
    setEstatus(nuevoEstatus);

    const valor = nuevoEstatus === "Apagar alarma" ? "ON" : "OFF";
    socketRef.current.emit("enviar_control", valor);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header con botón y estado de conexión */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h1 className="text-2xl font-bold">Detector de Colisiones</h1>
          </div>
          
          <button
            onClick={toggleAlarma}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg transition-colors"
          >
            {estatus}
          </button>
        </div>

        {/* Panel de estado actual */}
        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 mb-6 transition-all hover:shadow-xl">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Estado Actual
            </h2>

            {/* Indicador principal */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-4">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center ${
                  currentStatus.isColliding
                    ? "bg-red-900 border-4 border-red-500 animate-pulse"
                    : "bg-green-900 border-4 border-green-500"
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {currentStatus.isColliding ? "ALERTA" : "NORMAL"}
                  </div>
                  <div className="text-sm">
                    {currentStatus.isColliding
                      ? "Colisión detectada"
                      : "Sin colisiones"}
                  </div>
                </div>
              </div>

              {/* Estado sensor y conexión */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-xl p-4 shadow-md border border-gray-700">
                  <h3 className="text-gray-400 text-sm mb-2">Estado sensor</h3>
                  <div className="text-xl font-bold flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    {isConnected ? "Operativo" : "Sin conexión"}
                  </div>
                </div>
                
                <div className="bg-gray-900 rounded-xl p-4 shadow-md border border-gray-700">
                  <h3 className="text-gray-400 text-sm mb-2">Conexión</h3>
                  <div className="text-sm font-mono">
                    <p>Servidor: Activo</p>
                    <p>Estado: {isConnected ? "✅ Conectado" : "❌ Desconectado"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Detalles adicionales */}
            <div className="bg-gray-900 rounded-lg p-3 text-sm">
              <p>Tópicos: prueba.giroscopio, prueba.vibracion</p>
              <p>Última actualización: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}