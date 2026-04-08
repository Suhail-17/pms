document.addEventListener("DOMContentLoaded", () => {
  const section = document.getElementById("IMPACT BY NUMBERS");

  if (!section) {
    return;
  }

  const slider = section.querySelector(".swiper");
  const wrapper = section.querySelector(".swiper-wrapper");
  const slides = Array.from(section.querySelectorAll(".swiper-slide"));
  const prevButton = section.querySelector(".entry_nav_prev");
  const nextButton = section.querySelector(".entry_nav_next");
  const scrollbar = section.querySelector(".swiper-scrollbar");
  const scrollbarDrag = section.querySelector(".swiper-scrollbar-drag");

  if (!slider || !wrapper || slides.length === 0) {
    return;
  }

  let currentIndex = 0;

  function getSlideStep() {
    const firstSlide = slides[0];

    if (!firstSlide) {
      return 0;
    }

    const slideStyles = window.getComputedStyle(firstSlide);
    const marginRight = Number.parseFloat(slideStyles.marginRight) || 0;

    return firstSlide.getBoundingClientRect().width + marginRight;
  }

  function getMaxTranslate() {
    return Math.max(0, wrapper.scrollWidth - slider.clientWidth);
  }

  function getMaxIndex() {
    const step = getSlideStep();
    const maxTranslate = getMaxTranslate();

    if (!step) {
      return 0;
    }

    return Math.max(0, Math.ceil(maxTranslate / step));
  }

  function updateSlideClasses() {
    slides.forEach((slide, index) => {
      slide.classList.remove(
        "swiper-slide-active",
        "swiper-slide-next",
        "swiper-slide-prev",
      );

      if (index === currentIndex) {
        slide.classList.add("swiper-slide-active");
      } else if (index === currentIndex + 1) {
        slide.classList.add("swiper-slide-next");
      } else if (index === currentIndex - 1) {
        slide.classList.add("swiper-slide-prev");
      }
    });
  }

  function updateButtons() {
    const maxIndex = getMaxIndex();

    if (prevButton) {
      prevButton.classList.toggle("swiper-button-disabled", currentIndex <= 0);
      prevButton.setAttribute("aria-disabled", String(currentIndex <= 0));
    }

    if (nextButton) {
      nextButton.classList.toggle(
        "swiper-button-disabled",
        currentIndex >= maxIndex,
      );
      nextButton.setAttribute("aria-disabled", String(currentIndex >= maxIndex));
    }
  }

  function updateScrollbar(translate) {
    if (!scrollbar || !scrollbarDrag) {
      return;
    }

    const maxTranslate = getMaxTranslate();
    const trackWidth = scrollbar.clientWidth;

    if (trackWidth <= 0) {
      return;
    }

    if (maxTranslate <= 0) {
      scrollbarDrag.style.width = "100%";
      scrollbarDrag.style.transform = "translate3d(0px, 0px, 0px)";
      return;
    }

    const visibleRatio = slider.clientWidth / wrapper.scrollWidth;
    const dragWidth = Math.max(24, trackWidth * visibleRatio);
    const maxDragOffset = trackWidth - dragWidth;
    const progress = translate / maxTranslate;
    const dragOffset = maxDragOffset * progress;

    scrollbarDrag.style.width = `${dragWidth}px`;
    scrollbarDrag.style.transform = `translate3d(${dragOffset}px, 0px, 0px)`;
  }

  function render() {
    const step = getSlideStep();
    const maxTranslate = getMaxTranslate();
    const translate = Math.min(currentIndex * step, maxTranslate);

    wrapper.style.transitionDuration = "300ms";
    wrapper.style.transform = `translate3d(${-translate}px, 0px, 0px)`;

    updateSlideClasses();
    updateButtons();
    updateScrollbar(translate);
  }

  function goTo(index) {
    currentIndex = Math.min(Math.max(index, 0), getMaxIndex());
    render();
  }

  prevButton?.addEventListener("click", () => {
    goTo(currentIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    goTo(currentIndex + 1);
  });

  window.addEventListener("resize", () => {
    goTo(currentIndex);
  });

  slider.classList.add("swiper-initialized", "swiper-horizontal");
  render();
});
