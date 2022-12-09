import express from 'express'
import morgan from 'morgan'
// 로그 관리
import authRoutes from './routes/auth'
import subRoutes from './routes/subs'
import { AppDataSource } from './data-source'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())   // body 객체 읽어줌
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
}))
// 백엔드에서 credentials 를 true로 주고 , 프론트에서도 withCredentials 를 true 로 줬음에도 쿠키가 전달이 안되는 에러가 난다.
// -> 백엔드에서 cookie-parser 설치해서 사용해야 쿠키를 받을 수 있다.
dotenv.config()

app.get('/', (req,res) => {
  res.send('Hello world!')
})
app.use('/api/auth',authRoutes)
app.use('/api/subs',subRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
  console.log(`Server running at Http://localhost:${PORT}`)

  // typeorm 으로 연결할 때에는 이런식으로 한다.
  AppDataSource.initialize().then(async () => {
    console.log('database initilaized')
  }).catch(error => console.log(error))
})