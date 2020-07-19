const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const supertest = require('supertest')

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

    /*
    describe(`GET /bookmarks`, () => {
        context(`Given no bookmarks`, () => {
            it(`responds with 200 and an empty list`, () => {

            })
        })
    })
    */
    context('Given there are bookmarks in the db', () => {
        const testBookmarks = [
            {
                id: 1,
                title: 'title 1',
                url: 'www.1.com',
                description: 'desc 1',
                rating: 1,
            },
            {
                id: 2,
                title: 'title 2',
                url: 'www.2.net',
                description: 'desc 2',
                rating: 22,
            },
            {
                id: 3,
                title: 'title 3',
                url: 'www.3.org',
                description: 'desc 3',
                rating: 333,
            },
            {
                id: 4,
                title: 'title 4',
                url: 'www.4.edu',
                description: 'desc 4',
                rating: 4444,
            },
        ];
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