const Book = require("../models/book-schema");
const User = require("../models/users-schema");
const Favorite = require("../models/favorites-schema");

const addBook = async (req, res, next) => {
  const {
    _id,
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
    const userId = _id;
    const user = await User.findById(userId);

    if (!user || !user.canAddBook) {
      return res
        .status(401)
        .json({ message: "You have submitted an unauthorized request." });
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
    console.log("New book added.");
    user.addedBooks.push(book._id);
    await user.save();
    res.status(201).json({ message: "Book added.", book: book });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res
        .status(404)
        .send("The information of the book to be deleted could not be found.");
    }
    await Favorite.deleteMany({ bookId: bookId });

    res.status(200).send("Book deleted");
  } catch (err) {
    next(err);
  }
};

const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    if (!books) {
      throw new HttpError("Could not find books.", 404);
    }
    res.json({ books: books });
  } catch (err) {
    next(err);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);

    if (!book) {
      throw new HttpError("Could not find a book with the provided ID.", 404);
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
        // Daha önce beğenilmiş bir kitap
        Favorite.findByIdAndRemove(like._id)
          .then(function () {
            res.json({ liked: false });
          })
          .catch(function (err) {
            throw err;
          });
      } else {
        // Yeni bir beğeni kaydı oluşturun
        newLike
          .save()
          .then(function () {
            res.json({ liked: true });
          })
          .catch(function (err) {
            throw err;
          });
      }
    })
    .catch(function (err) {
      throw err;
    });
};

const getFavoriteBooks = async (req, res, next) => {
  const { userId } = req.body;
  Favorite.find({ userId: userId })
    .populate("bookId")
    .then(function (results) {
      const books = results.map(function (like) {
        // To distinguish only books from the likes list
        return like.bookId;
      });
      res.json({ favoritebooks: books });
    })
    .catch(function (err) {
      throw err;
    });
};

exports.addBook = addBook;
exports.deleteBook = deleteBook;
exports.addFavoriteBook = addFavoriteBook;
exports.getBooks = getBooks;
exports.getFavoriteBooks = getFavoriteBooks;
exports.getBookById = getBookById;
