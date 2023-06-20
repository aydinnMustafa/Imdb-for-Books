const Book = require("../models/book-schema");
const Favorite = require("../models/favorites-schema");

const getBooks = async (req, res, next) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 4;

    let skip = (page - 1) * limit;

    const totalBooks = await Book.countDocuments(); // To show the total number of pages on the frontend side
    const pageCount = Math.ceil(totalBooks / limit);

    const books = await Book.find().skip(skip).limit(limit);

    if (!books || books.length === 0) {
      const error = new Error("Could not find books.");
      error.code = 404;
      return next(error);
    }

    res.json({ books: books, pageCount: pageCount });
  } catch (err) {
    const error = new Error(
      "Books could not be fetch. Please try again later."
    );
    error.code = 500;
    return next(error);
  }
};

const getBookById = async (req, res, next) => {
  const bookId = req.params.bid;
  try {
    const book = await Book.findById(bookId);

    if (!book) {
      const error = new Error("Could not find a book with the provided ID.");
      error.code = 404;
      return next(error);
    }

    res.json({ book: book });
  } catch (err) {
    const error = new Error("Book could not be fetch. Please try again later.");
    error.code = 500;
    return next(error);
  }
};

const addFavoriteBook = async (req, res, next) => {
  try {
    const { userId, bookId } = req.body;
    const newLike = new Favorite({ userId, bookId });

    const like = await Favorite.findOne({ userId: userId, bookId: bookId });

    if (like) {
      // The book has already been liked
      await Favorite.findByIdAndRemove(like._id);
      res.json({ liked: false });
    } else {
      // New like save
      await newLike.save();
      res.json({ liked: true });
    }
  } catch (err) {
    const error = new Error("Something went wrong. Please try again.");
    error.code = 500;
    return next(error);
  }
};

const getFavoriteBooks = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      const error = new Error("User ID not found.");
      error.code = 404;
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
    const error = new Error("Something went wrong. Please try again.");
    error.code = 500;
    return next(error);
  }
};

exports.addFavoriteBook = addFavoriteBook;
exports.getBooks = getBooks;
exports.getFavoriteBooks = getFavoriteBooks;
exports.getBookById = getBookById;
