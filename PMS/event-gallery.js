document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".EventGalleryNew_section__8wlsd");

  if (!section) {
    return;
  }

  const API_BASE = "https://api.mdx.ac.ae/api/event-gallery";
  const filterButtons = Array.from(
    section.querySelectorAll(".EventGalleryNew_filter_btn__mTzS2"),
  );
  const sortWrap = section.querySelector(".EventGalleryNew_filter_sort__GyXHw");
  const sortButton = sortWrap?.querySelector("#filter-button");
  const body = section.querySelector(".EventGalleryNew_section_body__tkLMN");
  const stack = body?.querySelector(".EventGalleryNew_figure_stack__dkPsQ");

  if (!filterButtons.length || !body || !stack) {
    return;
  }

  const sortOptions = [
    { label: "Newest To Oldest", value: "ASC" },
    { label: "Oldest To Newest", value: "DESC" },
  ];
  const initialMarkup = stack.innerHTML;
  const initialLabel =
    filterButtons.find((button) =>
      button.classList.contains("EventGalleryNew_active__HAwnp"),
    )?.textContent.trim() || filterButtons[0].textContent.trim();

  const state = {
    categoryLabel: initialLabel,
    categoryId: null,
    sortBy: "ASC",
  };

  const normalizeCategoryLabel = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const filterLabels = filterButtons.map((button) => button.textContent.trim());
  const knownCategoryIds = {
    "open-days": 1,
    conferences: 2,
    sports: 3,
    "domestic-events": 4,
    "campus-events": 5,
  };
  const categoryIdCache = new Map();
  let discoveryPromise = null;

  filterLabels.forEach((label) => {
    const normalized = normalizeCategoryLabel(label);
    const knownId = knownCategoryIds[normalized];

    if (knownId) {
      categoryIdCache.set(label, knownId);
    }
  });

  state.categoryId = categoryIdCache.get(state.categoryLabel) || 1;

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

  const decodeExistingImages = () => {
    section.querySelectorAll("img").forEach((image) => {
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

  const getGalleryImage = (item) => {
    const image = item?.image?.url || item?.image || item?.src || "";
    return toAbsoluteAssetUrl(image);
  };

  const renderGallery = (items) => {
    stack.innerHTML = items.length
      ? items
          .map((item) => {
            const image = getGalleryImage(item);

            return `
              <div>
                <figure class="ratio EventGalleryNew_figure__6zwcU">
                  <img
                    alt="${escapeHtml(item?.title || "Event Gallery")}"
                    loading="lazy"
                    decoding="async"
                    sizes="100vw"
                    src="${escapeHtml(image)}"
                    style="position: absolute; height: 100%; width: 100%; inset: 0px; object-fit: cover; color: transparent;"
                  >
                </figure>
              </div>
            `;
          })
          .join("")
      : '<div><p>No gallery images found for this category.</p></div>';
  };

  const restoreInitialGallery = () => {
    stack.innerHTML = initialMarkup;
    decodeExistingImages();
  };

  const showLoading = () => {
    stack.innerHTML = "<div><p>Loading gallery...</p></div>";
  };

  const extractCategoryCandidates = (value, results = []) => {
    if (!value) {
      return results;
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => extractCategoryCandidates(entry, results));
      return results;
    }

    if (typeof value !== "object") {
      return results;
    }

    const title = value.title || value.name || value.label || value.category_name;
    const id =
      typeof value.id === "number" || typeof value.id === "string"
        ? value.id
        : value.category_id;

    if (title && id) {
      results.push({ label: String(title).trim(), id: Number(id) });
    }

    Object.values(value).forEach((entry) => {
      if (entry && typeof entry === "object") {
        extractCategoryCandidates(entry, results);
      }
    });

    return results;
  };

  const payloadMatchesLabel = (payload, label) => {
    const normalizedLabel = normalizeCategoryLabel(label);
    const candidates = extractCategoryCandidates(payload);

    return candidates.some((candidate) => {
      if (!candidate?.label) {
        return false;
      }

      return normalizeCategoryLabel(candidate.label) === normalizedLabel;
    });
  };

  const discoverCategoryIds = async () => {
    if (discoveryPromise) {
      return discoveryPromise;
    }

    discoveryPromise = (async () => {
      const discoveryUrls = [
        API_BASE,
        `${API_BASE}?limit=1&offset=0&sort_by=${state.sortBy}`,
      ];

      for (const url of discoveryUrls) {
        try {
          const response = await fetch(url);

          if (!response.ok) {
            continue;
          }

          const payload = await response.json();
          const candidates = extractCategoryCandidates(payload);

          candidates.forEach((candidate) => {
            const normalized = normalizeCategoryLabel(candidate.label);

            const matchingLabel = filterLabels.find(
              (label) => normalizeCategoryLabel(label) === normalized,
            );

            if (matchingLabel) {
              categoryIdCache.set(matchingLabel, Number(candidate.id));
            }
          });

          if (filterLabels.every((label) => categoryIdCache.has(label))) {
            return categoryIdCache;
          }
        } catch (error) {
          console.warn("Unable to discover event gallery categories from", url, error);
        }
      }

      return categoryIdCache;
    })();

    return discoveryPromise;
  };

  const probeCategoryId = async (label) => {
    const normalized = normalizeCategoryLabel(label);
    const fallbackId = knownCategoryIds[normalized];

    if (fallbackId) {
      return fallbackId;
    }

    for (let candidateId = 1; candidateId <= 12; candidateId += 1) {
      try {
        const response = await fetch(
          `${API_BASE}?${new URLSearchParams({
            category: String(candidateId),
            limit: "1",
            offset: "0",
            sort_by: state.sortBy,
          }).toString()}`,
        );

        if (!response.ok) {
          continue;
        }

        const payload = await response.json();

        if (payloadMatchesLabel(payload, label)) {
          categoryIdCache.set(label, candidateId);
          return candidateId;
        }
      } catch (error) {
        console.warn("Unable to probe event gallery category id", candidateId, error);
      }
    }

    return null;
  };

  const resolveCategoryId = async (label) => {
    if (categoryIdCache.has(label)) {
      return categoryIdCache.get(label);
    }

    await discoverCategoryIds();

    if (categoryIdCache.has(label)) {
      return categoryIdCache.get(label);
    }

    const probedId = await probeCategoryId(label);

    if (probedId) {
      categoryIdCache.set(label, probedId);
      return probedId;
    }

    return null;
  };

  const updateActiveFilter = (button) => {
    filterButtons.forEach((item) => {
      item.classList.toggle(
        "EventGalleryNew_active__HAwnp",
        item === button,
      );
    });
  };

  const ensureSortMenu = () => {
    if (!sortWrap || !sortButton) {
      return null;
    }

    let menu = sortWrap.querySelector(".event-gallery-sort-menu");

    if (menu) {
      return menu;
    }

    menu = document.createElement("div");
    menu.className = "dropdown-menu show event-gallery-sort-menu";
    menu.style.display = "none";

    sortOptions.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "dropdown-item";
      button.textContent = option.label;
      button.addEventListener("click", async () => {
        state.sortBy = option.value;
        sortButton.textContent = option.label;
        sortButton.setAttribute("aria-expanded", "false");
        menu.style.display = "none";
        await fetchGallery();
      });
      menu.appendChild(button);
    });

    sortWrap.querySelector(".dropdown")?.appendChild(menu);
    return menu;
  };

  const fetchGallery = async () => {
    showLoading();

    try {
      const resolvedCategoryId = await resolveCategoryId(state.categoryLabel);

      if (!resolvedCategoryId) {
        if (state.categoryLabel === initialLabel) {
          restoreInitialGallery();
          return;
        }

        stack.innerHTML =
          "<div><p>Unable to determine this gallery category right now.</p></div>";
        return;
      }

      state.categoryId = resolvedCategoryId;

      const response = await fetch(
        `${API_BASE}?${new URLSearchParams({
          category: String(resolvedCategoryId),
          limit: "6",
          offset: "0",
          sort_by: state.sortBy,
        }).toString()}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch event gallery: ${response.status}`);
      }

      const payload = await response.json();
      const items = Array.isArray(payload.gallery) ? payload.gallery : [];

      if (!items.length && state.categoryLabel === initialLabel) {
        restoreInitialGallery();
        return;
      }

      renderGallery(items);
    } catch (error) {
      console.error(error);

      if (state.categoryLabel === initialLabel) {
        restoreInitialGallery();
        return;
      }

      stack.innerHTML =
        "<div><p>Unable to load gallery images right now.</p></div>";
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const label = button.textContent.trim();

      state.categoryLabel = label;
      updateActiveFilter(button);
      await fetchGallery();
    });
  });

  if (sortButton) {
    const menu = ensureSortMenu();

    sortButton.addEventListener("click", () => {
      if (!menu) {
        return;
      }

      const isOpen = menu.style.display === "block";
      menu.style.display = isOpen ? "none" : "block";
      sortButton.setAttribute("aria-expanded", String(!isOpen));
    });

    document.addEventListener("click", (event) => {
      if (!sortWrap.contains(event.target)) {
        if (menu) {
          menu.style.display = "none";
        }
        sortButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  decodeExistingImages();
});
