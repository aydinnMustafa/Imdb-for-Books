const admin = require("../firebase-config");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userId = decodedToken.uid;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Kullanıcı ID geçersiz!';
    } else {
      decodedToken.role = 'user';
      const customToken = await admin.auth().createCustomToken(userId, {role: decodedToken.role});
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
