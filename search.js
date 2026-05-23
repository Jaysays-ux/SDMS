/* ==========================================================================
   SRI DURGA MEDICAL & GENERAL STORES - SEARCH & FILTERS ENGINE (search.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Catalogue Grid if on medicines.html
  initCataloguePage();
  
  // Initialize Autocomplete suggestions for all search fields
  initAutocompleteSuggestions();
});

// Catalogue Page Handler
async function initCataloguePage() {
  const grid = document.getElementById("catalogue-grid");
  if (!grid) return; // Exit if not on medicines.html

  const data = await getMedicinesData();
  
  // Core Filter States
  const searchInput = document.getElementById("catalog-search");
  const priceSlider = document.getElementById("filter-price");
  const priceDisplay = document.getElementById("price-value");
  const rxCheck = document.getElementById("filter-rx");
  const stockCheck = document.getElementById("filter-stock");
  const sortSelect = document.getElementById("filter-sort");
  const categoryTabs = document.querySelectorAll(".category-tab-btn");

  let activeCategory = "all";

  // Check URL category parameter (e.g., if clicked category from Home page)
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get("category");
  if (catParam) {
    activeCategory = catParam.toLowerCase();
    // Highlight category tab
    categoryTabs.forEach(tab => {
      if (tab.getAttribute("data-category") === activeCategory) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });
  }

  // Pre-fill search if query parameter exists
  const queryParam = params.get("q");
  if (queryParam && searchInput) {
    searchInput.value = queryParam;
  }

  // Render Function based on state combinations
  function applyAllFilters() {
    let filtered = [...data];

    // 1. Category Filter
    if (activeCategory !== "all") {
      filtered = filtered.filter(med => med.category.toLowerCase() === activeCategory);
    }

    // 2. Query Search Filter
    if (searchInput && searchInput.value) {
      const q = searchInput.value.toLowerCase().trim();
      filtered = filtered.filter(med => 
        med.name.toLowerCase().includes(q) || 
        med.brand.toLowerCase().includes(q) ||
        med.description.toLowerCase().includes(q) ||
        med.uses.some(u => u.toLowerCase().includes(q))
      );
    }

    // 3. Price Filter
    if (priceSlider) {
      const maxPrice = parseFloat(priceSlider.value);
      if (priceDisplay) priceDisplay.textContent = `₹${maxPrice}`;
      filtered = filtered.filter(med => med.price <= maxPrice);
    }

    // 4. Rx Filter
    if (rxCheck && rxCheck.checked) {
      filtered = filtered.filter(med => med.prescriptionRequired);
    }

    // 5. Stock Availability Filter
    if (stockCheck && stockCheck.checked) {
      filtered = filtered.filter(med => med.stockStatus === "In Stock");
    }

    // 6. Sorting
    if (sortSelect) {
      const sortBy = sortSelect.value;
      if (sortBy === "price-low") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
      } else {
        // Default alphabetical
        filtered.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    // Output to grid
    grid.innerHTML = "";
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 60px 0; color:var(--text-muted);">
          <i class="fas fa-search" style="font-size:3rem; margin-bottom:16px;"></i>
          <h3>No medicines match your filter options.</h3>
          <p>Try clearing some criteria or typing another name.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(med => {
      grid.appendChild(buildMedicineCard(med));
    });

    // Fire custom scroll reveal initializer for new cards
    if (typeof initScrollReveal === "function") {
      initScrollReveal();
    }
  }

  // Bind Listeners
  if (searchInput) searchInput.addEventListener("input", applyAllFilters);
  if (priceSlider) priceSlider.addEventListener("input", applyAllFilters);
  if (rxCheck) rxCheck.addEventListener("change", applyAllFilters);
  if (stockCheck) stockCheck.addEventListener("change", applyAllFilters);
  if (sortSelect) sortSelect.addEventListener("change", applyAllFilters);

  categoryTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      categoryTabs.forEach(btn => btn.classList.remove("active"));
      tab.classList.add("active");
      activeCategory = tab.getAttribute("data-category").toLowerCase();
      applyAllFilters();
    });
  });

  // Run initial render
  applyAllFilters();
}

// Global Autocomplete suggestions dropdown initializer
async function initAutocompleteSuggestions() {
  const searchInputs = document.querySelectorAll(".live-search-field");
  const data = await getMedicinesData();

  searchInputs.forEach(input => {
    // Create drawer wrapper dynamically
    const wrapper = document.createElement("div");
    wrapper.className = "search-suggestions-drawer";
    wrapper.style = "position:absolute; top:100%; left:0; width:100%; background:var(--card-bg); border:1px solid var(--border); border-radius:0 0 var(--radius-md) var(--radius-md); box-shadow:var(--shadow-lg); z-index:999; display:none; max-height:250px; overflow-y:auto;";
    
    // Check if input's parent is positioned, otherwise position relative
    const parentStyle = window.getComputedStyle(input.parentNode);
    if (parentStyle.position === "static") {
      input.parentNode.style.position = "relative";
    }
    input.parentNode.appendChild(wrapper);

    input.addEventListener("input", () => {
      const q = input.value.toLowerCase().trim();
      if (!q) {
        wrapper.style.display = "none";
        return;
      }

      // Filter matches
      const matches = data.filter(med => 
        med.name.toLowerCase().includes(q) || 
        med.category.toLowerCase().includes(q)
      ).slice(0, 5);

      if (matches.length === 0) {
        wrapper.style.display = "none";
        return;
      }

      wrapper.innerHTML = "";
      matches.forEach(med => {
        const row = document.createElement("div");
        row.style = "padding:10px 16px; cursor:pointer; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; font-size:0.9rem; transition:var(--transition);";
        row.innerHTML = `
          <span><strong>${med.name}</strong> <small style="color:var(--text-muted); font-size:0.75rem;">(${med.category})</small></span>
          <span style="color:var(--primary); font-weight:700;">₹${med.price.toFixed(2)}</span>
        `;
        
        row.addEventListener("mouseover", () => {
          row.style.background = "var(--primary-light)";
        });
        row.addEventListener("mouseout", () => {
          row.style.background = "none";
        });
        
        row.addEventListener("mousedown", () => {
          input.value = med.name;
          wrapper.style.display = "none";
          
          // If on catalogue page, trigger the filter search. If on Home page, redirect
          const grid = document.getElementById("catalogue-grid");
          if (grid) {
            const catalogInput = document.getElementById("catalog-search");
            if (catalogInput) {
              catalogInput.value = med.name;
              catalogInput.dispatchEvent(new Event("input"));
            }
          } else {
            window.location.href = `medicines.html?q=${encodeURIComponent(med.name)}`;
          }
        });
        wrapper.appendChild(row);
      });

      wrapper.style.display = "block";
    });

    input.addEventListener("blur", () => {
      // Delay closing slightly to allow clicking suggestion rows
      setTimeout(() => {
        wrapper.style.display = "none";
      }, 200);
    });
  });
}
