// 增强的缓存工具 - 支持内存和 localStorage 双层缓存
interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class DataCache {
  private memoryCache: Map<string, CacheItem<any>> = new Map();
  private readonly STORAGE_PREFIX = 'app_cache_';
  private readonly useLocalStorage: boolean;

  constructor(useLocalStorage = true) {
    this.useLocalStorage = useLocalStorage && typeof window !== 'undefined' && !!window.localStorage;
    
    // 启动时清理过期的 localStorage 缓存
    if (this.useLocalStorage) {
      this.cleanExpiredLocalStorage();
    }
  }

  /**
   * 设置缓存
   * @param key 缓存键
   * @param data 缓存数据
   * @param ttl 过期时间（毫秒）
   * @param persistent 是否持久化到 localStorage
   */
  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000, persistent = false): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // 内存缓存
    this.memoryCache.set(key, item);

    // localStorage 持久化（用于长期缓存）
    if (persistent && this.useLocalStorage) {
      try {
        localStorage.setItem(
          this.STORAGE_PREFIX + key,
          JSON.stringify(item)
        );
      } catch (error) {
        console.warn('localStorage 写入失败:', error);
      }
    }
  }

  /**
   * 获取缓存
   * @param key 缓存键
   * @returns 缓存数据或 null
   */
  get<T>(key: string): T | null {
    // 先从内存缓存获取
    let item = this.memoryCache.get(key);
    
    // 如果内存中没有，尝试从 localStorage 获取
    if (!item && this.useLocalStorage) {
      try {
        const stored = localStorage.getItem(this.STORAGE_PREFIX + key);
        if (stored) {
          item = JSON.parse(stored);
          // 恢复到内存缓存
          if (item) {
            this.memoryCache.set(key, item);
          }
        }
      } catch (error) {
        console.warn('localStorage 读取失败:', error);
      }
    }

    if (!item) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key);
      return null;
    }

    return item.data as T;
  }

  /**
   * 检查缓存是否存在且未过期
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * 清除所有缓存
   */
  clear(): void {
    this.memoryCache.clear();
    
    if (this.useLocalStorage) {
      try {
        // 清除所有带前缀的 localStorage 项
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.STORAGE_PREFIX)) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('localStorage 清除失败:', error);
      }
    }
  }

  /**
   * 删除指定缓存
   */
  delete(key: string): void {
    this.memoryCache.delete(key);
    
    if (this.useLocalStorage) {
      try {
        localStorage.removeItem(this.STORAGE_PREFIX + key);
      } catch (error) {
        console.warn('localStorage 删除失败:', error);
      }
    }
  }

  /**
   * 清理过期的 localStorage 缓存
   */
  private cleanExpiredLocalStorage(): void {
    if (!this.useLocalStorage) return;

    try {
      const keys = Object.keys(localStorage);
      const now = Date.now();
      
      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || '');
            if (item && now - item.timestamp > item.ttl) {
              localStorage.removeItem(key);
            }
          } catch {
            // 无效的缓存项，删除
            localStorage.removeItem(key);
          }
        }
      });
    } catch (error) {
      console.warn('清理过期缓存失败:', error);
    }
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): { memoryCount: number; localStorageCount: number; totalSize: string } {
    const memoryCount = this.memoryCache.size;
    let localStorageCount = 0;
    let totalSize = 0;

    if (this.useLocalStorage) {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.STORAGE_PREFIX)) {
            localStorageCount++;
            const item = localStorage.getItem(key);
            if (item) {
              totalSize += item.length;
            }
          }
        });
      } catch (error) {
        console.warn('获取缓存统计失败:', error);
      }
    }

    return {
      memoryCount,
      localStorageCount,
      totalSize: `${(totalSize / 1024).toFixed(2)} KB`,
    };
  }
}

export const dataCache = new DataCache(true); // 启用 localStorage

// 缓存时间常量（毫秒）
export const CACHE_TTL = {
  // 短期缓存（5分钟）- 用于频繁变化的数据
  SHORT: 5 * 60 * 1000,
  
  // 中期缓存（1小时）- 用于较稳定的数据
  MEDIUM: 60 * 60 * 1000,
  
  // 长期缓存（12小时）- 用于每天更新一次的数据
  LONG: 12 * 60 * 60 * 1000,
  
  // 超长期缓存（24小时）- 用于很少变化的数据
  VERY_LONG: 24 * 60 * 60 * 1000,
};

// 缓存键生成器
export const cacheKeys = {
  // 视频列表（每天更新）
  videos: (page: number, limit: number) => `videos_${page}_${limit}`,
  
  // 分类视频列表（每天更新）
  videosByType: (typeId: number, page: number, limit: number) => 
    `videos_type_${typeId}_${page}_${limit}`,
  
  // 视频详情（每天更新）
  videoDetail: (vodId: number) => `video_detail_${vodId}`,
  
  // 首页所有分类视频（每天更新）- 最重要的缓存
  allTypesVideos: (limit: number) => `all_types_videos_${limit}`,
  
  // 分类列表（很少变化）
  genres: () => 'genres',
  
  // 演员信息（较少变化）
  actorDetail: (actorId: number) => `actor_detail_${actorId}`,
  
  // 演员作品（每天更新）
  actorWorks: (actorId: number) => `actor_works_${actorId}`,
};
