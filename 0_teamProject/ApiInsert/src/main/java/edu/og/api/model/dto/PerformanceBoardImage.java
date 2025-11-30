package edu.og.api.model.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PerformanceBoardImage {

	private int imgNo;
	private String imgPath;
	private int imgOrder;
	private int boardNo;
}
