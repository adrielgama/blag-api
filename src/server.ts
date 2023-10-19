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
  'https://blag.adrielgama.dev/',
  'https://www.josianemendonca.adv.br/',
  'https://josianemendonca.adv.br/',
  'blag.adrielgama.com/',
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'A política CORS para este site não permite acesso a partir da origem especificada.'
        return callback(new Error(msg), false)
      }

      return callback(null, true)
    },
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
