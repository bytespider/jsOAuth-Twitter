---
layout: reference
title: "authenticate"
description: "Authenticate a twitter user - jsOAuth Twitter API reference"
---

##Overview##
authenticate() prompts the user to authorise your application.

##Example##
{% highlight javascript linenos %}
function sucessfulAuthentication()
{
    // fetch the users home timeline
}

function failedAuthentication()
{
    // warn the user
}

if (twitter.signedIn() === true)
{
    sucessfulAuthentication();
}
else
{
    twitter.authenticate(sucessfulAuthentication, failedAuthentication);
}

{% endhighlight %}

##Parameters##
<table>
    <thead>
        <tr><th>Name</th><th>Type</th><th>Description</th></tr>
    </thead>
    <tbody>
        <tr>
            <td class="name">success</td><td>Function</td><td>Function called after successful authentication</td>
            <td class="name">failure</td><td>Function</td><td>Function called on failed or cancelled authentication</td>
            <td class="name">options</td><td>Object</td>
            <td>
                (optional) Options to set up the client
                <table>
                    <thead>
                        <tr><th>Name</th><th>Type</th><th>Description</th></tr>
                    </thead>
                    <tbody>
                        <tr><td class="name">username</td><td>String</td><td>Authenticating user's username</td></tr>
                        <tr><td class="name">password</td><td>String</td><td>Authenticating user's password</td></tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>