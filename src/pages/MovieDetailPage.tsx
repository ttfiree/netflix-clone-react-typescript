import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { extractMovieId, generateSlug } from "src/utils/urlHelper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AgeLimitChip from "src/components/AgeLimitChip";
import QualityChip from "src/components/QualityChip";
import { formatMinuteToReadable, getRandomNumber } from "src/utils/common";
import SimilarVideoCard from "src/components/SimilarVideoCard";
import { useGetVideoDetailQuery, useGetSimilarVideosQuery } from "src/store/slices/supabaseSlice";
import { MEDIA_TYPE } from "src/types/Common";
import { parsePlayUrl } from "src/lib/supabaseApi";
import AppleCMSPlayer from "src/components/AppleCMSPlayer";

export function Component() {
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  const navigate = useNavigate();
  const movieId = extractMovieId(id || "0");
  
  const { data: movieDetail, isLoading } = useGetVideoDetailQuery(
    { mediaType: MEDIA_TYPE.Movie, id: movieId },
    { skip: !movieId }
  );
  
  const { data: similarVideos } = useGetSimilarVideosQuery(
    { mediaType: MEDIA_TYPE.Movie, id: movieId },
    { skip: !movieId }
  );

  // 解析播放数据
  const playData = movieDetail ? parsePlayUrl(
    (movieDetail as any).vod_play_from,
    (movieDetail as any).vod_play_url
  ) : null;

  // 调试：输出原始数据
  if (movieDetail) {
    console.log('原始播放数据:');
    console.log('vod_play_from:', (movieDetail as any).vod_play_from);
    console.log('vod_play_url:', (movieDetail as any).vod_play_url);
  }

  useEffect(() => {
    if (movieDetail) {
      const correctSlug = generateSlug(movieDetail.title, movieId);
      if (slug !== correctSlug) {
        navigate(`/movie/${movieId}/${correctSlug}`, { replace: true });
        return;
      }
      
      document.title = `${movieDetail.title} - Netflix Clone`;
      
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', movieDetail.overview || `Watch ${movieDetail.title} on Netflix Clone`);
      
      const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      ogTitle.setAttribute('content', movieDetail.title);
      if (!document.querySelector('meta[property="og:title"]')) {
        document.head.appendChild(ogTitle);
      }
      
      const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
      ogDescription.setAttribute('property', 'og:description');
      ogDescription.setAttribute('content', movieDetail.overview || '');
      if (!document.querySelector('meta[property="og:description"]')) {
        document.head.appendChild(ogDescription);
      }
      
      const ogImage = document.querySelector('meta[property="og:image"]') || document.createElement('meta');
      ogImage.setAttribute('property', 'og:image');
      ogImage.setAttribute('content', `https://image.tmdb.org/t/p/w1280${movieDetail.backdrop_path}`);
      if (!document.querySelector('meta[property="og:image"]')) {
        document.head.appendChild(ogImage);
      }
    }
    return () => {
      document.title = "Netflix Clone";
    };
  }, [movieDetail, movieId, slug, navigate]);

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#141414", pt: 10 }}>
        <Container>
          <Typography sx={{ color: 'white' }}>Loading...</Typography>
        </Container>
      </Box>
    );
  }

  if (!movieDetail) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#141414", pt: 10 }}>
        <Container>
          <Typography sx={{ color: 'white' }}>Movie not found</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#141414", pt: { xs: 8, sm: 10 } }}>
      {/* 返回按钮 */}
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          position: "fixed",
          top: { xs: 70, sm: 80 },
          left: { xs: 10, sm: 20 },
          bgcolor: "rgba(24, 24, 24, 0.8)",
          width: { xs: 32, sm: 40 },
          height: { xs: 32, sm: 40 },
          zIndex: 1000,
          backdropFilter: "blur(10px)",
          "&:hover": {
            bgcolor: "primary.main",
          },
        }}
      >
        <ArrowBackIcon
          sx={{ color: "white", fontSize: { xs: 18, sm: 22 } }}
        />
      </IconButton>

      {/* 播放器区域 */}
      <Container maxWidth="lg" sx={{ mb: 4, px: { xs: 2, sm: 3 } }}>
        {playData ? (
          <AppleCMSPlayer 
            playData={playData} 
            title={movieDetail.title}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              aspectRatio: "16/9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#000",
              color: "#fff",
              borderRadius: 1,
            }}
          >
            <Typography>暂无播放源</Typography>
          </Box>
        )}
      </Container>

      {/* 电影信息区域 */}
      <Container maxWidth="lg" sx={{ mb: 4, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              color: "white", 
              mb: 2,
              fontSize: { xs: '1.5rem', sm: '2rem' },
              fontWeight: 700,
            }}
          >
            {movieDetail.title}
          </Typography>
          
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
            <Typography
              variant="subtitle1"
              sx={{ color: "success.main", fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >{`${getRandomNumber(100)}% Match`}</Typography>
            <Typography variant="body2" sx={{ color: "#fff", fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
              {movieDetail.release_date.substring(0, 4)}
            </Typography>
            <AgeLimitChip label={`${getRandomNumber(20)}+`} />
            <Typography variant="subtitle2" sx={{ color: "#fff", fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{`${formatMinuteToReadable(
              getRandomNumber(180)
            )}`}</Typography>
            <QualityChip label="HD" />
          </Stack>

          <Typography
            variant="body1"
            sx={{ 
              color: "#fff",
              lineHeight: 1.6,
              mb: 3,
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            {movieDetail.overview}
          </Typography>

          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: "#fff" }}>
              <Box component="span" sx={{ color: "#777", fontWeight: 600 }}>类型: </Box>
              {movieDetail.genres.map((g) => g.name).join(", ") || '未知'}
            </Typography>
            <Typography variant="body2" sx={{ color: "#fff" }}>
              <Box component="span" sx={{ color: "#777", fontWeight: 600 }}>语言: </Box>
              {movieDetail.spoken_languages.map((l) => l.name).join(", ") || '未知'}
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* 相似电影区域 */}
      {similarVideos && similarVideos.results.length > 0 && (
        <Container maxWidth="lg" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 3, 
              color: "#fff",
              fontSize: { xs: '1.125rem', sm: '1.25rem' },
              fontWeight: 600,
            }}
          >
            More Like This
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            {similarVideos.results.map((sm) => (
              <Box key={sm.id}>
                <SimilarVideoCard video={sm} />
              </Box>
            ))}
          </Box>
        </Container>
      )}
    </Box>
  );
}

Component.displayName = "MovieDetailPage";
