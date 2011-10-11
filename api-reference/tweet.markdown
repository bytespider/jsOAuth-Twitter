---
layout: reference
title: "tweet"
description: "Tweet a status - jsOAuth Twitter API reference"
---

##Overview##
tweet() posts a new status to Twitter.

##Example##
{% highlight javascript linenos %}
function success(data)
{
    // the tweet was successful - display a notification
    notify('tweet was posted successfully.');
}

function failure(data)
{
    // warn the user
    notify('tweet failed to be posted.')
}

var status = "jsOAuth Twitter is module for jsOAuth";
twitter.tweet(status, success, failure);

{% endhighlight %}

##Parameters##
<table>
    <thead>
        <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
        <tr><td class="name">status</td><td>String</td><td>The text of your status update, typically up to 140 characters.</td></tr>
        <tr><td class="name">success</td><td>Function</td><td>Function called after successfully fetching the timeline</td></tr>
        <tr><td class="name">failure</td><td>Function</td><td>Function called when the fetch fails</td></tr>
        <tr>
            <td class="name">options</td><td>Object</td>
            <td>
                (optional) Options to modify the resulting JSON response
                <table>
                    <thead>
                        <tr><th>Name</th><th>Type</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        <tr><td class="name">inReplyTo</td><td>Integer</td><td>The ID of an existing status that the update is in reply to.</td></tr>
                        <tr><td class="name">lat</td><td>Float</td><td>The latitude of the location this tweet refers to.</td></tr>
                        <tr><td class="name">long</td><td>Float</td><td>The longitude of the location this tweet refers to.</td></tr>
                        <tr><td class="name">place</td><td>String</td><td>A place in the world. These IDs can be retrieved from <a href="https://dev.twitter.com/docs/api/1/get/geo/reverse_geocode">GET geo/reverse_geocode</a></td></tr>
                        <tr><td class="name">displayCoordinates</td><td>Boolean</td><td>Whether or not to put a pin on the exact coordinates a tweet has been sent from.</td></tr>
                        <tr><td class="name">trimUser</td><td>Boolean</td><td>When set to <code>true</code>, each tweet returned in a timeline will include a user object including only the status authors numerical ID. Default: <code>true</code></td></tr>
                        <tr><td class="name">includeEntities</td><td>Boolean</td><td>When set to <code>true</code>, each tweet will include a node called "entities". Default <code>true</code></td></tr>
                        <tr><td class="name">wrapLinks</td><td>Boolean</td><td>When set to <code>true</code>, any valid URL found in the body will automatically be wrapped with the Twitter's t.co link wrapper</td></tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>