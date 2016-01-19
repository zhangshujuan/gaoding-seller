define(function(require, exports, module) {
	var $ = require("jquery");
	var Widget = require("widget");
	var Selectize = require("selectize");
	require("jqueryValidate");
	require("template");
	var Uploader = require("uploader");
	var index = new Widget("body",{
		Event:{
			".btn-bottom button click":'submit'
		},
		init:function(){
			var self = this;
			if($('.panel-upload:visible').length>0){
				 $(".card-file").each(function(){
				 	var title = $(this).attr("title");
				 	self.uploadImg(title);
				 });
			}
			this.valdate("#certification-form");
		},
		uploadImg:function(title){			
			var Id = title + "-upload";
			new Uploader({
			    trigger: "#"+Id,
			    action: '/openshop/uploadCardPhoto',
			    accept: 'image/*',
			    multiple: true,
			    error: function(msg) {
			    	mySeller.alert(msg);
			    },
			    success: function(response,files) {		
			    	var res = $.parseJSON(response);
					if(res.successFlag){
						$('.img-'+title).attr('src',res.realPhotoUrl);
			        	$(".img-tips-"+title).val(res.photoName);
					}else{
						mySeller.alert(res.errorMsg)
					}
			    },
			    progress: function(event, position, total, percent, files) {
			    	$(".upload-name-"+title).text(files[0].name);
			    }
			});
		},
		submit:function(e){
			var target = $(e.currentTarget);
			$('#certification-form').valid();
			var ajaxCallUrl="/openshop/saveRealName";
			$.ajax({
                type: "POST",
                url:ajaxCallUrl,
                data:$('#certification-form').serialize(),// 你的formid
                dataType:"json",
                error: function(request) {
                },
                success: function(res) {
                	if(res.successFlag == true){
                		if(target.hasClass("btn-gray")){
                			mySeller.alert("草稿保存成功");
            			}else{
            				$.ajax({
            	                type: "POST",
            	                url:"/openshop/commit",
            	                dataType:"json",
            	                error: function(request) {
            	                },
            	                success: function(res) {
            	                	if(res.successFlag == true){
        	                			window.location.href="/openshop/index";
            						}else{
            							mySeller.alert(res.errorMsg,function(){
            								window.location.href=res.url;
            							});
            						}
            	                }
            	            });
            			}
					}else{
						mySeller.alert(res.errorMsg);
					}
                }
            });
		},
		setErrorCss:function(element){
			var offset = element.position();
			return {
				"position": "absolute",
				"left":offset.left+element.outerWidth()-20,
				"top":offset.top+element.outerHeight()/2-11
			}
		},
		updateRules:function(element,t){
			var self = this;
			$(element).find('[name][data-validate]').each(function(index,item){
				self.updateRule(item,t)
			})
		},
		updateRule:function(element,t){
			if(t=="remove"){
				$("#"+$(element).attr("name")+"-error").remove();
				return $(element).rules(t);
			}
			var valia = mySeller.getDomJson($(element),"validate");
			//var name = $(item).attr("name");
			var rule = valia.rules;
			rule.messages = valia.messages;

			$(element).rules(t,rule);
		},
		calEqu:function(ele,els){
			var total = parseInt($(ele).val(),10);
			var _t = 0;

			$(els).each(function(i,item){
				_t+=parseInt($(item).val(),10);
			});
			return total == _t
		},
		valdate:function(_form,options){
			var self = this;
			var rules = {};
			var messages = {};
			$(_form).find('[name][data-validate][type!=range]:not([envalid])').each(function(index,item){
				var valia = mySeller.getDomJson($(item),"validate");
				var name = $(item).attr("name");
				 rules[name] = valia.rules;
				 messages[name] = valia.messages;
			})
			var settings = $.extend({},{
				errorPlacement:function(error,element){
					var errorDom = $("#"+error[0].id);
					if(error.html() == "") return;
					if(errorDom.length==0){
						errorDom  = $('<span class="error-text" id="'+error[0].id+'"></span>');
						$(element).parent().append(errorDom)
					}
					errorDom.css(self.setErrorCss(element))
					errorDom.html('<i class="iconfont icon-error"></i>')
					//errorDom.addClass("icon-error").removeClass("icon-success");
					errorDom.tooltip("destroy").tooltip({
						title:error.html(),
						container:'body',
						placement:'right'
					})//.css(self.setErrorCss(element));
					//element.parent().removeClass("has-success").addClass("has-error");
				},
				submitHandler:function(form){
					if($('[name="priceTypeInt"]:checked').val() == "0"){
						if($('[name="phaseType"]:checked').val() == "1"){
							if(!self.calEqu('[name="priceTotal"]','[name*="phasePrices_"]')){
								return mySeller.alert("各阶段价格总和必须和固定总价格相等")
							}
						}else{
							$("#stageMain").empty()
						}
					}
					$.ajax({
						url:$(form).attr("action"),
						type:"post",
						dataType:"json",
						data:mySeller.getFormData(form),
						success:function(res){
							if(res.successFlag == true){
								mySeller.alert("提交成功",function(){
									window.location.href = "/fuwu/index?tabId=tabCheck";
								})
							}else{
								mySeller.alert(res.errorMsg)
							}
						}
					})
					return false;
					//form.submit();
				},
				success:function(error, element){
					var errorDom = $("#"+error[0].id);
					//$(element).parent().addClass("has-success").removeClass("has-error");
					// if(errorDom.length>0){
					// 	errorDom.addClass("icon-success").removeClass("icon-error").tooltip("destroy");
					// }else{
					// 	errorDom  = $('<i class="iconfont icon-success" id="'+error[0].id+'"></i>');
					// 	$(element).parent().append(errorDom)
					// }
					if(errorDom.length==0){
						errorDom  = $('<span class="error-text" id="'+error[0].id+'"></span>');
						$(element).parent().append(errorDom)
					}
					errorDom.css(self.setErrorCss($(element)));
					errorDom.html('<i class="iconfont icon-success"></i>')
					errorDom.tooltip("destroy")//.css(self.setErrorCss($(element)));
				},
				rules: rules,
			    messages: messages
			},options)
			$(_form).validate(settings);
		}
	})
})