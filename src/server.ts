import express from 'express'
import cron from 'node-cron'
import dotenv from 'dotenv'
import cors from 'cors'
import { router } from './routes'
import { clearExpiredTokens } from './cron/clearExpiredTokens'
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())

app.use(express.json())
app.use(router)

cron.schedule('0 3 * * *', clearExpiredTokens)

app.listen(Number(port), () =>
  console.log(`server is running on http://localhost:${port}`),
)
