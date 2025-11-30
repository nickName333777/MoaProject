console.log("chatbotManager.js loaded");

// 
let selectChattingNo; // 선택한 채팅방 번호
let selectTargetNo; // 현재 채팅 대상
let selectTargetName; // 대상의 이름
let selectTargetProfile; // 대상의 프로필



// 채팅방 목록에 이벤트를 추가하는 함수 (chatting.jsp 해당 요소에 onclick이벤트 등록할것)
function roomListAddEvent(){
    console.log('roomList 호출')
    console.log(selectChattingNo +"번호 [ roomListAddEvent() ] ")
    const chattingItemList = document.getElementsByClassName("chatting-item"); // 배열, 채팅 목록들 배열
   
    for(let item of chattingItemList){
        //console.log(item) // li .chatting-item (li-tag)
        //console.log(item.children[1]) // .item-body 클래스 (div-tag)
        //console.log(item.children[1].children[1]) // (div-tag) 
        //console.log(item.children[1].children[1].children[1]) // .not-read-count 클래스 (p-tag) 
        item.addEventListener("click", e => {
   
            // 전역변수에 채팅방 번호, 상대 번호, 상태 프로필, 상대 이름 저장
            selectChattingNo = item.getAttribute("chat-no"); // 여기서 전역변수 세팅
            selectTargetNo = item.getAttribute("target-no");
            selectTargetProfile = item.children[0].children[0].getAttribute("src");
            selectTargetName = item.children[1].children[0].children[0].innerText; // "${room.targetNickName}"


            // 알림(읽지않은메시지)이 존재하는 경우 지우기
            if(item.children[1].children[1].children[1] != undefined){ // "${room.notReadCount}"
                item.children[1].children[1].children[1].remove();
            }
   
            // 모든 채팅방에서 select 클래스를 제거
            for(let it of chattingItemList) it.classList.remove("select")
   
            // 현재 클릭한 채팅방에 select 클래스 추가
            item.classList.add("select");

            // 채팅방 목록 조회 (비동기식 조회; 최초 상단 메뉴에서 '채팅' 클릭시 수행하는 동기식 조회와는 구분)
            selectRoomList();

            // 비동기로 메세지 목록을 조회하는 함수 호출 (비동기식 조회)
            selectMessageList();
   
        });
    }
}




// 문서 로딩 완료 후 수행할 기능
document.addEventListener("DOMContentLoaded", ()=>{
   
    // 채팅방 목록에 클릭 이벤트 추가
    roomListAddEvent();

    // 채팅 메시지 "보내기" 버튼 클릭 이벤트 추가
    // (채팅방 목록 클릭후 보내기 버튼 클릭-> chattingNo와 targetNo가 채팅방 목록을 클릭했을  때 세팅되기 때문)
    send.addEventListener("click", sendMessage) // sendMessage()함수 실행하도록 이벤트 등록

    // 채팅 알림을 클릭해서 채팅 페이지로 이동한 경우-> , 2025/09/22
    const params = new URLSearchParams(location.search); // query string만 K, V로 꺼내올 수 있게 해주는 함수
    const chatNo = params.get("chat-no");

    if(chatNo != null) {
        const chatItems = document.querySelectorAll(".chatting-item");
        chatItems.forEach(item=>{ // li하나 하나를 반복문으로 해서 해당 요소 찾자
            if(item.getAttribute("chat-no") == chatNo){
                item.click()  // 해당 요소 클릭해라
                return; // for문 종료
            }
        })
        return; // DOMContentLoaded 이벤트 리스너 함수 종료
    }

});


// 추가 버튼 클릭 시 (화면에 팝업창 띄우고, (채팅상대)사용자 검색(ajax)도 가능하게 하자)

const addTarget = document.getElementById("addTarget"); // 추가 버튼
const addTargetPopupLayer = document.getElementById("addTargetPopupLayer"); // 팝업 레이어
const closeBtn = document.getElementById("closeBtn"); // 닫기 버튼
const targetInput = document.getElementById("targetInput"); // 사용자 검색
const resultArea = document.getElementById("resultArea"); // 검색 결과

// (채팅상대) 검색 팝업 레이어 열기 (div-tag class = "popup-layer-area")
addTarget.addEventListener("click", ()=>{
    addTargetPopupLayer.classList.toggle("popup-layer-close"); // remove
    // toggle() : 해당 클래스가 있으면 제거, 없으면 추가
     targetInput.focus();

})

