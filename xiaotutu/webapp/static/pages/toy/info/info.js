define([ 'jquery', 'knockout', 'text!static/pages/toy/info/info.html',
		'css!static/pages/toy/info/info.css' ], function($, ko, template) {
	var viewModel = {
		toyId : -1,
		toy : ko.observable({}),
		defaultInfos : ko.observableArray([]),
		defaultPics : ko.observableArray([]),
		selectTag : ko.observable(1),
		comments : {
			data : ko.observableArray([]),
			pageIndex : 1,
			pageSize : 20
		}
	};

	var getToyDetails = function() {
		$.ajax({
			type : 'POST',
			url : '/toyRenting/toy/getDetails',
			data : {
				toyId : viewModel.toyId
			},
			dataType : 'json',
			success : function(data) {
				if (data.success == true) {
					if (data.model != null) {
						viewModel.toy(data.model.toy);
						viewModel.defaultInfos(data.model.defaultInfos);
						viewModel.defaultPics(data.model.defaultPics);
					} else {
						swal("没有查询到相关玩具信息");
					}
				} else {
					swal("查询玩具详细信息失败", data.message, "error");
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

	this.getSuitMonthMsg = function(toy) {
		if (toy.suitMonthStart != null && toy.suitMonthStart > 0) {
			if (toy.suitMonthEnd != null && toy.suitMonthEnd < 999) {
				return toy.suitMonthStart + '个月~' + toy.suitMonthEnd + '个月';
			} else {
				return toy.suitMonthStart + '个月以上';
			}
		} else {
			if (toy.suitMonthEnd != null && toy.suitMonthEnd < 999) {
				return toy.suitMonthEnd + '个月以内';
			} else {
				return '全部年龄段';
			}
		}
	}

	var checkNum = /^[0-9]*[1-9][0-9]*$/;

	this.addToCart = function() {
		$.ajax({
			type : 'POST',
			url : '/toyRenting/toycart/addOneRecord',
			data : {
				toyId : viewModel.toyId,
				dayAmount : 1
			},
			dataType : 'json',
			success : function(data) {
				if (data.login == true) {
					if (data.success == true) {
						swal("添加购物车成功");
					} else {
						swal("添加购物车失败", data.message, "error");
					}
				} else {
					launchUnLoginFrame(addToCart);
				}
			},
			error : function(data) {
				swal("与服务器失去连接", "请重试", "error");
			}
		});

		/*
		 * swal( { title : "添加购物车", text : '<p>租赁天数：<input type="text"
		 * style="width: 310px; overflow: hidden;display: inline-block;"
		 * id="dayAmount" value="1"/></p>' + '<p><label id="checkMsg"
		 * style="color:red;text-align:left;font-size:18;width: 310px; overflow:
		 * hidden;display: inline-block;"></label></p>', showCancelButton :
		 * true, closeOnConfirm : false, animation : "slide-from-top",
		 * confirmButtonText : "确认添加", cancelButtonText : "取消", html : true },
		 * function() { $("#checkMsg").html(""); var dayAmount =
		 * $("#dayAmount").val(); if (!checkNum.test(dayAmount)) {
		 * $("#checkMsg").html("请输入正确的天数"); return; } $.ajax({ type : 'POST',
		 * url : '/toyRenting/toycart/addOneRecord', data : { toyId :
		 * viewModel.toyId, dayAmount : dayAmount }, dataType : 'json', success :
		 * function(data) { if (data.login == true) { if (data.success == true) {
		 * swal("添加购物车成功"); } else { swal("添加购物车失败", data.message, "error"); } }
		 * else { launchUnLoginFrame(addToCart); } }, error : function(data) {
		 * swal("与服务器失去连接", "请重试", "error"); } }); });
		 */
	}

	var loadToyId = function() {
		viewModel.toyId = Request('toy');
	}

	var initCommentsPagination = function(model) {
		$("#Pagination_Comments").pagination(model.itemCount, {
			current_page : model.pageIndex - 1,
			items_per_page : model.pageSize, // 每页显示
			callback : function(page_index, jq) {
				if (page_index + 1 != viewModel.comments.pageIndex) {
					loadComments(page_index + 1);
				}
				viewModel.comments.pageIndex = page_index + 1;
			}
		});
	}

	var loadCommentsPage = function(model) {
		viewModel.comments.data(model.content);
		initCommentsPagination(model);
	}

	var loadComments = function(pi) {
		$.ajax({
			type : 'POST',
			url : '/toyRenting/toy/getToyComments',
			data : {
				toyId : viewModel.toyId,
				pageIndex : pi,
				pageSize : viewModel.comments.pageSize
			},
			dataType : 'json',
			success : function(data) {
				if (data.success == true) {
					loadCommentsPage(data.model);
				} else {
					swal("查询玩具评论信息失败", data.message, "error");
				}
			},
			error : function(data) {
				swal("与服务器失去连接", "请重试", "error");
			}
		});
	}

	this.getComments = function() {
		viewModel.selectTag(2);
		loadComments(1);
	}

	this.getTime = function(timeStamp) {
		var newDate = new Date();
		newDate.setTime(timeStamp);
		return newDate.format();
	}

	var init = function() {
		loadToyId();
		getToyDetails();
	}

	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});