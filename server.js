if(process.env.NODE_ENV !== "production" ){
    require('dotenv').config()
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const ejs = require('ejs');
const passport = require('passport');
const flash = require('express-flash')
const session = require('express-session')
const initPassport = require('./passport.config');
const methodOverride = require('method-override')


initPassport(
    passport, 
    email =>  users.find(user => user.email === email)
);

const users = [];

//Setting the templating engine for parseing data on to pages
app.set("view engine", "ejs");

//allows us to access data from forms
app.use(express.urlencoded( { extended:false } ))
app.use(flash());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'))

//Hom Route
app.get('/', ( req, res ) => {
    res.render('index.ejs', {
         name:"Christopher", age:25
    })
});

//Takes users to the register page
app.get('/register', (req, res) => {
    res.render('register.ejs')
});

//Allows user to submit crednetials to DB
app.post('/register', async ( req, res ) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let user = {
            UUID:Date.now().toString(),
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword,
        }
        //Adds user to the array/Database
        users.push(user);

        //Takes the user to the login page after credentials is sent to the server
        res.redirect('/login');

    } catch(err) {
        res.redirect('/register')
    }
  
    console.log(users);
    res.status(201).send();
});


//Allows access to login page
app.get('/login', (req, res) => {
    res.render('login.ejs')
});

//Allows user to submit info to login
app.post('/login', passport.authenticate('local', 
    {
        successRedirect:'/',
        failureRedirect:'/login',
        failureFlash:true
    }
)) 
   
app.listen( 8080, () => console.log("Server started"))