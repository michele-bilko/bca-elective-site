if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const initializePassport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


initializePassport(
    passport, 
    email=> users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false

}))
app.use(methodOverride('_method'))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static("public"));


app.get('/', checkAuthenticated, (req, res) =>{
    res.render('index.ejs', { name: req.user.name})
}) 

app.get('/signup', checkAuthenticated, (req, res) =>{
    res.render('signup.ejs', { name: req.user.name})
}) 

app.get('/admin', checkAuthenticated, (req, res) =>{
    res.render('admin.ejs', { name: req.user.name})
}) 

app.get('/login', checkNotAuthenticated,(req, res)=>{
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated ,passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated,(req, res)=>{
    res.render('register.ejs')
})


app.post('/register', checkNotAuthenticated,async (req, res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    }catch{
        res.redirect('/register')
    }
    console.log(users)
})

app.delete('/logout', (req, res)=>{
    req.logOut()
    res.redirect('/login')
})


function checkAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if (req.isAuthenticated()){
        return res.redirect('/')
    }
    next()

}

function getTime(){
    var date = new Date();
    var year = date.getFullYear();
        if(year < 1000){
            year += 1900
        }
    var day = date.getDay();
    var month = date.getMonth();
    var daym = date.getDate();
    var dayarray = new Array("Sun.","Mon.","Tue.", "Wed.","Thurs.","Fri.","Sat.");
    var montharray = new Array("Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec.");

    //time
    var time = new Date();
    var hour = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();
}




app.listen(3000)