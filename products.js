/* ==========================================================================
   SRI DURGA MEDICAL & GENERAL STORES - PRODUCTS CONTROLLER (products.js)
   ========================================================================== */

let medicinesData = [];

// Fetch Medicines Data with robust fallbacks
async function getMedicinesData() {
  if (medicinesData.length > 0) return medicinesData;

  try {
    const response = await fetch("data/medicines.json");
    if (!response.ok) throw new Error("Failed to load medicine JSON database.");
    medicinesData = await response.json();
    return medicinesData;
  } catch (error) {
    console.error("Error reading JSON file:", error);
    // Hardcoded fallback data in case of standard fetch block due to file:// protocol in some local environments
    medicinesData = [
      {
        "id": "DOL-650",
        "name": "Paracetamol 650mg (Dolo 650)",
        "brand": "Micro Labs Ltd",
        "category": "Tablets",
        "price": 30.00,
        "rating": 4.8,
        "reviews": 142,
        "prescriptionRequired": false,
        "stockStatus": "In Stock",
        "description": "Dolo 650 Tablet helps relieve pain and fever by blocking the release of certain chemical messengers responsible for fever and pain.",
        "uses": ["Fever reduction", "Pain relief"],
        "dosage": "1 tablet every 4-6 hours.",
        "sideEffects": ["Nausea", "Liver impairment if overdosed"],
        "alternatives": ["PCM-650"],
        "image": "tablets"
      },
      {
        "id": "BEN-150",
        "name": "Benadryl Cough Syrup 150ml",
        "brand": "Johnson & Johnson",
        "category": "Syrups",
        "price": 145.00,
        "rating": 4.5,
        "reviews": 210,
        "prescriptionRequired": false,
        "stockStatus": "In Stock",
        "description": "Provides quick relief from wet cough, dry cough, throat irritation, and runny nose.",
        "uses": ["Dry Cough", "Throat Irritation"],
        "dosage": "5-10 ml twice or thrice daily.",
        "sideEffects": ["Drowsiness", "Dry mouth"],
        "alternatives": ["CRX-DX"],
        "image": "syrups"
      },
      {
        "id": "CET-250",
        "name": "Cetaphil Gentle Skin Cleanser 250ml",
        "brand": "Galderma India",
        "category": "Skin Care",
        "price": 499.00,
        "rating": 4.9,
        "reviews": 412,
        "prescriptionRequired": false,
        "stockStatus": "In Stock",
        "description": "Dermatologist-recommended soap-free cleanser that deeply cleanses the skin without stripping away natural moisture.",
        "uses": ["Face cleansing", "Skin soothing"],
        "dosage": "Massage gently and rinse off.",
        "sideEffects": ["None"],
        "alternatives": ["VIC-50"],
        "image": "skin_care"
      },
      {
        "id": "DAB-500",
        "name": "Dabur Chyawanprash 500g",
        "brand": "Dabur India Ltd",
        "category": "Ayurvedic",
        "price": 220.00,
        "rating": 4.8,
        "reviews": 340,
        "prescriptionRequired": false,
        "stockStatus": "In Stock",
        "description": "Time-tested Ayurvedic formulation made of 40+ herbs. Boosts immunity and general vitality.",
        "uses": ["Immunity Booster", "Daily Energy Boost"],
        "dosage": "1-2 teaspoons daily with warm milk.",
        "sideEffects": ["None"],
        "alternatives": ["PAT-ASH"],
        "image": "ayurvedic"
      }
    ];
    return medicinesData;
  }
}

