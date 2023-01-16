const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require('helmet')
const env = require('dotenv')
const fs = require('fs')
const path = require('path')

const postRouter = require('./routes/postRouter');

const Posts = require('./models/post');

mongoose.connect('mongodb://localhost:27017/staging', () => {
    console.log('connected to mongo')
});



const app = express()
env.config()
// mongoose.connect(process.env.mongo_connection, () => {
//     console.log('connected to mongo')
// })

// middleware
app.use(express.json())
app.use(express.json())
app.use(express.urlencoded({ extended: false}));
app.use(helmet())
app.use(morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))

app.use('/posts', postRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
  });

  app.get('/', (req, res) => {
    res.send('We are at homepage!!!')
})

  app.listen(8080, () => {
    console.log('Listening on port 8080!!!')
})
  
  module.exports = app;