const User = require('../Models/User')
const Branch = require('../Models/Branch')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { secret } = require('../config')
const { system } = require('nodemon/lib/config')


class branchController {

    // Добавление филиала 
    async upload(req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка загрузки филиала", errors})
            }

            const {name, address, workHours, smallImage, image} = req.body
            const candidateBranch = await Branch.findOne({ name })

            if(candidateBranch) {
                return res.status(400).json({message: "Филиал с таким именем уже существует"})
            }

            const branch = new Branch({ name, address, workHours, smallImage, image, owner: req.owner, canEditStartTime: 0, canEditEndTime: 24})
            await branch.save()

            return res.status(200).json({branch})
        } catch(e) {
            console.log(e)
            res.status(400).json({message: "Ошибка загрузки филиала"})     
        }
    }

    // Редактирование филиала
    async edit(req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при редактировании филиала", errors})
            }
            
            const {name, address, workHours, smallImage, image} = req.body
            const role = req.role
            const username = req.username
            const branch = await Branch.findOne({_id: req.params.id})
            console.log(req.params.id)

            const hourNow = new Date().getHours()
            console.log("Hours Now -> ", hourNow)

            if(hourNow >= branch.canEditStartTime && hourNow < branch.canEditEndTime)  {
                if((role === "USER" && username === branch.owner) || (role === "ADMIN" || role === "MODERATOR")) {
                    const branchUpdate = {name, address, workHours, smallImage, image, owner: branch.owner }
                    const updatedBranch = await Branch.findByIdAndUpdate(req.params.id, branchUpdate, {new: true})
                    return res.status(200).json(updatedBranch)
                }
            } else {
                return res.status(400).json({message: "Не возможно отредактировать филиал в данное время"})
            }

        } catch(e) {
            console.log(e)
            res.status(400).json({message: "Ошибка при редактировании филиалаr"})
        }
    }

    // Удаление филиала
    async remove(req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при удалении филиала", errors})
            }
            
            const username = req.username
            const userFound = await Branch.findOne({_id: req.params.id})
            const role = req.role

            if((role === "USER" && username === userFound.owner) || (role === "ADMIN" || role === "MODERATOR")) {
                const branch = await Branch.findById(req.params.id)
                await branch.remove()
                return res.status(204).json({message: "Филиал успешно удален"})
            } else {
                return res.status(400).json({message: "Пользователь не может удалять филиал"})
            }                      

        } catch(e) {
            console.log(e)
            res.status(400).json({message: "Ошибка при удалении филиалаr"})
        }
    }

    // Показ филиалов
    async getBranches(req, res) { 
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при получении филиалов", errors})
            }

            const username = req.username
            const userFound = await Branch.findOne({owner: username})
            const role = req.role
           

            if(role === "USER" && username === userFound.owner) {
                const branches = await Branch.find({owner: userFound.owner})
                return res.status(200).json({ branches })
            }

            if(role === "ADMIN" || role === "MODERATOR") {
                const branches = await Branch.find()
                return res.status(200).json({ branches })
            }

        } catch(e) {
            console.log(e)
            res.status(400).json({message: "Ошибка при получении филиалов"})       
        }
    }

    // Изменение роли пользователей администратором 
    async changeRole(req, res) {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при изменении роли пользователя", errors})
            }

            const admin = req.admin
            const userFound = await User.findOne({_id: req.params.id})
            
            if(admin.role === "ADMIN" && userFound) {
                const updatedUser = await User.findByIdAndUpdate(req.params.id, {role: req.body.role}, {new: true})
                return res.status(200).json({ updatedUser })
            } else {
                return res.status(400).json({message: "Данный пользователь не может изменять роль"})
            }

        } catch(e) {
            console.log(e)
            res.status(400).json({message: "Ошибка при изменении роли пользователя"})             
        }
    }

    // Изменение времени в которое нельзя редактировать филиал
    async editTimeChange(req, res) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при изменении времени блокировки", errors})
            }

            const role = req.role

            if(role === "ADMIN") {
                const updatedBranch = await Branch.findByIdAndUpdate(req.params.id, {canEditStartTime: req.body.canEditStartTime, canEditEndTime: req.body.canEditEndTime}, {new: true})
                return res.status(200).json({ updatedBranch })
            } else {
                return res.status(400).json({message: "Данный пользователь не может изменить время блокировки"})
            }

        } catch(e) {
            console.log(e)
            res.status(400).json({message: "Ошибка при изменении времени блокировки"})
        }
    }

}

module.exports = new branchController()
