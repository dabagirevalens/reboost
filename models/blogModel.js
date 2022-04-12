const { Schema, model } = require('mongoose');

const postSchema = new Schema({

    title:{
        type: String,
        required: [true, "Please add title"]
    },

    image: {
        type: String,
        required: [true, 'Please add member image.']
    },

    content: {
        type: String,
        required: [true, "Please add content"]
    },

    auth: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    },

    numOfComments: {
        type: Number,
        default: 0
    },

}, { timestamps: true })

module.exports = model("Blog", postSchema);