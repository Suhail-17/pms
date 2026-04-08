document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector('section[data-cursor="scroll-down"]');

  if (!section) {
    return;
  }

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

  section.querySelectorAll("img").forEach((image) => {
    const src = image.getAttribute("src");
    const srcset = image.getAttribute("srcset");
    const decodedSrc = decodeNextImageUrl(src);

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

        const decodedUrl = decodeNextImageUrl(url);

        return size ? `${decodedUrl} ${size}` : decodedUrl;
      })
      .join(", ");

    image.setAttribute("srcset", decodedSrcset);
  });
});
