
document.addEventListener('DOMContentLoaded',function(){
	gridPattern.init();
})

var gridPattern = (function(o){
	
	var canvas , ctx;	
	var W , H;

	o.blockW = 20;
	o.blockH = 20;
					
	var resize = function(){
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;		
		clean();
		o.draw();
	}

	var clean = function(){
		ctx.fillStyle = "#FFF";
		ctx.fillRect(0,0,W,H);
	}

	var drawBlock = function(relatX , relatY){		
		if(Math.random()*2 > 1){
			//top-right to bottom-left
			ctx.beginPath();
			ctx.moveTo(relatX + o.blockW/2, relatY);
			ctx.lineTo(relatX , relatY + o.blockH/2);
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(relatX + o.blockW, relatY);
			ctx.lineTo(relatX , relatY + o.blockH);
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(relatX + o.blockW, relatY + o.blockH/2);
			ctx.lineTo(relatX + o.blockW/2 , relatY + o.blockH);
			ctx.lineWidth = 2;
			ctx.stroke();

		}
		else{
			//top-left to bottom-right
			ctx.beginPath();
			ctx.moveTo(relatX , relatY + o.blockH/2);
			ctx.lineTo(relatX + o.blockW/2 , relatY + o.blockH);
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(relatX , relatY);
			ctx.lineTo(relatX + o.blockW, relatY + o.blockH);
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(relatX + o.blockW/2, relatY);
			ctx.lineTo(relatX + o.blockW , relatY + o.blockH/2);
			ctx.lineWidth = 2;
			ctx.stroke();
		}
	}
	


	o.draw = function(){		
		clean();		
		for(var i = 0 ; i < W ; i+= o.blockW){
			for(var j = 0 ; j < H ; j += o.blockH){
				drawBlock(i , j);
			}
		}
	}

	o.init = function(){
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");		
		window.addEventListener("resize" , resize);
		resize();		
		o.draw();				
	}

	return o;

})( gridPattern || {} );


