//jshint esversion:6

// Imports
const express = require('express')



// Var
const route = express.Router()


// App
route.use("/", require('./home'))

module.exports = route