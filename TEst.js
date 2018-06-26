const express = require('express');
const BodyPparser = require('body-parser');
//var request = require('request');
//const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var db = require('./config/dbconf');
var Controller = require('./controllerts/controller');

var app = express();
app.use(BodyPparser.json());
app.use(BodyPparser.urlencoded({ extended:true }));

app.get('/', function (req, res) {
  res.send('HI API');
})


// app.post('/userdemo', Controller.all);

app.get('/consoles/:id', Controller.findID);
/*-*-*-*-*-*-*-*-*DEMO*-*-*-*-*-*-*-*
app.post('/userdemo', function(req, res) {
  /*---
  Создания VpnKey
  //Читаем ключь
  ---*
  var vpn = {
    "vpnCredentials": "--BEGIN CERTIFICATE--",
    "user": ObjectId(req.uid)
  }

  db.get().collection('vpncredentials').insert(vpn, function(err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    Base.subscriptions(req.body.console, req.body.consolegroup, req.body.uid);
    //-----------sendmail--------->>>
    res.sendStatus(200);
  })
})
*/
app.post('/vpncredentials', Controller.createVpncredentials);

app.post('/subscript', Controller.createSubscript);

/*-*-*-*-*-*-*Процес оплаты*-*-*-*-*
app.post('/PaymentProcess', function (req, res) {
  Base.Rezervconsole();

})


/*---Субскрипшен---
app.post('/sub', function(req, res) {
  var uid = {
    "active": false,
    "console": ObjectId(req.body.console),
    "consolegroup": ObjectId(req.body.consolegroup),
    "user": ObjectID(req.body.id) //[req.body.id],
  };

  db.get().collection('subscriptions').insert(uid, function(err, result) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    }
    res.send(uid);
  })
})
*/

db.connect('mongodb://localhost/IT-API', function (err) {
    if(err){
      return console.log(err);
    }

    app.listen(3000, function () {
      console.log('API Started');
    })
})





// app.post('/reguser', function (req, res) {
// //  var uname = req.email.split('')[0];
//   var user = {
//     "username" : req.email,
//     "email" : req.email,
//     "password" : req.pwd,
//     "provider" : "local",
//     "role" : ObjectId("5b2d0ee0112a44177decff62")
//   }
//
//   db.collection('users-permissions_user').insert(user, function(err, result) {
//     if (err) {
//       console.log(err);
//       res.sendStatus(500);
//     }
//     res.send(user);
//   })
//
// //res.send(user);
// })














//extended
