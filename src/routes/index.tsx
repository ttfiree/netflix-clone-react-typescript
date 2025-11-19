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
        element: <Navigate to={`/${MAIN_PATH.browse}`} />,
      },
      {
        path: MAIN_PATH.browse,
        lazy: () => import("src/pages/HomePage"),
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
    ],
  },
]);

export default router;
