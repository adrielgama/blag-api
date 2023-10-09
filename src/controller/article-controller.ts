import fs from 'fs'
import { marked } from 'marked'
import { Request, Response } from 'express'
import { v2 as cloudinary } from 'cloudinary'
import { prisma } from '../utils/prisma'
import { ArticleQueryOptions, UpdateArticleData } from '../types'
import { viewsQueue } from '../utils/viewsQueue'

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
})

const isAdmin = async (userId: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { typeUser: true },
  })
  return user?.typeUser === 'ADMIN'
}

export class ArticleController {
  constructor() {
    this.isAuthorOrAdmin = this.isAuthorOrAdmin.bind(this)
    this.getArticles = this.getArticles.bind(this)
    this.getUniqueArticle = this.getUniqueArticle.bind(this)
    this.getUserArticles = this.getUserArticles.bind(this)
    this.createArticle = this.createArticle.bind(this)
    this.updateArticle = this.updateArticle.bind(this)
    this.deleteArticle = this.deleteArticle.bind(this)
  }

  isAuthorOrAdmin = async (articleId: string, userId: string) => {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { author: true },
    })

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    })

    return article?.authorId === userId || currentUser?.typeUser === 'ADMIN'
  }

  getArticles = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = res.locals

    const articleQueryOptions: ArticleQueryOptions = {
      include: {
        author: {
          select: { id: true, name: true, email: true, typeUser: true },
        },
      },
    }

    if (!(await isAdmin(userId))) {
      articleQueryOptions.where = { authorId: userId }
    }

    const articles = await prisma.article.findMany(articleQueryOptions)
    return res.json({ articles })
  }

  getUniqueArticle = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
      await viewsQueue.add({ articleId: id })

      const article = await prisma.article.findUnique({
        where: { id },
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
      })

      if (!article) {
        return res.status(404).json({ error: 'Article not found' })
      }

      return res.json({ article })
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' })
    }
  }

  getUserArticles = async (req: Request, res: Response) => {
    const { userId } = req.params

    const articles = await prisma.article.findMany({
      where: {
        authorId: userId,
        published: true,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!articles || articles.length === 0) {
      return res.json([])
    }

    return res.json({ articles })
  }

  createArticle = async (req: Request, res: Response) => {
    const { userId } = res.locals

    if (!userId) {
      return res.status(403).json({ error: 'Permission denied' })
    }

    const {
      title,
      description,
      body,
      published,
      authorId: providedAuthorId,
      imageUrl: providedImageUrl,
    } = req.body

    let imageUrl = providedImageUrl

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' })
    }

    const author = providedAuthorId || userId

    try {
      if (providedAuthorId) {
        const userExists = await prisma.user.findUnique({
          where: { id: providedAuthorId },
        })
        if (!userExists) {
          return res.status(400).json({ error: 'Author not found' })
        }
      }

      const existingArticle = await prisma.article.findFirst({
        where: { title, authorId: author },
      })

      if (existingArticle) {
        return res.status(400).json({
          error: 'You have already written an article with this title.',
        })
      }

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path)
        imageUrl = result.url
        fs.unlinkSync(req.file.path)
      }

      const renderedBody = marked(body)

      const article = await prisma.article.create({
        data: {
          title,
          description,
          body: renderedBody,
          published,
          authorId: author,
          imageUrl,
        },
      })

      return res.json({ article })
    } catch (error) {
      return res.status(500).json({ error: 'Error creating the article' })
    }
  }

  updateArticle = async (req: Request, res: Response) => {
    const { id } = req.params
    const { title, description, body, published } = req.body
    const { userId } = res.locals
    const existingArticle = await prisma.article.findUnique({
      where: { id },
    })

    if (!existingArticle) {
      return res.status(404).json({ error: 'Article not found.' })
    }

    if (!userId || !(await this.isAuthorOrAdmin(id, userId))) {
      return res.status(403).json({ error: 'Permission denied' })
    }

    if (title && typeof title !== 'string') {
      return res.status(400).json({ error: 'Invalid title format.' })
    }

    const updateData: UpdateArticleData = {}
    if (title) updateData.title = title
    if (description) updateData.description = description
    if (body) updateData.body = body
    if (published !== undefined) updateData.published = published

    try {
      const article = await prisma.article.update({
        where: { id },
        data: updateData,
      })

      return res.json({ article })
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update article.' })
    }
  }

  deleteArticle = async (req: Request, res: Response) => {
    const { userId } = res.locals
    const { id } = req.params

    const article = await prisma.article.findUnique({
      where: { id },
      include: { author: true },
    })

    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }

    if (!(await this.isAuthorOrAdmin(id, userId))) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to delete this article' })
    }

    await prisma.article.delete({ where: { id } })
    return res.status(200).json({ message: 'Article deleted successfully' })
  }
}
