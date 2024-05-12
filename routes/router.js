const express = require('express')
const router = express.Router()
const validateToken=require('../middlewares/validatetoken')
const {
   login,logout,register
} = require("../controllers/authControllers")

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(validateToken,logout);



module.exports = router