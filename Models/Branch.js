const mongoose = require('mongoose')

const BranchSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        maxLength: 128,
    },
    address: {
        type: String,
        unique: true,
        required: true,
        maxLength: 128,
    },
    workHours: {
        type: String,
        required: true,
    },
    smallImage: {
        data: Buffer,
        type: String,
        required: true,
    },
    image: {
        data: Buffer,
        type: String,
        required: true,
    }, 
    owner: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model('Branch', BranchSchema)