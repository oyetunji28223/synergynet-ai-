import { logger } from "./logger"

export interface BatchJob<T> {
  id: string
  data: T
  priority?: number
}

export class BatchProcessor<T> {
  private jobs: BatchJob<T>[] = []
  private processing = false
  private maxBatchSize: number
  private maxProcessingTime: number

  constructor(maxBatchSize = 10, maxProcessingTimeMs = 45000) {
    this.maxBatchSize = maxBatchSize
    this.maxProcessingTime = maxProcessingTimeMs
  }

  addJob(job: BatchJob<T>): void {
    this.jobs.push(job)
    // Sort by priority (higher priority first)
    this.jobs.sort((a, b) => (b.priority || 0) - (a.priority || 0))
  }

  async processBatch<R>(
    processor: (job: BatchJob<T>) => Promise<R>,
    onComplete?: (results: R[]) => void,
    onError?: (error: Error, job: BatchJob<T>) => void,
  ): Promise<R[]> {
    if (this.processing) {
      throw new Error("Batch processor is already running")
    }

    this.processing = true
    const startTime = Date.now()
    const results: R[] = []
    const batch = this.jobs.splice(0, this.maxBatchSize)

    logger.info(`Processing batch of ${batch.length} jobs`)

    try {
      for (const job of batch) {
        // Check if we're running out of time
        if (Date.now() - startTime > this.maxProcessingTime) {
          logger.warn("Batch processing timeout approaching, stopping early")
          // Put remaining jobs back at the front
          this.jobs.unshift(...batch.slice(batch.indexOf(job)))
          break
        }

        try {
          const result = await processor(job)
          results.push(result)
          logger.info(`Completed job ${job.id}`)
        } catch (error) {
          logger.error(`Failed to process job ${job.id}`, { error })
          if (onError) {
            onError(error as Error, job)
          }
        }
      }

      if (onComplete) {
        onComplete(results)
      }

      return results
    } finally {
      this.processing = false
    }
  }

  getRemainingJobCount(): number {
    return this.jobs.length
  }

  isProcessing(): boolean {
    return this.processing
  }

  clear(): void {
    if (!this.processing) {
      this.jobs = []
    }
  }
}

// Singleton instances for different job types
export const publishingProcessor = new BatchProcessor<any>(5, 45000) // 5 jobs max, 45s timeout
export const analysisProcessor = new BatchProcessor<any>(10, 45000) // 10 jobs max, 45s timeout
export const contentProcessor = new BatchProcessor<any>(3, 45000) // 3 jobs max, 45s timeout
