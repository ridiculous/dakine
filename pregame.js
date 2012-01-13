    $.fn.pregame = function(opt){
    	var o = $.extend({ imgs : [] },opt);
    	return this.each(function(){
    		$(o.imgs).each(function(){
	            (new Image()).src = this;
	        });
    	});
    	
    }
