import { Router } from 'express'
import multer from 'multer'
import { ArticleController } from './controller/article-controller'
import { AuthController } from './controller/auth-controller'
import { UserController } from './controller/user-controller'
import { AuthMiddleware } from './middleware/auth'

const upload = multer({ dest: 'uploads/' })

const usercontroller = new UserController()
const authcontroller = new AuthController()
const articlecontroller = new ArticleController()

export const router = Router()

// AUTH
router.post('/users/login', authcontroller.login)
router.post('/users/logout', authcontroller.logout)
router.post('/users/refresh-token', authcontroller.refreshToken)

// USER
router.post('/users/new', usercontroller.createUser)
router.get('/users', AuthMiddleware, usercontroller.getUser)
router.get('/users/:id', AuthMiddleware, usercontroller.getSingleUser)
router.patch('/users/:id', AuthMiddleware, usercontroller.updateUser)
router.delete('/users/:id', AuthMiddleware, usercontroller.deleteUser)

// ARTICLE
router.get('/articles/:id', articlecontroller.getUniqueArticle)
router.get('/users/:userId/articles', articlecontroller.getUserArticles)
router.post(
  '/articles',
  AuthMiddleware,
  upload.single('image'),
  articlecontroller.createArticle,
)
router.get('/articles', AuthMiddleware, articlecontroller.getArticles)
router.patch('/articles/:id', AuthMiddleware, articlecontroller.updateArticle)
router.delete('/articles/:id', AuthMiddleware, articlecontroller.deleteArticle)
