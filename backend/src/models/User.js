import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minlength:3,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    profil:{
        type:String,
        default:''
    }
},
{timestamps:true}
)

//pass hash
userSchema.pre('save',async function(next) {
    if (!this.isModified('password')) {
        return next()
    }
    const salt=await bcrypt.genSalt(10)
    this.password= await bcrypt.hash(this.password,salt)
    next()
})

//pass compar
userSchema.methods.comparePassword=async function (userPassword) {
    return await bcrypt.compare(userPassword,this.password)
}

const User=mongoose.model('User',userSchema)

export default User