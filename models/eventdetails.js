const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventid:{
        type: String,
        required: true,
    },
    eventname:{
        type: String,
        required: true,
    },
    eventdate:{
        type: String,
        required: true,
    },
    venue:{
        type: String,
        required: true,
    },
    organised:{
        type: String,
        required: true,
    },
    department:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    image:{
        type: String,
        required: true,
    },
    
    created:{
        type:Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('Eventdetail',eventSchema);