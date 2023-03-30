//jshint esversion:6

// Imports
const express = require('express')
const sql = require('mysql')
const params = require('../../params/params')
const url = require('url')
const {writeFile} = require('fs')
// const fetch = require('node-fetch')

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
    if (err) wf(`err: ${err}`)
    wf('Connected!')
})

// Functions
function load(req, res) {
    wf("Current: Dashboard") 
    let Parents_sql = 'SELECT * FROM \`parents\`;'
    con.query(Parents_sql, function (err, result) {
        if (err) throw `err: ${err}`
        Parents_results = result
        // wf(JSON.stringify(Parents_results))
    })
    let Perceptors_sql = 'SELECT * FROM \`perceptors\`;'
    con.query(Perceptors_sql, function (err, result) {
        if (err) throw err
        Perceptors_results = result
        // wf(JSON.stringify(Perceptors_results))
    })
    let Admins_sql = 'SELECT * FROM \`admin\`;'
    con.query(Admins_sql, function (err, result) {
        if (err) throw `err: ${err}`
        Admins_results = result
        // wf(JSON.stringify(Admins_results))
    })
    let Newceptees_sql = 'SELECT * FROM \`new perceptees\`;'
    con.query(Newceptees_sql, function (err, result) {
        if (err) throw `err: ${err}`
        Newceptees_results = result
        // wf(JSON.stringify(Newceptees_results))
    })
    let Newceptors_sql = 'SELECT * FROM \`new perceptors\`;'
    con.query(Newceptors_sql, function (err, result) {
        if (err) throw `err: ${err}`
        Newceptors_results = result
        // wf(JSON.stringify(Newceptors_results))

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

function login(err, res) {
    if (err == 0) {
        res.render('After_login/login.ejs', {error: 0})
    }
    else {
        res.render('After_login/login.ejs', {error: req.flash('error')})
    }
}

function wf(content) {
    let date = new Date();

    let now  = (new Intl.DateTimeFormat('en-GB', { dateStyle: 'short', timeStyle: 'medium', timeZone: 'Singapore' }).format(date));

    writeFile(`NodeConsole.txt`, `{${now}} ${content}\n`, { flag: 'a+' }, err => {
        if (err) throw `err: ${err}`
    })
}


// App
route.use(express.urlencoded())
route.use(express.json())


// Swimperceptors page
// route.get('/', function (req, res) {
//     wf('Current: Swimperceptors Page')
//     res.render('index.ejs')
// })

// login page
route.get("/admins", function (req, res) {
    wf('Current: Login Page')
    login(0, res)
})

route.get('/admins/error', function (req, res) {
    req.flash('error', 'Wrong Name or Password! Contact admins@12345 if you require assistance')
    login(1, res)
})

route.post("/admins/login", function (req, res) {
    let name = req.body.email
    let pass = req.body.password
    wf(`input: ${name}, ${pass}`)
    let sql = `Select * from admin`
    con.query(sql, function (err, result) {
        if (err) wf(`err: ${err}`)
        Admins_results = result
        for (let i = 0; i < Admins_results.length; i++) {
            let admin_name = JSON.stringify(Admins_results[i]['User_name']).slice(1, JSON.stringify(Admins_results[i]['User_name']).length-1)
            let admin_password = JSON.stringify(Admins_results[i]['Password']).slice(1, JSON.stringify(Admins_results[i]['Password']).length-1)
            wf(`admin: ${admin_name}, ${admin_password}`)
            if (name == admin_name && pass == admin_password) {
                load(req, res)
            }
            else {
                res.redirect('/admins/error')
            }
        }
    })
})

// main page
route.post('/admins/search', function (req, res) {
    let tab = req.body.search_tab
    let col = req.body.search_title
    let name = req.body.search_item
    if (tab == 'tab' || col == 'title' || name == '') {
        wf(`Search error: ${tab}, ${col}, ${name}`)
        load(req, res)
    }
    else {
        wf(`search: ${tab}, ${col}, ${name}`)
        // let sql = `SELECT * FROM \`${tab}\` Where \`${title}\` like '%${item}%';`
        // con.query(sql, function(err, result) {
        //     if (err) wf(`err: ${err}`)
        //     results = result
        //     wf(results)
        //     if (results.length > 0) {
        //         res.render('After_login/search/search.ejs', {
        //             tab: tab,
        //             title: title,
        //             results: results
        //         })  
        //     }
        //     else{
        //         load(req, res)
        //     }
        // })
        if (tab=='parents'){
            let Psql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
            con.query(Psql, function (err, result) {
                if (err) wf(`err: ${err}`)
                results = result
                wf(JSON.stringify(results))
                if (JSON.stringify(results).length <= 2) {
                    wf(`Search details error: ${tab}, ${col}, ${name}`)
                    load(req, res)
                }
                else {
                    res.render('After_login/details/parents/parents_details.ejs', {
                        results: results   
                    })
                }
            })
        }
        else if (tab == 'perceptors'){
            let Persql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
            con.query(Persql, function (err, result) {
                if (err) wf(`err: ${err}`)
                Perceptors_results = result
                wf(JSON.stringify(Perceptors_results))
            })
            let Parent_sql = `SELECT * FROM \`parents\` Where \`Perceptors\` = '${name}';`
            con.query(Parent_sql, function (err, result) {
                if (err) wf(`err: ${err}`)
                Parents_results = result
                wf(JSON.stringify(Parents_results))
                if (JSON.stringify(Parents_results).length <= 2 || JSON.stringify(Perceptors_results).length <= 2) {
                    wf(`Search details error: ${tab}, ${col}, ${name}`)
                    load(req, res)
                }
                else {
                    res.render('After_login/details/perceptors/perceptors_details.ejs', {
                        ceptors_results: Perceptors_results,
                        rents_results: Parents_results
                    })
                }
            })
        }
        else if (tab=='new perceptors'){
            let newceptors_sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
            con.query(newceptors_sql, function (err, result) {
                if (err) wf(`err: ${err}`)
                Perceptors_results = result
                wf(JSON.stringify(Perceptors_results))
            })
            con.query(Parent_sql, function (err, result) {
                if (err) wf(`err: ${err}`)
                Parents_results = result
                wf(JSON.stringify(Parents_results))
                if (JSON.stringify(Parents_results).length <=2 || JSON.stringify(Perceptors_results).length <= 2) {
                    wf(`Search details error: ${tab}, ${col}, ${name}`)
                    load(req, res)
                }
                else {
                    res.render('After_login/details/perceptors/perceptors_details.ejs', {
                        ceptors_results: Perceptors_results,
                        rents_results: Parents_results
                    })
                }
            })
        }
        else if (tab =='leads'){
            let tab = 'new perceptees'
            let newceptees_sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
            con.query(newceptees_sql, function (err, result) {
                if (err) wf(`err: ${err}`)
                results = result
                wf(JSON.stringify(results))
                if (JSON.stringify(results).length < 1) {
                    wf(`Search details error: ${tab}, ${col}, ${name}`)
                    load(req, res)
                }
                else {
                    res.render('After_login/details/newceptees/newceptees_details.ejs', {
                        results: results
                    })
                }
            })
        }
    }
})

// route.post('/admins/search/details', function(req, res) {
//     let tab = req.body.tab
//     let col = req.body.title
//     let name = req.body.name
//     wf(`tab: ${tab}`)
//     wf(`col: ${col}`)
//     if (tab=='parents'){
//         let Psql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
//         con.query(Psql, function (err, result) {
//             if (err) wf(`err: ${err}`)
//             results = result
//             wf(JSON.stringify(results))
//             res.render('After_login/details/parents/parents_details.ejs', {
//                 results: results
//             })
//         })
//     }
//     else if (tab == 'perceptors'){
//         let Persql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
//         con.query(Persql, function (err, result) {
//             if (err) wf(`err: ${err}`)
//             Perceptors_results = result
//             wf(JSON.stringify(Perceptors_results))
//         })
//         let Parent_sql = `SELECT * FROM \`parents\` Where \`Perceptors\` = '${name}';`
//         con.query(Parent_sql, function (err, result) {
//             if (err) wf(`err: ${err}`)
//             Parents_results = result
//             wf(JSON.stringify(Parents_results))
//             res.render('After_login/details/perceptors/perceptors_details.ejs', {
//                 ceptors_results: Perceptors_results,
//                 rents_results: Parents_results
//             })
//         })
//     }
//     else if (tab=='leads'){
//         let newceptors_sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
//         con.query(newceptors_sql, function (err, result) {
//             if (err) wf(`err: ${err}`)
//             Perceptors_results = result
//             wf(JSON.stringify(Perceptors_results))
//         })
//         con.query(Parent_sql, function (err, result) {
//             if (err) wf(`err: ${err}`)
//             Parents_results = result
//             wf(JSON.stringify(Parents_results))
//             res.render('After_login/details/perceptors/perceptors_details.ejs', {
//                 ceptors_results: Perceptors_results,
//                 rents_results: Parents_results
//             })
//         })
//     }
//     else if (tab =='new perceptees'){
//         let newceptees_sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
//         con.query(newceptees_sql, function (err, result) {
//             if (err) wf(`err: ${err}`)
//             results = result
//             wf(JSON.stringify(results))
//             res.render('After_login/details/newceptees/newceptees_details.ejs', {
//                 results: results
//             })
//         })
//     }
//     else{
//         wf(`Search details error: ${tab}, ${col}, ${name}`)
//         load(req, res)
//     }
// })

route.post('/admins/paid', function (req, res) {
    let name = req.body.fname
    wf(`Parent: ${name} payment approved`)
    let sql = `UPDATE \`parents\` SET payment = 'paid' WHERE \`Parents\` = '${name}'`
    con.query(sql, function (err, result) {
        if (err) wf(`err: ${err}`)
        wf(`Parent: ${name} payment updated`)
        load(req, res)
    })
})

route.post('/admins/unpaid', function (req, res) {
    let name = req.body.fname
    wf(`Notified Parent: ${name}`)

    load(req, res)
})

route.post('/admins/transfer_newceptees', function (req, res) {
    let parent = req.body.tparent
    let student = req.body.tstudent
    let contact = req.body.tcontact
    let email = req.body.temail
    wf(`${parent}, ${student}, ${contact}`)
    let data = ""
    let datasql = `SELECT * FROM \`new perceptees\`
    WHERE \`Parents\`='${parent}' AND \`Perceptees\`='${student}' AND \`Contact number\`='${contact}' AND \`Email\`='${email}';`
    con.query(datasql, function (err, result) {
        if (err) wf(`err(datasql): ${err}`)
        data = JSON.stringify(result)
        wf(data)
    })
    let tsql = `INSERT INTO \`parents\` (\`Parents\`, \`Perceptees\`, \`Parent DOB\`, \`Parent NRIC\`, \`Relation\`, \`Venue of lesson\`, \`Contact number\`, \`Email\`, \`Preferred day and time\`, \`Address\`, \`Perceptees NRIC\`, \`Perceptees DOB\`, \`Medical Conditions\`, \`Remarks\`, \`emergency name\`, \`emergency contact\`, \`emergency relation\`) 
    SELECT \`Parents\`, \`Perceptees\`, \`Parent DOB\`, \`Parent NRIC\`, \`Relation\`, \`Venue of lesson\`, \`Contact number\`, \`Email\`, \`Preferred day and time\`, \`Address\`, \`Perceptees NRIC\`, \`Perceptees DOB\`, \`Medical Conditions\`, \`Remarks\`, \`emergency name\`, \`emergency contact\`, \`emergency relation\` FROM \`new perceptees\` 
    WHERE \`Parents\`='${parent}' AND \`Perceptees\`='${student}' AND \`Contact number\`='${contact}' AND \`Email\`='${email}';`
    con.query(tsql, function (err, result) {
        if (err) wf(`err: ${err}`)
        wf(`Parent: ${parent}, Student: ${student} transfered from new perceptees to parents`)
    })
    let dsql = `DELETE FROM \`new perceptees\` WHERE \`Parents\`='${parent}' AND \`Perceptees\`='${student}' and \`Contact number\`='${contact}' AND \`Email\`='${email}';`
    con.query(dsql, function (err, result) {
        if (err) wf(`err: ${err}`)

        load(req, res)
    })
})

// route.post('/admins/drop_newceptees', function (req, res) {
//     let parent = req.body.tparent
//     let student = req.body.tstudent
//     let contact = req.body.tcontact
//     let email = req.body.temail
//     wf(`${parent}, ${student}, ${contact}`)
//     let dsql = `DELETE FROM \`new perceptees\` WHERE \`Parents\`='${parent}' AND \`Perceptees\`='${student}' and \`Contact number\`='${contact}' AND \`Email\`='${email}';`
//     con.query(dsql, function (err, result) {
//         if (err) wf(`err: ${err}`)
//         wf(`Parent: ${parent}, Student: ${student} deleted from new perceptees`)

//         load(req, res)
//     })
// })

route.post('/admins/transfer_newceptors', function (req, res) {
    let perceptor = req.body.tceptors
    let email = req.body.temail
    let contact = req.body.tcontact
    wf(`${perceptor}, ${email}, ${contact}`)
    let data = ""
    let datasql = `SELECT * FROM \`new perceptors\`
    WHERE \`Perceptors\`='${perceptor}' AND \`Email\`='${email}' AND \`Contact number\`='${contact}';`
    con.query(datasql, function (err, result) {
        if (err) wf(`err(datasql): ${err}`)
        data = JSON.stringify(result)
        wf(data)
    })
    let tsql = `INSERT INTO \`perceptors\` (\`Perceptors\`, \`DOB\`, \`NRIC\`, \`register date\`, \`Address\`, \`Venue of lesson\`, \`Contact number\`, \`Email\`, \`Medical Conditions\`, \`Swimming/Coaching experience\`, \`Preferred day and time\`, \`Remarks\`, \`Emergency Contact\`, \`Emergency Name\`, \`Emergency Relation\`) 
    SELECT \`Perceptors\`, \`DOB\`, \`NRIC\`, \`register date\`, \`Address\`, \`Venue of lesson\`, \`Contact number\`, \`Email\`, \`Medical Conditions\`, \`Swimming/Coaching experience\`, \`Preferred day and time\`, \`Remarks\`, \`Emergency Contact\`, \`Emergency Name\`, \`Emergency Relation\` FROM \`new perceptors\` 
    WHERE \`Perceptors\`='${perceptor}' AND \`Email\`='${email}' AND \`Contact number\`='${contact}';`
    con.query(tsql, function (err, result) {
        if (err) wf(`err: ${err}`)
        wf(`Perceptor: ${perceptor} transfered from new perceptors to perceptors`)
    })
    let dsql = `DELETE FROM \`new perceptors\` WHERE \`Perceptors\`='${perceptor}' AND \`Email\`='${email}' and \`Contact number\`='${contact}';`
    con.query(dsql, function (err, result) {
        if (err) wf(`err: ${err}`)
    
        load(req, res)
    })
})

route.post('/admins/drop_newceptors', function (req, res) {
    let perceptor = req.body.tceptors
    let email = req.body.temail
    let contact = req.body.tcontact
    wf(`${perceptor}, ${email}, ${contact}`)
    let dsql = `DELETE FROM \`new perceptors\` WHERE \`Perceptors\`='${perceptor}' AND \`Email\`='${email}' and \`Contact number\`='${contact}';`
    con.query(dsql, function (err, result) {
        if (err) wf(`err: ${err}`)
        wf(`Perceptor: ${perceptor} deleted from new perceptors`)
    
        load(req, res)
    })
})

route.post('/admins/Perceptor_NRIC', function (req, res) {
    let name = req.body.nametors
    let contact = req.body.contactors
    let NRIC = req.body.NRICtors
    let sql = `UPDATE \`perceptors\` SET \`NRIC\` = '${NRIC}' WHERE \`Perceptors\`='${name}' AND \`Contact number\`='${contact}';`
    con.query(sql, function (err, result) {
        if (err) wf(`err: ${err}`)
        wf(`Perceptor: ${name} NRIC: ${NRIC} updated`)
    
        load(req, res)
    })
})

route.post('/admins/Perceptors_up', function (req, res) {
    let name = req.body.nametors
    let contact = req.body.contactors
    let num = parseInt(req.body.num)+1
    let sql = `UPDATE \`perceptors\` SET \`Num of Perceptees\` = '${num}' WHERE \`Perceptors\`='${name}' AND \`Contact number\`='${contact}';`
    con.query(sql, function (err, result) {
        if (err) wf(`err: ${err}`)
        wf(`Perceptor: ${name} Num of Perceptees: ${num} updated`)
    
        load(req, res)
    })
})

route.post('/admins/Perceptors_down', function (req, res) {
    let name = req.body.nametors
    let contact = req.body.contactors
    let num = parseInt(req.body.num)-1
    let sql = `UPDATE \`perceptors\` SET \`Num of Perceptees\` = '${num}' WHERE \`Perceptors\`='${name}' AND \`Contact number\`='${contact}';`
    con.query(sql, function (err, result) {
        if (err) wf(`err: ${err}`)
        wf(`Perceptor: ${name} Num of Perceptees: ${num} updated`)
    
        load(req, res)
    })
})

// parents details
route.post('/admins/After/parents_detail', function(req, res) {
    let name = req.body.detailname
    let tab = req.body.tabname
    let col = req.body.colname
    wf('Current: Details page')
    let sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
    con.query(sql, function (err, result) {
        if (err) wf(`err: ${err}`)
        results = result
        wf(results)
        res.render('After_login/details/parents/parents_details.ejs', {
            results: results
        })
    })
})

route.post('/admins/special_remarks', function (req, res) {
    let parents_name = req.body.Rparents_name
    let ceptees_name = req.body.Rceptees_name
    let remarks = req.body.remarks
    wf(`${parents_name}, ${ceptees_name}, ${remarks}`)
    let sql = `UPDATE \`parents\` SET \`Sremarks\` = '${remarks}' WHERE \`Parents\` = '${parents_name}' AND \`Perceptees\` = '${ceptees_name}';`
    con.query(sql, function (err, result) {
        if (err) wf(`err: ${err}`)
    })
    load(req, res)
})

route.post('/admins/special_remarks_leads', function (req, res) {
    let parents_name = req.body.Rparents_name
    let ceptees_name = req.body.Rceptees_name
    let remarks = req.body.remarks
    wf(`${parents_name}, ${ceptees_name}, ${remarks}`)
    let sql = `UPDATE \`new perceptees\` SET \`Sremarks\` = '${remarks}' WHERE \`Parents\` = '${parents_name}' AND \`Perceptees\` = '${ceptees_name}';`
    con.query(sql, function (err, result) {
        if (err) wf(`err: ${err}`)
    })
    load(req, res)
})

// perceptors details
route.post('/admins/After/perceptors_detail', function(req, res) {
    let name = req.body.detailname
    let tab = req.body.tabname
    let col = req.body.colname
    wf('Current: Details page')
    let sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
    con.query(sql, function (err, result) {
        if (err) wf(`err: ${err}`)
        Perceptors_results = result
        wf(Perceptors_results)
    })
    let Parent_sql = `SELECT * FROM \`parents\` Where \`Perceptors\` = '${name}';`
    con.query(Parent_sql, function (err, result) {
        if (err) wf(`err: ${err}`)
        Parents_results = result
        wf(Parents_results)
        res.render('After_login/details/perceptors/perceptors_details.ejs', {
            ceptors_results: Perceptors_results,
            rents_results: Parents_results
        })
    })
})


// admins details
route.post('/admins/After/admins_detail', function(req, res) {
    let name = req.body.detailname
    let tab = req.body.tabname
    let col = req.body.colname
    wf('Current: Details page')
    let sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
    con.query(sql, function (err, result) {
        if (err) wf(`err: ${err}`)
        results = result
        wf(results)
        res.render('After_login/details/admins/admins_details.ejs', {
            results: results
        })
    })
})

// newceptees details
route.post('/admins/After/newceptees_detail', function(req, res) {
    let name = req.body.detailname
    let tab = req.body.tabname
    let col = req.body.colname
    wf('Current: Details page')
    let sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
    con.query(sql, function (err, result) {
        if (err) throw `err: ${err}`
        results = result
        wf(results)
        res.render('After_login/details/newceptees/newceptees_details.ejs', {
            results: results
        })
    })
})

// newceptors details
route.post('/admins/After/newceptors_detail', function(req, res) {
    let name = req.body.detailname
    let tab = req.body.tabname
    let col = req.body.colname
    wf('Current: Details page')
    let sql = `SELECT * FROM \`${tab}\` Where \`${col}\` = '${name}';`
    con.query(sql, function (err, result) {
        if (err) wf(`err: ${err}`)
        Perceptors_results = result
    })
    let Parent_sql = `SELECT * FROM \`parents\` Where \`Perceptors\` = '${name}';`
    con.query(Parent_sql, function (err, result) {
        if (err) wf(`err: ${err}`)
        Parents_results = result
        wf(Parents_results)
        res.render('After_login/details/newceptors/newceptors_details.ejs', {
            ceptors_results: Perceptors_results,
            rents_results: Parents_results
        })
    })
})

// Invoice
route.post('/admins/invoice', function(req, res) {
    // details
    invoice_details = {
        rents_name: req.body.rents_name,
        ceptees_name: req.body.ceptees_name,
        address: req.body.address
    }
    // details export
    module.exports = {
        invoice_details
    }

    // Invoice url
    // fetch('After_login/invoice.js').then((res) => res.json()).then((data) => wf(data));

    // 
    let easyinvoice = require('easyinvoice')
    let data = require('../../views/After_login/invoice')
    easyinvoice.createInvoice(data, function (result) {
        //The response will contain a base64 encoded PDF file
        fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
    });

    load(req, res)
    wf(`${JSON.stringify(invoice_details)}`)
})

// reload
route.post('/admins/reload', function(req, res) {
    load(req, res)  
})

module.exports = route