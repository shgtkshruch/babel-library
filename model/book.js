'use strict';

var Mongorito = require('mongorito');
var Model = Mongorito.Model;

Mongorito.connect(process.env.MONGOLAB_URI || 'localhost/book');

class Book extends Model {}

module.exports = {
  save: function *(book) {
    var item = new Book(book);
    yield item.save();
  },

  find: function *() {
    return yield Book.all();
  },

  exist: function *(isbn) {
    var res = yield Book.findOne({isbn: isbn});
    return res ? true : false;
  },

  remove: function *(isbn) {
    var book = yield Book.findOne({isbn: isbn});
    yield book.remove();
  }
}
