const express = require('express')
require('dotenv').config()
require('./db/mongoose')
const cors = require('cors')
const userRouter = require('./routers/user')
const loginRouter = require('./middleware/login.auth')
const transactionRouter = require('./routers/user.transfer')

const app = express()

const port = process.env.PORT

app.use(express.json())
app.use(cors())

//user router
app.use(userRouter)

//login router
app.use(loginRouter)

//transaction router
app.use(transactionRouter)

app.listen(port, () => {
    console.log(`server upon running in ${port}`)
})