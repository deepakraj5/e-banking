const mongoose = require('mongoose')

const transactionModel = new mongoose.Schema({
    toAccountNumber: {
        type: Number,
        required: true,
        validate(value){
            if(value.toString().length < 8 || value.toString().length > 10){
                throw new Error('account number must me 8 to 10 digit')
            }
        }
    },
    amount: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.Number,
        required: true
    }
}, {
    timestamps: true
})

transactionModel.methods.

const Transaction = mongoose.model('Transaction', transactionModel)

module.exports = Transaction