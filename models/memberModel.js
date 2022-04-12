const { Schema, model } = require('mongoose');

var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Please add your name.']
    },

    position: {
        type: String,
        required: [true, 'Please add your position.']
    },

    image: {
        type: String,
        required: [true, 'Please add member image.']
    },

    linkedIn: {
        type: String,
        required: [true, 'Please add member linkedIn account.']
    },

    instagram: {
        type: String,
        required: [true, 'Please add member instagram name.']
    },

    email: {
        type: String,
        required: [true, 'Please add your email address.'],
        trim: true,
        lowercase: true,
        // unique: true,
        validate: [validateEmail, "Please add a valid email address."],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    reboostEmail: {
        type: String,
        required: [true, 'Please add your email address.'],
        trim: true,
        lowercase: true,
        // unique: true,
        validate: [validateEmail, "Please add a valid email address."],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    github: {
        type: String,
        required: [true, 'Please add github account.'],
    },

    startDate: {
        type: Date,
        required: [true, 'Please add github account.'],
        default: new Date(Date.now())
    },

    duration: {
        type: Number,
        default: 0,
    },

    phoneNumber: {
        type: String,
        require: [true, "Please provide your phone number."]
    },

    password: {
        type: String,
        select : false
    }

}, { timestamps: true })

module.exports = model("Member", userSchema)