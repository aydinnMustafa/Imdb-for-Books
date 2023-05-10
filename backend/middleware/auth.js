const admin = require("../firebase-config");

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  console.log(token);
  try {
    const decodedToken = admin.auth().verifyIdToken(token);
    console.log(decodedToken);
    if (decodedToken) {
      return next();
    }
    return res.json({ message: "Hatalı token! Onay verilmedi. " });
  } catch (err) {
    return res.json({ message: "Internal Error" });
  }
};
