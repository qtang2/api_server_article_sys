const joi = require('@hapi/joi')

//define article rules
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('posted', 'draft').required()

const pagenum = joi.number().integer().min(1).required()
const pagesize = joi.number().integer().min(2).required()
const list_cate_id = joi.string().allow('')
const list_state = joi.string().valid('posted', 'draft').allow('')

const id = joi.number().integer().min(1).required()

const pagenum1 = joi.string().valid('num', 'page')


exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state
    }
}

exports.get_article_list_schema = {
    query: {
        pagenum,
        pagesize,
        cate_id: list_cate_id,
        state: list_state
    }
}


exports.delete_article_schema = {
    params: {
        id
    }
}

exports.get_article_schema = {
    params: {
        id
    }
}

exports.update_article_schema = {
    body: {
        Id: id,
        title,
        cate_id,
        content,
        state
    }
}