define(function(require, exports, module) {
	var $ = require("jquery");
	require("jqueryui");
	require("jqPaginator");
	var Things = [1,2,3,4,5,5,6];
	for (var i = 0; i < Things.length; i++) {
		console.log(Things[i])
	};
	
	$(function() {
		$( "#sortable" ).sortable();
		$( "#sortable" ).disableSelection();
	});
	$("#demo2").jqPaginator({
	    totalPages: 100,
	    visiblePages: 10,
	    currentPage: 1,
	    first: '<li class="first"><a href="javascript:void(0);">首页<\/a><\/li>',
	    prev: '<li class="prev"><a href="javascript:void(0);"><i class="arrow arrow2"><\/i>上一页<\/a><\/li>',
	    next: '<li class="next"><a href="javascript:void(0);">下一页<i class="arrow arrow3"><\/i><\/a><\/li>',
	    last: '<li class="last"><a href="javascript:void(0);">末页<\/a><\/li>',
	    page: '<li class="page"><a href="javascript:void(0);">{{page}}<\/a><\/li>',
	    onPageChange: function (n) {
	        $("#demo2-text").html("当前第" + n + "页");
	    }
	});
})