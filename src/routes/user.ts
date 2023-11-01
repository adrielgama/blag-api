import { Router } from 'express'
import { UserController } from '../controller/user-controller'
import { AuthMiddleware } from '../middleware/auth'

const router = Router()
const userController = new UserController()

/**
 * @swagger
 * /users/new:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid parameters
 */
router.post('/users/new', userController.createUser)

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/users', AuthMiddleware, userController.getUser)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags:
 *       - Users
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
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/users/:id', AuthMiddleware, userController.getSingleUser)

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user by ID
 *     tags:
 *       - Users
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.patch('/users/:id', AuthMiddleware, userController.updateUser)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Users
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
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', AuthMiddleware, userController.deleteUser)

export default router
