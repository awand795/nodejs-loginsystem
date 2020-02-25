const mongoose = require('mongoose');

mongoose.connect(`mongodb+srv://${username}:${password}@${cluster}/loginapp?retryWrites=true&w=majority`,{useNewUrlParser : true, useUnifiedTopology : true},(err)=>{
    if(!err){
        console.log('connected to mongo');
    }
    else{
        console.log(err);
    }
});

const User = require('./userModel');