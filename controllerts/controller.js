var Models = require('../models/models');
var ObjectId = require('mongodb').ObjectID;
var request = require('request');

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
exports.UpdateVpncredentials = function (req, res) {
  Models.UpdateVpncredentials(req.params.id, req.params.val, function (err, result) {
    if (err){
      console.log(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  })
}

exports.NotificationsFind = function (req, res) {
    Models.FindNotify(req.body.user, function (err, result) {
      if (err){
        console.log(err);
        return res.sendStatus(500);
      }
      if(result == null) {
        res.send("null");
      }else {
        res.send(result);
      }

    });
}

exports.FindUser = function (req, res) {
    Models.FindUser(req.body.id, function (err, result) {
      if(err){
        console.log(err);
        return err;
      }
      console.log("GOTOVO");
      return result;
    })
}

exports.CreateDemoHistory = function (req, res) {
  var data = {
    "fingerprint" : req.body.fprint,
    "user" : ObjectId(req.body.uid),
    "createdAt": new Date().toISOString()
  }
    Models.CreateDemoHistory(data, function (err, result) {
      if (err){
        console.log(err);
        return res.sendStatus(500);
      }
      return res.sendStatus(200);
    });
}

exports.CheckDemoHistory = function (req, res) {
    Models.CheckDemoHistory(req.body.uid, function(err, doc) {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      if(doc !== null){//+
        return  res.send(true);
      }else {
        return res.send(false);
      }

  });
}

/* VPN */
exports.CreateVpnKey = function (req, res) {
  Models.CreateVpnKey(req.body.uid, function (err, doc) {
    if(err){
     console.error(err);
     return res.sendStatus(500);
    }
    res.send(doc);
  })
}

exports.GetVpnKey = function (req, res) {
  Models.GetVpnKey(req.body.uid, function (err, doc) {
    if(err){
      console.error(err);
      return res.sendStatus(500);
    }
    var data = {"status": doc.active, "key": doc.vpnCredentials}
    res.send(data);
  })
}
//
