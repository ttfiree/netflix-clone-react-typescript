import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import HeroSection from "src/components/HeroSection";
import { useGetGenresQuery } from "src/store/slices/supabaseGenre";
import { MEDIA_TYPE } from "src/types/Common";
import { Genre } from "src/types/Genre";
import { getVideosForAllTypes } from "src/lib/supabaseApi";
import { PaginatedMovieResult } from "src/types/Common";
import SlickSlider from "src/components/slick-slider/SlickSlider";

// 移除loader，不再预加载
export async function loader() {
  return null;
}

export function Component() {
  const { data: genres } = useGetGenresQuery(MEDIA_TYPE.Movie);
  const [videosData, setVideosData] = useState<Record<number, PaginatedMovieResult>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      const data = await getVideosForAllTypes(20);
      setVideosData(data);
      setLoading(false);
    }
    loadVideos();
  }, []);

  return (
    <Stack spacing={2}>
      <HeroSection mediaType={MEDIA_TYPE.Movie} />
      
      {loading && (
        <Typography sx={{ px: { xs: 2, sm: 3, md: 5 }, color: 'white' }}>
          加载视频中...
        </Typography>
      )}
      
      {!loading && genres && genres.length > 0 && (
        <>
          {genres.map((genre: Genre) => {
            const genreVideos = videosData[genre.id];
            if (!genreVideos || genreVideos.results.length === 0) {
              return null;
            }
            return (
              <Box key={genre.id}>
                <SlickSlider
                  genre={genre}
                  data={genreVideos}
                  handleNext={() => {}}
                />
              </Box>
            );
          })}
        </>
      )}
    </Stack>
  );
}

Component.displayName = "HomePage";
