import { Router } from 'express'
import { AuthController } from '../controller/auth-controller'
import { AuthMiddleware } from '../middleware/auth'

const router = Router()
const authController = new AuthController()

/**
 * @swagger
 * /users/refresh-token:
 *   post:
 *     summary: Refresh user token
 *     tags:
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Invalid parameters
 */
router.post('/users/refresh-token', authController.refreshToken)

/**
 * @swagger
 * /users/verify-token:
 *   get:
 *     summary: Verify user token
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 */
router.get('/users/verify-token', AuthMiddleware, authController.verifyToken)

export default router
