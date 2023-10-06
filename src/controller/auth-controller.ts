import { compare } from 'bcrypt'
import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'
import { prisma } from '../utils/prisma'
import 'dotenv/config'

const jwtKey = process.env.JWT_SECRET as string

export class AuthController {
  constructor() {
    this.login = this.login.bind(this)
    this.refreshToken = this.refreshToken.bind(this)
    this.logout = this.logout.bind(this)
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isValuePassword = await compare(password, user.password)

    if (!isValuePassword) {
      return res.status(401).json({ error: 'Invalid password' })
    }

    if (!jwtKey) {
      return res.status(500).json({ error: 'JWT key is missing.' })
    }

    const token = sign({ id: user.id }, jwtKey, { expiresIn: '7d' })

    const { id } = user

    const newRefreshToken = uuid()
    const existingRefreshToken = await prisma.refreshToken.findUnique({
      where: { userId: user.id },
    })

    const newRefreshTokenExpiry = new Date(
      new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
    )

    if (existingRefreshToken) {
      await prisma.refreshToken.update({
        where: { userId: user.id },
        data: {
          id: newRefreshToken,
          expiresIn: Math.floor(newRefreshTokenExpiry.getTime() / 1000),
        },
      })
    } else {
      await prisma.refreshToken.create({
        data: {
          id: newRefreshToken,
          expiresIn: Math.floor(newRefreshTokenExpiry.getTime() / 1000),
          userId: id,
        },
      })
    }

    return res.json({
      user: { id: user.id, email: user.email },
      token,
      refreshToken: newRefreshToken,
    })
  }

  async logout(req: Request, res: Response) {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token not provided.' })
    }

    await prisma.refreshToken.delete({ where: { id: refreshToken } })
    return res.status(200).json({ message: 'Logged out successfully.' })
  }

  async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token not provided.' })
    }

    try {
      const storedTokenData = await prisma.refreshToken.findUnique({
        where: { id: refreshToken },
        include: { user: true },
      })

      if (
        !storedTokenData ||
        storedTokenData.expiresIn < Math.floor(Date.now() / 1000)
      ) {
        return res
          .status(401)
          .json({ error: 'Invalid or expired refresh token.' })
      }

      const newRefreshToken = uuid()
      const newRefreshTokenExpiry = new Date(
        new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
      )

      await prisma.refreshToken.delete({ where: { id: refreshToken } })
      await prisma.refreshToken.create({
        data: {
          id: newRefreshToken,
          expiresIn: Math.floor(newRefreshTokenExpiry.getTime() / 1000),
          userId: storedTokenData.user.id,
        },
      })

      const newToken = sign({ id: storedTokenData.user.id }, jwtKey, {
        expiresIn: '30d',
      })

      return res.json({ token: newToken, refreshToken: newRefreshToken })
    } catch (error) {
      console.error('Error fetching refreshToken:', error)
      return res.status(500).json({ error: 'Internal server error.' })
    }
  }
}
