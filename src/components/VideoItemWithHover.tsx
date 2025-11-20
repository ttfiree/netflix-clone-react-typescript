import { useEffect, useState, useRef } from "react";
import { Movie } from "src/types/Movie";
import { usePortal } from "src/providers/PortalProvider";
import { useGetConfigurationQuery } from "src/store/slices/configuration";
import VideoItemWithHoverPure from "./VideoItemWithHoverPure";
interface VideoItemWithHoverProps {
  video: Movie;
}

export default function VideoItemWithHover({ video }: VideoItemWithHoverProps) {
  const setPortal = usePortal();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 只在需要时才获取configuration（TMDB数据）
  const needsConfig = video.backdrop_path && !video.backdrop_path.startsWith('http');
  const { data: configuration } = useGetConfigurationQuery(undefined, {
    skip: !needsConfig,
  });

  useEffect(() => {
    if (isHovered) {
      setPortal(elementRef.current, video);
    }
  }, [isHovered]);

  // 判断是否是完整URL（Supabase）还是相对路径（TMDB）
  const imageUrl = video.backdrop_path?.startsWith('http') 
    ? video.backdrop_path 
    : `${configuration?.images.base_url || 'https://image.tmdb.org/t/p/'}w300${video.backdrop_path}`;

  return (
    <VideoItemWithHoverPure
      ref={elementRef}
      handleHover={setIsHovered}
      src={imageUrl}
      alt={video.title || "视频封面"}
    />
  );
}
