import Vue from 'vue';
let ws=document;

function plusReady(){
	if(plus.webview){
		ws=plus.key;
	}
	ws.addEventListener("backbutton", backHandler, false);
}
function backHandler(){
	let arr = ['login','make','main','ewm','orders'];
	let r=window.location.href.split('/');
	r=r[r.length-1];
	console.log(r)
	if(arr.indexOf(r)>0){
		// if(confirm('确认退出程序？')){
		// 	if(plus.webview){
		// 		plus.runtime.quit();
		// 	}else{
		// 		navigator.app.exitApp();
		// 	} 
		// }
		// navigator.notification.confirm("是否退出程序?",  
		// 	function(buttonIndex){
		// 		if(buttonIndex==1)navigator.app.exitApp();
		// 	},'提示',['退出','再逛逛']);  
		// 		}else if(location.hash == '#/login'){  
		// 			loginPage.back();  
		// 		}else if(location.hash == ''){  
		// 			location.href="#/homePage";  
		// 		}else{  
		// 		history.go(-1);  
		// 		}  
		if(window.cordova){
		    window.cordova.exec(function (data) {
		        },
		        function (error) {
		            console.log(error);
		        },
		        'TPGoBack',
		        'goBackAction',
		        []
		    ); 
		}else{
			if(confirm('确认退出程序？')){
				if(plus.webview){
					plus.runtime.quit();
				}
			}
		}
	}else{
		history.go(-1);
	}
}


              
function onDeviceReady() { 
    ws.addEventListener("backbutton", backHandler, false);                       
}  
function onBackKeyDown() {  
	console.log(11)
    Vue.$toast({
    	message:'再按一次退出返回键',
    	position:'bottom'
    })
    ws.removeEventListener("backbutton", onBackKeyDown, false); // 注销返回键  
    ws.addEventListener("backbutton", exitApp, false);//绑定退出事件  
    // 3秒后重新注册  
    var intervalID = window.setInterval(function() {  
        window.clearInterval(intervalID);  
        ws.removeEventListener("backbutton", exitApp, false); // 注销返回键  
        ws.addEventListener("backbutton", onBackKeyDown, false); // 返回键  
    }, 3000);  
}  
function exitApp(){  
    if(plus.webview){
		plus.runtime.quit();
	}else{
		navigator.app.exitApp();
	} 
}  


export default{
	init() {
		ws=document;
		if (window.plus) {
			plusReady();
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
		document.addEventListener("deviceready", onDeviceReady, false);  
	},
	back(){
		ws.addEventListener('backbutton',backHandler,false);
	},

	subBack(fn){
		ws.removeEventListener('backbutton',backHandler,false);
		ws.addEventListener('backbutton',subBackHandler,false);
		function subBackHandler(){
			fn();
			ws.removeEventListener('backbutton',subBackHandler,false);
			ws.addEventListener('backbutton',backHandler,false);
		}
		// ws.removeEventListener('backbutton',onBackKeyDown,false);
		// ws.addEventListener('backbutton',subBackHandler,false);
		// function subBackHandler(){
		// 	fn();
		// 	ws.removeEventListener('backbutton',subBackHandler,false);
		// 	ws.addEventListener('backbutton',onBackKeyDown,false);
		// }
	},

	mm(){
		console.log(1);
	}
}