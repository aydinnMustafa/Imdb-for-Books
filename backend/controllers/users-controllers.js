const User = require("../models/users-schema");

const signup = async (req, res, next) => {
  const { _id, fullname, email, role } = req.body;
  let existingUser;
  existingUser = await User.findOne({ email: email });

  if (existingUser) {
    // Firebase zaten mongoDB'ye kullanıcıyı kayıt etmeden önce existingUser kontrolü yapıyor.
    // Fakat google ile girişleri ilk girişte mongoDB'ye kayıt etmemiz gerekirken daha sonraki seferlerde kayıt edersek zaten user olduğu için hata alırız.
    // Bu durumda kayıt fonksiyonunun çalışmaması için existing user kontrolü yapıyoruz.
    return res.send("Bu kullanıcı zaten kayıtlı.");
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
      if (createdUser.role === "admin" && !createdUser.canAddBook) { // kayıt edilen kullanıcı role admin ise kitap ekleme true.
        createdUser.canAddBook = true;
        await createdUser.save();       
      }
      next();
     // return res.send("Kullanıcı başarıyla oluşturuldu.");
    } catch (err) {
      const error = new Error("Kullanıcı kaydı yapılamadı.");
      error.status = 500;
      throw error;
    }
  }
};

exports.signup = signup;
