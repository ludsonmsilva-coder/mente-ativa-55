/* ==========================================================================
   Mente Ativa 55+ — main.js
   Módulos:
   1. Configuração (COLOQUE AQUI O LINK DO CHECKOUT)
   2. Checkout + repasse de UTMs
   3. Cabeçalho ao rolar
   4. Revelar ao rolar
   5. Contadores animados
   6. Método M.E.N.T.E. (abas)
   7. Vídeo
   8. FAQ (abre um por vez)
   9. CTA fixo no celular
   10. Botão A+ (tamanho da letra)
   ========================================================================== */

(() => {
  "use strict";

  /* 1. CONFIGURAÇÃO ======================================================= */
  const CONFIG = {
    // Link do checkout da Hotmart (ex.: "https://pay.hotmart.com/XXXXXXXX")
    checkoutUrl: "",

    // false = botões do topo rolam até a oferta e só o botão da oferta vai pro checkout
    // true  = todos os botões de compra vão direto pro checkout
    directCheckout: false,

    // Parâmetros da URL repassados para o checkout (rastreio de tráfego pago)
    passParams: ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "src", "sck", "fbclid", "gclid"],
  };

  document.documentElement.classList.add("js");

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 2. CHECKOUT + UTMs ==================================================== */
  function buildCheckoutUrl() {
    if (!CONFIG.checkoutUrl) return null;
    const url = new URL(CONFIG.checkoutUrl);
    const current = new URLSearchParams(window.location.search);
    CONFIG.passParams.forEach((key) => {
      if (current.has(key) && !url.searchParams.has(key)) {
        url.searchParams.set(key, current.get(key));
      }
    });
    return url.toString();
  }

  function trackCheckout() {
    // Dispara eventos se os pixels estiverem instalados
    if (typeof window.fbq === "function") window.fbq("track", "InitiateCheckout", { value: 27, currency: "BRL" });
    if (typeof window.gtag === "function") window.gtag("event", "begin_checkout", { value: 27, currency: "BRL" });
  }

  function initCheckout() {
    const checkoutUrl = buildCheckoutUrl();

    $$(".js-checkout").forEach((btn) => {
      const isOfferButton = btn.hasAttribute("data-checkout");
      const goesToCheckout = checkoutUrl && (isOfferButton || CONFIG.directCheckout);

      if (goesToCheckout) {
        btn.href = checkoutUrl;
        btn.addEventListener("click", trackCheckout);
      } else if (isOfferButton) {
        // Sem link configurado ainda: evita recarregar a página
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          console.warn("[Mente Ativa] Configure CONFIG.checkoutUrl em assets/js/main.js");
        });
      }
    });
  }

  /* 3. CABEÇALHO ========================================================== */
  function initHeader() {
    const header = $("#header");
    if (!header) return;
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* 4. REVELAR AO ROLAR =================================================== */
  function initReveal() {
    const items = $$(".reveal");
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    // Escalonamento: itens irmãos aparecem um depois do outro
    items.forEach((el) => {
      const siblings = $$(":scope > .reveal", el.parentElement);
      const index = siblings.indexOf(el);
      if (index > 0) el.style.setProperty("--delay", `${Math.min(index, 6) * 0.08}s`);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* 5. CONTADORES ========================================================= */
  function animateCount(el) {
    const target = Number(el.dataset.target) || 0;
    if (prefersReducedMotion) { el.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function initCounters() {
    const counters = $$(".js-count");
    if (!counters.length) return;
    if (!("IntersectionObserver" in window)) { counters.forEach((c) => (c.textContent = c.dataset.target)); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animateCount(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((c) => io.observe(c));
  }

  /* 6. MÉTODO M.E.N.T.E. ================================================== */
  const PILLARS = [
    {
      letter: "M", title: "Memória",
      tagline: "Leia, guarde… e veja quantos você lembra!",
      desc: "Exercícios para guardar e lembrar informações do dia a dia — como a lista do mercado, nomes e recados.",
      img: "assets/img/m-memoria.webp", alt: "Página de Memória do caderno: Atividade 1, a lista do mercado",
    },
    {
      letter: "E", title: "Expressão",
      tagline: "Caça-palavras com letra grande",
      desc: "Jogos de palavras que mantêm a fala e o vocabulário afiados — para as palavras não ficarem na ponta da língua.",
      img: "assets/img/e-expressao.webp", alt: "Página de Expressão do caderno com caça-palavras",
    },
    {
      letter: "N", title: "Números",
      tagline: "Raciocínio rápido, sem calculadora",
      desc: "Contas do cotidiano e jogos de lógica: contas da feira, troco e sequências numéricas.",
      img: "assets/img/n-numeros.webp", alt: "Página de Números do caderno: contas do dia a dia",
    },
    {
      letter: "T", title: "Toque",
      tagline: "Mão e mente trabalhando juntas",
      desc: "Atividades que unem a mão e o pensamento, como labirintos e exercícios de coordenação.",
      img: "assets/img/t-toque.webp", alt: "Página de Toque do caderno com labirinto",
    },
    {
      letter: "E", title: "Equilíbrio",
      tagline: "Um minuto de calma todos os dias",
      desc: "Hábitos simples de sono, caminhada e convivência, com respiração e gratidão — que fazem a diferença.",
      img: "assets/img/e-equilibrio.webp", alt: "Página de Equilíbrio do caderno com exercício de respiração",
    },
  ];

  function initMethod() {
    const tabs = $$(".method__tab");
    const panel = $("#methodPanel");
    if (!tabs.length || !panel) return;

    const els = {
      img: $("#pillarImg"), letter: $("#pillarLetter"), title: $("#pillarTitle"),
      tagline: $("#pillarTagline"), desc: $("#pillarDesc"), count: $("#pillarCount"),
    };
    let current = 0;
    let autoTimer = null;
    let userInteracted = false;

    // Pré-carrega as imagens dos pilares
    PILLARS.forEach((p) => { const i = new Image(); i.src = p.img; });

    function show(index) {
      current = (index + PILLARS.length) % PILLARS.length;
      const p = PILLARS[current];

      tabs.forEach((t, i) => {
        const active = i === current;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });

      panel.classList.add("is-switching");
      setTimeout(() => {
        els.img.src = p.img;
        els.img.alt = p.alt;
        els.letter.textContent = p.letter;
        els.title.textContent = p.title;
        els.tagline.textContent = p.tagline;
        els.desc.textContent = p.desc;
        els.count.textContent = `${current + 1} / ${PILLARS.length}`;
        panel.classList.remove("is-switching");
      }, prefersReducedMotion ? 0 : 220);
    }

    function stopAuto() { userInteracted = true; clearInterval(autoTimer); }

    tabs.forEach((tab) => tab.addEventListener("click", () => { stopAuto(); show(Number(tab.dataset.pillar)); }));
    $("#pillarPrev")?.addEventListener("click", () => { stopAuto(); show(current - 1); });
    $("#pillarNext")?.addEventListener("click", () => { stopAuto(); show(current + 1); });

    // Setas do teclado nas abas
    $(".method__tabs").addEventListener("keydown", (e) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      stopAuto();
      show(current + (e.key === "ArrowRight" ? 1 : -1));
      tabs[current].focus();
    });

    // Troca sozinho enquanto a seção está visível (até a pessoa clicar)
    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      new IntersectionObserver(([entry]) => {
        clearInterval(autoTimer);
        if (entry.isIntersecting && !userInteracted) autoTimer = setInterval(() => show(current + 1), 5000);
      }, { threshold: 0.5 }).observe(panel);
    }
  }

  /* 7. VÍDEO ============================================================== */
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
    video.addEventListener("ended", () => {
      frame.classList.remove("is-playing");
      $("#oferta")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* 8. FAQ ================================================================ */
  function initFaq() {
    const items = $$(".faq__item");
    items.forEach((item) => {
      item.addEventListener("toggle", () => {
        if (item.open) items.forEach((other) => { if (other !== item) other.open = false; });
      });
    });
  }

  /* 9. CTA FIXO (CELULAR) ================================================= */
  function initStickyCta() {
    const bar = $("#stickyCta");
    const hero = $(".hero");
    const offer = $("#oferta");
    const footer = $(".footer");
    if (!bar || !hero || !("IntersectionObserver" in window)) return;

    const state = { heroVisible: true, offerVisible: false, footerVisible: false };
    const update = () => {
      const show = !state.heroVisible && !state.offerVisible && !state.footerVisible;
      bar.classList.toggle("is-visible", show);
      bar.setAttribute("aria-hidden", String(!show));
      $("a", bar).tabIndex = show ? 0 : -1;
    };

    const watch = (el, key) => el && new IntersectionObserver(([entry]) => {
      state[key] = entry.isIntersecting;
      update();
    }, { threshold: 0.05 }).observe(el);

    watch(hero, "heroVisible");
    watch(offer, "offerVisible");
    watch(footer, "footerVisible");
  }

  /* 10. BOTÃO A+ ========================================================== */
  function initFontToggle() {
    const btn = $("#fontToggle");
    if (!btn) return;
    const KEY = "ma55-font-large";
    const apply = (on) => {
      document.documentElement.classList.toggle("font-large", on);
      btn.setAttribute("aria-pressed", String(on));
      btn.title = on ? "Voltar ao tamanho normal" : "Aumentar o tamanho do texto";
    };
    try { apply(localStorage.getItem(KEY) === "1"); } catch (_) { /* sem storage */ }
    btn.addEventListener("click", () => {
      const on = !document.documentElement.classList.contains("font-large");
      apply(on);
      try { localStorage.setItem(KEY, on ? "1" : "0"); } catch (_) { /* sem storage */ }
    });
  }

  /* INICIALIZAÇÃO ========================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    initCheckout();
    initHeader();
    initReveal();
    initCounters();
    initMethod();
    initVideo();
    initFaq();
    initStickyCta();
    initFontToggle();
  });
})();
