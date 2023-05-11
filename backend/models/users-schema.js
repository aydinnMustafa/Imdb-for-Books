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
      default: "user",
      enum: ["user", "editor", "admin"],
    },
    canAddBook: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
