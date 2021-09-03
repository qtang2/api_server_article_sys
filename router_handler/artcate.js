//import databse
const db = require('../db/index')

//get categories handler
exports.getArtCates = (req, res) => {
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)

        res.send({
            status: 0,
            message: "Get categories succeed!",
            data: results
        })

    })
}

//add categories handler
exports.addArtCate = (req, res) => {
    //check if cate name or alias exist already
    const sql = `select * from ev_article_cate where name=? or alias=?`
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)

        //check if name or alias is taken, or both are taken
        //if results length is 2
        if (results.length === 2) return res.cc('Category and alias are taken, please change')

        //if results length is 1
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('Category and alias are taken,please change')

        if (results.length === 1 && results[0].name === req.body.name) return res.cc('Category is taken,please change')

        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('Alias is taken,please change')

        //insert cate into db
        const sql = `insert into ev_article_cate set ?`
        db.query(sql, req.body, (err, results) => {
            if (err) return res.cc(err)

            if (results.affectedRows !== 1) return res.cc("Add category fail")

            res.cc("Add category succeed!", 0)
        })
    })

}

//delete categories handler
exports.deleteCateById = (req, res) => {
    //instead of really delete, use update is_delete value
    const sql = `update ev_article_cate set is_delete=1 where id=?`
    db.query(sql, req.params.id, (err, results) => {
        if (err) res.cc(err)

        if (results.affectedRows !== 1) return res.cc("Delete category faile")

        res.cc("Delete category succeed", 0)
    })
}

//get categories handler
exports.getCateById = (req, res) => {
    const sql = `select * from ev_article_cate where id=?`
    db.query(sql, req.params.id, (err, results) => {
        if (err) res.cc(err)

        if (results.length !== 1) return res.cc("Category not exist")

        res.send({
            status: 0,
            message: "Get category succeed!",
            data: results[0]
        })
    })
}

//update categories handler
exports.updateCateById = (req, res) => {
    //check if name or alias is taken by any other data which id is not 3
    const sql = `select * from ev_article_cate where id<>? and (name=? or alias=?)`

    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)

        //if results length is 2
        if (results.length === 2) return res.cc('Category and alias are taken, please change')

        //if results length is 1
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('Category and alias are taken,please change')

        if (results.length === 1 && results[0].name === req.body.name) return res.cc('Category is taken,please change')

        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('Alias is taken,please change')

        const sql = `update ev_article_cate set ? where Id=?`

        db.query(sql, [req.body, req.body.Id], (err, results) => {
            if (err) return res.cc(err)

            if (results.affectedRows !== 1) return res.cc("Update category fail")

            res.cc("Update category succeed!", 0)
        })

    })


}