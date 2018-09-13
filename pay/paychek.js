const config = require('../config');
const request = require('request');
const ObjectId = require('mongodb').ObjectID;
const Models = require('../models/models');
const db = require('../controllerts/database');
const Result = require('./result');


exports.QiviCheck = function(params, TICK) {
  var ConsoleID = params.console;
  var  Group = params.C_group;
  var  User = params.uid;
  var  PayID = params.id;


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
          console.log("ID PAYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY", PayID);
          if (coment == PayID) {
          //  console.log("платеж верный ");
          Result.Succes(ConsoleID, Group, User, PayID);
            clearInterval(timerId);

          } else {
            console.log("не верный ", coment);
          }
        }
      }
    }
request(options, callback);



if(TICK == 10){
  clearInterval(timerId);
  Result.Failed(ConsoleID, Group, User, PayID);
}
TICK++;
console.log('KASPER TICK: ', TICK);
}, 60000);


}
