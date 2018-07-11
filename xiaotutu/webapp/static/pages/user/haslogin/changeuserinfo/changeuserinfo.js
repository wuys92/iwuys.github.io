define([ 'jquery', 'knockout',
		'text!static/pages/user/haslogin/changeuserinfo/changeuserinfo.html' ],
		function($, ko, template) {
			var viewModel = {
				userInfo : ko.observable({}),
				selCitys : ko.observableArray([]),
				selCityChilds : ko.observableArray([]),
				selCityWebsites : ko.observableArray([])
			};

			var getUserInfo = function() {
				$.ajax({
					type : 'POST',
					url : '/toyRenting/user/getInfo',
					dataType : 'json',
					success : function(data) {
						if (data.login == true) {
							if (data.success == true) {
								viewModel.userInfo(data.model);
							} else {
								swal("查询个人信息失败", data.message, "error");
							}
						} else {
							launchUnLoginFrame(getOrders);
						}
					},
					error : function(data) {
						swal("与服务器失去连接", "请重试", "error");
					}
				});
			}

			this.submit = function(obj) {
				var childName = $("#childName").val();
				var childSex = $("input:radio[name='childSex']:checked").val();
				var parentName = $("#parentName").val();
				var parentsRef = $("input:radio[name='parentsRef']:checked")
						.val();
				var mobile = $("#mobile").val();
				var email = $("#email").val();
				var selCity = $("#selCity").val();
				var selCityChild = $("#selCityChild").val();
				var selCityWebsite = $("#selCityWebsite").val();
				var adressInfo = $("#adressInfo").val();

				$.ajax({
					type : 'POST',
					url : '/toyRenting/user/updateUserInfo',
					data : {
						babyName : childName,
						babySex : childSex,
						name : parentName,
						parentType : parentsRef,
						mobile : mobile,
						email : email,
						adressProvince : selCity,
						adressCity : selCityChild,
						adressCounty : selCityWebsite,
						adressInfo : adressInfo
					},
					dataType : 'json',
					success : function(data) {
						if (data.login == true) {
							if (data.success == true) {
								getUserInfo();
								swal("", "修改成功", "success");
							} else {
								swal("更改个人信息失败", data.message, "error");
							}
						} else {
							launchUnLoginFrame(getOrders);
						}
					},
					error : function(data) {
						swal("与服务器失去连接", "请重试", "error");
					}
				});
			}

			var loadCitys = function(pcode, type, target) {
				$.ajax({
					type : 'POST',
					url : '/toyRenting/country/getAreas',
					data : {
						pCode : pcode,
						type : type
					},
					dataType : 'json',
					success : function(data) {
						if (data.success == true) {
							target(data.model);
						} else {
							swal("获取区域信息失败", data.message, "error");
						}
					},
					error : function(data) {
						swal("与服务器失去连接", "请重试", "error");
					}
				});
			}

			this.pChange = function() {
				viewModel.selCityChilds([]);
				viewModel.selCityWebsites([]);
				var pval = $("#selCity  option:selected").val();
				if (isNull(pval)) {
					return;
				}
				loadCitys(pval, 'C', viewModel.selCityChilds)
			}

			this.cChange = function() {
				viewModel.selCityWebsites([]);
				var pval = $("#selCityChild  option:selected").val();
				if (isNull(pval)) {
					return;
				}
				loadCitys(pval, 'D', viewModel.selCityWebsites)
			}

			var isNull = function(obj) {
				if (obj == undefined || obj == null || obj == '') {
					return true;
				}
				return false;
			}

			var init = function() {
				getUserInfo();
				loadCitys('CN', 'P', viewModel.selCitys);
			}

			return {
				'model' : viewModel,
				'template' : template,
				'init' : init
			};
		});