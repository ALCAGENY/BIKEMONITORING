export function Mapa() {
    return (
      <div className="flex flex-col items-center justify-start h-screen bg-black text-green-400 font-bold p-4">
        {/* Título con ícono */}
        <div className="flex items-center space-x-2 mt-4">
          <span className="text-2xl">📍</span>
          <h1 className="text-xl">Monitoring GPS</h1>
        </div>
  
        {/* Imagen del mapa */}
        <div className="my-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/854/854878.png"
            alt="Mapa GPS"
            className="w-64 h-36 object-cover rounded-lg"
          />
        </div>
  
        {/* Ícono central */}
        <div className="my-4 text-2xl">⚪</div>
  
        {/* Barras verdes (pueden representar datos o niveles) */}
        <div className="space-y-4 w-full max-w-xs">
          <div className="h-2 bg-green-500 rounded-full"></div>
          <div className="h-2 bg-green-500 rounded-full"></div>
          <div className="h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    );
  }
  