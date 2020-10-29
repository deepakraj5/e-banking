const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = express.Router()

const errorMessage = (error) => {
    let errors = {}
    const messages = error.message.substring(error.message.indexOf(':') + 1).trim()
    const message = messages.split(',')
    message.forEach(msg => {
        let [key, value] = msg.split(':').map(m => m.trim())
        errors[key] = value
    })
    return errors
}

router.post('/signup', async (req, res) => {
    try{
        const user = new User(req.body)
        await user.save()

        res.status(201).send()
    }catch(e){
        res.status(400).send(errorMessage(e))
    }
})

router.post('/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        await user.save()

        res.send({
            user,
            token
        })
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/profile', auth, async (req, res) => {
    res.send(req.user)
})

module.exports = router