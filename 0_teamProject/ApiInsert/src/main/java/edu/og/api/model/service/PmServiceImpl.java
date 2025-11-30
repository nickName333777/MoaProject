package edu.og.api.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.og.api.model.dao.PmMapper;
import edu.og.api.model.dto.PerformanceBoard;
import edu.og.api.model.dto.PerformanceBoardImage;
import edu.og.api.model.dto.PerformanceBoardPrice;

@Service
public class PmServiceImpl implements PmService {

	@Autowired
	private PmMapper mapper;


	@Override
	public void insertTeamDB(PerformanceBoard dto) {
		
		// BOARD 저장
		mapper.insertBoard(dto);
		int boardNo = dto.getBoardNo();
		dto.setBoardNo(boardNo);

		
		// 공연 시설 중복 체크 → 없으면 새로 등록
		Integer houseNo = mapper.selectHouseNoDup(dto);
	    if (houseNo == null) {
	        mapper.insertPMHouse(dto);
	        houseNo = dto.getPmHouseNo();
	    }
	    dto.setPmHouseNo(houseNo);
		
	    // 공연정보 (PM)
	    
	    // 날짜 형식
		String startDate = null;
	    String endDate = null;
		
	    startDate = dto.getPmStartTime().substring(0, 10);
	    endDate = dto.getPmEndTime().substring(0, 10);
		
		dto.setPmStartTime(startDate);
	    dto.setPmEndTime(endDate);

	    
	    mapper.insertPM(dto);
	    
	    // 이미지 (BOARD_IMG)
	    for (PerformanceBoardImage img : dto.getPmImageList()) {
	        img.setBoardNo(boardNo);
	    }
	    
	    mapper.insertBoardImgList(dto.getPmImageList());
	    
	    // 가격 리스트
	    for (PerformanceBoardPrice price : dto.getPmPriceList()) {
	        price.setBoardNo(boardNo);
	    }
	    mapper.insertPmPriceList(dto.getPmPriceList());	
		
	}

}
