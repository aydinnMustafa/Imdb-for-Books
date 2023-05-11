const User = require("../models/users-schema");

const signup = async (req, res, next) => {
  const { _id, fullname, email, password } = req.body;

  const createdUser = new User({
    _id,
    fullname,
    email
  });

  try {
    console.log(req.body);
    await createdUser.save();
  } catch (err) {
    const error = new Error("MongoDB kaydı yapılamadı.");
    error.status = 500;
    throw error;
  }
};

exports.signup = signup;
