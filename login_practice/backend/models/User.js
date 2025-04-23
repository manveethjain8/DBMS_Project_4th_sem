
const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    credits:{
        type: Number,
        default:300,
    },
    email:{
        type:String,
        required:true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
});

const User=mongoose.model('User', userSchema);

module.exports=User;