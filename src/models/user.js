const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Transaction = require('./transaction')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email not valid')
            }
        }
    },
    accountnumber: {
        type: Number,
        required: true,
        validate(value){
            if(value.toString().length < 8 || value.toString().length > 10){
                throw new Error('account number must me 8 to 10 digit')
            }
        }
    },
    balance: {
        type: Number,
        required: false,
        default: 1000
    },
    gender: {
        type: String,
        required: true,
        validate(value){
            if(!value.toLowerCase().match(/\b(male|female)\b/)){
                throw new Error('gender invalid')
            }
        }
    },
    dateofbirth: {
        type: Date,
        required: true
    },
    phonenumber: {
        type: Number,
        required: true,
        validate(value){
            if(value.toString().length < 12 || value.toString().length > 12 ){
                throw new Error('phone number invalid')
            }
        }
    },
    postalcode: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isPostalCode(value, 'IN')){
                throw new Error('postal code out of India')
            }
        }
    },
    bankname: {
        type: String,
        required: false,
        default: 'College Bank'
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password should not contain word password')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

userSchema.path('email').validate(async (email) => {
    const emailCount = await mongoose.models.User.countDocuments({ email })
    return !emailCount
}, 'Email alredy exists')

userSchema.path('accountnumber').validate(async (accountnumber) => {
    const accountnumberCount = await mongoose.models.User.countDocuments({ accountnumber })
    return !accountnumberCount
}, 'Account number alredy exists')

userSchema.path('phonenumber').validate(async (phonenumber) => {
    const phonenumberCount = await mongoose.models.User.countDocuments({ phonenumber })
    return !phonenumberCount
}, 'Phone number alredy exists')

userSchema.virtual('transactions', {
    ref: 'Transaction',
    localField: 'accountnumber',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRESIN })
    user.tokens = user.tokens.concat({ token })

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if(!user){
        throw new Error('invalid credentials')
    }

    const verified = await bcrypt.compare(password, user.password)

    if(!verified){
        throw new Error('invalid credentials')
    }

    return user
}

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User