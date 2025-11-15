/**
 * 错误处理增强工具
 * 提供更好的错误处理和用户提示
 */

export interface ErrorHandlerOptions {
  /** 是否显示用户提示 */
  showNotification?: boolean
  /** 错误消息 */
  message?: string
  /** 是否记录日志 */
  logError?: boolean
  /** 默认返回值（发生错误时） */
  defaultValue?: any
  /** 自定义错误处理函数 */
  onError?: (error: Error) => void
}

/**
 * 安全执行异步函数
 * @param fn 要执行的异步函数
 * @param options 选项
 * @returns Promise<结果 | 默认值>
 */
export async function safeExecute<T>(
  fn: () => Promise<T>,
  options: ErrorHandlerOptions = {}
): Promise<T | undefined> {
  const {
    showNotification = false,
    message = '操作失败',
    logError = true,
    defaultValue,
    onError
  } = options

  try {
    return await fn()
  } catch (error) {
    if (logError) {
      console.error(message, error)
    }

    if (onError && error instanceof Error) {
      onError(error)
    }

    if (showNotification) {
      // 这里可以集成通知系统
      console.warn(`[用户提示] ${message}:`, error)
    }

    return defaultValue
  }
}

/**
 * 重试包装器
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    delay?: number
    backoff?: boolean
    onRetry?: (attempt: number, error: Error) => void
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = true,
    onRetry
  } = options

  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < maxRetries) {
        if (onRetry) {
          onRetry(attempt + 1, lastError)
        }

        // 计算延迟时间（指数退避）
        const waitTime = backoff ? delay * Math.pow(2, attempt) : delay
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  throw lastError!
}

/**
 * 超时包装器
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  timeoutError: string = '操作超时'
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(timeoutError)), timeoutMs)
    )
  ])
}

/**
 * 错误分类工具
 */
export class ErrorClassifier {
  /**
   * 判断是否为网络错误
   */
  static isNetworkError(error: any): boolean {
    return (
      error?.code === 'ECONNREFUSED' ||
      error?.code === 'ENOTFOUND' ||
      error?.message?.includes('network') ||
      error?.message?.includes('timeout')
    )
  }

  /**
   * 判断是否为认证错误
   */
  static isAuthError(error: any): boolean {
    return (
      error?.response?.status === 401 ||
      error?.response?.status === 403 ||
      error?.message?.includes('unauthorized')
    )
  }

  /**
   * 判断是否为客户端未连接错误
   */
  static isClientNotConnectedError(error: any): boolean {
    return (
      error?.message?.includes('not connected') ||
      error?.message?.includes('客户端未连接')
    )
  }

  /**
   * 获取用户友好的错误消息
   */
  static getUserFriendlyMessage(error: any): string {
    if (this.isNetworkError(error)) {
      return '网络连接失败，请检查网络'
    }

    if (this.isAuthError(error)) {
      return '认证失败，请重新登录'
    }

    if (this.isClientNotConnectedError(error)) {
      return '游戏客户端未连接'
    }

    if (error?.message) {
      return error.message
    }

    return '未知错误'
  }
}

/**
 * 批量操作错误处理
 */
export class BatchOperationHandler<T> {
  private successCount = 0
  private failureCount = 0
  private errors: Array<{ index: number; error: Error }> = []

  async execute(
    items: T[],
    operation: (item: T, index: number) => Promise<void>,
    options: {
      continueOnError?: boolean
      onProgress?: (current: number, total: number) => void
    } = {}
  ): Promise<{
    successCount: number
    failureCount: number
    errors: Array<{ index: number; error: Error }>
  }> {
    const { continueOnError = true, onProgress } = options

    for (let i = 0; i < items.length; i++) {
      try {
        await operation(items[i], i)
        this.successCount++
      } catch (error) {
        this.failureCount++
        this.errors.push({ index: i, error: error as Error })

        if (!continueOnError) {
          break
        }
      }

      if (onProgress) {
        onProgress(i + 1, items.length)
      }
    }

    return {
      successCount: this.successCount,
      failureCount: this.failureCount,
      errors: this.errors
    }
  }
}

