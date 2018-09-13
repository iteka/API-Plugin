const Models   = require('./models');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const ObjectId = require('mongodb').ObjectID;
const Mail     = require('../Email/email');

module.exports = {
  UserReg: async (UD, cb) => {
    function genpass() {
      var pass = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 8; i++)
        pass += possible.charAt(Math.floor(Math.random() * possible.length));
      return pass;
    }
    var sendpass = genpass();
    const pass = await bcrypt.hash(sendpass, 10);

    var user = {
          "username": UD.first_name,
          "password": pass,
          "email": UD.email,
          "role": ObjectId("5b2d0ee0112a44177decff62"),
          "provider": UD.provider,
          "first_name": UD.first_name,
          "last_name": UD.last_name,
          "socialid": UD.socid,
          "image": {
              "url": UD.photo
          }
        };
    Models.userCreate(user, (err, result) => {
      if(UD.provider === "local"){
        let param = {login: UD.first_name, mail: UD.email, pwd:sendpass }
        console.log("MAILLLLL", param);
        Mail.Sendpwdlogin(param);
      }
      cb(err, result);
    })


  },
  JWTgetUid: (req) => {
    const token = req.headers.authorization.split("Bearer ")[1];
    const uid = jwt.verify(token, process.env.JWT_SECRET)._id;
    return uid;
  },
  JWTget: (Email) => {
    var token = jwt.sign({ Email }, process.env.JWT_SECRET);
    return token;
  },
  JWTverify: (token) => {
    var user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  },
  hashPassword: (pass, cb) => {
      if (!pass || this.isHashed(pass)) {
        cb(null);
      } else {
        bcrypt.hash(pass, 10, (err, hash) => {
          cb(hash);
        });
      }
  },
  isHashed: (pass) => {
    if (typeof pass !== 'string' || !pass) {
      return false;
    }
    return pass.split('$').length === 4;
  },
  validatePassword: (password, hash) => {
    return bcrypt.compareSync(password, hash);
  }
}
