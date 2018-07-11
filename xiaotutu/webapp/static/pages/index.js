require([ 'jquery', 'knockout', 'director', 'pagination' ],
		function($, ko) {

			window.getLoginSumaryInfo = function() {
				var loginInfo;
				$.ajax({
					type : 'POST',
					url : '/toyRenting/user/haslogin',
					cache : false,
					dataType : 'json',
					async : false,
					success : function(data) {
						loginInfo = data;
					},
					error : function(data) {
						swal("", "与服务器连接失败，请稍后重试", "error");
					}
				});
				return loginInfo;
			}

			window.launchUnLoginFrame = function(callBack) {
				swal({
					title : "您尚未登录",
					type : "warning",
					showCancelButton : true,
					closeOnConfirm : false,
					confirmButtonText : "现在就去登录...",
					confirmButtonColor : "#ec6c62"
				}, function() {
					launchToLoginFrame(callBack);
				});
			}

			window.launchToLoginFrame = function(callBack) {
				swal(
						{
							title : "登录确认",
							text : '<p>账号：<input type="text" id="username" style="width: 310px; overflow: hidden;display: inline-block;"/></p><p>密码：<input type="password" id="password" style="width: 310px; overflow: hidden;display: inline-block;"/></p>',
							showCancelButton : true,
							closeOnConfirm : false,
							animation : "slide-from-top",
							html : true
						}, function() {
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
										_doForLogin();
										swal({
											title : '',
											text : "登录成功",
											timer : 1000,
											type : "success"
										});
										if (callBack != undefined
												&& callBack != null) {
											callBack();
										}
									} else {
										swal("登陆失败", data.message, "error");
									}
								},
								error : function(data) {
									swal("与服务器失去连接", "请重试", "error");
								}
							});
						});
			}

			window._doForLogin = function() {
				var loginInfo = getLoginSumaryInfo();
				if (loginInfo != undefined) {
					if (loginInfo.login == true) {
						if (loginInfo.model.userState == 1) {
							$('#userNotLoginOp').css('display', 'none');
							$('#userHasLoginOp').css('display', 'inline-block');
							$('#loginAccount').html(loginInfo.model.account);
							$('#personCenter').css('display', 'inline-block');
							if (loginInfo.model.userType == 2) {
								$('#adminCenter')
										.css('display', 'inline-block');
							}
						} else if (loginInfo.model.userState == 0) {
							$('#userNotLoginOp').css('display', 'inline-block');
							$('#userHasLoginOp').css('display', 'none');
							$('#personCenter').css('display', 'none');
							$('#adminCenter').css('display', 'none');
							swal("您的账号已被停用", "请联系管理员处理", "warning");
						}
					} else if (loginInfo.login == false) {
						$('#userNotLoginOp').css('display', 'inline-block');
						$('#userHasLoginOp').css('display', 'none');
						$('#personCenter').css('display', 'none');
						$('#adminCenter').css('display', 'none');
					}
				}
			}

			var _LoadAllDivs = function() {
				loadpage("{NL}/welcome/header", 'header');
				loadpage("{NL}/welcome/topnav", 'topnav');
				loadpage("{NL}/welcome/footer", 'footer');
			}

			var _LoadContent = function() {
				var divRouterVar = divRouter();
				if (divRouterVar == undefined || divRouterVar == null
						|| divRouterVar == '')
					loadpage("{NL}/welcome/content");
				else
					loadpage(divRouterVar);
			}

			/**
			 * @param path
			 *            待加载页面地址
			 * @param func
			 *            待加载页面加载位置 默认content
			 */
			window.loadpage = function(path, func) {
				// {NL}---该链接不记录
				var isAddUrlParm = path.indexOf('{NL}');
				if (isAddUrlParm < 0) {
					// 开启此方法会对url加参 刷新页面会停留在上一次的页面
					addUrlParm(path);
				} else {
					path = path.replace('{NL}', '');
				}

				var module = getMdPath(path);
				requirejs.undef(module);
				require([ module ], function(module) {
					if (module === undefined || module == null
							|| module.template == 'status:405') {
						window.location.href = "/toyRenting/index.html";
						return;
					}
					if (func) {
						func = '#' + func;
					} else {
						func = '#content';
					}
					var md = $(func);
					ko.cleanNode(md[0]);
					md.html('');
					md.html(module.template);
					ko.applyBindings(module.model, md[0]);

					module.init();
				})
				/*
				 * $ .ajaxSetup({ contentType :
				 * "application/x-www-form-urlencoded;charset=utf-8", complete :
				 * function(XMLHttpRequest, textStatus) { var sessionstatus =
				 * XMLHttpRequest .getResponseHeader("sessionstatus"); //
				 * 通过XMLHttpRequest取得响应头，sessionstatus， if (sessionstatus ==
				 * "timeout") { alert("登录超时,请重新登录！", "提示"); window.location
				 * .replace("/toyRenting/index.html");// 如果超时就处理 // ，指定要跳转的页面 } }
				 * });
				 */
			}

			var addUrlParm = function(path) {
				var currentUrl = window.location.href.split('#')[0];
				window.location.href = currentUrl + '#' + path;
			}

			var getMdPath = function(path) {
				if (path == undefined || path == null) {
					return '';
				}
				var tempPath = path.split('?')[0];
				return 'static/pages' + tempPath
						+ tempPath.substring(tempPath.lastIndexOf("/"));
			}

			window.Request = function(strName) {
				var strHref = window.document.location.href;
				var intPos = strHref.indexOf("?");
				var strRight = strHref.substr(intPos + 1);
				var arrTmp = strRight.split("&");
				for (var i = 0; i < arrTmp.length; i++) {
					var arrTemp = arrTmp[i].split("=");

					if (arrTemp[0].toUpperCase() == strName.toUpperCase())
						return arrTemp[1];
				}
				return "";
			}

			window.divRouter = function() {
				var strHref = window.document.location.href;
				var intPos = strHref.indexOf("#");
				if (intPos == -1)
					return '';
				return strHref.substr(intPos + 1);
			}

			Date.prototype.format = function(format) {
				if (format == undefined || format == null || format == '') {
					format = 'yyyy-MM-dd hh:mm:ss';
				}
				var date = {
					"M+" : this.getMonth() + 1,
					"d+" : this.getDate(),
					"h+" : this.getHours(),
					"m+" : this.getMinutes(),
					"s+" : this.getSeconds(),
					"q+" : Math.floor((this.getMonth() + 3) / 3),
					"S+" : this.getMilliseconds()
				};
				if (/(y+)/i.test(format)) {
					format = format.replace(RegExp.$1,
							(this.getFullYear() + '')
									.substr(4 - RegExp.$1.length));
				}
				for ( var k in date) {
					if (new RegExp("(" + k + ")").test(format)) {
						format = format.replace(RegExp.$1,
								RegExp.$1.length == 1 ? date[k]
										: ("00" + date[k])
												.substr(("" + date[k]).length));
					}
				}
				return format;
			}

			$(function() {
				_LoadAllDivs();
				_LoadContent();
			});
		});