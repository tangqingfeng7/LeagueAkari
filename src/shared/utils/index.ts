/**
 * 工具函数统一导出
 */

// 缓存工具
export {
  SimpleCache,
  withCache,
  RequestDeduplicator
} from './cache-helper'

// 错误处理工具
export {
  safeExecute,
  withRetry,
  withTimeout,
  ErrorClassifier,
  BatchOperationHandler,
  type ErrorHandlerOptions
} from './error-handler'

// 性能监控工具
export {
  PerformanceMonitor,
  Monitor,
  throttle,
  debounce,
  globalPerformanceMonitor,
  type PerformanceMetric
} from './performance-monitor'

// 数据处理工具
export {
  processInChunks,
  processWithConcurrency,
  uniqueBy,
  groupBy,
  sumBy,
  averageBy,
  maxBy,
  minBy,
  paginate,
  binarySearch,
  deepClone,
  getValueByPath,
  flatten,
  difference,
  intersection,
  union
} from './data-processor'

