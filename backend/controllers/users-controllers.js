const User = require("../models/users-schema");
const UserAbilities = require("../models/UserAbilities");
const HttpError = require("../models/http-error");

const signup = async (req, res, next) => {
  
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
      role,
    });

    try {
      await createdUser.save();
     
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
    const { fullname, email } = req.body;
    const userId = req.params.uid;

    // Search user
    const user = await User.findById(userId);

    if (!user) {
      const error = new HttpError("User not found.", 404);
      return next(error);
    }

    const ability = UserAbilities(user);
    if (ability.cannot('update', user)) {      // It is checked whether the user requesting the req has update authorization for the user trying to update.
      const error = new HttpError(
        "You are not authorized for this operation.",
        403
      );
      return next(error);
    }
    
    // Update the found user's information with new ones
    user.fullname = fullname;
    user.email = email;

    // Save user
    await user.save();

    res.json({ message: "User update successful" });
  } catch (err) {
    const error = new HttpError(
      "The user could not be updated. Please try again.",
      500
    );
    return next(error);
  }
};





exports.signup = signup;
exports.updateUser = updateUser;

