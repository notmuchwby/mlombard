const Router = require('express')
const router = new Router()
const controller = require('../Contollers/authController')
const branchController = require('../Contollers/branchController')
const { check } = require('express-validator')
const authMiddleware = require('../Middlewares/authMiddleware')
const roleMiddleware = require('../Middlewares/roleMiddleware')
const uploadMiddleware = require('../Middlewares/uploadMiddleware')
const editMiddleware = require('../Middlewares/editMiddleware')


// router.post('/registration', check('username', "Имя пользователя не может быть пустым").notEmpty(),
//                              check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({ min: 4, max: 10 })
//                             ,controller.registration)
router.post('/login', controller.login)

// Router for posting a branch
router.post('/post-branch', uploadMiddleware(), branchController.upload)

// Router for getting list of branches 


// Router for removing a branch


// Router for editing a branch
router.put('/edit-branch/:id', editMiddleware(), branchController.edit)

// ADMIN ROUTER for changing roles and blocking branches for editing 


// Router for 
router.get('/users', roleMiddleware(), controller.getUsers)

module.exports = router