
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

	var particles = [],
		particleDistance = 25,
		helixArrayLength;
	
	var resize = function(){
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;
		ctx.fillStyle = "white";
		ctx.fillRect(0,0,W,H);
		amplitude = W/6;
		helixArrayLength = Math.floor(H/particleDistance) + 25;
		
		particles = [];
		initParticle();
	}


	var rotateFunction = function(originX , originY , rotateAngle){
		x = originX*Math.cos(rotateAngle) + originY*Math.sin(rotateAngle);
		y = - originX*Math.sin(rotateAngle) + originY*Math.cos(rotateAngle);
		return [ x , y ];
	}


	var HelixParticleUpdate = function(){		

		//clearCanvas();

		//ctx.beginPath();
		//ctx.fillStyle = "#000" ;

		var originX = 0, originY = 0, x , y;
		var particle;				
		for(var i = 0; i < helixArrayLength ; i++){
			particle = particles[i];
			//the baseLine
			originX = W/6 + (Math.sin(i*particleDistance*deltaDegree + phase)*amplitude);
			originY = i*particleDistance;			
			var rf = rotateFunction(originX , originY , Math.PI/5);
			x = rf[0];
			y = rf[1];

			//ctx.moveTo(x , y);
			//ctx.arc(x , y , 5 , 0 , Math.PI*2, true);
			
			particle.targetX = x;
			particle.targetY = y;			
		}
			
		for(var i =0; i <= helixArrayLength ; i+= 1){
			particle = particles[helixArrayLength+i];
			//the baseLine
			originX = W/6 + (Math.sin(i*particleDistance*deltaDegree + phase + phaseDiff)*amplitude)
			originY = i*particleDistance;						
			var rf = rotateFunction(originX , originY , Math.PI/4);			
			x = rf[0];
			y = rf[1];		

			//ctx.moveTo(x , y);
			//ctx.arc(x , y , 5 , 0 , Math.PI*2, true);	
			
			particle.targetX = x;
			particle.targetY = y;				
		}

		//ctx.fill();

		phase += phaseVelocity;
	}


	var clearCanvas = function(){
		ctx.beginPath();
		ctx.fillStyle = "#eef";
		ctx.fillRect(0,0,W,H);
		ctx.fill();
	}

	var helixUpdate = function(){		
		HelixParticleUpdate();
		setTimeout(helixUpdate , 500);
	}


	var initParticle = function(){
		for(var i =0; i <= 2*helixArrayLength ; i+= 1){			
			particles.push({
				r: Math.random()*2+1,
				targetX: 0,
				targetY: 0,
				x: 0,
				y: 0,
				vx : Math.random()*0.8 - 0.4,
				vy : Math.random()*0.8 - 0.4,
			});
		}		

		for(var i = 0; i < helixArrayLength ; i+= 1){
			//the baseLine
			originX = W/6 + (Math.sin(i*particleDistance*deltaDegree + phase)*amplitude);
			originY = i*particleDistance;			
			var rf = rotateFunction(originX , originY , Math.PI/6);
			x = rf[0];
			y = rf[1];

			ctx.moveTo(x , y);
			ctx.arc(x , y , 5 , 0 , Math.PI*2, true);

			particle = particles[i];
			particle.x = x + Math.random()*100 - 50;
			particle.y = y + Math.random()*100 - 50;
		}		
		for(var i =0; i <= helixArrayLength ; i+= 1){
			//the baseLine
			originX = W/6 + (Math.sin(i*particleDistance*deltaDegree + phase + phaseDiff)*amplitude)
			originY = i*particleDistance;						
			var rf = rotateFunction(originX , originY , Math.PI/5);			
			x = rf[0];
			y = rf[1];		

			ctx.moveTo(x , y);
			ctx.arc(x , y , 5 , 0 , Math.PI*2, true);	

			particle = particles[helixArrayLength+i];			
			particle.x = x + Math.random()*100 - 50;
			particle.y = y + Math.random()*100 - 50;
		}

	}

	var particlesAnimation = function(){		
		var acceleration = 0.002;
		var distance;

		clearCanvas();
		drawLine();

		ctx.beginPath();
		ctx.fillStyle = "#555";
		var particle;		
		for(var i = 0 ; i < particles.length ; i++){			
			particle = particles[i];
			
			//calculate velocity			
			distance = Math.abs(particle.x - particle.targetX)/100;			
			if( particle.x >= particle.targetX){
				particle.vx -= acceleration*distance;
			}
			if( particle.x <= particle.targetX){
				particle.vx += acceleration*distance;
			}

			distance = Math.abs(particle.y - particle.targetY)/100;
			if( particle.y >= particle.targetY){
				particle.vy -= acceleration*distance;
			}			
			if( particle.y <= particle.targetY){
				particle.vy += acceleration*distance;
			}
			
			//calculate next position
			particle.x = particle.x + particle.vx;
			particle.y = particle.y + particle.vy;

			ctx.moveTo(particle.x , particle.y);
			ctx.arc(particle.x , particle.y , particle.r , 0 , Math.PI*2, true);
		}
		ctx.fill();		
		requestAnimFrame(particlesAnimation);
	}


	var drawLine = function(){

		var connection = function(particle1 , particle2){						
			var yd = particle2.y - particle1.y;
			var xd = particle2.x - particle1.x;
			var distance = Math.sqrt(xd*xd + yd*yd);				
			if(distance < 120){								
				ctx.beginPath();
				ctx.lineWidth = 0.5;
				ctx.moveTo(particle1.x, particle1.y);
				ctx.lineTo(particle2.x, particle2.y);
				ctx.strokeStyle = "#aaa";
				ctx.stroke();
			}
		}

		for(var i = 0 ; i < particles.length; i++){
			var p = particles[i];
			if(i < helixArrayLength){
				for(var n = i+1 ; n < helixArrayLength ; n++){				
					var p2 = particles[n];				
					connection(p , p2);
				}
			}
			else{
				for(var n = i+1 ; n < particles.length ; n++){				
					var p2 = particles[n];				
					connection(p , p2);
				}
			}
		}
	}


	o.init = function(){
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");		
		$(window).on("resize" , resize);
		resize();
		particlesAnimation();
		helixUpdate();
	}

	return o;

})( doubleHelix || {} );