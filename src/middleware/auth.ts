import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import 'dotenv/config'

const jwtKey = process.env.JWT_SECRET

type IToken = {
  id: string
  iat: number
  exp: number
}

export function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  const [, token] = authorization.split(' ')

  try {
    if (!jwtKey) {
      return res.status(500).json({ error: 'JWT key is missing.' })
    }

    const decoded = verify(token, jwtKey)
    const { id } = decoded as IToken

    res.locals.userId = id

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid' })
  }
}
