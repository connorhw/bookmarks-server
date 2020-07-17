require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const BookmarksService = require('./bookmarks-service')

const app = express()
const winston = require('winston');

//const morganOption = (process.env.NODE_ENV === 'production')
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

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

app.get('/', (req, res) => {
  res.send('Hello, world! Bookmarks-server app is working!')
})
/*
app.get('/bookmarks', (req, res) => {
  res
    .json(bookmarks);
});
*/
app.get('/bookmarks', (req, res, next) => {
  const knexInstance = req.app.get('db')
  //res.send('All bookmarks')
  BookmarksService.getAllBookmarks(knexInstance)
    .then(bookmarks => {
      res.json(bookmarks)
    })
    .catch(next)
})

app.use(function errorHandler(error, req, res, next) {
   let response
   //if (process.env.NODE_ENV === 'production') {
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

app.get('/bookmarks/:id', (req, res) => {
  const { id } = req.params;
  const bookmark = bookmarks.find(b => b.id == id);

  if (!bookmark) {
    logger.error(`Bookmark with id ${id} not found.`);
    return res
      .status(404)
      .send('Bookmark Not Found');
  }

  res.json(bookmark);
})

const { v4: uuid } = require('uuid');

app.post('/bookmark', (req, res) => {
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

module.exports = app;