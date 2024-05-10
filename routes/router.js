const express = require('express')
const router = express.Router()
const {
   check
} = require("../controllers/controllers")

router.route('/check').get(check)

module.exports = router