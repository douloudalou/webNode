//jshint esversion:6

// Imports
const express = require('express')
const sql = require('mysql')
const params = require('../../params/params')
const url = require('url')
const { title } = require('process')
const {writeFile} = require('fs')


// Var
const route = express.Router()


// Sql connection
var results = null
var Parents_results = null
var Perceptors_results = null
var Admins_results = null
var Newceptees_results = null
var Newceptors_results = null

var con = sql.createConnection(
    params.SQLconnection
)
con.connect(function (err) {
    if (err) throw err
    wf('Connected!')
})

// Functions
function load(req, res) {
    wf("Current: Dashboard") 
    let Parents_sql = 'SELECT * FROM \`parents\`;'
    con.query(Parents_sql, function (err, result) {
        if (err) throw err
        Parents_results = result
    })
    let Perceptors_sql = 'SELECT * FROM \`perceptors\`;'
    con.query(Perceptors_sql, function (err, result) {
        if (err) throw err
        Perceptors_results = result
    })
    let Admins_sql = 'SELECT * FROM \`admin\`;'
    con.query(Admins_sql, function (err, result) {
        if (err) throw err
        Admins_results = result
    })
    let Newceptees_sql = 'SELECT * FROM \`new perceptees\`;'
    con.query(Newceptees_sql, function (err, result) {
        if (err) throw err
        Newceptees_results = result
    })
    let Newceptors_sql = 'SELECT * FROM \`new perceptors\`;'
    con.query(Newceptors_sql, function (err, result) {
        if (err) throw err
        Newceptors_results = result

        // Render
        res.render('After_login/index.ejs', {
            Newceptees_results: Newceptees_results,
            Newceptors_results: Newceptors_results,
            Admins_results: Admins_results,
            Perceptors_results: Perceptors_results,
            Parents_results: Parents_results,
        })
    })
}

