//let loadingBar = document.getElementsByClassName("loadingBar")[0];
let bar = document.getElementsByClassName("bar")[0];
let headBar = document.getElementsByClassName("headBar")[0];
let num = 0;
let timer;
window.onload = () => {
	loading();  
}

function loading(){
	num = num + Math.random()*4;
	if(num>100)
		num = 100;
	bar.style.width = num +"%";
	headBar.style.marginLeft = num +"%";
	if(bar.style.width == "100%"){
		window.clearTimeout(timer);
		window.location.href = "../html/start.html";
		return;
	}
	timer = window.setTimeout("loading()",50);
}