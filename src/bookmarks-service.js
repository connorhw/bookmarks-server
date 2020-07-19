const BookmarksService = {
    //in this case, knex == db
    getAllBookmarks(knex) {
        //return 'all the articles!!'
        //return Promise.resolve('all the articles!!')
        return knex.select('*').from('bookmarks_table')
    },
    getById(knex, id) {
        return knex.from('bookmarks_table').select('*').where('id', id).first()
    }
    /*
    insertArticle(knex, newArticle) {
        return knex
            .insert(newArticle)
            .into('blogful_articles')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('blogful_articles').select('*').where('id', id).first()
    },
    deleteArticle(knex, id) {
        return knex('blogful_articles')
            .where({id})
            .delete()
    },
    updateArticle(knex, id, newArticleFields) {
        return knex('blogful_articles')
            .where({id})
            .update(newArticleFields)
    },
    */
}

module.exports = BookmarksService
