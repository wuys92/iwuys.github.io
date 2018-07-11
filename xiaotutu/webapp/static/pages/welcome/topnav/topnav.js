define([ 'jquery', 'knockout', 'text!static/pages/welcome/topnav/topnav.html',
		'css!static/pages/welcome/topnav/topnav.css' ], function($, ko,
		template) {
	var viewModel = {};
	var init = function() {
		_doForLogin();
	}

	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});