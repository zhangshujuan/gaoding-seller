define(function(require, exports, module) {
	var $ = require("jquery");
	var Widget = require("widget");
	var Selectize = require("selectize");
	require("jqueryValidate");
	require("template");
	var textareaAutoSize = require("textareaAutoSize");
	var template = require("./template.handlebars");
	var index = new Widget("body",{
		Event:{
			".js-add-stage click":'addStage',
			".js-add-case click":'addCase',
			".js-del-case click":'delCase',
			".js-del-stage click":'delStage',
			'.js-stage-radio input[type="radio"] click':"checkStageRadio",
			'#priceRadio input[type="radio"] click':"checkPriceRadio"
		},
		vars:{
			floatPrice:($('[name="priceTypeInt"]:checked').val() == "3")?true:false,
			stage:{
				index:$(".stage").length,
				len:$(".stage").length
			},
			Case:{
				index:$(".case-item").length,
				len:$(".case-item").length
			}
		},
		init:function(){
			textareaAutoSize($('textarea'));
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
			this.valdate("#sellerForm");
		},
		
		checkStageRadio:function(e){
			var target = $(e.currentTarget);
			if(target.val()=="1"){
				this.updateRules("#stageMain","add");
				$("#stageMain").show();
			}else{
				this.updateRules("#stageMain","remove");
				$("#stageMain").hide();
			}
		},
		// 固定或浮动价格
		checkPriceRadio:function(e){
			var self = this;
			var target = $(e.currentTarget);
			if(target.prop("checked")){
				this.updateRules(target.closest('.radio').siblings('.radio'),"remove");
				this.updateRules(target.closest('.radio'),"add");
				if(target.val() == "3"){
					this.vars.floatPrice = true;
					$('.js-stage-radio label:eq(0) input[type="radio"]').trigger("click");
					$(target.data("target")).each(function(index,item){
						$(item).hide();
						self.updateRules(item,"remove");
					})
				}else{
					this.vars.floatPrice = false;
					$(target.data("target")).each(function(index,item){
						$(item).show();
						self.updateRules(item,"add");
					})
				}
			}
		},
		addStage:function(e){
			var target = $(e.currentTarget);
			var stageId = "Stage"+("a"+new Date().getTime()).substring(7,14);
			target.closest('.stage').before(template({stage:true,id:stageId,floatPrice:this.vars.floatPrice,index:this.vars.stage.index,len:this.vars.stage.len}));
			this.updateRules("#"+stageId,"add");
			this.vars.stage.index ++;
			this.vars.stage.len ++;
			textareaAutoSize($("#"+stageId+" textarea"));
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
		delStage:function(e){
			var target = $(e.currentTarget).closest('.stage');
			this.updateRules(target,"remove");
			target.remove();
			this.vars.stage.len--;
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
					if($("#input-tags").val()==""){
						return mySeller.alert("至少填写一个关键字")
					}
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