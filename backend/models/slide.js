const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema({
    slideNum:{
        type:Number,
        required:true,
    },
    header:{
       type:String,
       required:true 
    },
    description:{
        type:String,
        required:true
    },
    urlImg:{
        type:String,
        required: true
    },
    likes:{
        type:Array,
    },
    category:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('Slide',slideSchema)