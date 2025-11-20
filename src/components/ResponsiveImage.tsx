import { useState, useEffect } from 'react';
import Box, { BoxProps } from '@mui/material/Box';

interface ResponsiveImageProps extends Omit<BoxProps, 'component'> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
}

/**
 * 响应式图片组件
 * 自动生成 Supabase 图片的不同尺寸版本
 */
export default function ResponsiveImage({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  sizes,
  sx,
  ...props
}: ResponsiveImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [srcSet, setSrcSet] = useState<string>('');

  useEffect(() => {
    if (!src) return;

    // 检查是否是 Supabase 图片
    if (src.includes('supabase.co/storage')) {
      // 生成不同尺寸的 srcset
      // Supabase 支持通过 URL 参数调整图片大小
      const baseUrl = src.split('?')[0];
      
      // 生成 srcset：小、中、大三个尺寸
      const srcSetArray = [
        `${baseUrl}?width=300&quality=80 300w`,
        `${baseUrl}?width=600&quality=85 600w`,
        `${baseUrl}?width=1200&quality=90 1200w`,
      ];
      
      setSrcSet(srcSetArray.join(', '));
      setImageSrc(`${baseUrl}?width=600&quality=85`); // 默认中等尺寸
    } else {
      // 非 Supabase 图片，直接使用原始 URL
      setImageSrc(src);
    }
  }, [src]);

  return (
    <Box
      component="img"
      src={imageSrc || src}
      srcSet={srcSet || undefined}
      sizes={sizes || '(max-width: 600px) 300px, (max-width: 1200px) 600px, 1200px'}
      alt={alt}
      loading={loading}
      decoding="async"
      width={width}
      height={height}
      sx={{
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
        ...sx,
      }}
      {...props}
    />
  );
}
