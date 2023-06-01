const User = require("../models/users-schema");
const HttpError = require("../models/http-error");
const firebase_admin = require("../firebase-config");

const signup = async (req, res, next) => {
  console.log("kayıt olmaya giriyor mu acaba");
  const { _id, fullname, email, role } = req.body;
  let existingUser;
  existingUser = await User.findOne({ email: email });

  if (existingUser) {
    // Firebase zaten mongoDB'ye kullanıcıyı kayıt etmeden önce existingUser kontrolü yapıyor.
    // Fakat google ile girişleri ilk girişte mongoDB'ye kayıt etmemiz gerekirken daha sonraki seferlerde kayıt edersek zaten user olduğu için hata alırız.
    // Bu durumda kayıt fonksiyonunun çalışmaması için existing user kontrolü yapıyoruz.
    return res.send("This user is already registered.");
  } else {
    // Existing user bulunamadı, yeni bir kullanıcı oluşturulacak.
    const createdUser = new User({
      _id,
      fullname,
      email,
      role
    });

    try {
      await createdUser.save();
      console.log("kayıt tamam");
      if (createdUser.role === "Admin" && !createdUser.canAddBook) {
        // kayıt edilen kullanıcı role admin ise kitap ekleme true.
        createdUser.canAddBook = true;
        await createdUser.save();
      }
    } catch (err) {
      console.log(err);
      const error = new HttpError(
        "User registration failed. Please try again.",
        500
      );
      return next(error);
    }
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;
    const userId = req.params.uid;

    // Search user
    const user = await User.findById(userId);

    if (!user) {
      const error = new HttpError("User not found.", 404);
      return next(error);
    }

    firebase_admin.auth().updateUser(userId, {
      displayName: fullname,
      email: email,
      password: password,
    });

    // Update the found user's information with new ones
    user.fullname = fullname;
    user.email = email;

    // Save user
    await user.save();

    res.json({ message: "User update successful." });
  } catch (err) {
    const error = new HttpError(
      "The user could not be updated. Please try again.",
      500
    );
    return next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.json({ users: users });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Kullanıcılar alınamadı. Lütfen tekrar deneyin.",
      500
    );
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { uid } = req.params;

    const selectedUser = await User.findById(uid);

    if (selectedUser) {
      firebase_admin.auth().deleteUser(uid);
      const deletedUser = await User.findByIdAndDelete(uid);
    }

    res.status(200).json({ message: "Kullanıcı başarıyla silindi." });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "The user could not be deleted. Please try again.",
      500
    );
    return next(error);
  }
};

exports.signup = signup;
exports.updateUser = updateUser;
exports.getUsers = getUsers;
exports.deleteUser = deleteUser;
