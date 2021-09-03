const express = require('express')

//import add rules mw
const expressJoi = require('@escook/express-joi')

//import article cate verify rules
const { add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema } = require('../schema/artcate')

//create route instance
const router = express.Router()

//get article handler
const article_handler = require('../router_handler/artcate')

//get all categories route
router.get('/cates', article_handler.getArtCates)

//add category route and user verify rules
router.post('/addcates', expressJoi(add_cate_schema), article_handler.addArtCate)

//delete category by id route and user verify rules
router.get('/deletecate/:id', expressJoi(delete_cate_schema), article_handler.deleteCateById)

//get category by id route and user verify rules
router.get('/cates/:id', expressJoi(get_cate_schema), article_handler.getCateById)

//update category by id route and user verify rules
router.post('/updatecate', expressJoi(update_cate_schema), article_handler.updateCateById)

module.exports = router