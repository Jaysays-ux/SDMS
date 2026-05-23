/* ==========================================================================
   SRI DURGA MEDICAL & GENERAL STORES - GLOBAL CONTROLLER (main.js)
   ========================================================================== */

// Translation Dictionary
const TRANSLATIONS = {
  en: {
    nav_home: "Home",
    nav_medicines: "Medicines",
    nav_prescription: "Upload Prescription",
    nav_offers: "Offers",
    nav_contact: "Contact",
    nav_dashboard: "Admin",
    hero_title: "Sri Durga Medical & General Stores",
    hero_subtitle: "Your Trusted Neighborhood Pharmacy - Open 24/7",
    hero_telugu_badge: "Telugu Support Active",
    hero_open_badge: "Open 24/7",
    order_now: "Order Medicines",
    upload_rx: "Upload Prescription",
    whatsapp_now: "WhatsApp Now",
    call_store: "Call Store",
    features_title: "Why Choose Us?",
    genuine_meds: "Genuine Medicines",
    genuine_meds_desc: "100% authentic medicines sourced directly from authorized pharmaceutical distributors.",
    fast_delivery: "Express Home Delivery",
    fast_delivery_desc: "Swift and secure home delivery to nearby villages and towns within hours.",
    expert_pharmacist: "Experienced Pharmacists",
    expert_pharmacist_desc: "Get expert guidance and consultation for all your medicine requirements.",
    best_sellers: "Best Sellers",
    categories: "Categories",
    testimonials: "Customer Testimonials",
    footer_text: "Sri Durga Medical & General Stores - Dedicated to serving our local communities with authentic medicines, healthcare products, and compassionate advice.",
    store_timings: "Store Timings",
    open_24_7: "Open 24 Hours / 7 Days",
    delivery_locations: "Delivery Locations",
    telangana_villages: "Narsampet, Chennaraopet, Nekonda, Geesugonda & surrounding areas.",
    emergency_contact: "Emergency Contact",
    rights_reserved: "All Rights Reserved."
  },
  te: {
    nav_home: "హోమ్",
    nav_medicines: "మందులు",
    nav_prescription: "ప్రిస్క్రిప్షన్ అప్‌లోడ్",
    nav_offers: "ఆఫర్లు",
    nav_contact: "సంప్రదించండి",
    nav_dashboard: "అడ్మిన్",
    hero_title: "శ్రీ దుర్గ మెడికల్ & జనరల్ స్టోర్స్",
    hero_subtitle: "మీ విశ్వసనీయ పొరుగు ఫార్మసీ - 24/7 అందుబాటులో ఉంటుంది",
    hero_telugu_badge: "తెలుగు సహాయం అందుబాటులో ఉంది",
    hero_open_badge: "24/7 తెరిచి ఉంటుంది",
    order_now: "మందులు ఆర్డర్ చేయండి",
    upload_rx: "ప్రిస్క్రిప్షన్ అప్‌లోడ్",
    whatsapp_now: "వాట్సాప్ చేయండి",
    call_store: "కాల్ చేయండి",
    features_title: "మమ్మల్ని ఎందుకు ఎంచుకోవాలి?",
    genuine_meds: "నిజమైన మందులు",
    genuine_meds_desc: "అధికారిక ఫార్మా పంపిణీదారుల నుండి నేరుగా సేకరించిన 100% నిజమైన మందులు.",
    fast_delivery: "వేగవంతమైన డెలివరీ",
    fast_delivery_desc: "కొద్ది గంటల్లోనే సమీప గ్రామాలు మరియు పట్టణాలకు సురక్షితమైన డెలివరీ.",
    expert_pharmacist: "అనుభవజ్ఞులైన ఫార్మసిస్ట్లు",
    expert_pharmacist_desc: "మీ మందుల అవసరాల కోసం నిపుణుల మార్గదర్శకత్వం మరియు సలహాలు పొందండి.",
    best_sellers: "టాప్ సేల్స్ మందులు",
    categories: "విభాగాలు",
    testimonials: "కస్టమర్ అభిప్రాయాలు",
    footer_text: "శ్రీ దుర్గ మెడికల్ & జనరల్ స్టోర్స్ - సమీప గ్రామాలకు నిజమైన మందులు మరియు వైద్య సేవలను అందించడంలో అంకితభావంతో ఉంది.",
    store_timings: "స్టోర్ సమయాలు",
    open_24_7: "24 గంటలు / 7 రోజులు అందుబాటులో ఉంటుంది",
    delivery_locations: "డెలివరీ చేయు ప్రాంతాలు",
    telangana_villages: "నర్సంపేట, చెన్నారావుపేట, నెకొండ, గీసుగొండ మరియు పరిసర ప్రాంతాలు.",
    emergency_contact: "అత్యవసర సంప్రదింపు నంబరు",
    rights_reserved: "అన్ని హక్కులూ ప్రత్యేకించబడినవి."
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // 1. Loading Spinner Fade Out
  const spinner = document.getElementById("global-spinner");
  if (spinner) {
    setTimeout(() => {
      spinner.style.opacity = "0";
      spinner.style.pointerEvents = "none";
    }, 400);
  }

  // 2. Language Setup
  initLanguage();

  // 3. Mobile Navigation Drawer Toggle
  const menuBtn = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  
  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const icon = menuBtn.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-bars");
        icon.classList.toggle("fa-times");
      }
    });
  }

  // 4. Update Cart Badge Count
  updateCartBadge();
});

// Toast System
function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  let iconClass = "fa-check-circle";
  if (type === "error") iconClass = "fa-exclamation-circle";
  if (type === "warning") iconClass = "fa-exclamation-triangle";

  toast.innerHTML = `
    <i class="fas ${iconClass} toast-icon"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove toast
  setTimeout(() => {
    toast.style.transform = "translateX(120%)";
    toast.style.transition = "transform 0.3s ease";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// Language Handling Functions
function initLanguage() {
  let currentLang = localStorage.getItem("sdms_language") || "en";
  localStorage.setItem("sdms_language", currentLang);
  
  const langBtn = document.getElementById("lang-toggle");
  if (langBtn) {
    langBtn.textContent = currentLang === "en" ? "తెలుగు" : "English";
    langBtn.addEventListener("click", () => {
      const targetLang = localStorage.getItem("sdms_language") === "en" ? "te" : "en";
      localStorage.setItem("sdms_language", targetLang);
      langBtn.textContent = targetLang === "en" ? "తెలుగు" : "English";
      applyTranslations(targetLang);
      showToast(targetLang === "en" ? "Language set to English!" : "భాష తెలుగులోకి మార్చబడింది!");
    });
  }
  
  applyTranslations(currentLang);
}

function applyTranslations(lang) {
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach(el => {
    const key = el.getAttribute("data-translate");
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
      // If it's an input or placeholder, translate the placeholder attribute
      if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
        el.setAttribute("placeholder", TRANSLATIONS[lang][key]);
      } else {
        el.textContent = TRANSLATIONS[lang][key];
      }
    }
  });
}

// Global Cart Badge Update helper
function updateCartBadge() {
  const badge = document.querySelector(".cart-count");
  if (badge) {
    const cart = JSON.parse(localStorage.getItem("sdms_cart")) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalCount;
    badge.style.display = totalCount > 0 ? "flex" : "none";
  }
}
