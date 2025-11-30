console.log("exhibitionDetail.js loaded...");



// ----------------------------------
// 게시글 버튼 수정 클릭시
if (document.getElementById("updateBtn") != null){ 
    document.getElementById("updateBtn").addEventListener("click", ()=>{

        location.href = location.pathname.replace('board', 'board2') + '/update' + location.search; // location.search = '?cp=1'
        
    })
}


// ---------------------------------
// 게시글 삭제 버튼이 클릭 되었을 때
document.getElementById("deleteBtn")?.addEventListener("click", ()=>{

    console.log("deleteBtn clicked... ")

    if(confirm("정말 삭제 하시겠습니까?")) {

        location.href = location.pathname.replace('board', 'board2') + "/delete";

    }
})


// -----------------------------------------------------------
// 목록으로
const goToListBtn = document.getElementById("goToListBtn");

goToListBtn.addEventListener("click", ()=>{

    console.log("goToListBtn clicked... ")

    const params = new URL(location.href).searchParams;
    console.log("params : " + params);

    let url;
    if (params.get("key") == 'all') { // header의 통합 검색 일때 (Not Used here)
        url = "/board/search";
    } else {
        url = '/board/' + communityCode; // 목록으로; communityCode는 전역변수
    }

    location.href = url + location.search; // location.search: search 있으면 있는 대로, 없으면 없는대로

})


// // -----------------------------------------------------------
// // 챗봇화면으로 전환 ==> JS로 화면 전환에서 form submit으로 바꿈 2025/11/02
//////////////////////

// const chatbotBtn = document.getElementById("chatbotBtn");

// chatbotBtn.addEventListener("click", ()=>{

//     console.log("chatbotBtn clicked... ")

//     location.href = '/chatbot/jsonChatbot' // “새 URL /chatbot/jsonChatbot 로 이동하라 (페이지 새로고침)”
//                                            // html 관점: location.href는 항상 GET 요청을 발생시킴 ((forward 아님))
//                                            // Spring 쪽에서는 단순히 GET 요청이 들어온 것처럼 동작: @GetMapping 으로 처리해야 함
//     // location.href = "..." → 브라우저가 새 GET 요청을 보내므로, Redirect 효과이며 @GetMapping으로 처리해야 한다
// })

// ✅ forward vs redirect 차이 요약
// 구분	        Forward	                      Redirect
// 실행 주체     서버(Spring)	                클라이언트(브라우저)
// HTTP 요청 수	 1회 (같은 요청 내부 이동)         2회 (새 요청 발생)
// URL 변화	    안 바뀜	                        바뀜
// 브라우저 입장  같은 요청 안에서 다른 뷰로 포워딩	   완전히 새 요청
// 예시 코드	 return "forward:/other";	   return "redirect:/other";
//
//
// JS location.href	❌ Forward 아님 → Redirect 와 동일한 효과	
// 즉, location.href는 클라이언트 측 redirect 에 해당(Get 요청)합니다.
// (서버가 아닌 브라우저가 새로운 요청을 보냄)

// -----------------------------------------------------------
// 챗봇관리화면으로 전환 ==> JS로 화면 전환
////////////////////

const chatbotManagerBtn = document.getElementById("chatbotManagerBtn");

chatbotManagerBtn.addEventListener("click", ()=>{

    console.log("chatbotManagerBtn clicked... ")

    location.href = '/chatbot/manager/chatbot' // “새 URL /chatbot/manager/chatbot으로 이동하라 (페이지 새로고침)”
                                           // html 관점: location.href는 항상 GET 요청을 발생시킴 ((forward 아님))
                                           // Spring 쪽에서는 단순히 GET 요청이 들어온 것처럼 동작: @GetMapping 으로 처리해야 함
    // location.href = "..." → 브라우저가 새 GET 요청을 보내므로, Redirect 효과이며 @GetMapping으로 처리해야 한다
})