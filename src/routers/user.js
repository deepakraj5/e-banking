const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/signup', async (req, res) => {
    try{
        const user = new User(req.body)
        await user.save()

        res.status(201).send()
    }catch(e){
        res.status(400).send(e)
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