document.addEventListener("DOMContentLoaded", () => {
  const outer = document.querySelector(".LogoSliderWidget_logo_slider_wrapper__nT0Gt");
  if (!outer) return;

  const slider = outer.querySelector(".swiper");
  const track = slider?.querySelector(".swiper-wrapper");
  const prevBtn = outer.querySelector(".LogoSliderWidget_logo_slider_prev__3qCo3");
  const nextBtn = outer.querySelector(".LogoSliderWidget_logo_slider_next__WNthp");
  const slides = Array.from(track?.children || []);

  if (!slider || !track || slides.length === 0) return;

  // Ensure track doesn't wrap and items stay in a row
  track.style.display = "flex";
  track.style.flexWrap = "nowrap";
  track.style.transition = "transform 0.5s ease-in-out";
  slider.style.overflow = "hidden"; // Ensure overflow is hidden on the slider viewport

  // Ensure items have flexible bounds if needed, but flex-shrink: 0 keeps them from collapsing
  slides.forEach(slide => {
    slide.style.flexShrink = "0";
  });

  let currentTranslateX = 0;

  let slideOffsets = [];
  const updateOffsets = () => {
    slideOffsets = [];
    let currentOffset = 0;
    slides.forEach((slide) => {
      slideOffsets.push(currentOffset);
      const style = window.getComputedStyle(slide);
      currentOffset += slide.offsetWidth + parseFloat(style.marginLeft || 0) + parseFloat(style.marginRight || 0);
    });
  };

  const updateSlider = () => {
    updateOffsets();
    const trackWidth = track.scrollWidth;
    const sliderWidth = slider.clientWidth;
    const maxTranslateX = sliderWidth - trackWidth;

    // Handle button visibility/opacity
    if (maxTranslateX >= 0) {
      // All items fit on the screen
      currentTranslateX = 0;
      if (nextBtn) {
        nextBtn.style.opacity = "0.5";
        nextBtn.style.pointerEvents = "none";
      }
      if (prevBtn) {
        prevBtn.style.opacity = "0.5";
        prevBtn.style.pointerEvents = "none";
      }
    } else {
      // Clamp values
      if (currentTranslateX >= 0) {
        currentTranslateX = 0;
        if (prevBtn) {
          prevBtn.style.opacity = "0.5";
          prevBtn.style.pointerEvents = "none";
        }
      } else {
        if (prevBtn) {
          prevBtn.style.opacity = "1";
          prevBtn.style.pointerEvents = "auto";
        }
      }

      if (currentTranslateX <= maxTranslateX) {
        currentTranslateX = maxTranslateX;
        if (nextBtn) {
          nextBtn.style.opacity = "0.5";
          nextBtn.style.pointerEvents = "none";
        }
      } else {
        if (nextBtn) {
          nextBtn.style.opacity = "1";
          nextBtn.style.pointerEvents = "auto";
        }
      }
    }

    track.style.transform = `translate3d(${currentTranslateX}px, 0px, 0px)`;
  };

  prevBtn?.addEventListener("click", () => {
    updateOffsets();
    const currentScroll = -currentTranslateX;
    
    // Find highest offset strictly less than current scroll
    let targetOffset = 0;
    for (let i = slideOffsets.length - 1; i >= 0; i--) {
      if (slideOffsets[i] < currentScroll - 5) { // 5px threshold for precision float issues
        targetOffset = slideOffsets[i];
        break;
      }
    }

    currentTranslateX = -targetOffset;
    updateSlider();
  });

  nextBtn?.addEventListener("click", () => {
    updateOffsets();
    const currentScroll = -currentTranslateX;

    // Find lowest offset strictly greater than current scroll
    let targetOffset = slideOffsets[slideOffsets.length - 1] || 0;
    for (let i = 0; i < slideOffsets.length; i++) {
      if (slideOffsets[i] > currentScroll + 5) {
        targetOffset = slideOffsets[i];
        break;
      }
    }

    currentTranslateX = -targetOffset;
    updateSlider();
  });

  // Touch Drag Support
  let touchStartX = 0;
  let touchDeltaX = 0;

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
    track.style.transition = "none"; // Disable transition during drag for smoothness
  }, { passive: true });

  slider.addEventListener("touchmove", (e) => {
    touchDeltaX = e.touches[0].clientX - touchStartX;
    // Visually follow finger
    track.style.transform = `translate3d(${currentTranslateX + touchDeltaX}px, 0px, 0px)`;
  }, { passive: true });

  slider.addEventListener("touchend", () => {
    track.style.transition = "transform 0.5s ease-in-out"; // Re-enable smooth transition
    currentTranslateX += touchDeltaX;
    updateSlider(); // Enforce bounds
  }, { passive: true });

  // Initial update
  setTimeout(updateSlider, 100);

  // Update on resize
  window.addEventListener('resize', updateSlider);
});
