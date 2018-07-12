var request = require('request');
var ObjectId = require('mongodb').ObjectID;
const db = require('../controllerts/database');
const Config = require('../config');
var Models = require('../models/models');
var Controller = require('../controllerts/controller');
const moment = require('moment');
const config = require('../config');
var PayCheck = require('../pay/paychek');
var Dates = new Date().toISOString();

exports.CreateDemo = function(req, res) {
  var consoleGroup = req.body.consoleGroup, UID = req.body.uid;
    Models.CheckDemoHistory(UID, function(err, result) {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    if (result == null) {
      ActivateDemo();
    } else {
    return res.send('Демо доступ уже использован');
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
  var uname = req.body.email.split('@')[0];
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

exports.GoToPlay = function (req, res) {
  db.get().collection('subscriptions').findOne({user: ObjectId(req.body.user),  active: true}, function (err, doc) {
    if(err){ return res.sendStatus(500) }
      if(doc === null){
       return res.redirect(200, 'http://162.247.13.110:1337/pay');
     }else {
       db.get().collection('vpncredentials').updateOne({ user: ObjectId(req.body.user) },  { $set:{ active: true }}, function (err, result) {
         if (err){
           console.log(err);
           return res.sendStatus(500);
         }
         if(result.result.nModified === 0){
           console.log("VPN Update : none");
         }else {
           console.log("VPN Update : OK");
         }
         res.sendStatus(200);
       })
      }
    })
};

exports.Paymenthistory = function Paymenthistory(req, res) {
  //var user = "5b2d0f0a112a44177ded0042";
      var user = { user: ObjectId(req.body.user) };
      var payments, paymenttypes, subscriptions;
      var Scrit = "";
      var PayTypes = "";
      db.get().collection('payments').find(user).toArray(function (err, doc) {
        payments = doc;
              Scrit = '{ _id:';
                payments.forEach(function(item, i, payments){
                  Scrit += `ObjectId("${item.subscriptions}"), `;
                });
              Scrit += '}';
          db.get().collection('subscriptions').find(Scrit).toArray(function (err, doc) {
                subscriptions = doc;
            db.get().collection('paymenttypes').find(PayTypes).toArray(function (err, doc) {// ???
               paymenttypes = doc;
                  var x = '[';
                     x += '{';
                    payments.forEach(function(item, i, payments) {
                        x += `"name" : "${GetPaytyp(""+item.paymentType+"").name}",`//"${paymentType.name}",`; GetSript
                        x += `"price" : "${GetPaytyp(""+item.paymentType+"").price}",`;
                        x += `"status" : "${item.status}",`;
                        x += `"active" : "${GetSript(""+item.subscriptions+"").active}",`;
                        x += `"subscriptions" : {`;//moment.utc(y).calendar()
                        x += `"start_date" : "${moment.utc(GetSript(""+item.subscriptions+"").start_date).calendar()}",`;
                        x += `"end_date" : "${moment.utc(GetSript(""+item.subscriptions+"").end_date).calendar()}"`;
                        x += `}`;
                        x += `},`;
                        x += `{`;
                      });
                    x += '}';
                    x += ']';
            res.setHeader('Content-Type', 'application/json');
            res.send(x);
       })
    })
  })

  var GetPaytyp = function (y) {
    var x = "none";
      paymenttypes.forEach(function(item, i, paymenttypes) {
          if(item._id == y){
            x = item;
          }
      })
    return x;
  }
  var GetSript = function (y) {
    var x = "none";
      subscriptions.forEach(function(item, i, subscriptions) {
          if(item._id == y){
            x = item;
          }
      })
    return x;
  }

}

exports.extend = function (req, res) {//купить такую же подписку
  var ConsoleID;
  db.get().collection('subscriptions').findOne({ _id: ObjectId(req.body.subscriptions) }, function (err, doc) {//вытащить инфу о старорй подписке
    var user = doc.user;
    console.log(user);
    Models.FindConsole(doc.consolegroup, function(err, result) {//проверить есть ли свободные консоли в консольгруппе / и вытащить инфу для payments
      if (result == null) {
        Error("ConsoleID Null");
        return res.sendStatus(409, "ConsoleID Null");
      }
      ConsoleID = result.id;
      var Group = doc.consolegroup, paytyp = doc.paytyp;
      if (result === null) {
        Error("FindConsole");
        return res.sendStatus(500, "Console undefined");
      }
      var payments = {
        "status": "processing",
        "consoleGroup": ObjectId(doc.consolegroup),
        "paymentType": ObjectId(doc.paytyp),
        "user": ObjectId(doc.user),
      };
      Models.updateConsole(ConsoleID, false, function(err, result) { // Резервирует консоль
        if (err) {
          Error("updateConsole");
          return res.sendStatus(500);
        }
         Models.Payments(payments, function(err, result) {//создать payments
           if (err) { return res.sendStatus(500);}
            var PayID = result.ops[0]._id;
            console.log(result);
              Models.PaymenTtypes(paytyp, function(err, result) {// вытащить инфу о товаре paytyp
                 if (err) {
                     Error("PaymenTtypes");
                   return res.sendStatus(500);
                 }else if(result == null){
                   return res.sendStatus(409);
                 }
             console.info("UpdateConsole: OK", result);
             PayCheck.QiviCheck(PayID, ConsoleID, Group, user);
           res.send(`https://qiwi.com/payment/form/99?extra%5B%27account%27%5D=${config.pay.qiwi}&amountInteger=${result.price}&extra%5B%27comment%27%5D=${PayID}&currency=643`)
           })
         })
       })
     })
  })

  function Error(info) {
      Models.updateConsole(ConsoleID, true, function(err, result) {
        console.log(409, `Error ${info} - Консоль снята с резерва`);
      })
  }
}




exports.ChangeConsole = function (req, res) {



}
