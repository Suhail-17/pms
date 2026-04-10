document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".OurFacilitiesWidget_section__RwmLW");
  if (!section) return;

  const wrappers = section.querySelectorAll(".digits-wrapper");
  const animationTargets = [];

  // Reset counters to 0 initially
  wrappers.forEach((wrapper) => {
    const transform = wrapper.style.transform;
    if (transform && transform.includes("translateY")) {
      // Save the final inline values
      animationTargets.push({
        element: wrapper,
        finalTransform: transform,
        // use a slightly faster/snappier transition but respect the inline one if we want
        transition: "transform 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)"
      });
      // Reset position to 0 directly without transition
      wrapper.style.transition = "none";
      wrapper.style.transform = "translateY(0px)";
    }
  });

  // Observe scroll intersection to trigger animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Trigger reflow to ensure the transition from 'none' takes effect safely
          void entry.target.offsetWidth;

          animationTargets.forEach((target, index) => {
            // Apply a slight delay to each column for a cooler "rolling" effect
            target.element.style.transition = target.transition;
            target.element.style.transitionDelay = `${index * 0.1}s`;
            target.element.style.transform = target.finalTransform;
          });

          // Unobserve so it only happens once
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2, // Trigger when 20% of section is visible
    }
  );

  observer.observe(section);
});
