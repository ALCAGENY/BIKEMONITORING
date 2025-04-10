import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import io from "socket.io-client";
import L from "leaflet";

// Corregir el problema de los íconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;

// Crear un ícono personalizado para el marcador principal
const bikeIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Componente para actualizar el centro del mapa cuando cambian las coordenadas
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Componente principal
export function Mapa() {
  const [coordinates, setCoordinates] = useState({ lat: 19.4326, lng: -99.1332 });
  const [zoomLevel, setZoomLevel] = useState(15);
  const [history, setHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const socketRef = useRef(null);

  // Conectar con el servidor Socket.IO
  useEffect(() => {
    // Conexión al socket
    socketRef.current = io("http://localhost:8090");
    
    socketRef.current.on("connect", () => {
      console.log("Conectado al servidor Socket.IO");
      setIsConnected(true);
      
      // Suscribirse al tópico GP
      socketRef.current.emit("subscribe_gps");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Desconectado del servidor Socket.IO");
      setIsConnected(false);
    });

    // Recibir datos GPS
    socketRef.current.on("gps", (data) => {
      console.log("Datos GPS recibidos:", data);
      try {
        const parsedData = JSON.parse(data);
        
        // Actualizar coordenadas si los datos son válidos
        if (parsedData.latitud && parsedData.longitud) {
          const newCoords = {
            lat: parsedData.latitud,
            lng: parsedData.longitud
          };
          setCoordinates(newCoords);
          setLastUpdate(new Date());
          
          // Añadir a historial si es una posición nueva
          setHistory(prev => {
            // Solo guardamos las últimas 20 posiciones para no saturar la memoria
            const newHistory = [...prev, newCoords].slice(-20);
            return newHistory;
          });
        }
      } catch (error) {
        console.error("Error al procesar datos GPS:", error);
      }
    });

    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Función para formatear la fecha
  const formatDate = (date) => {
    if (!date) return "Sin datos";
    return date.toLocaleTimeString();
  };

  // Crear línea que conecta los puntos del historial
  const createPathLine = () => {
    if (history.length < 2) return null;
    
    const positions = history.map(pos => [pos.lat, pos.lng]);
    return (
      <Polyline positions={positions} color="#3388ff" weight={3} opacity={0.7} />
    );
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4">
      {/* Cabecera */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <h1 className="text-2xl font-bold">Sistema de Monitoreo GPS</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">{isConnected ? 'En línea' : 'Desconectado'}</span>
        </div>
      </div>
      
      {/* Mapa con sombra y borde elegante */}
      <div className="w-full max-w-4xl bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 transition-all hover:shadow-xl">
        <div className="w-full h-[70vh]">
          <MapContainer 
            center={[coordinates.lat, coordinates.lng]} 
            zoom={zoomLevel} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false} // Ocultar controles de zoom predeterminados
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={[coordinates.lat, coordinates.lng]} />
            
            {/* Círculo de precisión */}
            <Circle 
              center={[coordinates.lat, coordinates.lng]}
              radius={100} // Radio en metros
              pathOptions={{ fillColor: 'blue', fillOpacity: 0.1, color: 'blue', weight: 1 }}
            />
            
            {/* Marcador actual */}
            <Marker position={[coordinates.lat, coordinates.lng]} icon={bikeIcon}>
              <Popup className="custom-popup">
                <div className="font-sans">
                  <h3 className="font-bold mb-1">Posición actual</h3>
                  <p className="text-sm">Latitud: {coordinates.lat.toFixed(6)}</p>
                  <p className="text-sm">Longitud: {coordinates.lng.toFixed(6)}</p>
                  <p className="text-xs mt-2 text-gray-500">
                    Última actualización: {formatDate(lastUpdate)}
                  </p>
                </div>
              </Popup>
            </Marker>
            
            {/* Historial de ruta (puntos conectados) */}
            {history.map((pos, index) => (
              <Marker 
                key={index} 
                position={[pos.lat, pos.lng]}
                icon={L.divIcon({
                  html: `<div class="h-2 w-2 rounded-full bg-blue-500 opacity-50"></div>`,
                  className: 'custom-div-icon',
                  iconSize: [10, 10],
                  iconAnchor: [5, 5]
                })}
              />
            ))}
          </MapContainer>
        </div>
        
        {/* Panel de información y controles */}
        <div className="bg-gray-800 p-4 text-sm flex justify-between items-center border-t border-gray-700">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-gray-400 mr-1">Ubicación:</span>
              <span className="font-mono text-blue-300">
                {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </span>
            </div>
            <div>
              <span className="text-gray-400 mr-1">Actualización:</span>
              <span className="font-mono text-blue-300">
                {formatDate(lastUpdate)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setZoomLevel(z => Math.min(18, z + 1))}
              className="bg-blue-600 hover:bg-blue-700 h-8 w-8 rounded-md flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="bg-gray-700 px-3 py-1 rounded-md font-mono min-w-[40px] text-center">
              {zoomLevel}
            </span>
            <button 
              onClick={() => setZoomLevel(z => Math.max(1, z - 1))}
              className="bg-blue-600 hover:bg-blue-700 h-8 w-8 rounded-md flex items-center justify-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Información adicional */}
      <div className="w-full max-w-4xl mt-4 flex flex-col md:flex-row gap-4">
        {/* Estadísticas */}
        <div className="bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700 flex-1 transition-all hover:shadow-lg">
          <h2 className="text-lg font-bold mb-3 border-b border-gray-700 pb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Estadísticas
          </h2>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-1">Posiciones</div>
              <div className="text-xl font-mono text-blue-300">{history.length}</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-1">Zoom</div>
              <div className="text-xl font-mono text-blue-300">{zoomLevel}</div>
            </div>
          </div>
        </div>
        
        {/* Estado */}
        <div className="bg-gray-800 rounded-xl p-4 shadow-md border border-gray-700 flex-1 transition-all hover:shadow-lg">
          <h2 className="text-lg font-bold mb-3 border-b border-gray-700 pb-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Estado del sistema
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>Servidor</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${lastUpdate ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <span>Señal GPS</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pie de página */}
      <div className="mt-auto w-full max-w-4xl text-center py-4 text-xs text-gray-500">
        Sistema de Monitoreo GPS • Actualizado en tiempo real
      </div>
    </div>
  );
}