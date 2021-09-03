//import database module
const db = require('../db/index')

//import bcryptjs module to encode user password
const bcrypt = require('bcryptjs')

//import toke generate module
const jwt = require('jsonwebtoken')

//import config which contains the secret key for generate token
const config = require('../config')

exports.regUser = (req, res) => {
    //get user info from client
    const userinfo = req.body

    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) {
            return res.cc(err)
        }

        //check if username has been taken
        if (results.length > 0) {
            return res.cc("Username already exist")
        }

        //encrypt user password
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)

        //insert user sql 
        const sql = 'insert into ev_users set ?'

        db.query(sql, { username: userinfo.username, password: userinfo.password }, (err, results) => {
            if (err) {
                return res.cc(err)
            }

            if (results.affectedRows !== 1) {
                return res.cc("Register failed, try later")
            }

            res.cc("Register succeed!", 0)
        })
    })
}

exports.login = (req, res) => {
    //default user admin1, pwd 000000
    //get user info
    const userinfo = req.body

    const sqlStr = 'select * from ev_users where username=?'

    db.query(sqlStr, userinfo.username, (err, results) => {
        //sql execute failed
        if (err) return res.cc(err)

        //sql executed, but no results
        if (results.length !== 1) return res.cc("Login failed,user not exist")

        //check if user provided pwd is same as database pwd
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.cc("Login failed, password incorrect")

        //passwords from user and database are same
        //then can generate token to return to user

        //get user info and except user password and profile photo
        const user = {...results[0], password: '', user_pic: '' }

        //generate web token
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })

        res.send({
            status: 0,
            message: "Login succeed!",
            token: 'Bearer ' + tokenStr
        })
    })



}