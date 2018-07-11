define([ 'jquery', 'knockout', 'text!static/pages/welcome/header/header.html',
		'css!static/pages/welcome/header/header.css' ], function($, ko,
		template) {
	var viewModel = {};

	viewModel.exit = function() {
		swal({
			title : "您确定要退出吗？",
			type : "warning",
			showCancelButton : true,
			closeOnConfirm : false,
			confirmButtonText : "是的，我要退出",
			confirmButtonColor : "#ec6c62"
		}, function() {
			$.ajax({
				type : 'POST',
				url : '/toyRenting/user/exit',
				cache : false,
				dataType : 'json',
				async : false,
				success : function(data) {
					if (data.success == true) {
						if (data.login == false) {
							window.location.href = "/toyRenting/index.html";
						} else {
							swal("", "退出失败", "error");
						}
					} else {
						swal("", "服务器异常", "error");
					}
				},
				error : function(data) {
					swal("", "与服务器连接失败，请稍后重试", "error");
				}
			});
		});
	}

	this.searchToy = function() {
		var searchText = $("#q").val();
		loadpage('/toy?searchText=' + searchText);
	}

	var init = function() {
		_doForLogin();
	};

	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});