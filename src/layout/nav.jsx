import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Función para verificar si una ruta está activa
  const isActive = (path) => location.pathname === path;
  
  // Función para cerrar sesión
  const cerrarSesion = () => {
    // Eliminar token o datos de sesión si existen
    localStorage.removeItem('token');
    // Redirigir al login
    navigate('/');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-800 to-gray-900">
      {/* Barra de navegación */}
      <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo y título */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-400 mr-2"
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
                <span className="text-white font-bold text-lg md:text-xl">BIKE MONITORING</span>
              </div>
            </div>
            
            {/* Links de navegación (escritorio) */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link 
                to="/mapa" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive('/mapa') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Mapa
              </Link>
              <Link 
                to="/alarma" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive('/alarma') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Alarma
              </Link>
              <Link 
                to="/colisiones" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive('/colisiones') 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Colisiones
              </Link>
              <button 
                onClick={cerrarSesion}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-all"
              >
                Cerrar Sesión
              </button>
            </div>
            
            {/* Botón de menú móvil */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
              >
                <span className="sr-only">Abrir menú principal</span>
                {/* Icono de menú */}
                {!menuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 border-t border-gray-700">
              <Link
                to="/mapa"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                  isActive('/mapa')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Mapa
              </Link>
              <Link
                to="/alarma"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                  isActive('/alarma')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Alarma
              </Link>
              <Link
                to="/colisiones"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-all ${
                  isActive('/colisiones')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Colisiones
              </Link>
              <button
                onClick={() => {
                  cerrarSesion();
                  setMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-all"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </nav>
      
      {/* Contenedor principal para el contenido (Outlet) */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Pie de página */}
      <footer className="w-full text-center py-4 text-xs text-gray-500 bg-gray-800 border-t border-gray-700">
        Sistema de Monitoreo de Bicicletas • Versión 1.0
      </footer>
    </div>
  );
}