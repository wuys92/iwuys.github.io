define([ 'jquery', 'knockout', 'text!static/pages/about/notice/notice.html',
         'css!static/pages/about/notice/notice.css'], function($, ko, template) {
	var viewModel = {};
	var init = function() {
	}
	
	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});