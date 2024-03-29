const User = require("../models/users-schema");
const UserAbilities = require("../models/UserAbilities");
const Book = require("../models/book-schema");
const Favorite = require("../models/favorites-schema");
const firebase_admin = require("../firebase-config");

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

    let reqUser = req.user;
    const ability = UserAbilities(reqUser);
    if (ability.cannot("create", "Book")) {
      const error = new Error("You are not authorized for this operation.");
      error.code = 403;
      return next(error);
    }

    if (!user || !user.canAddBook) {
      const error = new Error("You have submitted an unauthorized request.");
      error.code = 403;
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
    res.status(201).json({ message: "The book has been successfully added." });
  } catch (err) {
    const error = new Error(
      "The book could not be added. Please try again later."
    );
    error.code = 403;
    return next(error);
  }
};

const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find();
    if (!books) {
      const error = new Error("Could not find books.");
      error.code = 404;
      return next(error);
    }

    res.json({ books: books });
  } catch (err) {
    const error = new Error(
      "Books could not be fetch. Please try again later."
    );
    error.code = 500;
    return next(error);
  }
};

const updateBook = async (req, res, next) => {
  const { name, author, publisher, star, description, image, language, pages } =
    req.body;
  const bookId = req.params.bid;
  try {
    let reqUser = req.user;
    const ability = UserAbilities(reqUser);
    if (ability.cannot("update", "Book")) {
      const error = new Error("You are not authorized for this operation.");
      error.code = 403;
      return next(error);
    }

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
      const error = new Error("The book could not be found.");
      error.code = 404;
      return next(error);
    }
    res
      .status(200)
      .json({ message: "The book has been successfully updated." });
  } catch (err) {
    const error = new Error("The book could not be updated. Please try again.");
    error.code = 500;
    return next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.bid;

    let reqUser = req.user;
    const ability = UserAbilities(reqUser);
    if (ability.cannot("delete", "Book")) {
      const error = new Error("You are not authorized for this operation.");
      error.code = 403;
      return next(error);
    }

    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      const error = new Error(
        "The information of the book to be deleted could not be found."
      );
      error.code = 404;
      return next(error);
    }
    await Favorite.deleteMany({ bookId: bookId });

    res
      .status(200)
      .json({ message: "The book has been successfully deleted." });
  } catch (err) {
    const error = new Error(
      "The book could not be deleted. Please try again later."
    );
    error.code = 500;
    return next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users) {
      const error = new Error("Could not find users.");
      error.code = 404;
      return next(error);
    }

    let reqUser = req.user;
    const ability = UserAbilities(reqUser);
    if (ability.cannot("read", "User")) {
      const error = new Error("You are not authorized for this operation.");
      error.code = 403;
      return next(error);
    }

    res.json({ users: users });
  } catch (err) {
    const error = new Error("Failed to fetch users. Please try again.");
    error.code = 500;
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { fullname, email, role } = req.body;
  const userId = req.params.uid;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("The user could not be found.");
      error.code = 404;
      return next(error);
    }

    let reqUser = req.user;
    const ability = UserAbilities(reqUser);
    if (ability.cannot("update", user)) {
      // It is checked whether the user requesting the req has update authorization for the user trying to update.
      const error = new Error("You are not authorized for this operation.");
      error.code = 403;
      return next(error);
    }

    firebase_admin.auth().updateUser(userId, {
      displayName: fullname,
      email: email,
    });

    user.fullname = fullname;
    user.email = email;
    user.role = role;

    if (user.role === "Admin" && !user.canAddBook) {
      //Edit so that the user can add books if their new role is admin or editor.
      user.canAddBook = true;
    } else if (user.role === "Editor" && !user.canAddBook) {
      user.canAddBook = true;
    } else {
      user.canAddBook = false;
    }

    await firebase_admin.auth().setCustomUserClaims(userId, {
      //Updating the user's role in the token
      role: role,
    });
    await user.save();
    res
      .status(200)
      .json({ message: "The user has been successfully updated." });
  } catch (err) {
    const error = new Error("The user could not be updated. Please try again.");
    error.code = 500;
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { uid } = req.params;

    const selectedUser = await User.findById(uid);
    let reqUser = req.user;
    const ability = UserAbilities(reqUser);
    if (ability.cannot("delete", "User")) {
      const error = new Error("You are not authorized for this operation.");
      error.code = 403;
      return next(error);
    }

    if (selectedUser) {
      firebase_admin.auth().deleteUser(uid);
      await User.findByIdAndDelete(uid);
    }

    res
      .status(200)
      .json({ message: "The user has been successfully deleted." });
  } catch (err) {
    const error = new Error("The user could not be deleted. Please try again.");
    error.code = 500;
    return next(error);
  }
};

const getDashboardData = async (req, res, next) => {
  try {
    const bookCount = await Book.countDocuments();
    const userCount = await User.countDocuments();
    const favoriteBookCount = await Favorite.countDocuments();

    res.status(200).json({bookCount: bookCount, userCount: userCount, favoriteBookCount: favoriteBookCount});
  } catch (err) {
    const error = new Error("The data could not be getting. Please try again.");
    error.code = 500;
    return next(error);
  }
};

exports.addBook = addBook;
exports.getBooks = getBooks;
exports.deleteBook = deleteBook;
exports.updateBook = updateBook;

exports.getUsers = getUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

exports.getDashboardData = getDashboardData;