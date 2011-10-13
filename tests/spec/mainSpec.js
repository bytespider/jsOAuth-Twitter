var consumerKey;
var consumerSecret;

describe("Twitter", function() {
    var twitter = new OAuth.Twitter({
        consumerKey: consumerKey,
        consumerSecret: consumerSecret
    });

    it('should authenticate a user', function () {

        var successCallback = jasmine.createSpy('success');
        var failureCallback = jasmine.createSpy('failure');

        twitter.authenticate(successCallback, failureCallback);

        waitsFor(function () {
            return successCallback.wasCalled || failureCallback.wasCalled;
        }, "user to be authenticated", 30000);

        runs(function () {
            expect(successCallback).toHaveBeenCalled();
            expect(failureCallback).not.toHaveBeenCalled();
        });
    });

    it("should show the user is logged in", function () {
        expect(twitter.signedIn()).toBeTruthy();
    });

    it("should fetch the user's home timeline", function () {
        var successCallback = jasmine.createSpy('success');
        var failureCallback = jasmine.createSpy('failure');

        twitter.homeTimeline(null, successCallback, failureCallback);

        waitsFor(function () {
            return successCallback.callCount > 0 || failureCallback.callCount > 0;
        }, 60000);

        runs(function () {
            expect(successCallback).toHaveBeenCalled();
            expect(failureCallback).not.toHaveBeenCalled();
        });
    });

    var tweets = [
        "jsOAuth http://cl.ly/33eC is a javscript OAuth librabry. Testing the Twitter module",
        "jsOAuth has a new Twitter module http://cl.ly/AhyH",
        "Testing jsOAuth, ignore me for a while",
        "http://cl.ly/AhyH http://cl.ly/33eC jsOAuth rawks"
    ];

    var tweet = tweets[Math.floor(Math.random() * 4)];

    it("should tweet \"" + tweet + "\"", function () {
        var successCallback = jasmine.createSpy('success');
        var failureCallback = jasmine.createSpy('failure');

        twitter.tweet(tweet, successCallback, failureCallback);

        waitsFor(function () {
            return successCallback.callCount > 0 || failureCallback.callCount > 0;
        }, 10000);

        runs(function () {
            expect(successCallback).toHaveBeenCalled();
            expect(failureCallback).not.toHaveBeenCalled();
        });
    });
});
