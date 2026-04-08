document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".EventListing_events_wrap__vz2Ls");

  if (!section) {
    return;
  }

  const MONTHS = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };

  const events = [
    {
      title: "MDX Global Connect: Global Community Edition",
      startDate: "2026-04-09",
      time: "12:00 pm GST",
      description:
        "Join our Global Community session and experience Middlesex University Dubai in a fully interactive, live format.",
      link: "/event/mdx-global-connect-global-community-9-april",
    },
    {
      title: "Meet MDX Dubai in Pune, India",
      startDate: "2026-04-11",
      time: "07:00 am IST",
      description: "",
      link: "/event/meet-mdx-in-pune-11-apr-2026",
    },
    {
      title: "Meet MDX Dubai in Pune, India",
      startDate: "2026-04-12",
      time: "07:00 am IST",
      description: "",
      link: "/event/meet-mdx-in-pune-12-apr-2026",
    },
    {
      title: "Meet MDX Dubai in Zhengzhou, China",
      startDate: "2026-04-13",
      time: "05:00 am BJT",
      description: "",
      link: "/event/meet-mdx-dubai-in-zhengzhou-china-1",
    },
    {
      title: "Meet MDX Dubai in Mumbai, India",
      startDate: "2026-04-13",
      time: "07:00 am IST",
      description: "",
      link: "/event/meet-mdx-in-mumbai-13-apr-2026",
    },
    {
      title: "Meet MDX Dubai in Zhengzhou, China",
      startDate: "2026-04-14",
      time: "05:00 am BJT",
      description: "",
      link: "/event/meet-mdx-dubai-in-zhengzhou-china-2",
    },
    {
      title: "Meet MDX Dubai in Zhengzhou, China",
      startDate: "2026-04-15",
      time: "05:00 am BJT",
      description: "",
      link: "/event/meet-mdx-dubai-in-zhengzhou-china-3",
    },
    {
      title: "Virtual Open Day",
      startDate: "2026-04-15",
      time: "11:00 am GST",
      description: "",
      link: "/event/virtual-opn-day-15-april-2026",
    },
    {
      title: "Meet MDX Dubai in Zhengzhou, China",
      startDate: "2026-04-16",
      time: "05:00 am BJT",
      description: "",
      link: "/event/meet-mdx-dubai-in-zhengzhou-china-4",
    },
    {
      title: "Meet MDX Dubai in Shanghai, China",
      startDate: "2026-04-17",
      time: "05:00 am BJT",
      description: "",
      link: "/event/meet-mdx-dubai-in-shanghai-china-5",
    },
    {
      title: "Meet MDX Dubai in Shanghai, China",
      startDate: "2026-04-18",
      time: "05:00 am BJT",
      description: "",
      link: "/event/meet-mdx-dubai-in-shanghai-china-6",
    },
    {
      title: "Meet MDX Dubai in Shanghai, China",
      startDate: "2026-04-19",
      time: "05:00 am BJT",
      description: "",
      link: "/event/meet-mdx-dubai-in-shanghai-china-7",
    },
    {
      title: "Meet MDX Dubai in Kochi, India",
      startDate: "2026-04-25",
      time: "07:00 am IST",
      description: "",
      link: "/event/meet-mdx-dubai-in-kochi-india-2026-1",
    },
    {
      title: "Campus Open Day - Join Us On Campus or Virtually",
      startDate: "2026-04-25",
      time: "10:00 am GST",
      description: "",
      link: "/event/campus-open-day-dubai-knowledge-park-25-apr-2026",
    },
    {
      title: "Meet MDX Dubai in Kochi, India",
      startDate: "2026-04-26",
      time: "07:00 am IST",
      description: "",
      link: "/event/meet-mdx-dubai-in-kochi-india-2026-2",
    },
    {
      title: "Meet MDX Dubai in Chennai, India",
      startDate: "2026-05-10",
      time: "07:00 am IST",
      description: "",
      link: "/event/meet-mdx-dubai-in-chennai-india-2026-1",
    },
    {
      title: "Meet MDX Dubai in Pune, India",
      startDate: "2026-05-15",
      time: "07:00 am IST",
      description: "",
      link: "/event/meet-mdx-dubai-in-pune-india-2026-1",
    },
    {
      title: "Meet MDX Dubai in Mumbai, India",
      startDate: "2026-05-16",
      time: "07:00 am IST",
      description: "",
      link: "/event/meet-mdx-dubai-in-mumbai-india-2026-1",
    },
    {
      title: "Meet MDX Dubai in Mumbai, India",
      startDate: "2026-05-17",
      time: "04:00 am IST",
      description: "",
      link: "/event/meet-mdx-dubai-in-mumbai-india-2026-2",
    },
    {
      title: "Meet MDX Dubai in Delhi, India",
      startDate: "2026-05-23",
      time: "07:00 am IST",
      description: "",
      link: "/event/meet-mdx-dubai-in-delhi-india-2026-1",
    },
    {
      title: "Meet MDX Dubai in Delhi, India",
      startDate: "2026-05-24",
      time: "04:00 am IST",
      description: "",
      link: "/event/meet-mdx-dubai-in-delhi-india-2026-2",
    },
    {
      title: "BRIDGE: Dementia Care Training Programme",
      startDate: "2026-05-29",
      time: "11:00 am GST",
      description:
        "BRIDGE is an evidence-based dementia care training programme designed to close the knowledge gap among healthcare staff in the United Arab Emirates.",
      link: "/event/bridge-dementia-care-training-programme-29-may-2026",
    },
    {
      title: "Humanities at the Core Research and Project Competition",
      startDate: "2026-06-04",
      time: "05:00 am GST",
      description:
        "The Media and Education Departments at Middlesex University Dubai are proud to launch Humanities at the Core: The Humanities, Arts and Social Sciences Research and Project Competition 2025-26.",
      link: "/event/humanities-at-the-core-research-and-project-competition",
    },
    {
      title: "CIPD Level 3 Certificate In People Practice",
      startDate: "2026-06-06",
      time: "05:00 am GST",
      description: "",
      link: "/event/cipd-level-3-certificate-in-people-practice-6-june-2026",
    },
    {
      title: "MDX Dubai Subject Specific Camp - Week 1",
      startDate: "2026-07-06",
      time: "05:00 am GST",
      description:
        "Build a foundation knowledge in the subject area you're most interested in this summer at the MDX Dubai Subject Specific Camp.",
      link: "/event/mdx-dubai-subject-specific-camp-week-1-6-jul-2026",
    },
    {
      title: "MDX Dubai Subject Specific Camp - Week 2",
      startDate: "2026-07-13",
      time: "05:00 am GST",
      description:
        "Build a foundation knowledge in the subject area you're most interested in this summer at the MDX Dubai Subject Specific Camp.",
      link: "/event/mdx-dubai-subject-specific-camp-week-1-13-jul-2026",
    },
    {
      title: "MDX Dubai Summer Camp - Week 1",
      startDate: "2026-07-13",
      time: "05:00 am GST",
      description:
        "Experience an unforgettable summer adventure at the MDX Summer Camp in Dubai.",
      link: "/event/mdx-dubai-summer-camp-week-1-13-jul-2026",
    },
    {
      title: "MDX Dubai Summer Camp - Week 2",
      startDate: "2026-07-20",
      time: "05:00 am GST",
      description:
        "Experience an unforgettable summer adventure at the MDX Summer Camp in Dubai.",
      link: "/event/mdx-dubai-summer-camp-week-2-20-jul-2026",
    },
    {
      title: "MDX Dubai Summer Camp - Week 3",
      startDate: "2026-07-27",
      time: "05:00 am GST",
      description:
        "Experience an unforgettable summer adventure at the MDX Summer Camp in Dubai.",
      link: "/event/mdx-dubai-summer-camp-week-3-27-jul-2026",
    },
    {
      title: "MDX Dubai Summer Camp - Week 4",
      startDate: "2026-08-03",
      time: "05:00 am GST",
      description:
        "Experience an unforgettable summer adventure at the MDX Summer Camp in Dubai.",
      link: "/event/mdx-dubai-summer-camp-week-4-3-aug-2026",
    },
    {
      title: "MDX Dubai Summer Camp - Week 5",
      startDate: "2026-08-10",
      time: "05:00 am GST",
      description:
        "Experience an unforgettable summer adventure at the MDX Summer Camp in Dubai.",
      link: "/event/mdx-dubai-summer-camp-week-5-10-aug-2026",
    },
    {
      title: "CIM Level 6 Diploma in Professional & Digital Marketing",
      startDate: "2026-09-01",
      time: "05:00 am GST",
      description: "",
      link: "/event/cim-level-6-diploma-in-professional-and-digital-marketing-2026-mar",
    },
  ];

  const swiperWrap = section.querySelector(".EventListing_swiper_wrap__Qf6nl");
  const slider = section.querySelector(".EventListing_swiper_wrap_swiper__aCDlI");
  const wrapper = section.querySelector(".swiper-wrapper");
  const slides = Array.from(section.querySelectorAll(".EventListing_swiper_slide__HoLp4"));
  const prevButton = section.querySelector(".EventListing_btn_prev__pBK_3");
  const nextButton = section.querySelector(".EventListing_btn_next__pO5jg");
  const eventWrap = section.querySelector(".EventListing_event_wrap__jD7bA");

  if (!swiperWrap || !slider || !wrapper || slides.length === 0 || !eventWrap) {
    return;
  }

  const validSlides = slides.filter((slide) => {
    const day = slide.querySelector("h4")?.textContent?.trim();
    const month = slide.querySelector("p")?.textContent?.trim();

    return Boolean(day && month);
  });

  const slideDates = validSlides.map((slide) => {
    const day = Number.parseInt(slide.querySelector("h4")?.textContent?.trim() || "", 10);
    const monthName = slide.querySelector("p")?.textContent?.trim().toLowerCase() || "";
    const monthIndex = MONTHS[monthName];
    const date = new Date(2026, monthIndex, day);
    const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    return { slide, isoDate };
  });

  let currentIndex = 0;

  function getSlideStep() {
    const firstSlide = validSlides[0];

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

  function stripHtml(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return (temp.textContent || temp.innerText || "").replace(/\s+/g, " ").trim();
  }

  function getEventsForCurrentDate() {
    const activeDate = slideDates[currentIndex]?.isoDate;
    return events.filter((event) => event.startDate === activeDate);
  }

  function createEventMarkup(event) {
    const description = event.description ? stripHtml(event.description) : "";
    const trimmedDescription =
      description.length > 240 ? `${description.slice(0, 237).trim()}...` : description;

    return `
      <a class="EventItem_link_wrapper__jWcqY" target="_self" href="${event.link}">
        <div class="EventItem_event_item__6o1ey event_item">
          <div>
            <div class="d-flex justify-content-between align-items-center">
              <p class="EventItem_event_item_date__9OAIO">${event.time}</p>
              <div class="arw-link arw-link-white">
                <svg viewBox="0 0 1024 1024" style="display: inline-block; stroke: currentcolor; fill: currentcolor; width: 13.76px; height: 13.76px;">
                  <path d="M105.22 1024l-105.22-105.22 896.902-896.977 105.22 105.22z"></path>
                  <path d="M1023.628 952.34h-148.826v-803.663h-788.78v-148.826h937.606z"></path>
                </svg>
              </div>
            </div>
            <h3 class="EventItem_event_item_title__3ehgW">${event.title}</h3>
            <div class="EventItem_event_item_description__KLXna">
              <div>
                ${trimmedDescription ? `<p>${trimmedDescription}</p>` : ""}
              </div>
            </div>
          </div>
        </div>
      </a>
    `;
  }

  function renderEvents() {
    const matchingEvents = getEventsForCurrentDate();

    if (matchingEvents.length === 0) {
      eventWrap.innerHTML = `
        <div class="EventItem_event_item__6o1ey event_item">
          <div>
            <h3 class="EventItem_event_item_title__3ehgW">No event details available for this date.</h3>
          </div>
        </div>
      `;
      return;
    }

    eventWrap.innerHTML = matchingEvents.map(createEventMarkup).join("");
  }

  function updateSlideClasses() {
    slides.forEach((slide) => {
      slide.classList.remove("swiper-slide-active", "swiper-slide-next", "swiper-slide-prev");
    });

    const activeSlide = slideDates[currentIndex]?.slide;
    const prevSlide = slideDates[currentIndex - 1]?.slide;
    const nextSlide = slideDates[currentIndex + 1]?.slide;

    activeSlide?.classList.add("swiper-slide-active");
    prevSlide?.classList.add("swiper-slide-prev");
    nextSlide?.classList.add("swiper-slide-next");
  }

  function updateButtons() {
    const isAtStart = currentIndex <= 0;
    const isAtEnd = currentIndex >= slideDates.length - 1;

    if (prevButton) {
      prevButton.classList.toggle("swiper-button-disabled", isAtStart);
      prevButton.style.opacity = isAtStart ? "0.5" : "1";
    }

    if (nextButton) {
      nextButton.classList.toggle("swiper-button-disabled", isAtEnd);
      nextButton.style.opacity = isAtEnd ? "0.5" : "1";
    }
  }

  function renderSlider() {
    const step = getSlideStep();
    const maxTranslate = getMaxTranslate();
    const translate = Math.min(currentIndex * step, maxTranslate);

    wrapper.style.transitionDuration = "300ms";
    wrapper.style.transform = `translate3d(${-translate}px, 0px, 0px)`;

    updateSlideClasses();
    updateButtons();
  }

  function render() {
    renderSlider();
    renderEvents();
  }

  function goTo(index) {
    currentIndex = Math.min(Math.max(index, 0), slideDates.length - 1);
    render();
  }

  validSlides.forEach((slide, index) => {
    slide.addEventListener("click", () => {
      goTo(index);
    });
  });

  prevButton?.addEventListener("click", () => {
    if (currentIndex > 0) {
      goTo(currentIndex - 1);
    }
  });

  nextButton?.addEventListener("click", () => {
    if (currentIndex < slideDates.length - 1) {
      goTo(currentIndex + 1);
    }
  });

  window.addEventListener("resize", () => {
    renderSlider();
  });

  render();
});
