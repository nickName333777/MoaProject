package edu.og.api.controller;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;

import edu.og.api.model.dto.PerformanceBoard;
import edu.og.api.model.dto.PerformanceBoardImage;
import edu.og.api.model.dto.PerformanceBoardPrice;
import edu.og.api.model.service.PmService;
import lombok.extern.slf4j.Slf4j;

@PropertySource("classpath:/config.properties")
@Slf4j
@Controller
public class MainController {

	@Value("${api.serviceKey}")
	private String serviceKey;
	
	@Autowired
	private PmService service;
	
	@GetMapping("/")
	public String main() {
		return "default";
	}
	
	@GetMapping("/id")
	public String mainPage (
			Model model
			) {
		String url ="http://www.kopis.or.kr/openApi/restful/pblprfr";
		
		String returnType = "xml";
		int stdate = 20251001; // 조회 시작날짜
		int eddate = 20261231; // 조회 범위
		int cpage = 1; // 가져올 페이지
		int rows = 100; // 페이지당 공연 개수
		
		UriComponentsBuilder uriBuilder 
			= UriComponentsBuilder.fromHttpUrl(url) 
				.queryParam("service", serviceKey)
				.queryParam("stdate", stdate)
				.queryParam("eddate", eddate)
				.queryParam("cpage", cpage)
				.queryParam("rows", rows);
		
		String uriString = uriBuilder.build().toUriString();
		log.debug("uriString : {}", uriString);
		
		HttpHeaders headers = new HttpHeaders();
		headers.set("Accept", "application/xml");
		
		HttpEntity<String> entity = new HttpEntity<>(headers);
		
		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getMessageConverters().add(0, new StringHttpMessageConverter(StandardCharsets.UTF_8));
		
		try {
			
			ResponseEntity<String> resp 
				= restTemplate.exchange(
						uriString,
						HttpMethod.GET,
						entity,
						String.class);
			
			String responseBody = resp.getBody();
			
			log.debug("responseBody : {}", responseBody);
			
			
			XmlMapper xmlMapper = new XmlMapper();
			
			String xml = resp.getBody();
			
			JsonNode root = xmlMapper.readTree(xml);
			JsonNode dbList = root.path("db");
			
			List<PerformanceBoard> idList = new ArrayList<>();
			
			for (JsonNode node : dbList) {
				
				PerformanceBoard dto = new PerformanceBoard();
				dto.setMt20id(node.path("mt20id").asText());
				idList.add(dto);
			}
			
			updatePmDetail(idList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "redirect:/default";
	}
	
	@ResponseBody
	public void updatePmDetail(List<PerformanceBoard> idList) {

		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getMessageConverters().add(0, 
				new StringHttpMessageConverter(StandardCharsets.UTF_8));
		
		List<PerformanceBoard> detailList = new ArrayList<>();
		
		
		int total = idList.size();
		int count  = 0;
		
		// id 갯수만큼 반복
		for (PerformanceBoard dt : idList) {
			
			String mt20id = dt.getMt20id();
			
			try {
				
				String url = "https://kopis.or.kr/openApi/restful/pblprfr/"
						+ mt20id;

				String returnType = "xml";
				
				UriComponentsBuilder uriBuilder 
				= UriComponentsBuilder.fromHttpUrl(url)
					.queryParam("service", serviceKey);
				
				String uriString = uriBuilder.build().toUriString();
				
				HttpHeaders headers = new HttpHeaders();
				headers.set("Accept", "application/xml");
				
				HttpEntity<String> entity = new HttpEntity<>(headers);
				
				ResponseEntity<String> resp 
				= restTemplate.exchange(
						uriString,
						HttpMethod.GET,
						entity,
						String.class);
				String responseBody = resp.getBody();
				
				XmlMapper xmlMapper = new XmlMapper();
				
				String xml = resp.getBody();
				
				JsonNode root = xmlMapper.readTree(xml);
				JsonNode dbNode = root.path("db");
				
				PerformanceBoard dto  = new PerformanceBoard();
				
				dto.setMt20id(mt20id);
				dto.setBoardTitle(dbNode.path("prfnm").asText()); // 공연 ID (APi 용)
				dto.setPmStartTime(dbNode.path("prfpdfrom").asText()); // 공연시작일
                dto.setPmEndTime(dbNode.path("prfpdto").asText()); // 공연 종료일
                dto.setPmHouseName(dbNode.path("fcltynm").asText()); // 공연 시설명
                dto.setPmPlaytime(dbNode.path("prfruntime").asText()); // 공연 시간 (상영시간)
                dto.setPcseguidance(dbNode.path("pcseguidance").asText()); // 좌석 종류 + 가격 여러개 (한줄로 옴)
                dto.setGenreName(dbNode.path("genrenm").asText()); // 공연 장르명
                dto.setBCreateDate(dbNode.path("updatedate").asText()); // 공연 등록일( 작성일)
                dto.setMt10id(dbNode.path("mt10id").asText()); // 공연 시설 ID (API용)
                
                dto.setPoster(dbNode.path("poster").asText()); // 타이틀 포스터 (썸네일 포스터?)
                
                List<String> styurlList = new ArrayList<>();
                JsonNode styurlNodes = dbNode.path("styurls").path("styurl"); // 포스터들 (1~ 여러개)

                dto.setStyurls(styurlList);
                
                String createDate = dto.getBCreateDate();
                if (createDate != null && createDate.contains(".")) {

                    createDate = createDate.substring(0, createDate.indexOf("."));

                    createDate = createDate.replace("-", ".");
                    dto.setBCreateDate(createDate);
                }
                
                List<PerformanceBoardImage> imgList = new ArrayList<>();
                int order = 0;
                
                PerformanceBoardImage mainImg = new PerformanceBoardImage();
                mainImg.setImgPath(dbNode.path("poster").asText());
                mainImg.setImgOrder(order++);
                imgList.add(mainImg);
                
                if (styurlNodes.isArray()) {
                	
                    for (JsonNode node : styurlNodes) {
             
                    	PerformanceBoardImage img = new PerformanceBoardImage();
                        img.setImgPath(node.asText());
                        img.setImgOrder(order++);
                        imgList.add(img);
                    }
                } else if (!styurlNodes.isMissingNode()) {
                	 PerformanceBoardImage img = new PerformanceBoardImage();
                	    img.setImgPath(styurlNodes.asText());
                	    img.setImgOrder(order++);
                	    imgList.add(img);
                }
                
                dto.setPmImageList(imgList);
                
                List<PerformanceBoardPrice> priceList = new ArrayList<>();

                String[] entries = dto.getPcseguidance().split(",\\s*");
                for (String ent : entries) {
                	
                	
                	 if (ent.contains("무료")) {
                	        PerformanceBoardPrice priceDto = new PerformanceBoardPrice();
                	        priceDto.setPmPriceType("전석");
                	        priceDto.setPmPrice(0);
                	        priceList.add(priceDto);
                	        continue;
                	    }

                    int firstSpace = ent.indexOf(' ');
                    if (firstSpace == -1) continue;

                    String type = ent.substring(0, firstSpace).trim();
                    String priceText = ent.substring(firstSpace + 1).trim();
                    String price = priceText.replaceAll("[^0-9]", "");

                    try {
                        PerformanceBoardPrice priceDto = new PerformanceBoardPrice();
                        priceDto.setPmPriceType(type);
                        priceDto.setPmPrice(Integer.parseInt(price)*1000);
                        priceList.add(priceDto);
                    } catch (Exception e) {
                        log.warn("가격 파싱 실패: {}", ent);
                    }
                }

                dto.setPmPriceList(priceList);

                detailList.add(dto);
               
                Thread.sleep(150);
                
                
                
			} catch (Exception e) {
				e.printStackTrace();
			}
			
		} //for문 종료
		
		updatePmHouse(detailList);
	}
	
	

	public void updatePmHouse(List<PerformanceBoard> detailList) {
		
		
		RestTemplate restTemplate = new RestTemplate();
		restTemplate.getMessageConverters().add(0, 
				new StringHttpMessageConverter(StandardCharsets.UTF_8));
		
		
		int total = detailList.size();
		int count  = 0;
		
		for (PerformanceBoard dto : detailList) {
		
			String mt10id = dto.getMt10id();
			try {
				
				String url = "http://kopis.or.kr/openApi/restful/prfplc/"
						+ mt10id;
				
				
				String returnType = "xml";
				
				UriComponentsBuilder uriBuilder 
				= UriComponentsBuilder.fromHttpUrl(url)
					.queryParam("service", serviceKey);
				
				String uriString = uriBuilder.build().toUriString();
				
				HttpHeaders headers = new HttpHeaders();
				headers.set("Accept", "application/xml");
				
				HttpEntity<String> entity = new HttpEntity<>(headers);
				
				ResponseEntity<String> resp 
				= restTemplate.exchange(
						uriString,
						HttpMethod.GET,
						entity,
						String.class);
				String responseBody = resp.getBody();
							
				
				XmlMapper xmlMapper = new XmlMapper();
				
				String xml = resp.getBody();
				
				JsonNode root = xmlMapper.readTree(xml);
				JsonNode dbNode = root.path("db");
				
	            dto.setPmHouseName(dbNode.path("fcltynm").asText());
	            dto.setPmHouseHome(dbNode.path("telno").asText());
	            dto.setPmHouseWebsite(dbNode.path("relateurl").asText());
	            dto.setPmHouseAddress(dbNode.path("adres").asText());
				dto.setPmHouseLat(Double.parseDouble(dbNode.path("la").asText())); // 위도
				dto.setPmHouseLong(Double.parseDouble(dbNode.path("lo").asText())); // 위도

				Thread.sleep(200);
				
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
		insert(detailList);
	}
	
	
	public void insert(List<PerformanceBoard> detailList) {
		
		int count = 0;
		
		for (PerformanceBoard dto : detailList) {
			
			log.info("정보{}", dto);
			
			
			service.insertTeamDB(dto);
			
			count++;
			log.debug("{}개 완료", count);
			
		    try {
		        Thread.sleep(100);
		    } catch (InterruptedException e) {
		        Thread.currentThread().interrupt();
		    }
			
			
		}
		
		log.info("총 {}개 공연 DB 삽입 완료", count);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
