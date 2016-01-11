var views = require('co-views');
var model = require('../model/book');
var render = views('view', {default: 'jade'});

module.exports = function *() {
  this.body = yield render('index', {
    authenticated: this.session.authenticated,
    csrf: this.csrf,
    books: yield model.find()
  });
}
