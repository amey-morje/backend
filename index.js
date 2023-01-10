const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require('helmet')
const env = require('dotenv')
const fs = require('fs')
const path = require('path')

const app = express()
env.config()
mongoose.connect(process.env.mongo_connection, () => {
    console.log('connected to mongo')
})

// middleware
app.use(express.json())
app.use(helmet())
app.use(morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))

app.get('/', (req, res) => {
    res.send('We are at homepage!!!')
})

app.listen(8080, () => {
    console.log('Listening on port 8080!!!')
})