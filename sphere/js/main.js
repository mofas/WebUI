
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
	sphere.init();
});




var sphere = (function(o){

	var canvas , ctx , W , H;
	var radius;
	var particles = [];

	var warpLineNumber = 16,
		weftLineNumber = 120;	


	var RADIAN = Math.PI*2/360;

	var resize = function(){
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;
		ctx.fillStyle = "white"
		ctx.fillRect(0,0,W,H);

		radius = Math.floor(Math.min(W,H)/3);
		particles = [];
		initParticle();
	}


	var initParticle = function(){
		var longtitudeAngle;
		var latitudeAngle;		

		for(var i = 0; i < warpLineNumber ; i++){	
			latitudeAngle = (i+1)*(180/(warpLineNumber+1));			
			for(var j = 0; j < weftLineNumber ; j++){
				longtitudeAngle = j*(360/weftLineNumber);

				var x = radius*Math.sin(RADIAN*latitudeAngle)*Math.sin(RADIAN*longtitudeAngle);
				var y = radius*Math.sin(RADIAN*latitudeAngle)*Math.cos(RADIAN*longtitudeAngle);
				var z = radius*Math.cos(RADIAN*latitudeAngle);				
				particles.push({				
					x: x,
					y: y,
					z: z,
					lati: latitudeAngle,
					long: longtitudeAngle,
				});
			}			
		}		
		drawParticlesOnCanvas();
	}

	var drawParticlesOnCanvas = function(){
		//project particles on plane		
		var particle;
		for(var i =0; i < particles.length ;i++){
			ctx.beginPath();
			particle = particles[i];
			var camera = {x: W/1.7 , y: W/1.7 , z:W/1.7 }
			var orientationAngle = {x: -45 , y: 45 , z: 0 }
			var position = {x: W/2.2 , y: W/2.2 , z: W/0.9 }
			var pf = projectFunction(particle , camera , orientationAngle , position);
			var x = pf[0],
				y = pf[1];
			/**
			var x = particle.x + W/2, 
				y = particle.z + H/2;
			**/
			console.log(x , y);
			ctx.moveTo(x , y);
			var color = "rgba(" + ((particle.x/radius)*50+50) + "%," + ((particle.y/radius)*50+50) + "%," + ((particle.z/radius)*50+50) + "% , 0.4)";			
			ctx.fillStyle = color;			
			ctx.arc(x , y , 2 , 0 , Math.PI*2, true);
			ctx.fill();
		}			
	}


	//project the point from 3d to 2d at plane 
	//point [x , y , z]
	//camera [x , y , z]
	//orientationAngle = camera orientation [x , y , z]
	//position [x , y , z]
	var projectFunction = function(point , camera , orientationAngle , position){

		var cos = Math.cos;
		var sin = Math.sin;
		var ax = point.x || 0,
			ay = point.y || 0,
			az = point.z || 0,
			cx = camera.x || 0,
			cy = camera.y || 0,			
			cz = camera.z || 0, 
			ox = orientationAngle.x*RADIAN || 0,
			oy = orientationAngle.y*RADIAN || 0,
			oz = orientationAngle.z*RADIAN || 0,
			ex = position.x || 0,
			ey = position.y || 0,
			ez = position.z || 0;


		var dx , dy , dz;

		dx = cos(oy)*(sin(oz)*(ay-cy) + cos(oz)*(ax-cx)) - sin(oy)*(az-cz);
		dy = sin(ox)*(cos(oy)*(az-cz) + sin(oy)*(sin(oz)*(ay-cy)+cos(oz)*(ax-cx))) + cos(ox)*(cos(oz)*(ay-cy)-sin(oz)*(ax-cx));
		dz = cos(ox)*(cos(oy)*(az-cz) + sin(oy)*(sin(oz)*(ay-cy)+cos(oz)*(ax-cx))) - sin(ox)*(cos(oz)*(ay-cy)-sin(oz)*(ax-cx));

		
		var bx = (dx-ex)*(ez/dz),
			by = (dy-ey)*(ez/dz);

		return [bx , by];
	}


	o.init = function(){
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");		
		//$(window).on("resize" , resize);
		resize();
		//particlesAnimation();
		//helixUpdate();
	}

	return o;

})( sphere || {} );












/**


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
			
			particle.targetX = x + Math.random()*50;
			particle.targetY = y  + Math.random()*50;
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
			
			particle.targetX = x  + Math.random()*50;
			particle.targetY = y  + Math.random()*50;
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
			particle.y = y + Math.random()*10 - 5;
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
			particle.y = y + Math.random()*10 - 5;
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

			//velocity limit 
			(particle.vx > 0.8) ? particle.vx = 0.8 : particle.vx = particle.vx;
			(particle.vy > 0.8) ? particle.vy = 0.8 : particle.vy = particle.vy;
			(particle.vx < -0.8) ? particle.vx = -0.8 : particle.vx = particle.vx;
			(particle.vy < -0.8) ? particle.vy = -0.8 : particle.vy = particle.vy;
			
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
				if(distance < 30){					
					ctx.strokeStyle = "rgba(170,170,170,1)";
				}
				else if(distance < 60){					
					ctx.strokeStyle = "rgba(170,170,170,0.9)";
				}
				else if(distance < 90){
					ctx.strokeStyle = "rgba(170,170,170,0.8)";	
				}
				else{					
					ctx.strokeStyle = "rgba(170,170,170,0.7)";		
				}
				ctx.lineWidth = 0.5;			
				ctx.moveTo(particle1.x, particle1.y);
				ctx.lineTo(particle2.x, particle2.y);
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

**/