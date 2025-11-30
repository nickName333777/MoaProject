package edu.og.moa.chatbot.model.websocket;

import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;

import edu.og.moa.chatbot.model.dto.Message;
import edu.og.moa.chatbot.model.service.ChatbotService;
import edu.og.moa.member.model.dto.Member;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ChatbotWebsocketHandler extends TextWebSocketHandler{
	// ==>  common/config/WebSocketConfig.java에 "/chatbotSock" 요청주소에 ChatbotWebsocketHandler 객체를 등록해주어야 함
	
	@Autowired
	private ChatbotService cbtService;
	

	// WebSocketSession : 클라이언트와 서버간 전이중 통신을 담당하는 객체
	// 클라이언트의 최초 웹소켓 요청 시 생성
	private Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());
	// synchronizedSet : 동기화된 Set 객체 반환 (HashSet은 기본적으로 비동기)
	// -> 멀티쓰레드 환경에서 하나의 컬렉션에 여러 쓰레드가 접근하여 의도치 않은 문제가 발생하지 않기 위해
	//    동기화를 진행하여 여러 쓰레드가 순서대로 한 컬렉션에 접근할 수 있게 변경

	// 클라이언트와 연결이 완료되고 통신할 준비가 되면 실행
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception { // (WebSocketSession: 클라이언트랑 통신 담당
		// 연결 요청이 접수되면 해당 클라이언트와 통신을 담당하는 WebSocketSession 객체가 전달되어 온다.
		// 클라이언트 누가 들어온지 기록
		
		// 이를 필드에 선언해둔 sessions에 저장/추가
		sessions.add(session);
		
		log.info("{}연결됨", session.getId()); // 중괄호안에 값이 들어가게 된다.
	}

	
	// 클라이언트로 부터 텍스트 메세지를 받았을 때 실행
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		// 전달 받은 내용은 JSON 형태의 String
		log.info("전달 받은 내용 : {}", message.getPayload()); // 전달받은 메세지  .getPayload()
		// 2025-09-10 11:41:01 [INFO] 전달 받은 내용 : {"senderNo":"2","targetNo":"9","chattingNo":"6","messageContent":"내일도 지각하지 않고 수업들으러 와야지^^!"}
		
		// objectMapper : Jackson에서 제공하는 객체
		// JSON 형태로 전달받은 String을 -> DTO Object에 담아준다 -> dto에서 보니 Message.java가 담을 수 있다.
		
		ObjectMapper objectMapper = new ObjectMapper(); // 위에 클래스필드로 선언가능: private final ObjectMapper objectMapper = new ObjectMapper()
		
		Message msg = objectMapper.readValue(message.getPayload(), Message.class); // 이제 전달받은 메세지와 기타필요 정보를 Message객체에 담았다.
		
		// Message 객체 확인
		log.info("Message : {}", msg); 
		// 2025-09-10 11:41:01 [INFO] Message : Message(messageNo=0, messageContent=내일도 지각하지 않고 수업들으러 와야지^^!, readFlag=null, senderNo=2, targetNo=9, chattingNo=6, sendTime=null)
		
		// DB에 메시지 삽입 서비스 호출
		int result = cbtService.insertMessage(msg);
		
		// 1:1 채팅에서는 보낸사람/받는사람한테만 메시지 보낸다
		if (result > 0) {
			
			// 메시지 send time도 보내줘야 함
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd hh:mm");
			msg.setSendTime(sdf.format(new Date()) );
			
			// 필드의 sessions에 접속중인 모든 회원의 세션 정보가 담겨 있음
			for(WebSocketSession s : sessions) { // 로그인한 사람, 상대방 번호
				
				// 가로챈 session 꺼내기
				HttpSession temp = (HttpSession)s.getAttributes().get("session");
				
				// 세션: 로그인회원 정보 있음
				// WebSocketSession은 HttpSession의 속성을 가로채서 똑같이 가지고 있기 때문에
				// 로그인한 회원의 정보를 나타내는 loginMember도 가지고 있음 -> loginMember 꺼내올 수 있다.
				
				// 로그인한 회원의 번호 얻어오기
				//int loginMemberNo = ((Member)s.getAttributes().get("loginMember")).getMemberNo(); // Object -> Member down-casting해서 memberNo 가져온다 (웹소켓 세션에서 가져오는 방법)
				int loginMemberNo = ((Member)temp.getAttribute("loginMember")).getMemberNo(); // Object -> Member down-casting해서 memberNo 가져온다 (웹소켓 세션에서 가져오는 방법)

				// 로그인 상태인 회원 중 targetNo 또는 senderNo가 일치하는 회원에게 메세지 전달
				if (loginMemberNo == msg.getTargetNo() || loginMemberNo == msg.getSenderNo()) {
					s.sendMessage(new TextMessage(new Gson().toJson(msg) ));  // Message 객체 -> JSON (-> TextMessage 객체로) 로 변환
					
				}
			}
			
			
			
			
		}
		
	}

	
	// 클라이언트와 연결이 종료되면 실행
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		// sessions에서 나간 클라이언트의 정보 제거
		sessions.remove(session);
	}	
	

}
