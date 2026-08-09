(function () {
  "use strict";

  /* ---------- MENU MOBILE ---------- */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navbar = document.getElementById("navbar");

  function closeMenu() {
    navMenu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  }
  hamburger.addEventListener("click", function () {
    const open = navMenu.classList.toggle("open");
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
  });
  navMenu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("click", function (e) {
    if (!navbar.contains(e.target)) closeMenu();
  });

  /* ---------- SCROLL SUAVE (fallback) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 82;
      window.scrollTo({ top: top, behavior: "smooth" });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- BARRA DE PROGRESSO + NAVBAR + TOPO ---------- */
  const progress = document.getElementById("progress");
  const toTop = document.getElementById("toTop");
  const navLinks = Array.from(navMenu.querySelectorAll("a[href^='#']"));

  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    progress.style.width = pct + "%";
    navbar.classList.toggle("scrolled", h.scrollTop > 30);
    toTop.classList.toggle("show", h.scrollTop > 500);

    let currentId = "";
    document.querySelectorAll("section[id]").forEach(function (s) {
      if (s.getBoundingClientRect().top <= 140) currentId = s.id;
    });
    navLinks.forEach(function (l) {
      l.classList.toggle("active", l.getAttribute("href") === "#" + currentId);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- ANIMAÇÕES DE ENTRADA ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 6) * 60 + "ms";
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- WASHING STYLE (passo a passo interativo) ---------- */
  const wsSteps = [
    {
      t: "1. Molhar o cabelo",
      d: "Umedeça bem o cabelo com água morna. O fio úmido fica mais maleável e aceita a direção da escova com muito menos esforço.",
      svg: '<circle cx="50" cy="50" r="30" fill="none" stroke="var(--gold)" stroke-width="3"/><path d="M50 8 v14 M32 14 v10 M68 14 v10" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"/>'
    },
    {
      t: "2. Aplicar o produto adequado",
      d: "Shampoo, condicionador ou leave-in, conforme o momento. Distribua de forma uniforme, sem exagerar na quantidade.",
      svg: '<rect x="36" y="26" width="28" height="46" rx="8" fill="none" stroke="var(--gold)" stroke-width="3"/><path d="M46 26v-8h8v8" stroke="var(--gold)" stroke-width="3" fill="none"/><path d="M42 50h16" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"/>'
    },
    {
      t: "3. Escovar seguindo o padrão",
      d: "Escove no mesmo padrão de sempre, região por região, com passadas longas e firmeza moderada. É aqui que o padrão se organiza.",
      svg: '<rect x="22" y="42" width="56" height="16" rx="8" fill="none" stroke="var(--gold)" stroke-width="3"/><path d="M28 58v10M40 58v10M52 58v10M64 58v10M72 58v10" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"/>'
    },
    {
      t: "4. Enxaguar",
      d: "Retire o produto com água, mantendo o cabelo deitado no padrão. Não esfregue em direções aleatórias.",
      svg: '<path d="M50 18c12 16 20 24 20 34a20 20 0 0 1-40 0c0-10 8-18 20-34z" fill="none" stroke="var(--gold)" stroke-width="3"/>'
    },
    {
      t: "5. Finalizar",
      d: "Seque com toalha em movimentos no sentido do padrão, aplique o hidratante e passe a escova soft para polir a superfície.",
      svg: '<path d="M20 62c14-10 46-10 60 0" fill="none" stroke="var(--gold)" stroke-width="3" stroke-linecap="round"/><path d="M50 20l4 12 12 4-12 4-4 12-4-12-12-4 12-4z" fill="var(--gold)" opacity=".85"/>'
    },
    {
      t: "6. Colocar o durag",
      d: "Com o padrão organizado, coloque o durag de forma confortável para que o cabelo assente naquela direção enquanto descansa.",
      svg: '<path d="M24 54a26 26 0 0 1 52 0z" fill="none" stroke="var(--gold)" stroke-width="3"/><path d="M24 54h52M30 60l-14 12M70 60l14 12" stroke="var(--gold)" stroke-width="3" stroke-linecap="round" fill="none"/>'
    }
  ];
  const wsPanel = document.getElementById("wsPanel");
  const wsTabs = Array.from(document.querySelectorAll(".ws-tab"));
  let wsIndex = 0;

  function renderWs(i) {
    wsIndex = (i + wsSteps.length) % wsSteps.length;
    const s = wsSteps[wsIndex];
    wsPanel.innerHTML =
      '<div class="ws-illu"><svg viewBox="0 0 100 90" width="100%">' + s.svg + "</svg></div>" +
      "<div><h3>" + s.t + "</h3><p>" + s.d + "</p></div>";
    wsPanel.style.animation = "none";
    void wsPanel.offsetWidth;
    wsPanel.style.animation = "";
    wsTabs.forEach(function (b, bi) { b.classList.toggle("active", bi === wsIndex); });
  }
  wsTabs.forEach(function (b) {
    b.addEventListener("click", function () { renderWs(Number(b.dataset.ws)); });
  });
  document.getElementById("wsPrev").addEventListener("click", function () { renderWs(wsIndex - 1); });
  document.getElementById("wsNext").addEventListener("click", function () { renderWs(wsIndex + 1); });
  renderWs(0);

  /* ---------- PADRÕES DE WAVES + MAPA SVG ---------- */
  function arrow(x1, y1, x2, y2, delay) {
    return '<path class="flow" d="M' + x1 + " " + y1 + " L" + x2 + " " + y2 +
      '" marker-end="url(#head-arrow)" style="animation-delay:' + delay + 's"/>';
  }
  const patterns = {
    "360": {
      title: "360 Waves",
      desc: "O padrão clássico: todo o cabelo é escovado a partir do topo da cabeça (o coroa) para fora, em todas as direções. O resultado é um anel contínuo de ondas que dá a volta completa na cabeça.",
      list: [
        "Topo: escove da coroa para a frente.",
        "Laterais: escove da coroa para baixo, em direção às orelhas.",
        "Nuca: escove da coroa para baixo, em direção ao pescoço.",
        "Nunca mude o ponto de partida: tudo sai da coroa."
      ],
      diff: "Iniciante",
      for: "Quem está começando",
      arrows: [
        [160, 140, 160, 40, 0], [160, 160, 160, 280, 0.2],
        [140, 150, 40, 150, 0.4], [180, 150, 280, 150, 0.6],
        [145, 138, 72, 78, 0.3], [175, 138, 248, 78, 0.5],
        [145, 168, 72, 232, 0.7], [175, 168, 248, 232, 0.9]
      ]
    },
    "180": {
      title: "180 Waves",
      desc: "Um padrão de meia-cabeça: o cabelo é escovado apenas para frente e para os lados, formando ondas na metade frontal. Muito comum em cortes com a nuca mais baixa.",
      list: [
        "Todo o topo é escovado para frente.",
        "As laterais acompanham para frente e para baixo.",
        "A nuca fica de fora do padrão principal.",
        "Ótimo para quem quer waves visíveis mais rápido na frente."
      ],
      diff: "Fácil",
      for: "Cortes com nuca curta",
      arrows: [
        [160, 170, 160, 46, 0], [130, 175, 100, 60, 0.2], [190, 175, 220, 60, 0.4],
        [110, 180, 52, 122, 0.6], [210, 180, 268, 122, 0.8], [160, 200, 160, 120, 0.3]
      ]
    },
    "540": {
      title: "540 Waves",
      desc: "Uma evolução do 360 com direções mais diagonais: o cabelo é trabalhado em ângulos para criar ondas mais alongadas e inclinadas, especialmente nas laterais.",
      list: [
        "A coroa continua sendo o ponto de partida.",
        "As laterais recebem escovação em diagonal.",
        "As ondas ficam mais compridas e inclinadas.",
        "Exige mais consistência que o 360."
      ],
      diff: "Intermediário",
      for: "Quem já tem padrão formado",
      arrows: [
        [150, 140, 66, 62, 0], [170, 140, 254, 62, 0.2],
        [150, 170, 66, 258, 0.4], [170, 170, 254, 258, 0.6],
        [160, 138, 160, 44, 0.3], [136, 155, 44, 178, 0.5], [184, 155, 276, 178, 0.7]
      ]
    },
    "720": {
      title: "720 Waves",
      desc: "O padrão mais avançado: duas voltas de direção sobre a cabeça, criando um efeito de ondas girando em espiral. Depende de comprimento, textura e muita disciplina de escovação.",
      list: [
        "Direções combinadas em espiral a partir da coroa.",
        "Requer cabelo com comprimento suficiente.",
        "Escovação diária rigorosa e sempre igual.",
        "Não tente pular etapas: domine o 360 antes."
      ],
      diff: "Avançado",
      for: "Nível experiente",
      arrows: [
        [160, 132, 214, 62, 0], [186, 148, 268, 132, 0.15],
        [180, 178, 240, 254, 0.3], [140, 182, 78, 250, 0.45],
        [134, 152, 48, 136, 0.6], [148, 130, 104, 58, 0.75],
        [160, 160, 160, 96, 0.9]
      ]
    }
  };

  const arrowsGroup = document.getElementById("arrows");
  const pTitle = document.getElementById("patternTitle");
  const pDesc = document.getElementById("patternDesc");
  const pList = document.getElementById("patternList");
  const pDiff = document.getElementById("patternDiff");
  const pFor = document.getElementById("patternFor");

  function setPattern(key) {
    const p = patterns[key];
    if (!p) return;
    arrowsGroup.innerHTML = p.arrows.map(function (a) {
      return arrow(a[0], a[1], a[2], a[3], a[4]);
    }).join("");
    pTitle.textContent = p.title;
    pDesc.textContent = p.desc;
    pList.innerHTML = p.list.map(function (i) { return "<li>" + i + "</li>"; }).join("");
    pDiff.textContent = p.diff;
    pFor.textContent = p.for;
    document.querySelectorAll(".pbtn").forEach(function (b) {
      b.classList.toggle("active", b.dataset.pattern === key);
    });
  }
  document.querySelectorAll(".pbtn").forEach(function (b) {
    b.addEventListener("click", function () { setPattern(b.dataset.pattern); });
  });
  setPattern("360");

  /* ---------- FAQ ---------- */
  const faqs = [
    ["Quanto tempo demora para formar waves?", "Depende do seu tipo de cabelo, do comprimento e principalmente da constância. Muita gente começa a ver o padrão se organizando em algumas semanas, mas ondas bem definidas normalmente levam meses de escovação diária."],
    ["Qual escova devo usar?", "Comece por uma escova mais suave e observe a reação do seu cabelo e do couro cabeludo. Se o fio for muito resistente e a escova não alcançar a raiz, suba de intensidade aos poucos."],
    ["Soft ou medium?", "A medium costuma ser a mais versátil para o dia a dia. A soft é ideal para finalizar, polir a superfície e para quem escova muitas vezes ao dia."],
    ["Preciso usar pomada?", "Não é obrigatório. Pomada e produtos de styling ajudam na definição e dão uma fixação leve, mas hidratação e escovação constante são o que realmente formam o padrão."],
    ["Para que serve o durag?", "Ele mantém os fios deitados na direção escovada, reduz o atrito enquanto você dorme e ajuda a preservar a hidratação. Sempre confortável, nunca apertado."],
    ["O que é Washing Style?", "É a técnica de escovar o cabelo úmido seguindo o padrão desejado durante a lavagem, ajudando a organizar e definir o cabelo antes de finalizar e colocar o durag."],
    ["Qual padrão devo escolher?", "O 360 é o ponto de partida mais natural. 180 funciona bem em cortes com a nuca curta, enquanto 540 e 720 pedem experiência e comprimento maior."],
    ["Posso começar com 360 Waves?", "Sim. O 360 é o padrão mais indicado para quem está começando, porque a lógica é simples: tudo sai da coroa para fora."],
    ["Quantas vezes devo escovar?", "Algumas sessões curtas por dia costumam funcionar melhor que uma sessão longa e agressiva. O importante é a regularidade, não a força."],
    ["Como descobrir minha direção de escovação?", "Observe o sentido natural em que o cabelo cresce a partir da coroa. Escovar acompanhando esse crescimento é mais fácil e menos agressivo do que forçar o contrário."]
  ];
  const faqList = document.getElementById("faqList");
  faqList.innerHTML = faqs.map(function (f) {
    return '<div class="faq-item reveal"><button class="faq-q" aria-expanded="false"><span>' +
      f[0] + '</span><i>+</i></button><div class="faq-a"><p>' + f[1] + "</p></div></div>";
  }).join("");

  faqList.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const item = btn.parentElement;
      const ans = item.querySelector(".faq-a");
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      ans.style.maxHeight = open ? ans.scrollHeight + "px" : "0px";
    });
  });
  if ("IntersectionObserver" in window) {
    const io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io2.unobserve(e.target); } });
    }, { threshold: 0.1 });
    faqList.querySelectorAll(".reveal").forEach(function (el) { io2.observe(el); });
  } else {
    faqList.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- BUSCA ---------- */
  const searchInput = document.getElementById("searchInput");
  const searchStatus = document.getElementById("searchStatus");
  const sections = Array.from(document.querySelectorAll("section[id]"));

  function clearSearch() {
    sections.forEach(function (s) { s.classList.remove("search-dim", "search-hit"); });
    searchStatus.hidden = true;
    searchStatus.textContent = "";
  }

  function normalize(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function runSearch(q) {
    const term = normalize(q.trim());
    if (term.length < 2) { clearSearch(); return; }
    const hits = sections.filter(function (s) {
      const hay = normalize((s.dataset.keywords || "") + " " + s.textContent);
      return hay.indexOf(term) !== -1;
    });
    sections.forEach(function (s) {
      const hit = hits.indexOf(s) !== -1;
      s.classList.toggle("search-dim", !hit);
      s.classList.toggle("search-hit", hit);
    });
    searchStatus.hidden = false;
    if (hits.length) {
      searchStatus.textContent = hits.length + " seção(ões) encontrada(s) para “" + q.trim() + "”.";
      const top = hits[0].getBoundingClientRect().top + window.pageYOffset - 82;
      window.scrollTo({ top: top, behavior: "smooth" });
    } else {
      sections.forEach(function (s) { s.classList.remove("search-dim"); });
      searchStatus.textContent = "Nada encontrado para “" + q.trim() + "”. Tente: durag, escova, pomada, 360, washing style.";
    }
  }

  let tId;
  searchInput.addEventListener("input", function () {
    clearTimeout(tId);
    const v = searchInput.value;
    tId = setTimeout(function () {
      if (!v.trim()) clearSearch(); else runSearch(v);
    }, 420);
  });
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { clearTimeout(tId); runSearch(searchInput.value); closeMenu(); }
    if (e.key === "Escape") { searchInput.value = ""; clearSearch(); }
  });
})();

