var amazon = require('amazon-product-api');

var client = amazon.createClient({
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET,
  awsTag: process.env.AWS_TAG
});

module.exports = {
  search: function *(isbn) {
    var res = yield client.itemLookup({
      domain: 'webservices.amazon.co.jp',
      idType: 'ISBN',
      itemId: isbn,
      responseGroup: 'ItemAttributes, Images'
    });

    return {
      isbn: isbn,
      author: res[0].ItemAttributes[0].Author[0],
      title: res[0].ItemAttributes[0].Title[0],
      image: res[0].LargeImage[0].URL[0]
    }
  }
}
