const {
  saveBookHandler,
  getAllBooksHandler,
  getBookDetailHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    URL: '/books',
    handler: saveBookHandler,
  },
  {
    method: 'GET',
    URL: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    URL: '/books/{bookId}',
    handler: getBookDetailHandler,
  },
  {
    method: 'PUT',
    URL: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
