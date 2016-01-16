var parse = require('co-body');
var model = require('../model/book');
var amazon = require('../lib/amazon');

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

    yield model.save(book);

    this.status = 200;
  },

  del: function *() {
    var body = yield parse(this);

    try {
      this.assertCSRF(body);
    } catch (err) {
      this.throw(403, 'This CSRF token is invalid.');
    }

    yield model.remove(body.isbn);
    this.status = 200;
  },

  update: {
    place: function *() {
      var body = yield parse(this);

      try {
        this.assertCSRF(body);
      } catch (err) {
        this.throw(403, 'This CSRF token is invalid.');
      }

      yield model.update.place(body);
      this.status = 200;
    },

    booklist: function *() {
      var body = yield parse(this);

      try {
        this.assertCSRF(body);
      } catch (err) {
        this.throw(403, 'This CSRF token is invalid.');
      }

      yield model.update.booklist(body);
      this.status = 200;
    }
  }
}
