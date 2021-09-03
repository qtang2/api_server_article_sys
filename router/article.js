const express = require('express')

const router = express.Router()

//import multer and path module to analyze data in form-data
const multer = require('multer')
const path = require('path')

//get multer instance, configer with path 
//path is the place where we store the file we receive from client,join function no + , use ',' to seperate different path pieces
const upload = multer({ dest: path.join(__dirname, '../uploads') })

//import use rules mw
const expressJoi = require('@escook/express-joi')

//import article rules
const { add_article_schema, get_article_list_schema, delete_article_schema, get_article_schema, update_article_schema } = require('../schema/article')
    // const { get_article_list_schema1 } = require('../schema/article')

//import article handler
const article_handler = require('../router_handler/article')

//add article router
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)

//get article list router
//change to post method to see if it works,now the problem is client already sent data with id  ,but server side didnt get it 
router.get('/list', expressJoi(get_article_list_schema), article_handler.getArtList)

//delete article by id router
router.get('/delete/:id', expressJoi(delete_article_schema), article_handler.deleteArtById)

//get article by id router
router.get('/:id', expressJoi(get_article_schema), article_handler.getArtById)

//edit article router
router.post('/edit', upload.single('cover_img'), expressJoi(update_article_schema), article_handler.updateArt)

module.exports = router