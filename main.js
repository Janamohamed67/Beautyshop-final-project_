/* =====================================================
   main.js - page logic for the Beauty Cosmetics Shop
   Loaded on every page, so each part runs only if its
   element exists on the current page.

   Depends on:
     products.js -> PRODUCTS, SALE, isOnSale, getFinalPrice,
                    getProductById, formatPrice
     cart.js     -> addToCart(productId, quantity)  (teammate)
   ===================================================== */

/* ---------- 1. Shared helpers ---------- */

// Build the HTML of one product card
function createProductCard(product) {
  var onSale = isOnSale(product);

  var priceHtml = onSale
    ? '<span class="price-now">' + formatPrice(getFinalPrice(product)) + '</span>' +
      '<span class="price-old">' + formatPrice(product.price) + '</span>'
    : '<span class="price-now">' + formatPrice(product.price) + '</span>';

  var badgeHtml = onSale
    ? '<span class="badge-sale">-' + product.discount + '%</span>'
    : '';

  return (
    '<article class="product-card">' +
      '<a class="card-media" href="product-details.html?id=' + product.id + '">' +
        badgeHtml +
        '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy" ' +
             'onerror="this.classList.add(\'img-missing\')">' +
      '</a>' +
      '<div class="card-body">' +
        '<p class="card-brand">' + product.brand + '</p>' +
        '<h3 class="card-name"><a href="product-details.html?id=' + product.id + '">' + product.name + '</a></h3>' +
        '<div class="price-row">' + priceHtml + '</div>' +
        '<button class="btn btn-small add-btn" type="button" data-id="' + product.id + '">Add to Cart</button>' +
      '</div>' +
    '</article>'
  );
}

// Put a list of products inside a grid element
function renderProducts(list, gridElement) {
  gridElement.innerHTML = list.map(createProductCard).join("");
}

// Call the teammate's addToCart safely and give visual feedback
function handleAddToCart(productId, quantity, button) {
  if (typeof addToCart === "function") {
    addToCart(productId, quantity);
  } else {
    console.warn("addToCart() is not available yet (cart.js).");
  }
  if (button) {
    var oldText = button.textContent;
    button.textContent = "Added ✓";
    button.disabled = true;
    setTimeout(function () {
      button.textContent = oldText;
      button.disabled = false;
    }, 1200);
  }
}

// One click listener for ALL "Add to Cart" buttons in product cards
document.addEventListener("click", function (event) {
  var button = event.target.closest(".add-btn");
  if (!button) return;
  handleAddToCart(Number(button.dataset.id), 1, button);
});

/* ---------- 2. Black Friday bar (added to every page) ---------- */

function showSaleBar() {
  if (!SALE.active) return;

  var maxDiscount = Math.max.apply(null, PRODUCTS.map(function (p) { return p.discount; }));
  var endDate = new Date(SALE.endsOn).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });

  var bar = document.createElement("div");
  bar.className = "sale-bar";
  bar.setAttribute("role", "note");
  bar.innerHTML =
    '<strong>' + SALE.name + '</strong> - up to ' + maxDiscount +
    '% off selected products. Ends ' + endDate + '. ' +
    '<a href="products.html">Shop now</a>';

  document.body.insertBefore(bar, document.body.firstChild);
}

/* ---------- 3. Home page: featured products ---------- */

function initHomePage() {
  var grid = document.getElementById("featured-grid");
  if (!grid) return;

  var featured = PRODUCTS.filter(function (p) { return p.featured; });
  renderProducts(featured.slice(0, 8), grid);
}

/* ---------- 4. Products page: category filter + search ---------- */

function initProductsPage() {
  var grid = document.getElementById("products-grid");
  if (!grid) return;

  var emptyMsg = document.getElementById("empty-msg");
  var searchBox = document.getElementById("search-box");
  var filterButtons = document.querySelectorAll(".filter-btn");

  var currentCategory = "All";
  var searchTerm = "";

  // Apply both filters together and redraw the grid
  function showProducts() {
    var list = PRODUCTS.filter(function (p) {
      var matchCategory = currentCategory === "All" || p.category === currentCategory;
      var text = (p.name + " " + p.brand + " " + p.category).toLowerCase();
      var matchSearch = text.indexOf(searchTerm) !== -1;
      return matchCategory && matchSearch;
    });

    renderProducts(list, grid);
    emptyMsg.hidden = list.length > 0;
  }

  // Mark the active filter button
  function setActiveButton(category) {
    filterButtons.forEach(function (btn) {
      var isActive = btn.dataset.category === category;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive);
    });
  }

  // Read ?category= from the address (links from the home page / footer)
  var urlCategory = new URLSearchParams(window.location.search).get("category");
  if (urlCategory) {
    var valid = Array.prototype.some.call(filterButtons, function (btn) {
      return btn.dataset.category === urlCategory;
    });
    if (valid) currentCategory = urlCategory;
  }
  setActiveButton(currentCategory);

  // Category buttons
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentCategory = btn.dataset.category;
      setActiveButton(currentCategory);
      showProducts();
    });
  });

  // Search box (filters while typing)
  searchBox.addEventListener("input", function () {
    searchTerm = searchBox.value.trim().toLowerCase();
    showProducts();
  });

  showProducts();
}

