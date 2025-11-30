package edu.og.moa.chatbot.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.og.moa.chatbot.model.dao.ChatbotMapper;
import edu.og.moa.chatbot.model.dto.ChattingRoom;
import edu.og.moa.chatbot.model.dto.Message;
import edu.og.moa.chatting.model.dto.Messagekjy;
import edu.og.moa.common.utility.Util;
import edu.og.moa.member.model.dto.Member;

@Service
public class ChatbotServiceImpl implements ChatbotService{
	
	@Autowired
	private ChatbotMapper mapper;

	// 채팅 메세지 삽입
	@Override
	public int insertMessage(Message msg) {
		//XSS 방지 처리
		msg.setMessageContent(Util.XSSHandling(msg.getMessageContent() ) );
		
		return mapper.insertMessage(msg);
	}

	/////////////////////////////////////////////////////////
	// 챗봇 문의 관리  채팅방 목록 죄회
	@Override
	public List<ChattingRoom> selectRoomList(int memberNo) {
		return mapper.selectRoomList(memberNo);
	}

	// 챗봇 문의 관리 채팅 상대 조회
	@Override
	public List<Member> searchTargetList(Map<String, Object> map) {
		return mapper.selectTargetList(map);
	}

	// 챗봇 문의 관리 채팅방 입장 (기존 채팅방 조회해서 없으면 생성하고, 생성된 채팅방 번호 반환)
	@Override
	public int checkChattingNo(Map<String, Integer> map) {
		// 채팅방 번호 조회
		//int chattingNo = mapper.checkChattingNo(map);
		Integer chattingNo = mapper.checkChattingNo(map);
		// int result = chattingNo != null ? chattingNo : 0;
		
	    if (chattingNo != null) {
	        System.out.println("기존 채팅방 발견: " + chattingNo);
	        return chattingNo;
	    }
	    
	    System.out.println("기존 채팅방 존재하지 않음. 새 채팅방 생성 시작");
	    // 2. 없으면 새로 채팅방 생성
	    // selectKey로 map에 chattingNo가 세팅됨
	    chattingNo = mapper.createChattingRoom(map);
	    
	    int newChattingNo = 0;
	    if(chattingNo > 0) newChattingNo = map.get("chattingNo");   
	    System.out.println("생성된 채팅방 번호: " + newChattingNo);
	    
	    // 3. 두 명 모두 CHAT_MEMBER 테이블에 등록
	    Map<String, Object> param1 = new HashMap<>();
	    param1.put("chattingNo", newChattingNo);
	    param1.put("memberNo", map.get("loginMemberNo"));
	    int result1 = mapper.insertChatMember(param1);
	    System.out.println("멤버1 추가 결과: " + result1);
	    
	    Map<String, Object> param2 = new HashMap<>();
	    param2.put("chattingNo", newChattingNo);
	    param2.put("memberNo", map.get("targetNo"));
	    int result2 = mapper.insertChatMember(param2);
	    System.out.println("멤버2 추가 결과: " + result2);
	    
	    System.out.println("=== checkChattingNo 완료 (기존 채팅방 없어서 새로 생성)===");
	    return newChattingNo;		
		
		
	}

	// 챗봇 문의 관리 채팅 읽음 표시
	@Override
	public int updateReadFlag(Map<String, Object> paramMap) {
		return mapper.updateReadFlag(paramMap);
	}

	// 챗봇 문의 관리 채팅방 메시지 목록 조회
	@Override
	public List<Message> selectMessageList(Map<String, Object> paramMap) {
	    int chattingNo = Integer.parseInt(String.valueOf(paramMap.get("chattingNo")));
	    // String.valueOf : Object의 값을 String으로 변환; 값이 Null인 경우 'null'이라는 문자열로 처리
	    
	    // 수정: int로 바로 전달
	    List<Message> messageList = mapper.selectMessageList(chattingNo);
	    
	    return messageList;
	}

	// 전시 상세 AI 문의 채팅방 입장(채팅방조회해서 없이, 그냥 새 채팅방 생성하자)
	@Override
	public int genChattingNo4AI(Map<String, Integer> map) {
	    System.out.println("기존 채팅방 조회하지 않고,  새 채팅방 생성");
	    // 1. 새 채팅방 생성
	    // selectKey로 map에 chattingNo가 세팅됨
	    int chattingNo = mapper.createChattingRoom(map);
	    
	    if(chattingNo > 0) { 
	    	chattingNo = map.get("chattingNo");   
	    	System.out.println("생성된 채팅방 번호: " + chattingNo);
	    	
	    	// 3. 두 명 모두 CHAT_MEMBER 테이블에 등록
	    	Map<String, Object> param1 = new HashMap<>();
	    	param1.put("chattingNo", chattingNo);
	    	param1.put("memberNo", map.get("loginMemberNo"));
	    	int result1 = mapper.insertChatMember(param1);
	    	System.out.println("loginMemberNo 추가 결과: " + result1);
	    	
	    	Map<String, Object> param2 = new HashMap<>();
	    	param2.put("chattingNo", chattingNo);
	    	// AI챗봇문의의 경우 targetNo=11 고정
	    	param2.put("memberNo", map.get("targetNo")); 
	    	int result2 = mapper.insertChatMember(param2);
	    	System.out.println("챗봇(targetNo=11) 추가 결과: " + result2);
	    	
	    	System.out.println("=== 채팅방 생성 완료 ===");
	    	
	    } else {
	    	System.out.println("=== 채팅방 생성 실패!!! ===");
	    }
	    	
	    	
	    return chattingNo;	
	}

}
