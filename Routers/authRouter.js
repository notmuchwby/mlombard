const Router = require('express')
const router = new Router()
const controller = require('../Contollers/authController')
const branchController = require('../Contollers/branchController')
const { check } = require('express-validator')
const authMiddleware = require('../Middlewares/authMiddleware')
const roleMiddleware = require('../Middlewares/roleMiddleware')
const uploadMiddleware = require('../Middlewares/uploadMiddleware')
const editMiddleware = require('../Middlewares/editMiddleware')
const removeMiddleware = require('../Middlewares/removeMiddleware')
const getBranchMiddleware = require('../Middlewares/getBranchMiddleware')
const roleChangeMiddleware = require('../Middlewares/roleChangeMiddleware')
const blockEditMiddleware = require('../Middlewares/blockEditMiddleware')

// Router for user registration
router.post('/registration', check('username', "Имя пользователя не может быть пустым").notEmpty(),
                             check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({ min: 4, max: 10 })
                            ,controller.registration)

// Router for logging in users                            
router.post('/login', controller.login)

// Router for posting a branch
router.post('/post-branch', uploadMiddleware(), branchController.upload)

// Router for getting list of branches 
router.get('/get-branch', getBranchMiddleware(), branchController.getBranches)

// Router for removing a branch
router.delete('/delete-branch/:id', removeMiddleware(), branchController.remove)

// Router for editing a branch
router.put('/edit-branch/:id', editMiddleware(), branchController.edit)

// ADMIN ROUTER for changing roles 
router.put('/change-role/:id', roleChangeMiddleware(), branchController.changeRole)

// ADMIN ROUTER for blocking branches for editing 
router.put('/block-edit/:id', blockEditMiddleware(), branchController.editTimeChange)

//////////////////////////////////////////////////////////
router.get('/users', roleMiddleware(), controller.getUsers)

module.exports = router