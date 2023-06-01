const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // email adreslerinin benzersiz olmasını sağlar. Firebase ilk kayıtta bunu bizim için kontrol ediyor aslında bundan dolayı bizim için pek bir işleve sahip değil.
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Editor", "Admin"],
    },
    canAddBook: {
      type: Boolean,
      default: false,
    },
    addedBooks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
