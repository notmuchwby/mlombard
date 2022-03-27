const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./Routers/authRouter')
const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use("/auth", authRouter)

app.listen(PORT, async () => {
    // Don't think this is the right place to connect to the database.
    // It should be done before you start the server, otherwise someone might hit the 
    // API in between the time that the server starts, and the time that the database connects, and you'll get an error
    await mongoose.connect('mongodb+srv://mlombard:mlombard@cluster0.xu4ia.mongodb.net/m-lombard?retryWrites=true&w=majority')
    console.log(`the server has started on port ${PORT}`)    
})
