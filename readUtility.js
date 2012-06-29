

/*				找網頁內的地址和電話				*/
var readUtility	=	(function(f){
	
	f.targetDom = null;
	
	f.addr = [];
	
	f.addrHint = new Object();
	f.addrHint.prefix = ['市','縣'];
	f.addrHint.suffix = ['路' , '街' ,'巷' , '弄' , '號' ,'樓' ];
	
	f.phoneNo = [];
	
	f.scanAddr	=	function(){
		if(!f.checkDom())
			return;
		
		var text = f.targetDom.text().trim(),
			textLength = text.length,
			searchIndex= 0,
			checkIndex = 0,
			prefix = "",
			suffix = "",
			tempStringArray = [],
			tempString = "",
		    startIndex = textLength,
		    endIndex = 0,
		    addr;
		
		
		//搜尋prefix，
		//先從最前端開始取，取出來在比較誰在前面，就從哪邊開始截字串
		//並同時推進startIndex
		while(true){
			
			//比對先出現的perfix
			for(var i = 0 ; i < f.addrHint.prefix.length ; i++){
				prefix = f.addrHint.prefix[i];
				searchIndex = text.indexOf(prefix,checkIndex);
				if(searchIndex != -1 && searchIndex < startIndex)
					startIndex = searchIndex;
			}
			
			//有新字串
			if(startIndex > 2 && checkIndex < startIndex && checkIndex < textLength){
				//紀錄檢查到哪了 +3的原因是避免掉    OO縣OO市XX路Z號  會截出兩個(OO縣OO市XX路Z號 ) (OO市XX路Z號)
				checkIndex = startIndex + 3;
				if(startIndex + 30 > textLength){
					//字串長度大於textLength
					tempString = text.substring(startIndex-2 , textLength);
				}
				else{
					tempString =  text.substring(startIndex-2 , startIndex+30);
				}
				tempStringArray.push(tempString);
				//歸零
				startIndex = textLength;
			}
			else
				break;
		}	
		
		//再把所有的tempString做結尾判斷
		for(var i = 0 ;i < tempStringArray.length ; i++){
			tempString = tempStringArray[i];
			for(var j =0 ; j < f.addrHint.suffix.length ; j++){
				suffix = f.addrHint.suffix[j];
				searchIndex = tempString.indexOf(suffix, 0);
				if(searchIndex > endIndex)
					endIndex = searchIndex;
			}
			addr = tempString.substring(0, endIndex+1);
			//歸零
			endIndex = 0;
			if(addr.length > 5)
				f.addr.push(addr);
		}
		console.log(f.addr.join("\n"));
	}
	
	
	f.scanPhoneNo	=	function(){
		if(!f.checkDom())
			return;
		
		//regExp 連續數 7~10位
		var text = f.targetDom.text().trim(),
			phoneNo,
			filter = /\d{2,4}?-?\d{6,9}/g,
			match = [];
		match =  filter.exec(text);
		
		while(match !== null){
			phoneNo = match.toString().replace("-", "");
			f.phoneNo.push(phoneNo);
			match =  filter.exec(text);
		}
		console.log(f.phoneNo.join("\n"));
	}
	
	f.setTargetDom	=	function(obj){
		f.targetDom = obj; 
	}
	
	f.checkDom	=	function(){
		if(f.targetDom == null){
			alert("can`t find target DOM or initialize fail");
			return false;
		}
		else
			return true;
	}
	
	return f;
	
	
}(readUtility || {}));

