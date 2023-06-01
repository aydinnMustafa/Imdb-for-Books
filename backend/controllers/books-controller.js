const Book = require("../models/book-schema");
const User = require("../models/users-schema");
const Favorite = require("../models/favorites-schema");
const HttpError = require("../models/http-error");
const addBook = async (req, res, next) => {
  const {
    userId,
    name,
    author,
    publisher,
    star,
    description,
    image,
    language,
    pages,
  } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user || !user.canAddBook) {
      const error = new HttpError(
        "You have submitted an unauthorized request.",
        401
      );
      return next(error);
    }

    const book = new Book({
      name,
      author,
      publisher,
      star,
      description,
      image,
      language,
      pages,
    });

    await book.save();
    user.addedBooks.push(book._id);
    await user.save();
    res.status(201).json({ message: "Book added.", book: book });
  } catch (err) {
    const error = new HttpError(
      "The book could not be added. Please try again later.",
      500
    );
    return next(error);
  }
};

const updateBook = async (req, res, next) => {
  const { name, author, publisher, star, description, image, language, pages } =
    req.body;
  const bookId = req.params.bid;
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, {
      name,
      author,
      publisher,
      star,
      description,
      image,
      language,
      pages,
    });

    if (!updatedBook) {
      const error = new HttpError("The book could not be found.", 404);
      return next(error);
    }
    res.status(200).send("Book updated.");
  } catch (err) {
    const error = new HttpError(
      "The book could not be updated. Please try again.",
      500
    );
    return next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.bid;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      const error = new HttpError(
        "The information of the book to be deleted could not be found.",
        404
      );
      return next(error);
    }
    await Favorite.deleteMany({ bookId: bookId });

    res.status(200).send("Book deleted.");
  } catch (err) {
    const error = new HttpError(
      "The book could not be deleted. Please try again later.",
      500
    );
    return next(error);
  }
};

const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    if (!books) {
      const error = new HttpError("Could not find books.", 404);
      return next(error);
    }
    res.json({ books: books });
  } catch (err) {
    const error = new HttpError(
      "Books could not be brought. Please try again later.",
      500
    );
    return next(error);
  }
};

const getBookById = async (req, res, next) => {
  const bookId = req.params.bid;
  try {
    const book = await Book.findById(bookId);

    if (!book) {
      const error = new HttpError(
        "Could not find a book with the provided ID.",
        404
      );
      return next(error);
    }

    res.json({ book: book });
  } catch (err) {
    next(err);
  }
};

const addFavoriteBook = async (req, res, next) => {
  const { userId, bookId } = req.body;
  const newLike = new Favorite({
    userId,
    bookId,
  });

  Favorite.findOne({ userId: userId, bookId: bookId })
    .then(function (like) {
      if (like) {
        // The book has already been liked
        Favorite.findByIdAndRemove(like._id)
          .then(function () {
            res.json({ liked: false });
          })
          .catch(function (err) {
            const error = new HttpError("Something went wrong.", 500);
            return next(error);
          });
      } else {
        // Create a new like save
        newLike
          .save()
          .then(function () {
            res.json({ liked: true });
          })
          .catch(function (err) {
            const error = new HttpError(
              "Failed to save book to favorites.",
              500
            );
            return next(error);
          });
      }
    })
    .catch(function (err) {
      const error = new HttpError(
        "The book could not be added to favourites. Please try again later.",
        500
      );
      return next(error);
    });
};

const getFavoriteBooks = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      const error = new HttpError("User ID not found.", 404);
      return next(error);
    }

    Favorite.find({ userId: userId })
      .populate("bookId")
      .then(function (results) {
        const books = results.map(function (like) {
          return like.bookId;
        });
        res.json({ favoritebooks: books });
      })
      .catch(function (err) {
        const error = new HttpError(
          "Failed to fetch favourites. Please try again later.",
          500
        );
        return next(error);
      });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Please try again later.",
      500
    );
    return next(error);
  }
};

exports.addBook = addBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;
exports.addFavoriteBook = addFavoriteBook;
exports.getBooks = getBooks;
exports.getFavoriteBooks = getFavoriteBooks;
exports.getBookById = getBookById;
