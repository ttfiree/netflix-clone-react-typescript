import withSupabasePagination from "src/hoc/withSupabasePagination";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import SlickSlider from "./slick-slider/SlickSlider";

interface SliderRowForGenreProps {
  genre: Genre | CustomGenre;
  mediaType: MEDIA_TYPE;
}
export default function SliderRowForGenre({
  genre,
  mediaType,
}: SliderRowForGenreProps) {
  const Component = withSupabasePagination(SlickSlider, mediaType, genre);
  return <Component />;
}
