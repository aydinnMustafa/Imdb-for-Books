const Book = require("../models/book-schema");
const User = require("../models/users-schema");

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
      return res.status(401).json({ message: "Unauthorized" });
    }

    const book = new Book({
      name,
      author,
      publisher,
      star,
      description,
      image,
      language,
      pages
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

exports.addBook = addBook;
