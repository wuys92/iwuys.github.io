define(
		[ 'jquery', 'knockout',
				'text!static/pages/user/haslogin/userinfo/userinfo.html' ],
		function($, ko, template) {
			var viewModel = {};

			var getUserInfo = function() {
				$.ajax({
					type : 'POST',
					url : '/toyRenting/user/getInfo',
					dataType : 'json',
					success : function(data) {
						if (data.login == true) {
							if (data.success == true) {
								$('#account').html(data.model.account);
								$('#balance').html(data.model.balance);
							} else {
								swal("查询个人信息失败", data.message, "error");
							}
						} else {
							launchUnLoginFrame(getUserInfo);
						}
					},
					error : function(data) {
						swal("与服务器失去连接", "请重试", "error");
					}
				});
			}

			var mnyReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
			this.addBalance = function() {
				swal(
						{
							title : "确认充值金额",
							text : '充值金额：<input type="text" id="addBalanceAmount" style="width: 310px; overflow: hidden;display: inline-block;"/>',
							showCancelButton : true,
							closeOnConfirm : false,
							animation : "slide-from-top",
							html : true
						},
						function() {
							var addBalanceAmount = $("#addBalanceAmount").val();
							if (mnyReg.test(addBalanceAmount)) {
								addba(addBalanceAmount);
							} else {
								swal("输入的充值金额不合法", "", "warning");
							}
						});
			}

			var addba = function(obj) {
				swal(
						{
							title : "",
							text : '<img src="/toyRenting/static/images/QR_PAY.png" width="350" height="350" />',
							showCancelButton : true,
							closeOnConfirm : true,
							animation : "slide-from-top",
							confirmButtonText : "已完成付款",
							cancelButtonText : "待会付款",
							html : true
						},
						function() {
							$
									.ajax({
										type : 'POST',
										url : '/toyRenting/user/addBanlance',
										data : {
											baAmount : obj
										},
										dataType : 'json',
										success : function(data) {
											if (data.login == true) {
												if (data.success == true) {
													getUserInfo();
												} else {
													swal("充值失败", data.message,
															"error");
												}
											} else {
												launchUnLoginFrame(getUserInfo);
											}
										},
										error : function(data) {
											swal("与服务器失去连接", "请重试", "error");
										}
									});
						});
			}

			var init = function() {
				getUserInfo();
			}

			return {
				'model' : viewModel,
				'template' : template,
				'init' : init
			};
		});