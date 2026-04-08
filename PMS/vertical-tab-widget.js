document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(
    ".VerticalTabWidget_course_timeline_box__dwwyY",
  );

  if (!sections.length) {
    return;
  }

  const activateTab = (section, tab) => {
    const tabs = Array.from(
      section.querySelectorAll(".CourseTab_count_tabs__vSxlL .nav-link"),
    );
    const panes = Array.from(
      section.querySelectorAll(".VerticalTabWidget_course_timeline_tabresults__UqgwP .tab-pane"),
    );
    const controlsId = tab.getAttribute("aria-controls");
    const requestedPane = controlsId
      ? section.querySelector(`#${CSS.escape(controlsId)}`)
      : null;
    const currentPane =
      panes.find((pane) => pane.classList.contains("active")) || panes[0] || null;
    const targetPane = requestedPane || currentPane;

    tabs.forEach((item) => {
      const isActive = item === tab;

      item.classList.toggle("active", isActive);
      item.classList.toggle("CourseTab_active__5XNJk", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    if (!targetPane) {
      return;
    }

    panes.forEach((pane) => {
      const isActive = pane === targetPane;

      pane.classList.toggle("active", isActive);
      pane.classList.toggle("show", isActive);
    });
  };

  const setupAccordion = (root) => {
    const items = Array.from(root.querySelectorAll(".accordion-item"));

    if (!items.length) {
      return;
    }

    const openItem = (item) => {
      items.forEach((currentItem) => {
        const button = currentItem.querySelector(".accordion-button");
        const collapse = currentItem.querySelector(".accordion-collapse");
        const shouldOpen = currentItem === item;

        if (!button || !collapse) {
          return;
        }

        button.classList.toggle("collapsed", !shouldOpen);
        button.setAttribute("aria-expanded", String(shouldOpen));
        collapse.classList.toggle("show", shouldOpen);
      });
    };

    items.forEach((item, index) => {
      const button = item.querySelector(".accordion-button");

      if (!button) {
        return;
      }

      button.addEventListener("click", (event) => {
        event.preventDefault();
        const isExpanded = button.getAttribute("aria-expanded") === "true";

        if (isExpanded) {
          button.classList.add("collapsed");
          button.setAttribute("aria-expanded", "false");
          item.querySelector(".accordion-collapse")?.classList.remove("show");
          return;
        }

        openItem(item);
      });

      if (index === 0 && button.getAttribute("aria-expanded") !== "true") {
        openItem(item);
      }
    });
  };

  sections.forEach((section) => {
    const tabs = Array.from(
      section.querySelectorAll(".CourseTab_count_tabs__vSxlL .nav-link"),
    );
    const accordions = section.querySelectorAll(".accordion");

    tabs.forEach((tab) => {
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        activateTab(section, tab);
      });
    });

    accordions.forEach((accordion) => {
      setupAccordion(accordion);
    });

    const activePane = section.querySelector(
      ".VerticalTabWidget_course_timeline_tabresults__UqgwP .tab-pane.active",
    );
    const activeTab = activePane
      ? tabs.find(
          (tab) => tab.getAttribute("aria-controls") === activePane.getAttribute("id"),
        )
      : tabs.find((tab) => tab.classList.contains("active")) || tabs[0];

    if (activeTab) {
      activateTab(section, activeTab);
    }
  });
});
