# MoA 프로젝트

KDT  빅데이터 분석 & Java 웹개발 과정 중간 프로젝트

- 동기: 지역 외 이용자와 입문자들이 공연·전시 정보를 충분히 얻기 어렵고, 후기 기능도 미흡한 기존 안내·예매 사이트의 한계를 개선하고자 한다.<br>

- 목표: 다양한 지역의 공연·전시 정보를 쉽게 탐색하고(Easy), 조건별로 상세히 확인하며(Various), 사진과 블로그형 후기로 생생한 경험을 공유할 수 있는 유용한 플랫폼을 구축한다(Useful).<br>

- 프로젝트명:  MoA  공연/전시 웹사이트 제작 프로젝트<br>

- 수행 기간: 25.09.24 ~ 25.10.20 (1개월)<br>

- 수행 인원: 총 5명이 회원가입, 공연게시판, 전시게시판, 커뮤니티(자유게시판, 리뷰게시판, 만남의광장), 고객센터, 마이페이지 등을 5명이 각각 나눠 맡아, 맡은 부분의 frontend&backend 구현. <br>

- 개발환경(사용도구/언어): HTML, CSS, JS, VSCODE, Docker, STS4 IDE, Spring Boot, Oracle, Figma, Github, Java, Python <br>

- **담당 역할: 전시게시판을 담당 - 공공 데이터를 수집하여 전시 DB구축하고, 전시게시판 전시목록/상세조회/새글작성/수정/삭제 CRUD 구현.** <br>

< 예시: 전시 게시글 목록 조회 ><br>
<img width="602" height="835" alt="image" src="https://github.com/user-attachments/assets/55aa107a-a844-499e-9e8c-b134755ce259" />


<예시: 전시 게시글 상세 조회 ><br>
<img width="614" height="720" alt="image" src="https://github.com/user-attachments/assets/1c72b900-d785-4a9e-be92-5879a5e35cf2" />


< 전시DB 생성 ><br>
1. Oracle DB 사용자 계정 설정<br>
2. MoA_team_integRev_20251018.sql 실행<br>
3. 앱 실행 후 주소창에 요청주소 “localhost:9091/board/exhibition/jsonToDatabaseInsert” 입력 후 Enter.<br>

