import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { InicioSesion } from "./Paginas/InicioSesion/InicioSesion";
import { Formularioo } from "./Paginas/Formulario/Formulario";
import { Mapa } from "./Paginas/Mapa/Mapa";
import { Alarma } from "./Paginas/Alarma/Alarma";
import { Colisiones } from "./Paginas/Colisiones/Colisiones";
import { Layout } from "./layout/nav";

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
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: '/mapa',
        element: <Mapa/>
      },
      {
        path: '/alarma',
        element: <Alarma/>
      },
      {
        path: '/colisiones',
        element: <Colisiones/>
      },
    ]
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;