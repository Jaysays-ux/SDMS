/* ==========================================================================
   SRI DURGA MEDICAL & GENERAL STORES - DARK MODE CONTROLLER (darkmode.js)
   ========================================================================== */

(function () {
  // Read and apply immediate state to prevent page flicker on load
  const isDark = localStorage.getItem("sdms_dark") === "enabled";
  if (isDark) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const darkToggle = document.getElementById("dark-toggle");
  
  if (darkToggle) {
    // Set initial icon based on theme state
    updateDarkToggleIcon(darkToggle);

    darkToggle.addEventListener("click", () => {
      const isCurrentlyDark = document.body.classList.contains("dark");
      
      if (isCurrentlyDark) {
        document.body.classList.remove("dark");
        localStorage.setItem("sdms_dark", "disabled");
        showToast("Light Mode enabled!");
      } else {
        document.body.classList.add("dark");
        localStorage.setItem("sdms_dark", "enabled");
        showToast("Dark Mode enabled!");
      }
      
      updateDarkToggleIcon(darkToggle);
    });
  }
});

function updateDarkToggleIcon(button) {
  const icon = button.querySelector("i");
  if (icon) {
    const isDark = document.body.classList.contains("dark");
    if (isDark) {
      icon.className = "fas fa-sun";
      button.title = "Switch to Light Mode";
    } else {
      icon.className = "fas fa-moon";
      button.title = "Switch to Dark Mode";
    }
  }
}
