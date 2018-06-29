const config = require('../config');
var request = require('request');
const express = require('express');
var ObjectId = require('mongodb').ObjectID;
var Models = require('../models/models');
const db = require('../controllerts/database');

var Tick = 1;
exports.QiviCheck = function(pid, consoleid, consolegroup, user) {
  var ConsoleID = consoleid,
    Group = consolegroup,
    User = user,
    PayID = pid;
  var timerId = setInterval(function() {

    var options = {
      url: `https://edge.qiwi.com/payment-history/v2/persons/${config.pay.qiwi}/payments?operation=ALL&rows=10`,
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${config.pay.qkey}`,
        'Content-type': 'application/json'
      }
    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);

        var i = 0;
        for (; i < info.data.length; i++) {
          var coment = info.data[i].comment;
          if (coment === PayID) {
            console.log("платеж верный ");
            clearInterval(timerId);
            SuccesPay(ConsoleID, Group, User, PayID);
          } else {
            console.log("не верный ", coment);
          }
        }

      }
      //  return res.sendStatus(500);
    }

    request(options, callback);


    Tick++;
    console.log('Tick', Tick);
    if (Tick === 4) {
      PayID = PayID;
    //  clearInterval(timerId);
    }
    if (Tick === 5) {
      Failed(ConsoleID, Group, User, PayID);
      clearInterval(timerId);
    }
  }, 20000);
}

function SuccesPay(ConsoleID, Group, User, PayID) {
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
          console.log(err);
          return res.sendStatus(500);
        }

        //var payments = {"status": "success"};
        Models.PaymentsUpdate(PayID, "success", function(err, result) {
          if (err) {
            console.error('Payments', err);
            return res.sendStatus(500);
          }

          Models.UpdateVpncredentials(id, true, function(err, result) {
            if (err) {
              console.log(err);
              return res.sendStatus(500);
            }

            console.log("UpdateVpncredentials: success");

          })
        });
      });
    }

function Failed(ConsoleID, Group, User, PayID) {
  Models.PaymentsUpdate(PayID, "failed", function(err, result) {
    if (err) {
      console.error('Payments', err);
    }
    Models.updateConsole(result.id, true, function(err, result) { // освобождаем консоль
      if (err) {
        console.error('updateConsole', err);
      }
      console.info("UpdateConsole: OK")
    });
  });
}
