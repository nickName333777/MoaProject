package edu.og.api.model.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PerformanceBoard {
	
	private int boardNo;
	private String boardTitle;
	private int boardCount;
	private String bCreateDate;
	
	
	// 공연
	private String pmStartTime;
	private String pmEndTime;
	private String pmPlaytime;
	private int pmHouseNo;
	private int genreNo;
	
	// 공연 시설
	private String pmHouseName;
	private String pmHouseAddress;
	private double pmHouseLat;
	private double pmHouseLong;
	private String pmHouseWebsite;
	private String pmHouseHome;

	// 장르
	private int GenreNo;
	private String GenreName;

	// 좌석 정보
	private String pmPriceType;
	private String pmPrice;
	
	private String poster;
	private int commentCount;
	
	private List<PerformanceBoardImage> pmImageList;
	
	private List<PerformanceBoardPrice> pmPriceList;
	
	
	private List<PerformanceComment> pmCommentList;
	
	// 공연 APi 용 ID들
	private String mt20id;
	private String mt10id;
	
	// 임시 공연 좌석
	private String pcseguidance;
	// 임시 이미지
	private List<String> styurls;
}
