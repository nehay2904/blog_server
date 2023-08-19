const mongoose = require('mongoose')


const postSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
      }, 
    title:{
        type:String
    },
    content:{
        type:String
    },
    imageUrl:{
        type:String
    }
})




const postModel = mongoose.model("post" , postSchema)


module.exports = postModel;
