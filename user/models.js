const db = require('../controllerts/database');
const ObjectId = require('mongodb').ObjectID;


module.exports = {
  userFind: (fond, provider, cb) => {
    if(provider == "VK"){
      db.get().collection('users-permissions_user').findOne({ email: fond }, (err, doc) => {
        cb(err, doc);
      })
    }else if(provider == "Telegram"){
      db.get().collection('users-permissions_user').findOne({ socialid: fond }, (err, doc) => {
        cb(err, doc);
      })
    }else {
      cb(null);
    }
  },

  userCreate: (user, cb) =>{
    db.get().collection('users-permissions_user').insert(user, function(err, result) {
      cb(err, result);
    })
  }
}