/* ---------- CONTATO ---------- */
(function () {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const EMAIL = "riquelmepaixao28@gmail.com";
  const WHATS = "5575982624011";
  const status = document.getElementById("formStatus");
  const f = {
    name: document.getElementById("cName"),
    email: document.getElementById("cEmail"),
    subject: document.getElementById("cSubject"),
    message: document.getElementById("cMessage")
  };

  function say(msg, isError) {
    status.hidden = false;
    status.textContent = msg;
    status.classList.toggle("error", !!isError);
  }

  function collect() {
    const name = f.name.value.trim().slice(0, 80);
    const email = f.email.value.trim().slice(0, 120);
    const subject = f.subject.value.trim().slice(0, 100) || "Dúvida sobre waves";
    const message = f.message.value.trim().slice(0, 1200);
    [f.name, f.email, f.message].forEach(function (el) { el.classList.remove("invalid"); });
    if (!name) { f.name.classList.add("invalid"); f.name.focus(); say("Informe seu nome.", true); return null; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { f.email.classList.add("invalid"); f.email.focus(); say("Informe um e-mail válido.", true); return null; }
    if (message.length < 10) { f.message.classList.add("invalid"); f.message.focus(); say("Escreva uma mensagem com pelo menos 10 caracteres.", true); return null; }
    return { name: name, email: email, subject: subject, message: message };
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const d = collect();
    if (!d) return;
    const body = "Nome: " + d.name + "\nE-mail: " + d.email + "\n\n" + d.message;
    window.location.href = "mailto:" + EMAIL +
      "?subject=" + encodeURIComponent("[WAVE GUIDE] " + d.subject) +
      "&body=" + encodeURIComponent(body);
    say("Abrindo seu app de e-mail... Se não abrir, escreva para " + EMAIL + ".");
  });

  document.getElementById("sendWhats").addEventListener("click", function () {
    const d = collect();
    if (!d) return;
    const txt = "*WAVE GUIDE - " + d.subject + "*\nNome: " + d.name + "\nE-mail: " + d.email + "\n\n" + d.message;
    window.open("https://wa.me/" + WHATS + "?text=" + encodeURIComponent(txt), "_blank", "noopener");
    say("Abrindo o WhatsApp com sua mensagem pronta.");
  });
})();
