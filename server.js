// Imports 
const express = require('express')
const path = require('path')
const sql = require('mysql')
const params = require('./params/params')
const flash = require("connect-flash")
const session = require("express-session")
const {engine} = require('express-handlebars')
const {writeFile} = require('fs')

// Var
const app = express()

// Function
function wf(content) {
    let date = new Date();

    let now  = (new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Singapore' }).format(date));

    writeFile(`NodeConsole.txt`, `{${now}} ${content}\n`, { flag: 'a+' }, err => {
        if (err) throw `err: ${err}`
    })
}


// SQL connection
const con = sql.createConnection(params.SQLconnection)

// App
wf(`Starting server...`)
app.set('port', process.env.PORT || 3000)

app.use(session({
    secret: 'Aiss2017b536442.',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        // 1800000
        maxAge: 6000, // 30 minutes
        rolling: true 
    }
}));
app.use(function(req, res, next) {
    if (req.session && req.session.user) {
        var now = new Date().getTime();
        var expiresIn = req.session.cookie.maxAge;
        var lastActivity = req.session.lastActivity || now;
        if (now - lastActivity > expiresIn) {
            req.session.destroy(function(err) {
            if (err) console.log(err);
            res.redirect('/admins');
            });
        } 
        else {
            req.session.lastActivity = now;
            next();
        }
    } 
    else {
        next();
    }
});

app.use(flash())

app.set('views', path.join(__dirname, '/views'))
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

app.use("/", require('./routes/web'))
app.use(express.static(__dirname + '/views'))

app.listen(app.get('port'), function () {
    wf(`Server started: ${app.get('port')}`)
})



