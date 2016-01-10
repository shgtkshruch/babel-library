var serve = require('koa-static');
var route = require('koa-route');
var views = require('co-views');
var koa = require('koa');
var app = koa();

var render = views('views', {default: 'jade'});

app.use(serve('public'));

app.use(route.get('/', function *() {
  this.body = yield render('index');
}));

app.listen(process.env.PORT || 8080);
