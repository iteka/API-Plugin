const config = require('../config');
var request = require('request');
var Models = require('../models/models');
var PayCheck = require('./paychek.js');
var ObjectId = require('mongodb').ObjectID;



exports.Qiwi = function(req, res) {
  var uid = req.body.id; //USER ID
      Group = req.body.consoleGroup; // CONSOLE GROUP ID
      paytyp = req.body.paytyp; // PAYMENT TYPE ID

  Models.FindConsole(Group, function(err, result) { // FIND CONSOLE
    if (result == null) {
      console.log('FindConsole', err);
      return res.sendStatus(406);
    }
    console.log('FindConsole', result);
    var ConsoleID = result.id;
    Models.updateConsole(result.id, false, function(err, result) { // Резервирует консоль
      if (err) {
        console.log('updateConsole', err);
        return res.sendStatus(500);
      }
     console.info("UpdateConsole: OK", result.result);
      var payments = {
        "status": "processing",
        "consoleGroup": ObjectId(Group),
        "paymentType": paytyp,
        "user": ObjectId(uid),
      }
      console.log('payments::: ', payments);
      Models.Payments(payments, function(err, result) {//Создает Payments
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
      //    console.info("UpdateConsole: OK", result);

          let params = {
            "id":PayID,
            "console":ConsoleID,
            "C_group":Group,
            "uid":uid
          }
          PayCheck.QiviCheck(params, 0);
          res.send(`https://qiwi.com/payment/form/99?extra%5B%27account%27%5D=${config.pay.qiwi}&amountInteger=${result.price}&extra%5B%27comment%27%5D=${PayID}&currency=643&successUrl=http://neoich.esy.es/wp-content/uploads/2014/12/%D0%9A%D1%80%D0%B0%D1%81%D0%B0%D0%B2%D1%87%D0%B8%D0%BA.gif&failUrl=https://thumbs.gfycat.com/DeafeningRemarkableIndianglassfish-size_restricted.gif`);
        })
     })
    })
  })
}
