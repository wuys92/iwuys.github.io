define(
		[ 'jquery', 'knockout', 'text!static/pages/gl/orders/orders.html',
				'css!static/pages/gl/orders/orders.css' ],
		function($, ko, template) {
			var viewModel = {
				selectTagm : ko.observable(2),
				pageInfo : {
					orderState : '1',
					subOrders : ko.observableArray([]),
					pageIndex : 1
				}
			};

			viewModel.sendToy = function() {
				viewModel.selectTagm(2);
				viewModel.pageInfo.pageIndex = 1;
				viewModel.pageInfo.orderState = '1';
				getSubOrders();
			}

			viewModel.getBackingToy = function() {
				viewModel.selectTagm(3);
				viewModel.pageInfo.pageIndex = 1;
				viewModel.pageInfo.orderState = '4';
				getSubOrders();
			}

			viewModel.getDepositingToy = function() {
				viewModel.selectTagm(4);
				viewModel.pageInfo.pageIndex = 1;
				viewModel.pageInfo.orderState = '5';
				getSubOrders();
			}

			var getSubOrders = function() {
				$.ajax({
					type : 'POST',
					url : '/toyRenting/gl/getSubOrders',
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
							launchUnLoginFrame(getSubOrders);
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

			this.expressToy = function(obj) {
				swal(
						{
							title : "确认该玩具已发货了吗?",
							text : '<p>运单号：<input type="text" style="width: 310px; overflow: hidden;display: inline-block;" id="expressNO"/></p>'
									+ '<p>快递公司：<input type="text" style="width: 310px; overflow: hidden;display: inline-block;" id="company"/></p>',
							showCancelButton : true,
							closeOnConfirm : false,
							animation : "slide-from-top",
							confirmButtonText : "确认发货",
							cancelButtonText : "点错了。。",
							html : true
						}, function() {
							var expressNO = $("#expressNO").val();
							var company = $("#company").val();
							$.ajax({
								type : 'POST',
								url : '/toyRenting/gl/expressToy',
								cache : false,
								dataType : 'json',
								data : {
									subOrderNO : obj.subOrder.subOrderNo,
									expressNO : expressNO,
									company : company
								},
								success : function(data) {
									if (data.success == true) {
										swal("确认发货成功");
										getSubOrders();
									} else {
										swal("确认发货失败", data.message, "error");
									}
								},
								error : function(data) {
									swal("与服务器失去连接", "请重试", "error");
								}
							});
						});
			}

			this.returnedToy = function(obj) {
				swal(
						{
							title : "确认回收玩具快递信息",
							text : '<p>运单号：<input type="text" disabled="true" style="width: 310px; overflow: hidden;display: inline-block;" value="'
									+ obj.toyReturnExpress.expressNo
									+ '"/></p>'
									+ '<p>快递公司：<input type="text" disabled="true" style="width: 310px; overflow: hidden;display: inline-block;" value="'
									+ obj.toyReturnExpress.company + '"/></p>',
							showCancelButton : true,
							closeOnConfirm : false,
							animation : "slide-from-top",
							confirmButtonText : "确认已回收玩具",
							cancelButtonText : "点错了。。",
							html : true
						},
						function() {
							updateSubOrder(obj.subOrder.subOrderNo, 5, '确认回收玩具');
						});
			}

			this.backDeposit = function(obj) {
				swal(
						{
							title : "确认退还押金数目",
							text : '退还押金额：￥<input type="text" id="backDepositAmount" style="width: 310px; overflow: hidden;display: inline-block;"/>',
							showCancelButton : true,
							closeOnConfirm : false,
							animation : "slide-from-top",
							html : true
						}, function() {
							var backedDeposit = $("#backDepositAmount").val();
							$.ajax({
								type : 'POST',
								url : '/toyRenting/gl/giveBackedDeposit',
								cache : false,
								dataType : 'json',
								data : {
									subOrderNO : obj.subOrder.subOrderNo,
									backedDeposit : backedDeposit
								},
								success : function(data) {
									if (data.success == true) {
										swal("退还押金成功");
										getSubOrders();
									} else {
										swal("退还押金失败", data.message, "error");
									}
								},
								error : function(data) {
									swal("与服务器失去连接", "请重试", "error");
								}
							});
						});
			}

			var updateSubOrder = function(subOrderNO, orderState, tip) {
				$.ajax({
					type : 'POST',
					url : '/toyRenting/gl/updateSubOrderState',
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

			var init = function() {
				getSubOrders();
			}

			return {
				'model' : viewModel,
				'template' : template,
				'init' : init
			};
		});