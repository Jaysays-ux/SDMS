/* ==========================================================================
   SRI DURGA MEDICAL & GENERAL STORES - ANIMATION BINDINGS (animations.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
});

// Configure Intersection Observer to animate elements as they enter viewport
function initScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          // Stop observing once animated to avoid repeated triggers
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null, // viewport
      threshold: 0.15, // trigger when 15% of the element is visible
      rootMargin: "0px 0px -50px 0px" // bottom offset offset trigger margin
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    // Fallback: immediately activate animations if browser doesn't support IntersectionObserver
    revealElements.forEach(element => {
      element.classList.add("active");
    });
  }
}
