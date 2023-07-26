const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    bookid:{
        type: String,
        required: true,
    },
    bookname:{
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    department:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
    },
    created:{
        type:Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('Bookdetail',userSchema);