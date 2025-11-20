/**
 * 图片优化工具函数
 */

export interface ImageSize {
  width: number;
  quality?: number;
}

export type ImageFormat = 'webp' | 'avif' | 'jpeg' | 'png' | 'auto';

/**
 * 生成 Supabase 图片的优化 URL
 * @param url 原始图片 URL
 * @param width 目标宽度
 * @param quality 图片质量 (1-100)
 * @param format 图片格式 (webp, avif, jpeg, png, auto)
 */
export function getOptimizedSupabaseImageUrl(
  url: string,
  width: number,
  quality: number = 85,
  format: ImageFormat = 'webp'
): string {
  if (!url || !url.includes('supabase.co/storage')) {
    return url;
  }

  const baseUrl = url.split('?')[0];
  const params = new URLSearchParams();
  
  params.set('width', width.toString());
  params.set('quality', quality.toString());
  
  // 添加格式转换（如果 Supabase 支持）
  if (format !== 'auto') {
    params.set('format', format);
  }
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * 生成响应式图片的 srcset
 * @param url 原始图片 URL
 * @param sizes 不同尺寸配置
 */
export function generateSrcSet(
  url: string,
  sizes: ImageSize[]
): string | undefined {
  if (!url || !url.includes('supabase.co/storage')) {
    return undefined;
  }

  const baseUrl = url.split('?')[0];
  
  return sizes
    .map(({ width, quality = 85 }) => {
      const params = new URLSearchParams();
      params.set('width', width.toString());
      params.set('quality', quality.toString());
      return `${baseUrl}?${params.toString()} ${width}w`;
    })
    .join(', ');
}

/**
 * 预定义的图片尺寸配置
 */
export const IMAGE_SIZES = {
  // 海报图片 (2:3 比例)
  poster: {
    small: { width: 200, quality: 80 },
    medium: { width: 300, quality: 85 },
    large: { width: 500, quality: 90 },
  },
  // 横幅图片 (16:9 比例)
  backdrop: {
    small: { width: 400, quality: 80 },
    medium: { width: 780, quality: 85 },
    large: { width: 1280, quality: 90 },
  },
  // Logo
  logo: {
    small: { width: 100, quality: 90 },
    medium: { width: 200, quality: 90 },
    large: { width: 400, quality: 90 },
  },
};

/**
 * 生成海报图片的 srcset
 */
export function getPosterSrcSet(url: string): string | undefined {
  return generateSrcSet(url, [
    IMAGE_SIZES.poster.small,
    IMAGE_SIZES.poster.medium,
    IMAGE_SIZES.poster.large,
  ]);
}

/**
 * 生成横幅图片的 srcset
 */
export function getBackdropSrcSet(url: string): string | undefined {
  return generateSrcSet(url, [
    IMAGE_SIZES.backdrop.small,
    IMAGE_SIZES.backdrop.medium,
    IMAGE_SIZES.backdrop.large,
  ]);
}

/**
 * 获取优化后的海报图片 URL（默认中等尺寸）
 */
export function getOptimizedPosterUrl(url: string): string {
  return getOptimizedSupabaseImageUrl(url, IMAGE_SIZES.poster.medium.width, IMAGE_SIZES.poster.medium.quality);
}

/**
 * 获取优化后的横幅图片 URL（默认中等尺寸）
 */
export function getOptimizedBackdropUrl(url: string): string {
  return getOptimizedSupabaseImageUrl(url, IMAGE_SIZES.backdrop.medium.width, IMAGE_SIZES.backdrop.medium.quality);
}

/**
 * 预加载关键图片
 */
export function preloadImage(url: string, sizes?: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  
  if (sizes) {
    link.setAttribute('imagesizes', sizes);
  }
  
  document.head.appendChild(link);
}

/**
 * 检查图片是否需要优化
 */
export function shouldOptimizeImage(url: string): boolean {
  return Boolean(url && url.includes('supabase.co/storage'));
}

/**
 * 检测浏览器支持的最佳图片格式
 */
export function getBestImageFormat(): ImageFormat {
  if (typeof window === 'undefined') return 'webp';
  
  // 检测 AVIF 支持
  const avifSupport = document.createElement('canvas').toDataURL('image/avif').indexOf('data:image/avif') === 0;
  if (avifSupport) return 'avif';
  
  // 检测 WebP 支持
  const webpSupport = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;
  if (webpSupport) return 'webp';
  
  return 'jpeg';
}

/**
 * 生成带有格式回退的 picture 元素所需的 sources
 * @param url 原始图片 URL
 * @param sizes 不同尺寸配置
 */
export function generatePictureSources(
  url: string,
  sizes: ImageSize[]
): Array<{ type: string; srcSet: string }> {
  if (!shouldOptimizeImage(url)) {
    return [];
  }

  const formats: ImageFormat[] = ['avif', 'webp'];
  const sources: Array<{ type: string; srcSet: string }> = [];

  formats.forEach((format) => {
    const baseUrl = url.split('?')[0];
    const srcSet = sizes
      .map(({ width, quality = 85 }) => {
        const params = new URLSearchParams();
        params.set('width', width.toString());
        params.set('quality', quality.toString());
        params.set('format', format);
        return `${baseUrl}?${params.toString()} ${width}w`;
      })
      .join(', ');

    sources.push({
      type: `image/${format}`,
      srcSet,
    });
  });

  return sources;
}

/**
 * 获取 WebP 格式的图片 URL
 */
export function getWebPUrl(url: string, width?: number, quality: number = 85): string {
  if (!shouldOptimizeImage(url)) return url;
  
  const baseUrl = url.split('?')[0];
  const params = new URLSearchParams();
  
  if (width) {
    params.set('width', width.toString());
  }
  params.set('quality', quality.toString());
  params.set('format', 'webp');
  
  return `${baseUrl}?${params.toString()}`;
}

/**
 * 获取 AVIF 格式的图片 URL
 */
export function getAVIFUrl(url: string, width?: number, quality: number = 80): string {
  if (!shouldOptimizeImage(url)) return url;
  
  const baseUrl = url.split('?')[0];
  const params = new URLSearchParams();
  
  if (width) {
    params.set('width', width.toString());
  }
  params.set('quality', quality.toString());
  params.set('format', 'avif');
  
  return `${baseUrl}?${params.toString()}`;
}
