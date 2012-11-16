



$(document).ready(function() {
	youtube.init();
});



var youtube = (function(o){

	var $el , $mainBoard , $selectMenu ,$openSelectMenuButton;

	var touchInitX = 0 , touchMoveX = 0 , touchDiff;
	var threshold = 100 , touchTimer;

	var dashBoardOpen = false;

	o.init = function(){
		$el = $(".youtube");
		$mainBoard = $el.find(".mainBoard");
		$openSelectMenuButton = $el.find(".openSelectMenuButton");
		$selectMenu = $el.find(".selectMenu");
		bindEvent();
	}

	var bindEvent = function(){
		$openSelectMenuButton.on("click" , function(e){
			e.preventDefault();
			$selectMenu.removeClass("hide");
		});

		$selectMenu.on("click" , ".selectOptionButton" , function(e){
			e.preventDefault();
			$selectMenu.addClass("hide");
		});

		$mainBoard[0].addEventListener("touchstart", function(e){			
			touchInitX = e.changedTouches[0].clientX;
			touchTimer = setInterval( touchAnimation , 50);
		});

		$mainBoard[0].addEventListener("touchmove", function(e){
			touchMoveX = e.changedTouches[0].clientX;			
			touchDiff = touchMoveX-touchInitX;			
		}, false);

		$mainBoard[0].addEventListener("touchend", function(e){	
			clearTimeout(touchTimer);
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
			$mainBoard.css({
				left: 280 + touchDiff
			});
		}
		
	}


	var openDashBoard = function(){
		$mainBoard.animate({
			left: 280,
		}, 300 , 'easeOutExpo');
		dashBoardOpen = true;
	}

	var closeDashBoard = function(){
		$mainBoard.animate({
			left: 0,
		}, 300 , 'easeOutExpo');
		dashBoardOpen = false;
	}

	return o;
})( youtube || {} );