var trim = require('trim');
var async = require('async');
var parse = require('co-body');
var model = require('../model/book');
var amazon = require('../lib/amazon');

function stringToArray(string) {
  var array = string.split(' ');
  async.forEachOf(array, function (el, i, cb) {
    if (trim(el).length === 0) {
      array.splice(i, 1);
    } else {
      array.splice(i, 1, el);
    }
    cb();
  });
  return array;
}

module.exports = {
  add: function *() {
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
      var book = yield amazon.search(body);
    } catch (err) {
      this.throw(400, 'invalid ISBN');
    }

    book.booklist = stringToArray(book.booklist);

    yield model.save(book);

    this.status = 200;
    this.redirect('/');
  },

  del: function *() {
    var body = yield parse(this);
    yield model.remove(body.isbn);
    this.status = 200;
  },

  update: {
    place: function *() {
      var body = yield parse(this);
      yield model.update.place(body);
      this.status = 200;
    },

    booklist: function *() {
      var body = yield parse(this);
      body.booklist = stringToArray(body.booklist);
      yield model.update.booklist(body);
      this.status = 200;
    }
  }
}
