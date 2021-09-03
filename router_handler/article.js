// /import path module 
const { number, func } = require('@hapi/joi')
const path = require('path')

const db = require('../db/index')

// add article handler
exports.addArticle = (req, res) => {
    //check if req.file is valid data
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc("Must choose cover image")

    //handle article info object
    const articleInfo = {
        ...req.body, //include article title cate_id, content, state, and cate_it
        cover_img: path.join('/uploads', req.file.filename), // path that store cover image
        pub_date: new Date(),
        author_id: req.user.id // author id can be gotten from req.user
    }

    const sql = `insert into ev_articles set ?`
    db.query(sql, articleInfo, (err, results) => {
        if (err) return res.cc(err)

        if (results.affectedRows !== 1) return res.cc("Add article fail")

        res.cc("Add article succeed!", 0)
    })

}

//get article list
exports.getArtList = (req, res) => {
    //req.query includes pagenum pagesize, cete_id state(later two might be empty string)
    //because this request is get request, only query can get all the parameters, not from req.body or req.params
    //defien total number of articles and return object
    let total

    //get total article number
    const sql = `select count(*) as total from ev_articles where (author_id=? and is_delete=0)`
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)

        if (results.length !== 1) return res.cc("No results")

        //get total article number 
        total = parseInt(results[0].total)

        const { cate_id, state, pagenum, pagesize } = req.query

        //pick article items, start from (pagenum-1)*pagesize, and then take pagesize data items
        const startIndex = (pagenum - 1) * pagesize

        //define sql depend on cate_id and state value
        let sql = ``
        if (cate_id === '' && state === '') {
            sql = `select ev_articles.Id, title, pub_date, state, ev_article_cate.name as cate_name from ev_articles left join ev_article_cate on ev_articles.cate_id = ev_article_cate.Id where (author_id=? and ev_articles.is_delete=0) limit ?,?`
        } else if (cate_id === '' && state !== '') {
            sql = `select ev_articles.Id, title, pub_date, state, ev_article_cate.name as cate_name from ev_articles left join ev_article_cate on ev_articles.cate_id = ev_article_cate.Id where (author_id=? and state='${state}' and ev_articles.is_delete=0) limit ?,?`

        } else if (cate_id !== '' && state === '') {
            sql = `select ev_articles.Id, title, pub_date, state, ev_article_cate.name as cate_name from ev_articles left join ev_article_cate on ev_articles.cate_id = ev_article_cate.Id where (author_id=? and cate_id=${cate_id} and ev_articles.is_delete=0) limit ?,?`

        } else {
            sql = `select ev_articles.Id, title, pub_date, state, ev_article_cate.name as cate_name from ev_articles left join ev_article_cate on ev_articles.cate_id = ev_article_cate.Id where (author_id=? and cate_id=${cate_id} and state='${state}' and ev_articles.is_delete=0) limit ?,?`

        }

        db.query(sql, [req.user.id, startIndex, pagesize], (err, results) => {
            if (err) return res.cc(err)

            if (results.length === 0) return res.cc("No article")
                // console.log("results  ", results, total);
            res.send({
                status: 0,
                message: "Get article list succeed!",
                data: results,
                total: total
            })
        })

    })



}

//delete article by id
exports.deleteArtById = (req, res) => {
    const sql = `update ev_articles set is_delete=1 where Id=?`

    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)

        if (results.affectedRows !== 1) return res.cc("Delete article fail")

        res.cc("Delete article succeed!", 0)
    })
}

//get article by id
exports.getArtById = (req, res) => {
    const sql = `select * from ev_articles where Id=?`
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)

        if (results.length !== 1) return res.cc("Get article fail, article not exist")

        res.cc("Get article succeed!", 0)
    })
}

//update article
exports.updateArt = (req, res) => {
    //check if cover_img is valid data
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc("Must choose cover image")

    const newArtInfo = {
        title: req.body.title,
        cate_id: req.body.cate_id,
        content: req.body.content,
        state: req.body.state,
        cover_img: path.join('/uploads', req.file.filename),
    }

    const sql = `update ev_articles set ? where Id=?`

    db.query(sql, [newArtInfo, req.body.Id], (err, results) => {
        if (err) return res.cc(err)

        if (results.affectedRows !== 1) return res.cc("Update article fail")

        res.cc("Update article succeed!", 0)
    })
}

//get cate name based on cate id
function getCateName(cate_id, res) {
    const sql = `select name from ev_article_cate where Id=?`
    db.query(sql, cate_id, (err, results) => {
        if (err) return res.cc(err)

        if (results.length !== 1) return res.cc("Get category fail, no such category")

        console.log("get cate name ", results[0].name);
        return results[0].name

    })
}