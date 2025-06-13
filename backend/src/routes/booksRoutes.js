import express from 'express'
import cloudinary from '../lib/cloudinary.js'
import Book from '../models/Book.js'
import protectRoute from '../middleware/authMiddleware.js'

const router=express.Router()

router.post('/',protectRoute,async(req,res)=>{
        try {
            const {title,caption,rating,image}=req.body
       
            if (!title || !caption || !rating || !image) {
                return res.status(400).json({message: 'fill all fields'})
            }

            //upload image
            const uploadRes=await cloudinary.uploader.upload(image)
            const imageUrl=uploadRes.secure_url

            const book=new Book({
                title,
                caption,
                rating,
                image:imageUrl,
                user:req.user._id
            })

            await book.save()

            res.status(201).json(book)
        } catch (error) {
            console.log('error creating book',error);
            res.status(500).json({message:error.message})
            
        }
})

export default router