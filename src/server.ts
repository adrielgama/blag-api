import express from 'express'
import cron from 'node-cron'
import dotenv from 'dotenv'
import cors from 'cors'
import { router } from './routes'
import { clearExpiredTokens } from './cron/clearExpiredTokens'
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

const allowedOrigins = [
  'http://localhost:5173',
  'https://blag.adrielgama.dev',
  'https://www.josianemendonca.adv.br',
]

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

app.use(express.json())
app.use(router)

cron.schedule('0 3 * * *', clearExpiredTokens)

app.listen(Number(port), () =>
  console.log(`server is running on http://localhost:${port}`),
)
