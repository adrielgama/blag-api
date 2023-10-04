import { prisma } from '../utils/prisma'

export async function clearExpiredTokens() {
  try {
    const now = Math.floor(Date.now() / 1000)
    await prisma.refreshToken.deleteMany({ where: { expiresIn: { lt: now } } })
  } catch (error) {
    console.error('Error clearing expired tokens:', error)
  }
}
