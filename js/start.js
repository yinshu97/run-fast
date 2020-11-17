/*豆子、豆子加号、获取当前账户、获取当前账户豆子、*/
let bean = document.getElementById("beanCount");
let beanTurn = document.getElementsByClassName("beanAdd")[0].getElementsByTagName('h2')[0];
let userName = localStorage.getItem("username");
let beanNum = localStorage.getItem(userName);

if(beanNum == null)
	beanNum = 2000;
bean.innerHTML = beanNum;
//localStorage.setItem(username, parseInt(bean.innerHTML));
localStorage.setItem(userName, beanNum);

/*玩法、游戏帮助、关于游戏、免费得豆、模块标记*/
let navList = document.getElementsByClassName("nav")[0].getElementsByClassName("nav-list")
let flag = 0;

/*菜鸟场、平民场、官家场、土豪场*/
let levelList = document.getElementsByClassName("level")[0].getElementsByClassName("level-list");
let levelAlert = new Array(4);

/*弹窗*/
let alert_con = document.getElementsByClassName("alert")[0];
let alert_div = document.getElementsByClassName("alert-div")[0];
let alertSpan = document.getElementById("alertSpan");
let alert_btn = document.getElementsByClassName("alert-btn")[0];

/*右边模块*/
let nav_con = document.getElementsByClassName("container")[0].getElementsByClassName('nav-content');

/*快速开始游戏、显示场次*/
let startGame = document.getElementById("startGame");
let quickStart = document.getElementById("quickStart");
let type = -1;

/*看视频、倒计时、定时器、秒数、视频编号、看视频次数*/
let freeVideo = document.getElementsByClassName("freeVideo")[0];
let time = document.getElementsByClassName("time")[0];
let timer = null;
let timer2 = null;
let count = 0;
let n = 1;
let videoCount = 0;

window.onload = () => {
	/* 快速开始判断场次显示  */
	levelJudge();

	/* 侧边栏显示*/
	navShow();

	

	/*豆子加号跳转看视频得豆*/
	addTurn();

	/*场次判断*/
	for(let i = 0; i < 4; i++) {
		// console.log(levelList);
		levelJudge();
		levelList[i].onclick = () => {
			alertShow();
			console.log(levelAlert[i]);
			if(levelAlert[i] == "low") {
				// console.log(levelAlert[i]);
				alertSpan.innerHTML = "客官您的豆子不足啦，应该去更低级的场次玩~";

			} else if(levelAlert[i] == "high") {
				// console.log(levelAlert[i]);
				alertSpan.innerHTML = "客官您的豆子太多啦，应该去更高级的场次玩~";
			} else if(levelAlert[i] == "ok") {
				// console.log(levelAlert[i]);
				alertSpan.innerHTML = "客官，祝您玩的开心~";
				type = i;
				window.location.href = "../html/game.html" + "?type=" + encodeURI(type + 1);
			}
			setTimeout("alertHide()", 2000);
			clearTimeout();
		}
	}
	/*快速开始游戏*/
	game();

}
/*侧边栏显示*/
function navShow() {
	for(let i = 0; i < 4; i++) {
		flag = i;
		navList[i].onclick = () => {
			if(count != 0 && i != 3) {
				alertShow();
				alertSpan.innerHTML = "客官您确定要离开吗？现在离开就没有奖励啦~";
				alert_btn.style.display = "block";
				freeVideo.pause();
				clearInterval(timer);
				alert_btn.getElementsByTagName('img')[0].onclick = () => {
					count = 0;
					setTimeout("alertHide()", 10);
					navHide();
					navList[i].style.backgroundColor = "rgba(243,169,41,0.7)";
					navList[i].style.color = "whitesmoke";
					nav_con[i].style.display = "inline-block";
					alert_btn.style.display = "none";
				}
				alert_btn.getElementsByTagName('img')[1].onclick = () => {
					setTimeout("alertHide()", 10);
					setTimeout("playVideo()", 10);
				}
			} else {
				//	恢复侧边栏默认样式
				navHide();
				navList[i].style.backgroundColor = "rgba(243,169,41,0.7)";
				nav_con[i].style.display = "inline-block";
				navList[i].style.color = "whitesmoke";
				/*清除定时器，初始化视频*/
				clearInterval(timer);
				freeVideo.pause();
				freeVideo.currentTime = 0;
				count = 0;
				if(i == 3) {
					freeBean();
				}
			}
		}
	}
}

