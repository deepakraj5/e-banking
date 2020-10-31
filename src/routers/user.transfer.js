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

        const toUser = await User.findOne({ accountnumber: req.body.toAccountNumber })
        if(!toUser){
            return res.status(404).send({ error: 'account not found' })
        }
        const balance1 = toUser.balance
        const balance2 = req.user.balance
        await User.findOneAndUpdate({ accountnumber: req.body.toAccountNumber }, { balance: balance1 + parseInt(req.body.amount) }, { new: true, runValidators: true })
        await User.findOneAndUpdate({ _id: req.user._id }, { balance: balance2 - req.body.amount}, { new: true, runValidators: true })

        await transaction.save()
        res.send({ transactionDetails: transaction })
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/viewtransaction', auth, async (req, res) => {
    try{
        const debitStatements = await Transaction.find({ owner: req.user.accountnumber })
        const creditStatements = await Transaction.find({ toAccountNumber: req.user.accountnumber })

        res.send({
            debitStatements,
            creditStatements
        })
    }catch(e){
        res.status(404).send(e)
    }
})

module.exports = router