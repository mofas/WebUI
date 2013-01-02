
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
	hexagon.init();
});


var hexagon = (function(o){

	
	var canvas , ctx;	
	var W , H;

	var radius = 80;
	var margin = 20;
	var animationObjLimit = 10;  //animationObjLimit must fewer than layoutPositions.length
	var layoutPositions = [];
	var animationStack = [];
	var animationCounter = 0;

	var resize = function(){
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;		
		clean();
		layoutPositions = [];	
		drawlayout();		
		animationObjLimit = Math.floor(layoutPositions.length/5);
	}

	var clean = function(){
		//ctx.fillStyle = "white";
		var lingrad = ctx.createLinearGradient(0,H,W,0);
		lingrad.addColorStop(0, 'rgba(255,125,255,1)');
		lingrad.addColorStop(0.5, 'rgba(255,255,125,1)');
	    lingrad.addColorStop(1, 'rgba(125,255,255,1)');
		ctx.fillStyle = lingrad;
		ctx.fillRect(0,0,W,H);
	}


	var drawlayout = function(){
		
		var sqr3 = Math.sqrt(3);		
		var layer = 0;
		var x = 0 , y = 0;
		var lingrad;
		for(var i = -radius ; i < (W+radius); i += radius*(sqr3)){
			layer = 0;
			for(var j = -radius ; j < (H+radius) ; j += radius*(3/2)){	
				layer++;
				if((layer%2) == 0){					
					x = i;
					y = j;
				}
				else{					
					x = i - radius*(sqr3/2);
					y = j;					
				}				
				layoutPositions.push({ x: x , y: y});	
				//o.drawHexagon(x , y);				
			}
		}			
	}

	o.drawHexagon = function(x, y , opacity){				
		ctx.beginPath();

		//chrome Hack!
		ctx.arc(0 , 0 , 0.1 , 0 , Math.PI*2, true);

		opacity = (opacity > 0.8) ? 0.8 : opacity;
		opacity = (opacity < 0) ? 0 : opacity;

		lingrad = ctx.createLinearGradient(x-radius,y-radius,x+radius,y+radius);
		lingrad.addColorStop(0, 'rgba(255,255,255,0)');		
	    lingrad.addColorStop(1, 'rgba(255,255,255,'+opacity+')');
		ctx.fillStyle = lingrad;

		var realRadius = (radius-margin);			
		var initParse = Math.PI*(1/6);		
		ctx.moveTo( x + realRadius*Math.cos(initParse), y+realRadius*Math.sin(initParse));
		for (var i = 1; i < 6; i++) {			
		    ctx.lineTo( x + realRadius*Math.cos(i*2*Math.PI/6+initParse) , y+realRadius*Math.sin(i*2*Math.PI/6+initParse));
		}
		ctx.closePath();
		ctx.lineWidth = "2";
		ctx.strokeStyle = "rgba(255,255,255,"+opacity/2+")";
		ctx.stroke();
		ctx.fill();
		
	}


	var update = function(){		
		var obj;

		//refresh obj with opacity < 0 and increment == 0
		// revert obj with opacity > 1 and increment == 1
		for(var i=0;i < animationStack.length ; i++){
			obj = animationStack[i];
			if(obj.opacity > 1 && obj.increment == 1){				
				obj.increment = 0;
			}
			if(obj.opacity < 0 && obj.increment == 0){
				refreshObj(obj);
			}			
		}
		
		setTimeout(arguments.callee , 500);
	}

	var refreshObj = function(obj){
		var positionsObj;		

		var randomIndex = Math.floor(Math.random()*layoutPositions.length);
		while(beUsed(randomIndex)){
			randomIndex = Math.floor(Math.random()*layoutPositions.length);
		}		
		positionsObj = layoutPositions[randomIndex];

		obj.x = positionsObj.x;
		obj.y = positionsObj.y;
		obj.opacity = 0.01;	
		obj.increment = 1;
		obj.animationSpeed = Math.random()*0.05 + 0.05;
	}

	var beUsed = function(num){
		var conflict = false;
		for(var i=0 ; i < animationStack.length ; i++){
			if(num == animationStack[i].no)
				conflict = true;
		}
		return conflict;
	}

	var initStack = function(){
		var positionsObj;
		while(animationStack.length < animationObjLimit){
			var randomIndex = Math.floor(Math.random()*layoutPositions.length);
			while(beUsed(randomIndex)){
				randomIndex = Math.floor(Math.random()*layoutPositions.length);
			}
			positionsObj = layoutPositions[randomIndex];
			animationStack.push({
				no : randomIndex,
				x  : positionsObj.x,
				y  : positionsObj.y,
				opacity : 0.01,
				increment: 1,
				animationSpeed : Math.random()*0.05 + 0.05
			});
		}
	}

	var redraw = function(){
		requestAnimFrame(redraw);
		animationCounter++;		
		if(animationCounter < 10){
			return;
		}
		animationCounter = 0;

		clean();
		var stackLength = animationStack.length;
		var obj ;
		for(var i = 0 ; i < stackLength ; i++){
			obj = animationStack[i];			
			o.drawHexagon(obj.x , obj.y , obj.opacity );
			if(obj.increment == 1){
				obj.opacity += obj.animationSpeed;
			}
			else{
				obj.opacity -= obj.animationSpeed;
			}			
		}		
	}

	o.init = function(){
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");		
		$(window).on("resize" , resize);
		resize();
		initStack();
		update();
		redraw();		
	}

	return o;

})( hexagon || {} );


