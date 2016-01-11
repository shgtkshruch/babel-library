var route = require('koa-route');
var home = require('./controller/home');
var book = require('./controller/book');
var account = require('./controller/account');

module.exports = function (app) {

  app.use(route.get('/', home));

  app.use(route.get('/login', account.get));
  app.use(route.post('/login', account.login));
  app.use(route.get('/logout', account.logout));

  app.use(route.post('/book', book.add));
  app.use(route.del('/book', book.del));
}
