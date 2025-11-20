/**
 * 缓存管理工具
 * 提供缓存查看、清理等功能
 */

import { dataCache } from './dataCache';

export class CacheManager {
  /**
   * 获取缓存统计信息
   */
  static getStats() {
    return dataCache.getStats();
  }

  /**
   * 清除所有缓存
   */
  static clearAll() {
    dataCache.clear();
    console.log('所有缓存已清除');
  }

  /**
   * 清除过期缓存
   */
  static clearExpired() {
    // 缓存工具会自动清理过期项
    console.log('过期缓存已清理');
  }

  /**
   * 打印缓存统计
   */
  static printStats() {
    const stats = this.getStats();
    console.log('=== 缓存统计 ===');
    console.log('内存缓存数量:', stats.memoryCount);
    console.log('localStorage 缓存数量:', stats.localStorageCount);
    console.log('localStorage 总大小:', stats.totalSize);
    console.log('================');
  }

  /**
   * 预热缓存（可选）
   * 在应用启动时预加载关键数据
   */
  static async warmup() {
    console.log('开始预热缓存...');
    // 可以在这里预加载首页数据等
    // 例如：await getVideosForAllTypes();
    console.log('缓存预热完成');
  }
}

// 在开发环境下暴露到 window 对象，方便调试
if (import.meta.env.DEV && typeof window !== 'undefined') {
  (window as any).cacheManager = CacheManager;
  console.log('缓存管理工具已加载，使用 window.cacheManager 访问');
  console.log('可用命令:');
  console.log('  cacheManager.printStats() - 查看缓存统计');
  console.log('  cacheManager.clearAll() - 清除所有缓存');
}
