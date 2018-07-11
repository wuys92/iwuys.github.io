define(
		[ 'jquery', 'knockout',
				'text!static/pages/user/haslogin/rentrecord/rentrecord.html',
				'css!static/pages/user/haslogin/rentrecord/rentrecord.css' ],
		function($, ko, template) {
			var viewModel = {
				selectTagm : ko.observable(1),
				orderDetails : ko.observableArray([]),
				pageInfo : {
					orderState : '0,1',
					orders : ko.observableArray([]),
					subOrders : ko.observableArray([]),
					pageIndex : 1
				}
			};

			viewModel.getWaitSendToy = function() {
				viewModel.selectTagm(1);
				viewModel.pageInfo.pageIndex = 1;
				viewModel.pageInfo.orderState = '0,1';
				getOrders();
			}

			viewModel.getSendingToy = function() {
				viewModel.selectTagm(2);
				viewModel.pageInfo.pageIndex = 1;
				viewModel.pageInfo.orderState = '2';
				getSubOrders();
			}

			viewModel.getUsingToy = function() {
				viewModel.selectTagm(3);
				viewModel.pageInfo.pageIndex = 1;
				viewModel.pageInfo.orderState = '3';
				getSubOrders();
			}

			viewModel.getToyHis = function() {
				viewModel.selectTagm(4);
				viewModel.pageInfo.pageIndex = 1;
				viewModel.pageInfo.orderState = '4,5,6,7';
				getSubOrders();
			}

			var getOrders = function() {
				$.ajax({
					type : 'POST',
					url : '/toyRenting/order/getOrders',
					data : {
						orderStates : viewModel.pageInfo.orderState,
						pageIndex : viewModel.pageInfo.pageIndex,
						pageSize : 7
					},
					dataType : 'json',
					success : function(data) {
						if (data.login == true) {
							if (data.success == true) {
								viewModel.pageInfo.orders(data.model.content);
								initPagination(data.model, getOrders);
							} else {
								swal("查询订单信息失败", data.message, "error");
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

			var getSubOrders = function() {
				$.ajax({
					type : 'POST',
					url : '/toyRenting/order/getSubOrders',
					data : {
						orderStates : viewModel.pageInfo.orderState,
						pageIndex : viewModel.pageInfo.pageIndex,
						pageSize : 7
					},
					dataType : 'json',
					success : function(data) {
						if (data.login == true) {
							if (data.success == true) {
								viewModel.pageInfo
										.subOrders(data.model.content);
								initPagination(data.model, getSubOrders);
							} else {
								swal("查询订单信息失败", data.message, "error");
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

			var initPagination = function(model, callbackFunction) {
				$("#Pagination").pagination(model.itemCount, {
					current_page : model.pageIndex - 1,
					items_per_page : model.pageSize, // 每页显示
					callback : function(page_index, jq) {
						if (page_index + 1 != viewModel.pageInfo.pageIndex) {
							viewModel.pageInfo.pageIndex = page_index + 1;
							callbackFunction();
						}
					}
				});
			}

			// this.payOrder = function(obj) {
			// swal(
			// {
			// title : "",
			// text : '<img src="/toyRenting/static/images/QR_PAY.png"
			// width="350" height="350" />',
			// showCancelButton : true,
			// closeOnConfirm : false,
			// animation : "slide-from-top",
			// confirmButtonText : "已完成付款",
			// cancelButtonText : "待会付款",
			// html : true
			// }, function() {
			// updateOrder(obj.order.orderNo, 1, '付款');
			// });
			// }

			this.payOrder = function(obj) {
				swal({
					title : "确认付款",
					showCancelButton : true,
					closeOnConfirm : false,
					animation : "slide-from-top",
					confirmButtonText : "确认付款",
					cancelButtonText : "取消",
					html : true
				}, function() {
					$.ajax({
						type : 'POST',
						url : '/toyRenting/order/payOrder',
						cache : false,
						dataType : 'json',
						data : {
							orderNO : obj.order.orderNo
						},
						success : function(data) {
							if (data.success == true) {
								swal("付款成功");
								getOrders();
							} else {
								swal("付款失败", data.message, "error");
							}
						},
						error : function(data) {
							swal("与服务器失去连接", "请重试", "error");
						}
					});
				});
			}

			this.close = function(obj) {
				swal({
					title : "确认取消订单吗？",
					showCancelButton : true,
					closeOnConfirm : false,
					animation : "slide-from-top",
					confirmButtonText : "取消订单",
					cancelButtonText : "点错了。。",
				}, function() {
					updateOrder(obj.order.orderNo, -1, '取消订单');
				});
			}

			this.getToys = function(obj) {
				swal({
					title : "确认收到玩具了吗？",
					showCancelButton : true,
					closeOnConfirm : false,
					animation : "slide-from-top",
					confirmButtonText : "已收到玩具",
					cancelButtonText : "点错了。。",
				}, function() {
					updateSubOrder(obj.subOrder.subOrderNo, 3, '确认收货');
				});
			}

			this.getExpressInfo = function(obj) {
				if (obj.subOrderExpress == undefined
						|| obj.subOrderExpress == null) {
					swal("", "没有查询到玩具的快递信息", "warning");
				}
				swal({
					title : "物流信息",
					text : '<p>运单号：<input type="text" disabled="true" style="width: 310px; overflow: hidden;display: inline-block;" value="'
							+ obj.subOrderExpress.expressNo
							+ '"/></p>'
							+ '<p>快递公司：<input type="text" disabled="true"  style="width: 310px; overflow: hidden;display: inline-block;" value="'
							+ obj.subOrderExpress.company + '"/></p>',
					animation : "slide-from-top",
					html : true
				});
			}

			this.returnToy = function(obj) {
				swal(
						{
							title : "确认已退还玩具了吗",
							text : '<p>退还玩具运单号：<input type="text" id="returnToyExpressNO" style="width: 310px; overflow: hidden;display: inline-block;"/></p>'
									+ '<p>快递公司：<input type="text" id="returnToyCompany" style="width: 310px; overflow: hidden;display: inline-block;"/></p>',
							showCancelButton : true,
							closeOnConfirm : false,
							animation : "slide-from-top",
							html : true
						},
						function() {
							var returnToyExpressNO = $("#returnToyExpressNO")
									.val();
							var returnToyCompany = $("#returnToyCompany").val();
							$
									.ajax({
										type : 'POST',
										url : '/toyRenting/order/returnToy',
										cache : false,
										dataType : 'json',
										data : {
											subOrderNO : obj.subOrder.subOrderNo,
											company : returnToyCompany,
											expressNO : returnToyExpressNO
										},
										success : function(data) {
											if (data.success == true) {
												swal("确认退还玩具成功");
												getSubOrders();
											} else {
												swal("确认退还玩具失败", data.message,
														"error");
											}
										},
										error : function(data) {
											swal("与服务器失去连接", "请重试", "error");
										}
									});
						});
			}

			this.giveComment = function(obj) {
				swal(
						{
							title : "",
							text : '评论：<textarea type="text" style="width:310px;overflow-x:visible;overflow-y:visible;display: inline-block;" id="comment"/>',
							showCancelButton : true,
							closeOnConfirm : false,
							animation : "slide-from-top",
							html : true
						}, function() {
							var comment = $("#comment").val();
							$.ajax({
								type : 'POST',
								url : '/toyRenting/order/giveComment',
								cache : false,
								dataType : 'json',
								data : {
									subOrderNO : obj.subOrder.subOrderNo,
									comment : comment,
									level : 3
								},
								success : function(data) {
									if (data.success == true) {
										swal("评论成功");
										getSubOrders();
									} else {
										swal("评论失败", data.message, "error");
									}
								},
								error : function(data) {
									swal("与服务器失去连接", "请重试", "error");
								}
							});
						});
			}

			var updateOrder = function(orderNO, orderState, tip) {
				$.ajax({
					type : 'POST',
					url : '/toyRenting/order/updateOrderState',
					dataType : 'json',
					data : {
						orderNO : orderNO,
						orderState : orderState
					},
					async : false,
					success : function(data) {
						if (data.login == true) {
							if (data.success == true) {
								swal(tip + "成功");
								getOrders();
							} else {
								swal(tip + "失败", data.message, "error");
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

			var updateSubOrder = function(subOrderNO, orderState, tip) {
				$.ajax({
					type : 'POST',
					url : '/toyRenting/order/updateSubOrderState',
					dataType : 'json',
					data : {
						subOrderNO : subOrderNO,
						orderState : orderState
					},
					async : false,
					success : function(data) {
						if (data.login == true) {
							if (data.success == true) {
								swal(tip + "成功");
								getSubOrders();
							} else {
								swal(tip + "失败", data.message, "error");
							}
						} else {
							launchUnLoginFrame(getSubOrders);
						}
					},
					error : function(data) {
						swal("与服务器失去连接", "请重试", "error");
					}
				});
			}

			this.getTime = function(timeStamp) {
				var newDate = new Date();
				newDate.setTime(timeStamp);
				return newDate.format().substring(0, 10);
			}

			this.getState = function(orderState) {
				switch (orderState) {
				case 0:
					return "待付款";
				case 1:
					return "待发货";
				case 2:
					return "正在配送ing";
				case 3:
					return "使用中";
				case 4:
					return "正在退回";
				case 5:
					return "待退押金";
				case 6:
					return "待评论";
				case 7:
					return "订单结束";
				default:
					return "状态异常";
				}
			}

			this.orderDetails = function(obj) {
				$("#toysInfo").show();
				viewModel.orderDetails(obj.subOrders);
			}

			this.closeOrderDetails = function() {
				$("#toysInfo").hide();
			}

			var init = function() {
				viewModel.getWaitSendToy();
			}

			return {
				'model' : viewModel,
				'template' : template,
				'init' : init
			};
		});