import Button, { ButtonProps } from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useNavigate } from "react-router-dom";
import { MAIN_PATH } from "src/constant";

interface PlayButtonProps extends ButtonProps {
  videoId?: number;
  videoTitle?: string;
}

export default function PlayButton({ sx, videoId, videoTitle, ...others }: PlayButtonProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (videoId && videoTitle) {
      // 如果有视频信息，跳转到详情页
      const slug = videoTitle
        .toLowerCase()
        .replace(/[\s\/:：]+/g, '-')
        .replace(/[^\u4e00-\u9fa5a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      window.open(`/movie/${videoId}/${slug}`, '_blank');
    } else {
      // 否则跳转到watch页面
      navigate(`/${MAIN_PATH.watch}`);
    }
  };
  
  return (
    <Button
      variant="contained"
      startIcon={
        <PlayArrowIcon
          sx={{
            fontSize: {
              xs: "24px !important",
              sm: "32px !important",
              md: "40px !important",
            },
          }}
        />
      }
      {...others}
      sx={{
        px: { xs: 1, sm: 2 },
        py: { xs: 0.5, sm: 1 },
        fontSize: { xs: 18, sm: 24, md: 28 },
        lineHeight: 1.5,
        fontWeight: "bold",
        whiteSpace: "nowrap",
        textTransform: "capitalize",
        bgcolor: "white",
        color: "black",
        "&:hover": {
          bgcolor: "rgba(255, 255, 255, 0.85)",
        },
        ...sx,
      }}
      onClick={handleClick}
    >
      Play
    </Button>
  );
}