// Generate Card Layout
function buildMedicineCard(med) {
  const card = document.createElement("div");
  card.className = "medicine-card hover-lift reveal reveal-up";
  card.setAttribute("data-id", med.id);
  card.setAttribute("data-category", med.category.toLowerCase());
  
  // Rating Stars Builder
  let starsHtml = "";
  const fullStars = Math.floor(med.rating);
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsHtml += '<i class="fas fa-star"></i>';
    } else {
      starsHtml += '<i class="far fa-star"></i>';
    }
  }

  card.innerHTML = `
    ${med.prescriptionRequired ? '<span class="card-rx-badge">Rx Required</span>' : ''}
    <div class="card-image-wrapper">
      <a href="product.html?id=${med.id}" style="width:100%; height:100%; display:block;">
        ${getCategorySVG(med.image)}
      </a>
    </div>
    <div class="card-content">
      <span class="card-category">${med.category}</span>
      <h3 class="card-title"><a href="product.html?id=${med.id}">${med.name}</a></h3>
      <span class="card-brand">By ${med.brand}</span>
      
      <div class="card-rating-wrapper">
        <span class="card-stars">${starsHtml}</span>
        <span class="card-reviews">(${med.reviews} reviews)</span>
      </div>
      
      <div class="card-footer">
        <div class="card-price-container">
          <span class="card-price">₹${med.price.toFixed(2)}</span>
        </div>
        <div class="card-actions">
          <button class="btn-icon" onclick="addToCart('${med.id}', '${med.name}', ${med.price}, '${med.image}', ${med.prescriptionRequired})" title="Add to Cart">
            <i class="fas fa-shopping-cart"></i>
          </button>
          <button class="btn-icon btn-secondary" onclick="directWhatsAppOrder('${med.id}')" title="Order via WhatsApp" style="background-color:#25d366; border-color:#25d366; color:white;">
            <i class="fab fa-whatsapp"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  return card;
}

// Fast WhatsApp dispatch builder for single cards
function directWhatsAppOrder(medicineId) {
  getMedicinesData().then(data => {
    const med = data.find(m => m.id === medicineId);
    if (!med) return;
    
    const text = encodeURIComponent(
      `*Sri Durga Medical & General Stores*\n` +
      `-----------------------------------------\n` +
      `Hello, I would like to order this medicine:\n` +
      `*Item:* ${med.name}\n` +
      `*Price:* ₹${med.price.toFixed(2)}\n` +
      `*Brand:* ${med.brand}\n` +
      `-----------------------------------------\n` +
      `Please let me know if it is available for delivery!`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, "_blank");
  });
}

// Render Bestsellers on Homepage
async function renderBestSellers() {
  const container = document.getElementById("bestsellers-grid");
  if (!container) return;

  const data = await getMedicinesData();
  // Filter top rated items
  const bestSellers = data.filter(med => med.rating >= 4.7).slice(0, 4);

  container.innerHTML = "";
  bestSellers.forEach(med => {
    container.appendChild(buildMedicineCard(med));
  });
}

// Render dynamic details inside product.html
async function renderProductDetails() {
  const detailGrid = document.getElementById("product-detail-wrapper");
  if (!detailGrid) return; // Exit if not on details page

  const params = new URLSearchParams(window.location.search);
  const medId = params.get("id") || "DOL-650"; // Fallback to Dolo

  const data = await getMedicinesData();
  const med = data.find(m => m.id === medId);

  if (!med) {
    detailGrid.innerHTML = `<h2>Medicine not found! <a href="medicines.html">Back to Catalogue</a></h2>`;
    return;
  }

  // Update Title tags dynamically for SEO
  document.title = `${med.name} - Sri Durga Medical & General Stores`;

  let starsHtml = "";
  for (let i = 0; i < 5; i++) {
    starsHtml += i < Math.floor(med.rating) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
  }

  detailGrid.innerHTML = `
    <div class="product-gallery-section reveal reveal-left">
      <div class="main-gallery-preview" style="background:#f1f5f9; padding: 40px; border-radius: var(--radius-lg); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; height: 350px;">
        ${getCategorySVG(med.image)}
      </div>
      <div class="gallery-thumbnails" style="display:flex; gap:12px; margin-top:16px;">
        <div class="thumb active" style="width:70px; height:70px; background:#f1f5f9; border:2px solid var(--primary); border-radius:var(--radius-sm); padding:8px; cursor:pointer;">
          ${getCategorySVG(med.image)}
        </div>
        <div class="thumb" style="width:70px; height:70px; background:#f1f5f9; border:1px solid var(--border); border-radius:var(--radius-sm); padding:8px; opacity:0.6; cursor:pointer;">
          ${getCategorySVG(med.image)}
        </div>
      </div>
    </div>

    <div class="product-info-section reveal reveal-right">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
        <span class="badge badge-primary">${med.category}</span>
        ${med.prescriptionRequired ? '<span class="badge badge-danger">Rx Required</span>' : '<span class="badge badge-secondary">Non-Prescription</span>'}
        <span class="badge badge-warning">${med.stockStatus}</span>
      </div>
      
      <h2 style="font-size: 2.2rem; margin-bottom: 8px;">${med.name}</h2>
      <p style="color:var(--text-muted); font-size:1.1rem; margin-bottom:12px;">Brand: <strong>${med.brand}</strong></p>
      
      <div class="card-rating-wrapper" style="margin-bottom:20px;">
        <span class="card-stars" style="color:var(--warning); font-size:1.1rem;">${starsHtml}</span>
        <span class="card-reviews" style="font-size:0.95rem;">(${med.reviews} Customers Ratings)</span>
      </div>
      
      <div style="background-color: var(--primary-light); padding:20px; border-radius:var(--radius-md); margin-bottom:24px; border:1px solid rgba(22, 163, 74, 0.1);">
        <span style="font-size:0.9rem; color:var(--text-muted); display:block; margin-bottom:4px;">Best Online Price</span>
        <span style="font-size:2rem; font-weight:800; color:var(--text); font-family:var(--font-heading);">₹${med.price.toFixed(2)}</span>
        <span style="font-size:0.8rem; color:var(--text-muted); display:block; margin-top:4px;">(Inclusive of all taxes & 5% GST)</span>
      </div>

      <p style="margin-bottom:30px; font-size:1.05rem; color:var(--text-muted);">${med.description}</p>

      <div style="display:flex; gap:16px; align-items:center; margin-bottom:40px;">
        <div class="quantity-selector" style="display:flex; align-items:center; border:1px solid var(--border); border-radius:var(--radius-md); background:var(--card-bg); overflow:hidden;">
          <button onclick="changeDetailPageQty(-1)" style="padding:12px 18px; font-weight:bold; color:var(--text-muted);"><i class="fas fa-minus"></i></button>
          <span id="detail-qty-val" style="width:40px; text-align:center; font-weight:700;">1</span>
          <button onclick="changeDetailPageQty(1)" style="padding:12px 18px; font-weight:bold; color:var(--text-muted);"><i class="fas fa-plus"></i></button>
        </div>
        
        <button class="btn btn-primary" onclick="addDetailItemToCart('${med.id}', '${med.name}', ${med.price}, '${med.image}', ${med.prescriptionRequired})">
          <i class="fas fa-shopping-basket"></i> Add to Cart
        </button>
        <button class="btn btn-whatsapp" onclick="dispatchDirectWhatsAppDetail('${med.id}')">
          <i class="fab fa-whatsapp"></i> Buy via WhatsApp
        </button>
      </div>

      <!-- Tab Details Component -->
      <div class="product-details-tabs" style="margin-top:40px;">
        <div class="product-tabs-header" style="display:flex; border-bottom:2px solid var(--border); gap:24px; margin-bottom:20px;">
          <button class="tab-btn active" onclick="switchProductTab(event, 'tab-uses')" style="font-family:var(--font-heading); font-weight:700; padding-bottom:12px; font-size:1.05rem; position:relative;">Medical Uses</button>
          <button class="tab-btn" onclick="switchProductTab(event, 'tab-dosage')" style="font-family:var(--font-heading); font-weight:700; padding-bottom:12px; font-size:1.05rem; position:relative;">Dosage & Usage</button>
          <button class="tab-btn" onclick="switchProductTab(event, 'tab-sideeffects')" style="font-family:var(--font-heading); font-weight:700; padding-bottom:12px; font-size:1.05rem; position:relative;">Side Effects</button>
        </div>
        
        <div id="tab-uses" class="tab-content" style="display:block;">
          <ul style="list-style-type:disc; padding-left:20px; display:flex; flex-direction:column; gap:8px;">
            ${med.uses.map(use => `<li>${use}</li>`).join('')}
          </ul>
        </div>
        <div id="tab-dosage" class="tab-content" style="display:none;">
          <p>${med.dosage}</p>
        </div>
        <div id="tab-sideeffects" class="tab-content" style="display:none;">
          <ul style="list-style-type:disc; padding-left:20px; display:flex; flex-direction:column; gap:8px;">
            ${med.sideEffects.map(se => `<li>${se}</li>`).join('')}
          </ul>
        </div>
      </div>
      
      <!-- Substitutes alternatives segment -->
      <div style="margin-top:48px; padding-top:30px; border-top:1px solid var(--border);">
        <h4 style="font-size:1.15rem; margin-bottom:16px;">Equivalent Substitutes (Alternative Brands)</h4>
        <div id="alternatives-wrapper" style="display:flex; gap:16px; flex-wrap:wrap;">
          <!-- Loaded dynamically -->
        </div>
      </div>
    </div>
  `;

  // Render Alternatives
  renderAlternativesList(med.alternatives, data);
}

// Qty Change on Product details Page
function changeDetailPageQty(delta) {
  const val = document.getElementById("detail-qty-val");
  if (val) {
    let current = parseInt(val.textContent) + delta;
    if (current < 1) current = 1;
    val.textContent = current;
  }
}

// Add Detail Item into local cart
function addDetailItemToCart(id, name, price, img, rx) {
  const qty = parseInt(document.getElementById("detail-qty-val").textContent) || 1;
  addToCart(id, name, price, img, rx, qty);
}

// Dispatch direct WhatsApp click from detail screen
function dispatchDirectWhatsAppDetail(id) {
  getMedicinesData().then(data => {
    const med = data.find(m => m.id === id);
    if (!med) return;
    const qty = parseInt(document.getElementById("detail-qty-val").textContent) || 1;
    
    const text = encodeURIComponent(
      `*Sri Durga Medical & General Stores*\n` +
      `-----------------------------------------\n` +
      `Hello! I'd like to place an order:\n` +
      `*Medicine Name:* ${med.name}\n` +
      `*Quantity:* ${qty}\n` +
      `*Estimated Price:* ₹${(med.price * qty).toFixed(2)}\n` +
      `*Prescription Item:* ${med.prescriptionRequired ? 'Yes (Rx attached)' : 'No'}\n` +
      `-----------------------------------------\n` +
      `Please confirm order delivery availability.`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, "_blank");
  });
}