// (채팅상대) 검색 팝업 레이어 닫기
closeBtn.addEventListener("click", ()=>{
    addTargetPopupLayer.classList.toggle("popup-layer-close"); // add
    resultArea.innerHTML = ""; // 이전 검색결과 비우기(초기화)
    targetInput.value=""; //이전 검색결과도 지운다(마치 처음처럼) -> 이전검색결과 남기려면 이거 comment처리
   
})

// 채팅상대 검색 (ajax): 사용자 id를 DB에서 조회해 온다 => SQL문부터 작성해서 파라미터 뭘 담아보낼지 알아본다.
// js에서는 세션에서 loginMember가져올 수 없으므로(EL사용도 불가), jsp에서 전역변수 선언해 놓고 가져오거나(방법1)
// controller에서는 입력매개변수로 loginMember값을 @SessionAttribute로 가져올 수 있으므로(방법2) controller에서 loginMember값 방법2로 전달받아서 처리 
targetInput.addEventListener("input", e=>{
    const query = e.target.value.trim();
    //console.log(query);

    // 입력값이 없을 경우:
    if(query.length == 0){
        resultArea.innerHTML = ""; // 이전 검색결과 비우기(초기화)
        return;
    }

    // 입력값이 있을 경우:
    // fetch("요청주소?전달할 파라미터")
    fetch("/chatbot/manager/selectTarget?query=" + query) // GET은 query string으로 입력 변수 전달(요청주소창에)
                                                   // 요청주소 보내는 곳
    .then(response => response.json())
    .then(list => {
        //console.log(list);

        resultArea.innerHTML = ""; // 이전 검색결과 비우기(초기화)
        // 화면만들기
        // 일치하는 회원 없을때 JS로 화면 만들기
        if (list.length == 0){
            // JS로 화면 요소 만들기
            const li = document.createElement("li");
            li.classList.add("result-row");
            li.innerText = "일치하는 회원이 없습니다";

            // 화면에 배치
            resultArea.append(li);
            return; //일치하는 회원없으므로 함수종료
            
        } 
        //else {
            for (let member of list){
                // console.log("member : " + member); // not working 
                //console.log(member); // working
                // li
                const li = document.createElement("li");
                li.classList.add("result-row");
                li.setAttribute("data-id", member.memberNo); // [회원번호] li에 "data-id"속성은 없고, 사용자가 만들어서 쓰는 속성이다.

                // img
                const img = document.createElement("img");
                img.classList.add("result-row-img");

                // 프로필 이미지 여부(기본값 or 프로파일이미지)에 따라 src 속성 지정
                //if (img.getAttribute("src") != null){
                if (member.profileImage == null){
                    img.setAttribute("src", "/images/user.png"); // 기본이미지?
                } else {
                    img.setAttribute("src", member.profileImage); // 멤버이미지
                }
                //resultArea.append(img) // 최종 조립 전에 중간확인
                
                let nickName = member.memberNickname;
                let email = member.memberEmail;
                // span
                const span = document.createElement("span");

                // replace : 일치하는 첫 번째 항목만 변경
                // replaceAll : 일치하는 모든 항목 변경
                span.innerHTML = `${nickName} ${email}`.replaceAll(query, `<mark>${query}</mark>`); // 일치한 ㄴ안에 항목 전부
                //span.innerHTML = `${nickName} ${email}`.replace(query, `<mark>${query}</mark>`); // 
                                //예시)  유저   user01         // 유저      <mark>유저</mark>

                // 최종 요소 조립(화면에 추가)
                li.append(img, span);
                resultArea.append(li) // 최종 조립: resultArea는 ul-tag


                // li 요소 클릭시 채팅방 입장하는 이벤트 추가
                li.addEventListener("click", chattingEnter); // chattingEnter: 채팅방 입장 함수
            }
        //}
    })
    .catch(e => console.log(e))
})

// chattingEnter() : 함수 호출
// chattingEnter : 함수 자체

