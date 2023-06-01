const admin = require("../firebase-config");
const User = require("../models/users-schema");
const HttpError = require("../models/http-error");

const auth = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res.status(401);
    res.json({ error: "There is no Authorization header." });
    return false;
  }
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    if (decodedToken.role) {
      const user = await User.findOne({ _id: decodedToken.user_id });
      if (user.role === decodedToken.role) {
        // The token contains role information and matches the role information in the User database. (Verification successful.)
        return next();
      } else {
        // The token role does not match the one in the database.
        res.status(401);
        console.log(error);
        res.json({ error: "You are not authorized." });
        return false;
      }
    } else {
      // Since it is a new registration, the token does not have a role. By default, we add the User role to the user token.
      const userRecord = await admin.auth().getUser(decodedToken.user_id);

      const currentClaims = userRecord.customClaims || {};
      await admin.auth().setCustomUserClaims(decodedToken.user_id, {
        ...currentClaims,
        role: "User",
      });
      res.status(200).json({ message: "Added role to token." });
      return next();
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = auth;
