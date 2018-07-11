define([ 'jquery', 'knockout', 'text!static/pages/gl/leftnav/leftnav.html' ],
		function($, ko, template) {
			var viewModel = {};
			var init = function() {
			}

			return {
				'model' : viewModel,
				'template' : template,
				'init' : init
			};
		});