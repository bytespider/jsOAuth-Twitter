---
layout: reference
title: "userTimeline"
description: "Fetch the provided users timeline - jsOAuth Twitter API reference"
---

##Overview##
userTimeline() fetches the provided users timeline.

##Example##
{% highlight javascript linenos %}
function success(data)
{
    // display the user's timeline
    for (var i = 0; i < data.length; i++)
    {
        displayTweet(data[i]);
    }
}

function failure(data)
{
    // warn the user
}

twitter.userTimeline("bytespider", 12345, success, failure);

{% endhighlight %}

##Parameters##
<table>
    <thead>
        <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
        <tr><td class="name">screenName</td><td>String<br>Integer</td><td>The screen name or user id of the user for whom to return results for</td></tr>
        <tr><td class="name">sinceId</td><td>Integer</td><td>Returns results with an ID greater than (that is, more recent than) the specified ID. Can be `null`</td></tr>
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
                        <tr><td class="name">count</td><td>Integer</td><td>Specifies the number of records to retrieve. Must be less than or equal to 200.</td></tr>
                        <tr><td class="name">maxId</td><td>Integer</td><td>Returns results with an ID less than (that is, older than) or equal to the specified ID.</td></tr>
                        <tr><td class="name">page</td><td>Integer</td><td>Specifies the page of results to retrieve.</td></tr>
                        <tr><td class="name">trimUser</td><td>Boolean</td><td>When set to <code>true</code>, each tweet returned in a timeline will include a user object including only the status authors numerical ID. Default: <code>true</code></td></tr>
                        <tr><td class="name">includeRetweets</td><td>Boolean</td><td>When set to <code>true</code>,the timeline will contain native retweets (if they exist) in addition to the standard stream of tweets. Default: <code>true</code></td></tr>
                        <tr><td class="name">includeEntities</td><td>Boolean</td><td>When set to <code>true</code>, each tweet will include a node called "entities". Default <code>true</code></td></tr>
                        <tr><td class="name">excludeReplies</td><td>Boolean</td><td>This parameter will prevent replies from appearing in the returned timeline. Default <code>true</code></td></tr>
                        <tr><td class="name">contributorDetails</td><td>Boolean</td><td>This parameter enhances the contributors element of the status response to include the screen_name of the contributor. Default: <code>true</code></td></tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>