// 채팅방 입장 함수 
// 목록에서 클릭한 회원 -> 기존 채팅방 있었나(기존 채팅방 보여주기) 없었나(새로 채팅방 만들어 보여준다)
function chattingEnter(e){
    //console.log(e.target); // li클릭하면 li, img클릭하면 img, span클릭하면 span -> 실제 클릭된 요소 (셋중에 하나! -> 않좋다)
    //console.log(e.currentTarget); // 이벤트 리스너가 설정된 요소 --> 항상 li ->이게 우리가 원하는 것. -> 여기 li에 우리가 설정했던 "data-id" 속성값 이용

    const targetNo = e.currentTarget.getAttribute("data-id"); // li-태그에 우리가 사용자 정의 했던 속성, ex)  data-id="1" -> 첫번째 li-tag의미

    // 비동기(ajax)
    fetch("/chatbot/manager/enter?targetNo="+targetNo)
    .then(response => response.text())
    .then(chattingNo => {
        console.log("chattingNo :");
        console.log(chattingNo); // chattingNo

        // 채팅방 목록 조회 (CHATTING_ROOM 테이블, ajax로 구현, 비동기)
        selectRoomList(); // 

        setTimeout(() =>{ // 바로 앞의 selectRoomList()에서 목록조회에 목록이 많으면 시간걸리기때문에 잠시 기다려준다.
            // 존재하는 채팅방이 있으면 클릭해서 입장
            const itemList = document.getElementsByClassName("chatting-item");

            for(let item of itemList){

                // 목록에 채팅방이 존재한다면
                if (chattingNo == item.getAttribute("chat-no")) {
                    // 팝업닫기
                    addTargetPopupLayer.classList.toggle("popup-layer-close");

                    // 검색어 삭제
                    targetInput.value = "";

                    // 사용자 검색 결과 삭제
                    resultArea.innerText = "";

                    // 해당 채팅방 클릭
                    item.click(); // 해당요소 click해라 cf) item.focus()
                    // ==> 이거 다시 위에서 li-tag에 추가한 li.addEventListener("click", chattingEnter); // chattingEnter: 채팅방 입장 함수
                    // 를 실행시켜 무한루프에 들어가는거 아닐까? --> setTimeout()으로 ajax들 간의 비동기요청에 delay를 두는 것이 무한루프 막고 있는것 아닐까?
                    return;
                }
            }

        }, 200); // 조회


    })
    .catch(e => console.log(e))
}   


// 비동기로 채팅방 목록 조회(ajax)
// roomList조회은 앞에서 상단메뉴 "채팅"클릭했을때 화면전환 하는곳(jsp로감)에서 한번 한적은 있다
// 여기서는 비동기로 요청보낸곳으로 돌아와야한다.
function selectRoomList() {

    // 비동기로 만들어준 화면
    fetch("/chatbot/manager/roomList")
    .then(resp => resp.json())
    .then(roomList => {
        //console.log(roomList);

        // 채팅방 목록 출력 영역 선택
        const chattingList = document.querySelector(".chatting-list");


        // 채팅방 목록 지우기
        chattingList.innerHTML = "";


        // 조회한 채팅방 목록을 화면에 추가
        for(let room of roomList){
            const li = document.createElement("li");
            li.classList.add("chatting-item");
            li.setAttribute("chat-no", room.chattingNo);
            li.setAttribute("target-no", room.targetNo);


            if(room.chattingNo == selectChattingNo){
                li.classList.add("select");
            }


            // item-header 부분
            const itemHeader = document.createElement("div");
            itemHeader.classList.add("item-header");


            const listProfile = document.createElement("img");
            listProfile.classList.add("list-profile");


            if(room.targetProfile == undefined)
                listProfile.setAttribute("src", "/images/user.png");
            else                                
                listProfile.setAttribute("src", room.targetProfile);


            itemHeader.append(listProfile);


            // item-body 부분
            const itemBody = document.createElement("div");
            itemBody.classList.add("item-body");


            const p = document.createElement("p");


            const targetName = document.createElement("span");
            targetName.classList.add("target-name");
            targetName.innerText = room.targetNickName;
            //targetName.innerText = room.targetNickName+" (chat#="+room.chattingNo+")";
           
            const recentSendTime = document.createElement("span");
            recentSendTime.classList.add("recent-send-time");
            recentSendTime.innerText = room.sendTime;
           
           
            p.append(targetName, recentSendTime);
           
           
            const div = document.createElement("div");
           
            const recentMessage = document.createElement("p");
            recentMessage.classList.add("recent-message");


            if(room.lastMessage != undefined){
                recentMessage.innerHTML = room.lastMessage;
            }
           
            div.append(recentMessage);


            itemBody.append(p,div);


            // 현재 채팅방을 보고있는게 아니고 읽지 않은 메시지 개수가 0개 이상인 경우 
            // -> 읽지 않은 메세지 개수 출력
            if(room.notReadCount > 0 && room.chattingNo != selectChattingNo ){
                const notReadCount = document.createElement("p");
                notReadCount.classList.add("not-read-count");
                notReadCount.innerText = room.notReadCount;
                div.append(notReadCount);
            }else{

                // 현재 채팅방을 보고있는 경우
                // 비동기(ajax)-PUT 방식으로 해당 채팅방 글을 읽음으로 표시
                
                // 이때, 화면만들기, 비동기(ajax)-GET 방식으로roomList얻는것 다 비동기라서 잠깐 기다려줘야함
                //console.log(`chatting NO: ${selectChattingNo}`)
                //console.log(`memberNo : ${loginMemberNo}`)
                setTimeout(() => {
                    fetch("/chatbot/manager/updateReadFlag", {
                        method : "PUT",
                        headers : {"Content-Type" : "application/json"},
                        body : JSON.stringify({ // JSON"{K:V}", JSON.stringfy(): JS 객체 -> JSON 으로
                            memberNo : loginMemberNo,  // jsp에 loginMember 값 전역변수 선언해서 받아온다
                            "chattingNo" : selectChattingNo  // 아래 roomListAddEvent()수행되야 전역변수 selectChattingNo값이 세팅되므로 지연실행 필요 
                        })
                    }) // update 성공한 행의 갯수 반환
                    .then(resp => resp.text())
                    .then(result => {
                        //console.log("채팅방 글을 읽음으로 표시 성공한 행의 갯수");
                        console.log(result);
                    })
                    .catch(err => console.log(err))

                }, 500) // 200ms delay -> 400ms 시간 늘여 => ORA-00936: 누락된 표현식 에러 수정 (2025/09/22 에 변경)
               // }, 0) // 1ms delay
            
            }
        
            li.append(itemHeader, itemBody);
            chattingList.append(li);
        }

        // 채팅방 목록에 "클릭 이벤트 함수" 호출 (새로만든 채팅방 클릭할 수 있도록)
        roomListAddEvent(); // 비동기 -> 이제 여기서 클릭해야 전역변수 selectChattingNo값이 세팅되는데, 
                            // 이게 위의 chattingEnter(e)함수 안에 item.click()에서 클릭 수행되는 것임

    })
    .catch(e => console.log(e))

}




