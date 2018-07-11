define(
		[ 'jquery', 'knockout', 'text!static/pages/order/cart/cart.html',
				'css!static/pages/order/cart/cart.css', 'spinner' ],
		function($, ko, template) {
			var viewModel = {
				toyCarts : ko.observableArray([]),
			};

			viewModel.sumPrice = ko.computed({
				read : function() {
					var sum = 0;
					var carts = viewModel.toyCarts();
					if (carts == undefined || carts == null
							|| carts.length == 0) {
						return '￥' + 0;
					}
					for ( var item in carts) {
						if (carts[item].toy.amount > 0) {
							sum += carts[item].dayAmount()
									* carts[item].toy.price;
						}
					}
					return '￥' + sum;
				},
				write : function(value) {
				},
				owner : viewModel
			}, viewModel)

			viewModel.sumDeposit = ko.computed({
				read : function() {
					var sum = 0;
					var carts = viewModel.toyCarts();
					if (carts == undefined || carts == null
							|| carts.length == 0) {
						return '￥' + 0;
					}
					for ( var item in carts) {
						if (carts[item].toy.amount > 0)
							sum += carts[item].toy.deposit;
					}
					return '￥' + sum;
				},
				write : function(value) {
				},
				owner : viewModel
			}, viewModel)

			ko.bindingHandlers.spinner = {
				init : function(element, valueAccessor) {
					var obj = valueAccessor();
					$(element).Spinner({
						value : obj.dayAmount(),
						increaseCallback : function() {
							changeDayAmount(obj, obj.dayAmount() + 1);
						},
						decreaseCallback : function() {
							changeDayAmount(obj, obj.dayAmount() - 1);
						}
					});
				},
				update : function(element, valueAccessor) {

				}
			};

			var changeDayAmount = function(obj, newDayAmount) {
				$.ajax({
					type : 'POST',
					url : '/toyRenting/toycart/setNewDayAmount',
					dataType : 'json',
					data : {
						cartId : obj.id,
						newDayAmount : newDayAmount
					},
					success : function(data) {
						if (data.login == true) {
							if (data.success == true) {
								obj.dayAmount(newDayAmount);
							} else {
								swal("修改购物车信息失败", data.message, "error");
							}
						} else {
							launchUnLoginFrame(launchAllToyCarts);
						}
					},
					error : function(data) {
						swal("与服务器失去连接", "请重试", "error");
					}
				});
			}

			var launchAllToyCarts = function() {
				$
						.ajax({
							type : 'POST',
							url : '/toyRenting/toycart/getAll',
							dataType : 'json',
							success : function(data) {
								if (data.login == true) {
									if (data.success == true) {
										if (data.model != undefined
												&& data.model != null) {
											for ( var index in data.model) {
												data.model[index].dayAmount = ko
														.observable(data.model[index].dayAmount)
											}
										}
										viewModel.toyCarts(data.model);

									} else {
										swal("查询购物车信息失败", data.message, "error");
									}
								} else {
									launchUnLoginFrame(launchAllToyCarts);
								}
							},
							error : function(data) {
								swal("与服务器失去连接", "请重试", "error");
							}
						});
			}

			this.removeOne = function(obj) {
				$.ajax({
					type : 'POST',
					url : '/toyRenting/toycart/removeOne',
					data : {
						cartId : obj.id
					},
					dataType : 'json',
					success : function(data) {
						if (data.login == true) {
							if (data.success == true) {
								launchAllToyCarts();
							} else {
								swal("移除购物车失败", data.message, "error");
							}
						} else {
							launchUnLoginFrame(launchAllToyCarts);
						}
					},
					error : function(data) {
						swal("与服务器失去连接", "请重试", "error");
					}
				});
			}

			this.getToySize = function(size) {
				if (size == 1) {
					return '大';
				} else if (size == 2) {
					return '中';
				} else if (size == 3) {
					return '小';
				} else {
					return '未知';
				}
			}

			this.createOrder = function() {
				$.ajax({
					type : 'POST',
					url : '/toyRenting/order/createOrder',
					dataType : 'json',
					async : false,
					success : function(data) {
						if (data.login == true) {
							if (data.success == true) {
								swal("创建订单成功");
								loadpage('/user/haslogin/index');
							} else {
								swal("创建订单失败", data.message, "error");
							}
						} else {
							launchUnLoginFrame(launchAllToyCarts);
						}
					},
					error : function(data) {
						swal("与服务器失去连接", "请重试", "error");
					}
				});
			}

			var init = function() {
				launchAllToyCarts();
			}

			return {
				'model' : viewModel,
				'template' : template,
				'init' : init
			};
		});