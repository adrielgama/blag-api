import { Router } from 'express'
import { AuthController } from '../controller/auth-controller'

const router = Router()
const authController = new AuthController()

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid parameters
 */
router.post('/users/login', authController.login)

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Log out a user
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successful logout
 */
router.post('/users/logout', authController.logout)

export default router
