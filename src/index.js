const express = require('express')
require('dotenv').config()
require('./db/mongoose')
const userRouter = require('./routers/user')
const transactionRouter = require('./routers/user.transfer')

const app = express()

const port = process.env.PORT

app.use(express.json())

//user router
app.use(userRouter)

//transaction router
app.use(transactionRouter)

app.listen(port, () => {
    console.log(`server upon running in ${port}`)
})