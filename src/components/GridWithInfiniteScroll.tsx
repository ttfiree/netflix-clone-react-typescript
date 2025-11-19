import { useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import VideoItemWithHover from "./VideoItemWithHover";
import { CustomGenre, Genre } from "src/types/Genre";
import { PaginatedMovieResult } from "src/types/Common";
import useIntersectionObserver from "src/hooks/useIntersectionObserver";

interface GridWithInfiniteScrollProps {
  genre: Genre | CustomGenre;
  data: PaginatedMovieResult;
  handleNext: (page: number) => void;
}
export default function GridWithInfiniteScroll({
  genre,
  data,
  handleNext,
}: GridWithInfiniteScrollProps) {
  const intersectionRef = useRef<HTMLDivElement | null>(null);
  const intersection = useIntersectionObserver(intersectionRef as React.RefObject<HTMLElement>);

  useEffect(() => {
    if (
      intersection &&
      intersection.intersectionRatio === 1 &&
      data.page < data.total_pages
    ) {
      handleNext(data.page + 1);
    }
  }, [intersection]);

  return (
    <>
      <Container
        maxWidth={false}
        sx={{
          px: { xs: "30px", sm: "60px" },
          pb: 4,
          pt: "150px",
          bgcolor: "inherit",
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "text.primary", mb: 2 }}
        >{`${genre.name} Movies`}</Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(4, 1fr)",
              md: "repeat(6, 1fr)",
            },
            gap: 2,
          }}
        >
          {data.results
            .filter((v) => !!v.backdrop_path)
            .map((video, idx) => (
              <Box key={`${video.id}_${idx}`} sx={{ zIndex: 1 }}>
                <VideoItemWithHover video={video} />
              </Box>
            ))}
        </Box>
      </Container>
      <Box sx={{ display: "hidden" }} ref={intersectionRef} />
    </>
  );
}
