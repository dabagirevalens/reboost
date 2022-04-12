const { Schema, model } = require('mongoose');

const postSchema = new Schema({

    id: {
        type: String,
        required: true
    },

    avatar: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

}, { timestamps: true })

module.exports = model("User", postSchema);