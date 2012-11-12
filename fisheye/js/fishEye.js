

$(document).ready(function() {
	fishEye.init();
});

var fishEye = (function(o){

	var $gallery , $lis;
	var initOffsetX , containerOffset , timer , cursorX , cursorY;
	var LiW = 100 , LiMargin = 0;

	o.init = function(){
		$gallery = $("#fishEyeGallery");
		$lis = $gallery.find("li");
		containerOffset = $gallery.offset();
		bindEvent();
		initLi();
	}

	var initLi = function(){
		initOffsetX = ($gallery.width() - $lis.length*LiW)/2;
		$gallery.find("li").each(function(i){
			$(this).css({
				left: i*(LiW+LiMargin) + initOffsetX,
				width: LiW,
			});
		});
	}

	var bindEvent = function(){
		$gallery.on("mouseenter" , function(){
			timer = setInterval(checkCursor , 20);
		});
		$gallery.on("mouseleave" , function(){
			clearTimeout(timer);
			resetLi();
		});
		$gallery.on("mousemove" , function(e){
			cursorX = e.pageX;
			cursorY = e.pageY;
		});
	}

	var checkCursor = function(){
		var relX , relY , rrX , index , ratioX , ratioY , ampRate , leftAmpRate , rightAmpRate;	

		relX = cursorX - containerOffset.left - initOffsetX;
		relY = cursorY - containerOffset.top;		
		rrX = relX/100;
		//index is the target Li`s index.
		index = Math.round(rrX-0.5);
		if(index < 1 ){
			index = 0;
		}
		else if(index > $lis.length-1){
			index = $lis.length-1;
		}
			
		resetLi();

		var dxL = 0 , dxR = 0;
		var $target = $lis.eq(index);		
		dxL = dxR = adjustTargetLi($target , index , 0 , 5 , 0);
		dxR = adjustTargetLi($target.next() , index  , 1 , 4 , dxR);
		dxL = adjustTargetLi($target.prev() , index ,  -1 , 4 , dxL);
		dxR = adjustTargetLi($target.next().next() , index  , 2 , 3 , dxR);
		dxL = adjustTargetLi($target.prev().prev() , index  , -2 , 3 , dxL);			
		adjustGalleryOffset(index , dxL , dxR);
	}



	var adjustTargetLi = function($target , index , relativePosition , zindex , dx){		
		if($target.length < 1){
			return dx;
		}			
		var relX , relY , rrX , ratioX , ratioY , ampRate;
		var objOffset = $target.offset();
		var objOffsetX = objOffset.left;
		var objOffsetY = objOffset.top;
		
		relX = cursorX - objOffsetX - initOffsetX + initOffsetX - LiW/2;
		relY = cursorY - objOffsetY;
		rrX = relX/LiW;

		ratioX = 1 - (Math.abs(rrX)-0.5);		
		ratioY = 1 - (Math.abs(relY-60))/300;		

		ratioX = ratioX*0.5;

		ratioY = ratioY*1.1;

		// amplified rate = ratioY + ratioX	
		ampRate = (ratioY + ratioX);

		if(ampRate < 1){
			ampRate = 1;
		}
		else if(ampRate > 1.8){
			ampRate = 1.8;
		}		

		var direction = 0;
		var ampdx = 0;

		if(relativePosition > 0){
			direction  = 1;
		}
		else if(relativePosition < 0){
			direction = -1;		
			ampdx = (LiW)*(ampRate-1)/2;
		}
		else{
			ampdx = (LiW)*(ampRate-1)/2;
		}
				
		$target.css({
			'left'		: (index+relativePosition)*(LiW+LiMargin) + initOffsetX - ampdx + dx*direction,
			'width'		: LiW*ampRate,			
			'z-index'	: zindex,
		});
		
		return ampdx + dx;
		
	}


	var adjustGalleryOffset = function(index , dxL , dxR){		
		$lis.each(function(i){			
			if(i < index -2 ){
				$(this).css({
					left 		: i*(LiW+LiMargin) + initOffsetX - dxL,
					width		: LiW,
					'margin-left' : 0,
					'z-index'	: 0,
				});
			}
			else if(i > index + 1){
				$(this).css({
					left 		: i*(LiW+LiMargin) + initOffsetX + dxR,
					width		: LiW,
					'margin-left' : 0,
					'z-index'	: 0,
				});
			}
		});
	}

	var resetLi = function(){
		$lis.each(function(i){
			$(this).css({
				left 		: i*(LiW+LiMargin) + initOffsetX,
				width		: LiW,
				'margin-left' : 0,
				'z-index'	: 0,
			});
		});
	}

	return o;

})( fishEye || {} );