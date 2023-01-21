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

postRouter.route('/:postId/comments')
.get((req, res, next) => {
    Posts.findById(req.params.postId)
    // .populate('comments.author')
    .then((post) => {
        if( post != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(post.comments);
        }
        else {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if(post !=  null) {
            post.comments.push(req.body);
            post.save()
            .then((post) => {
                Posts.findById(post._id)
                .then((post) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(post);
                })
            }, (err) => next (err));
        }
        else {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported for /posts/' + req.params.postId + '/comments');
})
.delete((req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if(post != null) {
            for(var i = (post.comments.length -1); i >= 0; i--) {
                post.comments.id(post.comments[i]._id).remove();
            }
            post.save()
            .then((post) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);
            }, (err) => next(err));
        }
        else {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next (err))
    .catch((err) => next(err));
});

postRouter.route('/:postId/comments/:commentId')
.get((req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if(post != null && post.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(post.comments.id(req.params.commentId));
        }
        else if(post == null) {
            err = new Error('Post ' + req.params.postId + ' not found');
            res.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            res.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /posts/' + req.params.postId + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if(post != null && post.comments.id(req.params.commentId) != null){
            // var Id1 = req.user._id.toString();
            // var Id2 = post.comments.id(req.params.commentId).author.toString();
            // if(Id1 != Id2) {
            //     var err = new Error('You are not authorized to manipulate this comment');
            //     err.status = 403;
            //     return next(err);
            // }
            if(req.body.comment) {
                post.comments.id(req.params.commentId).comment = req.body.comment;
            }
            post.save()
            .then((post) => {
                Posts.findById(post._id)
                // .populate('comments.author')
                .then((post) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(post);
                })
            }, (err) => next(err));
        }
        else if (post == null) {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if (post != null && post.comments.id(req.params.commentId) != null) {
            // var Id1 = req.user._id.toString();
            // var Id2 = post.comments.id(req.params.commentId).author.toString();
            // if(Id1 != Id2){
            //     var err = new Error('You are not authorized to delete this comment');
            //     err.status = 403;
            //     return next(err);
            // }
            post.comments.id(req.params.commentId).remove();
            post.save()
            .then((post) => {
                Posts.findById(post._id)
                // .populate('comments.author')
                .then((post) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(post);  
                })               
            }, (err) => next(err));
        }
        else if (post == null) {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

postRouter.route('/:postId/likes')
.get((req, res, next) => {
    Posts.findById(req.params.postId)
    // .populate('likes.liked_by')
    .then((post) => {
        if(post != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(post.likes);
        }
        else {
            err = new Error('Post ' + req.params.postId + ' not foumd');
            err.status = 400;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if(post != null) {
            post.likes.push(req.body);
            post.save()
            .then((post) => {
                Posts.findById(post._id)
                .then((post) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(post);
                })
            }, (err) => next(err));
        }
        else {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported for /posts/' + req.params.postId + '/likes');
})
.delete((req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if(post != null) {
            for(var i = (post.likes.length - 1); i>=0; i--) {
                post.likes.id(post.likes[i]._id).remove();           
            }
            post.save()
            .then((post) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(post);
            }, (err) => next(err));
        }
        else {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
        
    }, (err) => next(err))
    .catch((err) => next(err));
});

postRouter.route('/:postId/likes/:likeId')
.get((req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if(post != null && post.likes.id(req.params.likeId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(post.likes.id(req.params.likeId));
        }
        else if(post == null) {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Like ' + req.params.likeId + ' not found');
            res.status = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next (err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /posts/' + req.params.postId + '/likes/' + req.params.likeId);
}) 
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /posts/' + req.params.postId + '/likes/' + req.params.likeId);
})
.delete((req, res, next) => {
    Posts.findById(req.params.postId)
    .then((post) => {
        if (post != null && post.likes.id(req.params.likeId) != null) {
            // var Id1 = req.user._id.toString();
            // var Id2 = post.comments.id(req.params.commentId).author.toString();
            // if(Id1 != Id2){
            //     var err = new Error('You are not authorized to delete this comment');
            //     err.status = 403;
            //     return next(err);
            // }
            post.likes.id(req.params.likeId).remove();
            post.save()
            .then((post) => {
                Posts.findById(post._id)
                // .populate('comments.author')
                .then((post) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(post);  
                })               
            }, (err) => next(err));
        }
        else if (post == null) {
            err = new Error('Post ' + req.params.postId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Like ' + req.params.likeId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = postRouter;