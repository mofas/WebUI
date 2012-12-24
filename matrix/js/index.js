


$(function(){


	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

    var charPool = [ "0" , "1" , "a" , "b" , "c" , "d" , "e" ,
                     "x" , "z" ];


	var setting = {};

	setting.w = 500, setting.h = 500;

	var fallingCharPool = [];

	for(var i = 0 ; i < 30 ; i++){
		fallingCharPool.push(new createFallingChar());
	}


	function createFallingChar(){
		//Random position on the canvas 
		this.x = Math.random()*setting.w;
		this.y = Math.random()*setting.h;

		//falling velocity
		this.alpha = (Math.random()*100)/100;
		this.rate = Math.floor(Math.random()*5);	
		this.count = 0;		
		this.char = charPool[Math.floor(Math.random()*charPool.length)];		
		this.color = 255;
	}
	

	function draw(){

		ctx.globalCompositeOperation = "source-over";
		ctx.globalCompositeOperation = "lighter";
		ctx.globalAlpha = 0.75;
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, setting.w, setting.h);							

		for(var i = 0 ;i < fallingCharPool.length ; i++){
			var fc = fallingCharPool[i];	
			ctx.globalCompositeOperation = "source-over";
			if(fc.rate < fc.count){
				ctx.font = 'italic bold 20px sans-serif';
				ctx.textBaseline = 'bottom';
				ctx.fillStyle = "rgba(0, " + fc.color + ", 0, " + fc.alpha + ")";								
				ctx.fillText(fc.char , fc.x, fc.y);	

				fc.char = charPool[Math.floor(Math.random()*charPool.length)];
				fc.y += 18;
				
				fc.alpha = fc.alpha + 0.04;
				if(fc.alpha > 1)
					fc.alpha = 1;
				
				if(fc.y > setting.h +20){					
					fc.alpha = (Math.random()*50)/100;
					fc.y = 0;
					fc.x = Math.random()*setting.w;
					this.rate = Math.floor(Math.random()*5);	

				}
				fc.count = 0;
			}
			fc.count++;
		}
		//erase previous char;		
		ctx.fillStyle = "rgba(0, 0 , 0 , 0.015 )";
		ctx.fillRect(0, 0, setting.w, setting.h);
	}

	setInterval(draw, 30);

});