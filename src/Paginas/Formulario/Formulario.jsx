import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePost } from "../../hooks/usePost"; // Ajusta la ruta según tu estructura de carpetas

export function Formularioo() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  
  // Implementación de usePost para el registro de usuarios
  const { 
    data, 
    loading, 
    error, 
    execute: registrarUsuario,
    reset 
  } = usePost({
    url: "https://api-go.zapto.org/v1/user/", // Ajusta a tu endpoint de registro
    immediate: false,
    onSuccess: (data) => {
      console.log("Registro exitoso:", data);
      // Podríamos almacenar el token si la API lo devuelve
      // localStorage.setItem("token", data.token);
      navigate("/mapa"); // Redirige al mapa tras registro exitoso
    },
    onError: (error) => {
      console.error("Error al registrar usuario:", error);
      setFormError("Error al registrar usuario. Por favor intenta de nuevo.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");
    
    // Validaciones de formulario
    if ([nombre, email, password].includes("")) {
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
    
    // Ejecutamos la petición con los datos actuales en el formato que espera el backend
    registrarUsuario({
      name: nombre,
      email,
      password
    });
  };

  const irALogin = () => {
    navigate("/");
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          COMPLETA TUS DATOS
        </h1>

        {/* Mensaje de error */}
        {formError && (
          <div className="bg-red-500 bg-opacity-20 border border-red-600 text-red-100 px-4 py-2 rounded-lg mb-4 text-sm text-center">
            {formError}
          </div>
        )}
        
        {/* Mensaje de error de la API */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-600 text-red-100 px-4 py-2 rounded-lg mb-4 text-sm text-center">
            {error.statusText || "Error de conexión con el servidor"}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center w-full mt-4 md:mt-6 space-y-4">
            <div className="bg-gray-700 rounded-lg p-2 w-full">
              <input
                type="text"
                placeholder="Nombre"
                className="bg-transparent w-full text-lg md:text-xl text-center focus:outline-none text-white"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="bg-gray-700 rounded-lg p-2 w-full">
              <input
                type="email"
                placeholder="Correo"
                className="bg-transparent w-full text-lg md:text-xl text-center focus:outline-none text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="bg-gray-700 rounded-lg p-2 w-full">
              <input
                type="password"
                placeholder="Contraseña"
                className="bg-transparent w-full text-lg md:text-xl text-center focus:outline-none text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Botón con lógica de redirección - ajustable */}
          <div className="flex justify-center mt-6 md:mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 md:px-12 py-2 ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } rounded-lg shadow-lg text-white font-bold text-sm md:text-base transition-all min-w-32 flex items-center justify-center`}
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
                "Continuar"
              )}
            </button>
          </div>
        </form>

        {/* Texto para volver al login */}
        <div className="mt-6 text-center">
          <p
            onClick={irALogin}
            className="text-sm md:text-base text-gray-400 cursor-pointer hover:text-blue-400 transition-all duration-150"
          >
            ¿Ya tienes sesión? <span className="underline">Regresa acá</span>
          </p>
        </div>
      </div>
      
      {/* Pie de página */}
      <div className="mt-6 w-full max-w-xs md:max-w-md text-center py-4 text-xs text-gray-500">
        Sistema de Monitoreo de Bicicletas • Registro de Usuario
      </div>
    </div>
  );
}