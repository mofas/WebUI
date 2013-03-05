
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
	var isPause = false;

	var parallelMode = false;
	
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
			var innerR , outerR , startAngle , endAngle;

		    if(endAngle > 360){
		    	var subAngle = Math.random()*startAngle;
		    	startAngle -= subAngle;
		    	endAngle -= subAngle;
		    }

			if(parallelMode){
				innerR = (maxRadius/(animationObjLimit*2))*animationStack.length;
				outerR = (maxRadius/(animationObjLimit*2))*(animationStack.length+1);
				startAngle = Math.floor(Math.random()*36)*10;
			    endAngle = startAngle + Math.floor(Math.random()*90) + 30;
			}
			else{
				innerR = Math.floor(Math.random()*maxRadius/4) + maxRadius/4;
			    outerR = innerR + Math.floor(Math.random()*maxRadius/4);
			    startAngle = Math.floor(Math.random()*36)*10;
			    endAngle = startAngle + Math.floor(Math.random()*90) + 30;
			}

			animationStack.push({
				innerR : innerR,
				outerR : outerR,				
				startAngle : startAngle,
				endAngle: endAngle,
				angularSpeed : Math.floor(Math.random()*10)*0.25 + 0.5,
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

		if(isPause)
			return;

		var arcObj;
		for(var i = 0 , max = animationStack.length; i < max ;i++){		
			arcObj = animationStack[i];
			arcObj.startAngle += arcObj.angularSpeed*arcObj.direction;
			arcObj.endAngle += arcObj.angularSpeed*arcObj.direction;
		}
	}


	var redraw = function(){
		
		requestAnimFrame(redraw);

		if(isPause)
			return;

		clean();
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

	o.stop = function(){
		isPause = true;
	}

	o.start = function(){
		isPause = false;		
	}

	o.changeMode = function(){
		parallelMode = !parallelMode;		
	}

	o.restart = function(){
		o.start();
		animationStack = [];
		initStack();
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


