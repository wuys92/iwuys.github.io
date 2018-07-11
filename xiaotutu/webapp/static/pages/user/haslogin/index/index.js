define([ 'jquery', 'knockout',
		'text!static/pages/user/haslogin/index/index.html',
		'css!static/pages/user/haslogin/index/index.css' ], function($, ko,
		template) {
	var viewModel = {};
	var init = function() {
		loadpage('{NL}/user/haslogin/leftnav', 'user_left_nav');
		loadpage('{NL}/user/haslogin/rentrecord', 'user_content');
		// loadpage('{NL}/user/haslogin/userinfo', 'user_content');
	}

	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});