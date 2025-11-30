package edu.og.moa.chatbot.model.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import edu.og.moa.chatbot.model.dto.ChattingRoom;
import edu.og.moa.chatbot.model.dto.Message;
import edu.og.moa.member.model.dto.Member;


@Mapper
public interface ChatbotMapper {

	// 채팅 메시지 삽입
	public int insertMessage(Message msg);

	/////////////////////////////////////////////////////////
	// 챗봇 문의 관리  채팅방 목록 죄회
	public List<ChattingRoom> selectRoomList(int memberNo);

	// 챗봇 문의 관리 채팅 상대 조회
	public List<Member> selectTargetList(Map<String, Object> map);

	// 챗봇 문의 관리 채팅방 입장 (기존 채팅방 조회해서 없으면 생성하고, 생성된 채팅방 번호 반환)
	public Integer checkChattingNo(Map<String, Integer> map);

	// 챗봇 문의 관리 채팅방 입장 (기존 채팅방 조회해서 없으면 생성하고, 생성된 채팅방 번호 반환)
	public int createChattingRoom(Map<String, Integer> map);
	
	// 챗봇 문의 관리 채팅방 입장 (생성된 채팅방 번호로 참여멤버들 등록))
	public int insertChatMember(Map<String, Object> param1);

	// 챗봇 문의 관리 채팅 읽음 표시
	public int updateReadFlag(Map<String, Object> paramMap);

	// 챗봇 문의 관리 채팅방 메시지 목록 조회
	public List<Message> selectMessageList(int chattingNo);

}
