define([ 'jquery', 'knockout', 'text!static/pages/welcome/footer/footer.html',
         'css!static/pages/welcome/footer/footer.css'], function($, ko, template) {
	var viewModel = {};
	var init = function() {
	}
	
	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});