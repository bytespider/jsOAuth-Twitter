var consumerKey;
var consumerSecret;
var successValue;
var failureValue;

function successCallback(data)
{
    console.log(data);
    successValue = data;
}

function failiureCallback(data)
{
    failureValue = data;
}


describe("Twitter", function() {
    var twitter = new OAuth.Twitter({
        consumerKey: consumerKey,
        consumerSecret: consumerSecret
    });
    
    twitter.oauth.setCallbackUrl('oob');
    
    it('should authenticate a user', function () {
        twitter.authenticate(successCallback, failiureCallback);
        
        waitsFor(function () {
            return twitter.signedIn();
        }, "user to authenticated", 30000);
        
        runs(function () {
            expect(successValue).toBeDefined();
        });
    }); 
});
