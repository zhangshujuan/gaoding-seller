define(function(require, exports, module) {
	var $ = require("jquery");
	var Widget = require("widget");
	var Selectize = require("selectize");
	require("jqueryValidate");
	require("template");
	var Uploader = require("uploader");
	var template = require("./template.handlebars");
	var index = new Widget("body",{
		Event:{
			".add-photo click":'addPhoto',
			".del-photo click":'delPhoto',
			".js-add-case click":'addCase',
			".js-del-case click":'delCase',
			".btn-bottom button click":'submit'
		},
		vars:{
			photo:{
				index:$(".photo-info").length,
				len:$(".photo-info").length
			},
			Case:{
				index:$(".case-item").length,
				len:$(".case-item").length
			}
		},
		init:function(){
			var self = this;
			if($('.input-file:visible').length>0){
				 $(".photo-info").each(function(){
				 	var id = $(this).attr("id");
				 	self.uploadImg(id);
				 });
			}
			$('#input-tags').selectize({
			    plugins: ['remove_button'],
			    delimiter: ',',
			    persist: false,
			    create: function(input) {
			        return {
			            value: input,
			            text: input
			        }
			    }
			});
			this.valdate("#job-approve-form");			
		},
		uploadImg:function(photoId){			
			var Id = "upload-"+photoId;
			new Uploader({
			    trigger: "#"+Id,
			    action: '/openshop/uploadJobPhoto',
			    accept: 'image/*',
			    multiple: true,
			    error: function(file) {
			    },
			    success: function(response) {			    	
			    	var res = $.parseJSON(response);
					if(res.successFlag){
						$('.photo-url-'+photoId).attr('src',res.realPhotoUrl);
			        	$(".img-tips-"+photoId).val(res.photoName);
					}else{
						mySeller.alert(res.errorMsg)
					}
			    },
			    progress: function(event, position, total, percent, files) {
			    }
			})
		},
		submit:function(e){
			var target = $(e.currentTarget);
			if(!$('#job-approve-form').valid()){
				return false;
			}
			var ajaxCallUrl;
			if(target.hasClass("btn-gray")){
				ajaxCallUrl="/openshop/saveJob";
			} else {
				ajaxCallUrl="/openshop/saveJob";
			}
			$.ajax({
                type: "POST",
                url:ajaxCallUrl,
                data:$('#job-approve-form').serialize(),// 你的formid
                dataType:"json",
                error: function(request) {
                },
                success: function(res) {
                	if(res.successFlag == true){
                		if(target.hasClass("btn-gray")){
                			mySeller.alert("草稿保存成功");
            			}else{
            				window.location.href="/openshop/realName";
            			}
					}else{
						mySeller.alert(res.errorMsg);
					}
                }
            });
		},
		addCase:function(e){
			var target = $(e.currentTarget);
			var caseId = "Case"+("a"+new Date().getTime()).substring(7,14);
			target.closest('.case-item').before(template({Case:target.data("type"),id:caseId,index:this.vars.Case.index}));
			this.updateRules("#"+caseId,"add");
			this.vars.Case.index ++;
			textareaAutoSize($("#"+caseId+" textarea"));
		},
		delCase:function(e){
			var target = $(e.currentTarget).closest('.case-item');
			this.updateRules(target,"remove");
			target.remove();
		},
		addPhoto:function(e){
			var self = this;
			var target = $(e.currentTarget);
			var photoId = ("a"+new Date().getTime()).substring(7,14);
			if($('.photo-info').length > 2){
				mySeller.alert("不能超过3张");
			} else {
				target.before(template({photo:true,id:photoId,index:this.vars.photo.index,len:this.vars.photo.len}));
				this.updateRules("#"+photoId,"add");
				this.vars.photo.index ++;
				this.vars.photo.len ++;
			}
			self.uploadImg(photoId);
		},
		delPhoto:function(e){
			var target = $(e.currentTarget).closest('.photo-info');
			this.updateRules(target,"remove");
			target.remove();
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
			$(_form).find('[name][data-validate]:not([envalid])').each(function(index,item){
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