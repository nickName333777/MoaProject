package edu.og.moa.chatbot.controller;


import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import edu.og.moa.chatbot.model.dto.ChattingRoom;
import edu.og.moa.chatbot.model.dto.Message;
import edu.og.moa.chatbot.model.service.ChatbotService;
import edu.og.moa.member.model.dto.Member;
import edu.og.moa.board.exhibition.model.dto.JsonMember;
import lombok.extern.slf4j.Slf4j;



@RequestMapping("/chatbot")
@Controller
@Slf4j
@SessionAttributes("loginMember") 
public class ChatbotController {

	//@Autowired
	//private ChattingService service;
	
	@Autowired
	private ChatbotService cbtService;
	
	
//	@GetMapping("/chatbotJSGET")  // exhibitionDetail.js에서 챗봇버튼 클릭시 location.href = '/chatbot/jsonChatbot'로  클라이언트(브라우저) 측 redirect(Get 요청)
//	//@GetMapping("/chatbot")  
//	public String chatbotJSGET( Model model	
//			, @RequestParam Map<String, Object> paramMap 
//			
//			) throws IOException {
//		
//		
//		// 1) 기본적으로 테스트를 위해 프론트로 넘겨줄 loginMember mock 기본값
//		JsonMember loginMember = new JsonMember();
//		loginMember.setMemberNickname("한국문화정보원");
//		loginMember.setProfileImage("/images/board/exhibition/member/penguin.jpeg"); 
//		loginMember.setMemberNo(3); // 임의할당 for testing
//		model.addAttribute("loginMember", loginMember); 
//    	
//    	// 2) boardCode 값 mock
//		//model.addAttribute("exhibitionCode", 3);  //boardCode === exhibitionCode === communityCode
//		model.addAttribute("communityCode", 3);  //boardCode === exhibitionCode === communityCode
//		model.addAttribute("exhibitionName", "전시게시판");  //boardName === exhibitionName === communityName
//		
//		
//		// 3) roomList mock
//		List<ChattingRoom> roomList = new ArrayList<>();
//		ChattingRoom chattingRoom = new ChattingRoom();
//		
//		// mock value setting
//		chattingRoom.setChattingNo(10);
//		chattingRoom.setLastMessage("머라는 거야?");
//		chattingRoom.setSendTime("2025-10-07 16:49:30");
//		chattingRoom.setTargetNo(11); //  나챗봇 회원번호
//		chattingRoom.setTargetNickName("나챗봇");
//		chattingRoom.setTargetProfile("/images/member/chatbot01.jpg");
//		chattingRoom.setNotReadCount(7);
//		roomList.add(chattingRoom);
//		
//		model.addAttribute("roomList", roomList);
//		// 4) messageList mock
//		//Map<String, Object> paramMap = new HashMap<>();
//		List<Message> messageList =  new ArrayList<>();
//		Message message = new Message();
//		// mock value setting
//		message.setMessageNo(1000);
//		message.setMessageContent("이건 대화 컨텍스트 세팅이에요");
//		message.setReadFlag("Y");
//		message.setSenderNo(3); // 나 전시게시판 "한국문화정보원"이야...
//		message.setTargetNo(11); // 너 챗봇이야?
//		message.setChattingNo(10);
//		message.setSendTime("2025-10-07 18:00:30");
//		messageList.add(message);
//		
//		model.addAttribute("messageList", messageList);
//		
//		return "chatbot/chatbot";
//	}	
//	
	
	
	// 전시상세조회에서 챗봇선택시 전시상세정보 데이터 가지고 챗봇화면으로 넘어가기위함 ==> ok. 2025/11/02
	@PostMapping("/chatbotContextData")  
	public String chatbotContextData( @RequestParam("exhibitionToString") String exhibitionToString,
            RedirectAttributes ra
			
			) throws IOException {
	
		// 1) exhibitionToString 정보챗봇창에 제공
         // 필요 시 Controller에서 추가 가공 가능
        //String exhibitionToString = exhibitionToString + "\n<!-- Moved to /B -->";
		ra.addFlashAttribute("exhibitionToString", exhibitionToString);

        // 2) exhibitionToString을 MESSAGE DB 에 첫번/째 데이터로 insert ==> to-do list
        
        return "redirect:jsonChatbot";
		
	}
	
		
	@GetMapping("/jsonChatbot")  
	//@GetMapping("/chatbot")  
	public String jsonChatbot( Model model	
			, @SessionAttribute("loginMember") Member loginMember
			, @RequestParam Map<String, Object> paramMap 
			
			) throws IOException {
		
		
//		// 1) 기본적으로 테스트를 위해 프론트로 넘겨줄 loginMember mock 기본값
//		JsonMember loginMember = new JsonMember();
//		loginMember.setMemberNickname("한국문화정보원");
//		loginMember.setProfileImage("/images/board/exhibition/member/penguin.jpeg"); 
//		loginMember.setMemberNo(3); // 임의할당 for testing
//		model.addAttribute("loginMember", loginMember); 
//    	
//    	// 2) boardCode 값 mock
//		//model.addAttribute("exhibitionCode", 3);  //boardCode === exhibitionCode === communityCode
//		model.addAttribute("communityCode", 3);  //boardCode === exhibitionCode === communityCode
//		model.addAttribute("exhibitionName", "전시게시판");  //boardName === exhibitionName === communityName
		
		
		// 3) roomList mock ===>챗봇의 경우 roomList필요없다.
		List<ChattingRoom> roomList = new ArrayList<>();
		ChattingRoom chattingRoom = new ChattingRoom();
		
		// mock value setting
		chattingRoom.setChattingNo(10);
		chattingRoom.setLastMessage("머라는 거야?");
		chattingRoom.setSendTime("2025-10-07 16:49:30");
		chattingRoom.setTargetNo(11); //  나챗봇 회원번호
		chattingRoom.setTargetNickName("나챗봇");
		chattingRoom.setTargetProfile("/images/member/chatbot01.jpg");
		chattingRoom.setNotReadCount(7);
		roomList.add(chattingRoom);
		
		model.addAttribute("roomList", roomList);
		
		
		// 4) messageList mock ==>  챗봇의 경우 기존 채팅방 조회 없이 새채팅방 생성할 것이므로 messageList 조회도 필요없지만, 메시지 제일 처음을 context로 기본세팅한다면, 이건 고려 필요.
		//Map<String, Object> paramMap = new HashMap<>();
		List<Message> messageList =  new ArrayList<>();
		Message message = new Message();
		// mock value setting
		message.setMessageNo(1000);
		message.setMessageContent("이건 대화 컨텍스트 세팅이에요");
		message.setReadFlag("Y");
		message.setSenderNo(3); // 나 전시게시판 "한국문화정보원"이야...
		message.setTargetNo(11); // 너 챗봇이야?
		message.setChattingNo(10);
		message.setSendTime("2025-10-07 18:00:30");
		messageList.add(message);
		
		model.addAttribute("messageList", messageList);
		
		return "chatbot/chatbot";	
	}
	
