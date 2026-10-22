/* IA na Prática — comportamento da landing page (sem dependências) */
(function () {
  "use strict";
  var cfg = window.LDT_CONFIG || {};
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safeGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* ignora */ } }

  /* ---------- Checkout / preço (config.js é a fonte única; o HTML já traz os mesmos valores) ---------- */
  var buys = document.querySelectorAll("[data-buy]");
  var buy = document.getElementById("buy");
  Array.prototype.forEach.call(buys, function (a) {
    if (cfg.checkoutUrl) {
      a.setAttribute("href", cfg.checkoutUrl);
      a.setAttribute("rel", "noopener");
      a.setAttribute("target", "_blank");
    } else {
      a.setAttribute("href", "#oferta"); a.removeAttribute("target");
    }
  });
  if (!cfg.checkoutUrl && buy) {
    buy.setAttribute("aria-disabled", "true");
    buy.setAttribute("role", "link");
    buy.firstChild.textContent = "Link de compra em breve ";
    buy.addEventListener("click", function (e) { e.preventDefault(); });
  }
  function fill(sel, val) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
      if (val) { el.textContent = val; el.hidden = false; } else { el.hidden = true; }
    });
  }
  if (cfg.price) {
    fill("[data-price]", cfg.price);
    fill("[data-price-old]", cfg.priceOld);
    fill("[data-discount]", cfg.discount);
    fill("[data-price-num]", String(cfg.price).replace(/^R\$\s*/, ""));
    var lbl = document.getElementById("price-label"); if (lbl && cfg.priceLabel) lbl.textContent = cfg.priceLabel;
  } else {
    Array.prototype.forEach.call(document.querySelectorAll("[data-price-wrap]"), function (el) { el.hidden = true; });
  }

  /* ---------- Marquee: duplica para loop contínuo ---------- */
  var track = document.getElementById("marquee");
  if (track && !reduce) {
    Array.prototype.slice.call(track.children).forEach(function (n) {
      var c = n.cloneNode(true); c.setAttribute("aria-hidden", "true"); track.appendChild(c);
    });
  }

  /* ---------- Reveal ao rolar ---------- */
  var items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    /* O conteúdo só fica oculto (para animar) depois que este script roda; sem JS, tudo aparece. */
    document.documentElement.classList.add("reveal-ready");
    items.forEach(function (el) { io.observe(el); });
    /* Rede de segurança: se algo não for revelado em 2,5 s (pré-visualização, captura, observer parado), mostra tudo. */
    setTimeout(function () { items.forEach(function (el) { el.classList.add("in"); }); }, 2500);
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Carrossel de páginas ---------- */
  var rail = document.getElementById("rail");
  if (rail) {
    var step = function () { var s = rail.querySelector(".shot"); return s ? s.getBoundingClientRect().width + 20 : 320; };
    var prev = document.querySelector(".rail-ctl .prev"), next = document.querySelector(".rail-ctl .next");
    if (prev) prev.addEventListener("click", function () { rail.scrollBy({ left: -step(), behavior: reduce ? "auto" : "smooth" }); });
    if (next) next.addEventListener("click", function () { rail.scrollBy({ left: step(), behavior: reduce ? "auto" : "smooth" }); });
    rail.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { rail.scrollBy({ left: step() }); e.preventDefault(); }
      if (e.key === "ArrowLeft") { rail.scrollBy({ left: -step() }); e.preventDefault(); }
    });
  }

  /* ---------- Copiar prompts ---------- */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var el = document.getElementById(btn.getAttribute("data-copy"));
      if (!el) return;
      var text = el.textContent.trim().replace(/^"|"$/g, "");
      var label = btn.querySelector("span");
      var done = function (ok) {
        label.textContent = ok ? "Copiado!" : "Selecione e copie";
        setTimeout(function () { label.textContent = "Copiar prompt"; }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      } else {
        var r = document.createRange(); r.selectNodeContents(el);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); done(false);
      }
    });
  });

  /* ---------- Barra fixa de CTA (mobile) ---------- */
  var sticky = document.getElementById("sticky");
  var hero = document.getElementById("topo");
  var offer = document.getElementById("oferta");
  if (sticky && hero && "IntersectionObserver" in window) {
    var heroOut = false, offerIn = false;
    var upd = function () {
      var show = heroOut && !offerIn;
      sticky.classList.toggle("show", show);
      sticky.setAttribute("aria-hidden", show ? "false" : "true");
      var a = sticky.querySelector("a"); if (a) a.tabIndex = show ? 0 : -1;
    };
    new IntersectionObserver(function (e) { heroOut = !e[0].isIntersecting; upd(); }).observe(hero);
    if (offer) new IntersectionObserver(function (e) { offerIn = e[0].isIntersecting; upd(); }, { threshold: 0.15 }).observe(offer);
  }

  /* ---------- Analytics e Meta Pixel com consentimento (LGPD) ---------- */
  var cookie = document.getElementById("cookie");
  var gaOk = !!cfg.gaId && /^G-[A-Z0-9]+$/.test(cfg.gaId);
  var pxOk = !!cfg.metaPixelId && /^[0-9]{8,20}$/.test(String(cfg.metaPixelId));

  function loadGA(id) {
    var s = document.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date()); window.gtag("config", id, { anonymize_ip: true });
  }
  function loadPixel(id) {
    if (window.fbq) return; /* já carregado no <head> */
    /* Snippet padrão do Meta Pixel */
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    window.fbq("init", id);
    window.fbq("track", "PageView");
  }
  function loadTrackers() {
    if (window.__trackersLoaded) return; window.__trackersLoaded = true;
    if (gaOk) loadGA(cfg.gaId);
    if (pxOk) loadPixel(String(cfg.metaPixelId));
  }

  /* Evento de início de compra ao clicar no botão do checkout */
  if (cfg.checkoutUrl) {
    Array.prototype.forEach.call(buys, function (a) {
      a.addEventListener("click", function () {
        if (window.fbq) {
          window.fbq("track", "InitiateCheckout", { value: cfg.priceValue || 0, currency: "BRL", content_name: "IA na Prática" });
        }
        if (window.gtag) window.gtag("event", "begin_checkout", { currency: "BRL", value: cfg.priceValue || 0 });
      });
    });
  }

  if (gaOk || pxOk) {
    var consent = safeGet("ia-consent");
    if (consent === "yes") loadTrackers();
    else if (consent !== "no" && cookie) cookie.classList.add("show");
    var ok = document.getElementById("cookie-ok"), no = document.getElementById("cookie-no");
    if (ok) ok.addEventListener("click", function () { safeSet("ia-consent", "yes"); cookie.classList.remove("show"); loadTrackers(); });
    if (no) no.addEventListener("click", function () { safeSet("ia-consent", "no"); cookie.classList.remove("show"); });
  }
})();
