//import joi module
const joi = require('@hapi/joi')

//define username and password verify rules
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// define object that contains rules used for register and login
exports.reg_login_schema = {
    body: {
        username,
        password
    },
}

//define id, nickname and email verify rules
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

exports.update_userinfo_schema = {
    body: {
        id,
        nickname,
        email
    }

}

//define update password verify rule
exports.update_pwd_schema = {
    body: {
        oldPwd: password,
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}

//define update avatar verify rule 
const avatar = joi.string().dataUri().required()
exports.update_avatar_schema = {
    body: {
        avatar
    }
}