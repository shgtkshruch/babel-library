var _ = require('lodash');
var views = require('co-views');
var model = require('../model/book');
var render = views('view', {default: 'jade'});

module.exports = function *() {
  var booklist = [];
  var books = yield model.find();

  books.forEach(function (book) {
    booklist.push(book.attributes.booklist);
  });

  this.body = yield render('index', {
    authenticated: this.session.authenticated,
    csrf: this.csrf,
    books: books,
    booklist: _(booklist).flatten().uniq()
  });
}
