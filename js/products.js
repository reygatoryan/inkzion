let allProducts = [];

// ===== LOAD PRODUCTS =====
async function loadProducts() {
  try {
    const res = await fetch('data/products.json');
    const data = await res.json();
    allProducts = data.products;
    return data;
  } catch (err) {
    console.error('Failed to load products:', err);
    return { products: [] };
  }
}

// ===== RENDER PRODUCT CARDS =====
function renderProducts(products, containerId = 'productsContainer') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!products.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);padding:40px;">No products found.</p>';
    return;
  }

  container.innerHTML = products.map(product => `
    <div class="product-card" onclick="window.location.href='product-detail.html?product=${product.id}'">
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-card-body">
        <div class="product-card-category">${product.category}</div>
        <h3 class="product-card-title">${product.name}</h3>
        <p class="product-card-desc">${product.description}</p>
        <div class="product-card-meta">
          <span><i class="fas fa-ruler-combined"></i> ${product.sizes}</span>
          <span><i class="fas fa-tshirt"></i> ${product.material}</span>
          <span><i class="fas fa-clock"></i> ${product.productionTime}</span>
        </div>
        <div class="product-card-actions">
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.location.href='inquiry.html?product=${product.id}'">
            <i class="fas fa-file-invoice"></i> Request Quote
          </button>
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); window.location.href='contact.html?subject=${encodeURIComponent('Inquiry: ' + product.name)}'">
            <i class="fas fa-envelope"></i> Email Inquiry
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== PRODUCT FILTERING =====
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.filter;
      let filtered = allProducts;

      if (category !== 'all') {
        filtered = allProducts.filter(p => p.category === category);
      }

      renderProducts(filtered);

      // Re-trigger AOS
      if (window.AOS) {
        window.AOS.refresh();
      }
    });
  });
}

// ===== PRODUCT DETAIL PAGE =====
async function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('product');
  if (!productId) {
    document.querySelector('.product-detail').innerHTML = '<div class="container"><p style="text-align:center;padding:40px;">No product selected. <a href="products.html">Browse products</a></p></div>';
    return;
  }

  const data = await loadProducts();
  const product = data.products.find(p => p.id === productId);

  if (!product) {
    document.querySelector('.product-detail').innerHTML = '<div class="container"><p style="text-align:center;padding:40px;">Product not found. <a href="products.html">Browse products</a></p></div>';
    return;
  }

  document.title = `${product.name} - InKZion Spectrum Ads`;

  const breadcrumbEl = document.getElementById('breadcrumbProduct');
  if (breadcrumbEl) breadcrumbEl.textContent = product.name;

  const container = document.getElementById('productDetail');
  if (!container) return;

  container.innerHTML = `
    <div class="product-detail-grid">
      <div class="product-detail-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-detail-info">
        <span class="product-detail-category">${product.category}</span>
        <h1>${product.name}</h1>
        <p class="product-detail-desc">${product.description}</p>
        <div class="product-specs">
          <div class="product-spec">
            <div class="product-spec-label">Available Sizes</div>
            <div class="product-spec-value">${product.sizes}</div>
          </div>
          <div class="product-spec">
            <div class="product-spec-label">Material</div>
            <div class="product-spec-value">${product.material}</div>
          </div>
          <div class="product-spec">
            <div class="product-spec-label">Production Time</div>
            <div class="product-spec-value">${product.productionTime}</div>
          </div>
        </div>
        <div class="product-features">
          <h3>Key Features</h3>
          <ul class="product-features-list">
            ${product.features.map(f => `<li><i class="fas fa-check-circle"></i> ${f}</li>`).join('')}
          </ul>
        </div>
        <div class="product-detail-actions">
          <a href="inquiry.html?product=${product.id}" class="btn btn-primary"><i class="fas fa-file-invoice"></i> Request a Quote</a>
          <a href="contact.html?subject=${encodeURIComponent('Inquiry: ' + product.name)}" class="btn btn-outline"><i class="fas fa-envelope"></i> Send Email Inquiry</a>
        </div>
      </div>
    </div>
  `;
}

// ===== INIT PRODUCTS PAGE =====
async function initProductsPage() {
  await loadProducts();
  renderProducts(allProducts);
  initFilters();

  const filterParam = new URLSearchParams(window.location.search).get('filter');
  if (filterParam) {
    const btn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
    if (btn) btn.click();
  }
}

// ===== AUTO-INIT ON APPROPRIATE PAGES =====
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop();

  if (path === 'products.html') {
    initProductsPage();
  }

  if (path === 'product-detail.html') {
    loadProductDetail();
  }

  // Pre-fill inquiry/contact forms with product info from URL
  const inquiryParams = new URLSearchParams(window.location.search);
  const productParam = inquiryParams.get('product');
  const subjectParam = inquiryParams.get('subject');

  if (productParam) {
    const productSelect = document.querySelector('[name="product"]');
    if (productSelect) {
      // Try to match by checking option text or value
      const options = productSelect.options;
      for (let i = 0; i < options.length; i++) {
        if (options[i].value === productParam || options[i].text.toLowerCase().includes(productParam.replace(/-/g, ' '))) {
          productSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  if (subjectParam) {
    const subjectField = document.querySelector('[name="subject"]');
    if (subjectField) {
      subjectField.value = subjectParam;
    }
  }
});

// Also render featured products on homepage
document.addEventListener('DOMContentLoaded', async () => {
  const featuredContainer = document.getElementById('featuredProducts');
  if (featuredContainer) {
    await loadProducts();
    const featured = allProducts.slice(0, 3);
    renderProducts(featured, 'featuredProducts');
  }
});

