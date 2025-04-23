
const mongoose=require('mongoose');

const familiarSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    orderId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    dateTime:{
        type:String,
        required:true
    },
    contract:{
        type:Boolean,
        required:true
    }

});

const Familiar=mongoose.model('Familiar', familiarSchema);
module.exports=Familiar;