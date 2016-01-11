var session = require('koa-session');
var amazon = require('./lib/amazon');
var model = require('./model/book');
var serve = require('koa-static');
var route = require('koa-route');
var views = require('co-views');
var parse = require('co-body');
var csrf = require('koa-csrf');
var koa = require('koa');
var app = koa();

app.keys = ['session secret'];

app.use(session(app));

csrf(app);

var render = views('views', {default: 'jade'});

app.use(serve('public'));

app.use(route.get('/', function *() {
  this.body = yield render('index', {
    authenticated: this.session.authenticated,
    csrf: this.csrf,
    books: yield model.find()
  });
}));

app.use(route.get('/login', function *() {
  this.body = yield render('login', {csrf: this.csrf});
}));

app.use(route.post('/login', function *() {
  var body = yield parse.form(this);

  try {
    this.assertCSRF(body);
  } catch (err) {
    this.throw(403, 'This CSRF token is invalid.');
  }

  if (body.username === process.env.USERNAME && body.password === process.env.PASSWORD) {
    this.session.authenticated = true;
    this.status = 303;
    this.redirect('/');
  } else {
    this.throw(400, 'Username and password don\'t match');
  }
}));

app.use(route.get('/logout', function *() {
  this.session.authenticated = null;
  this.redirect('/');
}));

app.use(route.post('/book', function *() {
  var body = yield parse.form(this);

  try {
    this.assertCSRF(body);
  } catch (err) {
    this.throw(403, 'This CSRF token is invalid.');
  }

  if (yield model.exist(body.isbn)) {
    this.body = 'This book has been registered.';
    return
  }

  try {
    var book = yield amazon.search(body.isbn);
  } catch (err) {
    this.throw(400, 'invalid ISBN');
  }

  yield model.save(book);

  this.status = 200;
  this.redirect('/');
}));

app.listen(process.env.PORT || 8080);
