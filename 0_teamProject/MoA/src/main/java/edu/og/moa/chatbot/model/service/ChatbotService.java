package edu.og.moa.chatbot.model.service;

import java.util.List;
import java.util.Map;

import edu.og.moa.chatbot.model.dto.ChattingRoom;
import edu.og.moa.chatbot.model.dto.Message;
import edu.og.moa.member.model.dto.Member;

public interface ChatbotService {

	
	/** 챗봇 문의 채팅메세지 삽입 (ChatbotWebsocketHandler.java에서 호출)
	 * @param msg
	 * @return result (성공한 행의 갯수)
	 */
	int insertMessage(Message msg);

	/////////////////////////////////////////////////////////
	/** 챗봇 문의 관리 채팅방 목록 조회
	 * @param memberNo
	 * @return roomList
	 */
	List<ChattingRoom> selectRoomList(int memberNo);

	
	/** 챗봇 문의 관리 채팅 상대 조회
	 * @param map
	 * @return memberList
	 */
	List<Member> searchTargetList(Map<String, Object> map);

	/** 챗봇 문의 관리 채팅방 입장 (기존 채팅방 조회해서 없으면 생성하고, 생성된 채팅방 번호 반환)
	 * @param map
	 * @return chattingNo
	 */
	int checkChattingNo(Map<String, Integer> map);

	/** 챗봇 문의 관리 채팅 읽음 표시
	 * @param paramMap
	 * @return result
	 */
	int updateReadFlag(Map<String, Object> paramMap);

	/** 챗봇 문의 관리 채팅방 메시지 목록 조회
	 * @param paramMap
	 * @return messageList
	 */
	List<Message> selectMessageList(Map<String, Object> paramMap);

	/** 전시 상세 AI 문의 채팅방 입장(채팅방조회해서 없이, 그냥 새 채팅방 생성하자)
	 * @param map
	 * @return chattingNoAI
	 */
	int genChattingNo4AI(Map<String, Integer> map);

}
