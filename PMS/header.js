(function () {
  const header = document.querySelector(".Menu_header__XEQwJ");
  if (!header) return;

  const body = document.body;
  const hamburger = header.querySelector(".Menu_hamburger__Sctg3");
  const offcanvas = header.querySelector(".Menu_nav_offcanvas__CObyB");
  const desktopTabs = Array.from(
    header.querySelectorAll(".Menu_nav_link_desktop__gxbei"),
  );
  const desktopPanes = Array.from(
    header.querySelectorAll(".Menu_tab_content_desktop__z8kBS"),
  );
  const desktopMenuItems = Array.from(
    header.querySelectorAll(".Menu_main_desktop_menu__8qnLt > ul > li"),
  );

  const OPENED_CLASS = "Menu_opened__J8Dnz";
  const OFFCANVAS_VISIBLE_CLASS = "Menu_nav_offcanvas_show__NTPzr";
  const OFFCANVAS_MENUS_CLASS = "Menu_nav_offcanvas_show_menus__fliN3";
  const SCROLLED_CLASS = "Menu_header_scrolled__r2M3m";
  const MOBILE_BREAKPOINT = 1200;

  function decodeNextImageUrl(url) {
    if (!url || !url.includes("/_next/image?")) return null;

    try {
      const resolved = new URL(url, window.location.href);
      const encoded = resolved.searchParams.get("url");
      return encoded ? decodeURIComponent(encoded) : null;
    } catch (error) {
      return null;
    }
  }

  function decodeHeaderImages() {
    header.querySelectorAll('img[src*="/_next/image?"], img[srcset*="/_next/image?"]').forEach((img) => {
      const decodedSrc = decodeNextImageUrl(img.getAttribute("src"));
      if (decodedSrc) {
        img.setAttribute("src", decodedSrc);
      }

      const srcset = img.getAttribute("srcset");
      if (!srcset || !srcset.includes("/_next/image?")) return;

      const rebuilt = srcset
        .split(",")
        .map((entry) => {
          const parts = entry.trim().split(/\s+/);
          const originalUrl = decodeNextImageUrl(parts[0]);
          if (!originalUrl) return entry.trim();
          return parts[1] ? `${originalUrl} ${parts[1]}` : originalUrl;
        })
        .join(", ");

      img.setAttribute("srcset", rebuilt);
    });
  }

  function updateScrollState() {
    header.classList.toggle(SCROLLED_CLASS, window.scrollY > 20);
  }

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function setMenuState(isOpen) {
    if (!hamburger || !offcanvas) return;

    hamburger.classList.toggle(OPENED_CLASS, isOpen);
    offcanvas.classList.toggle(OFFCANVAS_VISIBLE_CLASS, isOpen);
    body.classList.toggle("show-menu", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));

    window.clearTimeout(setMenuState.menuTimer);

    if (isOpen) {
      body.style.paddingRight = `${Math.max(0, getScrollbarWidth())}px`;
      setMenuState.menuTimer = window.setTimeout(() => {
        offcanvas.classList.add(OFFCANVAS_MENUS_CLASS);
      }, 120);
      return;
    }

    offcanvas.classList.remove(OFFCANVAS_MENUS_CLASS);
    body.style.paddingRight = "";
  }

  function toggleMenu() {
    setMenuState(!body.classList.contains("show-menu"));
  }

  function closeMenu() {
    setMenuState(false);
  }

  function activateDesktopTab(tab) {
    const targetId = tab.getAttribute("aria-controls");
    if (!targetId) return;

    desktopTabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    desktopPanes.forEach((pane) => {
      const isActive = pane.id === targetId;
      pane.classList.toggle("active", isActive);
      pane.classList.toggle("show", isActive);
    });
  }

  function closeAllMegaMenus() {
    desktopMenuItems.forEach((item) => {
      const menu = item.querySelector(":scope > .Menu_mega_menu___qQEv");
      const inner = menu && menu.querySelector(".Menu_megamenu_new__Y7zj_");
      if (!menu || !inner) return;

      menu.style.display = "none";
      inner.style.opacity = "0";
    });
  }

  function openMegaMenu(item) {
    if (window.innerWidth < MOBILE_BREAKPOINT) return;

    const menu = item.querySelector(":scope > .Menu_mega_menu___qQEv");
    const inner = menu && menu.querySelector(".Menu_megamenu_new__Y7zj_");
    if (!menu || !inner) return;

    closeAllMegaMenus();
    menu.style.display = "block";

    requestAnimationFrame(() => {
      inner.style.opacity = "1";
    });
  }

  function handleDesktopResize() {
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      closeAllMegaMenus();
    }
  }

  if (hamburger && offcanvas) {
    hamburger.setAttribute("type", "button");
    hamburger.setAttribute("aria-expanded", "false");
    hamburger.addEventListener("click", toggleMenu);

    document.addEventListener("click", (event) => {
      if (!body.classList.contains("show-menu")) return;
      if (header.contains(event.target)) return;
      closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        closeAllMegaMenus();
      }
    });
  }

  desktopTabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      activateDesktopTab(tab);
    });
  });

  desktopMenuItems.forEach((item) => {
    const trigger = item.querySelector(":scope > a");
    const megaMenu = item.querySelector(":scope > .Menu_mega_menu___qQEv");
    if (!trigger || !megaMenu) return;

    item.addEventListener("mouseenter", () => openMegaMenu(item));
    item.addEventListener("mouseleave", () => closeAllMegaMenus());

    trigger.addEventListener("focus", () => openMegaMenu(item));

    item.addEventListener("focusout", (event) => {
      const nextTarget = event.relatedTarget;
      if (nextTarget && item.contains(nextTarget)) return;
      closeAllMegaMenus();
    });
  });

  window.addEventListener("scroll", updateScrollState, { passive: true });
  window.addEventListener("resize", () => {
    handleDesktopResize();
    if (window.innerWidth >= MOBILE_BREAKPOINT) {
      closeMenu();
    }
  });

  decodeHeaderImages();
  updateScrollState();
  handleDesktopResize();
})();
