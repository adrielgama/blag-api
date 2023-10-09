import Queue, { Job } from 'bull'
import { prisma } from '../utils/prisma'

export interface ViewUpdateJob {
  articleId: string
}

export const viewsQueue = new Queue<ViewUpdateJob>('articleViews', {
  redis: process.env.REDIS_URL || 'redis://localhost:6379',
  // redis: {
  //   host: process.env.REDISHOST || 'localhost',
  //   port: Number(process.env.REDISPORT) || 6379,
  //   username: process.env.REDISUSER,
  //   password: process.env.REDISPASSWORD,
  // },
})

viewsQueue.process(async (job: Job<ViewUpdateJob>) => {
  const { articleId } = job.data
  await prisma.article.update({
    where: { id: articleId },
    data: { views: { increment: 1 } },
  })
})

viewsQueue.on('failed', (job: Job<ViewUpdateJob>, err: unknown) => {
  console.error('Job failed', job.data)
  console.error(err)
})

viewsQueue.on('completed', (job: Job<ViewUpdateJob>) => {
  console.log('Job completed', job.data)
})
