const express = require('express')
const User = require('../models/user')

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

module.exports = router