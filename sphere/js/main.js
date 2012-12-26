
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

	var warpLineNumber = 20,
		weftLineNumber = 60;	


	var RADIAN = Math.PI*2/360;

	var _camera = {x: 0 , y: 0 , z: 0 };
	var _orientationAngle = {x: -45 , y: 45 , z: 0 };
	var _position = {x: 0 , y: 0 , z: 0 };

	var _cameraXF = 0.58,
		_cameraYF = 0.58,
		_cameraZF = 0.58,
		_orientationAngleX = -45,
		_orientationAngleY = 45,
		_orientationAngleZ = -0,
		_positionXF = 0.45,
		_positionYF = 0.45,
		_positionZF = 1.11;


	var resize = function(){
		W = window.innerWidth;
		H = window.innerHeight;
		canvas.width = W;
		canvas.height = H;
		//init value				
		radius = Math.floor(Math.min(W,H)*0.3);

		reDraw();
	}

	var reDraw = function(){
		ctx.fillStyle = "white"
		ctx.fillRect(0,0,W,H);

		_camera = {x: W*_cameraXF , y: W*_cameraYF , z:W*_cameraZF };
		_orientationAngle = { x: _orientationAngleX , y: _orientationAngleY , z: _orientationAngleZ};
		_position = {x: W*_positionXF , y: W*_positionYF , z: W*_positionZF };

		particles = [];
		initParticle();
		drawParticlesOnCanvas();
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
					projectX : 0,
					projectY : 0
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
		for(var i = 0; i < warpLineNumber ; i++){				
			p0 = particles[i*weftLineNumber];
			ctx.moveTo(p0.projectX, p0.projectY);			
			for(var j = 0; j < weftLineNumber ; j++){
				p = particles[i*weftLineNumber+j];
				ctx.lineTo(p.projectX, p.projectY);
			}
			ctx.lineTo(p0.projectX, p0.projectY);
		}		
		ctx.stroke();		

		//draw longitude
		ctx.beginPath();
		ctx.strokeStyle = "rgba(170,170,170,1)";
		ctx.lineWidth = 0.5;
		for(var i = 0; i < weftLineNumber ; i++){				
			p0 = particles[i];
			ctx.moveTo(p0.projectX, p0.projectY);			
			for(var j =0; j < warpLineNumber ; j++){
				p = particles[i + weftLineNumber*j];
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
		$("#radius").on("change" , function(){			
			radius = Math.floor(Math.min(W,H)*$(this).val());
			reDraw();			
		});
		$("#warpLineNumber").on("change" , function(){			
			warpLineNumber = parseInt($(this).val());
			reDraw();	
		});
		$("#weftLineNumber").on("change" , function(){			
			weftLineNumber = parseInt($(this).val());
			reDraw();
		});


		$("#cameraXF").on("change" , function(){			
			_cameraXF = parseFloat($(this).val());
			reDraw();			
		});
		$("#cameraYF").on("change" , function(){			
			_cameraYF = parseFloat($(this).val());
			reDraw();			
		});
		$("#cameraZF").on("change" , function(){			
			_cameraZF = parseFloat($(this).val());
			reDraw();
		});



		$("#orientationAngleX").on("change" , function(){			
			_orientationAngleX = parseInt($(this).val());
			reDraw();			
		});
		$("#orientationAngleY").on("change" , function(){			
			_orientationAngleY = parseInt($(this).val());
			reDraw();			
		});
		$("#orientationAngleZ").on("change" , function(){			
			_orientationAngleZ = parseInt($(this).val());
			reDraw();
		});

		$("#positionXF").on("change" , function(){			
			_positionXF = parseFloat($(this).val());
			reDraw();			
		});
		$("#positionYF").on("change" , function(){			
			_positionYF = parseFloat($(this).val());
			reDraw();			
		});
		$("#positionZF").on("change" , function(){			
			_positionZF = parseFloat($(this).val());
			reDraw();
		});


		
		
	}




	return o;

})( sphere || {} );



