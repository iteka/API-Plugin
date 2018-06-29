var request = require('request');
var ObjectId = require('mongodb').ObjectID;
const db = require('../controllerts/database');
const Config = require('../config');
var Models = require('../models/models');
var Controller = require('../controllerts/controller');

var Dates = new Date().toISOString();

exports.CreateDemo = function(req, res) {
  var consoleGroup = req.body.consoleGroup, UID = req.body.uid;
    Models.FindNotify(UID, function(err, result) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (result == null) {
      ActivateDemo();
    } else {
      res.send('Демо доступ уже использован');
    }
  });
  function ActivateDemo() {

    Models.FindConsole(consoleGroup, function(err, doc) {// FindConsole
      if (doc === null) {
        console.log(err);
        return res.send('К сожалению все консоли заняты');
      }
                                              console.log("FindConsole: OK");

    Models.updateConsole(doc.id, false, function(err, result) { // резервируем консоль
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
                                              console.log("резервируем консоль: OK");


    Models.UpdateVpncredentials(UID, true, function (err, result) {// UpdateVpncredentials
      if (err){
        console.log(err);
        return res.sendStatus(500);
      }
                                              console.log("UpdateVpncredentials: OK");
      var Dates = new Date().toISOString();
      var EndDate = new Date(new Date().getTime() + (30 * 60 * 1000));
        var Subscripts = {
          "start_date": Dates,
          "end_date": EndDate,
          "active": true,
          "console": ObjectId(req.body.console),
          "consolegroup": ObjectId(req.body.consolegroup),
          "user": ObjectId(UID)
        };
        Models.createSubscript(Subscripts, function(err, result) { // создаем subscriptions
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }
          console.log("Subscripts: OK");
            return res.sendStatus(200);
          })
        })
      })
    })
  }
}


exports.CreateUser = function(req, res) {
  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  request({
      url: `http://localhost:1337/auth/local/register`,
      method: "POST",
      json: {
        "username": req.body.email,
        "email": req.body.email,
        "password": makeid()
      }
    },
    function(err, httpResponse, body) {
      if(err){
        return res.sendStatus(400);
      }
      if(body.message == undefined){
        //  Models.CreateVpnKey(`key${body.user._id}`, Config.url.vpn, function(data) {
        //   res.send(body.jwt);
        // })
        res.send(body.jwt);
      }else {
        console.log(body.message);
        return res.send(body.message);
      }
    })
}
