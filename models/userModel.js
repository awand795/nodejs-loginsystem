const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : "This field Is required"
    },
    lastName : {
        type : String
    },
    email : {
        type : String,
        unique : "Please use another email",
        required : "This field Is required"
    },
    password : {
        type : String,
        required : "This field Is required",
        minlength : 6
    }
});

//Custom validation for email
UserSchema.path('email').validate((val) => {
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(val);
}, 'Invalid e-mail.');

mongoose.model('User',UserSchema);