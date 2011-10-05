Ti.include('lib/titanium-jasmine/jasmine-1.0.2');
Ti.include('lib/titanium-jasmine/jasmine-titanium');

Ti.include('spec/mainSpec.js');

jasmine.getEnv().addReporter(new jasmine.TitaniumReporter());
jasmine.getEnv().execute();