require("lib/jasmine-core/jasmine.js");

require("lib/jsOAuth/jsOAuth.js");
require("lib/jsOAuth/jsOAuth_Twitter.js");
require("env.js");

// tests
require("spec/mainSpec.js");

var jasmineEnv = jasmine.getEnv();
jasmineEnv.execute();
