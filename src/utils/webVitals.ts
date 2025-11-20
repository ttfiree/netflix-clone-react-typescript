/**
 * Web Vitals 性能监控
 * 监控关键性能指标：LCP, FID, CLS, FCP, TTFB
 */

type MetricType = 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';

interface Metric {
  name: MetricType;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// 性能指标阈值
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

function getRating(name: MetricType, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

function sendToAnalytics(metric: Metric) {
  // 在开发环境下打印到控制台
  if (import.meta.env.DEV) {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  }

  // 生产环境可以发送到分析服务
  // 例如: Google Analytics, Sentry, 自定义分析服务
  if (import.meta.env.PROD) {
    // 示例：发送到 Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // 示例：使用 Navigator.sendBeacon 发送数据
    // 注意：需要配置后端 API 端点才能启用
    // if (navigator.sendBeacon && import.meta.env.VITE_ANALYTICS_ENDPOINT) {
    //   const body = JSON.stringify(metric);
    //   navigator.sendBeacon(import.meta.env.VITE_ANALYTICS_ENDPOINT, body);
    // }
  }
}

/**
 * 监控 Largest Contentful Paint (LCP)
 * 最大内容绘制时间 - 衡量加载性能
 * 良好: < 2.5s
 */
export function observeLCP(callback?: (metric: Metric) => void) {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;

      const metric: Metric = {
        name: 'LCP',
        value: lastEntry.renderTime || lastEntry.loadTime,
        rating: getRating('LCP', lastEntry.renderTime || lastEntry.loadTime),
        delta: lastEntry.renderTime || lastEntry.loadTime,
        id: lastEntry.id || '',
      };

      sendToAnalytics(metric);
      callback?.(metric);
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    console.error('Error observing LCP:', error);
  }
}

/**
 * 监控 First Input Delay (FID)
 * 首次输入延迟 - 衡量交互性
 * 良好: < 100ms
 */
export function observeFID(callback?: (metric: Metric) => void) {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const metric: Metric = {
          name: 'FID',
          value: entry.processingStart - entry.startTime,
          rating: getRating('FID', entry.processingStart - entry.startTime),
          delta: entry.processingStart - entry.startTime,
          id: entry.id || '',
        };

        sendToAnalytics(metric);
        callback?.(metric);
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    console.error('Error observing FID:', error);
  }
}

/**
 * 监控 Cumulative Layout Shift (CLS)
 * 累积布局偏移 - 衡量视觉稳定性
 * 良好: < 0.1
 */
export function observeCLS(callback?: (metric: Metric) => void) {
  if (!('PerformanceObserver' in window)) return;

  try {
    let clsValue = 0;
    let clsEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });

      const metric: Metric = {
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue),
        delta: clsValue,
        id: clsEntries[0]?.id || '',
      };

      sendToAnalytics(metric);
      callback?.(metric);
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.error('Error observing CLS:', error);
  }
}

/**
 * 监控 First Contentful Paint (FCP)
 * 首次内容绘制 - 衡量加载性能
 * 良好: < 1.8s
 */
export function observeFCP(callback?: (metric: Metric) => void) {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (entry.name === 'first-contentful-paint') {
          const metric: Metric = {
            name: 'FCP',
            value: entry.startTime,
            rating: getRating('FCP', entry.startTime),
            delta: entry.startTime,
            id: entry.id || '',
          };

          sendToAnalytics(metric);
          callback?.(metric);
        }
      });
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (error) {
    console.error('Error observing FCP:', error);
  }
}

/**
 * 监控 Time to First Byte (TTFB)
 * 首字节时间 - 衡量服务器响应速度
 * 良好: < 800ms
 */
export function observeTTFB(callback?: (metric: Metric) => void) {
  if (!('PerformanceObserver' in window)) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const metric: Metric = {
          name: 'TTFB',
          value: entry.responseStart - entry.requestStart,
          rating: getRating('TTFB', entry.responseStart - entry.requestStart),
          delta: entry.responseStart - entry.requestStart,
          id: entry.name || '',
        };

        sendToAnalytics(metric);
        callback?.(metric);
      });
    });

    observer.observe({ type: 'navigation', buffered: true });
  } catch (error) {
    console.error('Error observing TTFB:', error);
  }
}

/**
 * 初始化所有 Web Vitals 监控
 * @param options 配置选项
 */
export function initWebVitals(options?: {
  /** 是否在开发环境启用 */
  enableInDev?: boolean;
  /** 是否发送到分析服务 */
  sendToAnalytics?: boolean;
}) {
  if (typeof window === 'undefined') return;

  const shouldEnable = 
    import.meta.env.PROD || 
    import.meta.env.VITE_ENABLE_WEB_VITALS === 'true' ||
    options?.enableInDev;

  if (shouldEnable) {
    observeLCP();
    observeFID();
    observeCLS();
    observeFCP();
    observeTTFB();
  }
}

/**
 * 获取当前页面的性能指标
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) return null;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');

  return {
    // 导航时间
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive - navigation.fetchStart,
    domComplete: navigation.domComplete - navigation.fetchStart,
    loadComplete: navigation.loadEventEnd - navigation.fetchStart,

    // 绘制时间
    fcp: paint.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,

    // 资源统计
    resources: performance.getEntriesByType('resource').length,
  };
}