function wf(content) {
    let date = new Date();

    let now  = (new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Singapore' }).format(date));

    writeFile(`NodeConsole.txt`, `{${now}} ${content}\n`, { flag: 'a+' }, err => {
        if (err) throw err
    })
}


// App
route.use(express.urlencoded())
route.use(express.json())

// swimperceptors page
route.get("/", function (req, res) {
    wf('Current: swimperceptors')
    res.render('html_index')
})

// login page
route.get("/admin", function (req, res) {
    wf('Current: Login Page')
    res.render('After_login/login.ejs', {page: 0, error: 0})
})

route.get('/page_not_found', function(req, res) {
    req.flash('page', 'Error 404 Page not found! Contact admins@12345 if you expected to see the page.')
    res.render('After_login/login.ejs', {page: req.flash('page'), error: 0})
})

route.get('/error', function (req, res) {
    req.flash('error', 'Wrong Name or Password! Contact admins@12345 if you expected to see the page.')
    res.render('After_login/login.ejs', {error: req.flash('error'), page: 0})
})

route.post("/login", function (req, res) {
    let name = req.body.email
    let pass = req.body.password
    wf(`input: ${name}, ${pass}`)
    let sql = `Select * from admin`
    con.query(sql, function (err, result) {
        if (err) throw err
        Admins_results = result
        for (let i = 0; i < Admins_results.length; i++) {
            let admin_name = JSON.stringify(Admins_results[i]['User_name']).slice(1, JSON.stringify(Admins_results[i]['User_name']).length-1)
            let admin_password = JSON.stringify(Admins_results[i]['Password']).slice(1, JSON.stringify(Admins_results[i]['Password']).length-1)
            wf(`admin: ${admin_name}, ${admin_password}`)
            if (name == admin_name && pass == admin_password) {
                load(req, res)
            }
            else {
                res.redirect('/error')
            }
        }
    })
})

// main page
route.post('/After/search', function (req, res) {
    let tab = req.body.search_tab
    let title = req.body.search_title
    let item = req.body.search_item
    if (tab == 'tab' || title == 'title' || item == '') {
        wf(`Search error: ${tab}, ${title}, ${item}`)
        load(req, res)
    }
    else {
        let sql = `SELECT * FROM \`${tab}\` Where \`${title}\` like '%${item}%';`
        con.query(sql, function(err, result) {
            if (err) throw err
            results = result
            wf(results)
            if (results.length > 0) {
                res.render('After_login/search/search.ejs', {
                    tab: tab,
                    title: title,
                    results: results
                })  
            }
            else{
                load(req, res)
            }
        })
    }
})

route.post('/After/search/details', function(req, res) {
    let tab = req.body.tab
    let col = req.body.title
    let name = req.body.name
    wf(`tab: ${tab}`)
    wf(`col: ${col}`)
    if (tab=='parents'){
        let Psql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
        con.query(Psql, function (err, result) {
            if (err) throw err
            results = result
            wf(results)
            res.render('After_login/details/parents/parents_details.ejs', {
                results: results
            })
        })
    }
    else if (tab == 'perceptors'){
        let Persql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
        con.query(Persql, function (err, result) {
            if (err) throw err
            Perceptors_results = result
            wf(Perceptors_results)
        })
        let Parent_sql = `SELECT * FROM \`parents\` Where \`Perceptors\` = '${name}';`
        con.query(Parent_sql, function (err, result) {
            if (err) throw err
            Parents_results = result
            wf(Parents_results)
            res.render('After_login/details/perceptors/perceptors_details.ejs', {
                ceptors_results: Perceptors_results,
                rents_results: Parents_results
            })
        })
    }
    else if (tab=='new perceptors'){
        let newceptors_sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
        con.query(newceptors_sql, function (err, result) {
            if (err) throw err
            Perceptors_results = result
        })
        con.query(Parent_sql, function (err, result) {
            if (err) throw err
            Parents_results = result
            wf(Parents_results)
            res.render('After_login/details/perceptors/perceptors_details.ejs', {
                ceptors_results: Perceptors_results,
                rents_results: Parents_results
            })
        })
    }
    else if (tab =='new perceptees'){
        let newceptees_sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
        con.query(newceptees_sql, function (err, result) {
            if (err) throw err
            results = result
            wf(results)
            res.render('After_login/details/newceptees/newceptees_details.ejs', {
                results: results
            })
        })
    }
    else{
        wf(`Search details error: ${tab}, ${col}, ${name}`)
        load(req, res)
    }
})

route.post('/After/paid', function (req, res) {
    let name = req.body.fname
    wf(`Parent: ${name} payment approved`)
    let sql = `UPDATE \`parents\` SET payment = 'paid' WHERE \`Parents\` = '${name}'`
    con.query(sql, function (err, result) {
        if (err) throw err
        wf(`Parent: ${name} payment updated`)
        load(req, res)
    })
})

route.post('/After/unpaid', function (req, res) {
    let name = req.body.fname
    wf(`Notified Parent: ${name}`)

    load(req, res)
})

route.post('/After/transfer_newceptees', function (req, res) {
    let parent = req.body.tparent
    let student = req.body.tstudent
    let contact = req.body.tcontact
    let email = req.body.temail
    wf(parent, student, contact)
    let tsql = `INSERT INTO \`parents\` (\`Parents\`, \`Perceptees\`, \`DOB\`, \`Venue of lesson\`, \`Contact number\`) SELECT \`Parents\`, \`Perceptees\`, \`DOB\`, \`Venue of lesson\`, \`Contact number\` FROM \`new perceptees\` WHERE \`Parents\`='${parent}' AND \`Perceptees\`='${student}' AND \`Contact number\`='${contact}' AND \`Email\`='${email}';`
    con.query(tsql, function (err, result) {
        if (err) throw err
        wf(`Parent: ${parent}, Student: ${student} transfered from new perceptees to parents`)
    })
    let dsql = `DELETE FROM \`new perceptees\` WHERE \`Parents\`='${parent}' AND \`Perceptees\`='${student}' and \`Contact number\`='${contact}' AND \`Email\`='${email}';`
    con.query(dsql, function (err, result) {
        if (err) throw err
        wf(`Parent: ${parent}, Student: ${student} deleted from new perceptees`)

        load(req, res)
    })
})

route.post('/After/transfer_newceptors', function (req, res) {
    let perceptor = req.body.tceptors
    let email = req.body.temail
    let contact = req.body.tcontact
    wf(perceptor, email, contact)
    let tsql = `INSERT INTO \`perceptors\` (\`Perceptors\`, \`DOB\`, \`Venue of lesson\`, \`Contact number\`, \`Remarks\`) SELECT \`Perceptors\`, \`DOB\`, \`Venue of lesson\`, \`Contact number\`, \`Remarks\` FROM \`new perceptors\` WHERE \`Perceptors\`='${perceptor}' AND \`Email\`='${email}' AND \`Contact number\`='${contact}';`
    con.query(tsql, function (err, result) {
        if (err) throw err
        wf(`Perceptor: ${perceptor} transfered from new perceptors to perceptors`)
    })
    let dsql = `DELETE FROM \`new perceptors\` WHERE \`Perceptors\`='${perceptor}' AND \`Email\`='${email}' and \`Contact number\`='${contact}';`
    con.query(dsql, function (err, result) {
        if (err) throw err
        wf(`Perceptor: ${perceptor} deleted from new perceptors`)
    
        load(req, res)
    })
})

route.post('/After/Perceptor_NRIC', function (req, res) {
    let name = req.body.nametors
    let contact = req.body.contactors
    let NRIC = req.body.NRICtors
    let sql = `UPDATE \`perceptors\` SET \`NRIC\` = '${NRIC}' WHERE \`Perceptors\`='${name}' AND \`Contact number\`='${contact}';`
    con.query(sql, function (err, result) {
        if (err) throw err
        wf(`Perceptor: ${name} NRIC: ${NRIC} updated`)
    
        load(req, res)
    })
})

route.post('/After/Perceptor_Num', function (req, res) {
    let name = req.body.nametors
    let contact = req.body.contactors
    let num = req.body.Numtors
    let sql = `UPDATE \`perceptors\` SET \`Num of Perceptees\` = '${num}' WHERE \`Perceptors\`='${name}' AND \`Contact number\`='${contact}';`
    con.query(sql, function (err, result) {
        if (err) throw err
        wf(`Perceptor: ${name} Num of Perceptees: ${num} updated`)
    
        load(req, res)
    })
})

// parents details
route.post('/After/parents_detail', function(req, res) {
    let name = req.body.detailname
    let tab = req.body.tabname
    let col = req.body.colname
    wf('Current: Details page')
    let sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
    con.query(sql, function (err, result) {
        if (err) throw err
        results = result
        wf(results)
        res.render('After_login/details/parents/parents_details.ejs', {
            results: results
        })
    })
})

route.post('/After/parents/special_remarks', function (req, res) {
    let parents_name = req.body.Rparents_name
    let child_name = req.body.Rchild_name
    let child_NRIC = req.body.Rchild_NRIC
    let remarks = req.body.remarks
    wf(parents_name, child_name, child_NRIC, remarks)
})

// perceptors details
route.post('/After/perceptors_detail', function(req, res) {
    let name = req.body.detailname
    let tab = req.body.tabname
    let col = req.body.colname
    wf('Current: Details page')
    let sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
    con.query(sql, function (err, result) {
        if (err) throw err
        Perceptors_results = result
        wf(Perceptors_results)
    })
    let Parent_sql = `SELECT * FROM \`parents\` Where \`Perceptors\` = '${name}';`
    con.query(Parent_sql, function (err, result) {
        if (err) throw err
        Parents_results = result
        wf(Parents_results)
        res.render('After_login/details/perceptors/perceptors_details.ejs', {
            ceptors_results: Perceptors_results,
            rents_results: Parents_results
        })
    })
})

// admins details
route.post('/After/admins_detail', function(req, res) {
    let name = req.body.detailname
    let tab = req.body.tabname
    let col = req.body.colname
    wf('Current: Details page')
    let sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
    con.query(sql, function (err, result) {
        if (err) throw err
        results = result
        wf(results)
        res.render('After_login/details/admins/admins_details.ejs', {
            results: results
        })
    })
})

// newceptees details
route.post('/After/newceptees_detail', function(req, res) {
    let name = req.body.detailname
    let tab = req.body.tabname
    let col = req.body.colname
    wf('Current: Details page')
    let sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
    con.query(sql, function (err, result) {
        if (err) throw err
        results = result
        wf(results)
        res.render('After_login/details/newceptees/newceptees_details.ejs', {
            results: results
        })
    })
})

// newceptors details
route.post('/After/newceptors_detail', function(req, res) {
    let name = req.body.detailname
    let tab = req.body.tabname
    let col = req.body.colname
    wf('Current: Details page')
    let sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
    con.query(sql, function (err, result) {
        if (err) throw err
        Perceptors_results = result
    })
    let Parent_sql = `SELECT * FROM \`parents\` Where \`Perceptors\` = '${name}';`
    con.query(Parent_sql, function (err, result) {
        if (err) throw err
        Parents_results = result
        wf(Parents_results)
        res.render('After_login/details/perceptors/perceptors_details.ejs', {
            ceptors_results: Perceptors_results,
            rents_results: Parents_results
        })
    })
})

// reload
route.post('/After/reload', function(req, res) {
    load(req, res)  
})

module.exports = route