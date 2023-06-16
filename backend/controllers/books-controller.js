const Book = require("../models/book-schema");
const Favorite = require("../models/favorites-schema");
const HttpError = require("../models/http-error");

const getBooks = async (req, res, next) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 4;

    let skip = (page - 1) * limit;

    const totalBooks = await Book.countDocuments(); // To show the total number of pages on the frontend side
    const pageCount = Math.ceil(totalBooks / limit);

    const books = await Book.find().skip(skip).limit(limit);

    if (!books || books.length === 0) {
      const error = new HttpError("Could not find books.", 404);
      return next(error);
    }

    res.json({ books: books, pageCount: pageCount });
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

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const favoriteBooksQuery = Favorite.find({ userId: userId })
      .populate("bookId")
      .skip(skip)
      .limit(limit);

    const countQuery = Favorite.countDocuments({ userId: userId });

    const [favoriteBooks, count] = await Promise.all([
      favoriteBooksQuery.exec(),
      countQuery.exec(),
    ]);

    const pageCount = Math.ceil(count / limit);
    const books = favoriteBooks.map((like) => like.bookId); // Sadece kitapları içeren bir dizi oluşturuyoruz

    res.json({
      favoritebooks: books,
      pageCount: pageCount,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Please try again later.",
      500
    );
    return next(error);
  }
};

exports.addFavoriteBook = addFavoriteBook;
exports.getBooks = getBooks;
exports.getFavoriteBooks = getFavoriteBooks;
exports.getBookById = getBookById;
