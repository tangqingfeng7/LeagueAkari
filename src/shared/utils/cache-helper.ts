/**
 * 简单的内存缓存工具
 * 用于临时缓存API响应，减少重复请求
 */

interface CacheItem<T> {
  data: T
  timestamp: number
}

export class SimpleCache<T = any> {
  private cache = new Map<string, CacheItem<T>>()
  private ttl: number // 缓存时间（毫秒）

  constructor(ttl: number = 60000) {
    // 默认1分钟
    this.ttl = ttl
  }

  /**
   * 设置缓存
   */
  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * 获取缓存
   * @returns 缓存数据，如果过期或不存在返回 null
   */
  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) {
      return null
    }

    // 检查是否过期
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  /**
   * 删除缓存
   */
  delete(key: string): void {
    this.cache.delete(key)
  }

  /**
   * 清空所有缓存
   */
  clear(): void {
    this.cache.clear()
  }

  /**
   * 清理过期缓存
   */
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size
  }
}

/**
 * 带缓存的异步函数包装器
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    ttl?: number
    keyGenerator?: (...args: Parameters<T>) => string
  } = {}
): T {
  const cache = new SimpleCache<Awaited<ReturnType<T>>>(options.ttl)

  const defaultKeyGenerator = (...args: Parameters<T>): string => {
    return JSON.stringify(args)
  }

  const keyGenerator = options.keyGenerator || defaultKeyGenerator

  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args)
    const cached = cache.get(key)

    if (cached !== null) {
      return cached
    }

    const result = await fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * 请求去重工具
 * 防止同一个请求并发多次
 */
export class RequestDeduplicator<T = any> {
  private pending = new Map<string, Promise<T>>()

  async deduplicate(key: string, fn: () => Promise<T>): Promise<T> {
    // 如果已有正在进行的请求，返回该请求
    const existing = this.pending.get(key)
    if (existing) {
      return existing
    }

    // 创建新请求
    const promise = fn().finally(() => {
      // 请求完成后删除
      this.pending.delete(key)
    })

    this.pending.set(key, promise)
    return promise
  }

  clear(): void {
    this.pending.clear()
  }
}

