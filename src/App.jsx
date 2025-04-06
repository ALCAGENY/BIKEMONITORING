import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { InicioSesion } from "./Paginas/InicioSesion/InicioSesion";
import { Formularioo } from "./Paginas/Formulario/Formulario";
import { Mapa } from "./Paginas/Mapa/Mapa";

const router = createBrowserRouter([

  {
    path: '/',
    element: <InicioSesion/>
  },
  {
    path: '/formulario',
    element: <Formularioo/>
  },
  {
    path: '/mapa',
    element: <Mapa/>
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;