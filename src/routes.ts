import { Router } from 'express'
import multer from 'multer'
import { ArticleController } from './controller/article-controller'
import { AuthController } from './controller/auth-controller'
import { UserController } from './controller/user-controller'
import { AuthMiddleware } from './middleware/auth'

const upload = multer({ dest: 'uploads/' })

const userController = new UserController()
const authController = new AuthController()
const articleController = new ArticleController()

export const router = Router()

// AUTH
router.post('/users/login', authController.login)
router.post('/users/logout', authController.logout)
router.post('/users/refresh-token', authController.refreshToken)
router.get('/users/verify-token', AuthMiddleware, authController.verifyToken)

// USER
router.post('/users/new', userController.createUser)
router.get('/users', AuthMiddleware, userController.getUser)
router.get('/users/:id', AuthMiddleware, userController.getSingleUser)
router.patch('/users/:id', AuthMiddleware, userController.updateUser)
router.delete('/users/:id', AuthMiddleware, userController.deleteUser)

// ARTICLE
router.get('/articles/:id', articleController.getUniqueArticle)
router.get('/users/:userId/articles', articleController.getUserArticles)
router.post(
  '/articles',
  AuthMiddleware,
  upload.single('image'),
  articleController.createArticle,
)
router.get('/articles', AuthMiddleware, articleController.getArticles)
router.patch('/articles/:id', AuthMiddleware, articleController.updateArticle)
router.delete('/articles/:id', AuthMiddleware, articleController.deleteArticle)
