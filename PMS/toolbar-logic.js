(function () {
  const toolbar = document.querySelector(".ToolbarNew_toolbar__G4qwY");
  if (!toolbar) return;

  const btnGroup = toolbar.querySelector(".ToolbarNew_btn_group__fjzTX");
  const toggleBtn = toolbar.querySelector(".ToolbarNew_btn__kny1D.ToolbarNew_btn_expand__XTl3K");
  const shape = toolbar.querySelector(".ToolbarNew_active_shape__ImTu1");
  const btnWrappers = Array.from(toolbar.querySelectorAll(".ToolbarNew_btn_wrap__DY5dP"));

  function toggleToolbar(expand) {
    if (!toggleBtn || !btnGroup || !shape) return;
    if (expand) {
      // Open toolbar
      toggleBtn.classList.add("ToolbarNew_btn_expand_open__pfYPj");
      btnGroup.classList.add("ToolbarNew_btn_group_expanded__sh6Xk");
      shape.classList.add("ToolbarNew_show_shape__9XtEe");
    } else {
      // Close toolbar
      toggleBtn.classList.remove("ToolbarNew_btn_expand_open__pfYPj");
      btnGroup.classList.remove("ToolbarNew_btn_group_expanded__sh6Xk");
      shape.classList.remove("ToolbarNew_show_shape__9XtEe");
    }
  }

  if (toggleBtn && btnGroup && shape) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = toggleBtn.classList.contains("ToolbarNew_btn_expand_open__pfYPj");
      toggleToolbar(!isOpen);
    });

    // Scroll logic
    let lastScrollY = window.scrollY;
    
    // Bottom menu logic
    const bottomMenu = document.querySelector(".BottomMenu_tool_wrap__T_NZJ");
    const updateBottomMenu = (scrollY) => {
      if (!bottomMenu) return;
      const isAtTop = scrollY <= 100;
      
      const scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
      );
      const isAtBottom = (window.innerHeight + scrollY) >= scrollHeight - 50;

      if (isAtTop || isAtBottom) {
        bottomMenu.classList.remove("BottomMenu_tool_wrap_open__A7nWf");
      } else {
        bottomMenu.classList.add("BottomMenu_tool_wrap_open__A7nWf");
      }
    };

    // Initialize based on current scroll position on load
    const isAtTop = window.scrollY <= 100;
    toggleToolbar(isAtTop);
    if (isAtTop) {
      toggleBtn.classList.add("ToolbarNew_hide__i2aHk");
    } else {
      toggleBtn.classList.remove("ToolbarNew_hide__i2aHk");
    }
    updateBottomMenu(window.scrollY);

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;
      const crossedDown = currentScrollY > 100 && lastScrollY <= 100;
      const crossedUp = currentScrollY <= 100 && lastScrollY > 100;

      if (crossedDown) {
        toggleToolbar(false);
        toggleBtn.classList.remove("ToolbarNew_hide__i2aHk");
      } else if (crossedUp) {
        toggleToolbar(true);
        toggleBtn.classList.add("ToolbarNew_hide__i2aHk");
      }
      
      updateBottomMenu(currentScrollY);
      
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  if (shape && btnWrappers.length > 0) {
    btnWrappers.forEach((wrapper, index) => {
      wrapper.addEventListener("mouseenter", () => {
        // Remove existing colors
        shape.classList.remove("color_1", "color_2", "color_3", "color_4", "color_5");
        
        // Add proper color based on index (1-5)
        const colorIndex = (index % 5) + 1;
        shape.classList.add(`color_${colorIndex}`);
        
        // Calculate offset Top property for positioning the shape behind hovered icon
        const top = wrapper.offsetTop;
        shape.style.setProperty("--top-value", `${top}px`);
      });
    });

    // Initialize first position upon load to be accurate
    requestAnimationFrame(() => {
      if (btnWrappers[0]) {
        shape.style.setProperty("--top-value", `${btnWrappers[0].offsetTop}px`);
      }
    });
  }
})();
