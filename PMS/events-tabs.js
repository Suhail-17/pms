document.addEventListener("DOMContentLoaded", () => {
  const eventsSection = document.getElementById("events");
  if (!eventsSection) return;

  // Handle Horizontal Tabs
  const horizontalTabs = Array.from(eventsSection.querySelectorAll(".TabWidget_tabs_wrap__64fUv .nav-link"));
  
  // Directly grab the outer `.tab-content` to avoid selecting inner `.tab-pane`s
  const outerTabContent = eventsSection.querySelector(".col-lg-12 > .tab-content");
  if (!outerTabContent) return;
  
  const outerPanes = Array.from(outerTabContent.children).filter(child => child.classList.contains("tab-pane"));

  const activateHorizontalTab = (tab) => {
    // Deactivate all horizontal tabs
    horizontalTabs.forEach(t => {
      t.classList.remove("active");
      t.setAttribute("aria-selected", "false");
      t.setAttribute("tabindex", "-1");
    });

    // Activate the clicked horizontal tab
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    tab.setAttribute("tabindex", "0");

    const targetId = tab.getAttribute("aria-controls");
    
    // Hide all outer panes
    outerPanes.forEach(pane => {
      pane.classList.remove("active", "show");
    });

    // Show the target outer pane with a slight delay for fade transition
    const targetPane = document.getElementById(targetId);
    if (targetPane) {
      targetPane.style.transition = "opacity 0.3s ease-in-out";
      targetPane.classList.add("active");
      setTimeout(() => targetPane.classList.add("show"), 10);
    }
  };

  horizontalTabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      // Avoid retriggering if already active
      if (!tab.classList.contains("active")) {
        activateHorizontalTab(tab);
      }
    });
  });

  // Handle Vertical Tabs (within each horizontal outer pane)
  const verticalTabGroups = Array.from(eventsSection.querySelectorAll(".VerticalTabs_vertical_nav__s4yqe"));

  verticalTabGroups.forEach(group => {
    const verticalTabs = Array.from(group.querySelectorAll(".nav-link"));
    // Find the corresponding content container for these vertical tabs
    // It's the sibling `.col-lg-6` which contains a `.tab-content`
    const paneContainer = group.closest(".row").querySelector(".tab-content");
    if (!paneContainer) return;
    
    const innerPanes = Array.from(paneContainer.children).filter(child => child.classList.contains("tab-pane"));

    const activateVerticalTab = (vTab) => {
      // Deactivate all vertical tabs in this group
      verticalTabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
        t.setAttribute("tabindex", "-1");
      });

      // Activate clicked vertical tab
      vTab.classList.add("active");
      vTab.setAttribute("aria-selected", "true");
      vTab.setAttribute("tabindex", "0");

      const targetId = vTab.getAttribute("aria-controls");
      
      // Hide all inner panes
      innerPanes.forEach(pane => {
        pane.classList.remove("active", "show");
      });

      // Show target inner pane with fade transition
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.style.transition = "opacity 0.3s ease-in-out";
        targetPane.classList.add("active");
        // Timeout ensures display:block applies before opacity kicks in
        setTimeout(() => targetPane.classList.add("show"), 10);
      }
    };

    verticalTabs.forEach(vTab => {
      vTab.addEventListener("click", (e) => {
        e.preventDefault();
        // Avoid retriggering if already active
        if (!vTab.classList.contains("active")) {
          activateVerticalTab(vTab);
        }
      });
    });
  });
});
