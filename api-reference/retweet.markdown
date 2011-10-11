---
layout: reference
title: "retweet"
description: "Re-tweet a status - jsOAuth Twitter API reference"
---

##Overview##
retweet() retweets a status your followers on Twitter.

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

twitter.retweet(12346, success, failure);

{% endhighlight %}

##Parameters##
<table>
    <thead>
        <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
        <tr><td class="name">id</td><td>Integer</td><td>The numerical ID of the desired status.</td></tr>
        <tr><td class="name">success</td><td>Function</td><td>Function called after success</td></tr>
        <tr><td class="name">failure</td><td>Function</td><td>Function called when request fails</td></tr>
        <tr>
            <td class="name">options</td><td>Object</td>
            <td>
                (optional) Options to modify the resulting JSON response
                <table>
                    <thead>
                        <tr><th>Name</th><th>Type</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        <tr><td class="name">trimUser</td><td>Boolean</td><td>When set to <code>true</code>, each tweet returned in a timeline will include a user object including only the status authors numerical ID. Default: <code>true</code></td></tr>
                        <tr><td class="name">includeEntities</td><td>Boolean</td><td>When set to <code>true</code>, each tweet will include a node called "entities". Default <code>true</code></td></tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>