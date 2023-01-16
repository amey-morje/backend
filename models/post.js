const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    post_id: {
        type: Number,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default:''
    }
    // likes:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Like'
    // }],
    // comments:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Comment'
    // }],
    // posted_by: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }
});

var Posts = mongoose.model('Post', postSchema);

module.exports = Posts;