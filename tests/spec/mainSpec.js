var consumerKey;
var consumerSecret;

describe("Twitter", function() {
    var twitter;
    
    beforeEach(function () {
        twitter = new OAuth.Twitter({
            consumerKey: consumerKey,
            consumerSecret: consumerSecret
        });
    })
});