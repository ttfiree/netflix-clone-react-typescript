// 简单的内存缓存工具
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class DataCache {
  private cache: Map<string, CacheItem<any>> = new Map();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const dataCache = new DataCache();

// 缓存键生成器
export const cacheKeys = {
  videos: (page: number, limit: number) => `videos_${page}_${limit}`,
  videosByType: (typeId: number, page: number, limit: number) => 
    `videos_type_${typeId}_${page}_${limit}`,
  videoDetail: (vodId: number) => `video_detail_${vodId}`,
  allTypesVideos: (limit: number) => `all_types_videos_${limit}`,
  genres: () => 'genres',
};
