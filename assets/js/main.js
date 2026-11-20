// Item name: ICONIC Fragrance - Fragrance Shop HTML Template
// Creator: Khanh Vu
// Owned by: Avitex Studio
// Created at: 01/10/2020
// Lastest update: 01/10/2020

const globalSliderSettings = {
  nextArrow: `<a href="#" class="slick-next"><i class="far fa-chevron-right"></i></a>`,
  prevArrow: `<a href="#" class="slick-prev"><i class="far fa-chevron-left"></i></a>`,
  customPaging: function (slider, i) {
    return '<div class="slider-dot"></div>';
  },
};

function runHeroSliderAnimation() {
  function animationHandle(currentSlide) {
    let animationItems = currentSlide.find("[data-animation-in]");
    $.each(animationItems, function (index, item) {
      let animationName = $(item).data("animation-in");
      let animationDelay = $(item).data("animation-delay");
      let addedAnimtionName = `animate__${animationName}`;
      $(item)
        .addClass(`animate__animated ${addedAnimtionName}`)
        .css({
          animationDelay: animationDelay + "s",
        });
      $(item).one(
        "animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd",
        function () {
          $(this).removeClass(`animate__animated ${addedAnimtionName}`);
        }
      );
    });
  }

  let $slider = $(".slider__carousel").on("init", function (e, slick) {
    let $currentSlide = $(slick.$slider).find(
      ".slider__carousel__item.slick-active"
    );
    animationHandle($currentSlide);
  });

  $slider.on("beforeChange", function (e, slick, currentSlide, nextSlide) {
    let $nextSlide = $(
      '.slider__carousel__item[data-slick-index="' + nextSlide + '"]'
    );
    animationHandle($nextSlide);
  });

  $slider.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    dotsClass: "slider-dots container",
    infinite: false,
    fade: true,
    infinite: true,
    // speed: 700,
    ...globalSliderSettings,
  });
}

