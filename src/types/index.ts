interface UpdateUserData {
  name?: string
  email?: string
  password?: string
  typeUser?: 'USER' | 'ADMIN'
}

interface UpdateArticleData {
  title?: string
  description?: string
  body?: string
  published?: boolean
  imageUrl?: string
}

type ArticleQueryOptions = {
  include: {
    author: {
      select: {
        id: boolean
        name: boolean
        email: boolean
        typeUser: boolean
      }
    }
  }
  where?: {
    authorId: string
  }
}

export { UpdateUserData, UpdateArticleData, ArticleQueryOptions }