	// 챗봇의경우 chattingNo 생성하기 ajax GET 요청 처리
	@GetMapping("/genChattingNo")
	@ResponseBody
	public int chatbotChattingNo( int targetNo
			,@SessionAttribute("loginMember") Member loginMember
			) {
		
		Map<String, Integer> map = new HashMap<String, Integer>();
		targetNo = 11; // AI 챗봇 문의의 경우 targetNo =11 로 고정 for 챗봇
		map.put("targetNo", targetNo); 
		map.put("loginMemberNo",loginMember.getMemberNo() );
		
		// 해야할 것은
		// 1. CHATTING_ROOM 테이블에 CHATTING_NO얻어오고
		// 2. CHAT_MEMBER 테이블에 CHATTING_NO와 MEMBER_NO복합키로입력( 회원 & 챗봇)
		////// ==> 이건 나중에 채팅 메시지 주고받을때:  3. CHATTING_MESSAGE 테이블에 챗봇과의 채팅메세지 입력
		//// 기존 채팅방 있는지 조회하지 않고 새 채팅방 생성하여 진행하는 경우
		//int chattingNo = cbtService.genChattingNo4AI(map);
		//// 기존 채팅방 있는지 조회하여, 있으면 그거 쓰고, 없으면 새 채팅방 생성하여 진행하는 경우
		int chattingNo = cbtService.checkChattingNo(map);
		
		return chattingNo;
	}
	
