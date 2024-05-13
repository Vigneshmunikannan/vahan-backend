const express = require('express')
const router = express.Router()
const validateToken=require('../middlewares/validatetoken')
const {
   login,logout,register
} = require("../controllers/authControllers")
const {
   myprofile,
   addstudent,
   getallstudents,
   deletestudent,
   updatestudent
}=require("../controllers/OperationsController")

router.route('/register').post(register);
router.route('/login').post(login);

router.route('/logout').post(validateToken,logout);
router.route('/add-student').post(validateToken,addstudent);
router.route('/myprofile').get(validateToken,myprofile)
router.route('/getallstudents').get(validateToken,getallstudents)
router.route('/delete/:id').delete(validateToken,deletestudent)
router.route('/update/:id').patch(validateToken,updatestudent)


module.exports = router