// 비동기로(GET) 메세지 목록을 조회하는 함수
// (채팅방 메시지 읽음) 알림도 쓸예정이라 loginMemberNo도 입력 파라미터에 추가
function selectMessageList(){                           // 전역변수 (selectChattingNo는 위에서 roomListAddEvent()함수 실행되었을때 chattingNo값이 세팅되었다)
    console.log("[ selectMessageList() ] selectNo :" + selectChattingNo)
    
    fetch("/chatbot/manager/selectMessageList?chattingNo=" + selectChattingNo + "&memberNo" + loginMemberNo)
    .then(resp => resp.json())
    .then(messageList =>{
        //console.log(messageList);

        const ul = document.querySelector(".display-chatting");
        ul.innerHTML = ""; // 이전 내용 지우기

        // 메세지 만들어서 출력하기
        for(let msg of messageList){
            //<li>,  <li class="my-chat">
            const li = document.createElement("li");


            // 보낸 시간
            const span = document.createElement("span");
            span.classList.add("chatDate");
            span.innerText = msg.sendTime;


            // 메세지 내용
            const p = document.createElement("p");
            p.classList.add("chat");
            p.innerHTML = msg.messageContent; // br태그 해석을 위해 innerHTML


            // 내가 작성한 메세지인 경우
            if(loginMemberNo == msg.senderNo){
                li.classList.add("my-chat");
               
                li.append(span, p);
               
            }else{ // 상대가 작성한 메세지인 경우
                li.classList.add("target-chat");


                // 상대 프로필
                // <img src="/images/user.png">
                const img = document.createElement("img");
                img.setAttribute("src", selectTargetProfile);
               
                const div = document.createElement("div");


                // 상대 이름
                const b = document.createElement("b");
                b.innerText = selectTargetName; // 전역변수
                //b.innerText = selectTargetName +" (" + selectChattingNo + ")"; // 전역변수


                const br = document.createElement("br");


                div.append(b, br, p, span);
                li.append(img,div);


            }


            ul.append(li);
            
            // 스크롤바 내리기
            ul.scrollTop = ul.scrollHeight;
        }


    })
    .catch(err => console.log(err))
}

