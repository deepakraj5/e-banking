const express = require('express')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const router = express.Router()

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if(!user) {
            return res.status(400).send({ error: 'wrong credentials' })
        }
        const verify = await bcrypt.compare(req.body.password, user.password)
        if(!verify) {
            return res.status(400).send({ error: 'wrong credentials' })
        }

        const token = await user.generateAuthToken()

        res.send({
            user, token
        })
    }catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router