import { configureStore } from "@reduxjs/toolkit";
import { tmdbApi } from "./slices/apiSlice";
import { supabaseApi } from "./slices/supabaseSlice";
import { supabaseGenreApi } from "./slices/supabaseGenre";
import discoverReducer from "./slices/discover";

const store = configureStore({
  reducer: {
    discover: discoverReducer,
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    [supabaseApi.reducerPath]: supabaseApi.reducer,
    [supabaseGenreApi.reducerPath]: supabaseGenreApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(tmdbApi.middleware)
      .concat(supabaseApi.middleware)
      .concat(supabaseGenreApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
