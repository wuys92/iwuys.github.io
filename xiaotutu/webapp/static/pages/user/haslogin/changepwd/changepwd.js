define([ 'jquery', 'knockout',
		'text!static/pages/user/haslogin/changepwd/changepwd.html' ], function(
		$, ko, template) {
	var viewModel = {};

	var testPwd = /^\S{6,20}$/;

	this.changePwd = function() {
		var origPwd = $('#origPwd').val().trim();
		var newPwd = $('#newPwd').val().trim();
		var confirmNewPwd = $('#confirmNewPwd').val().trim();
		var email = $('#email').val().trim();
		if (origPwd == undefined || origPwd == null || origPwd == '') {
			swal("原密码不可为空", '', "warning");
			return;
		}
		if (newPwd == undefined || newPwd == null || newPwd == '') {
			swal("新密码不可为空", '', "warning");
			return;
		}
		if (!testPwd.test(newPwd)) {
			swal("新密码格式不正确", '密码由6-20数字和字母组成', "warning");
			return;
		}
		if (email == undefined || email == null || email == '') {
			swal("邮箱不可为空", '', "warning");
			return;
		}
		if (newPwd != confirmNewPwd) {
			swal("两次密码不一致", '', "warning");
			return;
		}
		$.ajax({
			type : 'POST',
			url : '/toyRenting/user/changePwd',
			dataType : 'json',
			data : {
				origPwd : origPwd,
				newPwd : newPwd,
				email : email
			},
			success : function(data) {
				if (data.login == true) {
					if (data.success == true) {
						swal("修改密码成功");
					} else {
						swal("修改密码失败", data.message, "error");
					}
				} else {
					launchUnLoginFrame(null);
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