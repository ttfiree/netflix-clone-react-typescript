import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { getRandomNumber } from "src/utils/common";
import { getMovieUrl } from "src/utils/urlHelper";
import MaxLineTypography from "./MaxLineTypography";
import PlayButton from "./PlayButton";
import MoreInfoButton from "./MoreInfoButton";
import MaturityRate from "./MaturityRate";
import { MEDIA_TYPE } from "src/types/Common";
import {
  useGetVideosByCustomGenreQuery,
} from "src/store/slices/supabaseSlice";
import { Movie } from "src/types/Movie";
import { 
  getBackdropSrcSet, 
  getOptimizedBackdropUrl, 
  shouldOptimizeImage 
} from "src/utils/imageOptimization";

interface TopTrailerProps {
  mediaType: MEDIA_TYPE;
}

export default function TopTrailer({ mediaType }: TopTrailerProps) {
  // 直接获取所有视频（不使用apiString）
  const { data } = useGetVideosByCustomGenreQuery({
    mediaType,
    apiString: "all", // 使用"all"作为标识
    page: 1,
  });
  const [video, setVideo] = useState<Movie | null>(null);
  const maturityRate = useMemo(() => {
    return getRandomNumber(20);
  }, []);

  useEffect(() => {
    if (data && data.results && data.results.length > 0) {
      const videos = data.results.filter((item) => !!item.backdrop_path);
      if (videos.length > 0) {
        const selectedVideo = videos[getRandomNumber(videos.length)];
        setVideo(selectedVideo);
        
        // 预加载 LCP 图片
        if (selectedVideo.backdrop_path) {
          const imageUrl = shouldOptimizeImage(selectedVideo.backdrop_path)
            ? getOptimizedBackdropUrl(selectedVideo.backdrop_path)
            : selectedVideo.backdrop_path;
          
          // 创建预加载 link
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = imageUrl;
          link.fetchPriority = 'high';
          
          // 添加 srcset 支持
          if (shouldOptimizeImage(selectedVideo.backdrop_path)) {
            const srcSet = getBackdropSrcSet(selectedVideo.backdrop_path);
            if (srcSet) {
              link.setAttribute('imagesrcset', srcSet);
              link.setAttribute('imagesizes', '100vw');
            }
          }
          
          document.head.appendChild(link);
        }
      }
    }
  }, [data]);

  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <Box
        sx={{
          mb: 3,
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 比例
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {video && (
            <>
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  position: "absolute",
                }}
              >
                {/* 背景图片 - LCP 优化 */}
                <img
                  src={
                    shouldOptimizeImage(video.backdrop_path || video.poster_path || "")
                      ? getOptimizedBackdropUrl(video.backdrop_path || video.poster_path || "")
                      : video.backdrop_path || video.poster_path || ""
                  }
                  srcSet={
                    shouldOptimizeImage(video.backdrop_path || video.poster_path || "")
                      ? getBackdropSrcSet(video.backdrop_path || video.poster_path || "")
                      : undefined
                  }
                  sizes="100vw"
                  alt={video.title}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                />
                {/* 左侧渐变遮罩 */}
                <Box
                  sx={{
                    background: `linear-gradient(77deg,rgba(0,0,0,.6),transparent 85%)`,
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: "26.09%",
                    opacity: 1,
                    position: "absolute",
                    transition: "opacity .5s",
                  }}
                />
                {/* 底部渐变遮罩 */}
                <Box
                  sx={{
                    backgroundColor: "transparent",
                    backgroundImage:
                      "linear-gradient(180deg,hsla(0,0%,8%,0) 0,hsla(0,0%,8%,.15) 15%,hsla(0,0%,8%,.35) 29%,hsla(0,0%,8%,.58) 44%,#141414 68%,#141414)",
                    backgroundRepeat: "repeat-x",
                    backgroundPosition: "0px top",
                    backgroundSize: "100% 100%",
                    bottom: 0,
                    position: "absolute",
                    height: "14.7vw",
                    opacity: 1,
                    top: "auto",
                    width: "100%",
                  }}
                />
                {/* 年龄分级标签 */}
                <Box
                  sx={{
                    position: "absolute",
                    right: { xs: 2, sm: 3 },
                    bottom: "35%",
                  }}
                >
                  <MaturityRate>{`${maturityRate}+`}</MaturityRate>
                </Box>
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: "100%",
                  height: "100%",
                }}
              >
                <Stack
                  spacing={4}
                  sx={{
                    bottom: "35%",
                    position: "absolute",
                    left: { xs: "4%", md: "60px" },
                    top: 0,
                    width: "36%",
                    zIndex: 10,
                    justifyContent: "flex-end",
                  }}
                >
                  <MaxLineTypography
                    variant="h2"
                    maxLine={1}
                    color="text.primary"
                  >
                    {video.title}
                  </MaxLineTypography>
                  <MaxLineTypography
                    variant="body1"
                    maxLine={3}
                    color="text.primary"
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' } }}
                  >
                    {video.overview}
                  </MaxLineTypography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <PlayButton 
                      size="large" 
                      videoId={video.id}
                      videoTitle={video.title}
                    />
                    <MoreInfoButton
                      size="large"
                      onClick={() => {
                        window.open(getMovieUrl(video.id, video.title), "_blank");
                      }}
                    />
                  </Stack>
                </Stack>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
