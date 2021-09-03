const express = require('express')
const joi = require('@hapi/joi')

const app = express()

//import middlewares
const cors = require('cors')

//configure middlewares
app.use(cors())

//analyze req.body form data but only support x-www-form-encoded
app.use(express.urlencoded({ extended: false }))

//set res.cc function to handle errors, need to be declared before router
app.use((req, res, next) => {
    res.cc = (err, status = 1) => {
        //status defualt value is 1 which means fail
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

//before router ,config analyze token mw
const expressJWT = require('express-jwt')
const config = require('./config')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

// import and use user router 
const userRouter = require('./router/user')
app.use('/api', userRouter)

// import and use userinfo router 
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

//import and user article category router
const articleCateRouter = require('./router/artcate')
app.use('/my/article', articleCateRouter)

//import and user article router
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)

//configure static resources
app.use('/uploads', express.static('./uploads'))

//defire error catch mw
app.use((err, req, res, next) => {

    //Verify failed
    if (err instanceof joi.ValidationError) return res.cc(err)

    //Authorize failed
    if (err.name === "UnauthorizedError") return res.cc("Authorization fail")

    //Unknown error
    res.cc(err)
})

app.listen(3007, () => {
    console.log("server running at http://127.0.0.1:3007");
})