// 지금까지는 요청보내고, 비동기로 요청 결과 (대화상대 목록, 채팅방 메시지 목록) 받아오기
// -------------------------------------------------






// 이제부터 웹소켓을 이용한 메시지 보내고/받기를 JS로 구현(chatting.js)
// -------------------------------------------------
// sockJS를 이용한 WebSocket 구현

// 로그인이 되어있는 경우
// chatbotSock 이라는 요청주소로 통신할 수 있는 WebSocket 객체 생성
let chatbotSock;

if (loginMemberNo != ""){ // 로그인 안한 경우
    // chatbotSock를 위에서 전역변수로 선언하고 사용
    chatbotSock = new SockJS("/chatbotSock");  // ajax같은 느낌으로 작동 (/common/config/WebSocketConfig.java에서 웹소켓 요청주소등 설정)

}

 // 채팅 입력 시
const send = document.getElementById("send"); // 보내기 버튼

const sendMessage = ()=>{ // JS에서 함수도 변수에 담을수 있다
    const inputChatting = document.getElementById("inputChatting");

    if (inputChatting.value.trim().length == 0) {
        alert("채팅을 입력해 주세요.");
        inputChatting.value = "";

    } else {
        var obj = {
            senderNo : loginMemberNo, // 모두 전역변수에 있는 애들
            targetNo : selectTargetNo,
            chattingNo : selectChattingNo,
            messageContent : inputChatting.value

        } // 나중 전송시 JS -> JSON바꿔서(문자열로 parsing해서) 보낸다 (자바에서 JS객체 자료형 없다)

        console.log("selectTargetNo :");console.log(selectTargetNo);  // 채팅 상대 선택하지 않으면 'undefinded' 가 되는데, 그래도 그냥 메시지 보내므로 이거 null 처리 필요. 
        console.log(obj); 
        
        // JS -> JSON바꿔서(문자열로 parsing해서) 보낸다
        chatbotSock.send(JSON.stringify(obj));

        // 기존 메세지 내용 삭제 (초기화)
        inputChatting.value = "";

        //// ==> 알림보내기는  잠시 꺼두자.... 2025/11/08
        //  여기서 이슈1) SQL = INSERT INTO NOTIFICATION(
        //     NOTIFICATION_NO, 
        //     NOTIFICATION_CONTENT, 
        //     NOTIFICATION_URL, 
        //     SEND_MEMBER_NO, 
        //     RECEIVE_MEMBER_NO
        // ) VALUES( ?, ?, ?, ?, )
        //    ==> 여기서 마지막 인자인 RECEIVE_MEMBER_NO가 안 넘어가는 문제가 있는데, 이거는 다른곳에서 notificaton 꺼놓아서 마지막 인자가 전달 않되는것
        // 여기서 이슈2) NOTIFICATION DB TABLE SEQ. 생성도 필요 
        //  CREATE SEQUENCE SEQ_NOTI_NO
        //        START WITH 1
        //        INCREMENT BY 1
        //        NOCACHE;
        //
        //////////////////////////////////////////////////////////////////////
        // // 채팅 알림 보내기 2025/09/22
        // const url = `${location.pathname}?chat-no=${selectChattingNo}`; // selectChattingNo : 전역변수 
        // const content = `<strong> ${memberNickname}</strong>님이 채팅을 보냈습니다.<br>${inputChatting.value}`; // inputChatting.value : 보낸 채팅 내용
        // sendNotification(
        //     "chatting",
        //     url,            // location.pathname + "?chat-no=" +  // chat-no 을 통해서 
        //     selectTargetNo,  // selectTargetNo: 앞에서 선언한 전역변수
        //     content 
        // )        



    }

}


// 엔터 시 메시지 보내기
// shift + enter 시 줄바꿈
inputChatting.addEventListener("keyup", e=>{
    //console.log(e.key); // 입력 키값 확인: enter -> "Enter"로 나온다
    //console.log(e.shiftKey); // 그냥 엔터: "false", shift+Enter인 경우 "true" 반환

    if(e.key == "Enter"){ // Enter 눌렀는지 검사
        if(!e.shiftKey) { // shift도 눌렀는지 검사
            sendMessage(); // 'Enter'일때만 sendMessage()수행
        }

    }
})


