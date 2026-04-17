document.addEventListener("DOMContentLoaded", () => {
    const swiper = document.querySelector("#facilitiesSwiper");
    if (!swiper) return;

    const wrapper = swiper.querySelector(".swiper-wrapper");
    const slides = swiper.querySelectorAll(".swiper-slide");
    const pagination = swiper.querySelector(".swiper-pagination");

    if (!wrapper || !slides.length) return;

    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Create dots
    const createDots = () => {
        if (!pagination) return;
        pagination.innerHTML = "";
        slides.forEach((_, index) => {
            const dot = document.createElement("span");
            dot.classList.add("swiper-pagination-bullet");
            if (index === 0) dot.classList.add("swiper-pagination-bullet-active");
            dot.addEventListener("click", () => {
                currentIndex = index;
                updateSlider();
            });
            pagination.appendChild(dot);
        });
    };

    const updateSlider = () => {
        const isMobile = window.innerWidth < 992;
        
        if (!isMobile) {
            wrapper.style.transform = "none";
            wrapper.style.transitionDuration = "0ms";
            return;
        }

        const slideWidth = swiper.offsetWidth;
        const offset = -currentIndex * slideWidth;
        
        wrapper.style.transitionDuration = "400ms";
        wrapper.style.transform = `translate3d(${offset}px, 0px, 0px)`;

        // Update dots
        if (pagination) {
            const dots = pagination.querySelectorAll(".swiper-pagination-bullet");
            dots.forEach((dot, index) => {
                dot.classList.toggle("swiper-pagination-bullet-active", index === currentIndex);
            });
        }
    };

    // Touch events for swiping
    swiper.addEventListener("touchstart", (e) => {
        if (window.innerWidth >= 992) return;
        startX = e.touches[0].clientX;
        isDragging = true;
        wrapper.style.transitionDuration = "0ms";
    });

    swiper.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        const slideWidth = swiper.offsetWidth;
        const offset = (-currentIndex * slideWidth) + diff;
        wrapper.style.transform = `translate3d(${offset}px, 0px, 0px)`;
    });

    swiper.addEventListener("touchend", (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;
        const slideWidth = swiper.offsetWidth;

        if (Math.abs(diff) > slideWidth / 4) {
            if (diff > 0 && currentIndex > 0) {
                currentIndex--;
            } else if (diff < 0 && currentIndex < slides.length - 1) {
                currentIndex++;
            }
        }
        updateSlider();
    });

    // Handle resize
    window.addEventListener("resize", () => {
        currentIndex = 0; // Reset to start on resize to avoid alignment issues
        updateSlider();
    });

    createDots();
    updateSlider();
});
