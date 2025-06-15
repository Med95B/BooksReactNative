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

router.get('/',protectRoute,async(req,res)=>{

    try {
        const page=req.query.page || 1
        const limit=req.query.limit || 5
        const skip=(page - 1) * limit

        const books=await Book.find()
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate('user','username profil')
       
        const totalBooks=await Book.countDocuments()
       
        res.send({
            books,
            currentPage:page,
            totalBooks,
            totalPages:Math.ceil(totalBooks/limit)
        })

    } catch (error) {
        console.log('error geting books',error);
        res.status(500).json({message:'server error'})
    }
})

router.delete('/:id',protectRoute,async(req,res)=>{

    try {
        const book = await Book.findById(req.params.id)
        if (!book) {
            return res.status(404).json({message:'book not fund'})
        }

        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({message: 'unauthorized'})
        }

        if (book.image && book.image.includes('cloudinary')) {
            try {
                const publicId=book.image.split('/').pop().split('.')[0]
                await cloudinary.uploader.destroy(publicId)

            } catch (deleteError) {
                console.log('error deleting image from cloudinary',deleteError);
                
            }
        }
        await book.deleteOne()

        res.json({message: 'book deleted successfully'})
    } catch (error) {
        console.log('error deleting book',error);
    res.status(500).json({message:'server error'})        
    }
})


router.get('/user',protectRoute,async (req,res) => {
    try {
        const books=(await Book.find({user:req.user._id})).sort({createdAt:-1})
        res.send(books)
    } catch (error) {
        console.log('get user books error',error.message);
        res.status(500).json({message:'server error'})
        
    }
})
export default router