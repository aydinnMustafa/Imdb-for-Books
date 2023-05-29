const admin = require("../firebase-config");
const User = require('../models/users-schema');

const auth = async (req, res, next) => {
  try {
    const { _id } = req.body;
    
    if (!req.body._id) {
      throw 'User ID not found!';
    } else {
      const user = await User.findOne({ _id: _id });
      if (!user) {
        throw "User not found!";
      }
      const role = user.role || "User";
     

    const token = req.headers.authorization.split(" ")[1];
    try{
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      const userRecord = await admin.auth().getUser(_id);
      const currentClaims = userRecord.customClaims || {};

      const newClaims = { role: role };
           
      await admin.auth().setCustomUserClaims(_id, {...currentClaims, ...newClaims});          
        
        console.log("ONAY BAŞARILI");
        res.status(200).json({token: token});
    }catch(err){
      console.log(err);
    }
    
      
    }
  } catch (err){
    res.status(401).json({
      error: new Error('Request başarısız.')
    });
  }
};

module.exports = auth;
