$(function(){

		//获取随机名字
		var getName = function(){
			var xing="杨,黄,何,赵,孙";
			var ming="狗,大头,憨憨,猪,dog,pig,fool";
			var xinga= xing.split(",");
			var minga= ming.split(",");
			return xinga[Math.floor(Math.random() * (xinga.length))] + minga[Math.floor(Math.random() * (minga.length))];
		}

		var is_tuoguan = false; //是否开启托管模式
		var all_poker = Array();//所有扑克
		var play_1 = Array();	//左边玩家牌组
		var play_2 = Array();	//中边玩家牌组
		var play_3 = Array();	//右边玩家牌组

		var click = 0;			//游戏开始开关变量

		var video = document.getElementById("startVideo");
		var music = document.getElementById("bgmusic"); 

		var type = window.location.href.split("=")[1];   //场次类型
		var type_title = [0,'菜鸟场','平民场','官甲场','土豪场']; //场次标题
		var score = [0,200,600,1000,2000];				 //底分
		var times = score[type];                         //倍数
		var username1 = getName();						 //获取随机姓名
		var username2 = window.localStorage.getItem("username"); //玩家2用户名
		var username3 = getName();						 //获取随机姓名
		//给另外两位玩家生成随机豆豆
		var play_1_bean = Math.round(Math.random()*1000+Math.random()*100); //玩家1的豆子
		var play_2_bean = window.localStorage.getItem(username2);	//玩家2的豆子
		var play_3_bean = Math.round(Math.random()*1000+Math.random()*100);  //玩家3的豆子

		var bean_area = [{},{x:2000,y:20000},{x:10000,y:200000},{x:80000,y:300000},{x:300000,y:1000000}];

		if(type == 1){
			play_1_bean += 2000;
			play_3_bean += 2000;
		}else if(type == 2){
			play_1_bean += 10000;
			play_3_bean += 10000;
		}else if(type == 3){
			play_1_bean += 80000;
			play_3_bean += 80000;
		}else{
			play_1_bean += 300000;
			play_3_bean += 300000;
		}
		
		//初始化
		var gameLoad = function(){
			$(".scoreContent span").html(times);
			$(".info-panel1 div span").text(play_1_bean);
			$(".info-panel2 div span").text(play_2_bean);
			$(".info-panel3 div span").text(play_3_bean);
			$(".info-panel1 > span").text(username1);
			$(".info-panel2 > span").text(username2);
			$(".info-panel3 > span").text(username3);
			$(".scoreFrame .title").text(type_title[type]);

			$(".return").on('click',function(){
				var storage=window.localStorage;
				storage[username2] = play_2_bean;
				window.location.href="../html/start.html";
			});

			//初始化所有牌
			for (var i = 1; i <= 13; i++) {
				for (var j = 0; j <=3 ; j++) {
					if((i == 12 && j == 3) || (i == 13 && j == 0) || (i == 13 && j == 2) || (i == 13 && j == 3))
						continue;
					all_poker[all_poker.length] = i+'_'+j;
				}
			}

			// 生成所有牌的节点
			for(var i = 0; i<48; i++){
				$('.mid_top .all_poker').append('<li class="back"></li>');
			}

			//音频播放事件
			$("#soundControl").on("click",function(){
				if(music.paused && video.paused){   //视频播放时不能播放音频
					music.play();
					$(".sound").removeClass("sound_pause");
					$(".sound").addClass("sound_play");
				}else{
					music.pause();
					$(".sound").removeClass("sound_play");
					$(".sound").addClass("sound_pause");
				}
			})

			//视频播放事件
			$("#videoControl").on("click",function(){
				music.pause(); //视频播放时让音频暂停播放
				if(video.paused){
					$("#startVideo").css("display","block");
					$(".content").css("background","none");
					video.play();
				}else{
					$("#startVideo").css("display","none");
					$(".content").css({
						"background":"url(../bg/1.jpg) no-repeat center",
						"background-size":"cover"
					});
					video.pause();
					music.play();
				}
				var aud = document.getElementById("startVideo");
				aud.onended = function() {			//设置视频播放完隐藏
					$("#startVideo").css("display","none");
					music.play();
				};
			})

			//点击牌身
			$('body').on('click', '.all_poker li', function(){

				if(video.paused){ //开始是音频暂停
					music.play();
				}

				if (click == 0) { //还没点击过，说明是洗牌阶段
					click++;
					clearPoker();	//执行洗牌				
					sound(xp);
					//打乱牌组顺序
					all_poker = all_poker.sort(function(x,y){
						return Math.random() - 0.5;
					});
				}
			});

			//点击按钮，把提示div消失
			$('.content').on('click','#ok',function(){
				$('#tishi').css('display','none');	
			});
			$("#exitGame").on('click',function(){
				var storage=window.localStorage;
				storage[username2] = play_2_bean;
				window.location.href="../html/start.html";
			})
		}
		gameLoad();

		
		//洗牌函数
		var poker_html;
		var clearPoker = function(){
			// animated = true;
			// 先保存原牌组的HTML代码
			poker_html = $('.mid_top').html();
			// 删除原牌组
			$('.mid_top .all_poker').remove();
			$('.mid_top .play_4').remove();

			var ul = '';
			ul += '<ul class="all_poker" style="left:0px">';
			for (var i = 1; i <48; i++) {
				ul += '<li class="back" style="left:0"></li>'
			}
			ul += '</ul>';
			$('.mid_top').append(ul);
			
			var i = 0;
			var xipai = setInterval(function(){
				var ani = setTimeout(function(){
					$('.all_poker li').eq(1).css({
						'transform':'translateX(-300px)',
						'transform-origin': '0px,0px',
						'transition':'0.5s'
					});
					$('.all_poker li').eq(2).css({
						'transform':'translateX(300px)',
						'transform-origin': '0px,0px',
						'transition':'0.5s'
					});
					clearInterval(ani);
					
				},100);
				var ani2 = setTimeout(function(){
					$('.all_poker li').eq(1).css({
						'transform':'translateX(0)',
						'transform-origin': '0px,0px',
						'transition':'0.5s'
					});
					$('.all_poker li').eq(2).css({
						'transform':'translateX(0)',
						'transform-origin': '0px,0px',
						'transition':'0.5s'
					});
					clearInterval(ani2);
					
				},700);
				i++;
				if(i++ >= 5){
					clearInterval(xipai);
				}
			},1000);

			setTimeout(function(){
				click++;
				start();
				// sound(fp);
			},5000);
		}
		
		//开始发牌函数
		var start = function(){
			var i1 = 0;
			var i2 = 0;
			var i3 = 0;
			var m = 0;
			var int = setInterval(function(){
				//发牌给左边玩家
				setTimeout(function(){
					$('.all_poker li:last').animate({top:'200px',left:'-500px'},20);
					setTimeout(function(){
						$('.all_poker li:last').remove()
					},250)
					play_1.push(all_poker[m++]);			//左边玩家牌组++
					var poker_html = makeAIPoker()				//AI牌生成
					$('.play_1').append(poker_html);
					$('.play_1 li:last').css({top:30*(i1+1)+'px'});
					i1++;
				},30)
				//发牌给中间玩家
				setTimeout(function(){
					$('.all_poker li:last').animate({top:'400px'},20);
					setTimeout(function(){
						$('.all_poker li:last').remove();
					},250)
					play_2.push(all_poker[m++]);			//中间玩家牌组++
					var poker_html = makePoker(play_2[play_2.length-1])							
					$('.play_2').append(poker_html);
					$('.play_2 li:last').css({left:30*i2+'px'})
					$('.play_2').css({left:-20*i2+'px'})
					i2++;
				},60);
				//发牌给右边玩家
				setTimeout(function(){
					$('.all_poker li:last').animate({top:'200px',left:'500px'},20);
					setTimeout(function(){
						$('.all_poker li:last').remove()
					},250)
					play_3.push(all_poker[m++]);	//右边玩家牌组++
					var poker_html = makeAIPoker()		//AI牌生成
					$('.play_3').append(poker_html);			
					$('.play_3 li:last').css({top:30*(i3+1)+'px'})
					i3++;
					// console.log(i);
				},90)
				if (i1 >= 15 && i2 >= 15 && i3 >= 15) {
					clearInterval(int);
					//先得到已经重新整理好的三个玩家牌组数据
					setTimeout(function(){
						play_1 = getsort(play_1);
						play_2 = getsort(play_2);
						play_3 = getsort(play_3);
						$('.play_2 li').css({'background':''}).attr('class','back');
						//等0.5秒之后重新生成排序好的牌
						setTimeout(function(){
							//先删除2号玩家的牌
							$('.play_2 li').remove();
							for (var i = 0; i < play_1.length; i++) {
								//生成2号玩家的牌
								var poker_html_2 = makePoker(play_2[i])
								$('.play_2').append(poker_html_2);
								$('.play_2 li:last').css({left:30*i+'px'})
								$('.play_2').css({left:-20*i+'px'})
							}
						},500)
					},1000)

					$('.mid_top .all_poker').remove();
                    // $('body p').eq(0).html('剩余'+parseInt(play_1.length)+'张');
                    // $('body p').eq(1).html('剩余'+parseInt(play_2.length)+'张');
                    // $('body p').eq(2).html('剩余'+parseInt(play_3.length)+'张');
                }
            },100);

			//等整理好牌之后再开始倒计时
			setTimeout(function(){
				var first = Math.round(Math.random()*2);
				startGame(first);
			},4000);
        }

		//牌面生成
		var makePoker = function(data){
			var data = data;
			var poker_arr = data.split('_');

			var arr = Array(
				Array(-40, -231),	//方块
				Array(-40, -47),	//梅花
				Array(-155, -47),	//红桃
				Array(-155, -231)	//黑桃
			);		//保存各花色的坐标
			if (poker_arr[0] != 14&&poker_arr[0] != 15) {
				var x = arr[poker_arr[1]][0];	
				var y = arr[poker_arr[1]][1];
			}else{
				if (poker_arr[1] == 0) {
					var x = -155;
					var y =-47;
				}else{
					var x = -40;
					var y = -47;
				}
			}
			var poker_html = '<li data="'+data+'"; style="width: 93px; height: 138px;  background: url(../images/'+poker_arr[0]+'.png) '+x+'px '+y+'px;"></li>'
			return poker_html;
		}

		var makeAIPoker = function(){
			var poker_html = '<li class="back"></li>'
			return poker_html;
		}

		//排序函数
		var getsort = function(data_arr){
			data_arr.sort(function(x,y){
				var x_arr = x.split('_');	//使用_字符分割，x_arr[0]=>点数，x_arr[1]=>花色
				var y_arr = y.split('_');	//使用_字符分割，y_arr[0]=>点数，y_arr[1]=>花色
				if (x_arr[0] != y_arr[0]) {		//如果两张牌点数不相等
					return y_arr[0]-x_arr[0];	//返回负值，不动，正值，调换
				}else{
					return y_arr[1]-x_arr[1];	//否则相等的话使用花色进行排序
				}
			});
			return data_arr;
		}
		
		//点击按钮，将排行榜div消失
		 // $(".content").on('click','#conform',function(){
		 // 		$('#win').css('display','none');
		 // })
		 var refreshPlaying = function(){
		 	$('body').on('click','#conform',function(){
		 		$('#win').css({"display":"none"});
		 		$('.tuoguan').css('display','none');
		 		var storage=window.localStorage;
			 	storage[username2] = play_2_bean;
		 		//豆子不足或者太多时，强制退出游戏
				if(parseInt(play_2_bean) < parseInt(bean_area[type].x)){
					// alert("豆子不足！");
					$('.alert-div1').css({"display":"block"});
					setTimeout(function(){
						window.location.href="../html/start.html";
					},2000);
				}else if(parseInt(play_2_bean) > parseInt(bean_area[type].y)){
					// alert("豆子太多！");
					$('.alert-div2').css({"display":"block"});
					setTimeout(function(){
						window.location.href="../html/start.html";
					},2000);
				}else{
					var url = window.location.href;		//重新刷新页面
					window.location.href = url;
				}
			})
		 }

		//出牌动画函数
		var move = function() {
			$('body').on('click','.play_2 li', function(){	//只绑定玩家2的牌
				var select = $(this).attr('class');
				if (select == 'select') {	//如果牌已经选中了，就弹下去
					$(this).attr('class','');
					var data = $(this).attr('data');
					for (var i = 0; i < temp_poker.length; i++) {
						if (temp_poker[i] == data) {	//删除对应选中的牌数据
							temp_poker.splice(i,1);
							break;
						}
					}
				}else{	
					//如果牌没选中，就弹上去
					$(this).attr('class','select');
					var data = $(this).attr('data');
					temp_poker.push(data);
				}
			})
		}
		
		//开始打牌函数
		var now_poker = Array();	//场上目前扑克	 
		/*
		内含五个值 
		0.场上牌堆数组
		1.牌型
		2.牌型最大值
		3.炸弹类型
		4.身份
		*/
		var temp_poker = Array();	//传输玩家牌组数据的数组
		var temp_poker_type = 0;
		var pass = 1;				//pass的次数
		var startGame = function(index){
			var index = index + 1;
			if(index == 1){
				var this_player = play_1;
			}else if(index == 2){
				move();		//只有在轮到玩家2的时候才绑定出牌
				var this_player = play_2;
			}else{
				var this_player = play_3;
			}
			// $('body p').eq(0).html('剩余'+parseInt(play_1.length)+'张');
			// $('body p').eq(1).html('剩余'+parseInt(play_2.length)+'张');
			// $('body p').eq(2).html('剩余'+parseInt(play_3.length)+'张');
			$(".scoreFrame").css({"display":"block"})//积分版显示
			
			//绑定打牌玩家可以点击牌的事件函数
			$('.play_'+index+'~.clock').show();
			$('.play_'+index+'~.play').show();
			$('.play_'+index+'~.pass').show();
			//先开启计时器
			if(index != 2){		//AI时间改成1秒
				var n = 1;
				$('.play_'+index+'~.clock').html(n);
			}else{
				var n;
				if(is_tuoguan == true)
					n = 1;
				else 
					n = 15;
				$('.play_'+index+'~.clock').html(n);
			}
			var int = setInterval(function(){

				var n = Number($('.play_'+index+'~.clock').html());
				$('.play_'+index+'~.clock').html(--n);
				// if (n == 5 && index == 2) {//花儿都谢了语音
				// 	sound(huadouxiele);
				// }
				if ( n <= 0 ) {
					$('.play_'+index+'~.clock').hide();
					clearInterval(int);
					//======================================================================================
					//时间到零
					//检测牌桌上是否有牌，有就直接pass，没就自动出最小的牌
					if(now_poker.length == 0){
					    //hrz:这里的判断很关键，需要将自动选中的牌清除。
					    if(index==2){
					    	temp_poker = [];
					    	is_tuoguan = true;
					    	$('.tuoguan').css('display','block');
					    }
						aiAuto(index);//Ai自动出最小的牌
						playCard(index,int);
					}else{
						// 这里要的起必须要
						if(index==2){
					   	//hrz:这一步很关键，当用户选择了牌型，但是没有点击出牌按钮且计时器到最后一秒时，
						   //需将用户选择的牌从temp_poker中全部清除，由ai进行分析，
						   // 选择最小的要的起的一张牌。
						   temp_poker=[];
						   is_tuoguan = true;
						   $('.tuoguan').css('display','block');
						}
						temp_poker = [];
						var satisfy = aiPlayer(index);//自动分析牌型出牌出牌
						if(satisfy){
							playCard(index,int);//打得过
						}else{
							passCard(index,int);//打不过就PASS;
						}
					}
				}
			},1000)

			$("#cancelTuoguan").on('click',function(){
				is_tuoguan = false;
				$('.tuoguan').css('display','none');
			});
			//清除默认的右键事件并且重新绑定右键出牌
			if(index == 2){
				$(document).contextmenu('body', function(e){
					e.preventDefault();
				});
				$('body').bind('mousedown',function(e){
					if(e.button == 2){//右键
						$('.play_2~.play').trigger("click");	
					}
				});
			}
			//================================出牌点击按钮=================		
			$('body').on('click','.play_2~.play', function(){
				playCard(index,int);
			});
			//================================PASS按钮====================
			$('body').on('click','.play_2~.pass', function(){
				//hrz:点击不出按钮时，先判断手中的牌是否能出
				if(passCheck(index,int)){
					$('#must').show().delay(2000).fadeOut();
					// alert("您打得起就必须要啊！")
				}else{
					passCard(index,int);
				}
			});
		}

		//hrz:当点击“不出”按钮时，判断手中的牌是否出得起，若出得起，则必须要
		var passCheck = function(index,int){
            //分离提取牌型数据
            var aiPokerNum = Array();		//牌编号
            var myRank = $('.rank').eq(index-1).html();		//明确自己身份
            if(index == 1){
            	var aiPoker = play_1;
            }else if(index == 2){
            	var aiPoker = play_2;
            }else if(index == 3){
            	var aiPoker = play_3;
            }

            for(var i = 0;i <= aiPoker.length-1; i++){
            	var aiPokerData = aiPoker[i].split("_");
            	aiPokerNum.push(aiPokerData[0])
            }
            //先判断牌型   再判断大小   再判断身份
            if(now_poker[1] == 1){											//单张
				//否则按常规出牌
				return judgeRank1(myRank,AI_dan1,aiPokerNum,aiPoker)
            }else if(now_poker[1] == 2){									//对子
            	return judgeRank1(myRank,AI_duizi1,aiPokerNum,aiPoker)
            }else if(now_poker[1] == 3){											//三条
            	return judgeRank1(myRank,AI_san1,aiPokerNum,aiPoker)
            }else if(now_poker[1] == 4){											//三带一
            	return judgeRank1(myRank,AI_sandaiyi1,aiPokerNum,aiPoker)
            }else if(now_poker[1] == 5){											//三带二
            	return judgeRank1(myRank,AI_sandaier1,aiPokerNum,aiPoker)
            }else if(now_poker[1] == 4 || now_poker[1] == 6 || now_poker[1] == 10 ||now_poker[1] == 11 ||	//顺子
            	now_poker[1] == 12 ||now_poker[1] == 16 ||now_poker[1] == 18 ||
            	now_poker[1] == 21 ||now_poker[1] == 22){
            	return judgeRank1(myRank,AI_shunzi1,aiPokerNum,aiPoker)
            }else if(now_poker[1] == 9 || now_poker[1] == 13 ||now_poker[1] == 19 ||	//连对
            	now_poker[1] == 23 ||now_poker[1] == 26 ||now_poker[1] == 29 ||
            	now_poker[1] == 31 ||now_poker[1] == 32){
            	return judgeRank1(myRank,AI_liandui1,aiPokerNum,aiPoker)
            }else if(now_poker[1] == 6 || now_poker[1] == 8 ||now_poker[1] == 24 ||	    //三顺
            	now_poker[1] == 27){
            	return judgeRank1(myRank,AI_sanshun1,aiPokerNum,aiPoker)
            }else if(now_poker[1] == 14 || now_poker[1] == 25 ||now_poker[1] == 30){	//带单飞机
            	return judgeRank1(myRank,AI_feijidaidan1,aiPokerNum,aiPoker)
            }else if(now_poker[1] == 998){
            	return judgeRank1(myRank,AI_BoomVsBoom1,aiPokerNum,aiPoker)
            }
        }


    //判断压牌类型以及判断牌型及判断牌型大小
    var judgeRank1 = function(myRank,Fun,aiPokerNum,aiPoker){
    	return Fun(aiPokerNum,aiPoker);
    }

    var playCard = function(index,int){
		//对出牌进行检测
		var temp_arr = checkPokers(temp_poker);			//调用检查牌型
	
		if (!temp_arr) {
			$('#tishi1').show().delay(2000).fadeOut();
		}else{
			temp_poker_type = temp_arr[1];
			var vs_result = checkVS(temp_arr,now_poker);	//判断牌面大小牌型
			if (!vs_result) {
				$('#tishi2').show().delay(2000).fadeOut();
				return false;
			}else{
				//说明能打出去
				pass = 1;	
				/*
				由于temp_poker到的后会清空或者换成别的样子，而这的now_poker需要把值固定下来，所以不能使用引用赋值的方法来进行直接赋值，要用复制赋值。
				*/
				sound_play(temp_arr)	//出牌音效
				var images_src = images_name(temp_arr)
				images(images_src)		//出牌特效

				now_poker = Array();
				now_poker[0] = Array();
				for (var i = 0; i < temp_poker.length; i++) {
					now_poker[0].push(temp_poker[i]);
				}
				now_poker[1] = temp_arr[1];			//牌型存储
				now_poker[2] = temp_arr[2];			//保存关键值
				if (temp_arr[2] == 998) {				//如果是炸弹，还要保存是什么炸弹
					now_poker[3] = temp_arr[3];
				}else{
					now_poker[3] = "";
				}
				now_poker[4] = $('.rank').eq(index-1).html();
				//关计时器
				clearInterval(int);
				// 解除原来绑定的事件
				clickOff();
				$('body').unbind('mousedown');				//解除右键出牌的绑定事件
				
				if(index == 1){								//判断第几个玩家出牌，出牌的上上个玩家的牌被清空
					$('.now_poker_2 li').remove();
				}else if(index == 2){
					$('.now_poker_3 li').remove();
				}else if(index == 3){
					$('.now_poker_1 li').remove();
				}
				//让玩家的牌出到对应的位置
				for (var i = 0; i < now_poker[0].length; i++) {
					var li = makePoker(now_poker[0][i]);
					$('.now_poker_'+index).append(li);
					$('.now_poker_'+index+' li:last').css({left:30*i+'px'})
				}
				switch(index){
					case 1:
						play_1 = delPoker(play_1,temp_poker);	//删除牌型
						btnHide(index);
						$('.play_1 li').remove();
						baodanAndbaoshuang(play_1);
						if (play_1.length == 0) {
							judgeResult(index,play_2,play_3);
							refreshPlaying();				//重新刷新页面
							clearInterval(int);
							return 0;
						}
						for (var i = 0; i < play_1.length; i++) {
							// 重新生成1号玩家的牌
							var poker_html_1 = makeAIPoker()
							$('.play_1').append(poker_html_1);		
							$('.play_1 li:last').css({top:30*(i+1)+'px'})
						}
						//有炸弹，给其他两位玩家增加豆豆
						if (temp_arr[2] == 998) {
							play_2_bean = parseInt(play_2_bean) - parseInt(times*5);
							play_3_bean = parseInt(play_3_bean) - parseInt(times*5);
							play_1_bean = parseInt(play_1_bean) + parseInt(times*10);
							$(".info-panel1 div span").text(play_1_bean);
							$(".info-panel2 div span").text(play_2_bean);
							$(".info-panel3 div span").text(play_3_bean);
						}
						startGame(index);						//递归调用开始打牌函数
						break;
						case 2:
						play_2 = delPoker(play_2,temp_poker);
						btnHide(index);
						$('.play_2 li').remove();
						baodanAndbaoshuang(play_2)
						if (play_2.length == 0) {
							judgeResult(index,play_1,play_3);
							refreshPlaying();	//重新刷新页面
							$('body').on('click','#ok',function(){
								var url = window.location.href;		
								window.location.href = url;
								
							})
							clearInterval(int);
							return 0;
						}
						for (var i = 0; i < play_2.length; i++) {
							// 重新生成2号玩家的牌
							var poker_html_1 = makePoker(play_2[i])
							$('.play_2').append(poker_html_1);		
							$('.play_2 li:last').css({left:30*i+'px'})
							$('.play_2').css({left:-20*i+'px'})
						}
						//有炸弹，给其他两位玩家增加豆豆
						if (temp_arr[2] == 998) {
							play_3_bean = parseInt(play_3_bean) - parseInt(times*5);
							play_1_bean = parseInt(play_1_bean) - parseInt(times*5);
							play_2_bean = parseInt(play_2_bean) + parseInt(times*10);
							$(".info-panel1 div span").text(play_1_bean);
							$(".info-panel2 div span").text(play_2_bean);
							$(".info-panel3 div span").text(play_3_bean);
						}
						startGame(index);					//递归调用开始打牌函数
						break;
						case 3:
						play_3 = delPoker(play_3,temp_poker);
						btnHide(index);
						$('.play_3 li').remove();
						baodanAndbaoshuang(play_3)
						if (play_3.length == 0) {
							judgeResult(index,play_1,play_2);
							refreshPlaying();	//重新刷新页面
							clearInterval(int);
							return 0;
						}
						for (var i = 0; i < play_3.length; i++) {
							// 重新生成3号玩家的牌
							var poker_html_3 = makeAIPoker()
							$('.play_3').append(poker_html_3);		
							$('.play_3 li:last').css({top:30*(i+1)+'px'})
						}
						//有炸弹，给其他两位玩家增加豆豆
						if (temp_arr[2] == 998) {
							play_2_bean = parseInt(play_2_bean) - parseInt(times*5);
							play_1_bean = parseInt(play_1_bean) - parseInt(times*5);
							play_3_bean = parseInt(play_3_bean) + parseInt(times*10);
							$(".info-panel1 div span").text(play_1_bean);
							$(".info-panel2 div span").text(play_2_bean);
							$(".info-panel3 div span").text(play_3_bean);
						}
						index = 0;		 //返回左边出牌的玩家出牌
						startGame(index);	//递归调用开始打牌函数
						break;
					}
				}
			}
		}
		var passCard = function(index,int){
			if (now_poker.length == 0) {
				$('#tishi').show().delay(2000).fadeOut();
				return 1;
			}
			sound(cp_no); 				//播发PASS音效
			//点击pass，所有被选中的牌会被取消选中
			for(var i=0; i<21; i++){
				var select = $('.play_'+index+' li').eq(i).attr('class');
				if (select == 'select') {				//如果牌已经选中了，就弹下去
					$('.play_'+index+' li').eq(i).attr('class','');
					temp_poker.splice(0,1);
				}
			}
			pass += 1;
			//点击pass，上上个玩家的牌也会消失
			if(index == 1){
				$('.now_poker_2 li').remove();
			}else if(index == 2){
				$('.now_poker_3 li').remove();
			}else if(index == 3){
				$('.now_poker_1 li').remove();
			}
			if (pass > 2) {
				pass = 1;
				now_poker = Array();	//pass两次，清空台面所有牌
				$('.now_poker_1 li').remove();
				$('.now_poker_2 li').remove();
				$('.now_poker_3 li').remove();		
			}
			clearInterval(int);
			clickOff();
			btnHide(index);
			if ( index==3 ) {
				index = 0;
			}
			startGame(index);	//继续游戏下一个玩家出牌
		}

		/***hrz  排行榜相关信息****/
		var rankMessage = function(index,left_poker_num_1,left_poker_num_2,left_poker_num_3,play_1_bean,play_2_bean,play_3_bean,deducation1,deducation2,deducation3){
			let count = 0;
			var message=[
			{
				user_name: username1,
				left_poker_num: left_poker_num_1,
				play_bean: play_1_bean,
				user_times: times,
				deducation: deducation1
			},
			{
				user_name:username2,
				left_poker_num:left_poker_num_2,
				play_bean:play_2_bean,
				user_times:times,
				deducation: deducation2
			},
			{
				user_name:username3,
				left_poker_num:left_poker_num_3,
				play_bean:play_3_bean,
				user_times:times,
				deducation: deducation3
			}

			];
			var compare = function(obj1,obj2){
				var val1 = obj1.left_poker_num;
				var val2 = obj2.left_poker_num;
				if(val1<val2){
					return -1;
				}else if(val1>val2){
					return 1;
				}else{
					return 0;
				}
			}
			message.sort(compare);
			for (let m of message) {
				if (m.play_bean == 0) {
					$(".userMessage").eq(count++).html('<span>' + m.user_name + '</span>' + '<span>' + m.user_times + '</span>' + '<span>' + m.deducation +"&nbsp;"+"&nbsp;"+ "<img src='../images/bankruptcy.png'>"+'</span>');
				} else {
					$(".userMessage").eq(count++).html('<span>' + m.user_name + '</span>' + '<span>' + m.user_times + '</span>' + '<span>' + m.deducation + '</span>');
				}
			}

			$('#win').css('display','block');
		}


		//判断结果
		var judgeResult = function(index,lose_1,lose_2){
			var nc=[];
			let count = 0;
			var left_poker_num_1 = play_1.length; //玩家1剩下的牌数
			var left_poker_num_2 = play_2.length; //玩家2剩下的牌数
			var left_poker_num_3 = play_3.length; //玩家3剩下的牌数

			var deduction1 = 0;  //玩家1本场增加或扣除的豆豆
            var deduction2 = 0; //玩家2本场增加或扣除的豆豆
            var deduction3 = 0; //玩家3本场增加或扣除的豆豆

            switch(index){
            	case 1: 
					//如果玩家2豆子数量不够扣，就扣到0为止
					if(left_poker_num_2*times >= play_2_bean){
						play_1_bean = parseInt(play_1_bean) + parseInt(play_2_bean);
						deduction1 += play_2_bean;
						deduction2 -= play_2_bean;
						play_2_bean = 0;
					}else{
						play_1_bean = parseInt(play_1_bean) + parseInt(left_poker_num_2*times);
						play_2_bean -= left_poker_num_2*times;
						deduction1 += left_poker_num_2*times;
						deduction2 -= left_poker_num_2*times;
					}
					//如果玩家3豆子数量不够扣，就扣到0为止
					if(left_poker_num_3*times >= play_3_bean){
						play_1_bean = parseInt(play_1_bean) + parseInt(play_3_bean);
						deduction1 += play_3_bean;
						deduction3 -= play_3_bean;
						play_3_bean = 0;
					}else{
						play_1_bean = parseInt(play_1_bean) + parseInt(left_poker_num_3*times);
						play_3_bean -= left_poker_num_3*times;
						deduction1 += left_poker_num_3*times;
						deduction3 -= left_poker_num_3*times;
					}
					break;
					case 2:
					//如果玩家1豆子数量不够扣，就扣到0为止
					if(left_poker_num_1*times >= play_1_bean){
						play_2_bean = parseInt(play_2_bean) + parseInt(play_1_bean);
						deduction2 += play_1_bean;
						deduction1 -= play_1_bean;
						play_1_bean = 0;
					}else{
						play_2_bean = parseInt(play_2_bean) + parseInt(left_poker_num_1*times);
						play_1_bean -= left_poker_num_1*times;
						deduction2 += left_poker_num_1*times;
						deduction1 -= left_poker_num_1*times;

					}
					//如果玩家3豆子数量不够扣，就扣到0为止
					if(left_poker_num_3*times >= play_3_bean){
						play_2_bean = parseInt(play_2_bean) + parseInt(play_3_bean);
						deduction2 += play_3_bean;
						deduction3 -= play_3_bean;
						play_3_bean = 0;
					}else{
						play_2_bean = parseInt(play_2_bean) + parseInt(left_poker_num_3*times);
						play_3_bean -= left_poker_num_3*times;
						deduction2 += left_poker_num_3*times;
						deduction3 -= left_poker_num_3*times;
					}
					break;
					case 3:
					//如果玩家1豆子数量不够扣，就扣到0为止
					if(left_poker_num_1*times >= play_1_bean){
						play_3_bean = parseInt(play_3_bean) + parseInt(play_1_bean);
						deduction3 += play_1_bean;
						deduction1 -= play_1_bean;
						play_1_bean = 0;
					}else{
						play_3_bean = parseInt(play_3_bean) + parseInt(left_poker_num_1*times);
						play_1_bean -= left_poker_num_1*times;
						deduction3 += left_poker_num_1*times;
						deduction1 -= left_poker_num_1*times;

					}
					//如果玩家2豆子数量不够扣，就扣到0为止
					if(left_poker_num_2*times >= play_2_bean){
						play_3_bean = parseInt(play_3_bean) + parseInt(play_2_bean);
						deduction3 += play_2_bean;
						deduction2 -= play_2_bean;
						play_2_bean = 0;
					}else{
						play_3_bean = parseInt(play_3_bean) + parseInt(left_poker_num_2*times);
						play_2_bean -= left_poker_num_2*times;
						deduction3 += left_poker_num_2*times;
						deduction2 -= left_poker_num_2*times;
					}
					break;
				}

				$('.tuoguan').css('display','block');
				rankMessage(index,left_poker_num_1,left_poker_num_2,left_poker_num_3,play_1_bean,play_2_bean,play_3_bean,deduction1,deduction2,deduction3);
				
			}

			var baodanAndbaoshuang = function(player){
				if (player.length == 1) {
					sound(baodan);
				}
				if (player.length == 2) {
					sound(baoshuang);
				}
			}
		//接触按钮绑定
		var clickOff = function(){
			$('body').off('click','.play_2~.play');
			$('body').off('click','.play_2 li');
			$('body').off('click','.play_2~.pass');
		}
		//按钮隐藏
		var btnHide = function(index){
			$('.play_'+index+'~.clock').hide();
			$('.play_'+index+'~.play').hide();
			$('.play_'+index+'~.pass').hide();
		}

		//自动选中最小的牌
		var aiAuto = function( index ){						//自动会出其他牌型和下家报单的时候不能出单张
			var myRank = $('.rank').eq(index-1).html();	    //明确自己身份
			if(index == 1){
				var aiPoker = play_1;
				var nextPlayerPoker = play_2;
				var nextPlayerRank = $('.rank').eq(1).html();
			}else if(index == 2){
				var aiPoker = play_2;
				var nextPlayerPoker = play_3;
				var nextPlayerRank = $('.rank').eq(2).html();
			}else if(index == 3){
				var aiPoker = play_3;
				var nextPlayerPoker = play_1;
				var nextPlayerRank = $('.rank').eq(0).html();
			}
			var aiPokerNum = Array();		//牌编号
			//分离提取牌型数据
			for(var i = 0;i <= aiPoker.length-1; i++){
				var aiPokerData = aiPoker[i].split("_");
				aiPokerNum.push(aiPokerData[0])
			}
			if(myRank == nextPlayerRank && nextPlayerPoker.length == 1){				//下家剩一个牌并且是一个阵容的时候
				temp_poker.push(aiPoker[aiPoker.length-1]);								//打出最小放你过
			}else if(myRank == nextPlayerRank && nextPlayerPoker.length == 2){			//下家剩2张并且是一个阵容
				for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){						
					if(aiPokerNum[i] == aiPokerNum[i-1]){
						temp_poker.push(aiPoker[i]);
						temp_poker.push(aiPoker[i-1]);
						return true
					}
				}
				autoRoutine(aiPoker);													//没有对子的话继续按常规出牌
			}else if(myRank != nextPlayerRank && nextPlayerPoker.length == 1){			//下家剩一个牌并且不是一个阵容的时候
				for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){						//优先出对子
					if(aiPokerNum[i] == aiPokerNum[i-1]){
						temp_poker.push(aiPoker[i]);
						temp_poker.push(aiPoker[i-1]);
						return true
					}
				}
				temp_poker.push(aiPoker[0]);					//没有对子的话要顶大，0为最大的牌
			}else{
				autoRoutine(aiPoker);
			}
		}

		//常规自动出牌
		var autoRoutine = function(aiPoker){						
			var aiPokerNum = Array();		//牌编号
			//分离提取牌型数据
			for(var i = 0;i <= aiPoker.length-1; i++){
				var aiPokerData = aiPoker[i].split("_");
				aiPokerNum.push(aiPokerData[0])
			}
			if(aiPokerNum[aiPokerNum.length-1] == aiPokerNum[aiPokerNum.length-2] && aiPokerNum[aiPokerNum.length-2] == aiPokerNum[aiPokerNum.length-3]){
				temp_poker.push(aiPoker[aiPokerNum.length-1]);
				temp_poker.push(aiPoker[aiPokerNum.length-2]);
				temp_poker.push(aiPoker[aiPokerNum.length-3]);
				for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
					if(aiPokerNum[i] != aiPokerNum[aiPokerNum.length-1]){
						temp_poker.push(aiPoker[i]);
						return true;
					}	
				}
			}else if(aiPokerNum[aiPokerNum.length-1] == aiPokerNum[aiPokerNum.length-2]){
				temp_poker.push(aiPoker[aiPokerNum.length-1]);
				temp_poker.push(aiPoker[aiPokerNum.length-2]);
				return true;
			}else{
				temp_poker = [];
				temp_poker.push(aiPoker[aiPoker.length-1]);
				return true;
			}
		}

		//AI压牌
		var aiPlayer = function(index){									
			var aiPokerNum = Array();		//牌编号
			var myRank = $('.rank').eq(index-1).html();		//明确自己身份
			if(index == 1){
				var aiPoker = play_1;
			}else if(index == 2){
				var aiPoker = play_2;
			}else if(index == 3){
				var aiPoker = play_3;
			}
			//分离提取牌型数据
			for(var i = 0;i <= aiPoker.length-1; i++){
				var aiPokerData = aiPoker[i].split("_");
				aiPokerNum.push(aiPokerData[0])
			}
			//先判断牌型   再判断大小   再判断身份
			if(now_poker[1] == 1){											//单张
				if(aiPoker == play_1){
					var nextPlayerPoker = play_2;
					var nextPlayerRank = $('.rank').eq(1).html();
				}else if(aiPoker == play_2){
					var nextPlayerPoker = play_3;
					var nextPlayerRank = $('.rank').eq(2).html();
				}else if(aiPoker == play_3){
					var nextPlayerPoker = play_1;
					var nextPlayerRank = $('.rank').eq(0).html();
				}

				//hrz:单张时进行顶大
				if(nextPlayerPoker.length == 1){	//单张的时候要进行顶大
					// console.log(myRank+"--"+nextPlayerRank+"--"+nextPlayerPoker.length);
					if(aiPokerNum[0] > now_poker[2]){							//并且能打过
						temp_poker.push(aiPoker[0]);
						return true;
					}else{
						return false;
					}
				}else{									//否则按常规出牌
					return judgeRank(myRank,AI_dan,aiPokerNum,aiPoker)
				}
			}else if(now_poker[1] == 2){									//对子
				return judgeRank(myRank,AI_duizi,aiPokerNum,aiPoker)
			}else if(now_poker[1] == 3){											//三条
				return judgeRank(myRank,AI_san,aiPokerNum,aiPoker)
			}else if(now_poker[1] == 4){											//三带一
				return judgeRank(myRank,AI_sandaiyi,aiPokerNum,aiPoker)					
			}else if(now_poker[1] == 5){											//三带二
				return judgeRank(myRank,AI_sandaier,aiPokerNum,aiPoker)
			}else if(now_poker[1] == 6 || now_poker[1] == 10 ||now_poker[1] == 11 ||	//顺子
				now_poker[1] == 12 ||now_poker[1] == 16 ||now_poker[1] == 18 ||
				now_poker[1] == 21 ||now_poker[1] == 22){
				return judgeRank(myRank,AI_shunzi,aiPokerNum,aiPoker)
			}else if(now_poker[1] == 9 || now_poker[1] == 13 ||now_poker[1] == 19 ||	//连对
				now_poker[1] == 23 ||now_poker[1] == 26 ||now_poker[1] == 29 ||
				now_poker[1] == 31 ||now_poker[1] == 32){
				return judgeRank(myRank,AI_liandui,aiPokerNum,aiPoker)
			}else if(now_poker[1] == 6 || now_poker[1] == 8 ||now_poker[1] == 24 ||	    //三顺
				now_poker[1] == 27){
				return judgeRank(myRank,AI_sanshun,aiPokerNum,aiPoker)
			}else if(now_poker[1] == 14 || now_poker[1] == 25 ||now_poker[1] == 30){	//带单飞机
				return judgeRank(myRank,AI_feijidaidan,aiPokerNum,aiPoker)
			}else if(now_poker[1] == 998){
				return judgeRank(myRank,AI_BoomVsBoom,aiPokerNum,aiPoker)
			}
		}

		//判断压牌类型以及判断牌型及判断牌型大小
		var judgeRank = function(myRank,Fun,aiPokerNum,aiPoker){
			if(now_poker[2] >= 9) {				//大于等于J的时候
				return Fun(aiPokerNum,aiPoker);
			}else{
				return Fun(aiPokerNum,aiPoker);

			}
		}

	    //hrz:这一部分是检测出牌时是否要得起，只单纯进行判断，不进行出牌操作
	    var AI_dan1 = function(aiPokerNum,aiPoker,myRank){
	    	for(var i = aiPokerNum.length-1; i >= 0; i--){
	    		if(aiPokerNum[i] > now_poker[2]){
	    			return true
	    		}
	    	}
	    	return checkBoomAndSupBoom1(aiPokerNum,aiPoker,myRank);
	    }

	    var AI_duizi1 = function(aiPokerNum,aiPoker,myRank){
	    	for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
	    		if(aiPokerNum[i] > now_poker[2] && aiPokerNum[i] == aiPokerNum[i-1]){
	    			return true
	    		}
	    	}
	    	return checkBoomAndSupBoom1(aiPokerNum,aiPoker,myRank);
	    }
	    //检索三张
	    var AI_san1 = function(aiPokerNum,aiPoker,myRank){
	    	for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
	    		if(aiPokerNum[i] > now_poker[2] && aiPokerNum[i] == aiPokerNum[i-1] && aiPokerNum[i-1] == aiPokerNum[i-2]){
	    			return true
	    		}
	    	}
	    	return checkBoomAndSupBoom1(aiPokerNum,aiPoker,myRank);
	    }
	    //检索三带一
	    var AI_sandaiyi1 = function(aiPokerNum,aiPoker,myRank){
	    	for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
	    		if(aiPokerNum[i] > now_poker[2] && aiPokerNum[i] == aiPokerNum[i-1] && aiPokerNum[i-1] == aiPokerNum[i-2]){
	    			for(var j = aiPokerNum.length-1 ; j >= 0 ; j--){
	    				if(aiPokerNum[j] != aiPokerNum[j-1] && temp_poker.indexOf(aiPoker[j]) == -1){
	    					return true
	    				}
	    			}
	    		}
	    	}
	    	return checkBoomAndSupBoom1(aiPokerNum,aiPoker,myRank);
	    }
	    //检索三带二
	    var AI_sandaier1 = function(aiPokerNum,aiPoker,myRank){
	    	for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
	    		if(aiPokerNum[i] > now_poker[2] && aiPokerNum[i] == aiPokerNum[i-1] && aiPokerNum[i-1] == aiPokerNum[i-2]){
	    			for(var j = aiPokerNum.length-1 ; j >= 0 ; j--){
	    				if(aiPokerNum[j] == aiPokerNum[j-1] && temp_poker.indexOf(aiPoker[j]) == -1){
	    					return true
	    				}
	    			}
	    		}
	    	}
	    	return checkBoomAndSupBoom1(aiPokerNum,aiPoker,myRank);
	    }
	    //检索顺子
	    var AI_shunzi1 = function(aiPokerNum,aiPoker,myRank){
	    	for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
	    		var firstNum = aiPokerNum[i];
	    		for(var j = aiPokerNum.length-1 ; j >= 0 ; j--){
	    			if(firstNum == parseInt(aiPokerNum[j])-1 && aiPokerNum[j] <= 12){
	                    // temp_poker.push(aiPoker[j]);
	                    if(temp_poker.length == now_poker[0].length && aiPokerNum[j] > now_poker[2]){
	                    	return true;
	                    }else{
	                    	firstNum++;
	                    }
	                }
	            }
	        }
	        return checkBoomAndSupBoom1(aiPokerNum,aiPoker,myRank);
	    }
	    //检索连对
	    var AI_liandui1 = function(aiPokerNum,aiPoker,myRank){
	    	for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
	    		var firstNum = aiPokerNum[i];
	    		for(var j = aiPokerNum.length-1 ; j >= 0 ; j--){
	    			if(firstNum == parseInt(aiPokerNum[j]) && aiPokerNum[j] <= 13 && i != j){
	                    // temp_poker.push(aiPoker[j]);
	                    console.log(temp_poker);
	                    if(temp_poker.length == now_poker[0].length){
	                    	if(aiPokerNum[j] > now_poker[2]){
	                    		console.log(temp_poker);
	                    		return true;
	                    	}
	                    }else if(temp_poker.length % 2 == 0){
	                    	firstNum++;
	                    }
	                }
	            }
	        }
	        return checkBoomAndSupBoom1(aiPokerNum,aiPoker,myRank);
	    }
	    //检索三顺
	    var AI_sanshun1 = function(aiPokerNum,aiPoker,myRank){
	    	for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
	    		var firstNum = aiPokerNum[i];
	    		for(var j = aiPokerNum.length-1 ; j >= 0 ; j--){
	    			if(firstNum == parseInt(aiPokerNum[j]) && aiPokerNum[j] <= 13){
	                    // temp_poker.push(aiPoker[j]);
	                    if(temp_poker.length == now_poker[0].length && aiPokerNum[j] > now_poker[2]){
	                    	return true;
	                    }else if(temp_poker.length % 3 == 0){
	                    	firstNum++;
	                    }
	                }
	            }
	        }
	        return checkBoomAndSupBoom1(aiPokerNum,aiPoker,myRank);
	    }
	    //检索飞机带单
	    var AI_feijidaidan1 = function(aiPokerNum,aiPoker,myRank){
	    	for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
	    		var firstNum = aiPokerNum[i];
	    		for(var j = aiPokerNum.length-2 ; j >= 0 ; j--){
	                //如果点数相等并且点数是2以下的牌
	                if(firstNum == parseInt(aiPokerNum[j]) && aiPokerNum[j] <= 13){
	                    //先添加三顺
	                    if(temp_poker.length % 3 == 0){
	                    	firstNum++;
	                    }
	                    //三顺数量满足后开始添加单排
	                    if(temp_poker.length / 3 * 1 + temp_poker.length == now_poker[0].length){
	                    	for(var k = aiPokerNum.length-1 ; k >= 0 ; k--){
	                            // 	//检索添加的牌不是三顺取走的牌
	                            if(temp_poker.indexOf(aiPoker[k]) == -1){
	                                //当牌数相等并且最大值比较大的时候
	                                if(temp_poker.length == now_poker[0].length && aiPokerNum[j] > now_poker[2]){
	                                	return true;
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	        }
	        return checkBoomAndSupBoom1(aiPokerNum,aiPoker,myRank);
	    }
	    //炸弹压炸弹
	    var AI_BoomVsBoom1 = function(aiPokerNum,aiPoker,myRank){
	    	for(var i = aiPokerNum.length-1; i >= 0 ; i--){
	    		if(aiPokerNum[i] == aiPokerNum[i-1] && aiPokerNum[i-1] == aiPokerNum[i-2] && aiPokerNum[i-2] == aiPokerNum[i-3]){
	    			if(aiPokerNum[i-3] > now_poker[3]){
	    				return true;
	    			}
	    		}
	    	}
	    	return checkSupBoom1(aiPokerNum,aiPoker);
	    }
	    //检索炸弹
	    var checkBoom1 = function(aiPokerNum,aiPoker){
	    	for(var i = aiPokerNum.length-1; i >= 0 ; i--){
	    		if(aiPokerNum[i] == aiPokerNum[i-1] && aiPokerNum[i-1] == aiPokerNum[i-2] && aiPokerNum[i-2] == aiPokerNum[i-3]){
	    			return true;
	    		}
	    	}
	    	return false;
	    }
	    //检索皇炸
	    var checkSupBoom1 = function(aiPokerNum,aiPoker){
	    	if(aiPokerNum[0] == 15 && aiPokerNum[1] == 14){
	    		return true;
	    	}
	    	return false;
	    }
	    //检索皇炸和炸弹
	    var checkBoomAndSupBoom1 = function(aiPokerNum,aiPoker,myRank){
	    	var boom = checkBoom1(aiPokerNum,aiPoker);
	    	var supBoom = checkSupBoom1(aiPokerNum,aiPoker);
	    	if(boom && supBoom){
	    		console.log(temp_poker);
	    	}
	    	if(boom || supBoom && myRank != now_poker[4]){
	    		if(boom){
	    			return boom;
	    		}else{
	    			return supBoom;
	    		}
	    	}
	    	return false;
	    }
    	// ========================检测AI出牌============

		//检索单张
		var AI_dan = function(aiPokerNum,aiPoker,myRank){									
			for(var i = aiPokerNum.length-1; i >= 0; i--){
				if(aiPokerNum[i] > now_poker[2]){
					temp_poker.push(aiPoker[i]);
					return true
				}
			}
			return checkBoomAndSupBoom(aiPokerNum,aiPoker,myRank);
		}

		//检索对子
		var AI_duizi = function(aiPokerNum,aiPoker,myRank){
			for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
				if(aiPokerNum[i] > now_poker[2] && aiPokerNum[i] == aiPokerNum[i-1]){
					temp_poker.push(aiPoker[i]);
					temp_poker.push(aiPoker[i-1]);
					return true
				}
			}
			return checkBoomAndSupBoom(aiPokerNum,aiPoker,myRank);
		}

		//检索三张
		var AI_san = function(aiPokerNum,aiPoker,myRank){
			for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
				if(aiPokerNum[i] > now_poker[2] && aiPokerNum[i] == aiPokerNum[i-1] && aiPokerNum[i-1] == aiPokerNum[i-2]){
					temp_poker.push(aiPoker[i]);
					temp_poker.push(aiPoker[i-1]);
					temp_poker.push(aiPoker[i-2]);
					return true
				}
			}
			return checkBoomAndSupBoom(aiPokerNum,aiPoker,myRank);
		}

		//检索三带一
		var AI_sandaiyi = function(aiPokerNum,aiPoker,myRank){
			for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
				if(aiPokerNum[i] > now_poker[2] && aiPokerNum[i] == aiPokerNum[i-1] && aiPokerNum[i-1] == aiPokerNum[i-2]){
					temp_poker.push(aiPoker[i]);
					temp_poker.push(aiPoker[i-1]);
					temp_poker.push(aiPoker[i-2]);
					for(var j = aiPokerNum.length-1 ; j >= 0 ; j--){
						if(aiPokerNum[j] != aiPokerNum[j-1] && temp_poker.indexOf(aiPoker[j]) == -1){
							temp_poker.push(aiPoker[j]);
							return true
						}
					}
				}
			}
			return checkBoomAndSupBoom(aiPokerNum,aiPoker,myRank);
		}

		//检索三带二
		var AI_sandaier = function(aiPokerNum,aiPoker,myRank){
			for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
				if(aiPokerNum[i] > now_poker[2] && aiPokerNum[i] == aiPokerNum[i-1] && aiPokerNum[i-1] == aiPokerNum[i-2]){
					temp_poker.push(aiPoker[i]);
					temp_poker.push(aiPoker[i-1]);
					temp_poker.push(aiPoker[i-2]);
					for(var j = aiPokerNum.length-1 ; j >= 0 ; j--){
						if(aiPokerNum[j] == aiPokerNum[j-1] && temp_poker.indexOf(aiPoker[j]) == -1){
							temp_poker.push(aiPoker[j]);
							temp_poker.push(aiPoker[j-1]);
							console.log(temp_poker);
							return true
						}
					}
				}
			}
			return checkBoomAndSupBoom(aiPokerNum,aiPoker,myRank);
		}
		//检索顺子
		var AI_shunzi = function(aiPokerNum,aiPoker,myRank){
			for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
				temp_poker = [];
				temp_poker.push(aiPoker[i])
				var firstNum = aiPokerNum[i];
				for(var j = aiPokerNum.length-1 ; j >= 0 ; j--){
					if(firstNum == parseInt(aiPokerNum[j])-1 && aiPokerNum[j] <= 12){
						temp_poker.push(aiPoker[j]);
						if(temp_poker.length == now_poker[0].length && aiPokerNum[j] > now_poker[2]){
							return true;
						}else{
							firstNum++;
						}
					}
				}
			}
			temp_poker = [];
			return checkBoomAndSupBoom(aiPokerNum,aiPoker,myRank);
		}

		//检索连对
		var AI_liandui = function(aiPokerNum,aiPoker,myRank){
			for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
				temp_poker = [];
				temp_poker.push(aiPoker[i])
				var firstNum = aiPokerNum[i];
				for(var j = aiPokerNum.length-1 ; j >= 0 ; j--){
					if(firstNum == parseInt(aiPokerNum[j]) && aiPokerNum[j] <= 13 && i != j){
						temp_poker.push(aiPoker[j]);
						console.log(temp_poker);
						if(temp_poker.length == now_poker[0].length){
							if(aiPokerNum[j] > now_poker[2]){
								console.log(temp_poker);
								return true;
							}
						}else if(temp_poker.length % 2 == 0){
							firstNum++;
						}
					}
				}
			}
			temp_poker = [];
			return checkBoomAndSupBoom(aiPokerNum,aiPoker,myRank);
		}

		//检索三顺
		var AI_sanshun = function(aiPokerNum,aiPoker,myRank){
			for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
				temp_poker = [];
				temp_poker.push(aiPoker[i])
				var firstNum = aiPokerNum[i];
				for(var j = aiPokerNum.length-1 ; j >= 0 ; j--){
					if(firstNum == parseInt(aiPokerNum[j]) && aiPokerNum[j] <= 13){
						temp_poker.push(aiPoker[j]);
						if(temp_poker.length == now_poker[0].length && aiPokerNum[j] > now_poker[2]){
							return true;
						}else if(temp_poker.length % 3 == 0){
							firstNum++;
						}
					}
				}
			}
			temp_poker = [];
			return checkBoomAndSupBoom(aiPokerNum,aiPoker,myRank);
		}
		//检索飞机带单
		var AI_feijidaidan = function(aiPokerNum,aiPoker,myRank){
			for(var i = aiPokerNum.length-1 ; i >= 0 ; i--){
				temp_poker = [];
				temp_poker.push(aiPoker[i])
				var firstNum = aiPokerNum[i];
				for(var j = aiPokerNum.length-2 ; j >= 0 ; j--){
					//如果点数相等并且点数是2以下的牌
					if(firstNum == parseInt(aiPokerNum[j]) && aiPokerNum[j] <= 13){
						temp_poker.push(aiPoker[j]);
						//先添加三顺
						if(temp_poker.length % 3 == 0){
							firstNum++;
						}
						//三顺数量满足后开始添加单排
						if(temp_poker.length / 3 * 1 + temp_poker.length == now_poker[0].length){
							for(var k = aiPokerNum.length-1 ; k >= 0 ; k--){
								//检索添加的牌不是三顺取走的牌
								if(temp_poker.indexOf(aiPoker[k]) == -1){
									temp_poker.push(aiPoker[k]);
									//当牌数相等并且最大值比较大的时候
									if(temp_poker.length == now_poker[0].length && aiPokerNum[j] > now_poker[2]){
										return true;
									}
								}
							}
						}
					}
				}
			}
			temp_poker = [];
			return checkBoomAndSupBoom(aiPokerNum,aiPoker,myRank);
		}

		//炸弹压炸弹
		var AI_BoomVsBoom = function(aiPokerNum,aiPoker,myRank){
			for(var i = aiPokerNum.length-1; i >= 0 ; i--){
				if(aiPokerNum[i] == aiPokerNum[i-1] && aiPokerNum[i-1] == aiPokerNum[i-2] && aiPokerNum[i-2] == aiPokerNum[i-3]){
					if(aiPokerNum[i-3] > now_poker[3]){
						temp_poker.push(aiPoker[i]);
						temp_poker.push(aiPoker[i-1]);
						temp_poker.push(aiPoker[i-2]);
						temp_poker.push(aiPoker[i-3]);
						return true;
					}
				}
			}
			return checkSupBoom(aiPokerNum,aiPoker);
			// return false;
		}

		//检索炸弹
		var checkBoom = function(aiPokerNum,aiPoker){
			for(var i = aiPokerNum.length-1; i >= 0 ; i--){
				if(aiPokerNum[i] == aiPokerNum[i-1] && aiPokerNum[i-1] == aiPokerNum[i-2] && aiPokerNum[i-2] == aiPokerNum[i-3]){
					temp_poker.push(aiPoker[i]);
					temp_poker.push(aiPoker[i-1]);
					temp_poker.push(aiPoker[i-2]);
					temp_poker.push(aiPoker[i-3]);
					return true;
				}
			}
			return false;
		}

		//检索皇炸
		var checkSupBoom = function(aiPokerNum,aiPoker){
			if(aiPokerNum[0] == 15 && aiPokerNum[1] == 14){
				temp_poker.push(aiPoker[0]);
				temp_poker.push(aiPoker[1]);
				return true;
			}
			return false;
		}

		//检索皇炸和炸弹
		var checkBoomAndSupBoom = function(aiPokerNum,aiPoker,myRank){
			var boom = checkBoom(aiPokerNum,aiPoker);
			var supBoom = checkSupBoom(aiPokerNum,aiPoker);
			if(boom && supBoom){
				temp_poker.splice(temp_poker.length-1);
				temp_poker.splice(temp_poker.length-1);
				// console.log(temp_poker);
			}
			if(boom || supBoom && myRank != now_poker[4]){
				if(boom){
					return boom;
				}else{
					return supBoom;
				}
			}
			return false;
		}

		/*检查出牌规则
		参数poker_arr   array
		return false or Array
		牌型不正确返回false
		牌型正确返回数组，数组中包含已经排序的原参数数组，与牌型类型
		可以在原数组中加入新元素为判断值，该判断就是同牌型下用进行比较大小的值
		1: 单排
		2: 对子
		3: 3条
		4: 3带1
		5: 5张 3带2
		6: 5张 顺子
		7: 6张 4带2
		8: 6张 2*3 飞机
		9: 6张 连对
		10: 6张 顺子
		11: 7张 顺子
		12: 8张 顺子
		13: 8张 连对
		14: 8张 飞机
		15: 8张 4带2对
		16: 9张 顺子
		17: 9张 3*3飞机
		18: 10张 顺子
		19：10张 连对
		20: 10张 3带2大飞机
		21: 11张 顺子
		22: 12张 顺子
		23: 12张 连对 
		24: 12张 4*3飞机
		25: 12张 3带1小飞机
		26: 14张 连对
		27: 15张 5*3飞机
		28: 15张 3*3带2大飞机
		29: 16张 连对
		30: 16张 4*3带1小飞机
		31: 18张 连对
		32: 20张 连对
		33: 20张 4*3带2大飞机
		998 炸弹
		*/
		var checkPokers = function( poker_arr ) {
			// alert("这是proker_arrr"+poker_arr .length);
			// alert(poker_arr[0]);
			if ( poker_arr.length == 0 ) {			//代表不出
				return false;
			}else if ( poker_arr.length == 1 ) {	//判断是出单张
				var temp = Array();
				sort(temp,poker_arr);
				var key = parseInt(temp[0]);
				var data = Array(
					poker_arr,
					1,
					key
					);
				return data;	
			}else if ( poker_arr.length == 2 ){		//判断是出两张
				var temp = Array();
				sort(temp,poker_arr);
				if ( temp[1] == temp[0] ) {
					var key = parseInt(temp[0]);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//对子
						poker_arr,
						2,
						key
						);
					return data;
				}else{
					return false;
				}
			}else if ( poker_arr.length == 3 ) {	//判断是出三张
				var temp = Array();
				sort(temp,poker_arr);
				if (temp[0] == temp[1] && temp[1] == temp[2]) {
					var key = parseInt(temp[0]);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//3条
						poker_arr,
						3,
						key
						);
					return data;
				}
			}else if ( poker_arr.length == 4 ){		//判断是出四张
				var temp = Array();
				sort(temp,poker_arr);
				if ( temp[0] == temp[1] && temp[1] == temp[2] && temp[2] == temp[3]) {		//判断为炸弹
					var key = parseInt(temp[0]);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//普通炸
						poker_arr,
						998,						//炸弹牌型
						998,						//炸弹比较其他牌型的值
						key				    		//炸弹与炸弹比较的值
						);
					return data;
				}else if (temp[0] == temp[1] && temp[1] == temp[2] ||temp[1] == temp[2] && temp[2] == temp[3]) {	//判断牌型为3带1
					if (temp[0] == temp[1] && temp[1] == temp[2]) {
						var key = parseInt(temp[0]);
						poker_arr = getsort(temp);		//对牌进行排序
						var data = Array(				//3带1
							poker_arr,
							4,
							key
							);
						return data;
					}else if(temp[1] == temp[2] && temp[2] == temp[3]) {
						var key = parseInt(temp[1]);
						poker_arr = getsort(temp);		//对牌进行排序
						var data = Array(				//3带1
							poker_arr,
							4,
							key
							);
						return data;
					}
				}else if(temp[0] == temp[1] && temp[2] == temp[3]) {
					var key = parseInt(temp[0]);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//两个连对
						poker_arr,
						9,
						key
						);
					return data;
				}else{
					return false;
				}
			}else if ( poker_arr.length == 5 ) {	//判断是出五张
				var temp = Array();
				sort(temp,poker_arr);
				if (temp[0]==temp[1]&&temp[1]==temp[2]&&temp[3]==temp[4]||temp[0]==temp[1]&&temp[2]==temp[3]&&temp[3]==temp[4]) {
					if (temp[0]==temp[1]&&temp[1]==temp[2]&&temp[3]==temp[4]) {
						var key = parseInt(temp[0]);
						poker_arr = getsort(temp);		//对牌进行排序
						var data = Array(				//3带2
							poker_arr,
							5,
							key
							);
						return data;
					}else if (temp[0]==temp[1]&&temp[2]==temp[3]&&temp[3]==temp[4]) {
						var key = parseInt(temp[2]);
						poker_arr = getsort(temp);		//对牌进行排序
						var data = Array(				//3带2
							poker_arr,
							5,
							key
							);
						return data;
					}
				}else{
					//判断顺子的方法
					var res = shunzi(temp);
					if (res) {
						var key = parseInt(res);
						poker_arr = getsort(temp);	 //对牌进行排序
						var data = Array(			 //5张的顺子
							poker_arr,
							6,
							key
							);
						return data;
					}else{
						return false;
					}
				}
			}else if ( poker_arr.length == 6 ) {	  //判断是出六张
				var temp = Array();
				sort(temp,poker_arr);				//提取点数并且排序函数
				var res = true;
				var case1 = true;
				var case2 = true;
				var case3 = true;
				for (var i = 0; i<3; i++) {			//判断前4张是否一样
					if (temp[i] != temp[i+1]) {
						case1 = false;
					}
					if (temp[i+1] != temp[i+2]) {
						case2 = false;
					}
					if (temp[i+2] != temp[i+3]) {
						case3 = false;
					}
				}
				if (case1) {
					var res = temp[0]; 
				}
				if (case2) {
					var res = temp[1]; 
				}
				if (case3) {
					var res = temp[2];
				}
				if (case1||case2||case3) {
					var key = parseInt(res);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//4带2
						poker_arr,
						7,
						key
						);
					return data;
				}else if( parseInt(temp[0])+1 == temp[5]&&temp[0]!=13&&temp[5]!=13){
					var key =  parseInt(temp[0]);
					poker_arr = getsort(temp);	   //对牌进行排序
					var data = Array(			   //6张不带的小飞机
						poker_arr,
						8,
						key
						);
					return data;
				}else{
					var res1 = liandui(temp);
					var res2 = shunzi(temp);
					if (res1) {
						var key = parseInt(res1);
						poker_arr = getsort(temp);		//对牌进行排序
						var data = Array(				//6张的连对
							poker_arr,
							9,
							key
							);
						return data;
					}else if (res2) {
						var key = parseInt(res2);
						poker_arr = getsort(temp);		//对牌进行排序
						var data = Array(				//6张的顺子
							poker_arr,
							10,
							key
							);
						return data;
					}else{
						return false;
					}
				}
			}else if ( poker_arr.length == 7 ) {		//判断是出七张
				var temp = Array();
				sort(temp,poker_arr);
				var res = shunzi(temp);
				if (res) {
					var key = parseInt(res);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//7张顺子
						poker_arr,
						11,
						key
						);
					return data;
				}else{
					return false;
				}
			}else if (poker_arr.length == 8 ) {
				var temp = Array();
				sort(temp,poker_arr);
				var res1 = liandui(temp);
				var res2 = shunzi(temp);
				var res3 = feijidai8(temp);
				var res4 = sidaier(temp);
				if (res2) {
					var key = parseInt(res2);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//8张顺子
						poker_arr,
						12,
						key
						);
					return data;
				}else if(res1){
					var key = parseInt(res1);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//8张连对
						poker_arr,
						13,
						key
						);
					return data;
				}else if(res3) {
					var key = parseInt(res3);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//8张的飞机
						poker_arr,
						14,
						key
						);
					return data;
				}else if (res4) {
					var key = parseInt(res4)
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//4带2
						poker_arr,
						15,
						key
						);
					return data;
				}else{
					return false;
				}
			}else if (poker_arr.length == 9 ) {
				var temp = Array();
				sort(temp,poker_arr);
				var res = shunzi(temp);
				var res1 = feijibudai(temp);
				if (res) {
					var key = parseInt(res);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//9张顺子
						poker_arr,
						16,
						key
						);
					return data;
				}else if (res1) {
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//9张不带的飞机
						poker_arr,
						17
						);
					return data;
				}else{
					return false;
				}
			}else if (poker_arr.length == 10 ) {
				var temp = Array();
				sort(temp,poker_arr);
				var res1 = liandui(temp);
				var res2 = shunzi(temp);
				var res3 = feiji10(temp);
				if (res2) {
					var key = parseInt(res2);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//10张顺子
						poker_arr,
						18,
						key
						);
					return data;
				}else if (res1) {
					var key = parseInt(res1);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//10张连对
						poker_arr,
						19,
						key
						);
					return data;
				}else if (res3) {
					var key = parseInt(res3);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//10张3*2+2*2飞机
						poker_arr,
						20,
						key
						);
					return data;
				}else{
					return false;
				}
			}else if (poker_arr.length == 11 ) {
				var temp = Array();
				sort(temp,poker_arr);
				var res = shunzi(temp);
				if (res) {
					var key = parseInt(res);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//11张顺子
						poker_arr,
						21,
						key
						);
					return data;
				}else{
					return false;
				}
			}else if (poker_arr.length == 12 ){
				var temp = Array();
				sort(temp,poker_arr);
				var res = shunzi(temp);
				var res1 = liandui(temp);
				var res2 = feijibudai(temp);
				var res3 = feijidai12(temp);		//12张3*3+3*1飞机判断
				if (res) {
					var key = parseInt(res);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//12张顺子
						poker_arr,
						22,
						key
						);
					return data;
				}else if (res1) {
					var key = parseInt(res1);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//12张连对
						poker_arr,
						23,
						key
						);
					return data;
				}else if (res2) {
					var key = parseInt(res2);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//12张飞机不带
						poker_arr,
						24,
						key
						);
					return data;
				}else if (res3) {
					var key = parseInt(res3);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//12张3*3+3*1飞机
						poker_arr,
						25,
						key
						);
					return data;
				}else{
					return false;
				}
			}else if (poker_arr.length == 14 ){
				var temp = Array();
				sort(temp,poker_arr);
				var res = liandui(temp);
				if (res) {
					var key = parseInt(res);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//14张连对
						poker_arr,
						26,
						key
						);
					return data;
				}else{
					return false;
				}
			}else if (poker_arr.length == 15 ){
				var temp = Array();
				sort(temp,poker_arr);
				var res = feijibudai(temp);
				var res1 = feiji15(temp);
				if (res) {
					var key = parseInt(res);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//15张不带的飞机
						poker_arr,
						27,
						key
						);
					return data;
				}else if(res1) {
					var key = parseInt(res1);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//15张3*3+2*3的飞机
						poker_arr,
						28,
						key
						);
					return data;
				} else{
					return false;
				}
			}else if (poker_arr.length == 16 ){
				var temp = Array();
				sort(temp,poker_arr);
				var res = liandui(temp);
				if (res) {
					var key = parseInt(res);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//16张连对
						poker_arr,
						29,
						key
						);
					return data;
				}
			}else if (poker_arr.length == 18 ){
				var temp = Array();
				sort(temp,poker_arr);
				var res = liandui(temp);
				if (res) {
					var key = parseInt(res);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//18张连对
						poker_arr,
						31,
						key
						);
					return data;
				}
			}else if (poker_arr.length == 20 ){
				var temp = Array();
				sort(temp,poker_arr);
				var res = liandui(temp);
				if (res) {
					var key = parseInt(res);
					poker_arr = getsort(temp);		//对牌进行排序
					var data = Array(				//20张连对
						poker_arr,
						32,
						key
						);
					return data;
				}
			}
		}

		//提取点数并且排序函数
		var sort = function(temp,poker_arr){
			for (var i = 0; i < poker_arr.length; i++) {
				var arr = poker_arr[i].split('_');
				temp.push(arr[0]);
			}
			//从小到大排序
			temp.sort(function(x,y){
				return x-y;
			})
		}

		//判断顺子函数
		var shunzi = function(temp) {
			var res = true;
			for (var i = 0; i < temp.length; i++) {
				if (temp[i]==13) {
					res = false;
					return res;
				}
			}
			for (var i = 0; i < temp.length-1; i++) {
				//判断数字是否连续
				if (parseInt(temp[i])+1 != parseInt(temp[i+1])) {
					res = false;	
					break;
				}else{
					res = parseInt(temp[temp.length-1]);
				}
			}
			return res;
		}

		//判断连对函数
		var liandui = function(temp) {
			var res;
			var res1;
			var res2;
			for (var i = 0; i < temp.length-1; i++) {
				if (temp[i]==13) {						//不能是2
					res = false
					return res;
				}
			}
			for (var i = 0; i <temp.length-2; i+=2) {	
				if (parseInt(temp[i])+1 != parseInt(temp[i+2])) { //用来判断是不是成对
					res1 = false;
					break;
				}else{
					res1 = true;
				}
			}
			for (var i = 0; i <temp.length; i+=2) {	//用来判断是不是连号
				if (temp[i]!=temp[i+1]) {
					res2 = false;
					break;
				}else{
					res2 = true;
				}
			}
			if (res1==true && res2==true) {	//同时满足2个条件
				res = parseInt(temp[temp.length-1]);
			}else{
				res = false;
			}
			return res;
		}
		
		//判断8张4带2对函数
		var sidaier = function(temp) {
			var res = false;
			if (temp[0]==temp[1] && temp[1]==temp[2] && temp[2]==temp[3] && temp[4]==temp[5] && temp[6]==temp[7]) {
				res = parseInt(temp[0]);
			}
			if (temp[0]==temp[1] && temp[2]==temp[3] && temp[3]==temp[4] && temp[4]==temp[5] && temp[6]==temp[7]) {
				res = parseInt(temp[2]);
			}
			if (temp[0]==temp[1] && temp[2]==temp[3] && temp[4]==temp[5] && temp[5]==temp[6] && temp[6]==temp[7]) {
				res = parseInt(temp[4]);
			}
			return res;
		}

		//9,12,15张不带的飞机
		var feijibudai = function(temp) {
			var res = false;
			var res1 = true;
			var res2 = true;

			for (var j = 0; j <= temp.length-1; j++) {
				if (temp[j]==13) {
					return res;
				}
			}

			for (var i = 0; i < 2; i++) {
				if (temp.length==9) {
					if (temp[i]!=temp[i+1]&&temp[i+3]!=temp[i+4]&&temp[i+6]!=temp[i+7]) {
						res1 = false;
						break;
					}
				}else if (temp.length==12) {
					if (temp[i]!=temp[i+1]&&temp[i+3]!=temp[i+4]&&temp[i+6]!=temp[i+7]&&temp[i+9]!=temp[i+10]) {
						res1 = false;
						break;
					}
				}else if (temp.length==15) {
					if (temp[i]!=temp[i+1]&&temp[i+3]!=temp[i+4]&&temp[i+6]!=temp[i+7]&&temp[i+9]!=temp[i+10]&&temp[12]!=temp[13]) {
						res1 = false;
						break;
					}
				}
			}

			//判断数字是否是连续的
			for (var i = 0; i < temp.length-5; i += 3) {
				if (parseInt(temp[i])+1 != temp[i+3]) {
					res2 = false;
					break
				}
			}

			if (res1 == true && res2 == true) {
				res = parseInt(temp[temp.length-1])
			}
			return res;
		}

		//判断8张的飞机函数
		var feijidai8 = function(temp) {
			var res = false;
			for (var i = 0; i < 3; i++) {									//8张飞机有3种情况
				if (temp[i]==temp[i+1]&&temp[i+1]==temp[i+2]&&temp[i]!=13&&		//前三张相等并且没有2
					temp[i+3]==temp[i+4]&&temp[i+4]==temp[i+5]&&temp[i+3]!=13&&		//后三张相等并且没有2
					parseInt(temp[i])+1==temp[i+5]) 								//6张连牌第一张+1等于最后一张
				{
					res = parseInt(temp[i+5]);
					break;
				}
			}
			return res;
		}

		//10张3带2飞机
		var feiji10 = function(temp) {
			var res = false;
			for (var i = 0; i < 5; i += 2) {
				if (temp[i]==temp[i+1] && temp[i+1]==temp[i+2] && temp[i]!=13 && temp[i+3]==temp[i+4] && temp[i+4]==temp[i+5] && temp[i+3]!=13
					&& parseInt(temp[i])+1==temp[i+5]) {
					if (i==0 && temp[6]==temp[7] && temp[8]==temp[9]) {
						res = parseInt(temp[i+5]);
						break;
					}else if (i==2 && temp[0]==temp[1] && temp[8]==temp[9]) {
						res = parseInt(temp[i+5]);
						break;
					}else if (i==4 && temp[0]==temp[1] && temp[2]==temp[3]) {
						res = parseInt(temp[i+5]);
						break;
					}
				}
			}
			return res;
		}

		//12张带的飞机
		var feijidai12 = function(temp) {
			var res = false;
			for (var i = 0; i < 4; i++) {								//12张3*3+3*1的飞机有4种情况
				if (temp[i]==temp[i+1] && temp[i+1]==temp[i+2] && temp[i]!=13 &&		//前3张相等并且没有2
					temp[i+3]==temp[i+4] && temp[i+4]==temp[i+5] && temp[i+3]!=13 && //中3张相等并且没有2
					temp[i+6]==temp[i+7] && temp[i+7]==temp[i+8] && temp[i+6]!=13 &&	   //后3张相等并且没有2
					parseInt(temp[i])+1==temp[i+5] &&
					parseInt(temp[i+5])+1==temp[i+8]) {
					res = parseInt(temp[i+8]);
				break;
			}
		}
		return res;
	}

		//15张3带2大飞机,先找到三个飞机出现的位置
		var feiji15 = function(temp) {
			var res = false;
			for (var i = 0; i < 7; i += 2) {
				//temp[i]==13是2
				if (temp[i]==temp[i+1]&&temp[i+1]==temp[i+2]&&temp[i]!=13&&
					temp[i+3]==temp[i+4]&&temp[i+4]==temp[i+5]&&temp[i+3]!=13&&
					temp[i+6]==temp[i+7]&&temp[i+7]==temp[i+8]&&temp[i+6]!=13&&
					parseInt(temp[i])+1==temp[i+5]&&
					parseInt(temp[i+3])+1==temp[i+8]) {
					if (i==0&&temp[9]==temp[10]&&temp[11]==temp[12]&&temp[13]==temp[14]) {
						res = parseInt(temp[i+8]);
						break;
					}else if (i==2&&temp[0]==temp[1]&&temp[11]==temp[12]&&temp[13]==temp[14]) {
						res = parseInt(temp[i+8]);
						break;
					}else if (i==4&&temp[0]==temp[1]&&temp[2]==temp[3]&&temp[13]==temp[14]) {
						res = parseInt(temp[i+8]);
						break;
					}else if (i==6&&temp[0]==temp[1]&&temp[2]==temp[3]&&temp[4]==temp[5]) {
						res = parseInt(temp[i+8]);
						break;
					}
				}
			}
			return res;
		}

		/*判断出牌能否大于其他玩家
		  参数 poker_data Array 当前玩家要出的牌型数据
		  参数 now_poker null/array 当前桌面上牌型的数据
		  return boolean	如果打得过就返回true，打不过或者牌型不符就返回false
		  */
		  var checkVS = function( poker_data,now_poker ){
		  	if (now_poker.length == 0) {
		  		return true;
		  	}
			//如果判断牌型不一致，并且出牌不是炸弹
			if (poker_data[1]!=now_poker[1]&&poker_data[1]!= 998) {
				return  false;
			}
			//如果出的牌是炸弹，桌面的牌不是炸弹，就肯定True
			if (poker_data[1]==998) {
				if (now_poker[1]!=998) {
					return true;
				}else if (now_poker[1]==998) {
					if (poker_data[3]>now_poker[3]) {
						return true;
					}else{
						return false;
					}
				}
			}
			//如果两上牌型一样，长度不一样直接返回false
			if (poker_data[1] == now_poker[1] && poker_data[0].length != now_poker[0].length) {
				return false;	
			}

			// 通过以上的判断基本上已经判断完如果两个不同时为炸弹，并且长度不一样的问题
			// 比较2副牌的key
			if (poker_data[2] > now_poker[2]) {
				return true;
			}else{
				return false;
			}
		}

		//打出后删除的牌
		var delPoker = function(poker_arr , del_arr){
			while(del_arr.length > 0){
				for (var i = 0; i < poker_arr.length ; i++) {
					if (poker_arr[i] == del_arr[0]) {
						poker_arr.splice(i,1);
						break;
					}
				}
				del_arr.splice(0,1);
			}
			return poker_arr;
		}


		//=============================特效图片====================================//
		var shunzi_number = 0;
		var liandui_number = 0;
		var feiji_number = 0;
		//判断出哪张图
		var images_name = function(temp_arr) {	
			if (temp_arr[1]==999) {									//王炸
				var src = '../images/zhadan.gif';
			}else if (temp_arr[1]==998) {							//炸弹
				var src = '../images/zhadan.gif';
			}else if (temp_arr[1]==9||temp_arr[1]==13||temp_arr[1]==19||temp_arr[1]==23||temp_arr[1]==26||temp_arr[1]==29||temp_arr[1]==31||temp_arr[1]==32) {	//连对
				liandui_number=(++liandui_number>=4)?1:liandui_number;
				if(liandui_number >= 1){
					var src = '../images/liandui.gif';
				}
			}else if (temp_arr[1]==6||temp_arr[1]==10||temp_arr[1]==11||temp_arr[1]==12||temp_arr[1]==16||temp_arr[1]==18||temp_arr[1]==21||temp_arr[1]==22) {				//顺子
				shunzi_number = (++shunzi_number>=4)?1:shunzi_number;
				if(shunzi_number >= 1){
					var src = '../images/shunzi.gif';
				}
			}else if (temp_arr[1]==8||temp_arr[1]==14||temp_arr[1]==17||temp_arr[1]==20||temp_arr[1]==24||temp_arr[1]==25||temp_arr[1]==27||temp_arr[1]==28||temp_arr[1]==30) {		//飞机	
				feiji_number=(++feiji_number>=4)?1:feiji_number;
				if(feiji_number >= 1){
					var src = '../images/feiji.gif';
				}
			}else if(temp_arr[1]==15){
				var src = '../images/manwang.jpg';
			}
			return src;
		}

		//展示动态效果图
		var images = function(images_src) {
			if (images_src) {
				$("#images").attr('src',images_src)
				$("#images").css("display","block")
				setTimeout(function(){
					$("#images").css("display","none");
				},800)
			}	
		}

 		//=============================音效====================================//
 		var shunzi_music_number = 0;
 		var liandui_music_number = 0;
 		var feiji_music_number = 0;

 		document.getElementById("bgmusic").volume = 0.2;
		var xp=document.getElementById("music0");      //洗牌
		// var fp=document.getElementById("music1");     
		var cp_yes=document.getElementById("music4");  //出牌
		var cp_no=document.getElementById("music5");   //不出

		var liandui_music= document.getElementById("liandui");//连对
		var liandui_music2= document.getElementById("liandui2");//连对
		var liandui_music3= document.getElementById("liandui3");//连对

		var sandaiyi_music = document.getElementById("sandaiyi");//3带1
		var sandaiyidui_music = document.getElementById("sandaiyidui");//3带一对

		var shunzi_music = document.getElementById("shunzi");//顺子
		var shunzi_music2 = document.getElementById("shunzi2");//顺子
		var shunzi_music3 = document.getElementById("shunzi3");//顺子

		var sidaier_music = document.getElementById("sidaier");//四带二
		var sandailiangdui_music = document.getElementById("sidailiangdui");//四带两对

		var feiji_music = document.getElementById("feiji");//飞机
		var feiji_music2 = document.getElementById("feiji2");//飞机
		var feiji_music3 = document.getElementById("feiji3");//飞机
		
		var zhadan_music = document.getElementById("zhadan");//炸弹
		var wangzha_music = document.getElementById("wangzha");//王炸
		// var huadouxiele = document.getElementById('huadouxiele');//花都泄了
		var baodan = document.getElementById('baodan');//报单
		var baoshuang = document.getElementById('baoshuang');//报双

		var dan_arr = Array();
		for (var i = 1; i <=15 ; i++) {
			dan_arr[i] = 'dan'+i;
			dan_arr[i] = document.getElementById("dan"+i);
		}

		var dui_arr = Array();
		for (var j = 1; j <=15 ; j++) {
			dui_arr[j] = 'dui'+j;
			dui_arr[j] = document.getElementById("dui"+j);
		}

		var sound = function(music){
			music.play();
		}

		var sound_play = function(temp_arr) {
			if (temp_arr[1]==1) {					//判断单张音效
				var music_key = temp_arr[2];
				for (var i = 1; i <= 15; i++) {
					if (music_key == 12) {			//尖
						sound(dan_arr[1]);
						break;
					}else if (music_key == 13) {	//二
						sound(dan_arr[2]);
						break;
					}else if (i == music_key) {
						sound(dan_arr[i+2]);
					} 
				}
			}else if (temp_arr[1]==2) {				//判断对子音效
				var music_key = temp_arr[2];
				for (var i = 1; i <= 13; i++) {
					if (music_key == 12) {
						sound(dui_arr[1]);
					}else if (music_key == 13) {
						sound(dui_arr[2]);
					} else if (i == music_key) {
						sound(dui_arr[i+2]);
					}
				}
			}else if (temp_arr[1]==9||temp_arr[1]==13||temp_arr[1]==19||temp_arr[1]==23||temp_arr[1]==26||temp_arr[1]==29||temp_arr[1]==31||temp_arr[1]==32) {							//连对
				(++liandui_music_number>4)?1:liandui_music_number;
				if (liandui_music_number == 1) {				//连对
					sound(liandui_music);						
				}else if(liandui_music_number == 2){
					sound(liandui_music2);
				}else if(liandui_music_number == 3){
					sound(liandui_music3);
				}
			}else if (temp_arr[1]==6||temp_arr[1]==10||temp_arr[1]==11||temp_arr[1]==12||temp_arr[1]==16||temp_arr[1]==18||temp_arr[1]==21||temp_arr[1]==22) {
				(++shunzi_music_number>4)?1:shunzi_music_number;
				if (shunzi_music_number == 1) {
					sound(shunzi_music);						//顺子
				}else if(shunzi_music_number == 2){
					sound(shunzi_music2);
				}else if(shunzi_music_number == 3){
					sound(shunzi_music3);
				}
			}else if (temp_arr[1]==8||temp_arr[1]==14||temp_arr[1]==17||temp_arr[1]==20||temp_arr[1]==24||temp_arr[1]==25||temp_arr[1]==27||temp_arr[1]==28||temp_arr[1]==30) {	//飞机				
				(++feiji_music_number>4)?1:feiji_music_number;	
				if (feiji_music_number == 1) {				//飞机
					sound(feiji_music);						
				}else if(feiji_music_number == 2){
					sound(feiji_music2);
				}else if(feiji_music_number == 3){
					sound(feiji_music3);
				}	
			}else if (temp_arr[1]==4) {
				sound(sandaiyi_music);
			}else if (temp_arr[1]==5) {
				sound(sandaiyidui_music);
			}else if (temp_arr[1]==7) {
				sound(sidaier_music);
			}else if (temp_arr[1]==15) {
				sound(sandailiangdui_music);
			}else if (temp_arr[1]==998) {
				sound(zhadan_music);
			}else if (temp_arr[1]==999) {		
				sound(wangzha_music);
			}else{
				sound(cp_yes); //播放出牌音效
			}
		}

	});	
