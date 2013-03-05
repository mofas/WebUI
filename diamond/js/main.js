
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

Object.prototype.clone = function() {
	var newObj = (this instanceof Array) ? [] : {};
	for (i in this) {
		if (i == 'clone') continue;
		if (this[i] && typeof this[i] == "object") {
			newObj[i] = this[i].clone();
		} 
		else 
			newObj[i] = this[i]
	} 

	return newObj;
};

$(document).ready(function() {
	diamond.init();
});


var diamond = (function(o){

	
	var canvas , ctx;	
	var W , H , radius , margin = 5;	
	var centerX , centerY;
	var animationCounter = 0,
		colorAnimationCounter = 0;
	var lineList = [];

	var color1 = 255,
		color2 = 245,
		color3 = 235,
		color4 = 225,
		color5 = 215,
		color6 = 205,
		color7 = 195,
		color8 = 185;

	var resize = function(){
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;
		radius = Math.min(W , H)/3;
		getAbstractPattern();
	}

	var clean = function(){
		ctx.fillStyle = "#000";
		ctx.fillRect(0,0,W,H);
	}

	var drawLayout = function(){		
		centerX = W/2,
		centerY = H/2;
		
		var radian = 2*Math.PI;
	
		//draw outer
		ctx.beginPath();		
		ctx.arc(0 , 0 , 0.1 , 0 , Math.PI*2, true); //chrome Hack!
		ctx.moveTo(centerX , centerY + radius );
		for(var i = 1 ; i <= 4 ; i++){			
			ctx.lineTo(centerX + radius*Math.cos(radian*i/4)*(((i+1)%2)*2/3) , centerY + radius*Math.sin(radian*i/4));
		}
		ctx.closePath();
		ctx.lineWidth = margin;
		ctx.strokeStyle = "#fff";
		ctx.stroke();
		drawAbstractPattern();
	}


	var getAbstractPattern = function(){
 		//four line x*3/2 + y = r , x*3/2 - y = r , -x*3/2 + y = r , -x*3/2 - y = r 
 		//select 3 point at four line individually
 		lineList = [];
 		var line1 = [],
 			line2 = [],
 			line3 = [],
 			line4 = [];
 		
 		var point , x , y;

 		for(var i = 0 ; i < 3 ; i++){
 			x = Math.random()*radius/3 + radius/3;
 			line1.push({x: x ,y:radius-x*3/2});
 			x = Math.random()*radius/3 + radius/3;
 			line2.push({x:-x ,y:radius-x*3/2});
 			x = Math.random()*radius/3 + radius/3;
 			line3.push({x:-x ,y:x*3/2-radius});
 			x = Math.random()*radius/3 + radius/3;
 			line4.push({x: x ,y:x*3/2-radius});
 		} 		

 		var lineCollection = [line1,line2,line3,line4]; 

 		while(lineCollection.length > 1){ 			
 			var fromLineIndex = Math.floor(Math.random()*lineCollection.length);
 			var toLineIndex = Math.floor(Math.random()*lineCollection.length); 			
 			if(lineCollection[fromLineIndex].length == 0){
 				lineCollection.splice(fromLineIndex , 1);
 				continue;
 			}

 			if(lineCollection[toLineIndex].length == 0){
 				lineCollection.splice(toLineIndex , 1);
 				continue;
 			}

 			//if fromline equal toline
 			if(fromLineIndex == toLineIndex){
 				continue;
 			}

 			var fromLine = lineCollection[fromLineIndex];
 			var toLine = lineCollection[toLineIndex]; 			
			var p1Index = Math.floor(Math.random()*fromLine.length);
			var p2Index = Math.floor(Math.random()*toLine.length);
			var p1 = fromLine[p1Index];
			var p2 = toLine[p2Index];			
			fromLine.splice(p1Index,1);
			toLine.splice(p2Index,1);
			lineList.push({p1:{x:p1.x ,y :p1.y} , p2:{x:p2.x , y:p2.y}});
 		}

	}


	var drawAbstractPattern = function(){

 		ctx.beginPath();
 		var line;
 		for(var i =0; i < lineList.length ;i++){
 			line = lineList[i];
			ctx.moveTo(centerX+line.p1.x , centerY+line.p1.y);
			ctx.lineTo(centerX+line.p2.x , centerY+line.p2.y);
 		}

 		ctx.strokeStyle = "rgba(255,255,255,0.15)";
 		ctx.stroke(); 		
 		
	}


	var redraw = function(){
		requestAnimFrame(redraw);		

		animationCounter++;		
		if(animationCounter > 60){
			animationCounter = 0;					
		}

		if(animationCounter % 11 == 0){
			getAbstractPattern();
		}

		if(animationCounter % 3 == 0){
			colorAnimationCounter++;			
			color1 = Math.floor(Math.cos((colorAnimationCounter+0)*Math.PI/30)*55) + 200;
			color2 = Math.floor(Math.cos((colorAnimationCounter+6)*Math.PI/30)*55) + 200;
			color3 = Math.floor(Math.cos((colorAnimationCounter+12)*Math.PI/30)*55) + 200;
			color4 = Math.floor(Math.cos((colorAnimationCounter+18)*Math.PI/30)*55) + 200;
			color5 = Math.floor(Math.cos((colorAnimationCounter+24)*Math.PI/30)*55) + 200;
			color6 = Math.floor(Math.cos((colorAnimationCounter+32)*Math.PI/30)*55) + 200;
			color7 = Math.floor(Math.cos((colorAnimationCounter+48)*Math.PI/30)*55) + 200;
			color8 = Math.floor(Math.cos((colorAnimationCounter+54)*Math.PI/30)*55) + 200;			
		}
		else{			
			return;
		}		

		if(colorAnimationCounter > 60){
			colorAnimationCounter = 0;			
		}		


		clean();
		drawLayout();

		//divide to eight block
		var drawBlock = function(pa , pb , luminosity){
			ctx.beginPath();
			ctx.arc(0 , 0 , 0.1 , 0 , Math.PI*2, true); //chrome Hack!
			ctx.moveTo(centerX , centerY);
			ctx.lineTo(pa.x , pa.y);
			ctx.lineTo(pb.x , pb.y);	
			ctx.closePath();
			ctx.fillStyle = "rgba("+luminosity+","+luminosity+","+luminosity+",0.8)";				
			ctx.fill();
		}
		
		//top-right		
		drawBlock(
			{ x: centerX , y : centerY - radius + margin/2 },
		 	{ x: centerX + radius*1/3 - margin/2, y : centerY - radius/2 },
		  	color1
		);
		//right-top
		drawBlock(
			{ x: centerX + radius*1/3 - margin/2, y : centerY - radius/2 },
		 	{ x: centerX + radius*2/3 - margin/2, y : centerY },
		  	color2
		);
		//right-bottom
		drawBlock(
			{ x: centerX + radius*2/3 - margin/2, y : centerY  },
		 	{ x: centerX + radius*1/3 - margin/2, y : centerY + radius/2 },
		  	color3
		);
		//bottom-right
		drawBlock(
			{ x: centerX + radius*1/3 - margin/2, y : centerY + radius/2 },
			{ x: centerX, y : centerY + radius - margin/2 },		 	
		  	color4
		);		
		//bottom-left
		drawBlock(
			{ x: centerX, y : centerY + radius - margin/2 },		 	
			{ x: centerX - radius*1/3 + margin/2, y : centerY + radius/2 },			
		  	color5
		);
		//left-bottom
		drawBlock(
			{ x: centerX - radius*1/3 + margin/2, y : centerY + radius/2 },
			{ x: centerX - radius*2/3 + margin/2, y : centerY},
		  	color6
		);
		//left-top
		drawBlock(
			{ x: centerX - radius*2/3 + margin/2, y : centerY},
			{ x: centerX - radius*1/3 + margin/2, y : centerY - radius/2 },			
		  	color7
		);
		//top-left
		drawBlock(
			{ x: centerX - radius*1/3 + margin/2, y : centerY - radius/2 },			
			{ x: centerX , y : centerY - radius + margin/2 },			
		  	color8
		);


	}

	o.init = function(){
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");		
		$(window).on("resize" , resize);
		resize();		
		redraw();
	}

	return o;

})( diamond || {} );


