---
layout: reference
title: "OAuth.Twitter constructor"
description: ""
---

#OAuth.Twitter#
##Overview##
OAuth.Twitter() constructs a twitter client connection.

##Example##
{% highlight javascript linenos %}
var twitter = OAuth.Twitter({
    consumerKey: "YOUR-CONSUMER-KEY",
    consumerSecret: "YOUR-CONSUMER-SECRET"
});
{% endhighlight %}

##Parameters##
<table>
    <thead>
        <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
        <tr>
            <td>options</td><td>Object</td>
            <td>
                Options to set up the client
                <table>
                    <thead>
                        <tr><th>Name</th><th>Type</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>consumerKey</td><td>String</td><td>Your consumer key</td></tr>
                        <tr><td>consumerSecret</td><td>String</td><td>Your consumer key</td></tr>
                        <tr><td>accessTokenKey</td><td>String</td><td>(optional) reload with a pre-generated accessToken key</td></tr>
                        <tr><td>accessTokenSecret</td><td>String</td><td>(optional) reload with a pre-generated accessToken secret</td></tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>