document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".LargestUniversityWidget_section__Fz8gj");
  if (!section) return;

  const wrapper = section.querySelector(".swiper-wrapper");
  const slides = section.querySelectorAll(".swiper-slide");
  const prevBtn = section.querySelector(".swiper_navs_prev");
  const nextBtn = section.querySelector(".swiper_navs_next");

  if (!wrapper || !slides.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  
  const updateSlider = () => {
    // Calculate width to slide including margin
    const slideStyle = window.getComputedStyle(slides[0]);
    const margin = parseFloat(slideStyle.marginRight) || 0;
    const slideWidth = slides[0].offsetWidth + margin;

    // Calculate how many slides can fit in the visible container
    const containerWidth = section.querySelector(".swiper").offsetWidth;
    const slidesVisible = Math.max(1, Math.floor(containerWidth / slideWidth));
    
    // The maximum index we can scroll to before exposing empty space
    const maxIndex = Math.max(0, slides.length - slidesVisible);

    // Bound current index
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const offset = currentIndex * slideWidth;
    wrapper.style.transitionDuration = "400ms";
    wrapper.style.transform = `translate3d(-${offset}px, 0px, 0px)`;

    // Update button states
    if (currentIndex === 0) {
      prevBtn.classList.add("swiper-button-disabled");
    } else {
      prevBtn.classList.remove("swiper-button-disabled");
    }

    if (currentIndex >= maxIndex) {
      nextBtn.classList.add("swiper-button-disabled");
    } else {
      nextBtn.classList.remove("swiper-button-disabled");
    }
    
    // Update active class for slides
    slides.forEach((slide, idx) => {
        slide.classList.remove("swiper-slide-active", "swiper-slide-next", "swiper-slide-prev");
        if (idx === currentIndex) slide.classList.add("swiper-slide-active");
        if (idx === currentIndex + 1) slide.classList.add("swiper-slide-next");
        if (idx === currentIndex - 1) slide.classList.add("swiper-slide-prev");
    });
  };

  nextBtn.addEventListener("click", () => {
    currentIndex++;
    updateSlider();
  });

  prevBtn.addEventListener("click", () => {
    currentIndex--;
    updateSlider();
  });

  // Re-calculate slider bounds when window is resized
  window.addEventListener("resize", updateSlider);
  updateSlider();
});
