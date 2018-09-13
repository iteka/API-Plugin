const config = require('../config');
var request = require('request');
var ObjectId = require('mongodb').ObjectID;
var Models = require('../models/models');
const db = require('../controllerts/database');
const Loger = require('../log/loger');

module.exports = {
    Succes: function (ConsoleID, Group, User, PayID) {
      var Dates = new Date().toISOString();
      var EndDate = new Date(new Date().getTime() + (30 * 60 * 1000));

      var Subscripts = {
        "start_date": Dates,
        "end_date": EndDate,
        "active": true,
        "console": ObjectId(ConsoleID),
        "consolegroup": ObjectId(Group),
        "user": ObjectId(User)
      };
      Models.createSubscript(Subscripts, function(err, doc) {
            if (err) {
              Loger.logger.error(err);
              return res.sendStatus(500);
            }
            Models.PaymentsUpdate(PayID, "success", function(err, result) {
              if (err) {
                Loger.logger.error('Payments', err);
                return res.sendStatus(500);
              }

              Models.UpdateVpncredentials(User, true, function(err, result) {
                if (err) {
                  Loger.logger.error(err);
                  return res.sendStatus(500);
                }
                Loger.logger.info("UpdateVpncredentials: success "+ result);
              })
            });
          });
    },

    Failed: function (ConsoleID, Group, User, PayID) {
    Models.PaymentsUpdate(PayID, "failed", function(err, result) {
      if (err) {
        Loger.logger.error('Payments', err);
      }
      Models.updateConsole(ConsoleID, true, function(err, result) { // освобождаем консоль
        if (err) {
          Loger.logger.error('updateConsole', err);
        }
        Loger.logger.info("UpdateConsole: OK: Failed " + ConsoleID, Group, User, PayID)
      });
    });
  }
}
