const User = require("../models/users-schema");
const UserAbilities = require("../models/UserAbilities");
const Book = require("../models/book-schema");
const Favorite = require("../models/favorites-schema");
const HttpError = require("../models/http-error");
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
      const error = new HttpError(
        "You are not authorized for this operation.",
        403
      );
      return next(error);
    }

    if (!user || !user.canAddBook) {
      const error = new HttpError(
        "You have submitted an unauthorized request.",
        403
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
    console.log(err);
    const error = new HttpError(
      "The book could not be added. Please try again later.",
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

const updateBook = async (req, res, next) => {
  const { name, author, publisher, star, description, image, language, pages } =
    req.body;
  const bookId = req.params.bid;
  try {
    let reqUser = req.user;
    const ability = UserAbilities(reqUser);
    if (ability.cannot("update", "Book")) {
      const error = new HttpError(
        "You are not authorized for this operation.",
        403
      );
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

    let reqUser = req.user;
    const ability = UserAbilities(reqUser);
    if (ability.cannot("delete", "Book")) {
      const error = new HttpError(
        "You are not authorized for this operation.",
        403
      );
      return next(error);
    }

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
    console.log(err);
    const error = new HttpError(
      "The book could not be deleted. Please try again later.",
      500
    );
    return next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users) {
      const error = new HttpError("Could not find users.", 404);
      return next(error);
    }

    let reqUser = req.user;
    const ability = UserAbilities(reqUser);
    if (ability.cannot("read", "User")) {
      const error = new HttpError(
        "You are not authorized for this operation.",
        403
      );
      return next(error);
    }

    res.json({ users: users });
  } catch (err) {
    const error = new HttpError(
      "Failed to fetch users. Please try again.",
      500
    );
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { fullname, email, role } = req.body;
  const userId = req.params.uid;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new HttpError("The user could not be found.", 404);
      return next(error);
    }

    let reqUser = req.user;
    const ability = UserAbilities(reqUser);
    if (!ability.can("update", user)) {
      // It is checked whether the user requesting the req has update authorization for the user trying to update.
      const error = new HttpError(
        "You are not authorized for this operation.",
        403
      );
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
    console.log(err);
    const error = new HttpError(
      "The user could not be updated. Please try again.",
      500
    );
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
      const error = new HttpError(
        "You are not authorized for this operation.",
        403
      );
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
    console.log(err);
    const error = new HttpError(
      "The user could not be deleted. Please try again.",
      500
    );
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
