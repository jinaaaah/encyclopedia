var target = document.getElementsByClassName("contents_container")[0];
var isScroll = true;

var myTimer;
var autoScroll = function () {
        target.scrollTop += 10;
        myTimer = setTimeout(autoScroll,300);
};

if(document.title === "encyclopedia of emotion"){
    window.onload = autoScroll;
}

//스크롤 재시작
var doScroll = function () {
    isScroll = true;
    //스크롤 위로 올리기
    target.scrollTop = 0;
};
//스크롤 멈춤
var stopScroll = function () {
    isScroll = false;
    clearTimeout(myTimer);
};

exports.autoScroll = autoScroll;
exports.doScroll = doScroll;
exports.stopScroll = stopScroll;

