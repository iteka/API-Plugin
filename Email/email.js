const Config = require('../config');
const moment = require('moment');
const Template = require('./template');
var Models = require('../models/models');

moment.locale("ru");
var api_key = 'key-66547f90a65b40e0628c1474b7b9f037';
var domain = 'sandboxe7727c98441749d3bfa4d60ee54ad86e.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: Config.email.api_key, domain: Config.email.domain});



// exports.SendMail = function (req, res) {
//   Models.FindUser(req.body.id, function (err, result) {
//     if(err){
//       console.log(err);
//       return err;
//     }
//     var data = {
//       from: 'IGROTEKA.Play@igroteka.club',
//       to: result.email, //'kasper.php@gmail.com',
//       subject: req.body.subject,
//       text: req.body.message,
//       html: `<b> ${req.body.message} </b>`
//     };
//
//       mailgun.messages().send(data, function (error, body) {
//         if (error) {
//           res.sendStatus(500);
//         }
//         res.send("OK")
//       });
//   })
// };

exports.SendInfomail = function (req, res) {
   Models.FindUser(req.body.user, function (err, result) {
     if(err){
       return err;
     }

    var tmpl = {
       header: req.body.header,
       login: 'Kasperjsss',
       pwd: 'Kasperr123js',
       msg: req.body.msg
    };

    var data = {
      from: 'IGROTEKA.Play@igroteka.club',
      to: result.email,
      subject: 'Testt',
      text: req.body.message,
      html: Template.Inform(tmpl)  //`<b> ${req.body.message} </b>`
    };

      mailgun.messages().send(data, function (error, body) {
        if (error) {
          res.sendStatus(500);
        }
        res.send("OK")
      });
    });
}








//
//
// exports.Notifikation = function (req, res) {
//   Models.InfoSubscript(req.body.user, function (err, result) {
//     if(err){
//       return err;
//     }
//
//       var end_date = result.end_date;
//       var x = new Date().getDate();
//       var y = new Date(end_date);
//
//
//  var Tim = moment.utc(y).calendar();
//  var Tim2 = moment.utc(y).subtract(x, 'days');
//
//
//
// //console.log('+DEL DATE+* ', date.toString());
// console.log('NORM ', Tim2);
// console.log('t* ', Tim);
//
//     res.sendStatus(200);
//
//   })
// };
//




















//