const slickSlider = () => {
  //Homepage 1

  $(".product-slider .product-slide__wrapper").slick({
    dots: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    ...globalSliderSettings,
    responsive: [
      {
        breakpoint: 1170,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      // {
      //   breakpoint: 576,
      //   settings: {
      //     slidesToShow: 1,
      //   },
      // },
    ],
  });

  //Handle testimonial slide
  (function () {
    let currentSlideIndex = 0;

    const $tesNav = $(
      ".testimonial-slider .slide-nav .slide-nav__wrapper"
    ).slick({
      slideToShow: 1,
      rows: 2,
      slidesPerRow: 4,
      arrow: false,
    });

    const $tesFor = $(
      ".testimonial-slider .slide-for .slide-for__wrapper"
    ).slick({
      infinite: false,
      slideToShow: 1,
      arrows: false,
      swipeToSlide: true,
      focusOnSelect: true,
    });

    const checkNavItemActive = (index) => {
      $(
        `.testimonial-slider .slide-nav .slide-nav__wrapper .slide-nav__item`
      ).removeClass("active");
      $(
        `.testimonial-slider .slide-nav .slide-nav__wrapper .slide-nav__item[key=${index}]`
      ).addClass("active");
    };

    checkNavItemActive(currentSlideIndex);

    $tesFor.on("afterChange", function () {
      currentSlideIndex = $tesFor.slick("slickCurrentSlide");
      checkNavItemActive(currentSlideIndex);
    });

    $(`.testimonial-slider .slide-nav .slide-nav__wrapper .slide-nav__item`).on(
      "click",
      function () {
        let a = $(this).attr("key");
        console.log(a);
        $tesFor.slick("slickGoTo", a);
      }
    );

    $(".testimonial-one__slider-control .next").on("click", function (e) {
      e.preventDefault();
      $tesFor.slick("slickNext");
    });

    $(".testimonial-one__slider-control .prev").on("click", function (e) {
      e.preventDefault();
      $tesFor.slick("slickPrev");
    });
  })();

  $(".team-one-slider").slick({
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  $(".product-tab-slide .product-tab-slide__content").slick({
    centerMode: true,
    centerPadding: "250px",
    slidesToShow: 4,
    ...globalSliderSettings,
    dots: false,
    responsive: [
      {
        breakpoint: 1500,
        settings: {
          centerPadding: "200px",
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1140,
        settings: {
          centerPadding: "100px",
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992,
        settings: {
          centerPadding: "100px",
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          // centerMode: false,
          centerPadding: "40px",
          slidesToShow: 1,
        },
      },
    ],
  });

  $(".blog-two-content__slider").slick({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  });

  $(".instagram-two-slider").slick({
    dots: false,
    arrows: false,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  });

  $(".category-two-slider").slick({
    dots: false,
    infinite: false,
    slidesToShow: 7,
    slidesToScroll: 1,
    ...globalSliderSettings,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  });

  $(".testimonial-three-slider").slick({
    ...globalSliderSettings,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  });

  $(".product-detail__slide-two__big").slick({
    arrows: false,
    swipe: false,
    asNavFor: ".product-detail__slide-two__small",
  });

  $(".product-detail__slide-two__small").slick({
    arrows: true,
    dots: false,
    focusOnSelect: true,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "80px",
    asNavFor: ".product-detail__slide-two__big",
    ...globalSliderSettings,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          centerPadding: "50px",
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          centerPadding: "50px",
        },
      },
    ],
  });

  $(".introduction-nine__logos-slide").slick({
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    ...globalSliderSettings,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  });
};

const validateForm = () => {
  $.validator.addMethod(
    "valueNotEquals",
    function (value, element, arg) {
      return arg !== value;
    },
    "Value must not equal arg."
  );
  $(".validated-form").validate({
    rules: {
      SelectName: { valueNotEquals: "default" },
    },
    messages: {
      SelectName: { valueNotEquals: "Please select an item!" },
    },
  });
};

const parallaxHover = () => {
  (function () {
    const sence1 = document.querySelector(
      ".introduction-one-image__background .background__item:first-child .wrapper"
    );
    const sence2 = document.querySelector(
      ".introduction-one-image__background .background__item:last-child .wrapper"
    );
    const parallaxInstance = new Parallax(sence1);
    const parallaxInstance2 = new Parallax(sence2);
  })();
};

const onHoverChangeVideoSrc = () => {
  $(".introduction-two-content__item").on("mouseover", function (e) {
    e.preventDefault();
    let cover = $(this).attr("data-cover");
    let src = $(this).attr("data-src");
    $(".introduction-two-content__item").removeClass("active");
    $(this).addClass("active");
    $(".introduction-two .video-frame__poster img").attr(
      "src",
      cover.toString()
    );
  });
};

const onOpenQuickViewModal = () => {
  $(".product-qv").on("click", function (e) {
    e.preventDefault();
    let quickViewModalIns = $("#quick-view-modal").modal({
      fadeDuration: 300,
    });
    quickViewModalIns.on($.modal.OPEN, function (e, modal) {
      $(".product-detail__slide-one .slider-wrapper").slick({
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        dotsClass: "slider-dots",
        ...globalSliderSettings,
      });
    });
  });
};

const onOpenDrawer = () => {
  $(".menu-icon.-cart").on("click", function (e) {
    e.preventDefault();
    $("#cart-drawer").drawer();
  });

  $(".menu-icon.-navbar").on("click", function (e) {
    e.preventDefault();
    $("#mobile-menu-drawer").drawer();
  });
};

const mobileSidebarMenuHandle = () => {
  $(".navigator-mobile .dropdown-menu").slideUp();
  $(".navigator-mobile .dropdown-menu-controller").on("click", function (e) {
    e.preventDefault();
    $(this).next().slideToggle(200);
    $(this).children().children().toggleClass("fa-angle-down fa-angle-up");
  });
};

const countDownDale = () => {
  $("#clock").countdown("2020/10/10", function (event) {
    var $this = $(this).html(
      event.strftime(
        "" +
          "<div class='countdown__item'><h6>%d</h6><span> days</span></div>" +
          "<div class='countdown__item'><h6>%H</h6><span> hours </span></div>" +
          "<div class='countdown__item'><h6>%M</h6><span> minutes</span></div> " +
          "<div class='countdown__item'><h6>%S</h6><span> sec</span></div>"
      )
    );
  });
};

const accordion = () => {
  $(".accordion > .accordion-group > .accordion-content:not(.active)").hide();
  $(".accordion > .accordion-group > .accordion-header").on("click", function (
    e
  ) {
    e.preventDefault();
    $(this).parent().siblings().removeClass("active");
    $(this).parent().addClass("active");
    if (!$(this).next().hasClass("active")) {
      $(".accordion > .accordion-group > .accordion-content")
        .removeClass("active")
        .slideUp();
      $(this).addClass("active");
      $(this).next().addClass("active").slideDown();
    }

    return false;
  });
};

const tab = () => {
  var previousActiveTabIndex = 0;
  $(".tab-switcher").on("click keypress", function (event) {
    if (
      (event.type === "keypress" && event.which === 13) ||
      event.type === "click"
    ) {
      $(this).addClass("active").siblings().removeClass("active");
      var tabClicked = $(this).data("tab-index");
      if (tabClicked != previousActiveTabIndex) {
        $("#allTabsContainer .tab-content__item").each(function () {
          if ($(this).data("tab-index") == tabClicked) {
            $(".tab-content__item").hide();
            $(this).show();
            previousActiveTabIndex = $(this).data("tab-index");
            return;
          }
        });
      }
    }
  });
};

const renderProduct = (type) => {
  if (type === "list") {
    $(".shop-products__gird").hide();
    $(".shop-products__list").show();
  } else {
    $(".shop-products__gird").show();
    $(".shop-products__list").hide();
  }
};

const toggleProductView = () => {
  let view = "grid";
  renderProduct(view);
  $(".shop-header__view__icon > a:first-child").on("click", function (e) {
    e.preventDefault();
    view = "grid";
    $(this).addClass("active").siblings().removeClass("active");
    renderProduct(view);
  });
  $(".shop-header__view__icon > a:last-child").on("click", function (e) {
    e.preventDefault();
    view = "list";
    $(this).addClass("active").siblings().removeClass("active");
    renderProduct(view);
  });
};

const openSearchBox = () => {
  $(".menu-icon.-search").on("click", function (e) {
    e.preventDefault();
    $(".menu-functions .search-box").addClass("active");
    $(document).mouseup(function (e) {
      var container = $(".menu-functions .search-box");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.removeClass("active");
      }
    });
  });
};

$(document).ready(function () {
  runHeroSliderAnimation();
  slickSlider();
  validateForm();
  // parallaxHover();
  onHoverChangeVideoSrc();
  onOpenQuickViewModal();
  onOpenDrawer();
  mobileSidebarMenuHandle();
  countDownDale();
  accordion();
  toggleProductView();
  tab();
  openSearchBox();
});
;
/* ICONIC cart — 2026-11-20: real cart stored in localStorage.
   Unifies the header count/total, the cart drawer and the cart page,
   which previously showed three different static demo totals. */
(function ($) {
  var KEY = "iconic_cart_v1";
  function fmt(n) { return "Rs. " + Number(n || 0).toLocaleString("en-US"); }
  function parsePrice(t) { var m = String(t || "").replace(/[^0-9]/g, ""); return parseInt(m, 10) || 0; }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {} }
  function totals(c) { var q = 0, t = 0; c.forEach(function (i) { q += i.qty; t += i.qty * i.price; }); return { qty: q, total: t }; }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

  function render() {
    var c = load(), tt = totals(c);
    $(".cart__quantity").text(tt.qty);
    $(".menu-cart h5 span").text(fmt(tt.total));
    var $w = $(".cart-items__wrapper");
    if ($w.length) {
      $w.find(".cart-item").remove();
      if (!c.length) {
        $w.find(".cart-items__total").before('<div class="cart-item"><div class="cart-item__info"><p>Your cart is empty.</p></div></div>');
      } else {
        c.forEach(function (it, idx) {
          $w.find(".cart-items__total").before(
            '<div class="cart-item"><div class="cart-item__image"><img src="' + esc(it.img) + '" alt="Product image"/></div>' +
            '<div class="cart-item__info"><a href="product-detail.html">' + esc(it.name) + '</a><h5>' + fmt(it.price) + '</h5><p>Quantity:<span> ' + it.qty + '</span></p></div>' +
            '<a class="cart-item__remove" href="#" data-idx="' + idx + '"><i class="fal fa-times"></i></a></div>');
        });
      }
      $w.find(".cart-items__total__price span").text(fmt(tt.total));
    }
    var $tb = $(".cart__table__wrapper table tbody");
    if ($tb.length) {
      $tb.empty();
      if (!c.length) {
        $tb.append('<tr><td colspan="5" style="text-align:center;padding:2.5em 0;">Your cart is empty. <a href="shop-fullwidth-4col.html">Continue shopping</a></td></tr>');
      } else {
        c.forEach(function (it, idx) {
          $tb.append('<tr><td><div class="cart-product"><div class="cart-product__image"><img src="' + esc(it.img) + '" alt="Product image"/></div>' +
            '<div class="cart-product__content"><h5>ICONIC Fragrance</h5><a href="product-detail.html">' + esc(it.name) + '</a></div></div></td>' +
            '<td>' + fmt(it.price) + '</td>' +
            '<td><span class="qty-btn" data-idx="' + idx + '" data-d="-1">-</span><span style="margin:0 .5em;">' + it.qty + '</span><span class="qty-btn" data-idx="' + idx + '" data-d="1">+</span></td>' +
            '<td>' + fmt(it.price * it.qty) + '</td>' +
            '<td><a href="#" class="cart-remove" data-idx="' + idx + '"><i class="fal fa-times"></i></a></td></tr>');
        });
      }
      var $ct = $(".cart__total__content table tbody");
      if ($ct.length) {
        $ct.find("tr:eq(0) td").text(fmt(tt.total));
        $ct.find(".final-price").text(fmt(tt.total));
      }
    }
  }

  function add(item) {
    var c = load(), found = false;
    c.forEach(function (it) { if (it.name === item.name) { it.qty += item.qty; found = true; } });
    if (!found) c.push(item);
    save(c); render();
  }

  $(document).on("click", ".product-atc", function (e) {
    e.preventDefault();
    var $p = $(this).closest(".product");
    var name = $.trim($p.find(".product-name").text());
    var price = parsePrice($p.find(".product-price--main").first().text());
    var img = $p.find(".product-thumb__image img").first().attr("src") || "";
    if (!name || !price) return;
    add({ name: name, price: price, img: img, qty: 1 });
    $("#cart-drawer").drawer();
  });

  $(document).on("click", ".product-detail__content .add-to-cart", function (e) {
    e.preventDefault();
    var name = $.trim($(".product-detail__content__header h2").first().text());
    var price = parsePrice($(".product-price--main").first().text());
    var qty = parseInt($.trim($(".quantity-controller__number").first().text()), 10) || 1;
    var img = $(".product-detail__slide img").first().attr("src") || "";
    if (!name || !price) return;
    add({ name: name, price: price, img: img, qty: qty });
    $("#cart-drawer").drawer();
  });

  $(document).on("click", ".cart-item__remove", function (e) {
    e.preventDefault();
    var c = load(); c.splice(+$(this).data("idx"), 1); save(c); render();
  });
  $(document).on("click", ".cart-remove", function (e) {
    e.preventDefault();
    var c = load(); c.splice(+$(this).data("idx"), 1); save(c); render();
  });
  $(document).on("click", ".qty-btn", function () {
    var c = load(), idx = +$(this).data("idx");
    if (!c[idx]) return;
    c[idx].qty += +$(this).data("d");
    if (c[idx].qty <= 0) c.splice(idx, 1);
    save(c); render();
  });
  $(document).on("click", "a", function (e) {
    if ($.trim($(this).text()).indexOf("Clear Shopping Cart") !== -1) {
      e.preventDefault(); save([]); render();
    }
  });

  $(document).ready(render);
})(jQuery);
;
/* ICONIC contact config 2026-11-20 — CHANGE THE EMAIL HERE and it updates everywhere on the site.
   The address printed in the pages is only a fallback; this value wins on load.
   Current value is a PLACEHOLDER until the shop's real email is confirmed. */
window.ICONIC_CONTACT = { email: "iconicfragrance@gmail.com" };
$(document).ready(function () {
  var em = window.ICONIC_CONTACT.email;
  $("[data-iconic-email]").each(function () {
    var $el = $(this);
    if ($el.is("a")) { $el.attr("href", "mailto:" + em); }
    $el.text(em);
  });
});
