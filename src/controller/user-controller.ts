import { hash } from 'bcrypt'
import { Request, Response } from 'express'
import { UpdateUserData } from 'src/types'
import { prisma } from '../utils/prisma'

export class UserController {
  constructor() {
    this.getUser = this.getUser.bind(this)
    this.updateUser = this.updateUser.bind(this)
    this.deleteUser = this.deleteUser.bind(this)
    this.createUser = this.createUser.bind(this)
    this.getSingleUser = this.getSingleUser.bind(this)
    this.isUserAdmin = this.isUserAdmin.bind(this)
  }

  private async isUserAdmin(userId: string): Promise<boolean> {
    if (!userId) {
      throw new Error('userId not found')
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    return user?.typeUser.toUpperCase() === 'ADMIN' || false
  }

  async getUser(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals

    if (!userId || !(await this.isUserAdmin(userId))) {
      return res.status(403).json({ error: 'Permission denied' })
    }

    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          typeUser: true,
          createdAt: true,
        },
      })

      return res.json({ users })
    } catch (error) {
      console.error('Error fetching users:', error)
      return res
        .status(500)
        .json({ error: 'An error occurred while fetching the users.' })
    }
  }

  async getSingleUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: 'User ID is required.' })
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          typeUser: true,
          createdAt: true,
          Article: true,
        },
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found.' })
      }

      return res.json({ user })
    } catch (error) {
      console.error('Error fetching the user:', error)
      return res
        .status(500)
        .json({ error: 'An error occurred while fetching the user.' })
    }
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    const { name, email, password, typeUser } = req.body
    const { userId } = res.locals

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'All fields (name, email, password) are required.',
      })
    }

    try {
      const userExists = await prisma.user.findUnique({ where: { email } })
      if (userExists) {
        return res.status(400).json({ error: 'User already exists' })
      }

      let userTypeToSet = 'USER'
      if (userId) {
        const authenticatedUser = await prisma.user.findUnique({
          where: { id: userId },
        })
        if (authenticatedUser && authenticatedUser.typeUser === 'ADMIN') {
          userTypeToSet = typeUser
        }
      }

      const passwordHashed = await hash(password, 10)
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: passwordHashed,
          typeUser: userTypeToSet,
        },
      })

      return res.json({ user })
    } catch (error) {
      console.error('Error creating user:', error)
      return res
        .status(500)
        .json({ error: 'An error occurred while creating the user.' })
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { name, email, password, typeUser } = req.body
    const { userId } = res.locals

    if (!userId) {
      return res.status(403).json({ error: 'Permission denied' })
    }

    const isAdmin = await this.isUserAdmin(userId)

    if (userId !== id && !isAdmin) {
      return res.status(403).json({ error: 'Permission denied' })
    }

    const canEditTypeUser = userId === id ? false : isAdmin
    const updateData: UpdateUserData = {}

    if (name) updateData.name = name
    if (email) updateData.email = email
    if (password) {
      const passwordHashed = await hash(password, 10)
      updateData.password = passwordHashed
    }
    if (canEditTypeUser && typeUser) updateData.typeUser = typeUser

    try {
      const user = await prisma.user.update({
        where: { id },
        data: updateData,
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      return res.json({ user })
    } catch (error) {
      console.error('Error updating user:', error)
      return res.status(500).json({ error: 'Failed to update user.' })
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    const { userId } = res.locals
    const { id } = req.params

    if (!userId) {
      return res.status(403).json({ error: 'Permission denied' })
    }

    try {
      const userToDelete = await prisma.user.findUnique({
        where: { id },
      })

      if (!userToDelete) {
        return res.status(404).json({ error: 'User not found' })
      }

      const isAdmin = await this.isUserAdmin(userId)

      if (userId !== id && !isAdmin) {
        return res
          .status(403)
          .json({ error: 'You do not have permission to delete this user' })
      }

      await prisma.refreshToken.deleteMany({
        where: { userId: id },
      })

      await prisma.article.deleteMany({
        where: { authorId: id },
      })

      await prisma.user.delete({
        where: { id },
      })

      return res.status(200).json({ message: 'User deleted successfully' })
    } catch (error) {
      console.error('Error deleting user:', error)
      return res.status(500).json({ error: 'Error deleting the user' })
    }
  }
}
