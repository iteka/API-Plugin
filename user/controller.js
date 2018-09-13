const axios = require('axios');
const Models = require('./models');
const Service = require('./service');
const Checking = require('telegram-checking-authorization');
const { vk } = require('./providers');

module.exports = {
  vkAuth: (req, res, next) => {
    var URL = `https://oauth.vk.com/authorize?client_id=${vk.key}&display=page&redirect_uri=${vk.callback}&scope=email&response_type=code&v=5.84`;
    res.redirect(URL);
  },
  vk_callback: (req, res) => {
    axios.get('https://oauth.vk.com/access_token?', {
        params: {
          "client_id": vk.key,
          "client_secret": vk.secret,
          "redirect_uri": vk.callback,
          "code": req.query.code
        }
      })
      .then(function(response) {
        if (!response.data.email) {
          return res.send(404, { "VK Email ADDRESS": null });
        }
        const email = response.data.email;
        Models.userFind(email, "VK", (err, result) => {
console.log(result);
          if (result === null) {
            axios.get('https://api.vk.com/method/users.get?', {
                params: {
                  "access_token": vk.access,
                  "user_ids": response.data.user_id,
                  "fields": "photo_400_orig",
                  "v": 5.84
                }
              })
              .then(function(response) {
                var Resp = response.data.response[0];
                var User_date = {
                    first_name: Resp.first_name,
                    last_name : Resp.last_name,
                    username  : Resp.first_name,
                    photo     : Resp.photo_400_orig,
                    socid     : Resp.id,
                    email     : email,
                    provider  : "VK"
                }
                Service.UserReg(User_date, (err, result) => {
                  if (err) {
                    return next(err);
                  }
                  let jwt = Service.JWTget(result.ops[0]._id);
                  res.setHeader('Authorization', `Bearer ${jwt}`);
                  res.cookie(token , jwt, {expire : new Date() + 9999});

                  return res.redirect(
                    "https://ps4play.net/profile"
                  );
                  return res.send(200, {
                    "jwt": jwt,
                    "VK REG": result
                  })
                });
              })
              .catch(function(error) {
                console.log(error);
              })
          } else {
          //  res.setHeader('Authorization', `Bearer ${jwt}`);
            // return res.redirect(
            //   "https://ps4play.net/profile"
            // );
              const jwt = Service.JWTget(result._id);
            return res.send(200, {
              "jwt": jwt,
              "VK AUTH": result
            })
          }
        })
      })
      .catch(function(error) {
        res.send(500, { user: "error" });
      })
  },

  SingIn: (req, res) => {
    Models.userFind(req.body.email, (err, result) => {
      if (err) {
        return res.send(500, {
          user: "error"
        });
      }
      if (!result) {
        return res.send(404, {
          "NONE": "EMAIL"
        });
      }
      var jwt = Models.Service(result);
      res.send(200, {
        "jwt": jwt
      });
    })
  },
  Verify: (req, res) => {
    Service.JWTverify(req.body.jwt, (user) => {
      res.send(user);
    });
  },
  telegram: (req, res) => {
    const check = req.query;
    if(Checking(req.query, process.env.BOT_TOKEN)){
      var User_date = {
          first_name: req.query.first_name,
          last_name : req.query.last_name,
          username  : req.query.username,
          socid     : req.query.id,
          photo     : req.query.photo_url,
          email     : "",
          provider  : "Telegram"
      }
      //const jwt = Service.JWTget(req.query.id);
      Models.userFind(User_date.socid, "Telegram", (err, result) => {
          if(result){
            console.log("1111+ ", result);
            let jwt = Service.JWTget(result._id);
            return res.send(200, {"jwt": jwt, "TELEGRAM AUTH - OK": result});
          }else {
            Service.UserReg(User_date, (err, result) => {
              let jwt = Service.JWTget(result.ops[0]._id);
                console.log("TELEGRAM REG:", result);
                // res.cookie('token', jwt, {
                //   maxAge: 900000
                // });
                // return res.redirect(
                //   "http://ps4play.net/"
                // );
              return res.send(200, {"jwt": jwt, "TELEGRAM AUTH - OK": result});
            })
          }
      })

    }
    if(!Checking(req.query, process.env.BOT_TOKEN)){
      return res.send({"RES": "Data is NOT from telegram :("});
    }
  }
}
