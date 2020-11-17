let oUname = document.getElementById("user");
let oError = document.getElementById("error_box");
let oUpwd = document.getElementById("upwd");
let isError = true;  //判断格式是否正确

//登陆
function foLogin() {

    oError.innerHTML = "<br>";



    if (oUname.value.length < 5) {
        oError.innerHTML = "用户名至少要5位";
        isError = false;
        return;
    } else if (oUname.value.charCodeAt(0) >= 48 && (oUname.value.charCodeAt(0) <= 57)) {
        oError.innerHTML = "首位不能为数字";
        return;

    } else for (var i = 0; i < oUname.value.length; i++) {
        if ((oUname.value.charCodeAt(i) < 48) || (oUname.value.charCodeAt(i) > 57) && (oUname.value.charCodeAt(i) < 58) && (oUname.value.charCodeAt(i) > 97)) {
            oError.innerHTML = "只能为数字和字母";
            return;
        }
    }
    if (oUpwd.value.length < 6 || oUpwd.value.length > 12) {
        oError.innerHTML = "密码要6-12位";
        isError = false;
        return;
    }
    //所有格式正确则跳转至enter.html
    if (isError == true) {
        window.location.href = 'html/enter.html';
    }
    localStorage.setItem("username",oUname.value);
//  alert(localStorage.getItem("username"));
//  localStorage.setItem(oUname.value,oUpwd.value);
}
