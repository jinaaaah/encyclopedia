//firebase 설정
var firebase = require("firebase/app");

var config = {
    apiKey: "AIzaSyBNADTrM3bw_-jtbV6U1n_p_i7dqAKZjjw",
    authDomain: "encyclopedia-9d8f7.firebaseapp.com",
    databaseURL: "https://encyclopedia-9d8f7.firebaseio.com",
    projectId: "encyclopedia-9d8f7",
    storageBucket: "",
    messagingSenderId: "213116471685"
};
firebase.initializeApp(config);
require('firebase/database');

var database = firebase.database();

//전역변수 설정
var landings = document.getElementsByClassName("landing");
var counts = document.getElementsByClassName("counts");
var daycount = document.getElementsByClassName("day_count");
var total = document.getElementById("total_count");
var total_count = 0;
window.onload = init;

//초기화
function init(){
    //요소에 function 달기
    for (var i = 0; i < landings.length; i++){
        landings[i].onclick = function () {
            var name = this.getAttribute('id');
            moveTo(name)
        }
    }

    //카운트 보이기
    for (var j = 0; j < counts.length; j++){
        var emotion = counts[j];
        var name = emotion.getAttribute('id').split("_")[0];
        if(name !== "total" && name !== "emotions"){
            showCount(name, j);
        }
    }

    countDay();
}

//오늘 켰는지 확인
function countDay() {
    var date = new Date();

    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    //오늘 날짜
    var today = year.toString() + month.toString() + day.toString();

    database.ref('/date/').once('value').then(function (snapshot) {
        //on한 날짜 세기
        daycount[0].innerHTML = snapshot.numChildren();

        var isToday = false;
        snapshot.forEach(function (childSnapshot) {
            //오늘 날짜 있는지 확인
            if(today === childSnapshot.child('day').val()){
                isToday = true;
            }
        });

        if(isToday === false){
            //오늘 날짜 저장
            database.ref('/date/').push(
                {
                    day :  today
                }
            );
        }

    });
}

//클릭시 해당페이지로 이동
function moveTo(s) {
    console.log(s);
    if(s === "emotions"){
        location.replace("enclopedia.html");
    }else{
        location.replace(s + ".html");
    }
}

//emotion에 따른 count 제공
function showCount(emotion, index){
    database.ref('/users/'+ emotion).once('value').then(function (snapshot) {
        //count 숫자 업데이트
        var  num = snapshot.numChildren() + 1;
        counts[index].innerHTML = num;

        //total 숫자 업데이트
        total_count += num;
        total.innerHTML = total_count;
    });
}
