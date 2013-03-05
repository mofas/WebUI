
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
	
	var particles = [];
	

	var RADIAN = Math.PI*2/360;

	var _camera = {x: 0 , y: 0 , z: 0 };
	var _orientationAngle = {x: -45 , y: 45 , z: 0 };
	var _position = {x: 0 , y: 0 , z: 0 };

	o.radius = 300;
	o.warpLineNumber = 20;
	o.weftLineNumber = 60;	

	o.cameraXF = 0.56;
	o.cameraYF = 0.45;
	o.cameraZF = 0.67;
	o.orientationAngleX = -34;
	o.orientationAngleY = 38;
	o.orientationAngleZ = 2;
	o.positionXF = 0.37;
	o.positionYF = 0.55;
	o.positionZF = 0.93;


	var resize = function(){
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;		
		reDraw();
	}

	var reDraw = function(){
		ctx.fillStyle = "white"
		ctx.fillRect(0,0,W,H);

		_camera = {x: W*o.cameraXF , y: W*o.cameraYF , z:W*o.cameraZF };
		_orientationAngle = { x: o.orientationAngleX , y: o.orientationAngleY , z: o.orientationAngleZ};
		_position = {x: W*o.positionXF , y: W*o.positionYF , z: W*o.positionZF };

		particles = [];
		initParticle();
		drawParticlesOnCanvas();
	}


	var initParticle = function(){
		var longtitudeAngle;
		var latitudeAngle;		

		for(var i = 0; i < o.warpLineNumber ; i++){	
			latitudeAngle = (i+1)*(180/(o.warpLineNumber+1));			
			for(var j = 0; j < o.weftLineNumber ; j++){
				longtitudeAngle = j*(360/o.weftLineNumber);
				var x = o.radius*Math.sin(RADIAN*latitudeAngle)*Math.sin(RADIAN*longtitudeAngle);
				var y = o.radius*Math.sin(RADIAN*latitudeAngle)*Math.cos(RADIAN*longtitudeAngle);
				var z = o.radius*Math.cos(RADIAN*latitudeAngle);				
				particles.push({				
					x: x,
					y: y,
					z: z,
					lati: latitudeAngle,
					long: longtitudeAngle,
					projectX : 0,
					projectY : 0,
				});
			}			
		}		
	}

	var drawParticlesOnCanvas = function(){

		//project the point from 3d to 2d plane 
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

		//project particles on plane		
		var particle;
		for(var i =0; i < particles.length ;i++){
			ctx.beginPath();
			particle = particles[i];

			var pf = projectFunction(particle , _camera , _orientationAngle , _position);
			var x = pf[0],
				y = pf[1];

			//TEST CODE
			/**
			var x = particle.x + W/2, 
				y = particle.z + H/2;
			**/
			particle.projectX = x;
			particle.projectY = y;			
			ctx.moveTo(x , y);			
			//var color = "rgba(" + ((particle.x/radius)*50+50) + "%," + ((particle.y/radius)*50+50) + "%," + ((particle.z/radius)*50+50) + "% , 0.4)";
			var color = "#999";
			ctx.fillStyle = color;			
			ctx.arc(x , y , 2 , 0 , Math.PI*2, true);
			ctx.fill();
		}

		drawGridLine();	
	}


	var drawGridLine = function(){
		var p0 , p;
		//draw latitude
		
		ctx.beginPath();
		ctx.strokeStyle = "rgba(170,170,170,1)";
		ctx.lineWidth = 0.5;
		for(var i = 0; i < o.warpLineNumber ; i++){				
			p0 = particles[i*o.weftLineNumber];
			ctx.moveTo(p0.projectX, p0.projectY);			
			for(var j = 0; j < o.weftLineNumber ; j++){
				p = particles[i*o.weftLineNumber+j];
				ctx.lineTo(p.projectX, p.projectY);
			}
			ctx.lineTo(p0.projectX, p0.projectY);
		}		
		ctx.stroke();		

		//draw longitude
		ctx.beginPath();
		ctx.strokeStyle = "rgba(170,170,170,1)";
		ctx.lineWidth = 0.5;
		for(var i = 0; i < o.weftLineNumber ; i++){				
			p0 = particles[i];
			ctx.moveTo(p0.projectX, p0.projectY);			
			for(var j =0; j < o.warpLineNumber ; j++){
				p = particles[i + o.weftLineNumber*j];
				ctx.lineTo(p.projectX, p.projectY);
			}
		}		
		ctx.stroke();
	}




	o.init = function(){
		canvas = document.getElementById("canvas");
		ctx = canvas.getContext("2d");		
		$(window).on("resize" , resize);
		resize();
		bindEvent();
	}


	var bindEvent = function(){		

		$("input[type='range']").on("change", function(){
			var id = $(this).attr("id");
			var value = parseFloat($(this).val());
			o[id] = value;			
			$(this).next().val(value);
			reDraw();
		});		
		
	}


	return o;

})( sphere || {} );



