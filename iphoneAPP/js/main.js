

window.addEventListener('load', function() {
    new FastClick(document.body);
}, false);


$(document).ready(function() {
	facebook.init();
	youtube.init();
	pair.init();
	twitter.init();
	fourSquare.init();
});



var facebook = (function(o){

	var $el , $mainPanel;

	var bindEvent = function(){
		$mainPanel.on("click" , ".iconWrap" , function(){			
			$(this).toggleClass("active");
			if($(this).index() === 0){
				$friendRequest.toggleClass("hide");
			}
		});
	}

	o.init = function(){
		$el = $(".facebook");		
		$mainPanel = $el.find(".mainPanel");
		$friendRequest = $el.find(".friendRequest");
		bindEvent();
	}

	return o;

})( facebook || {} );


var twitter = (function(o){

	var $el , $tabbar;

	var bindEvent = function(){
		$tabbar.on("click" , "li" , function(){		
			$tabbar.find("li").removeClass("selected");
			$(this).toggleClass("selected");			
		});
	}

	o.init = function(){
		$el = $(".twitter");
		$tabbar = $el.find(".tabbar");
		bindEvent();
	}

	return o;
})( twitter || {} );




var youtube = (function(o){

	var $el , $mainBoard , $leftButton , $dashBoard , $selectMenu ,$openSelectMenuButton;

	var touchInitX = 0 , touchMoveX = 0 , touchDiff = 0;
	var threshold = 100 , touchTimer;

	var dashBoardOpen = false;

	o.init = function(){
		$el = $(".youtube");
		$mainBoard = $el.find(".mainBoard");
		$dashBoard = $el.find(".dashBoard");
		$leftButton = $el.find(".leftButton");
		$openSelectMenuButton = $el.find(".openSelectMenuButton");
		$selectMenu = $el.find(".selectMenu");
		bindEvent();
	}

	var bindEvent = function(){

		$dashBoard.on("click" , ".list li" , function(){
			$dashBoard.find(".list li").removeClass("selected");
			$(this).addClass("selected");
		});
		$openSelectMenuButton.on("click" , function(e){
			e.preventDefault();
			$selectMenu.removeClass("hide");
		});

		$selectMenu.on("click" , ".selectOptionButton" , function(e){
			e.preventDefault();
			$selectMenu.addClass("hide");
		});

		$mainBoard[0].addEventListener("touchstart", function(e){			
			clearTimeout(touchTimer);
			touchInitX = e.changedTouches[0].clientX;
			touchDiff = 0;			
			touchTimer = setInterval( touchAnimation , 20);
		});

		$mainBoard[0].addEventListener("touchmove", function(e){
			touchMoveX = e.changedTouches[0].clientX;			
			touchDiff = touchMoveX-touchInitX;			
		}, false);

		$mainBoard[0].addEventListener("touchend", function(e){	
			clearTimeout(touchTimer);
			touchMoveX = e.changedTouches[0].clientX;
			touchDiff = touchMoveX-touchInitX;
			//Click
			if(touchDiff === 0){				
				return;
			}
			if(touchDiff > threshold && !dashBoardOpen){
				openDashBoard();
			}
			else if(dashBoardOpen && touchDiff < -threshold){
				closeDashBoard();
			}
			else if(dashBoardOpen && touchDiff > -threshold){
				openDashBoard();
			}
			else{
				closeDashBoard();
			}
		});

		$leftButton.click(function(e){			
			e.stopImmediatePropagation();			
			e.preventDefault();			
			if(!dashBoardOpen){
				openDashBoard();
			}
			else{
				closeDashBoard();
			}			
		});


	}

	var touchAnimation = function(){

		if(!dashBoardOpen){
			if(touchDiff < 0 )
				touchDiff = 0;
			$mainBoard.css({
				left: touchDiff
			});
		}
		else{			
			if(touchDiff < -260)
				touchDiff = -260;
			$mainBoard.css({
				left: 260 + touchDiff
			});
		}
		
	}

	var openDashBoard = function(){
		$mainBoard.animate({
			left: 260,
		}, 300 , 'easeOutExpo');
		dashBoardOpen = true;
		clearTimeout(touchTimer);
	}

	var closeDashBoard = function(){
		$mainBoard.animate({
			left: 0,
		}, 300 , 'easeOutExpo');
		dashBoardOpen = false;
		clearTimeout(touchTimer);
	}

	return o;
})( youtube || {} );


var pair = (function(o){

	var $el , $mainBoard , $leftButton;

	var touchInitX = 0 , touchMoveX = 0 , touchDiff = 0;
	var threshold = 100 , touchTimer;

	var dashBoardOpen = true;	

	o.init = function(){
		$el = $(".pair");
		$mainBoard = $el.find(".mainBoard");				
		$leftButton = $el.find(".leftButton");
		bindEvent();
	}

	var bindEvent = function(){
		$mainBoard[0].addEventListener("touchstart", function(e){
			clearTimeout(touchTimer);
			touchInitX = e.changedTouches[0].clientX;
			touchDiff = 0;
			touchTimer = setInterval( touchAnimation , 20);
		});

		$mainBoard[0].addEventListener("touchmove", function(e){
			touchMoveX = e.changedTouches[0].clientX;
			touchDiff = touchMoveX-touchInitX;
		}, false);

		$mainBoard[0].addEventListener("touchend", function(e){				
			clearTimeout(touchTimer);
			touchMoveX = e.changedTouches[0].clientX;
			touchDiff = touchMoveX-touchInitX;			
			if(touchDiff === 0){				
				return;
			}
			if(touchDiff > threshold && !dashBoardOpen){
				openDashBoard();
			}
			else if(dashBoardOpen && touchDiff < -threshold){
				closeDashBoard();
			}
			else if(dashBoardOpen && touchDiff > -threshold){
				openDashBoard();
			}
			else{
				closeDashBoard();
			}
		});

		$leftButton.click(function(e){			
			e.stopImmediatePropagation();			
			e.preventDefault();			
			if(!dashBoardOpen){
				openDashBoard();
			}
			else{
				closeDashBoard();
			}			
		});
	}

	var touchAnimation = function(){
		if(!dashBoardOpen){			
			if(touchDiff < 0 )
				touchDiff = 0;
			$mainBoard.css({
				left: touchDiff
			});
		}
		else{			
			
			if(touchDiff < -260)
				touchDiff = -260;
			$mainBoard.css({
				left: 260 + touchDiff
			});
		}
		
	}

	var openDashBoard = function(){
		$mainBoard.animate({
			left: 260,
		}, 300 , 'easeOutExpo');
		dashBoardOpen = true;
		clearTimeout(touchTimer);
	}

	var closeDashBoard = function(){
		$mainBoard.animate({
			left: 0,
		}, 300 , 'easeOutExpo');
		dashBoardOpen = false;
		clearTimeout(touchTimer);
	}

	return o;
})( pair || {} );


var fourSquare = (function(o){

    o.init = function(){
	    //default location
	    o.latlng = new google.maps.LatLng(51.538902, -0.015782);    
	    o.myOptions = {
	        zoom: 12,     
	        center: o.latlng,
	        disableDefaultUI: true,                                
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    }
    	o.map = new google.maps.Map(document.getElementById("map"), o.myOptions);    
    	o.marker = new google.maps.Marker({
            position:  o.latlng,
            map: o.map,                        
            icon: 'http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png' ,
        });	
	}



	return o;
})( fourSquare || {} );
