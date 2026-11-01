/* Mente Ativa 55+ — main.js
   1. Configuração (link do checkout)
   2. Checkout + repasse de UTMs
   3. Vídeo
   4. Dúvidas (abre uma por vez)
   5. Botão fixo no celular
   6. Botão A+ */

(() => {
  "use strict";

  /* 1. CONFIGURAÇÃO ===================================================== */
  const CHECKOUT_URL = "https://pay.hotmart.com/Y108287925O";
  const CHECKOUT_HOST = "pay.hotmart.com";
  // Parâmetros de rastreio repassados para a Hotmart
  const PASS_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src", "sck", "fbclid", "gclid"];
  const MAX_PARAM_LEN = 200;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* 2. CHECKOUT ========================================================= */
  function buildCheckoutUrl() {
    const url = new URL(CHECKOUT_URL);
    if (url.protocol !== "https:" || url.hostname !== CHECKOUT_HOST) return null;
    const current = new URLSearchParams(window.location.search);
    PASS_PARAMS.forEach((key) => {
      const value = current.get(key);
      if (value && !url.searchParams.has(key)) url.searchParams.set(key, value.slice(0, MAX_PARAM_LEN));
    });
    return url.toString();
  }

  function initCheckout() {
    const href = buildCheckoutUrl();
    if (!href) return;
    $$(".js-checkout").forEach((btn) => {
      btn.href = href;
      btn.rel = "noopener";
      btn.addEventListener("click", () => {
        if (typeof window.fbq === "function") window.fbq("track", "InitiateCheckout", { value: 27, currency: "BRL" });
      });
    });
  }

  /* 3. VÍDEO ============================================================ */
  function initVideo() {
    const video = $("#vsl");
    const playBtn = $("#vslPlay");
    if (!video || !playBtn) return;
    const frame = video.closest(".video-frame");
    playBtn.addEventListener("click", () => {
      video.controls = true;
      video.play().catch(() => {});
    });
    video.addEventListener("play", () => frame.classList.add("is-playing"));
  }

  /* 4. DÚVIDAS ========================================================== */
  function initFaq() {
    const items = $$(".faq details");
    items.forEach((item) => item.addEventListener("toggle", () => {
      if (item.open) items.forEach((other) => { if (other !== item) other.open = false; });
    }));
  }

  /* 5. BOTÃO FIXO NO CELULAR =========================================== */
  function initStickyCta() {
    const bar = $("#stickyCta");
    if (!bar || !("IntersectionObserver" in window)) return;
    const link = $("a", bar);
    const visible = { hero: true, offer: false, footer: false };
    const update = () => {
      const show = !visible.hero && !visible.offer && !visible.footer;
      bar.classList.toggle("is-visible", show);
      bar.setAttribute("aria-hidden", String(!show));
      link.tabIndex = show ? 0 : -1;
    };
    [["hero", ".hero"], ["offer", "#oferta"], ["footer", ".footer"]].forEach(([key, sel]) => {
      const el = $(sel);
      if (el) new IntersectionObserver(([e]) => { visible[key] = e.isIntersecting; update(); }).observe(el);
    });
  }

  /* 6. BOTÃO A+ ========================================================= */
  function initFontToggle() {
    const btn = $("#fontToggle");
    if (!btn) return;
    const KEY = "ma55-font-large";
    const apply = (on) => {
      document.documentElement.classList.toggle("font-large", on);
      btn.setAttribute("aria-pressed", String(on));
      btn.title = on ? "Voltar ao tamanho normal" : "Aumentar o tamanho do texto";
    };
    try { apply(localStorage.getItem(KEY) === "1"); } catch (_) {}
    btn.addEventListener("click", () => {
      const on = !document.documentElement.classList.contains("font-large");
      apply(on);
      try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (_) {}
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("#year").textContent = new Date().getFullYear();
    initCheckout();
    initVideo();
    initFaq();
    initStickyCta();
    initFontToggle();
  });
})();
