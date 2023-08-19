const mongoose = require('mongoose')


const authorSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
      }, 
    author_name:{
        type:String
    },
    
    bio:{
        type:String
    },
    profile_photo:{
        type:String
    }
})




const authorModel = mongoose.model("author" , authorSchema)

module.exports = authorModel;