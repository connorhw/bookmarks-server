const BookmarksService = {
    //in this case, knex == db
    getAllBookmarks(knex) {
        //return 'all the articles!!'
        //return Promise.resolve('all the articles!!')
        return knex.select('*').from('bookmarks_table')
    },
    getById(knex, id) {
        return knex.from('bookmarks_table').select('*').where('id', id).first()
    },
    
    insertBookmark(knex, newBookmark) {
        return knex
            .insert(newBookmark)
            .into('bookmarks_table')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    
    getById(knex, id) {
        return knex.from('bookmarks_table').select('*').where('id', id).first()
    },
    deleteBookmark(knex, id) {
        return knex('bookmarks_tableles')
            .where({id})
            .delete()
    },
    updateBookmark(knex, id, newBookmarkFields) {
        return knex('bookmarks_table')
            .where({id})
            .update(newBookmarkFields)
    },
    
}

module.exports = BookmarksService
