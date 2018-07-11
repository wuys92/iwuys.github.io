define([ 'jquery', 'knockout', 'text!static/pages/user/register/register.html',
         'css!static/pages/user/register/register.css'], function($, ko, template) {
	var viewModel = {};
	
	this.reload_checkcode_img = function(){
		$("#checkcodeimg")[0].src = $("#checkcodeimg")[0].src.replace('.images','')+'1.images'
	}
	
	var register = function(){
		$('#checkMsg').css('display','none');
		var account = $("#account").val();
		var mobile = $("#mobile").val();
		var mail = $("#mail").val();
		var password = $("#password").val();
		var rePassword = $("#rePassword").val();
		var checkcode = $("#checkcode").val();
		var protocol = $("input[type='checkbox']").is(':checked');
		if(checkRegisterVal(account,mobile,mail,password,rePassword,protocol,checkcode)){
			$.ajax({
				type : 'POST',
				url : '/toyRenting/user/register',
				cache : false,
				data : {
					account : account,
					mobile : mobile,
					mail : mail,
					pwd : password,
					code : checkcode
				},
				dataType: 'json',
				success : function(data) {
					if(data.success == true){
						swal({title:'',text:"注册成功", timer:1600, type:"success"});
						window.location.href="/toyRenting/index.html";
					}else{
						swal("注册失败", data.message, "error");
					}
				},
				error : function(data) {
					swal("注册失败", "请重试", "error");
				}
			});
		}
	}
	
	
	var testAccount = /^[a-zA-z]\w{3,20}$/;
	var testMobile = /^1\d{10}$/;
	var testMail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
	var testPwd = /^\S{6,20}$/;
	var checkRegisterVal = function(account,mobile,mail,password,rePassword,protocol,checkcode){
		if(protocol != true){
			showMsg('请先查看注册协议并同意');
			return false;
		}
		if(!testAccount.test(account)){
			showMsg('登录名格式不正确');
			return false;
		}
		if(!testMobile.test(mobile)){
			showMsg('手机格式不正确');
			return false;
		}
		if(!testMail.test(mail)){
			showMsg('邮箱格式不正确');
			return false;
		}
		if(!testPwd.test(password)){
			showMsg('密码格式不正确');
			return false;
		}
		if(password != rePassword){
			showMsg('两次密码输入不一致');
			return false;
		}
		if(null == checkcode||checkcode==''){
			showMsg('验证码不可为空');
			return false;
		}
		return true;
	}
	
	var showMsg = function(message){
		$('#checkMsg').css('display','inline-block');
//		swal(message);
		$('#checkMsg').html(message);
	}
	
	var init = function() {
		$('#register').click(register);
	}
	
	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});