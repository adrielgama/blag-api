import { Router } from 'express'
import authRoutes from './routes/auth'
import tokenRoutes from './routes/token'
import userRoutes from './routes/user'
import articleRoutes from './routes/article'

export const router = Router()

router.use(authRoutes)
router.use(tokenRoutes)
router.use(userRoutes)
router.use(articleRoutes)
