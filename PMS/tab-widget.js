document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".TabWidget_events_tabs__lurl6");

  if (!section) {
    return;
  }

  const COURSE_LIST_API = "https://api.mdx.ac.ae/api/course-suggestion/course-list";
  const POSTGRAD_DEPARTMENT = "Computer Engineering & Informatics";
  const POSTGRAD_LIMIT = 24;

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

  const toAbsoluteAssetUrl = (value) => {
    if (!value) {
      return "";
    }

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    if (value.startsWith("/uploads/")) {
      return `https://api.mdx.ac.ae${value}`;
    }

    return value;
  };

  const decodeImageSources = (container) => {
    container.querySelectorAll("img").forEach((image) => {
      const src = image.getAttribute("src");
      const srcset = image.getAttribute("srcset");
      const decodedSrc = toAbsoluteAssetUrl(decodeNextImageUrl(src));

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

          const decodedUrl = toAbsoluteAssetUrl(decodeNextImageUrl(url));

          return size ? `${decodedUrl} ${size}` : decodedUrl;
        })
        .join(", ");

      image.setAttribute("srcset", decodedSrcset);
    });
  };

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const tabs = Array.from(section.querySelectorAll(".TabWidget_tabs_wrap__64fUv .nav-link"));
  const tabContent = section.querySelector(".tab-content");

  if (!tabs.length || !tabContent) {
    return;
  }

  const sourcePane = tabContent.querySelector(".tab-pane");

  const createPlaceholderImage = (title) => {
    const safeTitle = String(title || "Programme").trim();
    const initials = safeTitle
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
    const seed = Array.from(safeTitle).reduce(
      (total, char) => total + char.charCodeAt(0),
      0,
    );
    const hue = seed % 360;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="hsl(${hue} 30% 92%)"/>
            <stop offset="100%" stop-color="hsl(${(hue + 35) % 360} 24% 82%)"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="800" fill="url(#g)"/>
        <circle cx="970" cy="180" r="150" fill="rgba(255,255,255,0.35)"/>
        <circle cx="210" cy="650" r="220" fill="rgba(255,255,255,0.22)"/>
        <text x="80" y="620" font-family="Arial, Helvetica, sans-serif" font-size="180" font-weight="700" fill="rgba(30,30,30,0.75)">${initials || "PG"}</text>
        <text x="82" y="710" font-family="Arial, Helvetica, sans-serif" font-size="42" fill="rgba(30,30,30,0.72)">${safeTitle
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")}</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const getCardImage = (item) => {
    const candidates = [
      item.image_full_url,
      item.course_image_full_url,
      item.course_image,
      item.thumbnail_image,
      item.thumbnail,
      item.image,
      item.img,
      item.banner_image,
    ];

    const image = candidates.find(Boolean);

    return image ? toAbsoluteAssetUrl(decodeNextImageUrl(image)) : "";
  };

  const getCardLink = (item) =>
    item.url ||
    item.links ||
    item.link ||
    item.slug_url ||
    item.course_url ||
    "#";

  const getCardTitle = (item) =>
    item.title ||
    item.name ||
    item.course_name ||
    item.program_name ||
    "";

  const renderProgramCards = (items) => {
    const cards = items
      .filter((item) => getCardTitle(item))
      .map((item) => {
        const title = getCardTitle(item);
        const link = getCardLink(item);
        const image = getCardImage(item) || createPlaceholderImage(title);

        return `
          <div>
            <a class="undefined nothover" href="${escapeHtml(link)}">
              <div class="FacultyCard_faculty_item___FeiD">
                <div class="FacultyCard_faculty_item_img__VwUOY">
                  <div class="FacultyCard_img_wrap__offNB">
                    <img
                      alt="${escapeHtml(title)}"
                      loading="lazy"
                      decoding="async"
                      sizes="100vw"
                      src="${escapeHtml(image)}"
                      style="
                        position: absolute;
                        height: 100%;
                        width: 100%;
                        inset: 0px;
                        object-fit: cover;
                        color: transparent;
                      "
                    />
                  </div>
                </div>
                <div class="FacultyCard_faculty_item_info__AaZLo">
                  <div>
                    <div class="d-flex align-items-start justify-content-between">
                      <h5>${escapeHtml(title)}</h5>
                      <span class="d-flex FacultyCard_arrow__AY2IT">
                        <svg viewBox="0 0 1024 1024" style="display: inline-block; stroke: currentcolor; fill: currentcolor; width: 13px; height: 13px;">
                          <path d="M105.22 1024l-105.22-105.22 896.902-896.977 105.22 105.22z"></path>
                          <path d="M1023.628 952.34h-148.826v-803.663h-788.78v-148.826h937.606z"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>
        `;
      })
      .join("");

    return `
      <div class="false TabWidget_tab_container__NSb3d">
        <div>
          <div class="container-fluid">
            <div class="row FacultyStack_row__wItJ7 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
              ${cards || '<div><p>No postgraduate programmes found.</p></div>'}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const createPane = (tab) => {
    const controlsId = tab.getAttribute("aria-controls");

    if (!controlsId) {
      return null;
    }

    let pane = section.querySelector(`#${CSS.escape(controlsId)}`);

    if (pane) {
      return pane;
    }

    pane = document.createElement("div");
    pane.id = controlsId;
    pane.className = "fade tab-pane";
    pane.setAttribute("role", "tabpanel");
    pane.setAttribute("aria-labelledby", tab.id || "");
    tabContent.appendChild(pane);

    return pane;
  };

  const panes = tabs.map((tab) => createPane(tab)).filter(Boolean);

  if (!panes.length) {
    return;
  }

  panes.forEach((pane) => {
    if (pane === sourcePane) {
      decodeImageSources(pane);
    }
  });

  const postgraduateTab = tabs.find((tab) =>
    /postgraduate/i.test(tab.textContent || ""),
  );
  const postgraduatePane = postgraduateTab ? createPane(postgraduateTab) : null;
  let postgraduateLoaded = false;
  let postgraduateLoading = null;

  const loadPostgraduatePane = async () => {
    if (!postgraduatePane || postgraduateLoaded) {
      return;
    }

    if (postgraduateLoading) {
      await postgraduateLoading;
      return;
    }

    postgraduatePane.innerHTML =
      '<div class="false TabWidget_tab_container__NSb3d"><div><div class="container-fluid"><p>Loading programmes...</p></div></div></div>';

    postgraduateLoading = fetch(
      `${COURSE_LIST_API}?${new URLSearchParams({
        ug: "false",
        pg: "true",
        ifp: "false",
        mba: "false",
        department: POSTGRAD_DEPARTMENT,
        offset: "0",
        limit: String(POSTGRAD_LIMIT),
      }).toString()}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch postgraduate programmes: ${response.status}`);
        }

        return response.json();
      })
      .then((payload) => {
        const items = Array.isArray(payload.data) ? payload.data : [];
        postgraduatePane.innerHTML = renderProgramCards(items);
        decodeImageSources(postgraduatePane);
        postgraduateLoaded = true;
      })
      .catch((error) => {
        console.error(error);
        postgraduatePane.innerHTML =
          '<div class="false TabWidget_tab_container__NSb3d"><div><div class="container-fluid"><p>Unable to load postgraduate programmes right now.</p></div></div></div>';
      })
      .finally(() => {
        postgraduateLoading = null;
      });

    await postgraduateLoading;
  };

  const activateTab = async (tab) => {
    if (tab === postgraduateTab) {
      await loadPostgraduatePane();
    }

    const controlsId = tab.getAttribute("aria-controls");
    const targetPane = controlsId
      ? section.querySelector(`#${CSS.escape(controlsId)}`)
      : null;

    tabs.forEach((item) => {
      const isActive = item === tab;

      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.setAttribute("tabindex", isActive ? "0" : "-1");
    });

    panes.forEach((pane) => {
      const isActive = pane === targetPane;

      pane.classList.toggle("active", isActive);
      pane.classList.toggle("show", isActive);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", async (event) => {
      event.preventDefault();
      await activateTab(tab);
    });
  });

  const activeTab = tabs.find((tab) => tab.classList.contains("active")) || tabs[0];
  activateTab(activeTab);
});
