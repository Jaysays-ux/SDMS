/* ==========================================================================
   SRI DURGA MEDICAL & GENERAL STORES - CART SYSTEM (cart.js)
   ========================================================================== */

// Retrieve cart items
function getCart() {
  return JSON.parse(localStorage.getItem("sdms_cart")) || [];
}

// Save cart and sync badges
function saveCart(cart) {
  localStorage.setItem("sdms_cart", JSON.stringify(cart));
  if (typeof updateCartBadge === "function") {
    updateCartBadge();
  }
}

// Add Item
function addToCart(medicineId, medicineName, price, image, prescriptionRequired, qty = 1) {
  let cart = getCart();
  const existingItemIndex = cart.findIndex(item => item.id === medicineId);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += qty;
  } else {
    cart.push({
      id: medicineId,
      name: medicineName,
      price: price,
      image: image,
      prescriptionRequired: prescriptionRequired,
      quantity: qty
    });
  }

  saveCart(cart);
  showToast(`${medicineName} added to cart!`);
}

// Remove Item
function removeFromCart(medicineId) {
  let cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === medicineId);
  
  if (itemIndex > -1) {
    const itemName = cart[itemIndex].name;
    cart.splice(itemIndex, 1);
    saveCart(cart);
    showToast(`${itemName} removed from cart.`, "warning");
    renderCartPage();
  }
}

// Update Quantity
function updateQuantity(medicineId, delta) {
  let cart = getCart();
  const itemIndex = cart.findIndex(item => item.id === medicineId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
      showToast("Item removed from cart.", "warning");
    }
    saveCart(cart);
    renderCartPage();
  }
}

// Promo code configurations
const PROMO_CODES = {
  "DURGA10": { type: "percent", value: 10 },
  "WELCOME50": { type: "flat", value: 50, minSubtotal: 300 },
  "GETWELL5": { type: "percent", value: 5 }
};

function getActivePromo() {
  return JSON.parse(localStorage.getItem("sdms_active_promo")) || null;
}

function applyPromoCode(code) {
  const formattedCode = code.toUpperCase().trim();
  const promo = PROMO_CODES[formattedCode];
  
  if (!promo) {
    showToast("Invalid coupon code!", "error");
    return false;
  }
  
  const subtotal = getSubtotal();
  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    showToast(`This coupon requires a minimum purchase of ₹${promo.minSubtotal}!`, "warning");
    return false;
  }

  localStorage.setItem("sdms_active_promo", JSON.stringify({ code: formattedCode, ...promo }));
  showToast("Coupon applied successfully!");
  renderCartPage();
  return true;
}

function removePromoCode() {
  localStorage.removeItem("sdms_active_promo");
  showToast("Coupon removed.", "warning");
  renderCartPage();
}

