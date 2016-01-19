define(function(require, exports, module) {
    var Uploader = require("uploader");
    var $ = require("jquery");
    var dataBind = require("dataBind");
    require("cropit");
    //var dataCropit = new dataBind("cropit");
    var cropitUpload = function(element,uploaderEle,options){
    	var self = this;
    	this.element = $(element);
    	this.ajaxData = {};
    	this.ajaxData["url"] = $("#userImg").attr("src");
    	this.options = $.extend({},{
    		uploadConfig:{
    			trigger: uploaderEle || '#upload',
				name: 'realPhoto',
				action: '/openshop/uploadRealPhotoSource',
				accept: 'image/*',
				//data: {'xsrf': 'hash'},
				multiple: true,
				error: function(file){
			    	self.uploaderError(file)
			    },
				success: function(response){
					self.uploaderSuccess(response)
				},
				progress: function(event, position, total, percent, files){
					self.uploaderProgress(event, position, total, percent, files)
				}
    		},
    		uploaderName:"#imageName",
    		cropitElement:element,
    		//uploaderSubmit:"#uploadImg",
    		saveCropitNode:"#saveCropitNode",
    		cropitConfig:{
    			imageState: {
		          src: "#",
		          offset:{
		          	x:0,
		          	y:0
		          }
		        },
		        onZoomChange:function(zoom){
		        	self.ajaxData["zoom"] = zoom
		        	//dataCropit.set('zoom',zoom);
		        },
		        onOffsetChange:function(offset){
		        	self.ajaxData["squarex"] = -offset.x;
		        	self.ajaxData["squarey"] = -offset.y;
		        	//dataCropit.set('squarex',-offset.x);
		        	//dataCropit.set('squarey',-offset.y);
		        },
		        imageBackground: true,
		        maxZoom:1
    		},
    		cropitPost:null
    	},options);
    	this.$Uploader = new Uploader(this.options.uploadConfig).change(function(files){
			var _this = this;
			if(self.options.uploaderName){
				$(self.options.uploaderName).text(files[0].name);
			}
			//self.$cropit.trigger("change.cropit")
			_this.submit();
		});
    	this.$cropit = $(this.options.cropitElement); 
    	$(this.options.saveCropitNode).click(function(e){
            if($.isEmptyObject(self.ajaxData)){
                return mySeller.alert("请先选择图片");
            }
    		$.ajax({
    			url:$(this).data("url"),
    			dataType:"json",
    			data:self.ajaxData,
    			type:"post",
    			success:function(res){
    				self.options.cropitPost && self.options.cropitPost(res);
    			}
    		})
    	})
    	this.cropit();
    }
    cropitUpload.prototype.cropit = function(){
    	this.$cropit.cropit(this.options.cropitConfig);
    }
    cropitUpload.prototype.uploader = function(){
    	this.$Uploader = new Uploader(this.options.uploadConfig)
    }
    cropitUpload.prototype.uploaderError = function(file){
    	console.log(file);
    }
    cropitUpload.prototype.uploaderSuccess = function(response) {
    	response = $.parseJSON(response);
    	console.info(response.realPhotoUrl);
		this.$cropit.cropit("imageSrc",response.realPhotoUrl);
		this.ajaxData["url"] = response.realPhotoUrl;
    };
    cropitUpload.prototype.uploaderProgress = function(event, position, total, percent, files){
        var self = this;
        if(self.options.uploaderName){
            if(percent!=100){
                $(self.options.uploaderName).text(percent+"%");
            }else{
                $(self.options.uploaderName).text(files[0].name);
            }
        }
    	//console.log(percent);
    }
    return cropitUpload;
})
