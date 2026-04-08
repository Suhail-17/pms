document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".StudentFeedbackJanuary_section__4tFTZ");

  if (!section) {
    return;
  }

  const decodeNextImageUrl = (value) => {
    if (!value || !value.startsWith("/_next/image?")) {
      return value;
    }

    try {
      const parsed = new URL(value, window.location.href);
      const originalUrl = parsed.searchParams.get("url");

      return originalUrl ? decodeURIComponent(originalUrl) : value;
    } catch {
      return value;
    }
  };

  section.querySelectorAll("img").forEach((image) => {
    const src = image.getAttribute("src");
    const srcset = image.getAttribute("srcset");
    const decodedSrc = decodeNextImageUrl(src);

    if (decodedSrc && decodedSrc !== src) {
      image.setAttribute("src", decodedSrc);
    }

    if (srcset) {
      const decodedSrcset = srcset
        .split(",")
        .map((entry) => entry.trim())
        .map((entry) => {
          const parts = entry.split(/\s+/);
          const url = parts.shift();
          const size = parts.join(" ");

          if (!url) {
            return entry;
          }

          const decodedUrl = decodeNextImageUrl(url);
          return size ? `${decodedUrl} ${size}` : decodedUrl;
        })
        .join(", ");

      image.setAttribute("srcset", decodedSrcset);
    }
  });

  const sliderHost = section.querySelector(".StudentFeedbackJanuary_testimonail_swiper__xOXt8");
  const slider = section.querySelector(".StudentFeedbackJanuary_testimonail_swiper__xOXt8 .swiper");
  const wrapper = slider?.querySelector(".swiper-wrapper");
  const slides = Array.from(slider?.querySelectorAll(".swiper-slide") || []);
  const pagination = sliderHost?.querySelector(".swiper-pagination");

  if (!sliderHost || !slider || !wrapper || slides.length === 0 || !pagination) {
    return;
  }

  let navigation = sliderHost.querySelector(".StudentFeedbackJanuary_testimonialswiper_navigation__2tSso");
  let prevButton = navigation?.querySelector(".custom-prev");
  let nextButton = navigation?.querySelector(".custom-next");

  if (!navigation) {
    navigation = document.createElement("div");
    navigation.className =
      "StudentFeedbackJanuary_testimonialswiper_navigation__2tSso d-none d-lg-flex";
    navigation.innerHTML = `
      <div class="StudentFeedbackJanuary_navigation_btn__ICIpy custom-prev" aria-label="Previous testimonial" role="button" tabindex="0">
        <svg viewBox="0 0 546 1024" style="display: inline-block; stroke: currentcolor; fill: currentcolor; width: 20px; height: 20px;">
          <path d="M512 1024l-512-511.976 512-512 33.77 33.77-478.23 478.23 478.23 478.206z"></path>
        </svg>
      </div>
      <div class="StudentFeedbackJanuary_navigation_btn__ICIpy custom-next" aria-label="Next testimonial" role="button" tabindex="0">
        <svg viewBox="0 0 546 1024" style="display: inline-block; stroke: currentcolor; fill: currentcolor; width: 20px; height: 20px;">
          <path d="M33.77 0l512 511.976-512 512-33.77-33.77 478.23-478.23-478.23-478.206z"></path>
        </svg>
      </div>
    `;
    sliderHost.appendChild(navigation);
    prevButton = navigation.querySelector(".custom-prev");
    nextButton = navigation.querySelector(".custom-next");
  }

  const bullets = Array.from(pagination.querySelectorAll(".swiper-pagination-bullet"));
  let currentIndex = 0;

  function updateSlideWidths() {
    const gap = window.innerWidth >= 768 ? 55 : 0;
    slides.forEach((slide) => {
      slide.style.width = `${slider.clientWidth}px`;
      slide.style.marginRight = `${gap}px`;
    });
  }

  function render() {
    const activeSlide = slides[currentIndex];
    const gap = Number.parseFloat(window.getComputedStyle(activeSlide).marginRight) || 0;
    const translate = currentIndex * (slider.clientWidth + gap);

    wrapper.style.transitionDuration = "300ms";
    wrapper.style.transform = `translate3d(${-translate}px, 0px, 0px)`;

    slides.forEach((slide, index) => {
      slide.classList.remove("swiper-slide-active", "swiper-slide-next", "swiper-slide-prev");

      if (index === currentIndex) {
        slide.classList.add("swiper-slide-active");
      } else if (index === currentIndex + 1) {
        slide.classList.add("swiper-slide-next");
      } else if (index === currentIndex - 1) {
        slide.classList.add("swiper-slide-prev");
      }
    });

    bullets.forEach((bullet, index) => {
      bullet.classList.toggle("swiper-pagination-bullet-active", index === currentIndex);
    });

    prevButton?.classList.toggle("swiper-button-disabled", currentIndex === 0);
    nextButton?.classList.toggle("swiper-button-disabled", currentIndex === slides.length - 1);
  }

  function goTo(index) {
    currentIndex = Math.min(Math.max(index, 0), slides.length - 1);
    render();
  }

  prevButton?.addEventListener("click", () => {
    goTo(currentIndex - 1);
  });

  nextButton?.addEventListener("click", () => {
    goTo(currentIndex + 1);
  });

  [prevButton, nextButton].forEach((button, directionIndex) => {
    button?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goTo(currentIndex + (directionIndex === 0 ? -1 : 1));
      }
    });
  });

  bullets.forEach((bullet, index) => {
    bullet.addEventListener("click", () => {
      goTo(index);
    });
  });

  let touchStartX = null;

  slider.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0]?.clientX ?? null;
  }, { passive: true });

  slider.addEventListener("touchend", (event) => {
    if (touchStartX === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX;
    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) > 40) {
      goTo(currentIndex + (deltaX < 0 ? 1 : -1));
    }

    touchStartX = null;
  }, { passive: true });

  window.addEventListener("resize", () => {
    updateSlideWidths();
    render();
  });

  updateSlideWidths();
  render();
});
