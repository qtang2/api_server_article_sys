const express = require('express')

const router = express.Router()

const userinfo_handler = require('../router_handler/userinfo')

//import data verify mw
const expressJoi = require('@escook/express-joi')

//import user info verify rules
const { update_userinfo_schema, update_pwd_schema, update_avatar_schema } = require('../schema/user')

router.get('/userinfo', userinfo_handler.getUserInfo)

//update user info router and user verify mw
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handler.updateUserInfo)

//update user pwd router and user verify mw
router.post('/updatepwd', expressJoi(update_pwd_schema), userinfo_handler.updateUserPwd)

//update user avatar and use verify mw
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handler.updateAvatar)

module.exports = router