;(function ($) {
	    
	
	    $.fn.cameraWork =  function(option){
	        
	        var e = this;
	        var o = $.extend( {}, $.fn.cameraWork.defaults , option);
	        
	        
	        init(e,o);            
	 
	        function init(e,o){
	            
	            var $element = $(e),
	                $img = $element.find("img");
	            
	            $element.css({
	                'overflow' : 'hidden',
	                'width' : o.width + 'px',
	                'height' : o.height + 'px',
	                'position' : 'relative',                                            
	            });
	            
	            
	            //»Ý­n­×¥¿......
	            $img = $img.eq(0);
	            
	            console.log($img);
	            console.log($img.width());
	            console.log($img.height());
	            
	            var initImgWidth , initImgHeight ,
	                finalImgWidth , finalImgHeight ,
	                viewCenter_x , viewCenter_y,
	                animationTime;
	                            
	            if(o.fromScale > o.toScale){
	                initImgWidth = $img.width()*o.fromScale/100;
	                initImgHeight = $img.height()*o.fromScale/100;
	                finalImgWidth = $img.width()*o.toScale/100;
	                finalImgHeight = $img.height()*o.toScale/100;                                 
	            }
	            else{
	                initImgWidth = $img.width()*o.fromScale/100;
	                initImgHeight = $img.height()*o.fromScale/100;                                            
	                finalImgWidth = $img.width()*o.toScale/100;
	                finalImgHeight = $img.height()*o.toScale/100;                    
	            }
	            
	            $img.hide();
	            
	            //avert too small maintain scale
	            var scale = 1;
	            if(initImgWidth < o.width ){
	                scale = initImgWidth/o.width;
	                initImgWidth = o.width;
	                initImgHeight = initImgHeight/scale;
	            }
	            if(initImgHeight < o.height){
	                scale = initImgHeight / o.height;
	                initImgHeight = o.height;
	                initImgWidth = initImgWidth/scale;
	            }
	            if(finalImgWidth < o.width ){
	                scale = finalImgWidth / o.width;
	                finalImgWidth = o.width;
	                finalImgHeight = finalImgHeight/scale;
	            }
	            if(finalImgHeight < o.height){
	                scale = finalImgHeight / o.height;
	                finalImgHeight = o.height;
	                finalImgWidth = finalImgWidth/scale;
	            }
	            
	            
	            
	            
	            if(o.fromScale > o.toScale){
	                viewCenter_x = (initImgWidth - o.width)/2;       
	                viewCenter_y = (initImgHeight - o.height)/2;
	            }
	            else{
	                viewCenter_x = (finalImgWidth - o.width)/2;       
	                viewCenter_y = (finalImgHeight - o.height)/2;           
	            }
	            
	            
	            
	            if(o.animationTime < 1000) 
	                animationTime = 1000;
	            else 
	                animationTime = o.animationTime;
	                                    
	
	            $element.data("initImgWidth"  , initImgWidth );
	            $element.data("initImgHeight" , initImgHeight );
	            $element.data("finalImgWidth" , finalImgWidth );
	            $element.data("finalImgHeight", finalImgHeight );
	            $element.data("animationTime", animationTime);             
	            $element.data("viewCenter_x", viewCenter_x);
	            $element.data("viewCenter_y", viewCenter_y);
	
	                       
	            function triggerEvent(){
	                var $element = $(this),
	                    $img = $element.find("img"),
	                    sequence;
	                if($img.length > 0){
	                    sequence = $element.data("sequence");
	                    if(sequence == null || sequence >= $img.length-1){
	                        sequence = 0;
	                    }
	                    else
	                        sequence++;                    
	                }	                
	                
	                $img = $img.eq(sequence);
	                $element.data("sequence" , sequence);
	                var initImgWidth = $element.data("initImgWidth"),
	                    initImgHeight = $element.data("initImgHeight"),
	                    finalImgWidth= $element.data("finalImgWidth"),
	                    finalImgHeight= $element.data("finalImgHeight"),
	                    viewCenter_x= $element.data("viewCenter_x"),
	                    viewCenter_y= $element.data("viewCenter_y");
	
	                
	                var initX , initY , finalX , finalY , 
	                    limit_x , limit_y;
	                
	                    
	                if(initImgWidth >= finalImgWidth){
	                   limit_x = finalImgWidth- $element.width();
	                   limit_y = finalImgHeight- $element.height();
	                   initX = viewCenter_x;
	                   initY = viewCenter_y;                    
	                   finalX =  Math.floor(Math.random()*(limit_x) );
	                   finalY = Math.floor(Math.random()*(limit_y) );   
	                }
	                else{
	                   limit_x = initImgWidth - $element.width();
	                   limit_y = initImgHeight - $element.height();
	                   finalX = viewCenter_x;
	                   finalY = viewCenter_y;                    
	                   initX =  Math.floor(Math.random()*(limit_x) );
	                   initY =  Math.floor(Math.random()*(limit_y) );                                                               
	                }
	                                
	
	                $element.data("finalX" , finalX);
	                $element.data("finalY" , finalY);
	                
	                $img.css({
	                    'position'    : 'absolute',
	                    'bottom'      : -initY + 'px',
	                    'left'        : -initX + 'px', 
	                    'width'       : initImgWidth  + 'px',
	                    'height'      : initImgHeight  + 'px',
	                });                 
	                
	                $element.queue("camAn", function(next){
	                    var animationTime = $(this).data("animationTime");
	                    var sequence = $(this).data("sequence");
	                    $(this).find("img").eq(sequence).fadeIn( animationTime/6 , next);
	                });
	                
	                
	                $element.queue("camAn", function(next){
	                    var animationTime = $(this).data("animationTime"),                         
	                        finalX = $(this).data("finalX"),
	                        finalY = $(this).data("finalY"),
	                        finalImgWidth = $(this).data("finalImgWidth"),
	                        finalImgHeight= $(this).data("finalImgHeight"),
	                        sequence = $(this).data("sequence");	                    
	                    $(this).find("img").eq(sequence).animate( 
	                        { 
	                            bottom: -finalY ,
	                            left:   -finalX , 
	                            width : finalImgWidth + 'px',
	                            height : finalImgHeight + 'px',
	                         } ,
	                        2*animationTime/3 ,
	                        
	                        next);                        
	                });   
	                
	                
	                
	                $element.queue("camAn" , function(next){
	                    var animationTime = $(this).data("animationTime");
	                    var sequence = $(this).data("sequence");
	                    $(this).find("img").eq(sequence).fadeOut( animationTime/6 , next);    
	                });
	                
	                $element.queue("camAn" , function(next){
	                    $element.trigger("cameraWork");
	                });                
	
	                $element.dequeue("camAn");
	                           
	            }; 
	            
	            $element.bind("cameraWork" , triggerEvent);                       
	            $element.trigger("cameraWork");
	        };        

	        
	    }
	    
	    $.fn.cameraWork.defaults = {
	        width : 960,
	        height : 640, 
	        fromScale : 95,
	        toScale : 75, 
	        animationTime : 8000,  
	    };    

	  
	})(jQuery);
	
