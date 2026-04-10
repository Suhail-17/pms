document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".ShortCourseStaffTaught_section__hJrE8");
  if (!section) return;

  const wrapper = section.querySelector(".swiper-wrapper");
  const slides = section.querySelectorAll(".swiper-slide");
  const prevBtn = section.querySelector(".featured-swiper-slide-prev");
  const nextBtn = section.querySelector(".featured-swiper-slide-next");

  if (!wrapper || !slides.length || !prevBtn || !nextBtn) return;

  let currentIndex = 0;
  
  const updateSlider = () => {
    // Calculate slide width including margins
    const slideStyle = window.getComputedStyle(slides[0]);
    const margin = parseFloat(slideStyle.marginRight) || 0;
    const slideWidth = slides[0].offsetWidth + margin;

    // Estimate max steps assuming wrapper container bounds
    // Because this slide uses large 850px items, it usually only shows 1 fully
    const containerWidth = section.querySelector(".swiper").offsetWidth;
    const slidesVisible = Math.max(1, Math.floor(containerWidth / slideWidth));
    const maxIndex = Math.max(0, slides.length - slidesVisible);

    // Enforce bounds
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    const offset = currentIndex * slideWidth;
    wrapper.style.transitionDuration = "400ms";
    wrapper.style.transform = `translate3d(-${offset}px, 0px, 0px)`;

    // Toggle button UI constraints
    if (currentIndex === 0) {
      prevBtn.classList.add("swiper-button-disabled");
      prevBtn.setAttribute("disabled", "true");
    } else {
      prevBtn.classList.remove("swiper-button-disabled");
      prevBtn.removeAttribute("disabled");
    }

    if (currentIndex >= maxIndex) {
      nextBtn.classList.add("swiper-button-disabled");
      nextBtn.setAttribute("disabled", "true");
    } else {
      nextBtn.classList.remove("swiper-button-disabled");
      nextBtn.removeAttribute("disabled");
    }

    // Toggle active class mapping like native swiper
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

  // Re-calculate safely on resize
  window.addEventListener("resize", updateSlider);
  updateSlider();
});
