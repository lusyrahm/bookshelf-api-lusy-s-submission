const { nanoid } = require('nanoid');
const books = require('./books');
/*API can save book */
const saveBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  if (name && readPage <= pageCount) {
    books.push(newBook);
  }

  const isSuccess = books.filter((book) => book.id === id && name !== '');

  /* Failed response if client doesn't attach name property in request body */
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
    /* Failed if readPage > pageCount */
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
    /* Success response */
  } else if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

/* API can show all books */
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let newBooks = [];

  if (name) {
    newBooks = books.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase()))
      .map(
        ({ id, name, publisher }) => ({
          id, name, publisher,
        }),
      );
  } else if (reading) {
    newBooks = books.filter((book) => book.reading == reading).map(
      ({ id, name, publisher }) => ({
        id, name, publisher,
      }),
    );
  } else if (finished) {
    newBooks = books.filter((book) => book.finished == finished).map(
      ({ id, name, publisher }) => ({
        id, name, publisher,
      }),
    );
  } else {
    newBooks = books.map(({ id, name, publisher }) => ({
      id, name, publisher,
    }));
  }
  const response = h.response({
    status: 'success',
    data: {
      books: newBooks,
    },
  });

  response.code(200);
  return response;
};

/* API can show book details */
const getBookDetailHandler = (request, h) => {
  const { bookId } = request.params;

  const book = books.filter((b) => b.id === bookId)[0];

if (book !== undefined) {
  const response = h.response({
    status: 'success',
    data: {
      book: book,
    },
  });

response.code(200);
return response;
};

const response = h.response({
  status: 'fail',
  message: 'Buku tidak ditemukan',
});

response.code(404);
return response;
};

/* API can edit book data */
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const bookIndex = books.findIndex((book) => book.id === bookId);

if (bookIndex !== -1) {
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',  
  });
  response.code(200);
  return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

/* API can delete books by id */
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { 
  saveBookHandler,
  getAllBooksHandler,
  getBookDetailHandler,
  editBookByIdHandler,
  deleteBookByIdHandler
};
