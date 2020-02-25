const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userModel = mongoose.model('User');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

router.get('/',(req,res)=>{
    res.render('index');
});

router.get('/register',(req,res)=>{
    res.render('register');
});

router.post('/register',(req,res)=>{
    var newUser = new userModel();
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.email = req.body.email;
    newUser.password = req.body.password;
    if(req.body.repeatPassword === req.body.password){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                newUser.password = hash;
                newUser.save((err,doc)=>{
                    if(!err){
                        req.flash('success_msg',"You're successfully sign up, now you can login");
                        res.redirect('/');
                    }
                    else{
                        if(err.name === "ValidationError"){
                            handleValidationError(err,req.body);
                            res.render("register",{user : req.body});
                        }
                        else if(err.code === 11000){
                            res.render('register',{user : req.body,error_msg : "This email has been registered, Please Using Another email"});
                        }
                    }
                });
            });
        });
    }
    else if(req.body.password.length < 6){
        res.render('register',{user:req.body,error_msg:"Password length must be 6 character"})
    }
    else if(req.body.firstName.length < 2){
        res.render('register',{user:req.body,error_msg:"Name length must minimum 2 character"})
    }
    else{
        res.render('register',{user:req.body,error_pass : "The password is don't match"});
    }
});

passport.use(new localStrategy(
   {usernameField : 'email'},(email,password,done)=>{
       userModel.findOne({email : email},(err,doc)=>{
           if(!doc){
               return done(null,false,{message:"That email is not registered"});
           }
           bcrypt.compare(password,doc.password,(err,isMatch)=>{
               if(err){
                   throw err;
               }
               if(isMatch){
                   return done(null,doc);
               }
               else{
                   return done(null,false,{message: "Password incorrect, check again your password"});
               }
           })
       })
   }
));

passport.serializeUser((doc,done)=>{
    done(null,doc.id);
});

passport.deserializeUser((id,done)=>{
    userModel.findById(id,(err,doc)=>{
        done(err,doc);
    });
});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect : '/dashboard',
        failureRedirect : '/',
        failureFlash : true
    })(req,res,next);
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'firstName':
                body['firstNameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'password':
                body['passwordError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

module.exports = router;