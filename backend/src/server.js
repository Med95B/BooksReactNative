import express from 'express'
import 'dotenv/config' 
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import booksRoutes from './routes/booksRoutes.js'
import { connectDB } from './lib/db.js'


const app=express()
const PORT=process.env.PORT

app.use(cors())
app.use(express.json())
app.use('/api/auth',authRoutes)
app.use('/api/books',booksRoutes)

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB()
})
