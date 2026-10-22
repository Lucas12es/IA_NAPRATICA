/* IA na Prática — comportamento da landing page (sem dependências) */
(function () {
  "use strict";
  var cfg = window.LDT_CONFIG || {};
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function safeGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* ignora */ } }

  /* ---------- Checkout / preço ---------- */
  var buy = document.getElementById("buy");
  if (buy) {
    if (cfg.checkoutUrl) {
      buy.setAttribute("href", cfg.checkoutUrl);
      buy.setAttribute("rel", "noopener");
      buy.setAttribute("target", "_blank");
      buy.removeAttribute("aria-disabled");
    } else {
      buy.setAttribute("aria-disabled", "true");
      buy.setAttribute("role", "link");
      buy.firstChild.textContent = "Link de compra em breve ";
      buy.addEventListener("click", function (e) { e.preventDefault(); });
    }
  }
  if (cfg.price) {
    var p = document.getElementById("price");
    document.getElementById("price-value").textContent = cfg.price;
    if (cfg.priceOld) { document.getElementById("price-old").textContent = cfg.priceOld; document.getElementById("price-old-wrap").hidden = false; }
    if (cfg.discount) { var off = document.getElementById("price-off"); off.textContent = cfg.discount; off.hidden = false; }
    if (cfg.priceLabel) document.getElementById("price-label").textContent = cfg.priceLabel;
    if (p) p.classList.add("on");
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
    items.forEach(function (el) { io.observe(el); });
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

  /* ---------- Analytics com consentimento (só se gaId estiver configurado) ---------- */
  var cookie = document.getElementById("cookie");
  function loadGA(id) {
    if (window.__gaLoaded) return; window.__gaLoaded = true;
    var s = document.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date()); window.gtag("config", id, { anonymize_ip: true });
  }
  if (cfg.gaId && /^G-[A-Z0-9]+$/.test(cfg.gaId)) {
    var consent = safeGet("ia-consent");
    if (consent === "yes") loadGA(cfg.gaId);
    else if (consent !== "no" && cookie) cookie.classList.add("show");
    var ok = document.getElementById("cookie-ok"), no = document.getElementById("cookie-no");
    if (ok) ok.addEventListener("click", function () { safeSet("ia-consent", "yes"); cookie.classList.remove("show"); loadGA(cfg.gaId); });
    if (no) no.addEventListener("click", function () { safeSet("ia-consent", "no"); cookie.classList.remove("show"); });
  }
})();
