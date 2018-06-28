var Models = require('../models/models');
var ObjectId = require('mongodb').ObjectID;

var Dates = new Date().toISOString();

exports.all = function (req, res) {
    Console.all(function (err, docs) {
      if(err){
        console.log(err);
        return res.sendStatus(500);
      }
      res.send(docs);
    })
}

exports.FindConsole = function (req, res) {
  console.log(req.body.id);
    Models.FindConsole(req.body.id, function (err, doc) {
      if(err){
        console.log(err);
        return res.sendStatus(500);
      }
      res.send(doc);
    })
}

exports.findID = function (req, res) {
    Models.findID(req.params.id, function (err, doc) {
      if(err){
        console.log(err);
        return res.sendStatus(500);
      }
      res.send(doc);
    })
}

exports.createSubscript = function (req, res) {
  var Subscripts = {
    "start_date" : Dates,
    "end_date" : Dates,
    "active": false,
    "console": ObjectId(req.body.console),
    "consolegroup": ObjectId(req.body.consolegroup),
    "user": ObjectId(req.body.id)
  };
    Models.createSubscript(Subscripts, function (err, result) {
      if (err){
        console.log(err);
        return res.sendStatus(500);
      }
      res.send(Subscripts);
    });
}

exports.createVpncredentials = function (req, res) {
  var vpn = {
    "vpnCredentials": "--BEGIN CERTIFICATE--",
    "user": ObjectId(req.uid)
  }
  Models.vpncredentials(vpn, function (err, result) {
    if (err){
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(vpn);
  })
}

exports.updateConsole = function (req, res) {
  Models.updateConsole(req.params.id, false, function (err, result) {
    if (err){
      console.log(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  })
}













//
