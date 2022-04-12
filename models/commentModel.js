const { Schema, model } = require('mongoose');

const postSchema = new Schema({

    auth: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    name: {
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: [true, "Please add comment"]
    },

    blog : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Blog'
    }

}, { timestamps: true })

module.exports = model("Comment", postSchema);