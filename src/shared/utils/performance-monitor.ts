/**
 * 性能监控工具
 * 用于监控函数执行时间和性能瓶颈
 */

export interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private maxMetrics: number

  constructor(maxMetrics: number = 100) {
    this.maxMetrics = maxMetrics
  }

  /**
   * 测量函数执行时间
   */
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()

    try {
      const result = await fn()
      return result
    } finally {
      const duration = performance.now() - start
      this.recordMetric(name, duration)

      // 如果执行时间超过阈值，输出警告
      if (duration > 1000) {
        console.warn(`[性能警告] ${name} 执行耗时 ${duration.toFixed(2)}ms`)
      }
    }
  }

  /**
   * 测量同步函数执行时间
   */
  measureSync<T>(name: string, fn: () => T): T {
    const start = performance.now()

    try {
      return fn()
    } finally {
      const duration = performance.now() - start
      this.recordMetric(name, duration)

      if (duration > 100) {
        console.warn(`[性能警告] ${name} 执行耗时 ${duration.toFixed(2)}ms`)
      }
    }
  }

  /**
   * 记录性能指标
   */
  private recordMetric(name: string, duration: number): void {
    this.metrics.push({
      name,
      duration,
      timestamp: Date.now()
    })

    // 限制存储的指标数量
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }
  }

  /**
   * 获取统计信息
   */
  getStats(name?: string): {
    count: number
    avg: number
    min: number
    max: number
    total: number
  } | null {
    const filtered = name
      ? this.metrics.filter(m => m.name === name)
      : this.metrics

    if (filtered.length === 0) {
      return null
    }

    const durations = filtered.map(m => m.duration)
    const total = durations.reduce((sum, d) => sum + d, 0)

    return {
      count: filtered.length,
      avg: total / filtered.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      total
    }
  }

  /**
   * 获取所有指标
   */
  getAllMetrics(): PerformanceMetric[] {
    return [...this.metrics]
  }

  /**
   * 清空指标
   */
  clear(): void {
    this.metrics = []
  }

  /**
   * 生成性能报告
   */
  generateReport(): string {
    const names = Array.from(new Set(this.metrics.map(m => m.name)))
    let report = '=== 性能报告 ===\n\n'

    names.forEach(name => {
      const stats = this.getStats(name)
      if (stats) {
        report += `${name}:\n`
        report += `  调用次数: ${stats.count}\n`
        report += `  平均耗时: ${stats.avg.toFixed(2)}ms\n`
        report += `  最小耗时: ${stats.min.toFixed(2)}ms\n`
        report += `  最大耗时: ${stats.max.toFixed(2)}ms\n`
        report += `  总耗时: ${stats.total.toFixed(2)}ms\n\n`
      }
    })

    return report
  }
}

/**
 * 装饰器：自动监控方法性能
 */
export function Monitor(name?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value
    const methodName = name || `${target.constructor.name}.${propertyKey}`

    descriptor.value = async function (...args: any[]) {
      const start = performance.now()

      try {
        const result = await originalMethod.apply(this, args)
        return result
      } finally {
        const duration = performance.now() - start
        if (duration > 100) {
          console.debug(`[性能] ${methodName} 执行耗时 ${duration.toFixed(2)}ms`)
        }
      }
    }

    return descriptor
  }
}

/**
 * 节流函数包装器（性能优化）
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  let previous = 0

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(this, args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func.apply(this, args)
      }, remaining)
    }
  }
}

/**
 * 防抖函数包装器（性能优化）
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function (this: any, ...args: Parameters<T>) {
    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(this, args)
      }
    }

    const callNow = immediate && !timeout

    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(later, wait)

    if (callNow) {
      func.apply(this, args)
    }
  }
}

/**
 * 全局性能监控实例
 */
export const globalPerformanceMonitor = new PerformanceMonitor(200)

