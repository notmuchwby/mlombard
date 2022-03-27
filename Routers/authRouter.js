const Router = require('express')
const router = new Router()
const controller = require('../Contollers/authController')
const { check } = require('express-validator')
const authMiddleware = require('../Middlewares/authMiddleware')
const roleMiddleware = require('../Middlewares/roleMiddleware')

router.post('/registration', check('username', "Имя пользователя не может быть пустым").notEmpty(),
                             check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({ min: 4, max: 10 })
                            ,controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(['ADMIN']), controller.getUsers)

module.exports = router