const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    // author: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }
})

const likesSchema = new Schema({
    like: { 
        type: Number,
        required: true
    },
    // liked_by: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }
})

const postSchema = new Schema({
    post_id: {
        type: Number,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default:''
    },
    likes:[likesSchema],
    comments:[commentSchema]
    // posted_by: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }
});

var Posts = mongoose.model('Post', postSchema);

module.exports = Posts;