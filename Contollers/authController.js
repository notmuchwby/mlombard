const User = require('../Models/User')
const Branch = require('../Models/Branch')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('../config')

const generateAccessToken = (id, role) => {
    const payload = {
        id,
        role
    }

    return jwt.sign(payload, secret)
}

class authController {
    async registration(req, res ) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }

            const { username, password, role } = req.body
            const candidate = await User.findOne({username})

            if(candidate) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует"})
            }

            const hashPassword = bcrypt.hashSync(password, 6)
            const userRole = role

            const user = new User({ username, password: hashPassword, role: userRole })
            await user.save()
            return res.json({message: "Пользователь успешно зарегестрирован"})

        } catch(e) {
            console.log(e)
            res.status(400).json({message: "Registration error"})
        }
    }
    
    async login(req, res) {
         try {

            const {username, password, role} = req.body
            const user = await User.findOne({ username })
            if(!user) {
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }
            const validPassowrd = bcrypt.compareSync(password, user.password)
            if(!validPassowrd) {
                return res.status(400).json({message: 'Введен неверный пароль'})
            }

            const token = generateAccessToken(user._id, role)
            return res.json({token})

        } catch(e) {
            console.log(e)
            res.status(400).json({message: "Login error"})            
        }
    }
    
     async getUsers(req, res) { 
        try {
            const users = await User.find()
            res.json(users)
        } catch(e) {
            console.log(e)
            res.status(400).json({message: "Login error"})       
        }
    }
}



module.exports = new authController()
