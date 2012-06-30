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
	            
	            $img.hide();
	            
	            var animationTime;
	            
	            if(o.animationTime < 4000) 
	                animationTime = 4000;
	            else 
	                animationTime = o.animationTime;
	                
	            $element.data("o" , o);    
	                
	                       
	            function triggerEvent(){
	                var $element = $(this),
	                	o = $element.data("o"),
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
	                
	                var imgWidth , imgHeight,
	                initImgWidth , initImgHeight ,
	                finalImgWidth , finalImgHeight ,
	                viewCenter_x , viewCenter_y;
	                
					imgWidth = $img.width();
	 				imgHeight = $img.height();
	                            
		            if(o.fromScale > o.toScale){
		                initImgWidth = imgWidth*o.fromScale/100;
		                initImgHeight = imgHeight*o.fromScale/100;
		                finalImgWidth = imgWidth*o.toScale/100;
		                finalImgHeight = imgHeight*o.toScale/100;                                 
		            }
		            else{
		                initImgWidth = imgWidth*o.fromScale/100;
		                initImgHeight = imgHeight*o.fromScale/100;                                            
		                finalImgWidth = imgWidth*o.toScale/100;
		                finalImgHeight = imgHeight*o.toScale/100;                    
		            }
			            
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
			            
					$element.data("finalImgWidth" , finalImgWidth);
	                $element.data("finalImgHeight" , finalImgHeight);	
			            
		
		            if(o.fromScale > o.toScale){
		                viewCenter_x = (initImgWidth - o.width)/2;       
		                viewCenter_y = (initImgHeight - o.height)/2;
		            }
		            else{
		                viewCenter_x = (finalImgWidth - o.width)/2;       
		                viewCenter_y = (finalImgHeight - o.height)/2;           
		            }

	                
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
	                    var o = $(this).data("o");
	                    var animationTime = o.animationTime;	                    
	                    var sequence = $(this).data("sequence");
	                    $(this).find("img").eq(sequence).fadeIn( 5*animationTime/10 , next);
	                });
	                
	                $element.queue("camAn", function(next){
	                		var o = $(this).data("o");	                    
	                    var animationTime = o.animationTime,                         
	                        finalX = $(this).data("finalX"),
	                        finalY = $(this).data("finalY"),
	                        finalImgWidth = $(this).data("finalImgWidth"),
	                        finalImgHeight= $(this).data("finalImgHeight"),
	                        sequence = $(this).data("sequence");	                                  
	                    $(this).find("img").delay(1*animationTime/10).eq(sequence).animate( 
	                        { 
	                            bottom: -finalY ,
	                            left:   -finalX , 
	                            width : finalImgWidth + 'px',
	                            height : finalImgHeight + 'px',
	                         } ,
	                        4*animationTime/10 ,
	                        next);                        
	                });   
	                
	                
	                $element.queue("camAn" , function(next){
	                    var o = $(this).data("o");
	                    var animationTime = o.animationTime;	     
	                    var sequence = $(this).data("sequence");
	                    $(this).find("img").eq(sequence).delay(3*animationTime/10).fadeOut(2*animationTime/10);
	                    setTimeout(function(){$element.trigger("cameraWork");} , 4.5*animationTime/10);	                    
	                });
	                
	                
	                /**
	                $element.queue("camAn" , function(next){
						$element.trigger("cameraWork");	                    	                    
	                });
	                **/                
	
	                $element.dequeue("camAn");
	                           
	            }; 
	            	            
	            //waiting for all Image load
	            
            	function checkComplete(){
                	var $img = $.fn.cameraWork.checkImage,
                		imageCheck = new Image();
                		imageCheck.src = $img.attr("src");
                		
                	if(!imageCheck.complete){
						setTimeout(checkComplete , 1000);
					}
					else{
						//check next 
						if($img.next().attr("src") != undefined){
							$.fn.cameraWork.checkImage = $img.next();
							checkComplete();
						}
						else{
			            	$element.bind("cameraWork" , triggerEvent);                       
			            	$element.trigger("cameraWork");
			           	}
					}
                }															
				
				$.fn.cameraWork.checkImage = $img.eq(0);
				checkComplete();
	        };        

	        
	    }
	    
	    $.fn.cameraWork.defaults = {
	        width : 960,
	        height : 640, 
	        fromScale : 180,
	        toScale : 60, 
	        animationTime : 8000,  
	    };
	    
	    $.fn.cameraWork.checkImage = {};
	        

	  
})(jQuery);
	
