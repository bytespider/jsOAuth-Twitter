---
layout: reference
title: "signedIn"
description: "Is the Twitter user signed in? - jsOAuth Twitter API reference"
---

##Overview##
signedIn() checks if the user is already authenticated.

##Example##
{% highlight javascript linenos %}

if (twitter.signedIn() === true)
{
    successfulAuthentication();
}

{% endhighlight %}
