
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
	doubleHelix.init();
});




var doubleHelix = (function(o){

	var canvas , ctx;	
	var W , H;

	var phaseDiff = Math.PI,
		deltaDegree = 0.0025,
		phaseVelocity = 0.05;

	var amplitude = W/2,
		phase = 0;
	

	var resize = function(){
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,W,H);
		amplitude = W/4;
	}


	var drawHelixLayout = function(){		

		ctx.beginPath();
		ctx.lineWidth = 1;
		var originX = 0;
		var originY = 0;
		var x;
		var y;
		var rotateAngle = 0;

		ctx.moveTo( 0 , 0);

		for(var i = 0; i < 2*H ; i+= 5){
			originX = 0 + (Math.sin(i*deltaDegree + phase)*amplitude);
			originY = i;
			//rotate 
			rotateAngle = Math.PI/6;
			x = originX*Math.cos(rotateAngle) + originY*Math.sin(rotateAngle);
			y = - originX*Math.sin(rotateAngle) + originY*Math.cos(rotateAngle);
			ctx.lineTo(x , y);
		}
		ctx.strokeStyle = "#333";		
				
		ctx.moveTo(0 , 0);		

		for(var i =0; i < 2*H; i+= 6){
			originX = 0 + (Math.sin(i*deltaDegree + phase + phaseDiff)*amplitude)
			originY = i;			
			//rotate 
			rotateAngle = Math.PI/5;
			x = originX*Math.cos(rotateAngle) + originY*Math.sin(rotateAngle);
			y = - originX*Math.sin(rotateAngle) + originY*Math.cos(rotateAngle);
			ctx.lineTo(x , y);
		}
		ctx.strokeStyle = "#333";
		
		
		ctx.stroke();		

		phase += phaseVelocity;
	}


	var fadeOut = function(){
		ctx.fillStyle = "rgba(255,255,255,1)";
		ctx.fillRect(0,0,W,H);
	}

	var helixAnimation = function(){
		fadeOut();
		drawHelixLayout();
		setTimeout(helixAnimation , 100);
	}


	o.init = function(){
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");		
		//$(window).on("resize" , resize);
		resize();		
		helixAnimation();
		//drawHelixLayout();
	}

	return o;

})( doubleHelix || {} );