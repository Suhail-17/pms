document.addEventListener("DOMContentLoaded", () => {
  const wrappers = document.querySelectorAll(
    ".CardStackSlider_cardstack_slider_wrap__J_sqB",
  );

  if (!wrappers.length) {
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

  const decodeImageSources = (container) => {
    container.querySelectorAll("img").forEach((image) => {
      const src = image.getAttribute("src");
      const srcset = image.getAttribute("srcset");
      const decodedSrc = decodeNextImageUrl(src);

      if (decodedSrc && decodedSrc !== src) {
        image.setAttribute("src", decodedSrc);
      }

      if (!srcset) {
        return;
      }

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
    });
  };

  const getSlidesPerView = () => {
    const width = window.innerWidth;

    if (width >= 1200) {
      return 4;
    }

    if (width >= 992) {
      return 3.2;
    }

    if (width >= 768) {
      return 2.2;
    }

    return 1.1;
  };

  wrappers.forEach((wrap) => {
    const swiper = wrap.querySelector(".CardStackSlider_mdx_cardstack_swiper__j_HIT");
    const track = swiper?.querySelector(".swiper-wrapper");
    const slides = Array.from(track?.children || []).filter((slide) =>
      slide.classList.contains("swiper-slide"),
    );
    const prevButton = wrap.querySelector(".CardStackSlider_swiper_navs_prev__cU7Ig");
    const nextButton = wrap.querySelector(".CardStackSlider_swiper_navs_next__zupYj");
    const scrollbar = swiper?.querySelector(".swiper-scrollbar");
    const scrollbarDrag = scrollbar?.querySelector(".swiper-scrollbar-drag");

    if (!swiper || !track || !slides.length) {
      return;
    }

    decodeImageSources(wrap);

    let currentIndex = 0;
    let maxIndex = 0;
    let isDraggingScrollbar = false;
    let dragStartX = 0;
    let dragStartProgress = 0;
    let transitionEnabled = true;

    const clampIndex = (value) => {
      if (value < 0) {
        return 0;
      }

      if (value > maxIndex) {
        return maxIndex;
      }

      return value;
    };

    const updateClasses = () => {
      slides.forEach((slide, index) => {
        slide.classList.remove(
          "swiper-slide-active",
          "swiper-slide-next",
          "swiper-slide-prev",
          "swiper-slide-visible",
        );

        if (index === currentIndex) {
          slide.classList.add("swiper-slide-active");
        }

        if (index === currentIndex - 1) {
          slide.classList.add("swiper-slide-prev");
        }

        if (index === currentIndex + 1) {
          slide.classList.add("swiper-slide-next");
        }

        if (index >= currentIndex && index <= currentIndex + Math.ceil(getSlidesPerView())) {
          slide.classList.add("swiper-slide-visible");
        }
      });
    };

    const updateNav = () => {
      if (prevButton) {
        prevButton.classList.toggle("swiper-button-disabled", currentIndex === 0);
      }

      if (nextButton) {
        nextButton.classList.toggle("swiper-button-disabled", currentIndex >= maxIndex);
      }
    };

    const updateScrollbar = () => {
      if (!scrollbar || !scrollbarDrag) {
        return;
      }

      const visibleWidth = swiper.clientWidth;
      const totalWidth = track.scrollWidth;
      const scrollbarWidth = scrollbar.clientWidth;

      if (!visibleWidth || !totalWidth || totalWidth <= visibleWidth) {
        scrollbarDrag.style.width = "100%";
        scrollbarDrag.style.transform = "translate3d(0px, 0px, 0px)";
        return;
      }

      const dragWidth = Math.max((visibleWidth / totalWidth) * scrollbarWidth, 40);
      const maxTranslate = scrollbarWidth - dragWidth;
      const progress = maxIndex ? currentIndex / maxIndex : 0;
      const translate = progress * maxTranslate;

      scrollbarDrag.style.width = `${dragWidth}px`;
      scrollbarDrag.style.transform = `translate3d(${translate}px, 0px, 0px)`;
    };

    const updateTrackPosition = () => {
      const targetSlide = slides[currentIndex];
      const offset = targetSlide ? targetSlide.offsetLeft : 0;

      track.style.transition = transitionEnabled
        ? "transform 600ms ease"
        : "none";
      track.style.transform = `translate3d(${-offset}px, 0px, 0px)`;
      updateClasses();
      updateNav();
      updateScrollbar();
    };

    const layoutSlides = () => {
      const slidesPerView = getSlidesPerView();
      const gap = 15;
      const swiperWidth = swiper.clientWidth;
      const slideWidth = (swiperWidth - gap * (slidesPerView - 1)) / slidesPerView;

      transitionEnabled = false;
      slides.forEach((slide, index) => {
        slide.style.width = `${slideWidth}px`;
        slide.style.marginRight = index === slides.length - 1 ? "0px" : `${gap}px`;
      });

      maxIndex = Math.max(0, slides.length - Math.ceil(slidesPerView));
      currentIndex = clampIndex(currentIndex);
      updateTrackPosition();
      window.requestAnimationFrame(() => {
        transitionEnabled = true;
        track.style.transition = "transform 600ms ease";
      });
    };

    const goTo = (index) => {
      currentIndex = clampIndex(index);
      updateTrackPosition();
    };

    prevButton?.addEventListener("click", () => {
      goTo(currentIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
      goTo(currentIndex + 1);
    });

    if (scrollbar && scrollbarDrag) {
      scrollbarDrag.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        isDraggingScrollbar = true;
        transitionEnabled = false;
        dragStartX = event.clientX;

        const visibleWidth = swiper.clientWidth;
        const totalWidth = track.scrollWidth;
        dragStartProgress =
          totalWidth > visibleWidth && maxIndex ? currentIndex / maxIndex : 0;

        scrollbarDrag.setPointerCapture(event.pointerId);
      });

      scrollbar.addEventListener("click", (event) => {
        if (event.target === scrollbarDrag) {
          return;
        }

        const rect = scrollbar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const progress = rect.width ? clickX / rect.width : 0;
        const nextIndex = Math.round(progress * maxIndex);

        goTo(nextIndex);
      });

      const stopDragging = () => {
        isDraggingScrollbar = false;
        transitionEnabled = true;
      };

      scrollbarDrag.addEventListener("pointerup", stopDragging);
      scrollbarDrag.addEventListener("pointercancel", stopDragging);

      window.addEventListener("pointermove", (event) => {
        if (!isDraggingScrollbar) {
          return;
        }

        const scrollbarWidth = scrollbar.clientWidth;
        const dragWidth = scrollbarDrag.clientWidth;
        const maxTranslate = Math.max(scrollbarWidth - dragWidth, 1);
        const delta = event.clientX - dragStartX;
        const progress = Math.min(
          Math.max(dragStartProgress + delta / maxTranslate, 0),
          1,
        );

        goTo(Math.round(progress * maxIndex));
      });

      window.addEventListener("pointerup", stopDragging);
    }

    let touchStartX = 0;
    let touchDeltaX = 0;

    swiper.addEventListener("touchstart", (event) => {
      touchStartX = event.touches[0].clientX;
      touchDeltaX = 0;
    });

    swiper.addEventListener("touchmove", (event) => {
      touchDeltaX = event.touches[0].clientX - touchStartX;
    });

    swiper.addEventListener("touchend", () => {
      if (Math.abs(touchDeltaX) < 40) {
        return;
      }

      if (touchDeltaX < 0) {
        goTo(currentIndex + 1);
        return;
      }

      goTo(currentIndex - 1);
    });

    window.addEventListener("resize", layoutSlides);
    layoutSlides();
  });
});
