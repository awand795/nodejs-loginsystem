const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const db = require('./models/config');
const indexController = require('./controllers/index');
const userController = require('./controllers/users');
const app = express();
const PORT = process.env.PORT | 5000;

//view engine
app.set('views', path.join(__dirname,"views"));
app.engine('hbs',exphbs({
    extname: "hbs",
    defaultLayout : "mainLayout",
    layoutsDir : __dirname+"/views/layout"
}));
app.set('view engine', 'hbs');

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(cookieParser());

//set static folder
app.use(express.static(path.join(__dirname,'public')));

//express session
app.use(session({
    secret : 'secret',
    saveUninitialized : true,
    resave: true
}));

//passport
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//gloval variabels
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/',indexController);
app.use('/dashboard',userController);

app.listen(PORT,()=>{
    console.log(`app running on port ${PORT}`);
});