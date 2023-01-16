const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const postRouter = express.Router();
const Posts = require('../models/post');

postRouter.use(bodyParser.json());

postRouter.route('/')
.get((req, res, next) => {
    Posts.find({})
    .then((posts)=> {
        res.setStatus = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(posts);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) =>  {
    Posts.create(req.body)
    .then((post) => {
        console.log('Post Created', post);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err)=> next(err));
})
.put((req, res, next) => {
    res.setStatusCode = 403;
    res.end('PUT operation not supported on /posts')
})
.delete((req, res, next) => {
    Posts.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

postRouter.route('/:postId')
.get((req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(post);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not allowed on /posts/' + req.params.postId);
})
.put((req, res, next) => {
    Posts.findByIdAndUpdate(req.params.postId, {
        $set: req.body
    }, { new:true })
    .then((post) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(post);
    },(err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Posts.findByIdAndRemove(req.params.postId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = postRouter;