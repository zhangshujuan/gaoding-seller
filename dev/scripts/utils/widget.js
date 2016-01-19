define(function(require, exports, module) {
	var $ = require('jquery');
	var widget = function(element,options) {
		var self = this;
		this.element = $(element);
		this.Event = {};
		this.initialize=function(element){
			self.init && this.init();
			self.eventBind($.proxy(self,"afterBind"));
		}
		this.eventBind=function(callback){
			$.each(this.Event,function(index,itemFn){
				var nbs = index.split(' ');
				var evtName = nbs.pop();
				self.element.delegate(nbs.join(' '),evtName,(typeof(itemFn) == 'function')?itemFn:$.proxy(self,itemFn));
			});
			callback && callback();
		}
		this.extend = function(_options){
			$.each(_options,function(index,item){
				self[index] = item;
			})
			return self;
		}
		this.extend(options);
		this.initialize();
		return this;
	};
	module.exports = widget;
})