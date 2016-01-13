var amazon = require('amazon-product-api');

var client = amazon.createClient({
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET,
  awsTag: process.env.AWS_TAG
});

module.exports = {
  search: function *(book) {
    var res = yield client.itemLookup({
      domain: 'webservices.amazon.co.jp',
      idType: 'ISBN',
      itemId: book.isbn,
      responseGroup: 'ItemAttributes, Images'
    });

    return {
      isbn: book.isbn,
      author: res[0].ItemAttributes[0].Author[0],
      title: res[0].ItemAttributes[0].Title[0],
      image: res[0].LargeImage[0].URL[0],
      price: res[0].ItemAttributes[0].ListPrice[0].Amount[0],
      publisher: res[0].ItemAttributes[0].Publisher[0],
      publicationDate: res[0].ItemAttributes[0].PublicationDate[0],
      place: book.place
    }
  }
}
