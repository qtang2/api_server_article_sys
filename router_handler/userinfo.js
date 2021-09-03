//import db module
const db = require('../db/index')

//import bcryptjs to decode user pws from db
const bcrypt = require('bcryptjs')

//get user info handler
exports.getUserInfo = (req, res) => {
    //query for user info
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id=?'

    //before router, already user expressJwt to decode token, which is a user object
    // id, username, nickname, email are included in user obj(except pwd and user_pic)
    //so can get id from req.user.id
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)

        if (results.length !== 1) return res.cc("Get user info fail")

        res.send({
            status: 0,
            message: "Get user info succeed!",
            data: results[0]
        });
    })

}

//update user info handler
exports.updateUserInfo = (req, res) => {

    const sql = 'update ev_users set ? where id=?'

    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err)

        if (results.affectedRows !== 1) return res.cc("Update user info fail")

        res.cc('updated userinfo', 0)
    })

}

//update user pwd handler
exports.updateUserPwd = (req, res) => {
    const sql = 'select * from ev_users where id=?'

    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)

        if (results.length !== 1) return res.cc("User not exist")

        //check if old pwd is correct
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc("Old password is not correct")

        //define update pwd sql
        const sql = 'update ev_users set password=? where id=?'

        //encrypt password
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

        db.query(sql, [newPwd, req.user.id], (err, results) => {
            //exeute sql fail
            if (err) return res.cc(err)

            //execute sql but update fail
            if (results.affectedRows !== 1) return res.cc("Update password fail")

            //update succeed
            res.cc("Updated password!", 0)
        })
    })
}

//update user avatar handler
exports.updateAvatar = (req, res) => {
    const sql = 'update ev_users set user_pic=? where id=?'

    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err)

        if (results.affectedRows !== 1) return res.cc("Update avatar fail")

        res.cc('update avatar', 0)
    })

}