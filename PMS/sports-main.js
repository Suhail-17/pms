document.addEventListener("DOMContentLoaded", () => {
  const outer = document.querySelector(".SportsMain_sports_main_slider_outer__wxDTW");
  if (!outer) return;

  const slider = outer.querySelector(".swiper");
  const track = slider?.querySelector(".swiper-wrapper");
  const origSlides = Array.from(track?.children || []);
  const prevBtn = outer.querySelector(".SportsMain_nav_prev__fqz8R");
  const nextBtn = outer.querySelector(".SportsMain_nav_next__6ENAu");
  const scrollbar = outer.querySelector(".swiper-scrollbar");
  const scrollbarDrag = scrollbar?.querySelector(".swiper-scrollbar-drag");

  if (!slider || !track || origSlides.length === 0) return;

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

      if (srcset) {
        const decodedSrcset = srcset
          .split(",")
          .map((entry) => entry.trim())
          .map((entry) => {
            const parts = entry.split(/\s+/);
            const url = parts.shift();
            const size = parts.join(" ");
            if (!url) return entry;
            const decodedUrl = decodeNextImageUrl(url);
            return size ? `${decodedUrl} ${size}` : decodedUrl;
          })
          .join(", ");
        image.setAttribute("srcset", decodedSrcset);
      }
    });
  };

  // Decode Next.js image caching URLs for all images in the slider
  decodeImageSources(outer);

  // Clean out duplicates created by static HTML export to avoid logic complexity
  const slides = origSlides.filter(s => !s.classList.contains("swiper-slide-duplicate"));
  
  // Re-append only the original non-duplicate slides
  track.innerHTML = "";
  slides.forEach(s => track.appendChild(s));

  if (slides.length === 0) return;

  // Start with second slide if available, otherwise first
  let currentIndex = Math.min(1, Math.max(0, slides.length - 1));
  let count = slides.length;
  let isDraggingScrollbar = false;
  let dragStartX = 0;
  let dragStartProgress = 0;
  let transitionEnabled = true;

  const mod = (n, m) => ((n % m) + m) % m;

  const updateClasses = () => {
    let activeIdx = mod(Math.round(currentIndex), count);
    slides.forEach((slide, index) => {
      slide.classList.remove(
        "swiper-slide-active",
        "swiper-slide-next",
        "swiper-slide-prev",
        "swiper-slide-visible"
      );

      if (index === activeIdx) slide.classList.add("swiper-slide-active", "swiper-slide-visible");
      if (index === mod(activeIdx - 1, count)) slide.classList.add("swiper-slide-prev", "swiper-slide-visible");
      if (index === mod(activeIdx + 1, count)) slide.classList.add("swiper-slide-next", "swiper-slide-visible");
      
      // Mark nearby slides visible
      let diff = mod(index - activeIdx + count / 2, count) - count / 2;
      if (Math.abs(diff) <= 2) {
         slide.classList.add("swiper-slide-visible");
      }
    });
  };

  const updateNav = () => {
    // Buttons are never disabled in an infinite loop
    if (prevBtn) prevBtn.classList.remove("swiper-button-disabled");
    if (nextBtn) nextBtn.classList.remove("swiper-button-disabled");
  };

  const updateScrollbar = () => {
    if (!scrollbar || !scrollbarDrag) return;
    const scrollbarWidth = scrollbar.clientWidth;
    // Map to active index [0, count-1] for display purposes
    const activeIdx = mod(Math.round(currentIndex), count);
    const dragWidth = Math.max((1 / count) * scrollbarWidth, 40);
    const maxTranslate = scrollbarWidth - dragWidth;
    const progress = count > 1 ? activeIdx / (count - 1) : 0;
    const translate = progress * maxTranslate;
    
    scrollbarDrag.style.width = `${dragWidth}px`;
    scrollbarDrag.style.transform = `translate3d(${translate}px, 0px, 0px)`;
    scrollbarDrag.style.transitionDuration = transitionEnabled ? "300ms" : "0ms";
  };

  const updateTrackAndSlides = () => {
    const swiperWidth = slider.clientWidth;
    // Determine dynamic sizes
    let slideWidth = Math.min(513, swiperWidth * 0.85);
    if (window.innerWidth >= 1200) {
       slideWidth = Math.min(513, swiperWidth * 0.85);
    } else if (window.innerWidth >= 768) {
       slideWidth = Math.min(400, swiperWidth * 0.85);
    } else {
       slideWidth = Math.min(300, swiperWidth * 0.85);
    }

    // Keep the track static, let the slides position themselves completely
    track.style.transitionDuration = "0ms";
    track.style.transform = `translate3d(0px, 0px, 0px)`;
    track.style.transformStyle = "preserve-3d";
    slider.style.perspective = "1200px";

    slides.forEach((slide, index) => {
      // Force slide's logical width and spacing
      slide.style.width = `${slideWidth}px`;
      slide.style.marginRight = "0px";

      // Compute shortest wrapped distance from active index
      const diff = mod(index - currentIndex + count / 2, count) - count / 2;
      let tz = 0, ry = 0, rawTx = 0, zIndex = 0;

      if (window.innerWidth >= 1200) {
          tz = -600 * Math.abs(diff);
          ry = -60 * diff;
          rawTx = -240 * diff;
          zIndex = 10 - Math.abs(Math.round(diff));
      } else if (window.innerWidth >= 768) {
          tz = -400 * Math.abs(diff);
          ry = -45 * diff;
          rawTx = -150 * diff;
          zIndex = 10 - Math.abs(Math.round(diff));
      } else {
          tz = -200 * Math.abs(diff);
          ry = -30 * diff;
          rawTx = -60 * diff;
          zIndex = 10 - Math.abs(Math.round(diff));
      }

      // Detect if slide is "teleporting" to the other side to prevent visual streaking
      const prevDiff = slide.dataset.prevDiff ? parseFloat(slide.dataset.prevDiff) : diff;
      const isJumping = Math.abs(diff - prevDiff) > 1.5;
      slide.dataset.prevDiff = diff;

      // Absolute visual transform accounting for wrap
      const totalTx = diff * slideWidth + rawTx;
      const trackCenter = swiperWidth / 2;
      const targetLeft = trackCenter - (slideWidth / 2) + totalTx;
      const physicalLeft = index * slideWidth; 
      const finalTx = targetLeft - physicalLeft;

      slide.style.transform = `translate3d(${finalTx}px, 0px, ${tz}px) rotateY(${ry}deg) scale(1)`;
      slide.style.zIndex = zIndex;
      slide.style.transitionDuration = (transitionEnabled && !isJumping) ? "300ms" : "0ms";
    });

    updateClasses();
    updateNav();
    updateScrollbar();
  };

  const goTo = (index) => {
    currentIndex = index; // Unbounded allows infinite scrolling
    transitionEnabled = true;
    updateTrackAndSlides();
  };

  prevBtn?.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn?.addEventListener("click", () => goTo(currentIndex + 1));

  // Touch Drag Interaction
  let touchStartX = 0;
  let touchDeltaX = 0;

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
  }, { passive: true });

  slider.addEventListener("touchmove", (e) => {
    touchDeltaX = e.touches[0].clientX - touchStartX;
  }, { passive: true });

  slider.addEventListener("touchend", () => {
    if (Math.abs(touchDeltaX) > 40) {
      if (touchDeltaX < 0) {
        goTo(currentIndex + 1);
      } else {
        goTo(currentIndex - 1);
      }
    }
  }, { passive: true });

  // Scrollbar Interaction
  if (scrollbar && scrollbarDrag) {
     scrollbarDrag.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        isDraggingScrollbar = true;
        transitionEnabled = false;
        dragStartX = event.clientX;
        const activeIdx = mod(Math.round(currentIndex), count);
        dragStartProgress = count > 1 ? activeIdx / (count - 1) : 0;
        scrollbarDrag.setPointerCapture(event.pointerId);
      });

      scrollbar.addEventListener("click", (event) => {
        if (event.target === scrollbarDrag) return;
        const rect = scrollbar.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const progress = rect.width ? clickX / rect.width : 0;
        const targetActiveIdx = Math.round(progress * (count - 1));
        // Find shortest path to target index
        let shortestDelta = targetActiveIdx - mod(Math.round(currentIndex), count);
        if (shortestDelta > count / 2) shortestDelta -= count;
        if (shortestDelta < -count / 2) shortestDelta += count;
        goTo(Math.round(currentIndex) + shortestDelta);
      });

      const stopDragging = () => {
        isDraggingScrollbar = false;
        transitionEnabled = true;
        // Snap to nearest integer on release
        goTo(Math.round(currentIndex));
      };

      scrollbarDrag.addEventListener("pointerup", stopDragging);
      scrollbarDrag.addEventListener("pointercancel", stopDragging);

      window.addEventListener("pointermove", (event) => {
        if (!isDraggingScrollbar) return;
        const maxTranslate = Math.max(scrollbar.clientWidth - scrollbarDrag.clientWidth, 1);
        const delta = event.clientX - dragStartX;
        let progress = dragStartProgress + delta / maxTranslate;
        
        // Wrap gracefully instead of hard clamp to allow scrollbar loop logic if dragged past bounds
        let unboundedProgress = dragStartProgress + delta / maxTranslate;
        
        // Determine unbounded current index
        const indexFloat = unboundedProgress * (count - 1);
        
        // Actually since scrollbar is bounded visually, it's better to cap drag progress to [0, 1] 
        // OR let it wrap. We'll clamp the scrollbar drag visually to [0, 1].
        progress = Math.max(0, Math.min(progress, 1));
        const index = progress * (count - 1);

        // Find difference from the actual tracking modulo to preserve loop
        let currentVisualIdx = mod(currentIndex, count);
        let shortestDelta = index - currentVisualIdx;
        if (shortestDelta > count / 2.0 && index < currentVisualIdx) shortestDelta -= count;
        if (shortestDelta < -count / 2.0 && index > currentVisualIdx) shortestDelta += count;
        
        currentIndex = currentIndex + shortestDelta;
        updateTrackAndSlides();
      });
  }

  // Handle Resize Validation
  window.addEventListener("resize", () => {
    transitionEnabled = false;
    updateTrackAndSlides();
    setTimeout(() => transitionEnabled = true, 50);
  });

  // Init Slider State
  transitionEnabled = false;
  track.style.display = "flex";
  track.style.alignItems = "center"; 
  
  updateTrackAndSlides();
  setTimeout(() => transitionEnabled = true, 50);
});
