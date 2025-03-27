const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email", + value)
            }
        }
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    }
},
    {
        timestamps: true
    }
)

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "Dev@#566")
    return token
}

module.exports = mongoose.model("User", userSchema)