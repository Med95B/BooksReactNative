import express from 'express'
import 'dotenv/config' 
import { connectDB } from './lib/db.js'

const app=express()
const PORT=process.env.PORT


app.use(express.json())

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`);
    connectDB()
})