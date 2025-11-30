console.log("chatbot.js loaded ... ");


// // input 태그에 키가 눌러졌을 때 엔터키인지 검사하는 함수
// // 매개변수 event: KeyboardEvent {isTrusted: true, key:'Process', code: 'keyF', location:0, ctrlkey: false, ... }
// function inputEnter(event){
//     console.log(event.key);
//     // event.key : 입력한 키 출력

//     if(event.key == "Enter") {
//         // 눌러진 key가 엔터인 경우 sendMessage 호출
//         sendMessage();
//     }
// }


// function sendMessage() {

//     // 챗봇 채팅 입력에 사용되는 요소 모두 얻어오기
//     const inputChatting = document.querySelector('#inputChatting');
//     const displayChatting = document.getElementById("displayChatting");

//     if (inputChatting !=null && inputChatting !="") {
        
//         // inputChatting 에 입력된 값을 얻어와 displayChatting 에 추가(누적)
//         displayChatting.innerHTML +=`<p><span>${inputChatting.value}</span></p>`;

//         // displayChatting 스크롤 제일 밑을로 내리기
//         displayChatting.scrollTop = displayChatting.scrollHeight;

//         // input에 작성된 갓 삭제
//         inputChatting.value = "";

//         // input에 초점맞추기
//         inputChatting.focus();
//     }

// }
///////////////////////////////////////////////////////////////////////////////////////////////



//  챗봇의 경우 아래 3경우는 고정
// let selectTargetNo; // 현재 채팅 대상
// let selectTargetName; // 대상의 이름
// let selectTargetProfile; // 대상의 프로필
let selectTargetNo = 11; // 현재 채팅 대상 -> 챗봇의 경우는 11
let selectTargetName = '나쳇봇'; // 대상의 이름(닉네임)
let selectTargetProfile = "/images/user.png";
//let selectTargetProfile = '/images/board/exhibition/member/penguin02_400x400.jpg'; // 대상(여기서는 챗봇)의 프로필

let selectChattingNo; // 선택할 채팅방 번호


// // 채팅방 목록에 이벤트를 추가하는 함수 (chatting.jsp 해당 요소에 onclick이벤트 등록할것)
// function roomListAddEvent(){
//     console.log('roomList 호출')
//     console.log(selectChattingNo +"번호 [ roomListAddEvent() ] ")
//     const chattingItemList = document.getElementsByClassName("chatting-item"); // 배열, 채팅 목록들 배열
   
//     for(let item of chattingItemList){
//         //console.log(item) // li .chatting-item (li-tag)
//         //console.log(item.children[1]) // .item-body 클래스 (div-tag)
//         //console.log(item.children[1].children[1]) // (div-tag) 
//         //console.log(item.children[1].children[1].children[1]) // .not-read-count 클래스 (p-tag) 
//         item.addEventListener("click", e => {
   
//             // 전역변수에 채팅방 번호, 상대 번호, 상태 프로필, 상대 이름 저장
//             selectChattingNo = item.getAttribute("chat-no"); // 여기서 전역변수 세팅
//             selectTargetNo = item.getAttribute("target-no");
//             selectTargetProfile = item.children[0].children[0].getAttribute("src");
//             selectTargetName = item.children[1].children[0].children[0].innerText; // "${room.targetNickName}"


//             // 알림(읽지않은메시지)이 존재하는 경우 지우기
//             if(item.children[1].children[1].children[1] != undefined){ // "${room.notReadCount}"
//                 item.children[1].children[1].children[1].remove();
//             }
   
//             // 모든 채팅방에서 select 클래스를 제거
//             for(let it of chattingItemList) it.classList.remove("select")
   
//             // 현재 클릭한 채팅방에 select 클래스 추가
//             item.classList.add("select");

//             // 채팅방 목록 조회 (비동기식 조회; 최초 상단 메뉴에서 '채팅' 클릭시 수행하는 동기식 조회와는 구분)
//             selectRoomList();

//             // 비동기로 메세지 목록을 조회하는 함수 호출 (비동기식 조회)
//             selectMessageList();
   
//         });
//     }
// }








// 문서 로딩 완료 후 수행할 기능
document.addEventListener("DOMContentLoaded", ()=>{
   
    //  [A]채팅방 목록에 "클릭 이벤트" 추가 (==> 실제 목록의 클릭은 chattingEnter(e)함수에서 이루어진다.)
//roomListAddEvent(); // 여기서 하는일 (챗봇과의 채탱에서는 roomList 필요없다)=> 
// 1) 전역변수에 채팅방 번호(ChattingNo), 상대 번호(TargetNo), 상태 프로필(TargetProfile), 상대 이름(TargetName) 저장
//  ==> chatting-item li-태그를 클릭하면 chat-no와 target-no를 얻어오고, 또한 TargetProfile과 TargetNickname을 얻어오는 구조로 BoardProject에서는 구현되었었다. 
    
    console.log("### DOMContentLoaded ####");
    
    selectTargetNo = 11; // 현재 채팅 대상 -> 챗봇의 경우는 11
    //selectTargetProfile = "/resources/images/user.png";
    selectTargetProfile = "/images/user.png";
    //selectTargetProfile = "= '/images/board/exhibition/member/penguin02_400x400.jpg";
    selectTargetName = "나챗봇";

    //selectChattingNo = item.getAttribute("chat-no"); // 이거 어떻게 얻어올지 생각해 봐라 ==> chatting-enter로 chattingNo 찾던지 생성하던지 해야함
    // ==> 비동기(ajax) 로 chattingNo찾아(생성해)보자 ==> 챗봇의 경우는 일반 채팅의 경우와 다르니, 그냥 chattingNo생성하자. 조회는 좀 거시기하고, 필요하면 나중에 구현하자.
    //fetch("/chatting/enter?targetNo="+targetNo)
    fetch("/chatbot/genChattingNo?targetNo="+selectTargetNo)
    .then(response => response.text())
    .then(chattingNo => {
        console.log("@@@@@@@@@@@@@@@@@@ chattingNo :");
        console.log(chattingNo); // 반환된 채팅방 번호(chattingNo) 기존에 있는값 또는 새로 생성한 방번호
        selectChattingNo = chattingNo
    })
    .catch(e => console.log(e))


    // 위의 비동기로 chattingNo 조회(없으면 생성)하는 부분이 시간이 걸리므로, 
    // 아래 selectMessageList()은 delay를 주어 실행 시켜야함 


    // 2) 비동기로 메세지 목록을 조회하는 함수 호출 (비동기식 조회)
    setTimeout(() =>{  
        selectMessageList();
    }, 400); // 조회

    // [B] 채팅 메시지 "보내기" 버튼 "클릭 이벤트" 추가
    // (채팅방 목록 클릭후 보내기 버튼 클릭-> chattingNo와 targetNo가 채팅방 목록을 클릭했을  때 세팅되기 때문)
    btnSendChatting.addEventListener("click", sendMessage) // sendMessage()함수 실행하도록 이벤트 등록

});


