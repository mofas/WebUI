



$(document).ready(function() {
	youtube.init();
});




var youtube = (function(o){

	var $selectMenu ,$openSelectMenuButton;

	o.init = function(){
		$openSelectMenuButton = $(".openSelectMenuButton");
		$selectMenu = $(".youtube .selectMenu");
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
	}

	return o;
})( youtube || {} );