define([ 'jquery', 'knockout', 'text!static/pages/gl/index/index.html',
		'css!static/pages/gl/index/index.css' ], function($, ko, template) {
	var viewModel = {};
	var init = function() {
		loadpage('{NL}/gl/leftnav', 'gl_left_nav');
		loadpage('{NL}/gl/orders', 'gl_content');
	}

	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});