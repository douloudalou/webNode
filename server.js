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
        maxAge: 1800000, // 30 minutes
        rolling: true 
    }
}));

// session 
// function setSessionTimeout(req) {
//     // Clear any existing timeout
//     if (req.session.timeout) {
//       clearTimeout(req.session.timeout);
//     }
    
//     // Set new timeout for 5 minutes
//     req.session.timeout = setTimeout(() => {
//       // Destroy the session and redirect to login page
//         req.session.destroy((err) => {
//             if (err) {
//             wf(`err: ${err}`);
//             } else {
//                 wf(`${req.session.user} timed out`)
//                 res.redirect('/admins');
//             }
//         });
//     }, 5 * 60 * 1000); // 5 minutes in milliseconds
// }
// app.use((req, res, next) => {
//     setSessionTimeout(req);
//     next();
// });

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



