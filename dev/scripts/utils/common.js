define(function(require, exports, module) {
	var $ = require('jquery');
	require("jqueryui");
	require("bootstrap");
	require("rails");
	require("explorer");
    explorer.tip();
	if(!Array.indexOf){
		Array.prototype.indexOf = function(obj){              
		    for(var i=0; i<this.length; i++){
		        if(this[i]==obj){
		            return i;
		        }
		    }
		    return -1;
		}
	}
	var mySeller = {};
	var getDomJson = function(target,name){
		var data = target.data(name);
		if ( data.indexOf( '{' ) <0 ){
			data = "{" + data + "}";
		}
		data = eval("(" + data + ")");
		return data;
	}
	// {
	// 	url:url,
	// 	field:field,
	// 	key:key,
	// 	target:target
	// }
	mySeller.getDomJson = getDomJson;
	mySeller.selectChange = function(_this){
		var _target = $(_this)
		var config = getDomJson(_target,"config")
		var data = {};
		data[config.field] = $(_this).val();
		$.ajax({
			url:config.url,
			type:"get",
			dataType:"json",
			data:data,
			success:function(res){
		        var list = res[config.key];
		        var target = $(config.target);
		        var strArr = [];
				$.each(list,function(index,item){
					strArr.push('<option value="'+item.id+'">'+item.name+'</option>')
				});
				target.html(strArr.join(""));
			}
		});
	}
	mySeller.getFormData = function(form){
		var data = {};
		$(form).find('[name]').each(function(index,item){
			var _this = $(item);
			if(_this.is('[type="radio"]') || _this.is('[type="checkbox"]')){
				if(!_this.prop("checked")) return;
			}
			data[_this.attr("name")] = _this.val();
		})
		return data;
	}
	mySeller.alert = function(text,callback){
		$('<p>'+text+'</p>').dialog({
	      title: "提示",
	      width: 250,
	      modal: true,
	      buttons: [
	        {
	          text: "确定",
	          click: function() {
	        	  callback && typeof(callback) && callback(this)
	            $( this ).dialog( "close" );
	          }
	        }
	      ],
	      show:{ effect: "fadeIn", duration: 400 },
	      dialogClass: "seller-dialog"
	    });
	}
	mySeller.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
	window.mySeller = mySeller;

	module.exports = {
		mySeller:mySeller
	}
})