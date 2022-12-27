import express from 'express'
import cors from 'cors';
import UserRouter from './routes/user'
import ShortenerRouter from './routes/shortener';

const app = express()

var corsOptions = {
  origin: 'http://localhost',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json({ limit: "10mb" }))

app.use('/', UserRouter)
app.use('/', ShortenerRouter)

export default app;
