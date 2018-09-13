const User        = require('../user/controller');
const Pay         = require('../pay/payment');
const Services    = require('../services/services');
const Controller  = require('../controllerts/controller');

module.exports = app => {
  app.get('/', function (req, res) {
    res.redirect('https://ps4play.net/');
  });

  app.post('/createuser', Services.CreateUser); // email = > jwt
  app.post('/createdemo', Services.CreateDemo); // uid | consoleGroup => 200
  app.post('/gotoplay', Services.GoToPlay);//uid => 200
  app.post('/createdemoHistory', Controller.CreateDemoHistory);// fprint | uid => 200
  app.get('/checkdemohistory/:uid/:fprint', Controller.CheckDemoHistory); // uid => true | false
  app.post('/paymenthistory', Services.Paymenthistory); // uid = > name / price / status / active / subscriptions { start_date/ end_date }
  app.post('/extendpay', Services.extend);//купить такую же подписку subscriptions => https://qiwi.com/payment/
  app.get('/getovpkey', Controller.GetVpnKey);// User id => status, key
  app.post('/payqiwi', Pay.Qiwi);
  app.get('/version/:ver', Controller.Version);
  app.get('/paystatus', Controller.paystatus);

//*** Auth ***//
  app.get('/user/vk/callback?:code?:access_token?:expires_in?:user_id?:email', User.vk_callback);
  app.get('/auth/vk', User.vkAuth);
  app.get('/user/telegram', User.telegram);

}
