define([ 'jquery', 'knockout', 'text!static/pages/toy/toy.html',
		'css!static/pages/toy/toy.css' ], function($, ko, template) {
	var viewModel = {
		searchText : '',
		toyBrands : ko.observableArray([]),
		toyCategorys : ko.observableArray([]),
		showBrandRange : ko.observable(15),
		showMoreLimit : 15,
		filter_brand : ko.observable(-1),
		filter_age : ko.observable(-1),
		filter_toySize : ko.observable(-1),
		filter_toyCategory : ko.observable(-1),
		filter_sort_type : ko.observable(''),
		filter_sort_order : ko.observable(''),
		suitAgeStart : -1,
		suitAgeEnd : -1,

		pageInfo : {
			toys : ko.observableArray([]),
			pageIndex : 1
		}

	};

	viewModel.showMore = function() {
		viewModel.showBrandRange(viewModel.toyBrands._latestValue.length);
	}

	viewModel.showLess = function() {
		viewModel.showBrandRange(viewModel.showMoreLimit);
	}

	this.clickSuitAge = function(ageRange) {
		$('#suitage p a.cur').removeClass('cur');
		viewModel.filter_age(ageRange);
		loadToys(1);
	}

	this.clickToySize = function(toySize) {
		$('#toysize p a.cur').removeClass('cur');
		viewModel.filter_toySize(toySize);
		loadToys(1);
	}

	this.clickBrand = function(obj) {
		$('#brand p a.cur').removeClass('cur');
		if (obj.filter_brand != undefined) {
			viewModel.filter_brand(-1);
		} else {
			viewModel.filter_brand(obj.id);
		}
		loadToys(1);
	}

	this.clickCategory = function(obj) {
		$('#category p a.cur').removeClass('cur');
		if (obj.filter_brand != undefined) {
			viewModel.filter_toyCategory(-1);
		} else {
			viewModel.filter_toyCategory(obj.id);
		}
		loadToys(1);
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

	this.getToyDetail = function(obj) {
		var path = '/toy/info?toy=' + obj.id;
		loadpage(path);
	}

	var loadAllToyBrand = function() {
		$.ajax({
			type : 'POST',
			url : '/toyRenting/toybrand/getall',
			cache : true,
			dataType : 'json',
			success : function(data) {
				if (data.success == true) {
					viewModel.toyBrands(data.model);
				} else {
					swal("查询玩具品牌失败", data.message, "error");
				}
			},
			error : function(data) {
				swal("与服务器失去连接", "请重试", "error");
			}
		});
	}

	var loadAllToyCategory = function() {
		$.ajax({
			type : 'POST',
			url : '/toyRenting/toycategory/getall',
			cache : true,
			dataType : 'json',
			success : function(data) {
				if (data.success == true) {
					viewModel.toyCategorys(data.model);
				} else {
					swal("查询玩具类型失败", data.message, "error");
				}
			},
			error : function(data) {
				swal("与服务器失去连接", "请重试", "error");
			}
		});
	}

	var loadToys = function(pageIndex) {
		initSuitAge();

		$.ajax({
			type : 'POST',
			url : '/toyRenting/toy/queryPage',
			data : {
				searchCondition : viewModel.searchText,
				brandId : viewModel.filter_brand(),
				categoryId : viewModel.filter_toyCategory(),
				suitMonthStart : viewModel.suitAgeStart,
				suitMonthEnd : viewModel.suitAgeEnd,
				toySize : viewModel.filter_toySize(),
				sortType : viewModel.filter_sort_type(),
				sortOrder : viewModel.filter_sort_order(),
				pageIndex : pageIndex,
				pageSize : 20
			},
			cache : true,
			dataType : 'json',
			success : function(data) {
				if (data.success == true) {
					loadPage(data.model);
				} else {
					swal("查询玩具失败", data.message, "error");
				}
			},
			error : function(data) {
				swal("与服务器失去连接", "请重试", "error");
			}
		});
	}

	var loadPage = function(model) {
		viewModel.pageInfo.toys(model.content);
		initPagination(model);
	}

	var initPagination = function(model) {
		$("#Pagination").pagination(model.itemCount, {
			current_page : model.pageIndex - 1,
			items_per_page : model.pageSize, // 每页显示
			callback : function(page_index, jq) {
				if (page_index + 1 != viewModel.pageInfo.pageIndex) {
					loadToys(page_index + 1);
				}
				viewModel.pageInfo.pageIndex = page_index + 1;
			}
		});
	}

	var initSuitAge = function() {
		var ageRange = viewModel.filter_age();
		if (ageRange == 1) {
			viewModel.suitAgeStart = -1;
			viewModel.suitAgeEnd = 6;
		} else if (ageRange == 2) {
			viewModel.suitAgeStart = 7;
			viewModel.suitAgeEnd = 12;
		} else if (ageRange == 3) {
			viewModel.suitAgeStart = 13;
			viewModel.suitAgeEnd = 24;
		} else if (ageRange == 4) {
			viewModel.suitAgeStart = 25;
			viewModel.suitAgeEnd = 36;
		} else if (ageRange == 5) {
			viewModel.suitAgeStart = 37;
			viewModel.suitAgeEnd = 48;
		} else if (ageRange == 6) {
			viewModel.suitAgeStart = 49;
			viewModel.suitAgeEnd = -1;
		} else {
			viewModel.suitAgeStart = -1;
			viewModel.suitAgeEnd = -1;
		}
	}

	this.clickOrderBy = function(orderCol) {
		if (viewModel.filter_sort_type() == orderCol) {
			changeSortOrder();
		} else {
			viewModel.filter_sort_type(orderCol);
			viewModel.filter_sort_order('desc');
		}
		loadToys(viewModel.pageInfo.pageIndex);
	}

	var changeSortOrder = function() {
		if (viewModel.filter_sort_order() == 'desc') {
			viewModel.filter_sort_order('asc');
		} else {
			viewModel.filter_sort_order('desc');
		}
	}

	var init = function() {
		viewModel.searchText = Request("searchText");
		loadAllToyBrand();
		loadAllToyCategory();
		loadToys(viewModel.pageInfo.pageIndex);
	}

	return {
		'model' : viewModel,
		'template' : template,
		'init' : init
	};
});