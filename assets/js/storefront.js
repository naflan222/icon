/* ICONIC Fragrance's static storefront. Product data and order settings are in catalog.js. */
(($) => {
  const products = window.ICONIC_PRODUCTS;
  const store = window.ICONIC_STORE;
  const byId = new Map(products.map((product) => [product.id, product]));
  const byName = new Map(products.map((product) => [product.name.toLowerCase(), product]));
  const cartKey = "iconic_cart_v1";
  const wishlistKey = "iconic_wishlist_v1";
  const shopUrl = "shop-fullwidth-4col.html";
  const money = (amount) => `Rs. ${amount.toLocaleString("en-LK")}`;
  const productUrl = (product) => `product-detail.html?product=${product.id}`;
  const sizeLabel = (product) => `${product.category} · ${product.size}`;
  const normalizeSearch = (text) => text.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "").replace(/’/g, "'");
  const subtotal = (items) => [...items].reduce((sum, [product, qty]) => sum + product.price * qty, 0);
  const deliveryFee = Number.isSafeInteger(store.deliveryFee) && store.deliveryFee >= 0 ? store.deliveryFee : null;
  const bank = store.bankTransfer;
  const bankAvailable = Boolean(bank && [bank.bank, bank.accountHolder, bank.accountNumber]
    .every((value) => typeof value === "string" && value.trim()));
  const transferInstructions = "Confirm the order and delivery charge on WhatsApp before transferring payment.";

  function readSaved(key) {
    const items = new Map();
    try {
      const rows = JSON.parse(localStorage.getItem(key));
      if (!Array.isArray(rows)) return items;
      for (const row of rows) {
        if (!row || typeof row !== "object") continue;
        const product = byId.get(row.id) || byName.get(String(row.name || "").trim().toLowerCase());
        const qty = key === cartKey ? Number(row.qty) : 1;
        if (product && Number.isSafeInteger(qty) && qty > 0) {
          items.set(product, key === cartKey ? (items.get(product) || 0) + qty : 1);
        }
      }
    } catch {
      // A missing, inaccessible, or malformed store starts empty.
    }
    return items;
  }

  let cart = readSaved(cartKey);
  let wishlist = readSaved(wishlistKey);

  function withLatest(key, current) {
    try {
      localStorage.getItem(key);
      return readSaved(key);
    } catch {
      return current;
    }
  }

  function save(key, items) {
    // Keep names and images in the existing format for older pages and saved items.
    const rows = [...items].map(([product, qty]) => ({
      id: product.id,
      name: product.name,
      cat: sizeLabel(product),
      price: product.price,
      img: product.gallery[0]?.src || "",
      qty,
    }));
    try {
      localStorage.setItem(key, JSON.stringify(rows));
    } catch {
      // Changes remain usable on the current page when browser storage is unavailable.
    }
    renderSavedItems();
  }

  function image({ src, alt, width = 960, height = 960 }, eager = false) {
    const photoClass = height > width ? "portrait-photo" : "studio-photo";
    return `<img src="${src}" alt="${alt}" width="${width}" height="${height}"
      class="${photoClass}" loading="${eager ? "eager" : "lazy"}" decoding="async"/>`;
  }

  function thumbnail(product, className) {
    const photo = product.gallery[0];
    return photo ? `<div class="${className}">${image(photo)}</div>` : "";
  }

  function productLink(product) {
    return `<a href="${productUrl(product)}">${product.name}</a>`;
  }

  function action(type, label, icon, product, extra = "") {
    return `<button type="button" class="store-action ${extra}" data-${type}="${product.id}"
      aria-label="${label} ${product.name}" title="${label} ${product.name}">
      <i class="fas ${icon}" aria-hidden="true"></i></button>`;
  }

  function updateCart(product, change) {
    cart = withLatest(cartKey, cart);
    const qty = (cart.get(product) || 0) + change;
    if (qty > 0) cart.set(product, qty);
    else cart.delete(product);
    save(cartKey, cart);
  }

  function renderSavedItems() {
    const total = subtotal(cart);
    $(".cart__quantity").text([...cart.values()].reduce((sum, qty) => sum + qty, 0));
    $(".menu-cart h5 span, .cart-items__total__price span, .cart__total__content tbody td").text(money(total));
    $(".wishlist__quantity").text(wishlist.size);
    $("[data-save]").each(function () {
      const product = byId.get(this.dataset.save);
      const saved = wishlist.has(product);
      const label = `${saved ? "Remove from wishlist" : "Save to wishlist"}: ${product.name}`;
      $(this).toggleClass("active", saved).attr({ "aria-pressed": saved, "aria-label": label, title: label });
    });

    $("[data-cart-items]").html([...cart].map(([product, qty]) =>
      `<div class="cart-item">
        ${thumbnail(product, "cart-item__image")}
        <div class="cart-item__info">${productLink(product)}<h5>${money(product.price)}</h5><p>Quantity: <span>${qty}</span></p></div>
        ${action("remove-cart", "Remove", "fa-times", product, "cart-item__remove")}
      </div>`).join("") || "<p>Your cart is empty.</p>");
    $(".cart__table__wrapper tbody").html([...cart].map(([product, qty]) =>
      `<tr><td><div class="cart-product">${thumbnail(product, "cart-product__image")}
        <div class="cart-product__content"><h5>${sizeLabel(product)}</h5>${productLink(product)}</div></div></td>
        <td>${money(product.price)}</td>
        <td><div class="store-quantity">
          ${action("decrease-cart", "Decrease quantity of", "fa-minus", product)}
          <span>${qty}</span>
          ${action("add-cart", "Increase quantity of", "fa-plus", product)}
        </div></td>
        <td>${money(product.price * qty)}</td>
        <td>${action("remove-cart", "Remove", "fa-times", product, "cart-remove")}</td></tr>`
    ).join("") || `<tr><td colspan="5">Your cart is empty. <a href="${shopUrl}">Continue shopping</a></td></tr>`);
    $(".wishlist__table__wrapper tbody").html([...wishlist.keys()].map((product) =>
      `<tr><td><div class="wishlist-product">${thumbnail(product, "wishlist-product__image")}
        <div class="wishlist-product__content"><h5>${sizeLabel(product)}</h5>${productLink(product)}</div></div></td>
        <td>${money(product.price)}</td><td>Confirm with shop</td>
        <td><button type="button" class="btn -dark" data-add="${product.id}">Add to cart</button>
        ${action("remove-wishlist", "Remove from wishlist", "fa-times", product)}</td></tr>`
    ).join("") || `<tr><td colspan="4">Your wishlist is empty. <a href="${shopUrl}">Continue shopping</a></td></tr>`);

    $("[data-clear-cart]").attr("aria-disabled", !cart.size);
    $('.cart-items__total a[href="checkout.html"], .cart__total__content a[href="checkout.html"]')
      .toggleClass("disabled", !cart.size).attr("aria-disabled", !cart.size);
    renderCheckout(total);
  }

  function addMissingShopCards() {
    $(".shop-products__gird > .row, .shop-products__list > .row").each(function () {
      const row = $(this);
      const listed = new Set(row.find(".product-name").map(function () {
        return this.textContent.trim().toLowerCase();
      }).get());
      const list = row.parent().hasClass("shop-products__list");
      for (const product of products) {
        if (listed.has(product.name.toLowerCase())) continue;
        const photo = product.gallery[0];
        const imageClass = list ? "product-list-thumb__image" : "product-thumb__image";
        const photoLink = photo ? `<a class="${imageClass}" href="${productUrl(product)}"></a>` : "";
        const name = `<a class="product-name" href="${productUrl(product)}">${product.name}</a>`;
        const price = `<h5 class="product-price--main">${money(product.price)}</h5>`;
        row.append(list
          ? `<div class="col-12 col-sm-24 col-lg-6 px-1 px-lg-3"><div class="product-list">
              <div class="product-list-thumb">${photoLink}</div>
              <div class="product-list-content">
                <div class="product-list-content__top">
                  <div class="product-category__wrapper"><h5 class="product-category"></h5></div>
                  ${name}
                  <div class="product__price"><div class="product__price__wrapper">${price}</div></div>
                </div>
                <div class="product-list-content__bottom"><p class="product-description"></p></div>
              </div>
            </div></div>`
          : `<div class="col-6 col-sm-6 col-md-4 col-lg-3 px-1 px-lg-3"><div class="product">
              <div class="product-thumb">${photoLink}</div>
              <div class="product-content">
                <div class="product-content__header"><div class="product-category"></div></div>
                ${name}
                <div class="product-content__footer">${price}</div>
              </div>
            </div></div>`);
      }
    });
  }

  function decorateCards() {
    $(".product, .product-list").each(function () {
      const card = $(this);
      const product = byName.get(card.find(".product-name").first().text().trim().toLowerCase());
      if (!product) return;
      card.attr("data-product-id", product.id);
      card.find(".product-name, .product-thumb__image, .product-list-thumb__image").attr("href", productUrl(product));
      const photoLink = card.find(".product-thumb__image, .product-list-thumb__image");
      if (product.gallery.length) photoLink.html(image(product.gallery[0]));
      card.find(".product-category").text(sizeLabel(product));
      card.find(".product-price--main").text(money(product.price));
      card.find(".product-description").text(product.description || product.notes[0] || "A concentrated fragrance oil in a 10 ml bottle.");
      card.find(".product-content, .product-list-content").append(
        `<div class="store-actions">
          ${action("add", "Add to cart:", "fa-shopping-bag", product)}
          ${action("save", "Save to wishlist:", "fa-heart", product, "product-wl")}
          ${action("quick-view", "Quick view:", "fa-eye", product)}
        </div>`
      );
    });
  }

  function fillProduct(content, product, showDetailsLink = false) {
    content.attr("data-product-id", product.id);
    content.find(".product-detail__content__header h5").text(sizeLabel(product));
    content.find(".product-detail__content__header h2").text(product.name);
    content.children("h3").text(money(product.price));
    content.find(".product-detail__colors, .product-detail__content__footer > ul").remove();
    content.find(".product-detail__controller").html(`
      <div class="quantity-controller -border -round" aria-label="Quantity">
        <button type="button" class="quantity-controller__btn -descrease" data-quantity="-1" aria-label="Decrease quantity">−</button>
        <span class="quantity-controller__number" aria-live="polite">1</span>
        <button type="button" class="quantity-controller__btn -increase" data-quantity="1" aria-label="Increase quantity">+</button>
      </div>
      <button type="button" class="btn -red" data-add="${product.id}">Add to cart</button>
      ${action("save", "Save to wishlist:", "fa-heart", product, "product-wl")}
    `);
    const description = content.find(".tab-content__item.-description");
    description.find("p").text(product.description || "Apply a small amount of this concentrated perfume oil to pulse points.");
    if (product.notes.length) {
      if (description.length) {
        const notes = $("<dl>", { class: "store-notes" }).appendTo(description);
        ["Top", "Heart", "Base"].forEach((label, index) => {
          notes.append($("<dt>", { text: label }), $("<dd>", { text: product.notes[index] }));
        });
      } else {
        $("<p>", { class: "store-quick-notes", text: product.notes[0] }).insertAfter(content.children("h3"));
      }
    }
    if (showDetailsLink) {
      content.find(".store-detail-link").remove();
      content.append(`<p class="store-detail-link"><a href="${productUrl(product)}">View product details</a></p>`);
    }
  }

  function renderDetailPage() {
    const detail = $(".product-detail__wrapper");
    if (!detail.length) return;
    const id = new URLSearchParams(location.search).get("product");
    const product = byId.get(id === null ? "golden-vault" : id);
    if (!product) {
      document.title = "Product unavailable | ICONIC Fragrance";
      detail.html(`<h1>Product unavailable</h1><p><a href="${shopUrl}">Browse our fragrances</a></p>`);
      return;
    }
    document.title = `${product.name} ${product.category} | ICONIC Fragrance`;
    fillProduct(detail.find(".product-detail__content__header").parent(), product);
    const gallery = detail.find(".product-detail__slide-two");
    gallery.closest(".col-12").prop("hidden", !product.gallery.length);
    if (product.gallery.length) {
      gallery.find(".product-detail__slide-two__big").html(product.gallery.map((photo, index) =>
        `<div class="slider__item">${image(photo, index === 0)}</div>`).join(""));
      const thumbnails = gallery.find(".product-detail__slide-two__small");
      if (product.gallery.length === 1) thumbnails.remove();
      else thumbnails.html(product.gallery.map((photo) =>
        `<div class="slider__item">${image(photo)}</div>`).join(""));
    } else {
      gallery.remove();
    }
    $(".product-slide .product-slide__item").has(`[data-product-id="${product.id}"]`).remove();
    $(".tab-switcher").first().addClass("active");
  }

  function openQuickView(product, opener) {
    const modal = $("#quick-view-modal");
    modal.find(".store-quick-notes").remove();
    fillProduct(modal.find(".product-detail__content__header").parent(), product, true);
    const slider = modal.find(".slider-wrapper");
    if (slider.hasClass("slick-initialized")) slider.slick("unslick");
    slider.closest(".col-12").prop("hidden", !product.gallery.length);
    slider.html(product.gallery.map((photo, index) =>
      `<div class="slider-item">${image(photo, index === 0)}</div>`).join(""));
    modal.one($.modal.OPEN, () => {
      if (product.gallery.length > 1) slider.slick({ arrows: true, dots: true, infinite: false });
      modal.find("[data-add]").trigger("focus");
    });
    modal.one($.modal.AFTER_CLOSE, () => opener.focus());
    modal.modal({ fadeDuration: 150 });
  }

  function initShop() {
    const shop = $(".shop-products");
    const pager = $(".paginator");
    if (!shop.length || !pager.length) return;

    const url = new URL(location.href);
    const query = (url.searchParams.get("q") || "").trim();
    const requestedCategory = url.searchParams.get("category");
    const collections = window.ICONIC_COLLECTIONS;
    const category = Object.hasOwn(collections, requestedCategory) ? requestedCategory : null;
    const categoryName = category ? collections[category] : "";
    const assortment = category ? products.filter((product) => product.collections.includes(category)) : products;
    const sortControl = $('.shop-header select[name="sort"]');
    const sorters = new Map([
      ["az", (a, b) => a.name.localeCompare(b.name)],
      ["za", (a, b) => b.name.localeCompare(a.name)],
      ["low-high", (a, b) => a.price - b.price || a.name.localeCompare(b.name)],
      ["high-low", (a, b) => b.price - a.price || a.name.localeCompare(b.name)],
    ]);
    let sort = sorters.has(url.searchParams.get("sort")) ? url.searchParams.get("sort") : "";
    let page = Number.parseInt(url.searchParams.get("page"), 10) || 1;
    const columns = shop.find(".shop-products__gird > .row, .shop-products__list > .row").map(function () {
      return { row: this, byId: new Map($(this).children().map(function () {
        return [[$(this).find("[data-product-id]").attr("data-product-id"), this]];
      }).get()) };
    }).get();
    const searchStatus = $('<div class="store-search-result" role="status"></div>').insertBefore(shop);
    const viewButtons = $(".shop-header__view__icon a");
    const searchForms = $('.shop-search, .search-box form[role="search"]');
    const categoryList = $(".shop-categories");
    const categoryLinks = [["", "All Products"], ...Object.entries(collections)].map(([key, label]) => {
      const link = $("<a>", { text: label }).appendTo(categoryList);
      if (key === (category || "")) link.attr("aria-current", "page");
      return { key, link };
    });
    const searchSort = $("<input>", { type: "hidden", name: "sort" }).appendTo(searchForms);
    sortControl.prepend('<option value="">Featured</option>').val(sort);
    searchForms.find("input[name=q]").val(query);
    if (category) {
      $(".breadcrumb h2, .shop-header__page").text(categoryName);
      $(".breadcrumb li.active").text(categoryName);
      document.title = `${categoryName} | ICONIC Fragrance`;
      searchForms.append($("<input>", { type: "hidden", name: "category", value: category }));
    }

    function browseUrl(key, term = "") {
      const params = new URLSearchParams();
      if (key) params.set("category", key);
      if (term) params.set("q", term);
      if (sort) params.set("sort", sort);
      return params.size ? `${url.pathname}?${params}` : url.pathname;
    }

    function render() {
      const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
      const matches = assortment.filter((product) => {
        const searchable = normalizeSearch(`${product.name} ${product.category} ${product.size} ${product.size.replace(/ /g, "")} ${product.notes.join(" ")}`);
        return terms.every((term) => searchable.includes(term));
      });
      if (sort) matches.sort(sorters.get(sort));
      else matches.sort((a, b) => Number(Boolean(b.gallery.length)) - Number(Boolean(a.gallery.length)));
      const pageSize = 8;
      const pages = Math.max(1, Math.ceil(matches.length / pageSize));
      page = Math.min(pages, Math.max(page, 1));
      const shown = matches.slice((page - 1) * pageSize, page * pageSize);
      for (const { row, byId } of columns) {
        $(row).children().attr("hidden", true);
        for (const product of shown) {
          const column = byId.get(product.id);
          if (column) {
            column.hidden = false;
            row.append(column);
          }
        }
      }
      searchStatus.prop("hidden", !query).text(matches.length
        ? `${matches.length} result${matches.length === 1 ? "" : "s"} for “${query}”`
        : `No fragrances match “${query}”.`);
      if (category && !assortment.length) {
        const message = encodeURIComponent(`Hi ICONIC Fragrance, what do you currently have in ${categoryName}?`);
        searchStatus.prop("hidden", false).empty()
          .append($("<p>", { text: category === "gifts"
            ? "Gift boxes start at Rs. 6,000. Ask us what’s available."
            : "Ask us which fragrances are available in this collection." }))
          .append($("<a>", { href: `https://wa.me/${store.whatsapp}?text=${message}`, text: "Ask on WhatsApp" }))
          .append($("<a>", { href: browseUrl(""), text: "View all products" }));
      }
      if (query) searchStatus.append(" ", $("<a>", { href: browseUrl(category), text: "Clear search" }));
      searchSort.val(sort).prop("disabled", !sort);
      for (const { key, link } of categoryLinks) link.attr("href", browseUrl(key, query));
      pager.prop("hidden", pages < 2).empty();
      addPageButton("Previous", page - 1, page === 1);
      for (let number = 1; number <= pages; number++) {
        addPageButton(number, number, false, number === page);
      }
      addPageButton("Next", page + 1, page === pages);
      if (page > 1) url.searchParams.set("page", page);
      else url.searchParams.delete("page");
      if (sort) url.searchParams.set("sort", sort);
      else url.searchParams.delete("sort");
      history.replaceState(null, "", url);
    }

    function addPageButton(label, number, disabled, current) {
      const button = $("<button>", { type: "button", class: "page-link", disabled });
      if (typeof label === "number") button.text(label).attr("data-page", number);
      else {
        const icon = label === "Previous" ? "fa-angle-left" : "fa-angle-right";
        button.attr({ "aria-label": `${label} page`, "data-target-page": number })
          .append($("<i>", { class: `far ${icon}`, "aria-hidden": true }));
      }
      if (current) button.attr("aria-current", "page");
      $("<li>", { class: "page-item" }).toggleClass("active", Boolean(current))
        .toggleClass("disabled", disabled).append(button).appendTo(pager);
    }

    function setView(list) {
      shop.find(".shop-products__gird").prop("hidden", list);
      shop.find(".shop-products__list").prop("hidden", !list);
      viewButtons.each(function (index) {
        $(this).toggleClass("active", Boolean(index) === list).attr("aria-pressed", Boolean(index) === list);
      });
    }

    viewButtons.attr("role", "button").each(function (index) {
      this.setAttribute("aria-label", index ? "List view" : "Grid view");
    }).on("click", function (event) {
      event.preventDefault();
      setView(viewButtons.index(this) === 1);
    }).on("keydown", function (event) {
      if (event.key === " ") { event.preventDefault(); this.click(); }
    });
    sortControl.on("change", () => { sort = sortControl.val(); page = 1; render(); });
    pager.on("click", "button", function () {
      page = Number(this.dataset.page || this.dataset.targetPage);
      render();
      pager.find("[aria-current=page]").trigger("focus");
      shop[0].scrollIntoView({ block: "start" });
    });
    setView(false);
    render();
  }

  const orderForm = document.getElementById("order-form");

  function renderCheckout(total) {
    if (!orderForm) return;
    orderForm.hidden = !cart.size;
    $("[data-empty-order]").prop("hidden", Boolean(cart.size));
    $("[data-order-items]").html([...cart].map(([product, qty]) =>
      `<tr><td>${qty} × ${productLink(product)}</td><td>${money(product.price * qty)}</td></tr>`).join(""));
    const shipping = deliveryFee === null
      ? "<tr><td>Delivery</td><td>Confirmed on WhatsApp</td></tr>"
      : `<tr><td>Delivery</td><td>${money(deliveryFee)}</td></tr><tr><td>Total</td><td>${money(total + deliveryFee)}</td></tr>`;
    $("[data-order-totals]").html(`<tr><td>Merchandise subtotal</td><td>${money(total)}</td></tr>${shipping}`);
  }

  function whatsapp(message) {
    location.assign(`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`);
  }

  if (orderForm) {
    const bankDetails = $("[data-bank-details]");
    if (bankAvailable) {
      $("[data-bank-option]").prop("hidden", false).find("input").prop("disabled", false);
      $("<p>", { text: transferInstructions }).appendTo(bankDetails);
      const details = $("<dl>").appendTo(bankDetails);
      for (const [label, value] of [["Bank", bank.bank], ["Account holder", bank.accountHolder],
        ["Account number", bank.accountNumber], ["Branch", bank.branch]]) {
        if (value) details.append($("<dt>", { text: label }), $("<dd>", { text: value }));
      }
    }
    $(orderForm).on("change", "[name=payment]", function () {
      bankDetails.prop("hidden", !(bankAvailable && this.value === "transfer"));
    }).on("submit", function (event) {
      event.preventDefault();
      cart = withLatest(cartKey, cart);
      if (!cart.size) { renderSavedItems(); return; }
      const form = new FormData(this);
      const details = ["name", "phone", "address", "city"].map((key) => form.get(key).trim());
      const missing = details.findIndex((value) => !value);
      const invalid = missing >= 0 ? missing : (/^[+()\d\s.-]+$/.test(details[1]) && details[1].replace(/\D/g, "").length >= 7 ? -1 : 1);
      if (invalid >= 0) {
        const input = this.elements[["name", "phone", "address", "city"][invalid]];
        input.setCustomValidity(invalid === 1 ? "Enter a valid phone number." : "Please complete this field.");
        input.reportValidity();
        return;
      }
      const [name, phone, address, city] = details;
      const transfer = bankAvailable && form.get("payment") === "transfer";
      const total = subtotal(cart);
      whatsapp([
        "Order request for ICONIC Fragrance", "",
        ...[...cart].map(([product, qty]) => `${qty} × ${product.name} (${product.size}) — ${money(product.price * qty)}`),
        "", `Merchandise subtotal: ${money(total)}`,
        deliveryFee === null ? "Delivery fee: Please confirm" : `Delivery: ${money(deliveryFee)}\nTotal: ${money(total + deliveryFee)}`,
        `Payment: ${transfer ? "Online bank transfer" : "Cash on delivery"}`, "",
        `Name: ${name}`, `Phone: ${phone}`, `Delivery address: ${address}, ${city}`,
        "", "Please confirm availability and delivery.",
      ].join("\n"));
    }).on("input", "input", function () { this.setCustomValidity(""); });
  }

  function restoreActionFocus(element) {
    if (document.contains(element)) return;
    const data = [...element.attributes].find(({ name }) => name.startsWith("data-"));
    if (data) document.querySelector(`[${data.name}="${data.value}"]`)?.focus();
  }

  function toggleCategories(button, open) {
    button.setAttribute("aria-expanded", String(open));
    document.getElementById(button.getAttribute("aria-controls")).hidden = !open;
  }

  function selectMobileTab(selectedTab) {
    for (const tab of selectedTab.parentElement.querySelectorAll('[role="tab"]')) {
      const selected = tab === selectedTab;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute("aria-controls")).hidden = !selected;
    }
  }

  $("#mobile-menu-drawer").on("show.bs.drawer", function () {
    selectMobileTab(this.querySelector("#drawer-menu-tab"));
  });

  const banner = $("#homepage-banner");
  if (banner.length) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rotation = $(".home-hero-rotation");
    let rotating = !reduceMotion;
    const fadeDuration = reduceMotion ? 0 : 250;
    // Slick restarts the autoplay timer after the fade.
    banner.data("slick", { autoplay: rotating, autoplaySpeed: 2000 - fadeDuration, speed: fadeDuration });

    function updateRotationControl() {
      const action = rotating ? "Pause" : "Play";
      rotation.text(action).attr("aria-label", `${action} banner rotation`);
    }

    banner.one("init", () => {
      updateRotationControl();
      rotation.prop("hidden", false);
    });
    rotation.on("click", () => {
      rotating = !rotating;
      banner.slick(rotating ? "slickPlay" : "slickPause");
      updateRotationControl();
    });
  }

  $(document)
    .on("click", ".home-service-option", function () {
      if (this.getAttribute("aria-pressed") === "true") return;
      const photo = document.getElementById(this.getAttribute("aria-controls"));
      photo.alt = this.dataset.imageAlt;
      photo.src = this.dataset.image;
      $(this).attr("aria-pressed", "true").siblings("button").attr("aria-pressed", "false");
    })
    .on("click", function (event) {
      const button = document.querySelector(".category-toggle");
      if (!button) return;
      if (button === event.target.closest(".category-toggle")) {
        toggleCategories(button, button.getAttribute("aria-expanded") === "false");
      } else if (!event.target.closest(".category-navigation")) {
        toggleCategories(button, false);
      }
    })
    .on("focusout", ".category-navigation", function (event) {
      if (!this.contains(event.relatedTarget)) toggleCategories(this.querySelector(".category-toggle"), false);
    })
    .on("keydown", ".category-navigation", function (event) {
      if (event.key !== "Escape") return;
      const toggle = this.querySelector('.category-toggle[aria-expanded="true"]');
      if (!toggle) return;
      event.preventDefault();
      event.stopPropagation();
      toggle.focus();
      toggleCategories(toggle, false);
    })
    .on("click", '.mobile-navigation-tabs [role="tab"]', function () {
      selectMobileTab(this);
    })
    .on("keydown", '.mobile-navigation-tabs [role="tab"]', function (event) {
      const tabs = [...this.parentElement.querySelectorAll('[role="tab"]')];
      let next;
      switch (event.key) {
        case "ArrowLeft":
        case "ArrowRight":
          next = tabs[(tabs.indexOf(this) + (event.key === "ArrowLeft" ? -1 : 1) + tabs.length) % tabs.length];
          break;
        case "Home":
          next = tabs[0];
          break;
        case "End":
          next = tabs.at(-1);
          break;
        default:
          return;
      }
      event.preventDefault();
      selectMobileTab(next);
      next.focus();
    })
    .on("click", "[data-add], [data-add-cart], [data-decrease-cart], [data-remove-cart]", function () {
      const { add, addCart, decreaseCart, removeCart } = this.dataset;
      const product = byId.get(add || addCart || decreaseCart || removeCart);
      if (removeCart) {
        cart = withLatest(cartKey, cart);
        cart.delete(product);
        save(cartKey, cart);
      } else {
        const qty = Number($(this).siblings(".quantity-controller").find(".quantity-controller__number").text()) || 1;
        updateCart(product, decreaseCart ? -1 : qty);
      }
      restoreActionFocus(this);
      if (add) {
        if ($(this).closest("#quick-view-modal").length) $.modal.close();
        $("#cart-drawer").drawer("show");
      }
    })
    .on("click", "[data-save], [data-remove-wishlist]", function () {
      const product = byId.get(this.dataset.save || this.dataset.removeWishlist);
      wishlist = withLatest(wishlistKey, wishlist);
      if (wishlist.has(product)) wishlist.delete(product);
      else wishlist.set(product, 1);
      save(wishlistKey, wishlist);
    })
    .on("click", "[data-clear-cart]", function (event) {
      event.preventDefault();
      cart.clear();
      save(cartKey, cart);
    })
    .on("click", "a[aria-disabled=true]", (event) => event.preventDefault())
    .on("click", "[data-quick-view]", function () { openQuickView(byId.get(this.dataset.quickView), this); })
    .on("click", "[data-quantity]", function () {
      const number = $(this).siblings(".quantity-controller__number");
      number.text(Math.max(1, Number(number.text()) + Number(this.dataset.quantity)));
    })
    .on("click keydown", ".product-detail__content__tab .tab-switcher", function (event) {
      if (event.type === "keydown" && event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      $(this).addClass("active").siblings().removeClass("active");
      $(this).closest(".product-detail__content__tab").find(".tab-content__item")
        .hide().filter(`[data-tab-index="${this.dataset.tabIndex}"]`).show();
    })
    .on("keydown", ".menu-functions .search-box", function (event) {
      if (event.key !== "Escape") return;
      $(this).removeClass("active").siblings(".menu-icon.-search").trigger("focus");
    })
    .on("submit", "[data-whatsapp-form]", function (event) {
      event.preventDefault();
      const fields = new FormData(this);
      whatsapp(`${this.dataset.whatsappForm}\n\nName: ${fields.get("name").trim()}\n\n${fields.get("message").trim()}`);
    });

  window.addEventListener("storage", ({ key }) => {
    if (key === cartKey || key === wishlistKey || key === null) {
      cart = readSaved(cartKey);
      wishlist = readSaved(wishlistKey);
      renderSavedItems();
    }
  });

  addMissingShopCards();
  decorateCards();
  renderDetailPage();
  initShop();
  renderSavedItems();
})(jQuery);
