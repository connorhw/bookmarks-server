require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const BookmarksService = require('./bookmarks/bookmarks-service')

const app = express()
const winston = require('winston');
const jsonParser = express.json()
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
})

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

app.get('/bookmarks', (req, res, next) => {
  const knexInstance = req.app.get('db')
  BookmarksService.getAllBookmarks(knexInstance)
    .then(bookmarks => {
      res.json(bookmarks)
    })
    .catch(next)
})
app.post('/bookmarks', jsonParser, (req, res, next) => {
  const { title, url, description, rating } = req.body
  const newBookmark = { title, url, description, rating }

  for (const [key, value] of Object.entries(newBookmark)) {
    if (value == null) {
      return res.status(400).json({
        error: { message: `Missing '${key}' in request body` }
      })
    }
  }

  BookmarksService.insertBookmark(
    req.app.get('db'),
    newBookmark
  )
  .then(bookmark => {
    res
      .status(201)
      .location(`/bookmarks/${bookmark.id}`)
      .json(bookmark)
  })
  .catch(next)
})

app.get('/bookmarks/:bookmark_id', (req, res, next) => {
  const knexInstance = req.app.get('db')
  BookmarksService.getById(knexInstance, req.params.bookmark_id)
    .then(bookmark => {
      if(!bookmark) {
        return res.status(404).json({
          error: { message: `Bookmark doesn't exist` }
        })
      }
      res.json(bookmark)
    })
    .catch(next)
})

app.use(function errorHandler(error, req, res, next) {
   let response
   if (NODE_ENV === 'production') {
     response = { error: { message: 'server error' } }
   } else {
     console.error(error)
     response = { message: error.message, error }
   }
   res.status(500).json(response)
 })

 const bookmarks = [{
  id: 1,
  title: 'title 1',
  content: 'This is bookmark 1',

}];

const { v4: uuid } = require('uuid');

app.post('/bookmarks', (req, res) => {
  const { title, content } = req.body;

  if (!title) {
    logger.error(`Title is required `);
    return res
      .status(400)
      .send('Invalid data.. title');
  }

  if (!content) {
    logger.error(`Content is required`);
    return res
      .status(400)
      .send('Invalid data.. content')
  }

  const id = uuid();
  const bookmark = {
    id,
    title,
    content
  };

  bookmarks.push(bookmark);
   logger.info(`Bookmark with id ${id} created`);

   res
    .status(201)
    .location(`http://localhost:8000/bookmark/${id}`)
    .json(bookmark);
});

app.delete('/bookmark/:id', (req, res) => {
  const { id } = req.params;
  const bookmarkIndex = bookmarks.findIndex(bi => bi.id == id)

  if(bookmarkIndex === -1) {
    logger.error(`Bookmark with id ${id} not found.`);
    return res
      .status(404)
      .send('Not Found');
  }

  bookmarks.splice(bookmarkIndex, 1);

  logger.info(`Bookmark with id ${id} deleted.`);
  res
    .status(204)
    .end();
});

app.get('/xss', (req, res) => {
  res.cookie('secretToken', '1234567890');
  res.sendFile(__dirname + '/xss-example.html');
});

module.exports = app;