function navHide() {
	for(let i = 0; i < 4; i++) {
		navList[i].style.backgroundColor = "rgba(231,234,237,0.6)";
		nav_con[i].style.display = "none";
		navList[i].style.color = "saddlebrown";
	}
}
/*豆子加号跳转看视频得豆*/
function addTurn() {
	beanTurn.onclick = () => {
		navHide();
		navList[3].style.backgroundColor = "rgba(243,169,41,0.7)";
		nav_con[3].style.display = "inline-block";
		freeBean();
	}

}

/* 快速开始判断场次显示  */
function levelJudge() {
	if(beanNum >= 300000) {
		quickStart.innerHTML = "土豪场";
		type = 3;
		levelAlert[3] = "ok";
	} else if(beanNum < 300000) {
		levelAlert[3] = "low";
	}
	if(beanNum >= 80000) {
		quickStart.innerHTML = "官甲场";
		type = 2;
		levelAlert[2] = "ok";
	} else if(beanNum < 80000) {
		levelAlert[2] = "low";
	}
	if(beanNum >= 10000 && beanNum <= 200000) {
		quickStart.innerHTML = "平民场";
		type = 1;
		levelAlert[1] = "ok";
	} else if(beanNum < 10000) {
		levelAlert[1] = "low";
	} else if(beanNum > 200000) {
		levelAlert[1] = "high";
	}
	if(beanNum >= 2000 && beanNum <= 20000) {
		quickStart.innerHTML = "菜鸟场";
		type = 0;
		levelAlert[0] = "ok";
	} else if(beanNum < 2000) {
		levelAlert[0] = "low";
	} else if(beanNum > 20000) {
		levelAlert[0] = "high";
	}

}

/*看视频*/
function freeBean() {
	/*随机视频*/
	n = parseInt(Math.random() * 5 + 1);
	freeVideo.src = "../video/" + n + ".mp4";

	/*视频未加载完，获取不到时长*/
	setTimeout(() => {
		count = parseInt(freeVideo.duration + 1);
		time.innerHTML = --count;
	}, 300);
	if(beanNum < 3000) {
		playVideo();
	} else {
		setTimeout(function() {
			count = 0;
			flag = 0;
			alertShow();
			alertSpan.innerHTML = "客官您现在很富有，需要的时候再来领奖励哦~";
			alert_btn.style.display = "none";

		}, 1000);
		setTimeout(function() {
			alertHide();
			navHide();
			navList[0].style.backgroundColor = "rgba(243,169,41,0.7)";
			nav_con[0].style.display = "inline-block";
		}, 4000);
	}
}

/*暂停视频后播放*/
function playVideo() {
	/*播放视频、倒计时*/
	freeVideo.play();
	timer = setInterval(function() {
		time.innerHTML = --count;
		if(count == 0) {
			videoCount++;
			clearInterval(timer);
			freeVideo.pause();
			/*更新豆子*/
			addUpdata();
		}
	}, 1000);
}

/*看视频得豆子动画*/
function addUpdata() {
	let i = 0;
	timer2 = setInterval(function() {
		let j = parseInt(Math.random() * 10 + 1);
		i += j;
		if(i >= 1000) {
			/*i-1000是j多出的部分*/
			j = j - (i - 1000);
			clearInterval(timer2);
		}
		beanNum = parseInt(beanNum) + j;
		localStorage.setItem(userName, beanNum);
		bean.innerHTML = beanNum;
		levelJudge();
	}, 0.05);
}

/*场次弹窗*/
function alertShow() {
	alert_con.style.display = "block";
	alert_con.style.backgroundColor = "rgba(0,0,0,0.3)";
}

function alertHide() {
	alert_con.style.display = "none";
	alert_con.style.backgroundColor = "";
}

/*快速开始游戏*/
function game() {
	startGame.onclick = () => {
		//				console.log(type+1);
		window.location.href = "../html/game.html" + "?type=" + encodeURI(type + 1);
	}
}