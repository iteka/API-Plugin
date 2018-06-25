var ObjectId = require('mongodb').ObjectID;
var db = require('../config/dbconf');
var Models = require('../Models/Models');
var Controller = require('../controllerts/controller');

var Dates = new Date().toISOString();

// User ID = console_ID = consolegroup;
exports.CreateDemo = function(req, res) {
  var IDconsole = req.body.console, UID = req.body.UID;
  var vpn = {
    "vpnCredentials": "--BEGIN CERTIFICATE--",
    "user": ObjectId(UID)
  };
  var Subscripts = { // формируем Subscripts
    "start_date": Dates,
    "end_date": Dates,
    "active": true,
    "console": ObjectId(req.body.console),
    "consolegroup": ObjectId(req.body.consolegroup),
    "user": ObjectId(UID)
  };

  Models.vpncredentials(vpn, function(err, result) { // создаем юзеру vpncredentials
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    //  res.send(vpn);
  })

  Models.createSubscript(Subscripts, function(err, result) {// создаем subscriptions
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    //  res.send(Subscripts);
  })

  Models.update(IDconsole, cetch, function(err, result) {// резервируем консоль
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  })

};
