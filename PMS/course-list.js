(function () {
  const section = document.querySelector(".CourseList_section__jku_W");
  if (!section) return;

  const API_BASE = "https://api.mdx.ac.ae/api/course-suggestion/course-list";
  const state = {
    department: "All",
    page: 1,
    limit: 10,
    flags: {
      ug: true,
      pg: true,
      ifp: true,
      mba: true,
    },
  };

  const desktopButtons = Array.from(
    section.querySelectorAll(".CourseList_tab_button__pd4Qn"),
  );
  const resultInner = section.querySelector(".CourseList_result_inner__2qq1h");
  const linksWrap = section.querySelector(".CourseList_links__xkpwl");
  const paginationWrap = section.querySelector(
    ".CourseList_pagination_wrapper__nNQdn",
  );
  const pageCountWrap = section.querySelector(".CourseList_page_count__rkidZ");
  const pageSelectRoot = section.querySelector(".CourseList_pageselect__X7UrZ");
  const mobileSelectRoot = section.querySelector(".CourseList_selectbox__3Bp9l");
  const resultColumn = section.querySelector(".col-12.col-lg-9");

  if (!resultInner || !linksWrap || !paginationWrap) return;

  const categoryValueMap = {
    "All Programmes": "All",
    "Accounting and Finance": "Accounting and Finance",
    "Art & Design": "Art & Design",
    Business: "Business",
    "Computer Engineering & Informatics": "Computer Engineering & Informatics",
    "Health & Education": "Health & Education",
    IFP: "IFP",
    Law: "Law",
    MBA: "MBA",
    Media: "Media",
    Psychology: "Psychology",
    "Sport Science": "Sport Science",
  };

  const categories = desktopButtons.map((button) => ({
    label: button.querySelector(".CourseList_text_span__yuIjk")?.textContent.trim() || "",
    value:
      categoryValueMap[
        button.querySelector(".CourseList_text_span__yuIjk")?.textContent.trim() || ""
      ] ||
      button.querySelector(".CourseList_text_span__yuIjk")?.textContent.trim() ||
      "",
    button,
  }));

  if (categories.length) {
    state.department = categories.find((item) =>
      item.button.classList.contains("CourseList_active__tXsOy"),
    )?.value || categories[0].value;
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildUrl() {
    const params = new URLSearchParams({
      ug: String(state.flags.ug),
      pg: String(state.flags.pg),
      ifp: String(state.flags.ifp),
      mba: String(state.flags.mba),
      department: state.department,
      offset: String((state.page - 1) * state.limit),
      limit: String(state.limit),
    });

    return `${API_BASE}?${params.toString()}`;
  }

  function showLoading() {
    resultInner.innerHTML = `
      <div class="text-center d-flex justify-content-center align-items-center min-h-50">
        <span class="CourseList_loading__CizRK"></span>
      </div>
    `;
  }

  function scrollResultsIntoView() {
    if (!resultColumn) return;
    const top = resultColumn.getBoundingClientRect().top + window.scrollY - 180;
    window.scrollTo({ top, behavior: "smooth" });
  }

  function renderLinks(items) {
    if (!items.length) {
      resultInner.innerHTML = "<p>No courses found in this category</p>";
      return;
    }

    resultInner.innerHTML = `
      <div class="CourseList_links__xkpwl">
        ${items
          .map(
            (item) => `
              <a href="${escapeHtml(item.url || "#")}">
                <span class="CourseList_text_span__yuIjk">${escapeHtml(item.title || "")}</span>
                <span class="CourseList_icon_span__E1lN3"></span>
              </a>
            `,
          )
          .join("")}
      </div>
    `;
  }

  function getPagesToShow(currentPage, totalPages) {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [];
    if (currentPage < 3) {
      pages.push(1, 2, 3, "...", totalPages);
      return pages;
    }

    pages.push(1);
    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  }

  function renderPagination(totalPages, total) {
    pageCountWrap.style.display = total > 10 ? "" : "none";

    const countTextNode = Array.from(pageCountWrap.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent.includes("of"),
    );
    if (countTextNode) {
      countTextNode.textContent = `of ${totalPages}`;
    }

    const nav = document.createElement("div");
    nav.className = "d-flex justify-content-center";

    const prev = document.createElement("button");
    prev.disabled = state.page === 1;
    prev.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none"><path d="M7.5 13L1.5 7L7.5 1" stroke="black" stroke-width="1.5"></path></svg>';
    prev.addEventListener("click", () => {
      if (state.page === 1) return;
      state.page -= 1;
      fetchAndRender(true);
    });
    nav.appendChild(prev);

    getPagesToShow(state.page, totalPages).forEach((item, index) => {
      if (item === "...") {
        const span = document.createElement("span");
        span.textContent = "...";
        nav.appendChild(span);
        return;
      }

      const button = document.createElement("button");
      button.textContent = String(item);
      if (item === state.page) {
        button.className = "CourseList_btn_active__C1EK3";
      }
      button.addEventListener("click", () => {
        state.page = Number(item);
        fetchAndRender(true);
      });
      nav.appendChild(button);
    });

    const next = document.createElement("button");
    next.disabled = state.page === totalPages;
    next.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none"><path d="M1.5 13L7.5 7L1.5 1" stroke="black" stroke-width="1.5"></path></svg>';
    next.addEventListener("click", () => {
      if (state.page === totalPages) return;
      state.page += 1;
      fetchAndRender(true);
    });
    nav.appendChild(next);

    const currentNav = paginationWrap.querySelector(".d-flex.justify-content-center");
    if (currentNav) currentNav.replaceWith(nav);
    else paginationWrap.appendChild(nav);
  }

  function setActiveDepartment(value) {
    state.department = value;
    categories.forEach((category) => {
      category.button.classList.toggle(
        "CourseList_active__tXsOy",
        category.value === value,
      );
    });
  }

  function setupPseudoSelect(root, options, getValue, onChange, prefix) {
    if (!root) return;

    const control = root.querySelector(`.${prefix}__control`);
    const valueNode = root.querySelector(`.${prefix}__single-value`);
    root.style.position = "relative";

    const menu = document.createElement("div");
    menu.className = `${prefix}__menu`;
    menu.style.display = "none";
    menu.style.position = "absolute";
    menu.style.left = "0";
    menu.style.right = "0";
    menu.style.zIndex = "20";

    if (prefix === "page-select") {
      menu.style.bottom = "calc(100% + 1px)";
    } else {
      menu.style.top = "calc(100% + 1px)";
    }

    const list = document.createElement("div");
    list.className = `${prefix}__menu-list`;

    options.forEach((option) => {
      const optionNode = document.createElement("div");
      optionNode.className = `${prefix}__option`;
      optionNode.textContent = option.label;
      optionNode.addEventListener("click", () => {
        valueNode.textContent = option.label;
        menu.style.display = "none";
        control.classList.remove(
          `${prefix}__control--is-focused`,
          `${prefix}__control--menu-is-open`,
        );
        onChange(option.value);
      });
      list.appendChild(optionNode);
    });

    menu.appendChild(list);
    root.appendChild(menu);

    function syncOptionState() {
      list.querySelectorAll(`.${prefix}__option`).forEach((node) => {
        node.classList.toggle(
          `${prefix}__option--is-selected`,
          node.textContent.trim() === String(getValue()),
        );
      });
    }

    control.addEventListener("click", () => {
      const isOpening = menu.style.display === "none";
      menu.style.display = isOpening ? "block" : "none";
      control.classList.toggle(`${prefix}__control--is-focused`, isOpening);
      control.classList.toggle(`${prefix}__control--menu-is-open`, isOpening);
      if (isOpening) syncOptionState();
    });

    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) {
        menu.style.display = "none";
        control.classList.remove(
          `${prefix}__control--is-focused`,
          `${prefix}__control--menu-is-open`,
        );
      }
    });
  }

  async function fetchAndRender(shouldScroll) {
    showLoading();

    try {
      const response = await fetch(buildUrl());
      if (!response.ok) {
        throw new Error(`Failed to fetch course list: ${response.status}`);
      }

      const payload = await response.json();
      const items = Array.isArray(payload.data) ? payload.data : [];
      const total = Number(payload.count || 0);
      const totalPages = Math.max(1, Math.ceil(total / state.limit));

      renderLinks(items);
      renderPagination(totalPages, total);

      if (shouldScroll) {
        window.setTimeout(scrollResultsIntoView, 100);
      }
    } catch (error) {
      resultInner.innerHTML = "<p>No courses found in this category</p>";
      console.error(error);
    }
  }

  desktopButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const label = button.querySelector(".CourseList_text_span__yuIjk")?.textContent.trim();
      const category = categories.find((item) => item.label === label);
      if (!category) return;
      setActiveDepartment(category.value);
      state.page = 1;
      fetchAndRender(true);
    });
  });

  setupPseudoSelect(
    mobileSelectRoot,
    categories.map(({ label, value }) => ({ label, value })),
    () =>
      categories.find((item) => item.value === state.department)?.label ||
      state.department,
    (value) => {
      setActiveDepartment(String(value));
      state.page = 1;
      fetchAndRender(false);
    },
    "enquiry-select",
  );

  setupPseudoSelect(
    pageSelectRoot,
    [10, 20, 30, 40].map((value) => ({ label: String(value), value })),
    () => state.limit,
    (value) => {
      state.limit = Number(value);
      state.page = 1;
      const valueNode = pageSelectRoot.querySelector(".page-select__single-value");
      if (valueNode) valueNode.textContent = String(value);
      fetchAndRender(false);
    },
    "page-select",
  );

  fetchAndRender(false);
})();
