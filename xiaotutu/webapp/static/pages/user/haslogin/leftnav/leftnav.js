define([ 'jquery', 'knockout', 'text!static/pages/user/haslogin/leftnav/leftnav.html'], function($, ko, template) {
	var viewModel = {};
	var init = function() {
	}
	
	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});