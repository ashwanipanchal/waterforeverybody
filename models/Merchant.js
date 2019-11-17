const mongoose = require('mongoose');


const merSchema = mongoose.Schema({

    bustitle:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    }

})

const Merchant = mongoose.model('Merchant', merSchema);

module.exports = Merchant;