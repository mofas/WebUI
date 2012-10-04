function fixPNG()
{
    var arVersion = navigator.appVersion.split("MSIE")
    var version = parseFloat(arVersion[1])
    if ((version < 9) && (document.body.filters)) {
        for(var i=0; i<document.images.length; i++){
            var img = document.images[i]
            var imgName = img.src.toUpperCase()
            if (imgName.substring(imgName.length-3, imgName.length) == "PNG"){
                var imgID = (img.id) ? "id='" + img.id + "' " : ""
                var imgClass = (img.className) ? "class='" + img.className + "' " : ""
                var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
                var imgStyle = "display:inline-block;" + img.style.cssText 
                if (img.align == "left") imgStyle = "float:left;" + imgStyle
                if (img.align == "right") imgStyle = "float:right;" + imgStyle
                if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle
                var strNewHTML = "<span " + imgID + imgClass + imgTitle
                + " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
                + "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
                + "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>" 
                img.outerHTML = strNewHTML
                i = i-1;
            }
        }
    }
}




(function($){    
$.fn.extend({ 
    MagnifierGallery: function(options) {

        var defaults = {
            zoomScale: 3,
            animateSpeed : 500,
        };

        var options = $.extend(defaults, options);

        if(options.zoomScale < 1)
            options.zoomScale = 1;

        return this.each(function() {        


            var $obj = $(this),
                $galleryUL = $obj.find("ul"),
                $imgs = $obj.find("img"),    
                $leftButton  , $rightButton ,
                $magnifier = $("<div class='magnifier'><ul class='magnifierGallery'></ul></div>"),
                $magnifierGallery = $magnifier.find(".magnifierGallery"),
                WrapWidth = $obj.width() , WrapHeight , magnifierW , magnifierH,
                realLiW,
                imgScale  , originMargin , targetMargin , magnifierLiW;


            var checkImageLoadComplete = function(callback){                
                var count = $imgs.length;
                var check = function(){
                    if(count == 0){    
                        imgScale = $imgs.first().height()/$imgs.first().width();    
                        magnifierW = $imgs.first().width()*options.zoomScale;
                        $galleryUL.find("a").height($imgs.first().height());
                        callback();                     
                    }
                }
                $imgs.each(function(index , el){
                    var imgLoader = new Image();                     
                    imgLoader.src = $(el).attr("src");
                    imgLoader.onload = function(){                        
                        count--;
                        check();                        
                    }
                });
            }


            var carouselSetting = function(){           
                var $lis = $galleryUL.find("li"),               
                    lisW = $lis.outerWidth(true),                                   
                    cloneLi = $lis.clone(),
                    WrapCenter, 
                    UlOffsetX;

                $galleryUL.prepend(cloneLi);    

                //所有li的寬度必須跟magnifier一樣寬                
                $lis = $galleryUL.find("li");                                
                if(lisW < magnifierW){
                    var innerWidth = magnifierW - (lisW - $lis.width());                    
                    $lis.css({ 
                        "width" : innerWidth,
                    });
                }
                realLiW = innerWidth;    

                //找出center圖
                var centerIndex = Math.floor($galleryUL.find("li").length/2);
                $li = $galleryUL.find("li").eq(centerIndex);
                $li.addClass("center");                           
                WrapCenter = ($obj.width()-realLiW)/2 
                UlOffsetX = WrapCenter - realLiW*$li.index();                                
                //center圖置中                
                $galleryUL.css({ left: UlOffsetX});                             
            }
            
            var adjustULPosition = function(){  
                $obj.addClass("galleryWrap");               
                var UlH , marginTop , offsetAdjust;                 
                UlH = $galleryUL.height();                  
                //調整外框CSS
                $obj.css({
                    'height': UlH*options.zoomScale,
                    'padding-top' : 60,
                    'padding-bottom' : 120,
                    'overflow': 'hidden',                   
                });
                WrapHeight = $obj.outerHeight();
                marginTop = ( WrapHeight - UlH)/2 -60;
                $galleryUL.css({ 'margin-top' : marginTop});                            
            }

            var appendMagnifier = function(){

                magnifierH = magnifierW*imgScale;            
                var XOffset = ($obj.width()- magnifierW)/2,
                    YOffset = ($obj.outerHeight() - magnifierH)/2 - 30;

                $obj.append($magnifier);                
                $magnifier.width(magnifierW);
                $magnifier.height(magnifierH);
                $magnifier.css({
                    left: XOffset,
                    top:  YOffset,
                });
                
                var $magnifierImgs = $imgs.clone().add($imgs.clone());
                $magnifier.find(".magnifierGallery").html($magnifierImgs);                                 
                $magnifierImgs.each(function(){
                    var imageLink = $(this).attr("link") || "#";
                    $(this).wrap('<li class="imageWrap"><a href="'+imageLink+'"></a></li>');
                });                 
                $magnifier.find(".imageWrap").css({
                    width: magnifierW,
                    height: magnifierH,
                });                                
                $magnifierGallery.css({
                    left: -magnifierW*$imgs.length,
                });             
            }

            var bindClickEvent = function(){                                
                $galleryUL.on("click" , "li" , function(){
                    var $center = $galleryUL.find(".center"),
                        centerIndex = $center.index(),
                        centerOuterW = $center.outerWidth(true),
                        centerMargin = centerOuterW - $center.width(),
                        index = $(this).index(),
                        $li = $(this);
                    //判斷點了幾格遠
                    var diff = (index-centerIndex),
                        diffABS = Math.abs(diff);    
                    console.log(diff);
                    //隱藏title
                    if(diff != 0){
                        resetTitle($center.find(".title"));                    
                    }
                    if(diff > 0){
                        
                        ULmoveLeft($magnifierGallery , diffABS);   
                        $center.removeClass("center");
                        ULmoveLeft($galleryUL , diffABS);                                
                        animateCallback($li , $center);
                        console.log($galleryUL.css("left"));
                        $galleryUL.animate({
                               left: '-='+realLiW*diffABS+'',
                            }, options.animateSpeed , function(){  
                                ULmoveLeft($galleryUL , diffABS);                                
                                animateCallback($li , $center);                                
                        });                         
                        
                        $magnifierGallery.animate({
                            left: '-='+magnifierW*diffABS+'',
                        } , options.animateSpeed);                                                   
                    }
                    else if(diff < 0){      
                        
                        ULmoveRight($magnifierGallery , diffABS);
                        $center.removeClass("center");                                   
                        $galleryUL.animate({
                               left: '+='+realLiW*diffABS+'',                               
                            }, options.animateSpeed , function(){                                    
                                ULmoveRight($galleryUL , diffABS);
                                animateCallback($li , $center);
                        });                        
                        $magnifierGallery.animate({
                            left: '+='+magnifierW*diffABS+'',
                        } , options.animateSpeed);
                    }
                });             
            }


            var bindClickButtonEvent = function(){
                $leftButton = $obj.parent().find(".moveButton.buttonleft");
                $rightButton = $obj.parent().find(".moveButton.buttonright");
                $leftButton.on("click" , function(){
                    $galleryUL.find(".center").next().click();
                });
                $rightButton.on("click" , function(){
                    $galleryUL.find(".center").prev().click();                     
                });
            }


            var animateCallback = function($li , $center){
                $li.addClass("center");                   
                adjustCenterTitle($li.find(".title"));
            }

            var resetTitle = function($title){                
                var titlesOffsetY = -($galleryUL.outerHeight())/2 -10;
                $title.css({
                    top: titlesOffsetY,                    
                });
                $title.show();
            }

            var adjustCenterTitle = function($title){                                
                var titlesOffsetY = -($galleryUL.outerHeight())/2 - 50;
                $title.css({
                    opacity: 0,
                    top: titlesOffsetY,                      
                });
                $title.animate({ opacity: 1} ,500);
            }

            var adjustTitleAndDesc = function(){  
                var $titles = $obj.find(".title");
                var titlesOffsetY = -($galleryUL.outerHeight())/2 -10 ;
                $titles.css({
                    top: titlesOffsetY,                    
                });
                adjustCenterTitle($obj.find(".center .title"));
                var $desc = $obj.find(".descript");
                $desc.css({
                    'margin-top' : (magnifierH-$galleryUL.outerHeight(true))/2-45,
                });
            }

            var ULmoveRight = function($ul , times){                
                while(times--){                    
                    var $last = $ul.find("li").last();
                    $last.detach();                
                    $ul.prepend($last);            
                    
                    $ul.css({
                        left: '-='+realLiW+'',
                    });
                    
                }                
            }

            var ULmoveLeft = function($ul , times){                
                while(times--){                                                    
                    var $first = $ul.find("li").first();                        
                    $first.detach();                                                    
                    $ul.append($first);
                    $ul.css({
                        left: '+='+realLiW+'',
                    });                          
                }                
            }

            var init = function(){              
                
                checkImageLoadComplete(function(){                    
                    adjustULPosition();                 
                    appendMagnifier();                    
                    carouselSetting();                  
                    bindClickEvent();
                    adjustTitleAndDesc();
                    bindClickButtonEvent();
                });                     

                var arVersion = navigator.appVersion.split("MSIE");
                var version = parseFloat(arVersion[1]);
                if (version < 9) {                    
                    imgScale = $imgs.first().height()/$imgs.first().width();    
                    magnifierW = $imgs.first().width()*options.zoomScale;
                    $galleryUL.find("a").height($imgs.first().height());
                    adjustULPosition();                 
                    appendMagnifier();                    
                    carouselSetting();                  
                    bindClickEvent();
                    adjustTitleAndDesc();
                    bindClickButtonEvent();
                }

            }
            init();

            
        });
    }
});         
})(jQuery);



