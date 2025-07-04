import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Importamos Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Importamos componentes
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ListTemporada from './pages/temporada/ListTemporada';
import FormTemporada from './pages/temporada/FormTemporada';
import ListRecompensa from './pages/recompensa/ListRecompensa';
import FormRecompensa from './pages/recompensa/FormRecompensa';
import ListRecompensasCanjeables from './pages/canje/ListRecompensasCanjeables';
import ListAccionEcologica from './pages/accion/ListAccionEcologica';
import FormAccionEcologica from './pages/accion/FormAccionEcologica';
import ListUsuarios from './pages/usuario/ListUsuarios';
import FormUsuario from './pages/usuario/FormUsuario';
import TopUsuarios from './pages/ranking/TopUsuarios';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "temporadas",
        element: <ListTemporada />
      },
      {
        path: "temporadas/nuevo",
        element: <FormTemporada />
      },
      {
        path: "temporadas/editar/:id",
        element: <FormTemporada />
      },
      {
        path: "recompensas",
        element: <ListRecompensa />
      },
      {
        path: "recompensas/nuevo",
        element: <FormRecompensa />
      },
      {
        path: "recompensas/editar/:id",
        element: <FormRecompensa />
      },
      { path: "recompensas/canjeables",
        element: <ListRecompensasCanjeables />
      },
      {
        path: "acciones",
        element: <ListAccionEcologica />
      },
      {
        path: "acciones/nuevo",
        element: <FormAccionEcologica />
      },
      {
        path: "acciones/editar/:id",
        element: <FormAccionEcologica />
      },
      {
        path: "usuarios",
        element: <ListUsuarios />
      },
      {
        path: "usuarios/nuevo",
        element: <FormUsuario />
      },
      {
        path: "usuarios/editar/:id",
        element: <FormUsuario />
      },
      {
        path: "ranking",
        element: <TopUsuarios />
      },

    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
