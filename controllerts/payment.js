const config = require('../config');
var request = require('request');
var Models = require('../models/models');
var PayCheck = require('./paychek.js');
var ObjectId = require('mongodb').ObjectID;
require('console-info');
require('console-warn');
require('console-error');


exports.Qiwi = function(req, res) {
  var uid = req.body.id; Group = req.body.consoleGroup; paytyp = req.body.paytyp;

  Models.FindConsole(Group, function(err, result) {
    if (result === null) {
      console.error('FindConsole', err);
      return res.sendStatus(500);
    }
    console.info("ConsoleGroup: OK");
    var ConsoleID = result.id;
    Models.updateConsole(result.id, false, function(err, result) {
      if (err) {
        console.error('updateConsole', err);
        return res.sendStatus(500);
      }
      console.info("UpdateConsole: OK")

      var payments = {
        "status": "processing",
        "consoleGroup": ObjectId(Group),
        "paymentType": paytyp,
        "user": ObjectId(uid),
      }
      Models.Payments(payments, function(err, result) {
        if (err) {
          console.error('Payments', err);
          return res.sendStatus(500);
        }

        var PayID = result.ops[0]._id;
        Models.PaymenTtypes(paytyp, function(err, result) {
          if (err) {
            console.error('Payments', err);
            return res.sendStatus(500);
          }
          console.info("UpdateConsole: OK", result)
          PayCheck.QiviCheck(PayID, ConsoleID, Group, uid);
          return res.send(`https://qiwi.com/payment/form/99?extra%5B%27account%27%5D=${config.pay.qiwi}&amountInteger=${result.price}&extra%5B%27comment%27%5D=${PayID}&currency=643`)
        })
      })
    })
  })
}
