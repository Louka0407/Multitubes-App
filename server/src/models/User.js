const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function(next) {
    var user = this;
    
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.generateToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id }, 'secret');
    const oneHour = moment().add(1, 'hour').valueOf();

    user.tokenExp = oneHour;
    user.token = token;
    
    await user.save();

    return user;
};

userSchema.statics.findByToken = async function(token) {
    const user = this;

    try {
        // Décoder le token
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, 'secret', (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded);
            });
        });

        // Trouver l'utilisateur correspondant
        const foundUser = await user.findOne({ "_id": decoded._id, "token": token });
        return foundUser;
    } catch (err) {
        throw err;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
