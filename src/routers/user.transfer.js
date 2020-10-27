const express = require('express')
const auth = require('../middleware/auth')
const Transaction = require('../models/transaction')
const User = require('../models/user')

const router = express.Router()

router.post('/fundtransfer', auth, async (req, res) => {
    try{
        const transaction = new Transaction({
            ...req.body,
            owner: req.user.accountnumber
        })

        const user = await User.findOne({ accountnumber: req.body.toAccountNumber })
        if(!user){
            return res.status(404).send({ error: 'account not found' })
        }

        await user.transferFund(req.amount)

        await transaction.save()
        res.send({ transactionDetails: transaction })
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router