
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
	circlePattern.init();
});



var circlePattern = (function(o){

	
	var canvas , ctx;	
	var W , H , canvasPerimeter;
	var isPause = false;

	var parallelMode = false;
		
	var patternStack = [];	

	var resize = function(){
		W = window.innerWidth;
		H = window.innerHeight;
		canvasPerimeter = Math.min(W , H);
		canvas.width = W;
		canvas.height = H;		
		redraw();
	}	

	var insertMockObj1 = function(){


		var huePool = [
			"rgb(86, 34, 21)",
			"rgb(129, 64, 26)",
			 "rgb(166, 101, 23)",
			 "rgb(195, 144, 12)",
			 "rgb(213, 192, 7)",
			 "rgb(217, 243, 40)"
		];

		//Single circle
		patternStack.push({			
			R : 0,
			repeatAngle : 360,
			offsetAngle : 0,
			hue : huePool[Math.floor(Math.random()*huePool.length)],
			drawFunction: function(centerX , centerY){
				ctx.beginPath();
				ctx.fillStyle = this.hue;
    			ctx.arc( 0 , 0 , 150 , 0 , Math.PI*2,true);
    			ctx.strokeStyle = this.hue;		    		    
    			ctx.lineWidth = 5;
		    	ctx.stroke();    			
			}
		});

		//Rotate arrow
		patternStack.push({			
			R : 80,
			repeatAngle : 15,
			offsetAngle : 5,
			hue : huePool[Math.floor(Math.random()*huePool.length)],
			drawFunction: function(){
				ctx.beginPath();				
				ctx.moveTo(0 , this.R+8);
				ctx.lineTo(-5 , this.R);
				ctx.lineTo(5 , this.R);				
				ctx.lineWidth = 5;				
			    ctx.strokeStyle = this.hue;
			    ctx.stroke();
			}
		});

		//Rotate triangle
		patternStack.push({			
			R : 100,
			repeatAngle : 24,
			offsetAngle : 4,
			hue : huePool[Math.floor(Math.random()*huePool.length)],
			drawFunction: function(){
				ctx.beginPath();				
				ctx.moveTo(0 , this.R+20);
				ctx.lineTo(-15 , this.R);
				ctx.lineTo(15 , this.R);				
				ctx.lineWidth = 5;				
			    //ctx.strokeStyle = this.hue;
			    //ctx.stroke();
			    ctx.fillStyle = this.hue;
			    ctx.fill();
			    ctx.closePath();
			}
		});

		//Rotate line
		patternStack.push({			
			R : 150,
			repeatAngle : 10,
			offsetAngle : 0,
			hue : huePool[Math.floor(Math.random()*huePool.length)],
			drawFunction: function(){
				ctx.beginPath();				
				ctx.moveTo(0 , this.R-20);
				ctx.lineTo(0 , this.R+20);
				ctx.lineWidth = 5;
			    ctx.strokeStyle = this.hue;
			    ctx.stroke();
			}
		});

		//Rotate circle
		patternStack.push({			
			R : 180,
			repeatAngle : 6,
			offsetAngle : 0,
			hue : huePool[Math.floor(Math.random()*huePool.length)],
			drawFunction: function(centerX , centerY){
				ctx.beginPath();
				ctx.fillStyle = this.hue;
    			ctx.arc( 0 , this.R , 5 , 0 , Math.PI*2,true);
    			ctx.fill();
			}
		});

		//satellite style circles
		patternStack.push({			
			R : 230,
			repeatAngle : 30,
			offsetAngle : 0,
			hue : huePool[Math.floor(Math.random()*huePool.length)],
			drawFunction: function(centerX , centerY){
				var r = 30 , offset = 30;
				ctx.lineWidth = 3;
    			ctx.strokeStyle = this.hue;
				for(var k = 0 , limit = 5 ; k < limit ; k++){
					ctx.beginPath();
					ctx.arc( 0+r*Math.cos((Math.PI/180)*(k/limit)*360+offset) , this.R+r*Math.sin((Math.PI/180)*(k/limit)*360+offset) , 10 , 0 , Math.PI*2,true);
					ctx.stroke();
				}    			    			
			}
		});

		//rotate concentric circles 1 (density style)
		patternStack.push({			
			R : 30,
			repeatAngle : 45,
			offsetAngle : 0,
			hue : huePool[Math.floor(Math.random()*huePool.length)],
			drawFunction: function(centerX , centerY){
				ctx.beginPath();
				ctx.fillStyle = this.hue;
				ctx.strokeStyle = this.hue;		    		    
    			ctx.lineWidth = 5;
    			ctx.arc( 0 , this.R , 10 , 0 , Math.PI*2,true);
    			ctx.fill();
    			ctx.beginPath();
    			ctx.arc( 0 , this.R , 20 , 0 , Math.PI*2,true);
    			ctx.stroke();
    			ctx.beginPath();
    			ctx.arc( 0 , this.R , 30 , 0 , Math.PI*2,true);
    			ctx.stroke();		    	
			}
		});

		//rotate concentric circles 2 (spare style)
		patternStack.push({			
			R : 230,
			repeatAngle : 30,
			offsetAngle : 0,			
			drawFunction: function(centerX , centerY){
				ctx.beginPath();
				ctx.fillStyle = huePool[Math.floor(Math.random()*huePool.length)];
    			ctx.lineWidth = 3;
    			ctx.arc( 0 , this.R , 3 , 0 , Math.PI*2,true);
    			ctx.fill();
    			ctx.beginPath();
    			ctx.strokeStyle = huePool[Math.floor(Math.random()*huePool.length)];
    			ctx.arc( 0 , this.R , 10 , 0 , Math.PI*2,true);
    			ctx.stroke();
    			ctx.beginPath();
    			ctx.strokeStyle = huePool[Math.floor(Math.random()*huePool.length)];
    			ctx.arc( 0 , this.R , 18 , 0 , Math.PI*2,true);
    			ctx.stroke();		    	
			}
		});

		//rotate quadratic line
		patternStack.push({			
			R : 320,
			repeatAngle : 6,
			offsetAngle : 0,
			hue: huePool[Math.floor(Math.random()*huePool.length)],
			drawFunction: function(centerX , centerY){
				ctx.beginPath();
				ctx.moveTo(0, this.R);
				ctx.quadraticCurveTo(10, this.R-80, 20, this.R);
				ctx.lineWidth = 5;
				ctx.closePath();
				// line color
				ctx.strokeStyle = this.hue;
				ctx.stroke();					    	
			}
		});

		//rotate Bezier  line
		patternStack.push({			
			R : 360,
			repeatAngle : 6,
			offsetAngle : 0,
			hue: huePool[Math.floor(Math.random()*huePool.length)],
			drawFunction: function(centerX , centerY){
				ctx.beginPath();
				ctx.moveTo(0, this.R);
				ctx.bezierCurveTo(12, this.R-80, 24 , this.R+80 , 36 , this.R);
				ctx.lineWidth = 5;				
				// line color
				ctx.strokeStyle = this.hue;
				ctx.stroke();					    	
			}
		});

		//Single solid circle
		patternStack.push({			
			R : 0,
			repeatAngle : 360,
			offsetAngle : 0,
			hue: huePool[Math.floor(Math.random()*huePool.length)],
			drawFunction: function(centerX , centerY){
				ctx.beginPath();
				ctx.fillStyle = this.hue;
    			ctx.arc( 0 , 0 , 15 , 0 , Math.PI*2,true);
    			ctx.strokeStyle = "#FFF";
    			ctx.lineWidth = 20;
		    	ctx.stroke();    			
			}
		});
		

	}


	var insertMockObj2 = function(){
		var huePool = [
			"rgb(86, 34, 21)",
			"rgb(129, 64, 26)",
			 "rgb(166, 101, 23)",
			 "rgb(195, 144, 12)",
			 "rgb(213, 192, 7)",
			 "rgb(217, 243, 40)"
		];

		patternStack.push({			
			R : 240,
			repeatAngle : 12,
			offsetAngle : 0,
			hue : huePool[1],
			drawFunction: function(centerX , centerY){
				ctx.fillStyle = this.hue;
				ctx.strokeStyle = this.hue;	
				ctx.beginPath();				
    			ctx.arc( 0 , this.R , 100 , 0 , Math.PI*2,true);
    			ctx.fill();
    			ctx.beginPath();
    			ctx.lineWidth = 5;
    			ctx.arc( 0 , this.R , 150 , 0 , Math.PI*2,true);
    			ctx.stroke();
    			ctx.beginPath();
    			ctx.lineWidth = 5;
    			ctx.arc( 0 , this.R , 200 , 0 , Math.PI*2,true);    			
		    	ctx.stroke();    			
			}
		});

		patternStack.push({			
			R : 60,
			repeatAngle : 60,
			offsetAngle : 0,
			hue : huePool[1],
			drawFunction: function(centerX , centerY){
				ctx.fillStyle = this.hue;
				ctx.strokeStyle = this.hue;	
				ctx.beginPath();
				ctx.lineWidth = 2;		
    			ctx.arc( 0 , this.R , this.R , 0 , Math.PI*2,true);
    			ctx.stroke();
    			ctx.beginPath();
    			ctx.lineWidth = 5;
    			ctx.arc( 0 , this.R , this.R*2 , 0 , Math.PI*2,true);
    			ctx.stroke();
    			ctx.beginPath();
    			ctx.lineWidth = 5;
    			ctx.arc( 0 , this.R , this.R*3 , 0 , Math.PI*2,true);    			
		    	ctx.stroke();    			
			}
		});

		patternStack.push({			
			R : 220,
			repeatAngle : 15,
			offsetAngle : 0,
			hue : huePool[2],
			drawFunction: function(centerX , centerY){
				ctx.fillStyle = this.hue;
				ctx.strokeStyle = this.hue;	
				ctx.beginPath();
				ctx.lineWidth = 20;
    			ctx.arc( 0 , this.R-15 , 25 , 0 , Math.PI*2,true);
    			ctx.stroke();
    			ctx.beginPath();
    			ctx.strokeStyle = this.hue;
    			ctx.lineWidth = 40;
    			ctx.arc( 0 , 0 , this.R-32 , 0 , Math.PI*2,true);
    			ctx.stroke();
    			
			}
		});
		

		

		

	}


	var clean = function(){
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0,0,W,H);
	}
	

	var redraw = function(){

		clean();
		var patternObj , R , repeatAngle , offsetAngle , drawFunction;
		var drawPatternCenterX , drawPatternCenterY;
		ctx.translate(W/4, H/4);
		for(var i = 0 , n = patternStack.length ; i < n ; i++){
			patternObj = patternStack[i];			
			repeatAngle = patternObj.repeatAngle || 360;
			offsetAngle = patternObj.offsetAngle || 0 ;
			R = patternObj.R;
			ctx.save();
			ctx.rotate(offsetAngle);
			for(var rotateAngle = 0; rotateAngle < 360 ; rotateAngle+=repeatAngle){				
				ctx.rotate(repeatAngle*Math.PI/180);				
    			patternObj.drawFunction();
			}
			ctx.restore();
		}		
	}

	o.init = function(){
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");		
		$(window).on("resize" , resize);		
		resize();	
		insertMockObj1();
		//insertMockObj2();
		redraw();		
	}

	return o;

})( circlePattern || {} );


