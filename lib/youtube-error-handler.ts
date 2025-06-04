import { logger } from "@/lib/logger"

export class YouTubeAPIError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public channelId?: string,
  ) {
    super(message)
    this.name = "YouTubeAPIError"
  }
}

export function handleYouTubeError(error: any, context: { operation: string; channelId?: string; videoId?: string }) {
  const { operation, channelId, videoId } = context

  logger.error(`YouTube API error in ${operation}`, {
    error: error.message,
    code: error.code,
    statusCode: error.status,
    channelId,
    videoId,
  })

  // Handle specific error types
  if (error.code === 403) {
    throw new YouTubeAPIError(
      "YouTube API quota exceeded or insufficient permissions",
      "QUOTA_EXCEEDED",
      403,
      channelId,
    )
  }

  if (error.code === 401) {
    throw new YouTubeAPIError("YouTube authentication failed - please reconnect channel", "AUTH_FAILED", 401, channelId)
  }

  if (error.code === 404) {
    throw new YouTubeAPIError("YouTube resource not found", "NOT_FOUND", 404, channelId)
  }

  // Generic error
  throw new YouTubeAPIError(`YouTube API error: ${error.message}`, "API_ERROR", error.status, channelId)
}

export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  operation: string,
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      handleYouTubeError(error, { operation })
    }
  }
}
