define(function(require, exports, module) {
	var $ = require("jquery");
	var Widget = require("widget");
	require("animateCss");
	var isSort = false;
	var Sortable = $( "#sortable" );
	var tabId = mySeller.getUrlParam("tabId");
	function getSortId(ele){
		var ids = [];
		ele.find(".ui-sortable-handle").each(function(index,item){
			ids.push($(item).data("id"))
		})
		return ids.join(",");
	}
	var index = new Widget(document,{
		Event:{
			'.js-sortable click':"sortable",
			'.js-publish ajax:success':"publish",
			'.js-unpublish ajax:success':"unpublish",
			'.sellerlist-header li>a click':function(e){
				e.preventDefault();
				tabId = $(e.target).attr("href");
				//console.log(tabId)
			  	$(this).tab('show')
			}
		},
		init:function(){
			Sortable.sortable().sortable( "disable" );
			Sortable.disableSelection();
		},
		afterBind:function(){
			$('[href="#'+tabId+'"]').tab("show");
		},
		ajaxDone:function(res,text,url){
			if(res.successFlag){
				mySeller.alert(text,function(){
					window.location.href = url
				})
			}else{
				mySeller.alert(res.errorMsg);
			}
		},
		publish:function(e,res){
			this.ajaxDone(res,"您的上架请求已提交审核","/fuwu/index?tabId=setDown")
		},
		unpublish:function(e,res){
			this.ajaxDone(res,"您的服务下架成功","/fuwu/index?tabId=tabReleased")
		},
		sortable:function(e){
			var target = $(e.currentTarget);
			if(!isSort) {
				Sortable.sortable("enable");
				target.text("完成排序");
			}else{
				Sortable.sortable( "disable" );
				target.text("拖动排序");
				$.ajax({
					url:"/fuwu/fuwuSort",
					dataType:"json",
					type:"post",
					data:{
						ids:getSortId(Sortable)
					},
					success:function(res){
						
					}
				})
			}
			isSort = !isSort;
		}
	})
})