
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


$(document).ready(function() {
	arc.init();
});



var arc = (function(o){

	
	var canvas , ctx;	
	var W , H , maxRadius;
	
	var animationObjLimit = 20;  //animationObjLimit
	var animationStack = [];
	var animationCounter = 0;

	var resize = function(){
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;		
		maxRadius = Math.min(W , H)*2/3;
		clean();
		redraw();
	}

	var initStack = function(){
		while(animationStack.length < animationObjLimit){
			var 
			    innerR = Math.floor(Math.random()*maxRadius/4) + maxRadius/4,
			    outerR = innerR + Math.floor(Math.random()*maxRadius/4),
			    startAngle = Math.floor(Math.random()*36)*10,
			    endAngle = startAngle + Math.floor(Math.random()*90) + 30;
			    if(endAngle > 360){
			    	var subAngle = Math.random()*startAngle;
			    	startAngle -= subAngle;
			    	endAngle -= subAngle;
			    }			    

			animationStack.push({
				innerR : innerR,
				outerR : outerR,				
				startAngle : startAngle,
				endAngle: endAngle,
				angularSpeed : Math.floor(Math.random()*5)*0.5 + 0.5,
				color: "rgba( 0 , 0 , 0 , " +(0.1+Math.random()*0.3)+ ")",
				direction : (Math.random()*2 > 1) ? 1 : -1
			});
		}
		
	}


	var clean = function(){
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0,0,W,H);
	}
	
	var update = function(){
		requestAnimFrame(update);
		var arcObj;
		for(var i = 0 , max = animationStack.length; i < max ;i++){		
			arcObj = animationStack[i];
			arcObj.startAngle += arcObj.angularSpeed*arcObj.direction;
			arcObj.endAngle += arcObj.angularSpeed*arcObj.direction;
		}
	}


	var redraw = function(){
		clean();
		requestAnimFrame(redraw);
		var arcObj;
		for(var i = 0 , max = animationStack.length; i < max ;i++){			
			arcObj = animationStack[i];

			//console.log(arcObj.innerR , arcObj.startAngle , arcObj.endAngle);
			ctx.beginPath();
			ctx.arc(W/2, H/2 , arcObj.innerR , arcObj.startAngle*Math.PI/180 , arcObj.endAngle*Math.PI/180);
			ctx.lineWidth = arcObj.outerR - arcObj.innerR;			
		    ctx.strokeStyle = arcObj.color;		    		    
		    ctx.stroke();
		}		
	}



	o.init = function(){
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");		
		$(window).on("resize" , resize);		
		resize();
		initStack();
		redraw();
		update();				
	}

	return o;

})( arc || {} );


