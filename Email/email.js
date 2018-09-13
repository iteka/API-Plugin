const Config = require('../config');
const moment = require('moment');
const Template = require('./template');
var Models = require('../models/models');
const nodemailer = require('nodemailer');

moment.locale("ru");

let transporter = nodemailer.createTransport({
    host: 'uashared07.twinservers.net',
    port: 465,
  port: ,
  secure: true,
    auth: {
        user: 'remoteplay@igroteka.club', // generated ethereal user
        pass: 'RemotePlay4777' // generated ethereal password
        user: "@igroteka.club",
        pass: ""
    }
});


exports.Sendpwdlogin = function (param) {
  nodemailer.createTestAccount((err, account) => {
      let tmpl = {
          header: "Данные Учетной Записи",
          login: param.login,
          pwd: param.pwd,
          msg: 'ссылка на лк'
      };
      let Mail = {
          from: 'Remoteplay@igroteka.club', // sender address
          subject: 'Данные Учетной Записи 👻 ✔', // Subject line
          to: param.mail,
          text: '',
          html: Template.Inform(tmpl)  //`<b> ${req.body.message} </b>`
        };

        // send mail with defined transport object
        transporter.sendMail(Mail, (error, info) => {
          console.log('infoinfoinfoinfo', info);
          console.log('errorerrorerror ', error);
            if (error) {
                return console.log(error);
            }
            console.log(info.accepted[0]);

        });
   })
}

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