// WebSocket 객체 chatbotSock이 
// 서버로부터 메세지를 받으면 자동으로 실행될 콜백 함수
chatbotSock.onmessage = e=>{

    // 메소드를 통해 전달 받은 객체값을 JS객체로 변환해서 변수에 저장
    const msg = JSON.parse(e.data); // JSON 문자열 -> JS 객체로
    //console.log(msg);

    // 현재 채팅방을 보고있는 경우 (위에서 채팅방 만드는 경우와 유사)
    if(selectChattingNo == msg.chattingNo){


        const ul = document.querySelector(".display-chatting");
   
        // 메세지 만들어서 출력하기
        //<li>,  <li class="my-chat">
        const li = document.createElement("li");
   
        // 보낸 시간
        const span = document.createElement("span");
        span.classList.add("chatDate");
        span.innerText = msg.sendTime;
   
        // 메세지 내용
        const p = document.createElement("p");
        p.classList.add("chat");
        p.innerHTML = msg.messageContent; // br태그 해석을 위해 innerHTML
   
        // 내가 작성한 메세지인 경우
        if(loginMemberNo == msg.senderNo){
            li.classList.add("my-chat");
           
            li.append(span, p);
           
        }else{ // 상대가 작성한 메세지인 경우
            li.classList.add("target-chat");
   
            // 상대 프로필
            // <img src="/images/user.png">
            const img = document.createElement("img");
            img.setAttribute("src", selectTargetProfile);
           
            const div = document.createElement("div");
   
            // 상대 이름
            const b = document.createElement("b");
            b.innerText = selectTargetName; // 전역변수
   
            const br = document.createElement("br");
   
            div.append(b, br, p, span);
            li.append(img,div);
            console.log("gd")
   
        }
   
        ul.append(li)
        
        // 스크롤바 내리기
        ul.scrollTop = ul.scrollHeight;

        // // 스크롤바 내리기
        // const ulDisplayChatting = document.getElementsByClassName("display-chatting")[0]; //배열

        // // 요소를 찾았는지 확인합니다.
        // if (ulDisplayChatting) {
        //     // 2. 스크롤을 요소의 맨 아래로 이동시킵니다.
        //     ulDisplayChatting.scrollTop = ulDisplayChatting.scrollHeight;

        //     // 또는 scrollTo() 메서드 사용:
        //     // ulDisplayChatting.scrollTo(0, ulDisplayChatting.scrollHeight);
        // }

    }
    selectRoomList();

}

// ----------------------------------------------------------
// 테마 변경
const changeTheme = document.getElementById("changeTheme");

changeTheme.addEventListener("click", e=> {
    if (e.target.checked) {// 테마 변경 클릭 시 (체크한 경우)

        // html 태그에 color-theme 속성 변경
        document.documentElement.setAttribute('color-theme', 'pink');
        localStorage.setItem("color-theme", "pink");

    } else { // 체크 해제된 경우
        document.documentElement.setAttribute('color-theme', 'light');
        localStorage.setItem("color-theme", "light");
    }
})


// localStorage : 브라우저에 key-value 값을 Storage에 저장할 수 있다.
//                이 때, 저장한 데이터는 세션간 공유됨

const isUserColorTheme = localStorage.getItem("color-theme");
const isOsColorTheme 
=  window.matchMedia('(prefers-color-scheme:pink)').matches ? 'pink' : 'light';
// prefers-color-scheme : CSS 미디어 특성을 이용하여 사용자의 OS가 사용하는 테마를 감지

//console.log(isUserColorTheme); // null
//console.log(isOsColorTheme); // light

                                            
const getUserTheme = () => (isUserColorTheme ? isUserColorTheme : isOsColorTheme);  // 
//  () => {return 식 or 값} : return과 {}생략가능 -> () => 식 or 값
// 그런데, return 값이 객체인 경우 () 괄호 필수 -> () => (객체)

// 문서의 모든 컨텐츠가 로드된 경우
window.onload = () => {
    console.log(getUserTheme)
    if(getUserTheme() == 'light') { // light 모드인 경우
        // html 태그에 color-theme 속성 추가
        document.documentElement.setAttribute("color-theme", "light");
        localStorage.setItem('color-theme', 'light');

    } else { // pink 모드인 경우
        document.documentElement.setAttribute("color-theme", "pink");
        localStorage.setItem('color-theme', 'pink');
        changeTheme.setAttribute("checked", true);
    }
}
