(function () {
  const section = document.querySelector(".OurEvents_section__1o_T3");
  if (!section) return;

  const searchInput = section.querySelector(".OurEvents_search_box__jnPYn input");
  const wrapper = section.querySelector(".OurEvents_card_wrap__BAXE_ .swiper-wrapper");
  const slides = Array.from(wrapper ? wrapper.querySelectorAll(".swiper-slide") : []);

  if (!searchInput || !wrapper || slides.length === 0) return;

  const noData = document.createElement("div");
  noData.className = "OurEvents_nodata__llH4O";
  noData.textContent = "No Matching Results";
  noData.style.display = "none";
  wrapper.parentElement.appendChild(noData);

  const cards = slides.map((slide) => {
    const title = slide.querySelector(".OurEvents_title__UjMEd")?.textContent || "";
    const description =
      slide.querySelector(".OurEvents_description__oDP4t")?.textContent || "";
    const datetime =
      slide.querySelector(".OurEvents_location__XA5Kn .text")?.textContent || "";
    const location =
      slide.querySelector(".OurEvents_location_link__Elqy4")?.textContent || "";

    return {
      slide,
      searchText: [title, description, datetime, location]
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase(),
    };
  });

  function updateSearch(query) {
    const normalized = query.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(({ slide, searchText }) => {
      const matches = !normalized || searchText.includes(normalized);
      slide.style.display = matches ? "" : "none";
      if (matches) visibleCount += 1;
    });

    noData.style.display = visibleCount === 0 ? "block" : "none";
  }

  searchInput.addEventListener("input", (event) => {
    updateSearch(event.target.value);
  });
})();
