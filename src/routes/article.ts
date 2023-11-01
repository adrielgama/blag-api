import { Router } from 'express'
import { ArticleController } from '../controller/article-controller'
import { AuthMiddleware } from '../middleware/auth'

const router = Router()
const articleController = new ArticleController()

/**
 * @swagger
 * /articles/{id}:
 *   get:
 *     summary: Get a unique article by ID
 *     tags:
 *       - Articles
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article retrieved successfully
 *       404:
 *         description: Article not found
 */
router.get('/articles/:id', articleController.getUniqueArticle)

/**
 * @swagger
 * /users/{userId}/articles:
 *   get:
 *     summary: Get articles by a specific user ID
 *     tags:
 *       - Articles
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Articles retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/users/:userId/articles', articleController.getUserArticles)

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Create a new article
 *     tags:
 *       - Articles
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Article created successfully
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Unauthorized
 */
router.post('/articles', AuthMiddleware, articleController.createArticle)

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Get a list of articles
 *     tags:
 *       - Articles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of articles retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/articles', AuthMiddleware, articleController.getArticles)

/**
 * @swagger
 * /articles/{id}:
 *   patch:
 *     summary: Update an article by ID
 *     tags:
 *       - Articles
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Article updated successfully
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 */
router.patch('/articles/:id', AuthMiddleware, articleController.updateArticle)

/**
 * @swagger
 * /articles/{id}:
 *   delete:
 *     summary: Delete an article by ID
 *     tags:
 *       - Articles
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Article not found
 */
router.delete('/articles/:id', AuthMiddleware, articleController.deleteArticle)

export default router
