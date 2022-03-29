const jwt = require('jsonwebtoken')
const {secret} = require('../config')
const User = require('../Models/User')

module.exports = function() {
    return async function(req, res, next) { 
        if(req.method === "OPTIONS") {
            next()
        }
   
        try {
           const token = req.headers.authorization.split(' ')[1]
           
           if(!token) {
               return res.status(400).json({message: "Пользователь не авторизирован"})
           } 
           const role = jwt.verify(token, secret)
           
           console.log(role.id)
           const id = role.id
           const admin = await User.findOne({_id: id })
           console.log(admin.role)
        
           req.admin = admin
           console.log(admin.id)
           next()

        } catch(e) {
           console.log(e)
           return res.status(403).json({message: "Пользователь не авторизован"})
        }
    }
}