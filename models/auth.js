const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verification_token: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    accessLevel: {
        type: String,
        required: true,
    },
    isPending: {
        type: Boolean,
        default: true,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
