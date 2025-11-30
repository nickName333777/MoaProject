package edu.og.api.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import edu.og.api.model.dto.PerformanceBoard;
import edu.og.api.model.dto.PerformanceBoardImage;
import edu.og.api.model.dto.PerformanceBoardPrice;

@Mapper
public interface PmMapper {

	// 공연 정보 삽입 (BOARD)
	int insertBoard(PerformanceBoard dto);
	
	// 중복 시설 번호 조회
	Integer selectHouseNoDup(PerformanceBoard ddd);

	// 공연 시설 정보 삽입
	void insertPMHouse(PerformanceBoard dto);

	// 공연 정보 삽입 (PM)
	void insertPM(PerformanceBoard dto);

	// 이미지 리스트 삽입
	void insertBoardImgList(List<PerformanceBoardImage> imgList);

	
	// 가격 리스트 삽입
	void insertPmPriceList(List<PerformanceBoardPrice> priceList);
	

	
	
	
}
