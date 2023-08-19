const mongoose = require('mongoose')


const UserSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true,
      }, 
    username:{
        type:String
    },
    email:{
        type:String
    },
    password:{
       type: String
    },
    hint:{
        type:String
    },
    mobile_no:{
        type:String
    },
    hint_option:{
        type:String
    }
})




const userModel = mongoose.model("user" , UserSchema)


module.exports = userModel;