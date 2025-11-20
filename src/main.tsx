import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CustomClassNameSetup";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import store from "./store";
import { extendedApi } from "./store/slices/configuration";
import palette from "./theme/palette";
import router from "./routes";
import MainLoadingScreen from "./components/MainLoadingScreen";
import { initWebVitals } from "./utils/webVitals";

// 延迟配置加载，不阻塞初始渲染
setTimeout(() => {
  store.dispatch(extendedApi.endpoints.getConfiguration.initiate(undefined));
}, 0);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider theme={createTheme({ palette })}>
        <RouterProvider
          router={router}
          fallbackElement={<MainLoadingScreen />}
        />
      </ThemeProvider>
    </React.StrictMode>
  </Provider>
);

// Initialize Web Vitals monitoring
initWebVitals();

// Register Service Worker for caching and performance
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        // SW registered successfully
      })
      .catch(() => {
        // SW registration failed
      });
  });
}

// Optimize for bfcache (back/forward cache)
// Avoid using beforeunload, unload events which block bfcache
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Page was restored from bfcache - reload if needed
    window.location.reload();
  }
});

// Use pagehide instead of unload for cleanup
window.addEventListener('pagehide', (event) => {
  if (event.persisted) {
    // Page is entering bfcache - save state if needed
  }
});
