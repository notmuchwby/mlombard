const mongoose = require('mongoose')

const BranchSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        maxLength: 128,
        validate: /^$|^\d{10}$/
    },
    address: {
        type: String,
        unique: true,
        required: true,
        maxLength: 128,
        validate: /^$|^\d{10}$/
    },
    workHours: {
        type: String,
        unique: true,
        required: true,
    },
    smallImage: {
        data: Buffer,
        type: String,
        required: true,
    },
    Image: {
        data: Buffer,
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Branch', BranchSchema)