// Subtotal calculation
function getSubtotal() {
  return getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Main calculator for checkout details
function calculateBillDetails() {
  const subtotal = getSubtotal();
  const gst = parseFloat((subtotal * 0.05).toFixed(2)); // 5% GST
  
  // Delivery Fee logic: Free above ₹500, else ₹40. 0 if cart is empty.
  let deliveryFee = subtotal >= 500 ? 0 : 40;
  if (subtotal === 0) deliveryFee = 0;
  
  // Promo calculation
  let discount = 0;
  const promo = getActivePromo();
  if (promo) {
    if (promo.type === "percent") {
      discount = parseFloat((subtotal * (promo.value / 100)).toFixed(2));
    } else if (promo.type === "flat") {
      discount = promo.value;
    }
  }

  const grandTotal = Math.max(0, parseFloat((subtotal + gst + deliveryFee - discount).toFixed(2)));

  return {
    subtotal,
    gst,
    deliveryFee,
    discount,
    grandTotal,
    promoApplied: promo ? promo.code : null
  };
}

// Page bindings - executes if on cart.html page
function renderCartPage() {
  const cartTableBody = document.getElementById("cart-table-body");
  const cartSummaryContainer = document.getElementById("cart-summary-container");
  const emptyCartState = document.getElementById("empty-cart-state");
  const fullCartState = document.getElementById("full-cart-state");

  const cart = getCart();

  if (!cartTableBody) return; // Exit if not on cart page

  if (cart.length === 0) {
    if (emptyCartState) emptyCartState.style.display = "block";
    if (fullCartState) fullCartState.style.display = "none";
    return;
  }

  if (emptyCartState) emptyCartState.style.display = "none";
  if (fullCartState) fullCartState.style.display = "grid";

  // Render Table Items
  cartTableBody.innerHTML = "";
  cart.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div class="cart-item-info">
          <div class="cart-item-thumb">
            ${getCategorySVG(item.image)}
          </div>
          <div>
            <h4 class="cart-item-title">${item.name}</h4>
            ${item.prescriptionRequired ? '<span class="badge badge-danger" style="padding: 2px 6px; font-size:0.65rem;">Rx Required</span>' : ''}
          </div>
        </div>
      </td>
      <td>₹${item.price.toFixed(2)}</td>
      <td>
        <div class="quantity-control">
          <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)"><i class="fas fa-minus"></i></button>
          <span class="qty-value">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)"><i class="fas fa-plus"></i></button>
        </div>
      </td>
      <td>₹${(item.price * item.quantity).toFixed(2)}</td>
      <td>
        <button class="remove-item-btn" onclick="removeFromCart('${item.id}')" title="Remove Item">
          <i class="far fa-trash-alt"></i>
        </button>
      </td>
    `;
    cartTableBody.appendChild(tr);
  });

  // Calculate bill and update Summary UI
  const bill = calculateBillDetails();
  
  // Progress bar to Free Delivery (₹500 threshold)
  const deliveryProgress = document.getElementById("delivery-progress-bar");
  const deliveryProgressText = document.getElementById("delivery-progress-text");
  
  if (deliveryProgress && deliveryProgressText) {
    const threshold = 500;
    if (bill.subtotal >= threshold) {
      deliveryProgress.style.width = "100%";
      deliveryProgress.style.backgroundColor = "var(--primary)";
      deliveryProgressText.innerHTML = `<i class="fas fa-check-circle"></i> Congratulations! You unlocked <strong>Free Delivery</strong>.`;
    } else {
      const needed = threshold - bill.subtotal;
      const percentage = (bill.subtotal / threshold) * 100;
      deliveryProgress.style.width = `${percentage}%`;
      deliveryProgress.style.backgroundColor = "var(--secondary)";
      deliveryProgressText.innerHTML = `Add <strong>₹${needed.toFixed(2)}</strong> more to get <strong>Free Home Delivery</strong>!`;
    }
  }

  // Render prices in summary panel
  if (cartSummaryContainer) {
    cartSummaryContainer.innerHTML = `
      <div class="cart-summary-box">
        <h3>Order Summary</h3>
        <div class="summary-row">
          <span>Subtotal</span>
          <span>₹${bill.subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>GST (5%)</span>
          <span>₹${bill.gst.toFixed(2)}</span>
        </div>
        <div class="summary-row">
          <span>Delivery Charge</span>
          <span>${bill.deliveryFee === 0 ? '<strong class="color-primary">FREE</strong>' : '₹' + bill.deliveryFee.toFixed(2)}</span>
        </div>
        ${bill.promoApplied ? `
          <div class="summary-row promo-row">
            <span>Coupon (<strong>${bill.promoApplied}</strong>) <button class="btn-remove-promo" onclick="removePromoCode()"><i class="fas fa-times-circle"></i></button></span>
            <span class="color-danger">-₹${bill.discount.toFixed(2)}</span>
          </div>
        ` : ''}
        <hr class="summary-divider">
        <div class="summary-row grand-total-row">
          <span>Grand Total</span>
          <span>₹${bill.grandTotal.toFixed(2)}</span>
        </div>
        <a href="checkout.html" class="btn btn-primary btn-checkout-action">
          Proceed to Checkout <i class="fas fa-arrow-right"></i>
        </a>
      </div>
      
      ${!bill.promoApplied ? `
        <div class="coupon-box-card">
          <h4>Apply Coupon Code</h4>
          <div class="coupon-input-group">
            <input type="text" id="coupon-field" placeholder="Enter coupon code (e.g. DURGA10)" class="form-control">
            <button class="btn btn-secondary" onclick="triggerCouponApply()">Apply</button>
          </div>
          <div class="coupon-suggestions">
            <span onclick="applyPromoCode('DURGA10')"><strong>DURGA10</strong> (10% off)</span>
            <span onclick="applyPromoCode('WELCOME50')"><strong>WELCOME50</strong> (₹50 off on order > ₹300)</span>
          </div>
        </div>
      ` : ''}
    `;
  }
}

function triggerCouponApply() {
  const input = document.getElementById("coupon-field");
  if (input && input.value) {
    applyPromoCode(input.value);
  } else {
    showToast("Please enter a coupon code!", "warning");
  }
}

// Simple Helper for placeholder SVG rendering
function getCategorySVG(category) {
  let color = "var(--primary)";
  let path = `<circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="4"/>`;

  if (category === "tablets") {
    path = `<rect x="25" y="40" width="50" height="20" rx="10" fill="none" stroke="currentColor" stroke-width="4"/>
            <line x1="50" y1="40" x2="50" y2="60" stroke="currentColor" stroke-width="2"/>`;
  } else if (category === "capsules") {
    path = `<rect x="25" y="35" width="50" height="30" rx="15" fill="none" stroke="currentColor" stroke-width="4"/>
            <line x1="50" y1="35" x2="50" y2="65" stroke="currentColor" stroke-width="2"/>`;
  } else if (category === "syrups") {
    path = `<path d="M40 30h20v10H40zm-5 10h30v45a5 5 0 0 1-5 5H40a5 5 0 0 1-5-5z" fill="none" stroke="currentColor" stroke-width="4"/>`;
  } else if (category === "baby_care") {
    path = `<circle cx="50" cy="40" r="15" fill="none" stroke="currentColor" stroke-width="4"/>
            <path d="M30 75c0-10 10-15 20-15s20 5 20 15" fill="none" stroke="currentColor" stroke-width="4"/>`;
  } else if (category === "skin_care") {
    path = `<path d="M35 30h30v50H35zm0 15h30" fill="none" stroke="currentColor" stroke-width="4"/>`;
  } else if (category === "ayurvedic") {
    path = `<path d="M50 25c25 25 0 50 0 50s-25-25 0-50z" fill="none" stroke="currentColor" stroke-width="4"/>`;
  } else if (category === "diabetic_care") {
    path = `<rect x="35" y="25" width="30" height="50" rx="5" fill="none" stroke="currentColor" stroke-width="4"/>
            <line x1="35" y1="45" x2="65" y2="45" stroke="currentColor" stroke-width="2"/>`;
  } else if (category === "general_store") {
    path = `<path d="M30 40h40v40H30zm10-15h20v15H40z" fill="none" stroke="currentColor" stroke-width="4"/>`;
  }

  return `<svg viewBox="0 0 100 100" style="color: ${color}; width: 100%; height: 100%; display: block; margin: auto;">${path}</svg>`;
}

// Run initial loading on Cart Page
document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
});
