var request = require('request');
var ObjectId = require('mongodb').ObjectID;
const db = require('../controllerts/database');
const Config = require('../config');
var Models = require('../models/models');
var Controller = require('../controllerts/controller');

var Dates = new Date().toISOString();


exports.CreateDemo = function(req, res) {
  var consoleGroup = req.body.consoleGroup,
    UID = req.body.uid;

  // Models.CreateVpnKey(`key${UID}`, Config.url.vpn, function(data) {
  //   if(data !== null){
  //       return console.log("ERR --", data);
  //   }
  //   Models.GetVpnKey(`key${UID}`, Config.url.vpn, function(body) {
  //     if (body.err) {
  //       return console.log("ERR --", body);
  //       return res.sendStatus(500);
  //     }
  //
  //     var vpn = {
  //       "vpnCredentials": body,
  //       "user": ObjectId(UID)
  //     };
  //
  //     Models.vpncredentials(vpn, function(err, result) { // создаем юзеру vpncredentials
  //       if (err) {
  //         console.log(err);
  //         return res.sendStatus(500);
  //       }
  //       //  res.send(vpn);
  //     })
  //   })
  // })

  var TestKey = "-----BEGIN CERTIFICATE---MIIFMDCCBBigAwIBAgIJALpzyMTRPPmAMA0GCSqGSIb3DQEBCwUAMIHAMQswCQYD-----END CERTIFICATE-----";

  var vpn = {
    "vpnCredentials": TestKey,
    "user": ObjectId(UID)
  };

  Models.vpncredentials(vpn, function(err, result) { // создаем юзеру vpncredentials
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    console.log("Vpncredentials: OK");
    var Subscripts = {
      "start_date": Dates,
      "end_date": Dates,
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
      Models.FindConsole(consoleGroup, function(err, doc) {
        if (doc === null) {
          console.log(err);
          return res.sendStatus(500);
        }
        console.log("ConsoleGroup: OK");
        Models.updateConsole(doc.id, false, function(err, result) { // резервируем консоль
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }
          console.log("DEMO CREATE: OK");
          res.sendStatus(200);
        })
      })

    })



  });
};

exports.CreateUser = function(req, res) {

  function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 8; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  console.log(req.body);
  request({
      url: `http://localhost:1337/auth/local/register`,
      method: "POST",
      json: {
        "username": req.body.username,
        "email": req.body.email,
        "password": makeid()
      }
    },
    function(err, httpResponse, body) {
      if (httpResponse.statusCode !== 200) {
        console.log("CreateUser Error", httpResponse.statusCode);
        return res.send(httpResponse.statusCode);
      }
      console.log("USERID ", body.user._id);
      console.log("jwt ", body.jwt);
      res.send(body.jwt);
      //   Models.CreateVpnKey(`key${body.user._id}`, Config.url.vpn, function(data) {
      // res.send(body.jwt);
      //  })

    })
}

exports.NotiFy = function (req, res) {



}














//
