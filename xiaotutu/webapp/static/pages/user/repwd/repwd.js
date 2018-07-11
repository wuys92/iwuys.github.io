define([ 'jquery', 'knockout', 'text!static/pages/user/repwd/repwd.html',
		'css!static/pages/user/repwd/repwd.css' ], function($, ko, template) {
	var viewModel = {};

	this.reload_checkcode_img = function() {
		$("#checkcodeimg")[0].src = $("#checkcodeimg")[0].src.replace(
				'.images', '')
				+ '1.images'
	}

	this.repwd = function() {
		$('#checkMsg').css('display', 'none');
		var account = $("#account").val();
		if (checkNull(account)) {
			showMsg('请输入用户名');
			return;
		}

		var mail = $("#eamil").val();
		if (checkNull(mail)) {
			showMsg('请输入邮箱');
			return;
		}

		var checkcode = $("#checkcode").val();
		if (checkNull(checkcode)) {
			showMsg('请输入验证码');
			return;
		}

		$.ajax({
			type : 'POST',
			url : '/toyRenting/user/getchangepwdcode',
			cache : false,
			data : {
				account : account,
				mail : mail,
				checkCode : checkcode
			},
			dataType : 'json',
			success : function(data) {
				if (data.success == true) {
					swal({
						title : '',
						text : "新密码已发送至您的邮箱，请登录修改",
						timer : 2500,
						type : "success"
					});
				} else {
					swal("获取新密码失败", data.message, "error");
				}
			},
			error : function(data) {
				swal("与服务器失去连接", "请重试", "error");
			}
		});
	}

	var checkNull = function(obj) {
		if (obj == undefined || obj == null || obj.trim() == '')
			return true;
		return false;
	}

	var showMsg = function(message) {
		$('#checkMsg').css('display', 'inline-block');
		$('#checkMsg').html(message);
	}

	var init = function() {
	}

	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});