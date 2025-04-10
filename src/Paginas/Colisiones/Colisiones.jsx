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
      console.log("Suscrito al tópico prueba.giroscopio");

      socketRef.current.emit("subscribe_vibracion");
      console.log("Suscrito al tópico prueba.vibracion");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Desconectado del servidor Socket.IO");
      setIsConnected(false);
    });

    socketRef.current.on("giroscopio", (data) => {
      //console.log("Datos de vibración recibidos:", data);
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
        let newData = JSON.parse(data)
      console.log("Datos de vibración recibidos:", newData.valor);
      setCurrentStatus({
        isColliding:  newData.valor,
        lastCollision: null,
        intensity: 0,
      });
    });
    console.log(currentStatus);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const formatDateTime = (date) => {
    if (!date) return "Sin datos";
    return date.toLocaleString();
  };

  const toggleAlarma = () => {
    const nuevoEstatus =
      estatus === "Encender alarma" ? "Apagar alarma" : "Encender alarma";
    setEstatus(nuevoEstatus);

    const valor = nuevoEstatus === "Apagar alarma" ? "ON" : "OFF";
    socketRef.current.emit("enviar_control", valor);
  };

  const getTimeSinceLastCollision = () => {
    if (!currentStatus.lastCollision) return "No hay colisiones registradas";

    const now = new Date();
    const diff = now - currentStatus.lastCollision;

    // Convertir a formato legible
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `Hace ${seconds} segundos`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} minutos`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} horas`;

    const days = Math.floor(hours / 24);
    return `Hace ${days} días`;
  };

  // Determinar clase de intensidad para los indicadores visuales
  const getIntensityClass = (intensity) => {
    if (intensity >= 7) return "bg-red-500";
    if (intensity >= 4) return "bg-yellow-500";
    return "bg-blue-500";
  };

  return (
    <div>
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4">
      <button
        onClick={toggleAlarma}
        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg"
      >
        {estatus}
      </button>
      <div className="w-full max-w-4xl flex justify-between items-center mb-4">
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
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-sm">
            {isConnected ? "En línea" : "Desconectado"}
          </span>
        </div>
      </div>

      {/* Panel de estado actual */}
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 mb-4 transition-all hover:shadow-xl">
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
          <div className="flex items-center justify-center mb-6">
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
          </div>

          {/* Detalles del estado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">Última colisión</h3>
              <p className="font-mono text-lg">
                {currentStatus.lastCollision
                  ? formatDateTime(currentStatus.lastCollision)
                  : "Sin registro"}
              </p>
              <p className="text-gray-400 text-xs mt-1">
                {getTimeSinceLastCollision()}
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-gray-400 text-sm mb-1">
                Intensidad del impacto
              </h3>
              <div className="flex items-center gap-2">
                <div className="font-mono text-lg">
                  {currentStatus.intensity.toFixed(1)}
                </div>
                <div className="flex-1 bg-gray-600 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getIntensityClass(
                      currentStatus.intensity
                    )}`}
                    style={{
                      width: `${Math.min(100, currentStatus.intensity * 10)}%`,
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Escala: 0 (mínimo) - 10 (máximo)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de colisiones */}
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-all hover:shadow-xl mb-4">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Historial de Colisiones
          </h2>

          {collisions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay colisiones registradas
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Fecha y Hora</th>
                    <th className="px-4 py-3">Intensidad</th>
                    <th className="px-4 py-3 rounded-tr-lg">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {collisions.map((collision, index) => (
                    <tr
                      key={collision.id}
                      className={
                        index % 2 === 0 ? "bg-gray-800" : "bg-gray-750"
                      }
                    >
                      <td className="px-4 py-3 font-mono">
                        {formatDateTime(collision.timestamp)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getIntensityClass(
                              collision.intensity
                            )}`}
                          ></div>
                          <span>{collision.intensity.toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{collision.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

        <div className="bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700 transition-all hover:shadow-lg">
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

        <div className="w-full max-w-4xl bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-all hover:shadow-xl mb-4">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-700 pb-2">
            Estado de la conexión
          </h2>
          <div className="text-sm font-mono bg-gray-900 p-3 rounded text-white">
            <p>Servidor: Activo</p>
            <p>Tópico: prueba.vibracion</p>
            <p>Estado: {isConnected ? "✅ Conectado" : "❌ Desconectado"}</p>
            <p>Última actualización: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
      </div>

      
    </div>
  );
}
