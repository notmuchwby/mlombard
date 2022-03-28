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

            const branch = new Branch({ name, address, workHours, smallImage, image, owner: req.owner })
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
            const userFound = await Branch.findOne({_id: req.params.id})
            console.log(req.params.id)

            if((role === "USER" && username === userFound.owner) || (role === "ADMIN" || role === "MODERATOR")) {
                const branchUpdate = {name, address, workHours, smallImage, image, owner: userFound.owner }
                const updatedBranch = await Branch.findByIdAndUpdate(req.params.id, branchUpdate, {new: true})
                return res.status(200).json(updatedBranch)
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
}

module.exports = new branchController()
