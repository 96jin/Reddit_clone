import express from 'express'
import morgan from 'morgan'
import authRoutes from './routes/auth'
import { AppDataSource } from './data-source'
import cors from 'cors'
// 로그 관리

const app = express()

app.use(express.json())   // body 객체 읽어줌
app.use(morgan('dev'))
app.use(cors({
  origin: ['http://localhost:3000']
}))


app.get('/', (req,res) => {
  res.send('Hello world!')
})
app.use('/api/auth',authRoutes)

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
  console.log(`Server running at Http://localhost:${PORT}`)

  AppDataSource.initialize().then(async () => {
    console.log('database initilaized')
  }).catch(error => console.log(error))
})