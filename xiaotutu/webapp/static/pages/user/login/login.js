define([ 'jquery', 'knockout', 'text!static/pages/user/login/login.html',
		'css!static/pages/user/login/login.css' ], function($, ko, template) {
	var viewModel = {};

	viewModel.login = function() {
		var userName = $("#username").val();
		var pwd = $("#password").val();
		$.ajax({
			type : 'POST',
			url : '/toyRenting/user/login',
			cache : false,
			dataType : 'json',
			data : {
				loginName : userName,
				pwd : pwd
			},
			success : function(data) {
				if (data.success == true) {
					window.location.href = "/toyRenting/index.html";
				} else {
					swal("登陆失败", data.message, "error");
				}
			},
			error : function(data) {
				swal("与服务器失去连接", "请重试", "error");
			}
		});
	}

	var init = function() {
	}

	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});