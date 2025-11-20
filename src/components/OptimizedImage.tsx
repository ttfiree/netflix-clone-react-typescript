import { useState, useEffect } from 'react';
import Box, { BoxProps } from '@mui/material/Box';

interface OptimizedImageProps extends BoxProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  priority = false,
  sx,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 对于优先级高的图片，立即加载
    if (priority) {
      setImageSrc(src);
      return;
    }

    // 使用 Intersection Observer 实现懒加载
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
  }, [src, priority]);

  return (
    <Box
      component="img"
      src={imageSrc || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'}
      alt={alt}
      loading={loading}
      decoding="async"
      width={width}
      height={height}
      sx={{
        opacity: isLoaded || priority ? 1 : 0.5,
        transition: 'opacity 0.3s ease-in-out',
        ...sx,
      }}
      {...props}
    />
  );
}
