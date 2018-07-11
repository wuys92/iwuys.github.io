define(
		[ 'jquery', 'knockout', 'text!static/pages/gl/toys/toys.html',
				'css!static/pages/gl/toys/toys.css', 'fileUpload' ],
		function($, ko, template) {
			var viewModel = {
				toyBrands : ko.observableArray([]),
				toyCategorys : ko.observableArray([]),
				pageInfo : {
					toys : ko.observableArray([]),
					searchCondition : '',
					brandId : '',
					categoryId : '',
					pageIndex : 1
				},
				toyDetail : {
					toy : ko.observable({}),
					toyInfos : ko.observableArray([]),
					toyPics : ko.observableArray([]),
					nowShow : ko.observable(-1),
					tempCoverImg : ko.observable(''),
				}

			};

			var checkNum = /^[0-9]*[1-9][0-9]*$/;

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

			var loadToys = function() {
				$
						.ajax({
							type : 'POST',
							url : '/toyRenting/toy/queryPage',
							data : {
								searchCondition : isNull(viewModel.pageInfo.searchCondition) ? ''
										: viewModel.pageInfo.searchCondition,
								brandId : isNull(viewModel.pageInfo.brandId) ? ''
										: viewModel.pageInfo.brandId,
								categoryId : isNull(viewModel.pageInfo.categoryId) ? ''
										: viewModel.pageInfo.categoryId,
								sortType : 'update_time',
								sortOrder : 'desc',
								pageIndex : viewModel.pageInfo.pageIndex,
								pageSize : 7
							},
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
				$("#Pagination_xxxx").pagination(model.itemCount, {
					current_page : model.pageIndex - 1,
					items_per_page : model.pageSize, // 每页显示
					callback : function(page_index, jq) {
						if (page_index + 1 != viewModel.pageInfo.pageIndex) {
							viewModel.pageInfo.pageIndex = page_index + 1;
							loadToys();
						}
					}
				});
			}

			var loadToyDetail = function() {
				$.ajax({
					type : 'POST',
					url : '/toyRenting/toy/getDetails',
					data : {
						toyId : viewModel.toyDetail.nowShow()
					},
					dataType : 'json',
					success : function(data) {
						if (data.success == true) {
							initToyDetail(data.model);
						} else {
							swal("查询玩具失败", data.message, "error");
						}
					},
					error : function(data) {
						swal("与服务器失去连接", "请重试", "error");
					}
				});
			}

			var initToyDetail = function(model) {
				viewModel.toyDetail.toy(model == null ? {} : model.toy);
				viewModel.toyDetail.toyInfos(model == null ? []
						: model.defaultInfos);
				viewModel.toyDetail.toyPics(model == null ? []
						: model.defaultPics);
			}

			this.editToy = function(obj) {
				viewModel.toyDetail.nowShow(obj.id);
				$("#toysInfo").show();
				loadToyDetail();
			}

			this.addToy = function() {
				viewModel.toyDetail.nowShow(-1);
				initToyDetail(null);
				$("#toysInfo").show();
			}

			this.closeOrderDetails = function() {
				viewModel.toyDetail.nowShow(-1);
				initToyDetail(null);
				$("#toysInfo").hide();
			}

			this.saveToy = function() {
				var name = $('#name').val();
				if (isNull(name)) {
					swal("玩具名称不可为空", "", "warning");
					return;
				}

				var amount = $('#amount').val();
				if (isNull(amount)) {
					swal("玩具库存不可为空", "", "warning");
					return;
				}
				if (!checkNum.test(amount) || amount < 0) {
					swal("玩具库存输入不合法", "", "warning");
					return;
				}

				var deposit = $('#deposit').val();
				if (isNull(deposit)) {
					swal("玩具押金不可为空", "", "warning");
					return;
				}
				if (isNaN(deposit) || deposit < 0) {
					swal("玩具押金输入不合法", "", "warning");
					return;
				}

				var brandId = $("#ebrandId  option:selected").val();
				if (isNull(brandId)) {
					swal("玩具品牌不可为空", "", "warning");
					return;
				}

				var categoryId = $("#ecategoryId  option:selected").val();
				if (isNull(categoryId)) {
					swal("玩具类型不可为空", "", "warning");
					return;
				}

				var size = $("#size  option:selected").val();
				if (isNull(size)) {
					swal("玩具大小不可为空", "", "warning");
					return;
				}

				var price = $('#price').val();
				if (isNull(price)) {
					swal("玩具租金不可为空", "", "warning");
					return;
				}
				if (isNaN(price) || price < 0) {
					swal("玩具租金输入不合法", "", "warning");
					return;
				}

				var suitMonthStart = $('#suitMonthStart').val();
				if (isNull(suitMonthStart)) {
					swal("玩具适合最小月数不可为空", "", "warning");
					return;
				}
				if (!checkNum.test(suitMonthStart) && suitMonthStart != 0) {
					swal("玩具适合最小月数输入不合法", "", "warning");
					return;
				}

				var suitMonthEnd = $('#suitMonthEnd').val();
				if (isNull(suitMonthEnd)) {
					swal("玩具适合最大月数不可为空", "", "warning");
					return;
				}
				if (!checkNum.test(suitMonthEnd) && suitMonthEnd != 0) {
					swal("玩具适合最大月数输入不合法", "", "warning");
					return;
				}

				var buyPrice = $('#buyPrice').val();
				if (isNull(buyPrice)) {
					swal("玩具购买价格不可为空", "", "warning");
					return;
				}
				if (isNaN(buyPrice) || buyPrice < 0) {
					swal("玩具购买价格输入不合法", "", "warning");
					return;
				}

				var material = $('#material').val();
				if (isNull(material)) {
					swal("玩具材质不可为空", "", "warning");
					return;
				}

				var weight = $('#weight').val();
				if (isNull(weight)) {
					swal("玩具重量不可为空", "", "warning");
					return;
				}
				if (isNaN(weight) || weight < 0) {
					swal("玩具重量输入不合法", "", "warning");
					return;
				}

				$
						.ajax({
							type : 'POST',
							url : '/toyRenting/toy/saveToy',
							data : {
								toyId : viewModel.toyDetail.nowShow(),
								name : name,
								amount : amount,
								deposit : deposit,
								brandId : brandId,
								categoryId : categoryId,
								size : size,
								price : price,
								suitMonthStart : suitMonthStart,
								suitMonthEnd : suitMonthEnd,
								buyPrice : buyPrice,
								material : material,
								weight : weight,
								imgUrl : viewModel.toyDetail.tempCoverImg() == '' ? viewModel.toyDetail
										.toy().coverImageUrl
										: viewModel.toyDetail.tempCoverImg()
							},
							cache : true,
							dataType : 'json',
							success : function(data) {
								if (data.success == true) {
									viewModel.toyDetail.nowShow(data.model.id);
									loadToys();
									loadToyDetail();
									viewModel.toyDetail.tempCoverImg('');
								} else {
									swal("保存玩具失败", data.message, "error");
								}
							},
							error : function(data) {
								swal("与服务器失去连接", "请重试", "error");
							}
						});

			}

			this.deleteToy = function(obj) {
				swal({
					title : "确认删除玩具",
					showCancelButton : true,
					closeOnConfirm : true,
					animation : "slide-from-top",
					confirmButtonText : "删除玩具",
					cancelButtonText : "取消",
				}, function() {
					$.ajax({
						type : 'POST',
						url : '/toyRenting/toy/delete',
						data : {
							toyId : obj.id
						},
						cache : true,
						dataType : 'json',
						success : function(data) {
							if (data.success == true) {
								loadToys();
							} else {
								swal("删除玩具失败", data.message, "error");
							}
						},
						error : function(data) {
							swal("与服务器失去连接", "请重试", "error");
						}
					});
				});
			}

			this.addOneToyInfo = function() {
				swal(
						{
							title : "玩具特色增加",
							text : '<p><input type="text" id="newToyInfo" style="width: 450px; overflow: hidden;display: inline-block;"/></p>'
									+ '<p><label id="checkMsg" style="color:red;text-align:left;font-size:18;width: 310px;overflow: hidden;display: inline-block;"></label></p>',
							showCancelButton : true,
							closeOnConfirm : true,
							animation : "slide-from-top",
							confirmButtonText : "确认添加",
							cancelButtonText : "取消",
							html : true
						}, function() {
							$("#checkMsg").html("");
							var newToyInfo = $("#newToyInfo").val();
							if (isNull(newToyInfo)) {
								$("#checkMsg").html("请输入玩具特色");
								return;
							}
							$
									.ajax({
										type : 'POST',
										url : '/toyRenting/toy/addToyInfo',
										data : {
											toyId : viewModel.toyDetail
													.nowShow(),
											toyInfo : newToyInfo,
											type : 1
										},
										cache : false,
										dataType : 'json',
										success : function(data) {
											if (data.success == true) {
												loadToyDetail();
											} else {
												swal("添加玩具特色失败", data.message,
														"error");
											}
										},
										error : function(data) {
											swal("与服务器失去连接", "请重试", "error");
										}
									});
						});
			}

			this.deleteInfo = function(obj) {
				swal({
					title : "确认删除此条玩具描述",
					showCancelButton : true,
					closeOnConfirm : true,
					animation : "slide-from-top",
					confirmButtonText : "删除",
					cancelButtonText : "取消",
				}, function() {
					$.ajax({
						type : 'POST',
						url : '/toyRenting/toy/deleteToyInfo',
						data : {
							infoId : obj.id
						},
						dataType : 'json',
						success : function(data) {
							if (data.success == true) {
								loadToyDetail();
							} else {
								swal("删除玩具描述失败", data.message, "error");
							}
						},
						error : function(data) {
							swal("与服务器失去连接", "请重试", "error");
						}
					});
				});
			}

			this.upCoverImg = function() {
				$.ajaxFileUpload({
					url : '/toyRenting/uploadToyCoverImg',
					secureuri : false,
					fileElementId : 'upCoverImg',
					dataType : 'json',
					async : false,
					success : function(data) {
						if (data.success == true) {
							viewModel.toyDetail.tempCoverImg(data.model);
							saveToy();
						} else {
							saveToy();
						}
					},
					error : function(data) {
						swal("与服务器失去连接", "请重试", "error");
					}
				});
			}

			this.searchPage = function() {
				viewModel.pageInfo.pageIndex = 1;
				viewModel.pageInfo.searchCondition = $('#searchCondition')
						.val();
				viewModel.pageInfo.brandId = $("#brandId  option:selected")
						.val();
				viewModel.pageInfo.categoryId = $(
						"#categoryId  option:selected").val();
				loadToys();
			}

			var isNull = function(obj) {
				if (obj == undefined || obj == null || obj == '') {
					return true;
				}
				return false;
			}

			var init = function() {
				loadAllToyBrand();
				loadAllToyCategory();
				viewModel.pageInfo.pageIndex = 1;
				loadToys();
			}

			return {
				'model' : viewModel,
				'template' : template,
				'init' : init
			};
		});