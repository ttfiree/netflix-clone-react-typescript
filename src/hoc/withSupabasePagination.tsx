import { ElementType, useCallback, useEffect } from "react";
import MainLoadingScreen from "src/components/MainLoadingScreen";
import { useAppDispatch, useAppSelector } from "src/hooks/redux";
import {
  initiateItem,
} from "src/store/slices/discover";
import {
  useLazyGetVideosByGenreIdQuery,
  useLazyGetVideosByCustomGenreQuery,
} from "src/store/slices/supabaseSlice";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";

export default function withSupabasePagination(
  Component: ElementType,
  mediaType: MEDIA_TYPE,
  genre: Genre | CustomGenre
) {
  return function WithSupabasePagination() {
    const dispatch = useAppDispatch();
    const itemKey = genre.id ?? (genre as CustomGenre).apiString;
    const mediaState = useAppSelector((state) => state.discover[mediaType]);
    const pageState = mediaState ? mediaState[itemKey] : undefined;
    const [getVideosByGenreId] = useLazyGetVideosByGenreIdQuery();
    const [getVideosByCustomGenre] = useLazyGetVideosByCustomGenreQuery();

    console.log(`withSupabasePagination - genre:`, genre);
    console.log(`withSupabasePagination - itemKey:`, itemKey);
    console.log(`withSupabasePagination - pageState:`, pageState);

    const handleNext = useCallback((page: number) => {
      console.log(`handleNext called - genre.id: ${genre.id}, page: ${page}`);
      if (genre.id) {
        getVideosByGenreId({
          mediaType,
          genreId: genre.id,
          page,
        });
      } else {
        getVideosByCustomGenre({
          mediaType,
          apiString: (genre as CustomGenre).apiString,
          page,
        });
      }
    }, [genre.id, mediaType, getVideosByGenreId, getVideosByCustomGenre]);

    useEffect(() => {
      console.log(`useEffect 1 - mediaState:`, mediaState, `pageState:`, pageState);
      if (!mediaState || !pageState) {
        console.log(`Dispatching initiateItem for ${itemKey}`);
        dispatch(initiateItem({ mediaType, itemKey }));
      }
    }, [mediaState, pageState, dispatch, mediaType, itemKey]);

    useEffect(() => {
      console.log(`useEffect 2 - pageState:`, pageState);
      if (pageState && pageState.page === 0) {
        console.log(`Calling handleNext for page 1`);
        handleNext(pageState.page + 1);
      }
    }, [pageState, handleNext]);

    if (pageState) {
      console.log(`Rendering component with pageState:`, pageState);
      return (
        <Component genre={genre} data={pageState} handleNext={handleNext} />
      );
    }
    console.log(`Showing loading screen for ${genre.name}`);
    return <MainLoadingScreen />;
  };
}
