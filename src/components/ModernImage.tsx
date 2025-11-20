import { CSSProperties } from 'react';
import Box from '@mui/material/Box';
import {
  shouldOptimizeImage,
  generatePictureSources,
  getOptimizedSupabaseImageUrl,
  IMAGE_SIZES,
  ImageSize,
} from 'src/utils/imageOptimization';

interface ModernImageProps {
  src: string;
  alt: string;
  type?: 'poster' | 'backdrop' | 'logo';
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
  sizes?: string;
  className?: string;
  style?: CSSProperties;
  onError?: () => void;
}

/**
 * 现代化图片组件
 * 
 * 特性：
 * - 自动使用 WebP/AVIF 格式（带回退）
 * - 响应式图片（srcset）
 * - 懒加载支持
 * - 优先级控制
 * 
 * 使用示例：
 * ```tsx
 * <ModernImage
 *   src={video.poster_path}
 *   alt={video.title}
 *   type="poster"
 *   loading="lazy"
 * />
 * ```
 */
export default function ModernImage({
  src,
  alt,
  type = 'poster',
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes,
  className,
  style,
  onError,
}: ModernImageProps) {
  // 如果不是 Supabase 图片，使用普通 img 标签
  if (!shouldOptimizeImage(src)) {
    return (
      <Box
        component="img"
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        className={className}
        sx={style}
        onError={onError}
      />
    );
  }

  // 根据类型选择尺寸配置
  const sizeConfig: ImageSize[] = (() => {
    switch (type) {
      case 'poster':
        return [
          IMAGE_SIZES.poster.small,
          IMAGE_SIZES.poster.medium,
          IMAGE_SIZES.poster.large,
        ];
      case 'backdrop':
        return [
          IMAGE_SIZES.backdrop.small,
          IMAGE_SIZES.backdrop.medium,
          IMAGE_SIZES.backdrop.large,
        ];
      case 'logo':
        return [
          IMAGE_SIZES.logo.small,
          IMAGE_SIZES.logo.medium,
          IMAGE_SIZES.logo.large,
        ];
      default:
        return [
          IMAGE_SIZES.poster.small,
          IMAGE_SIZES.poster.medium,
          IMAGE_SIZES.poster.large,
        ];
    }
  })();

  // 生成不同格式的 sources
  const sources = generatePictureSources(src, sizeConfig);

  // 默认的 sizes 属性
  const defaultSizes = (() => {
    switch (type) {
      case 'poster':
        return '(max-width: 600px) 200px, (max-width: 900px) 300px, 500px';
      case 'backdrop':
        return '(max-width: 600px) 400px, (max-width: 1200px) 780px, 1280px';
      case 'logo':
        return '(max-width: 600px) 100px, (max-width: 900px) 200px, 400px';
      default:
        return '100vw';
    }
  })();

  // 回退图片 URL（JPEG 格式）
  const fallbackUrl = getOptimizedSupabaseImageUrl(
    src,
    sizeConfig[1].width, // 使用中等尺寸
    sizeConfig[1].quality,
    'jpeg'
  );

  return (
    <picture>
      {/* AVIF 格式（最优压缩） */}
      {sources[0] && (
        <source
          type={sources[0].type}
          srcSet={sources[0].srcSet}
          sizes={sizes || defaultSizes}
        />
      )}
      
      {/* WebP 格式（广泛支持） */}
      {sources[1] && (
        <source
          type={sources[1].type}
          srcSet={sources[1].srcSet}
          sizes={sizes || defaultSizes}
        />
      )}
      
      {/* JPEG 回退（兼容性） */}
      <Box
        component="img"
        src={fallbackUrl}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={className}
        sx={style}
        onError={onError}
      />
    </picture>
  );
}
