import { createBrowserRouter, RouterProvider } from "react-router-dom";


const router = createBrowserRouter([

  {
    path: '/',
    element: <cambiale/>
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