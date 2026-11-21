/* Three Worlds — navigation, transitions, content binding. No dependencies. */
(() => {
  "use strict";
  const P = window.PROJECTS || {};
  const root = document.documentElement;
  const body = document.body;
  const worlds = [...document.querySelectorAll(".world")];
  const ring = document.querySelector(".portal-ring");
  const pills = [...document.querySelectorAll("[data-go]")];
  const prevBtn = document.querySelector("[data-prev]");
  const nextBtn = document.querySelector("[data-next]");
  const counterNow = document.querySelector(".counter-now");
  const announce = document.getElementById("announce");
  const D = 1800; // transition length (ms)

  /* ───────── content binding ───────── */
  const get = (path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), P);
  const has = (v) => v != null && String(v).trim() !== "";

  document.querySelectorAll("[data-bind]").forEach((el) => {
    const v = get(el.dataset.bind);
    if (has(v)) el.textContent = v;
    else if (el.dataset.need) { el.textContent = el.dataset.need; el.classList.add("is-missing"); }
    else { el.textContent = ""; el.hidden = true; }
  });

  document.querySelectorAll("[data-lines]").forEach((el) => {
    const lines = ((P[el.dataset.lines] || {}).lines || []).filter(has).slice(0, 2);
    lines.forEach((t) => { const p = document.createElement("p"); p.textContent = t; el.appendChild(p); });
  });

  const missing = (el, text) => { el.innerHTML = ""; el.textContent = text; el.classList.add("is-missing"); };

  document.querySelectorAll("[data-logo]").forEach((slot) => {
    const proj = P[slot.dataset.logo] || {};
    const name = proj.eyebrow || slot.dataset.logo;
    if (!has(proj.logo)) return missing(slot, `${name} logo`);
    const img = new Image();
    img.alt = `${name} logo`;
    img.onerror = () => missing(slot, `logo file not found: ${proj.logo}`);
    img.src = proj.logo;
    slot.appendChild(img);
  });

  document.querySelectorAll("[data-logo-img]").forEach((img) => {
    const proj = P[img.dataset.logoImg] || {};
    img.onerror = () => { const d = document.createElement("div"); missing(d, `logo file not found: ${proj.logo}`); img.replaceWith(d); };
    if (has(proj.logo)) img.src = proj.logo; else img.onerror();
  });

  document.querySelectorAll("[data-screens]").forEach((wrap) => {
    const key = wrap.dataset.screens;
    const proj = P[key] || {};
    const name = [proj.eyebrow, proj.title].filter(has).join(" ").replace(/^(\w+) \1$/, "$1");
    const list = (proj.screens || []).filter((s) => s && has(s.src)).slice(0, 3);
    if (!list.length) {
      const d = document.createElement("div");
      d.className = "screen screen--1";
      missing(d, `real interface screenshot — ${name}`);
      wrap.appendChild(d);
      return;
    }
    list.forEach((s, i) => {
      const d = document.createElement("div");
      d.className = `screen screen--${i + 1}`;
      const img = new Image();
      img.alt = s.alt || `${name} interface`;
      img.decoding = "async";
      img.onerror = () => missing(d, `screenshot not found: ${s.src}`);
      img.src = s.src;
      d.appendChild(img);
      wrap.appendChild(d);
    });
  });

  // Virtual Hospital specialist agents (avatars from the Staff Roster artifact)
  document.querySelectorAll("[data-agents]").forEach((row) => {
    (window.VH_AGENTS || []).forEach((a, i) => {
      const el = document.createElement("figure");
      el.className = "agent-chip reveal";
      el.style.setProperty("--c", a.c);
      el.style.setProperty("--d", `${640 + i * 90}ms`);
      el.style.setProperty("--bob", `${(-i * 0.65).toFixed(2)}s`);
      el.style.setProperty("--bd", `${(i * 0.9 + 0.5).toFixed(1)}s`);
      el.innerHTML = `<span class="agent-bob"><span class="face" aria-hidden="true">${a.svg}</span></span><figcaption>${a.name}</figcaption>`;
      row.appendChild(el);
    });
  });

  if (P.kitten) root.style.setProperty("--accent-k", P.kitten.accent);
  if (P.hospital) root.style.setProperty("--accent-h", P.hospital.accent);

  const pres = document.querySelector("[data-presenters]");
  const presentersFor = (key) => {
    const P2 = window.PRESENTERS || [];
    return Array.isArray(P2) ? P2 : (P2[key] || []);
  };
  const showPresenters = (key) => {
    pres.innerHTML = "";
    presentersFor(key).forEach((n) => { const s = document.createElement("span"); s.textContent = n; pres.appendChild(s); });
  };

  /* ───────── scale the 1920×1080 stage ───────── */
  const fit = () => body.style.setProperty("--s", Math.min(innerWidth / 1920, innerHeight / 1080).toFixed(4));
  addEventListener("resize", fit);
  fit();

  /* ───────── reduced motion ───────── */
  const mq = matchMedia("(prefers-reduced-motion: reduce)");
  let manual = null;
  const reduced = () => (manual === null ? mq.matches : manual);
  const applyMotion = () => {
    root.classList.toggle("reduce-motion", reduced());
    document.querySelectorAll("svg").forEach((s) => s.pauseAnimations && (reduced() ? s.pauseAnimations() : s.unpauseAnimations()));
  };
  mq.addEventListener ? mq.addEventListener("change", applyMotion) : mq.addListener(applyMotion);
  applyMotion();

  /* ───────── navigation ───────── */
  const fromHash = () => { const n = parseInt(location.hash.slice(1), 10); return n >= 1 && n <= worlds.length ? n - 1 : 0; };
  let current = fromHash();
  let busy = false;

  /* ───────── auto-advance ───────── */
  const AP = window.AUTOPLAY || {};
  const LOOP = AP.loop !== false;
  const DWELL = Math.max(1, +AP.seconds || 5) * 1000;
  let playing = AP.enabled !== false;
  let apTimer = 0;
  const playBtn = document.querySelector("[data-play]");
  const fill = document.querySelector(".counter-fill");
  function stopTimer() {
    clearTimeout(apTimer); apTimer = 0;
    if (fill) { fill.getAnimations().forEach((a) => a.cancel()); fill.style.transform = "scaleX(0)"; }
  }
  function schedule() {
    stopTimer();
    if (!playing || busy || document.hidden) return;
    if (fill) fill.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: DWELL, easing: "linear", fill: "forwards" });
    apTimer = setTimeout(() => advance(1, true), DWELL);
  }
  function setPlaying(on) {
    playing = on;
    body.classList.toggle("is-playing", on);
    if (playBtn) { playBtn.setAttribute("aria-pressed", String(on)); playBtn.setAttribute("aria-label", on ? "Pause auto-advance" : "Start auto-advance"); }
    on ? schedule() : stopTimer();
  }
  document.addEventListener("visibilitychange", () => (document.hidden ? stopTimer() : schedule()));
  let queued = null;

  const accentOf = (w) => (P[w.dataset.key] || {}).accent || "#fff";

  function setChrome(i, themeDelay = 0) {
    const w = worlds[i];
    clearTimeout(setChrome.t);
    setChrome.t = setTimeout(() => { body.dataset.theme = w.dataset.theme; showPresenters(w.dataset.key); }, themeDelay);
    pills.forEach((p, k) => { p.classList.toggle("is-current", k === i); p.setAttribute("aria-current", k === i ? "page" : "false"); });
    counterNow.textContent = String(i + 1).padStart(2, "0");
    prevBtn.disabled = !LOOP && i === 0;
    nextBtn.disabled = !LOOP && i === worlds.length - 1;
    worlds.forEach((x, k) => x.setAttribute("aria-hidden", String(k !== i)));
    announce.textContent = `${i + 1} of ${worlds.length}: ${w.getAttribute("aria-label")}`;
    history.replaceState(null, "", `#${i + 1}`);
  }

  function enterFirst() {
    const w = worlds[current];
    setChrome(current);
    w.classList.add("is-active");
    if (!reduced()) {
      w.querySelector(".atmos").animate(
        [{ opacity: 0, scale: "1.12" }, { opacity: 1, scale: "1" }],
        { duration: 1800, easing: "cubic-bezier(.2,.7,.2,1)" }
      );
    }
    requestAnimationFrame(() => requestAnimationFrame(() => w.classList.add("is-in")));
  }

  function finish(from, to) {
    from.getAnimations().forEach((a) => a.cancel());
    from.classList.remove("is-leaving", "is-out", "is-active", "is-in");
    to.classList.remove("is-entering");
    to.classList.add("is-active");
    to.getAnimations().forEach((a) => a.cancel());
    busy = false;
    if (queued !== null) { const q = queued; queued = null; go(q); return; }
    schedule();
  }

  function go(j, forcedDir) {
    if (j < 0 || j >= worlds.length || j === current) return;
    if (busy) { queued = j; return; }
    busy = true;
    stopTimer();
    const from = worlds[current];
    const to = worlds[j];
    const dir = forcedDir || (j > current ? 1 : -1);
    current = j;
    setChrome(j, reduced() ? 0 : D * 0.5);

    from.classList.remove("is-in");
    from.classList.add("is-out");

    if (reduced()) {
      to.classList.add("is-entering", "is-in");
      to.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: "ease" })
        .finished.then(() => finish(from, to));
      return;
    }

    from.classList.remove("is-active");
    from.classList.add("is-leaving");
    to.classList.add("is-entering");

    // 1 · the outgoing world recedes into depth
    from.animate(
      [{ scale: "1", translate: "0 0", opacity: 1 },
       { scale: ".9", translate: `${-3 * dir}% 0`, opacity: 0.2 }],
      { duration: D * 0.85, easing: "cubic-bezier(.6,0,.4,1)", fill: "forwards" }
    );

    // 2 · the incoming world arrives through a capsule portal
    const start = dir > 0 ? "34% 3% 34% 89%" : "34% 89% 34% 3%";
    const mid = "15% 40% 15% 40%";
    const clip = to.animate(
      [
        { clipPath: `inset(${start} round 400px)`, offset: 0, easing: "cubic-bezier(.55,0,.25,1)" },
        { clipPath: `inset(${mid} round 600px)`, offset: 0.42, easing: "cubic-bezier(.75,0,.15,1)" },
        { clipPath: "inset(0% 0% 0% 0% round 0px)", offset: 1 }
      ],
      { duration: D, fill: "both" }
    );
    to.querySelector(".atmos").animate(
      [{ scale: "1.3", translate: `${6 * dir}% 0` }, { scale: "1", translate: "0 0" }],
      { duration: D * 1.05, easing: "cubic-bezier(.3,0,.1,1)", fill: "both" }
    );
    const comp = to.querySelector(".k-composition, .h-composition");
    if (comp) {
      comp.animate(
        [{ opacity: 0, scale: ".84", filter: "blur(14px)" }, { opacity: 1, scale: "1", filter: "blur(0px)" }],
        { duration: D * 0.75, delay: D * 0.35, easing: "cubic-bezier(.2,.7,.2,1)", fill: "both" }
      );
    }

    // 3 · the luminous rim of the capsule — the shared element
    ring.style.setProperty("--ring", accentOf(to));
    ring.animate(
      [
        { inset: start, borderRadius: "400px", offset: 0, easing: "cubic-bezier(.55,0,.25,1)" },
        { inset: mid, borderRadius: "600px", offset: 0.42, easing: "cubic-bezier(.75,0,.15,1)" },
        { inset: "0% 0% 0% 0%", borderRadius: "0px", offset: 1 }
      ],
      { duration: D }
    );
    ring.animate(
      [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.45 }, { opacity: 0.5, offset: 0.8 }, { opacity: 0 }],
      { duration: D }
    );

    // 4 · text arrives as the portal opens
    setTimeout(() => to.classList.add("is-in"), D * 0.42);
    clip.finished.then(() => finish(from, to));
  }

  function advance(step, auto) {
    const n = worlds.length;
    let j = current + step;
    if (LOOP) j = (j + n) % n;
    if (j < 0 || j >= n) return;
    go(j, step);
  }
  const next = () => advance(1);
  const prev = () => advance(-1);
  if (playBtn) playBtn.addEventListener("click", (e) => { setPlaying(!playing); e.currentTarget.blur(); });

  nextBtn.addEventListener("click", (e) => { next(); e.currentTarget.blur(); });
  prevBtn.addEventListener("click", (e) => { prev(); e.currentTarget.blur(); });
  pills.forEach((p) => p.addEventListener("click", (e) => { go(+p.dataset.go); e.currentTarget.blur(); }));

  addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const onButton = document.activeElement && document.activeElement.tagName === "BUTTON";
    switch (e.key) {
      case "ArrowRight": case "ArrowDown": case "PageDown": next(); break;
      case "ArrowLeft": case "ArrowUp": case "PageUp": prev(); break;
      case " ": if (onButton) return; e.shiftKey ? prev() : next(); break;
      case "Home": go(0); break;
      case "End": go(worlds.length - 1); break;
      case "1": case "2": case "3": go(+e.key - 1); break;
      case "f": case "F":
        if (document.fullscreenElement) document.exitFullscreen(); else root.requestFullscreen && root.requestFullscreen();
        break;
      case "m": case "M": manual = !reduced(); applyMotion(); break;
      case "p": case "P": case "k": case "K": setPlaying(!playing); break;
      default: return;
    }
    e.preventDefault();
  });

  // touch swipe (tablets / touch laptops) — only on a deliberate horizontal swipe
  let tx = null, ty = null;
  addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  addEventListener("touchend", (e) => {
    if (tx === null) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)();
    tx = ty = null;
  });

  /* ───────── gentle pointer parallax + idle cursor ───────── */
  let tmx = 0, tmy = 0, mx = 0, my = 0, raf = 0, idleT = 0;
  const tick = () => {
    mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
    body.style.setProperty("--mx", mx.toFixed(4));
    body.style.setProperty("--my", my.toFixed(4));
    raf = Math.abs(tmx - mx) + Math.abs(tmy - my) > 0.001 ? requestAnimationFrame(tick) : 0;
  };
  addEventListener("pointermove", (e) => {
    body.classList.remove("idle");
    clearTimeout(idleT);
    idleT = setTimeout(() => body.classList.add("idle"), 2500);
    if (reduced()) return;
    tmx = (e.clientX / innerWidth) * 2 - 1;
    tmy = (e.clientY / innerHeight) * 2 - 1;
    if (!raf) raf = requestAnimationFrame(tick);
  });

  // expose for testing / manual control from the console
  window.worlds = { go, next, prev, get current() { return current; }, get busy() { return busy; } };

  enterFirst();
  setPlaying(playing);
})();