	////////////////////////////////////////////////////////////////////////////////	
	////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////	
	////////////////////////////////////////////////////////////////////////////////
	// 챗봇 Manager 페이지 전환 (챗봇이 챗봇관리자, on 2025/11/07))
	@GetMapping("/manager/chatbot")
	public String chatting(@SessionAttribute("loginMember") Member loginMember
			, Model model // "forward"할때 데이터 전달할 데이터 전달 객체
			) {
		
		// 채팅방 목록 조회
		List<ChattingRoom> roomList = cbtService.selectRoomList(loginMember.getMemberNo());
		
		model.addAttribute("roomList", roomList); // forward시 데이터 전달 객체(model 객체는 page scope 아니라 request scope에 세팅)
		
		return "chatbot/chatbotManager"; // view resolver가 처리할 요청주소 문자열
	}	
	
	// 챗봇 문의 관리 채팅 상대 검색
	@GetMapping(value="/manager/selectTarget", produces="application/json; charset=UTF-8") // 요청주소 보내는 곳에서 요청 주소 받아서 처리하는 곳
												// 한글 깨짐 방지 처리
	@ResponseBody
	public List<Member> searchTargetList(/*@RequestParam*/ String query
			//, @RequestParam Map<String, Object> paramMap 
			,  @SessionAttribute("loginMember") Member loginMember
		){
		
        Map<String, Object> map = new HashMap<>(); // query와 loginMember 같이 담겨있는 DTO가 없기때문에 Map에 담아 DAO전달(입력변수 한개만 가능하므로 DTO 또는 Map이되어야함)
        map.put("memberNo", loginMember.getMemberNo());
        map.put("query", query);
        
		//List<ChattingRoom> targetList = service.searchTargetList(map);
		List<Member> targetList = cbtService.searchTargetList(map);
		
		//Log.info(targetList); // JS에서 
		return targetList;
	}
	
	
	// 챗봇 문의 관리 채팅방 입장 (기존 채팅방 조회해서 없으면 생성하고, 생성된 채팅방 번호 반환)
	@GetMapping("/manager/enter") // 조회결과에 한글없으므로 한글깨짐 방지 불필요
	@ResponseBody
	public int chattingEnter(int targetNo // targetNo는  searchTargetList()에서 선택해서 가져오는 값
			,@SessionAttribute("loginMember") Member loginMember
			) {
		
		Map<String, Integer> map = new HashMap<String, Integer>();
		map.put("targetNo", targetNo);
		map.put("loginMemberNo", loginMember.getMemberNo());
		
		int  chattingNo = cbtService.checkChattingNo(map);
		
		return chattingNo;
	}
	
	
	// 챗봇 문의 관리 채팅방 목록 조회 ==> 비동기(ajax)조회
	// List<ChattingRoom> roomList = service.selectRoomList(loginMember.getMemberNo());
	@GetMapping(value="/manager/roomList", produces ="application/json; charset=UTF-8") // 채팅방목록 한글깨짐방지 추가
	@ResponseBody
	public List<ChattingRoom> selectRoomList(@SessionAttribute("loginMember") Member loginMember){
		//System.out.println("test");
		return  cbtService.selectRoomList(loginMember.getMemberNo());
	}
	
	
	//  챗봇 문의 관리 채팅방 목록에서 메세지 읽음 처리 (update)
	// 채팅방 읽음 표시
	@PutMapping("/manager/updateReadFlag")
	@ResponseBody
	public int updateReadFlag(@RequestBody Map<String, Object> paramMap ) {
		//System.out.println("test");
		int result = cbtService.updateReadFlag(paramMap);
		return result;
	}
	
	//  챗봇 문의 관리  비동기로(ajax-GET) 채팅방 메세지 목록을 조회
	@GetMapping(value="/manager/selectMessageList", produces="application/json; charset=UTF-8")
	@ResponseBody
	public List<Message> selectMessageList(
			@RequestParam Map<String, Object> paramMap
			//@RequestBody Map<String, Object> paramMap // -> POST 요청
			){
		System.out.println("메시지 목록 조회 test");
		List<Message> messageList = cbtService.selectMessageList(paramMap);
		
		return messageList;
	}	
	
}

