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

            return res.json({message: "Филиал успешно создан"})
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
            

            if(role === "USER" && username === userFound.owner) {
                const branch = new Branch({ name, address, workHours, smallImage, image, owner: userFound.owner })
                const updatedBranch = await Branch.findByIdAndUpdate(req.params.id, branch, {new: true})
                return res.status(200).json(updatedBranch)
            }

        } catch(e) {
            console.log(e)
            res.status(400).json({message: "Ошибка при редактировании филиалаr"})
        }
    }
}

module.exports = new branchController()