// 챗봇경우 채팅방 입장은 
// 1) 타겟이 정해져있고(챗봇)
// 2) targetNo와 loginMemberNo로 채팅방번호(chattingNo)를 조회해 오던지, 없으면 chattingNo를 새로생성 => 이게 chatting방 Enter가 된다.



// // chattingEnter() : 함수 호출
// // chattingEnter : 함수 자체

// // 채팅방 입장 함수 
// // 목록에서 클릭한 회원 -> 기존 채팅방 있었나(기존 채팅방 보여주기) 없었나(새로 채팅방 만들어 보여준다)
// function chattingEnter(e){
//     //console.log(e.target); // li클릭하면 li, img클릭하면 img, span클릭하면 span -> 실제 클릭된 요소 (셋중에 하나! -> 않좋다)
//     //console.log(e.currentTarget); // 이벤트 리스너가 설정된 요소 --> 항상 li ->이게 우리가 원하는 것. -> 여기 li에 우리가 설정했던 "data-id" 속성값 이용

//     const targetNo = e.currentTarget.getAttribute("data-id"); // li-태그에 우리가 사용자 정의 했던 속성, ex)  data-id="1" -> 첫번째 li-tag의미

//     // 비동기(ajax)
//     fetch("/chatting/enter?targetNo="+targetNo)
//     .then(response => response.text())
//     .then(chattingNo => {
//         console.log("chattingNo :");
//         console.log(chattingNo); // chattingNo

//         // 채팅방 목록 조회 (CHATTING_ROOM 테이블, ajax로 구현, 비동기)
//         selectRoomList(); // 

//         setTimeout(() =>{ // 바로 앞의 selectRoomList()에서 목록조회에 목록이 많으면 시간걸리기때문에 잠시 기다려준다.
//             // 존재하는 채팅방이 있으면 클릭해서 입장
//             const itemList = document.getElementsByClassName("chatting-item");

//             for(let item of itemList){

//                 // 목록에 채팅방이 존재한다면
//                 if (chattingNo == item.getAttribute("chat-no")) {
//                     // 팝업닫기
//                     addTargetPopupLayer.classList.toggle("popup-layer-close");

//                     // 검색어 삭제
//                     targetInput.value = "";

//                     // 사용자 검색 결과 삭제
//                     resultArea.innerText = "";

//                     // 해당 채팅방 클릭
//                     item.click(); // 해당요소 click해라 cf) item.focus() ==> 이걸로 li-tag의 "chat-no" 속성에서 chattingNo, "target-No"속성에서 TargetNo 값을 읽어와서 글로벌 변수에 세팅 세팅
//                     // ==> 이거 다시 위에서 li-tag에 추가한 li.addEventListener("click", chattingEnter); // chattingEnter: 채팅방 입장 함수
//                     // 를 실행시켜 무한루프에 들어가는거 아닐까? --> setTimeout()으로 ajax들 간의 비동기요청에 delay를 두는 것이 무한루프 막고 있는것 아닐까?
//                     return;
//                 }
//             }

//         }, 200); // 조회


//     })
//     .catch(e => console.log(e))
// }   







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
                // <img src="/resources/images/user.png">
                const img = document.createElement("img");
                img.setAttribute("src", selectTargetProfile);
               
                const div = document.createElement("div");


                // 상대 이름
                const b = document.createElement("b");
                b.innerText = selectTargetName; // 전역변수


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
const btnSendChatting = document.getElementById("btnSendChatting")

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



        //////////@@@@@@@@########
        // 이제 내가 보냈던 메세지를 LLM으로 보내는 부분을 여기에? 
        // 아니면 아래의 chatbotSock.onmessage = e=>{}에? (==> 요거는 무한루프될 가능성있는거 같음) 
        //
        // ==> 뭐 어쨋든... ajax POST request 여야 하지 않을까... message 문자열(query)가 짧다면 GET도 될수 있겠다.
        //////////@@@@@@@@########

        // 기존 메세지 내용 삭제 (초기화)
        inputChatting.value = "";

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


const inputChatting = document.getElementById("inputChatting");
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

            //////////@@@@@@@@########
            // 이제 내가 보냈던 메세지를 LLM으로 보내는 부분을 여기에? 
            // 혹은 sendMessage에 병렬로? 
            //////////@@@@@@@@########
           
        }else{ // 상대가 작성한 메세지인 경우
            li.classList.add("target-chat");
   
            // 상대 프로필
            // <img src="/resources/images/user.png">
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
    //selectRoomList();

}