/* ---------- 5. Product details page ---------- */

function initProductDetailsPage() {
  var container = document.getElementById("product-detail");
  if (!container) return;

  var id = new URLSearchParams(window.location.search).get("id");
  var product = getProductById(id);

  // Product not found
  if (!product) {
    container.innerHTML =
      '<div class="notice">' +
        '<h1>Product not found</h1>' +
        '<p>Sorry, we could not find this product.</p>' +
        '<a class="btn" href="products.html">Back to products</a>' +
      '</div>';
    document.getElementById("related-grid").parentElement.parentElement.hidden = true;
    return;
  }

  document.title = product.name + " | Beauty Cosmetics Shop";

  var onSale = isOnSale(product);
  var saving = product.price - getFinalPrice(product);

  var priceHtml = onSale
    ? '<span class="price-now">' + formatPrice(getFinalPrice(product)) + '</span>' +
      '<span class="price-old">' + formatPrice(product.price) + '</span>' +
      '<span class="badge-sale badge-inline">-' + product.discount + '%</span>'
    : '<span class="price-now">' + formatPrice(product.price) + '</span>';

  container.innerHTML =
    '<div class="detail-media">' +
      '<img src="' + product.image + '" alt="' + product.name + '" ' +
           'onerror="this.classList.add(\'img-missing\')">' +
    '</div>' +
    '<div class="detail-info">' +
      '<p class="card-brand">' + product.brand + ' &middot; ' + product.category + '</p>' +
      '<h1>' + product.name + '</h1>' +
      '<div class="price-row">' + priceHtml + '</div>' +
      (onSale ? '<p class="saving">' + SALE.name + ': you save ' + formatPrice(saving) + '</p>' : '') +
      '<p class="detail-desc">' + product.description + '</p>' +
      '<div class="qty-row">' +
        '<label for="qty">Quantity</label>' +
        '<input id="qty" type="number" min="1" max="10" value="1">' +
      '</div>' +
      '<button class="btn" id="detail-add" type="button">Add to Cart</button>' +
      '<p class="back-link"><a href="products.html">&larr; Back to products</a></p>' +
    '</div>';

  // Add to cart with the chosen quantity
  var qtyInput = document.getElementById("qty");
  document.getElementById("detail-add").addEventListener("click", function () {
    var qty = parseInt(qtyInput.value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 10) qty = 10;
    qtyInput.value = qty;
    handleAddToCart(product.id, qty, this);
  });

  // Related products: same category, not the current one, max 4
  var related = PRODUCTS.filter(function (p) {
    return p.category === product.category && p.id !== product.id;
  }).slice(0, 4);
  renderProducts(related, document.getElementById("related-grid"));
}

/* ---------- 6. Contact page: form validation ---------- */

function initContactForm() {
  var form = document.getElementById("contact-form");
  if (!form) return;

  var feedback = document.getElementById("form-feedback");

  function showFeedback(text, type) {
    feedback.textContent = text;
    feedback.className = "feedback " + type;   // "error" or "success"
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var name = form.name.value.trim();
    var email = form.email.value.trim();
    var message = form.message.value.trim();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 2) {
      showFeedback("Please enter your name.", "error");
      form.name.focus();
    } else if (!emailPattern.test(email)) {
      showFeedback("Please enter a valid email address.", "error");
      form.email.focus();
    } else if (message.length < 10) {
      showFeedback("Your message should be at least 10 characters.", "error");
      form.message.focus();
    } else {
      showFeedback("Thank you, " + name + "! Your message has been sent.", "success");
      form.reset();
    }
  });
}

/* ---------- 7. Start everything when the page is ready ---------- */

document.addEventListener("DOMContentLoaded", function () {
  showSaleBar();
  initHomePage();
  initProductsPage();
  initProductDetailsPage();
  initContactForm();
});
