/**
 * 数据处理优化工具
 * 提供高效的数据处理方法
 */

/**
 * 批量处理数据（分块处理，避免阻塞）
 */
export async function processInChunks<T, R>(
  items: T[],
  processor: (item: T) => R | Promise<R>,
  options: {
    chunkSize?: number
    onProgress?: (processed: number, total: number) => void
    delayBetweenChunks?: number
  } = {}
): Promise<R[]> {
  const {
    chunkSize = 10,
    onProgress,
    delayBetweenChunks = 0
  } = options

  const results: R[] = []
  const total = items.length

  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, Math.min(i + chunkSize, items.length))

    // 处理当前块
    const chunkResults = await Promise.all(
      chunk.map(item => Promise.resolve(processor(item)))
    )

    results.push(...chunkResults)

    // 报告进度
    if (onProgress) {
      onProgress(results.length, total)
    }

    // 延迟（给UI线程喘息的机会）
    if (delayBetweenChunks > 0 && i + chunkSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenChunks))
    }
  }

  return results
}

/**
 * 并发限制处理
 */
export async function processWithConcurrency<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  maxConcurrency: number = 5
): Promise<R[]> {
  const results: R[] = []
  const executing: Promise<void>[] = []

  for (const item of items) {
    const promise = processor(item).then(result => {
      results.push(result)
    })

    executing.push(promise)

    if (executing.length >= maxConcurrency) {
      await Promise.race(executing)
      // 移除已完成的promise
      executing.splice(
        executing.findIndex(p => p === promise),
        1
      )
    }
  }

  await Promise.all(executing)
  return results
}

/**
 * 数组去重（保持顺序，高性能）
 */
export function uniqueBy<T>(
  array: T[],
  key: (item: T) => string | number
): T[] {
  const seen = new Set<string | number>()
  const result: T[] = []

  for (const item of array) {
    const k = key(item)
    if (!seen.has(k)) {
      seen.add(k)
      result.push(item)
    }
  }

  return result
}

/**
 * 分组（高性能）
 */
export function groupBy<T>(
  array: T[],
  key: (item: T) => string | number
): Map<string | number, T[]> {
  const groups = new Map<string | number, T[]>()

  for (const item of array) {
    const k = key(item)
    const group = groups.get(k)

    if (group) {
      group.push(item)
    } else {
      groups.set(k, [item])
    }
  }

  return groups
}

/**
 * 数组求和
 */
export function sumBy<T>(
  array: T[],
  selector: (item: T) => number
): number {
  return array.reduce((sum, item) => sum + selector(item), 0)
}

/**
 * 数组平均值
 */
export function averageBy<T>(
  array: T[],
  selector: (item: T) => number
): number {
  if (array.length === 0) return 0
  return sumBy(array, selector) / array.length
}

/**
 * 查找最大值
 */
export function maxBy<T>(
  array: T[],
  selector: (item: T) => number
): T | undefined {
  if (array.length === 0) return undefined

  let max = array[0]
  let maxValue = selector(max)

  for (let i = 1; i < array.length; i++) {
    const value = selector(array[i])
    if (value > maxValue) {
      max = array[i]
      maxValue = value
    }
  }

  return max
}

/**
 * 查找最小值
 */
export function minBy<T>(
  array: T[],
  selector: (item: T) => number
): T | undefined {
  if (array.length === 0) return undefined

  let min = array[0]
  let minValue = selector(min)

  for (let i = 1; i < array.length; i++) {
    const value = selector(array[i])
    if (value < minValue) {
      min = array[i]
      minValue = value
    }
  }

  return min
}

/**
 * 分页数据
 */
export function paginate<T>(
  array: T[],
  page: number,
  pageSize: number
): {
  data: T[]
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
} {
  const totalPages = Math.ceil(array.length / pageSize)
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const data = array.slice(start, end)

  return {
    data,
    page,
    pageSize,
    totalPages,
    totalItems: array.length
  }
}

/**
 * 二分查找（数组必须已排序）
 */
export function binarySearch<T>(
  array: T[],
  target: T,
  comparator: (a: T, b: T) => number = (a, b) => (a < b ? -1 : a > b ? 1 : 0)
): number {
  let left = 0
  let right = array.length - 1

  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const comparison = comparator(array[mid], target)

    if (comparison === 0) {
      return mid
    } else if (comparison < 0) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }

  return -1
}

/**
 * 深度克隆（使用结构化克隆）
 */
export function deepClone<T>(obj: T): T {
  if (typeof structuredClone !== 'undefined') {
    return structuredClone(obj)
  }

  // 降级方案
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 对象路径取值（安全）
 */
export function getValueByPath<T = any>(
  obj: any,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split('.')
  let current = obj

  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return defaultValue
    }
    current = current[key]
  }

  return current ?? defaultValue
}

/**
 * 扁平化数组
 */
export function flatten<T>(array: (T | T[])[], depth: number = Infinity): T[] {
  if (depth === 0) return array as T[]

  return array.reduce<T[]>((acc, item) => {
    if (Array.isArray(item)) {
      acc.push(...flatten(item, depth - 1))
    } else {
      acc.push(item)
    }
    return acc
  }, [])
}

/**
 * 数组差集
 */
export function difference<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2)
  return array1.filter(item => !set2.has(item))
}

/**
 * 数组交集
 */
export function intersection<T>(array1: T[], array2: T[]): T[] {
  const set2 = new Set(array2)
  return array1.filter(item => set2.has(item))
}

/**
 * 数组并集
 */
export function union<T>(...arrays: T[][]): T[] {
  return Array.from(new Set(arrays.flat()))
}

