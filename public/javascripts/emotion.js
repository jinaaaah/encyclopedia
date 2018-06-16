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

//UI 상수
var write = document.getElementById("write");
var close = document.getElementById("close");
var save = document.getElementById("save");
var deletes = document.getElementById("delete");
var pop_Layer = document.getElementsByClassName("pop-up");

//pop-up 데이터 상수
var pageTitle = document.title;
var author = document.getElementsByName("author")[0];
var title = document.getElementsByName("title")[0];
var corpus = document.getElementsByName("corpus")[0];
var count = document.getElementsByClassName("counts")[0];
var scroll = require("./scroll.js");

//로드 동시에 컨텐츠 업데이트
window.onload = initContents;

//팝업창 보이기
write.onclick = function () {
    pop_Layer[0].style.display = "block";
};

//팝업창 닫기
close.onclick = function () {
    clear();
    pop_Layer[0].style.display = "none";
};

//삭제창
var isClicked = false;
var delete_icon = document.getElementById("deleteImg");

deletes.addEventListener("click",function(){
    if(isClicked){
        //삭제 모드 취소
        isClicked = false;
        //img change
        delete_icon.src = "../public/images/delete_icon.png";
        //스크롤 다시 시작
        scroll.doScroll();
        scroll.autoScroll();
        //이벤트 제거
        clearDeleteMode();
    }
    else{
        //삭제 모드
        isClicked = true;
        //img change
        delete_icon.src = "../public/images/delete_save_icon.png";
        //스크롤 멈춤
        scroll.stopScroll();
        //삭제 화면
        deleteMode();
    }
});

//textarea 내용 지우고 팝업창 닫기
function clear() {
    author.value = "";
    title.value = "";
    corpus.value = "";
    corpus.style.borderColor = "black";
    pop_Layer[0].style.display = "none";
}

//저장 시 동작
save.onclick = function () {
    if(corpus.value === ""){
        corpus.style.borderColor = "red";
        corpus.onfocus = function () {
            corpus.style.borderColor = "black";
        };
    }
    else{
        corpus.onfocus = function () {
            corpus.style.borderColor = "black";
        };
        if(author.value === "") author.value = "unknown";
        if(title.value === "") title.value = "unknown";
        saveData();
        updateContents(author,title,corpus);
        clear();
    }
};

//firebase에 저장
function saveData() {
    //엔터값 변환
    var string = corpus.value.replace(/(?:\r\n|\r|\n)/g, '<br />');
    database.ref('users/' + pageTitle).push(
        {
            author: author.value,
            title: title.value,
            corpus: string
        }
    );
}

function initContents() {
    database.ref('/users/'+pageTitle).once('value').then(function (snapshot) {
        //count 숫자 업데이트
        var  num = snapshot.numChildren() + 1;
        count.innerHTML = num;

        snapshot.forEach(function (childSnapshot) {
            //data 받아서 contents 생성
            var author_contents = childSnapshot.child('author').val();
            var title_contents = childSnapshot.child('title').val();
            var corpus_contents = childSnapshot.child('corpus').val();

            var div = document.getElementsByClassName('contents')[0];
            var cloneDiv = div.cloneNode(false);
            cloneDiv.innerHTML = '<div class="corpus">' + corpus_contents + '</div>\n<div class="comments">'+ author_contents + ', ' + title_contents+'</div>';

            var parentDiv = document.getElementsByClassName('contents')[0];
            parentDiv.parentElement.insertBefore(cloneDiv,parentDiv);
        })
    });
    scroll.autoScroll();
}

function updateContents() {
    //숫자 업데이트
    count.innerHTML = count.innerHTML * 1 + 1;

    // 저장 시에는 저장된 데이터만 cli에서 로드
    var author_contents = author.value;
    var title_contents = title.value;
    var corpus_contents = corpus.value;

    //엔터값 변환
    corpus_contents = corpus_contents.replace(/(?:\r\n|\r|\n)/g, '<br />');

    var div = document.getElementsByClassName('contents')[0];
    var cloneDiv = div.cloneNode(false);
    cloneDiv.innerHTML = '<div class="corpus">' + corpus_contents + '</div>\n<div class="comments">'+ author_contents + ', ' + title_contents+'</div>';

    var parentDiv = document.getElementsByClassName('contents')[0];
    parentDiv.parentElement.insertBefore(cloneDiv,parentDiv);

    //스크롤
    scroll.doScroll();
}

var contentsList = document.getElementsByClassName("contents");

function mouseoverEvent() {
    this.style.opacity = 0.13;
    this.style.cursor = "pointer";
}

//attach eventlistener
function deleteMode(){
    for(var i = 0; i < contentsList.length; i++){
        //hover effect
        contentsList[i].onmouseout = function () {
            this.style.opacity = 1;
            this.style.cursor = "default";
        };
        contentsList[i].addEventListener("mouseover", mouseoverEvent);
        contentsList[i].addEventListener("click", deleteContents);
    }
}

//remove eventlistener
function clearDeleteMode() {
    for(var i = 0; i < contentsList.length; i++){
        contentsList[i].removeEventListener('mouseover', mouseoverEvent);
        contentsList[i].removeEventListener('click', deleteContents);
    }
}

//firebase data delete
function deleteContents() {
    var isAuthor = this.getElementsByClassName("comments")[0].innerHTML.split(",")[0];

    database.ref('/users/'+pageTitle).once('value').then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
             if(childSnapshot.child('author').val() === isAuthor){
                 database.ref('/users/'+pageTitle).child(childSnapshot.key).remove();
             }
        })
    });
    //화면에서 삭제
    document.getElementsByClassName("contents_container")[0].removeChild(this);
}