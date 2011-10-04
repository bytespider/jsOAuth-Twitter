
    /**
     * Twitter
     *
     * @constructor
     * @param options {object}
     *      consumerKey {string} appliction's consumer key
     *      consumerSecret {string} appliction's consumer secret
     */
    OAuth.Twitter = function (options)
    {
        if (!(this instanceof OAuth.Twitter)) {
            return new OAuth.Twitter(options);
        }

        var properties = Ti.App.Properties;
        var accessTokenKey = properties.hasProperty("TwitterOAuthTokenKey") ? properties.getString("TwitterOAuthTokenKey") : "";
        var accessTokenSecret = properties.hasProperty("TwitterOAuthTokenSecret") ? properties.getString("TwitterOAuthTokenSecret") : "";

        options.accessTokenKey = accessTokenKey;
        options.accessTokenSecret = accessTokenSecret;

        options.requestTokenUrl = OAuth.Twitter.API_URL + OAuth.Twitter.API_OAUTH_REQUEST_TOKEN;
        options.authorizationUrl = OAuth.Twitter.API_URL + OAuth.Twitter.API_OAUTH_AUTHENTICATE;
        options.accessTokenUrl = OAuth.Twitter.API_URL + OAuth.Twitter.API_OAUTH_ACCESS_TOKEN;
        options.callbackUrl = 'http://bytespider.eu/oauth/';

        this.oauth = new OAuth(options);
    };

    /** @const */ OAuth.Twitter.API_OAUTH_AUTHORISE = "oauth/authorize";
    /** @const */ OAuth.Twitter.API_OAUTH_AUTHENTICATE = "oauth/authenticate";
    /** @const */ OAuth.Twitter.API_OAUTH_ACCESS_TOKEN = "oauth/access_token";
    /** @const */ OAuth.Twitter.API_OAUTH_REQUEST_TOKEN = "oauth/request_token";


    /** @const */ OAuth.Twitter.API_URL = 'https://api.twitter.com/';
    /** @const */ OAuth.Twitter.API_UPLOAD_URL = 'https://upload.twitter.com/';
    /** @const */ OAuth.Twitter.API_VERSION = '1';
    /** @const */ OAuth.Twitter.API_FORMAT = 'json';


    /** @const */ OAuth.Twitter.API_VARIFY_CREDENTIALS = '/account/verify_credentials';

    /** @const */ OAuth.Twitter.API_HOME_TIMELINE = '/statuses/home_timeline';
    /** @const */ OAuth.Twitter.API_USER_TIMELINE = '/statuses/user_timeline';
    /** @const */ OAuth.Twitter.API_PUBLIC_TIMELINE = '/statuses/public_timeline';
    /** @const */ OAuth.Twitter.API_MENTIONS = '/statuses/mentions';
    /** @const */ OAuth.Twitter.API_RETWEETED_BY_ME = '/statuses/retweeted_by_me';
    /** @const */ OAuth.Twitter.API_RETWEETS_OF_ME = '/statuses/retweets_of_me';
    /** @const */ OAuth.Twitter.API_RETWEETED_TO_USER = '/statuses/retweeted_to_user';
    /** @const */ OAuth.Twitter.API_RETWEETED_BY_USER = '/statuses/retweeted_by_user';

    /** @const */ OAuth.Twitter.API_STATUS_UPDATE = '/statuses/update';
    /** @const */ OAuth.Twitter.API_STATUS_UPDATE_WITH_MEDIA = '/statuses/update_with_media';

    /** @const */ OAuth.Twitter.API_RETWEET = '/statuses/retweet/';
    /** @const */ OAuth.Twitter.API_DESTROY_TWEET = '/statuses/destroy/';

    /** @const */ OAuth.Twitter.API_MESSAGES = '/direct_messages';
    /** @const */ OAuth.Twitter.API_NEW_MESSAGE = '/direct_messages/new';
    /** @const */ OAuth.Twitter.API_MESSAGE = '/direct_messages/';

    OAuth.Twitter.prototype = {

        /**
         * Authenticates a user
         *
         * @param options {object}
         *      username {string} the username to log in as (xAuth Only)
         *      password {string} the password to log in as (xAuth Only)
         *      success {function} callback for a sucessful request
         *      failure {function} callback for a failed request
         */
        authenticate: function (options)
        {
            var twitter = this;
            var success = options.success;
            var failure = options.failure || undefined;

            if ('username' in options && 'password' in options)
            {
                // xAuth authentication
                var url = OAuth.Twitter.API_URL +
                          OAuth.Twitter.API_OAUTH_ACCESS_TOKEN;

                twitter.oauth.post(url, {
                    x_auth_username: options.username,
                    x_auth_password: options.password,
                    x_auth_mode: 'client_auth'
                }, success, failure);
            }
            else
            {
                var authenticateCallback = (function(event)
                {
                    var url = event.url;

                    // close the window
                    this.UI.hideAuthenticationWindow.call(this);
                    var querystring = url.replace(twitter.oauth.callbackUrl + "?",  "");

                    var query = twitter.oauth.parseTokenRequest(querystring);

                    twitter.oauth.setVerifier(query.oauth_verifier);
                    twitter.oauth.fetchAccessToken(function (data) {
                        twitter.storeToken.call(twitter);

                        success();
                    }, failure);

                });

                // normal authentication
                twitter.oauth.fetchRequestToken(function (url) {
                    twitter.UI.showAuthenticationWindow.call(twitter, url, authenticateCallback);
                }, failure || undefined);
            }

            return this;
        },

        /**
         * Deauthenticates a user
         */
        deauthenticate: function ()
        {
            this.oauth.setAccessToken(null, null);
            Ti.App.Properties.removeProperty('TwitterOAuthTokenKey');
            Ti.App.Properties.removeProperty('TwitterOAuthTokenSecret');

            return this;
        },

        /**
         * Stores the token from OAuth into permanent storate
         */
        storeToken: function ()
        {
            var accessTokenKey = this.oauth.getAccessTokenKey();
            var accessTokenSecret = this.oauth.getAccessTokenSecret();

            Ti.App.Properties.setString('TwitterOAuthTokenKey', accessTokenKey);
            Ti.App.Properties.setString('TwitterOAuthTokenSecret', accessTokenSecret);
        },

        /**
         * Is the user authenticated?
         */
        //get signedIn ()
        signedIn: function ()
        {
            var hasKey = false;
            var hasSecret = false;

            var properties = Ti.App.Properties;

            if (properties.hasProperty('TwitterOAuthTokenKey'))
            {
                hasKey = properties.getString('TwitterOAuthTokenKey');
            }

            if (properties.hasProperty('TwitterOAuthTokenSecret'))
            {
                hasSecret =  properties.getString('TwitterOAuthTokenSecret');
            }

            return !(hasKey === null && hasSecret === null && hasKey === '' && hasSecret === '');
        },

        /**
         * Makes a request to varify the authenticated user's credentials
         *
         * @param options {object}
         *      success {function} callback for a sucessful request
         *      failure {function} callback for a failed request
         *
         * @see https://dev.twitter.com/docs/api/1/get/account/verify_credentials
         */
        verifyCredentials: function (options)
        {
            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VERSION +
                      OAuth.Twitter.API_VARIFY_CREDENTIALS + '.' +
                      OAuth.Twitter.API_FORMAT;

            var allowed_options = {}, defaults = {};

            url += optionsToQueryString(options, allowed_options, defaults);

            this.oauth.getJSON(url, options.success, options.failure);

            return this;
        },

        /**
         * Returns the 20 most recent statuses, including retweets if they
         * exist, posted by the authenticating user and the user's they follow.
         *
         * @param options {object}
         *      success {function} callback for a sucessful request
         *      failure {function} callback for a failed request
         *      count {integer}
         *      page {integer}
         *      sinceId {integer}
         *      maxId {integer}
         *      trimUser {boolean}
         *      includeRetweets {boolean}
         *      includeEntities {boolean}
         *      excludeReplies {boolean}
         *      contributorDetails {boolean}
         *
         * @see https://dev.twitter.com/docs/api/1/get/statuses/home_timeline
         */
        homeTimeline: function (options)
        {
            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VERSION +
                      OAuth.Twitter.API_HOME_TIMELINE + '.' +
                      OAuth.Twitter.API_FORMAT;

            var allowed_options = {
                'sinceId': 'since_id',
                'count': 'count',
                'page': 'page',
                'maxId': 'max_id',
                'trimUser': 'trim_user',
                'includeRetweets': 'include_rts',
                'includeEntities': 'include_entities',
                'excludeReplies': 'exclude_replies',
                'contributorDetails': 'contributor_details'
            };

            var defaults = {
                'trimUser': true,
                'includeRetweets': true,
                'includeEntities': true,
                'excludeReplies': false,
                'contributorDetails': true
            };

            url += optionsToQueryString(options, allowed_options, defaults);

            this.oauth.getJSON(url, options.success, options.failure);

            return this;
        },

        /**
         * Returns the 20 most recent statuses posted by the named user
         *
         * @param options {object}
         *      success {function} callback for a sucessful request
         *      failure {function} callback for a failed request
         *      count {integer}
         *      page {integer}
         *      screenName {string}
         *      userId {integer}
         *      sinceId {integer}
         *      maxId {integer}
         *      trimUser {boolean}
         *      includeRetweets {boolean}
         *      includeEntities {boolean}
         *      excludeReplies {boolean}
         *      contributorDetails {boolean}
         *
         * @see https://dev.twitter.com/docs/api/1/get/statuses/user_timeline
         */
        userTimeline: function (options)
        {
            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VERSION +
                      OAuth.Twitter.API_USER_TIMELINE + '.' +
                      OAuth.Twitter.API_FORMAT;

            var allowed_options = {
                'screenName': 'screen_name',
                'userId': 'user_id',
                'count': 'count',
                'page': 'page',
                'maxId': 'max_id',
                'trimUser': 'trim_user',
                'includeRetweets': 'include_rts',
                'includeEntities': 'include_entities',
                'excludeReplies': 'exclude_replies',
                'contributorDetails': 'contributor_details'
            };

            var defaults = {
                'trimUser': true,
                'includeRetweets': true,
                'includeEntities': true,
                'excludeReplies': false,
                'contributorDetails': true
            };

            url += optionsToQueryString(options, allowed_options, defaults);

            this.oauth.getJSON(url, options.success, options.failure);

            return this;
        },

        /**
         * Returns the 20 most recent statuses, including retweets if they
         * exist, from non-protected users.
         *
         * @param options {object}
         *      success {function} callback for a sucessful request
         *      failure {function} callback for a failed request
         *      trimUser {boolean}
         *      includeEntities {boolean}
         *
         * @see https://dev.twitter.com/docs/api/1/get/statuses/public_timeline
         */
        /*
        publicTimeline: function (options)
        {
            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VERSION +
                      OAuth.Twitter.API_PUBLIC_TIMELINE + '.' +
                      OAuth.Twitter.API_FORMAT;

            var allowed_options = {
                'trimUser': 'trim_user',
                'includeEntities': 'include_entities'
            };

            var defaults = {
                'trimUser': true
                'includeEntities': true
            };

            url += optionsToQueryString(options, allowed_options, defaults);

            this.oauth.getJSON(url, options.success, options.failure);

            return this;
        },
        */

        /**
         * Returns the 20 most recent mentions (status containing @username) for
         * the authenticating user.
         *
         * @param options {object}
         *      success {function} callback for a sucessful request
         *      failure {function} callback for a failed request
         *      count {integer}
         *      page {integer}
         *      sinceId {integer}
         *      maxId {integer}
         *      trimUser {boolean}
         *      includeRetweets {boolean}
         *      includeEntities {boolean}
         *      contributorDetails {boolean}
         *
         * @see https://dev.twitter.com/docs/api/1/get/statuses/mentions
         */
        mentions: function (options)
        {
            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VESRION +
                      OAuth.Twitter.API_MENTIONS + '.' +
                      OAuth.Twitter.API_FORMAT;

            var allowed_options = {
                'count': 'count',
                'page': 'page',
                'maxId': 'max_id',
                'trimUser': 'trim_user',
                'includeRetweets': 'include_rts',
                'includeEntities': 'include_entities',
                'excludeReplies': 'exclude_replies',
                'contributorDetails': 'contributor_details'
            };

            var defaults = {
                'trimUser': true,
                'includeRetweets': true,
                'includeEntities': true,
                'excludeReplies': false,
                'contributorDetails': true
            };

            url += optionsToQueryString(options, allowed_options, defaults);

            this.oauth.getJSON(url, options.success, options.failure);

            return this;
        },

        /**
         * Returns the 20 most recent direct messages sent to the authenticating
         * user.
         *
         * @param options {object}
         *      success {function} callback for a sucessful request
         *      failure {function} callback for a failed request
         *      count {integer}
         *      page {integer}
         *      sinceId {integer}
         *      maxId {integer}
         *      includeEntities {boolean}
         *      skipStatus {boolean}
         *
         * @see https://dev.twitter.com/docs/api/1/get/statuses/mentions
         */
        messages: function (options)
        {
            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VESRION +
                      OAuth.Twitter.API_MESSAGES + '.' +
                      OAuth.Twitter.API_FORMAT;

            var allowed_options = {
                'count': 'count',
                'page': 'page',
                'maxId': 'max_id',
                'sinceId': 'since_id',
                'includeEntities': 'include_entities',
                'skipStatus': 'skip_status'
            };

            var defaults = {
                'skipStatus': true,
                'includeEntities': true
            };

            url += optionsToQueryString(options, allowed_options, defaults);

            this.oauth.getJSON(url, options.success, options.failure);

            return this;
        },

        /**
         * Sends a new direct message to the specified user from the
         * authenticating user
         *
         * @param options {object}
         *      success {function} callback for a sucessful request
         *      failure {function} callback for a failed request
         *      count {integer}
         *      page {integer}
         *      sinceId {integer}
         *      maxId {integer}
         *      includeEntities {boolean}
         *      skipStatus {boolean}
         *
         * @see https://dev.twitter.com/docs/api/1/post/direct_messages/new
         */
        createMessage: function (options)
        {
            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VESRION +
                      OAuth.Twitter.API_NEW_MESSAGE + '.' +
                      OAuth.Twitter.API_FORMAT;

            var allowed_options = {
                'userId': 'user_id',
                'screenName': 'screen_name',
                'text': 'text',
                'wrapLinks': 'wrap_links'
            };

            var defaults = {
                'wrapLinks': true
            };

            var data = handleOptions(options, allowed_options, defaults);
            var success = options.success;

            this.oauth.post(url, data, function (data) {
                success(JSON.parse(data.text));
            }, options.failure);

            return this;
        },

        /**
         * Sends a new direct message to the specified user from the
         * authenticating user
         *
         * @param options {object}
         *      success {function} callback for a sucessful request
         *      failure {function} callback for a failed request
         *      count {integer}
         *      page {integer}
         *      sinceId {integer}
         *      maxId {integer}
         *      includeEntities {boolean}
         *      skipStatus {boolean}
         *
         * @see https://dev.twitter.com/docs/api/1/post/direct_messages/new
         */
        showMessage: function (options)
        {
            if (!('id' in options))
            {
                throw new Exception("Missing 'id' in retweet");
            }

            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VESRION +
                      OAuth.Twitter.API_MESSAGE +
                      options.id + '.' +
                      OAuth.Twitter.API_FORMAT;

            var allowed_options = {}, defaults = {};

            url += optionsToQueryString(options, allowed_options, defaults);

            this.oauth.getJSON(url, options.success, options.failure);

            return this;
        },

        /**
         * Returns the 20 most recent tweets of the authenticated user that have
         * been retweeted by others.
         *
         * @param options {object}
         *      success {function} callback for a sucessful request
         *      failure {function} callback for a failed request
         *      count {integer}
         *      page {integer}
         *      sinceId {integer}
         *      maxId {integer}
         *      trimUser {boolean}
         *      includeEntities {boolean}
         *
         * @see https://dev.twitter.com/docs/api/1/get/statuses/retweets_of_me
         */
        retweets: function (options)
        {
            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VESRION +
                      OAuth.Twitter.API_RETWEETS_OF_ME + '.' +
                      OAuth.Twitter.API_FORMAT;

            var allowed_options = {
                'count': 'count',
                'page': 'page',
                'maxId': 'max_id',
                'trimUser': 'trim_user',
                'includeEntities': 'include_entities'
            };

            var defaults = {
                'trimUser': true,
                'includeEntities': true
            };

            url += optionsToQueryString(options, allowed_options, defaults);


            this.oauth.getJSON(url, options.success, options.failure);

            return this;
        },

        /**
         * Returns the 20 most recent retweets posted by the authenticating
         * user.
         *
         * @param options {object}
         *      success {function} callback for a sucessful request
         *      failure {function} callback for a failed request
         *      count {integer}
         *      page {integer}
         *      sinceId {integer}
         *      maxId {integer}
         *      trimUser {boolean}
         *      includeEntities {boolean}
         *
         * @see https://dev.twitter.com/docs/api/1/get/statuses/retweeted_by_me
         */
        retweetsByMe: function (options)
        {
            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VESRION +
                      OAuth.Twitter.API_RETWEETED_BY_ME + '.' +
                      OAuth.Twitter.API_FORMAT;

            var allowed_options = {
                'count': 'count',
                'page': 'page',
                'maxId': 'max_id',
                'trimUser': 'trim_user',
                'includeEntities': 'include_entities'
            };

            var defaults = {
                'trimUser': true,
                'includeEntities': true
            };

            url += optionsToQueryString(options, allowed_options, defaults);

            this.oauth.getJSON(url, options.success, options.failure);

            return this;
        },

        /**
         * Updates the authenticating user's status, also known as tweeting.
         *
         * @see https://dev.twitter.com/docs/api/1/post/statuses/update
         **/
        tweet: function (options)
        {
            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VERSION +
                      OAuth.Twitter.API_STATUS_UPDATE + '.' +
                      OAuth.Twitter.API_FORMAT;

            if (!('status' in options))
            {
                throw new Exception("Missing 'status' in statusUpdate");
            }

            var allowed_options = {
                'status': 'status',
                'inReplyTo': 'in_reply_to_status_id',
                'lat': 'lat',
                'long': 'long',
                'place': 'place_id',
                'displayCoordinates': 'display_coordinates',
                'trimUser': 'trim_user',
                'includeEntities': 'include_entities',
                'wrap_linksinks': 'wrap_links'
            };

            var defaults = {
                'trimUser': true,
                'includeEntities': true,
                'wrapLinks': true
            };

            url += optionsToQueryString(options, allowed_options, defaults);

            this.oauth.getJSON(url, options.success, options.failure);

            return this;
        },

        /**
         * Updates the authenticating user's status and attaches media for upload.
         *
         * @see https://dev.twitter.com/docs/api/1/post/statuses/update_with_media
         **/
        tweetWithMedia: function (options)
        {
            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VERSION +
                      OAuth.Twitter.API_STATUS_UPDATE_WITH_MEDIA + '.' +
                      OAuth.Twitter.API_FORMAT;

            if (!('status' in options))
            {
                throw new Exception("Missing 'status' in statusUpdate");
            }
            if (!('media' in options))
            {
                throw new Exception("Missing 'status' in statusUpdate");
            }

            var allowed_options = {
                'status': 'status',
                'media': 'media',
                'possiblySensitive': 'possibly_sensitive',
                'inReplyTo': 'in_reply_to_status_id',
                'lat': 'lat',
                'long': 'long',
                'place': 'place_id',
                'displayCoordinates': 'display_coordinates',
                'trimUser': 'trim_user',
                'includeEntities': 'include_entities',
                'wrap_linksinks': 'wrap_links'
            };

            var defaults = {
                'trimUser': true,
                'includeEntities': true,
                'wrapLinks': true
            };

            var data = handleOptions(options, allowed_options, defaults);
            var success = options.success;

            this.oauth.post(url, data, function (data) {
                success(JSON.parse(data.text));
            });

            return this;
        },

        /**
         * Retweets a tweet.
         *
         * @see https://dev.twitter.com/docs/api/1/post/statuses/retweet/%3Aid
         **/
        retweet: function (options)
        {
            if (!('id' in options))
            {
                throw new Exception("Missing 'id' in retweet");
            }

            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VERSION +
                      OAuth.Twitter.API_RETWEET +
                      options.id + '.' +
                      OAuth.Twitter.API_FORMAT;

            var allowed_options = {
                'trimUser': 'trim_user',
                'includeEntities': 'include_entities'
            };

            var defaults = {
                'trimUser': true,
                'includeEntities': truepre
            };

            var data = handleOptions(options, allowed_options, defaults);
            var success = options.success;

            this.oauth.post(url, data, function (data) {
                success(JSON.parse(data.text));
            }, options.failure);

            return this;
        },

        /**
         * Retweets a tweet.
         *
         * @see https://dev.twitter.com/docs/api/1/post/statuses/destroy/%3Aid
         **/
        destroyTweet: function (options)
        {
            if (!('id' in options))
            {
                throw new Exception("Missing 'id' in retweet");
            }

            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VERSION +
                      OAuth.Twitter.API_DESTROY_TWEET +
                      options.id + '.' +
                      OAuth.Twitter.API_FORMAT;

            if (!('media' in options))
            {
                throw new Exception("Missing 'status' in statusUpdate");
            }

            var allowed_options = {
                'trimUser': 'trim_user',
                'includeEntities': 'include_entities'
            };

            var defaults = {
                'trimUser': true,
                'includeEntities': true
            };

            var data = handleOptions(options, allowed_options, defaults);
            var success = options.success;

            this.oauth.post(url, data, function (data) {
                success(JSON.parse(data.text));
            }, options.failure);

            return this;
        },

        /**
         * Retweets a tweet.
         *
         * @see https://dev.twitter.com/docs/api/1/get/statuses/show/%3Aid
         **/
        showTweet: function (options)
        {
            if (!('id' in options))
            {
                throw new Exception("Missing 'id' in retweet");
            }

            var url = OAuth.Twitter.API_URL +
                      OAuth.Twitter.API_VERSION +
                      OAuth.Twitter.API_DESTROY_TWEET +
                      options.id + '.' +
                      OAuth.Twitter.API_FORMAT;

            if (!('media' in options))
            {
                throw new Exception("Missing 'status' in statusUpdate");
            }

            var allowed_options = {
                'trimUser': 'trim_user',
                'includeEntities': 'include_entities'
            };

            var defaults = {
                'trimUser': true,
                'includeEntities': true
            };

            var data = handleOptions(options, allowed_options, defaults);
            var success = options.success;

            this.oauth.post(url, data, function (data) {
                success(JSON.parse(data.text));
            }, options.failure);

            return this;
        },

        UI: {
            modalLogin: null,

            /**
             * Opens a modal browser pointing to the authentication page
             *
             **/
            showAuthenticationWindow: function (url, authenticateCallback)
            {
                var twitter = this;
                var modal = Ti.UI.createWindow({id: "login_window_modal"});

                var view = Ti.UI.createView({id: "rounded-window"});
                var webview = Ti.UI.createWebView({
                    autoDetect: [Ti.UI.AUTODETECT_NONE],
                    borderRadius: 6,
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10,
                    url: url
                });


                view.add(webview);
                modal.add(view);

                webview.addEventListener('load', function (event) {
                    var url = event.url;
                    if (url.indexOf('oauth_verifier') != -1)
                    {
                        webview.stopLoading();
                        authenticateCallback.call(twitter, event);
                    }
                });

                modal.open();
                twitter.UI.modalLogin = modal;
            },

            /**
             * Closes a modal browser
             *
             **/
            hideAuthenticationWindow: function ()
            {
                this.UI.modalLogin.hide();
            }
        }
    };

    function handleOptions(options, allowed_options, defaults)
    {
        var i, data = {};
        for (i in allowed_options)
        {
            if (allowed_options.hasOwnProperty(i))
            {
                if (i in options) {
                    data[allowed_options[i]] = options[i];
                }
                else
                {
                    if (i in defaults)
                    {
                        data[allowed_options[i]] = defaults[i];
                    }
                }
            }
        }

        return data;
    }

    function optionsToQueryString(options, allowed_options, defaults)
    {
        var data = handleOptions(options, allowed_options, defaults), query = [], i;
        for (i in data)
        {
            if (data.hasOwnPropery(i)) {
                query.push(i + "=" + data[i]);
            }
        }

        return '?' + query.join("&");
    }
