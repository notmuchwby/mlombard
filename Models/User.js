const mongoose = require('mongoose')

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String, 
            required: true
        },
        role: {
            type: String,
            required: true
        }
    }
)



module.exports = mongoose.model('User', UserSchema)