// Switch tabs on details page
function switchProductTab(event, tabId) {
  const parent = event.currentTarget.parentNode;
  parent.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  event.currentTarget.classList.add("active");

  const tabContainer = parent.parentNode;
  tabContainer.querySelectorAll(".tab-content").forEach(tc => tc.style.display = "none");
  const activeTab = document.getElementById(tabId);
  if (activeTab) activeTab.style.display = "block";
}

// Populate alternatives
function renderAlternativesList(altIds, allData) {
  const container = document.getElementById("alternatives-wrapper");
  if (!container) return;

  if (!altIds || altIds.length === 0) {
    container.innerHTML = `<span style="color:var(--text-muted); font-style:italic;">No substitutes currently listed.</span>`;
    return;
  }

  container.innerHTML = "";
  altIds.forEach(id => {
    const altMed = allData.find(m => m.id === id);
    if (altMed) {
      const altCard = document.createElement("div");
      altCard.style = "background:var(--card-bg); border:1px solid var(--border); padding:12px 18px; border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; min-width:250px; flex-grow:1;";
      altCard.innerHTML = `
        <div>
          <h5 style="margin:0; font-size:0.95rem;"><a href="product.html?id=${altMed.id}">${altMed.name}</a></h5>
          <span style="font-size:0.75rem; color:var(--text-muted);">₹${altMed.price.toFixed(2)} (${altMed.brand})</span>
        </div>
        <button class="btn btn-outline" onclick="addToCart('${altMed.id}', '${altMed.name}', ${altMed.price}, '${altMed.image}', ${altMed.prescriptionRequired})" style="padding:6px 12px; font-size:0.75rem;">
          + Add
        </button>
      `;
      container.appendChild(altCard);
    }
  });
}

// Run initializers
document.addEventListener("DOMContentLoaded", () => {
  renderBestSellers();
  renderProductDetails();
});
