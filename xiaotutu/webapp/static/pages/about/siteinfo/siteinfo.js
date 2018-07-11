define([ 'jquery', 'knockout', 'text!static/pages/about/siteinfo/siteinfo.html',
         'css!static/pages/about/siteinfo/siteinfo.css'], function($, ko, template) {
	var viewModel = {};
	var init = function() {
	}
	
	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});