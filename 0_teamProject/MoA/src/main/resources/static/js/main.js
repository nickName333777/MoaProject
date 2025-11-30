let slideIndex = 0;
let slideTimer;

//showSlides();
// DOM이 다 만들어진 후 실행:   // mod on 2025/11/08 by PYY
window.addEventListener("DOMContentLoaded", showSlides);

// 계산식
function showSlides() {
  const slides = document.getElementsByClassName("banner-slide");
  const dots = document.getElementsByClassName("dot");

   // 슬라이드가 아예 없으면 함수 종료: added by PYY on 2025/11/08
  if (!slides || slides.length === 0) return; 

  // 기존 타이머 초기화: added by PYY on 2025/11/08
  clearTimeout(slideTimer);

  // 모든 슬라이드 숨기기
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // 인덱스 보정
  if (slideIndex > slides.length) {
    slideIndex = 1;
  } else if (slideIndex < 1) {
    slideIndex = slides.length;
  }

  // 모든 점 비활성화
  for (let i = 0; i < dots.length; i++) {
    dots[i].classList.remove("active");
  }

  // slides[slideIndex - 1].style.display = "block";
  // dots[slideIndex - 1].classList.add("active");
  // 인덱스 범위 확인 후 표시: mod on 2025/11/08 by PYY
  if (slides[slideIndex - 1]) {
    slides[slideIndex - 1].style.display = "block";
  }
  if (dots[slideIndex - 1]) {
    dots[slideIndex - 1].classList.add("active");
  }

  // 5초마다 자동 변경
  slideTimer = setTimeout(() => {
    slideIndex++;
    if (slideIndex > slides.length) {
      slideIndex = 1;
    }
    showSlides();
  }, 5000);
}

function plusSlides(n) {
  clearTimeout(slideTimer);
  const slides = document.getElementsByClassName("banner-slide");
  slideIndex += n;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  } else if (slideIndex < 1) {
    slideIndex = slides.length;
  }
  showSlides();
}

function currentSlide(n) {
  clearTimeout(slideTimer);
  slideIndex = n - 1;
  showSlides();
}
