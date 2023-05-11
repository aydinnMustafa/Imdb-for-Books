const admin = require("../firebase-config");
const User = require('../models/users-schema');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Kullanıcı ID geçersiz!';
    } else {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        throw "Kullanıcı bulunamadı!";
      }
      const role = user.role || "user";
      const customToken = await admin.auth().createCustomToken(userId, {role: role});
      console.log("ONAY BAŞARILI");
      res.status(200).json({token: customToken});
      
    }
  } catch {
    res.status(401).json({
      error: new Error('Request başarısız.')
    });
  }
};

module.exports = auth;
