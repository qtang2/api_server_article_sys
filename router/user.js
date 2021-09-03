const express = require('express')

const router = express.Router()

//import router handler
const user_handler = require('../router_handler/user')

//import verify middleware
const expressJoi = require('@escook/express-joi')

//import verify rules object, but only need reg_login_schema attri, so destructured
const { reg_login_schema } = require('../schema/user')


//register user router
// do not call the regUser or login function at this stage
router.post('/reguser', expressJoi(reg_login_schema), user_handler.regUser)

//login router
router.post('/login', expressJoi(reg_login_schema), user_handler.login)

module.exports = router