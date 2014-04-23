
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


document.addEventListener('DOMContentLoaded',function(){
	hexagon.init();
});


var hexagon = (function(o){

	
	var canvas , ctx;	
	var W , H;
	
	var animationObjLimit = 30;  //animationObjLimit
	var animationStack = [];
	var animationCounter = 0;

	var resize = function(){
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;		
		clean();		
	}

	var clean = function(){
		//ctx.fillStyle = "white";
		var lingrad = ctx.createLinearGradient(0,H,W,0);
		lingrad.addColorStop(0, 'rgba(231,210,39,1)');
		lingrad.addColorStop(0.3, 'rgba(104,21,98,1)');
		lingrad.addColorStop(0.6, 'rgba(162,91,16,1)');
	    lingrad.addColorStop(0.9, 'rgba(58,97,176,1)');
		ctx.fillStyle = lingrad;
		ctx.fillRect(0,0,W,H);
	}
	
	o.drawHexagon = function(x, y , radius , opacity){				
		ctx.beginPath();

		//chrome Hack!
		ctx.arc(0 , 0 , 0.1 , 0 , Math.PI*2, true);

		opacity = (opacity > 0.8) ? 0.8 : opacity;
		opacity = (opacity < 0) ? 0 : opacity;

		lingrad = ctx.createLinearGradient(x-radius,y-radius,x+radius,y+radius);
		lingrad.addColorStop(0, 'rgba(255,255,255,0)');		
	    lingrad.addColorStop(1, 'rgba(255,255,255,'+opacity/2+')');

		ctx.fillStyle = lingrad;

		var initParse = Math.PI*(1/6);		
		ctx.moveTo( x + radius*Math.cos(initParse), y+radius*Math.sin(initParse));
		for (var i = 1; i < 6; i++) {			
		    ctx.lineTo( x + radius*Math.cos(i*2*Math.PI/6+initParse) , y+radius*Math.sin(i*2*Math.PI/6+initParse));
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
		obj.x = Math.random()*W;
		obj.y = Math.random()*H;
		obj.radius = (Math.random()*8+4)*10;
		obj.opacity = 0.001;	
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
		while(animationStack.length < animationObjLimit){			
			animationStack.push({
				radius : (Math.random()*8+4)*10,
				x  : Math.random()*W,
				y  : Math.random()*H,
				opacity : 0.001,
				increment: 1,
				animationSpeed : Math.random()*0.05 + 0.05
			});
		}
	}

	var redraw = function(){
		requestAnimFrame(redraw);
		animationCounter++;
		if(animationCounter < 4){
			return;
		}
		animationCounter = 0;

		clean();
		var stackLength = animationStack.length;
		var obj ;
		for(var i = 0 ; i < stackLength ; i++){
			obj = animationStack[i];			
			o.drawHexagon(obj.x , obj.y , obj.radius , obj.opacity );
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
		window.addEventListener("resize" , resize);
		resize();
		initStack();
		update();
		redraw();		
	}

	return o;

})( hexagon || {} );


