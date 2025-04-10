import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../hooks/usePost";

export function InicioSesion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  
  // Usamos la versión mejorada del hook usePost con opciones adicionales
  const { 
    data, 
    loading, 
    error, 
    execute: iniciarSesion, 
    reset 
  } = usePost({
    url: "https://api-go.zapto.org/v1/user/auth",
    // No enviamos object inmediatamente para evitar peticiones innecesarias
    immediate: false,
    onSuccess: (data) => {

      console.log("Inicio de sesión exitoso:", data);
      localStorage.setItem("token", data.token);
      navigate("/mapa"); 
    },
    onError: (error) => {
      console.error("Error al iniciar sesión:", error);
      setFormError("Error al iniciar sesión. Por favor intenta de nuevo.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    
    // Validaciones de formulario
    if ([email, password].includes("")) {
      setFormError("Todos los campos son requeridos");
      return;
    }
    
    if (!email.includes("@")) {
      setFormError("El correo electrónico no es válido");
      return;
    }
    
    if (password.length < 6) {
      setFormError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    
    // Ejecutamos la petición con los datos actuales
    iniciarSesion({ email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4">
      {/* Contenedor principal con tamaños responsive */}
      <div className="w-full max-w-xs md:max-w-md bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 p-6 transition-all hover:shadow-xl">
        {/* Título - más pequeño en móvil, más grande en PC */}
        <h1 className="text-xl md:text-3xl text-center mb-4 font-bold border-b border-gray-700 pb-2 flex items-center justify-center gap-2">
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          BIKE MONITORING
        </h1>
        
        {/* Íconos - ajustados para ambos tamaños */}
        <div className="flex justify-center gap-8 md:gap-16 mt-2 md:mt-6">
          <div className="bg-gray-700 rounded-lg p-3 shadow-md transition-all hover:bg-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:h-8 md:w-8 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div className="bg-gray-700 rounded-lg p-3 shadow-md transition-all hover:bg-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:h-8 md:w-8 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        </div>
        
        {/* Imagen de bicicleta - tamaño ajustable */}
        <div className="flex justify-center my-6 md:my-8">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center bg-gray-700 border-4 border-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 md:h-16 md:w-16 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        </div>
        
        {/* Mensaje de error */}
        {formError && (
          <div className="bg-red-500 bg-opacity-20 border border-red-600 text-red-100 px-4 py-2 rounded-lg mb-4 text-sm text-center">
            {formError}
          </div>
        )}
        
        {/* Mensaje de error de la API */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-600 text-red-100 px-4 py-2 rounded-lg mb-4 text-sm text-center">
            {error.statusText || "Error de conexión"}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Campos de entrada - ancho ajustable */}
          <div className="flex flex-col items-center w-full space-y-4">
            <div className="bg-gray-700 rounded-lg p-2 w-full">
              <input
                type="text"
                placeholder="Correo"
                className="bg-transparent w-full text-lg md:text-xl text-center focus:outline-none text-white"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={loading}
              />
            </div>
            <div className="bg-gray-700 rounded-lg p-2 w-full">
              <input
                type="password"
                placeholder="Contraseña"
                className="bg-transparent w-full text-lg md:text-xl text-center focus:outline-none text-white"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Botones - Con estados de carga */}
          <div className="flex justify-center mt-6 md:mt-10 space-x-4 flex-col items-center space-x-0 space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 md:px-12 py-2 ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } rounded-lg shadow-lg text-white font-bold text-sm md:text-base transition-all flex items-center justify-center min-w-32`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
            <button
              type="button"
              disabled={loading}
              className={`px-8 md:px-12 py-2 ${
                loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } rounded-lg shadow-lg text-white font-bold text-sm md:text-base transition-all`}
              onClick={() => navigate("/formulario")}
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
      
      {/* Pie de página */}
      <div className="mt-6 w-full max-w-xs md:max-w-md text-center py-4 text-xs text-gray-500">
        Sistema de Monitoreo de Bicicletas • Versión 1.0
      </div>
    </div>
  );
}