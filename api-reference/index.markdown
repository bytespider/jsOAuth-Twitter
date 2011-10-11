---
layout: reference
title: "API Reference"
description: "API reference guide and manual"
---

#Overview#

##Example##
{% highlight javascript linenos %}

var twitter = OAuth.Twitter({
    consumerKey: "MyConsumerKey",
    consumerSecret: "MyConsumerSecret"
});

function fetchUserTimeline()
{
    twitter.homeTimeline(null, fetchUserTimeline.success, fetchUserTimeline.failure);
}

fetchUserTimeline.success = function (data) {
    var i, len = data.length, tweet;
    for (i = 0; i < len; i++)
    {
        tweet = data[i];
        displayTweet(tweet);
    }
};

fetchUserTimeline.failure = function (data) {
    notify("Failed to fetch user's timeline");
};

if (twitter.signedIn() === true)
{
    fetchUserTimeline();
}
else
{
    function failedAuthentication()
    {
        twitter.authenticate(fetchUserTimeline, failedAuthentication);
    }

    failedAuthentication();
}

function sendTweet(status)
{
    twitter.tweet(status, sendTweet.success, sendTweet.failure);
}

sendTweet.success = function (data) {
    notify("Tweet sent");
};

sendTweet.failure = function (data) {
    notify("Tweet not sent. Please try again.");
};

send_button.addEventListener('click', function (event) {
    sendTweet(tweet_status_textarea.value);
});

{% endhighlight %}