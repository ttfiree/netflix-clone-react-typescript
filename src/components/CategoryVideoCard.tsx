import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Movie } from "src/types/Movie";
import { generateSlug } from "src/utils/urlHelper";
import { getPosterSrcSet, getOptimizedPosterUrl, shouldOptimizeImage } from "src/utils/imageOptimization";

interface CategoryVideoCardProps {
  video: Movie;
}

export default function CategoryVideoCard({ video }: CategoryVideoCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    const slug = generateSlug(video.title, video.id);
    navigate(`/movie/${video.id}/${slug}`);
  };

  // 获取海报图片URL
  const getPosterUrl = () => {
    if (video.poster_path) {
      // 如果是完整URL（Supabase）
      if (video.poster_path.startsWith('http')) {
        // 如果是 Supabase 图片，返回优化后的 URL
        if (shouldOptimizeImage(video.poster_path)) {
          return getOptimizedPosterUrl(video.poster_path);
        }
        return video.poster_path;
      }
      // 如果是TMDB路径
      return `https://image.tmdb.org/t/p/w500${video.poster_path}`;
    }
    // 默认占位图
    return 'https://via.placeholder.com/500x750?text=No+Image';
  };

  // 生成响应式图片 srcset
  const getSrcSet = () => {
    if (!video.poster_path || !video.poster_path.startsWith('http')) {
      return undefined;
    }
    
    // Supabase 图片支持动态调整大小
    if (shouldOptimizeImage(video.poster_path)) {
      return getPosterSrcSet(video.poster_path);
    }
    
    return undefined;
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          zIndex: 1,
          '& .video-title': {
            color: 'primary.main',
          },
        },
      }}
    >
      {/* 海报图片 */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '150%', // 2:3 比例
          bgcolor: '#2a2a2a',
          borderRadius: 1,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        <Box
          component="img"
          src={getPosterUrl()}
          srcSet={getSrcSet()}
          sizes="(max-width: 600px) 200px, (max-width: 900px) 300px, 500px"
          alt={video.title}
          loading="lazy"
          decoding="async"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e: any) => {
            e.target.src = 'https://via.placeholder.com/500x750?text=No+Image';
          }}
        />
      </Box>

      {/* 标题 */}
      <Typography
        className="video-title"
        sx={{
          mt: 1,
          color: 'white',
          fontSize: { xs: '0.875rem', sm: '1rem' },
          fontWeight: 500,
          lineHeight: 1.4,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          transition: 'color 0.3s ease',
        }}
      >
        {video.title}
      </Typography>

      {/* 评分和年份 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mt: 0.5,
        }}
      >
        {video.vote_average > 0 && (
          <Typography
            sx={{
              color: 'warning.main',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              fontWeight: 600,
            }}
          >
            ⭐ {video.vote_average.toFixed(1)}
          </Typography>
        )}
        {video.release_date && (
          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            }}
          >
            {video.release_date.substring(0, 4)}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
