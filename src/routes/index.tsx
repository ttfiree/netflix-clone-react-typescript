import { Navigate, createBrowserRouter } from "react-router-dom";
import { MAIN_PATH } from "src/constant";

import MainLayout from "src/layouts/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: MAIN_PATH.root,
        lazy: () => import("src/pages/HomePage"),
      },
      {
        path: MAIN_PATH.browse,
        element: <Navigate to="/" replace />,
      },
      {
        path: MAIN_PATH.genreExplore,
        children: [
          {
            path: ":categoryEn",
            lazy: () => import("src/pages/CategoryPage"),
          },
        ],
      },
      {
        path: MAIN_PATH.watch,
        lazy: () => import("src/pages/WatchPage"),
      },
      {
        path: `${MAIN_PATH.movie}/:id/:slug?`,
        lazy: () => import("src/pages/MovieDetailPage"),
      },
      {
        path: "search",
        lazy: () => import("src/pages/SearchPage"),
      },
      {
        path: "actor/:id",
        lazy: () => import("src/pages/ActorPage"),
      },
    ],
  },
]);

export default router;
