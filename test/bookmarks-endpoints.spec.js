const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const supertest = require('supertest')
const { makeBookmarksArray } = require('./bookmarks.fixtures')

describe.only('Bookmarks Endpoints', function() {
    let db

    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
      app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('clean the table', () => db('bookmarks_table').truncate())

    afterEach('cleanup', () => db('bookmarks_table').truncate())

    
    describe(`GET /bookmarks`, () => {
        context(`Given no bookmarks`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/bookmarks')
                    .expect(200, [])
            })
        })
    })
    describe(`GET /bookmarks/:bookmark_id`, () => {
        context(`Given no bookmarks`, () => {
            it(`responds with 404`, () => {
                const bookmarkId = 123456
                return supertest(app)
                    .get(`/bookmarks/${bookmarkId}`)
                    .expect(404, { error: { message: `Bookmark doesn't exist` } })
            })
        })
    })
    
    context('Given there are bookmarks in the db', () => {
        const testBookmarks = makeBookmarksArray()
        beforeEach('insert bookmarks', () => {
            return db
                .into('bookmarks_table')
                .insert(testBookmarks)
        })
        it('GET /bookmarks responds with 200 and all of the bookmarks', () => {
            return supertest(app)
                .get('/bookmarks')
                .expect(200, testBookmarks)
                //TO DO: add more assertions about the body 
        })
        it('GET /bookmarks/:bookmarks_id responds with 200 and the specified bookmark', () => {
            const bookmarkId = 2
            const expectedBookmark = testBookmarks[bookmarkId -1]
            return supertest(app)
                .get(`/bookmarks/${bookmarkId}`)
                .expect(200, expectedBookmark)
        })
    })
})