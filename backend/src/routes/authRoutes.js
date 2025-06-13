import express from 'express'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const router=express.Router()

const generateToken=(userId)=>{
    return  jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'15d'})  
}


router.post('/register', async (req,res)=>{
    try {
        const {email,name,password,profil}=req.body
        if (!email || !name || !password) {
            return res.status(400).json({message:'all fields are required'})
        }

        if (password.length < 6) {
            return res.status(400).json({message:'password schould be at least 6 charachters long'})
        }

         if (name.length < 3) {
            return res.status(400).json({message:'name schould be at least 3 charachters long'})
        }

     const userExist = await User.findOne({username})
     if (userExist) {
        return res.status(400).json({message:'username already exists'})
     }
    const emailExist = await User.findOne({email})
     if (emailExist) {
        return res.status(400).json({message:'email already exists'})
     }

     const user=new User({
        email,
        username,
        password,
        profil
     })

     await user.save()

     const token= generateToken(user._id)

     res.status(201).json({
        token,
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            profil:user.profil
        }
     })

    } catch (error) {
        console.log('error in register',error);
        res.status(500).json({message:'register error'})
    }
})

router.post('/login', async (req,res)=>{
try {
    const {email,password}=req.body
    if (!email || !password) {
        return res.status(400).json({message:'all fields are required'})
    }
    const user = await User.findOne({email})
    if (!user) {
        return res.status(400).json({message:'invalid credentials'})
    }

    const passCorrect=await user.comparePassword(password)
if (!passCorrect) {
    return res.status(400).json({message:'invalid credentials'})
}

const token=generateToken(user._id)
res.status(200).json({
    token,
    user:{
        id:user._id,
        username:user.username,
        email:user.email,
        profil:user.profil
    }
})
} catch (error) {
    console.log('error in login');
     res.status(500).json({message:'login error'})

}

})

export default router