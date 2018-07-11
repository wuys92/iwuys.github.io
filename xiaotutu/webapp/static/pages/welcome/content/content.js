define([ 'jquery', 'knockout', 'text!static/pages/welcome/content/content.html',
         'css!static/pages/welcome/content/content.css'], function($, ko, template) {
	var viewModel = {};
	var init = function() {
	}
	
	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});