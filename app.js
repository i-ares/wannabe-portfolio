/* The People vs. Soham Bhar: editorial courtroom portfolio. Vanilla JS, no build step.
   Flow: title > arraignment > opening statements (briefing) > prosecution > defence > filing cabinet > verdict.
   Retro stays only inside the evidence files (evidence.css + dossier.js). */
(() => {
  const C = window.CONTENT;
  const $ = (s) => document.querySelector(s);
  const stage = $('#stage'), dialog = $('#dialog'), textEl = $('#text'), speakerEl = $('#speaker');
  const choicesEl = $('#choices'), nextBtn = $('#next'), portrait = $('#portrait');
  const recList = $('#recList'), recBox = $('#record'), toast = $('#toast'), modal = $('#modal');
  let sfxOn = true, actx = null, asked = 0, stmts = 0, clip = null, keyHandler = null, typingSkip = null;
  const TOTAL_Q = C.counts.length * 2 + C.defence.length * 2;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- illustrated portraits (flat vector, one palette) ---------- */
  const PORT = {
    JUDGE: `<svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" fill="#ead9a4"/>
      <path d="M8 120 Q16 86 60 82 Q104 86 112 120Z" fill="#0d1117"/><path d="M48 84 L60 106 L72 84Z" fill="#fff"/><path d="M44 86 L50 100 L54 86Z M76 86 L70 100 L66 86Z" fill="#e9edf2"/>
      <rect x="52" y="68" width="16" height="18" fill="#d39870"/><ellipse cx="60" cy="48" rx="22" ry="27" fill="#e7b08a"/>
      <path d="M37 50 Q34 28 60 24 Q86 28 83 50 Q80 36 60 33 Q40 36 37 50Z" fill="#d6dbe3"/><ellipse cx="36" cy="52" rx="6" ry="12" fill="#d6dbe3"/><ellipse cx="84" cy="52" rx="6" ry="12" fill="#d6dbe3"/>
      <path d="M43 44 L55 42 M65 42 L77 44" stroke="#9aa1ad" stroke-width="4" stroke-linecap="round"/>
      <circle cx="51" cy="51" r="7.5" fill="none" stroke="#0d1117" stroke-width="2"/><circle cx="69" cy="51" r="7.5" fill="none" stroke="#0d1117" stroke-width="2"/><path d="M58.5 51 H61.5" stroke="#0d1117" stroke-width="2"/>
      <circle cx="51" cy="51" r="2" fill="#0d1117"/><circle cx="69" cy="51" r="2" fill="#0d1117"/>
      <path d="M60 54 L57 63 L62 63" fill="none" stroke="#c98a63" stroke-width="2"/><path d="M52 70 Q60 67 68 70" fill="none" stroke="#7a3a3a" stroke-width="2.4" stroke-linecap="round"/>
      <g transform="rotate(-35 97 104)"><rect x="90" y="97" width="28" height="6" rx="2" fill="#8a5a2b"/><rect x="85" y="90" width="9" height="20" rx="2" fill="#5b3a1a"/></g></svg>`,
    PROSECUTOR: `<svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" fill="#e8452c"/>
      <path d="M33 56 Q28 100 44 100 L76 100 Q92 100 87 56 Q87 22 60 22 Q33 22 33 56Z" fill="#1b1d27"/>
      <path d="M6 120 Q14 90 60 86 Q106 90 114 120Z" fill="#0d1117"/><path d="M46 88 L60 112 L74 88 L68 86 L60 96 L52 86Z" fill="#fff"/><path d="M40 90 L52 120 L36 120Z M80 90 L68 120 L84 120Z" fill="#262a38"/>
      <rect x="53" y="70" width="14" height="18" fill="#e3ab8c"/><ellipse cx="60" cy="53" rx="19" ry="23" fill="#f0c3a4"/>
      <path d="M40 48 Q44 26 62 28 Q80 28 80 48 Q72 36 60 36 Q48 36 40 48Z" fill="#1b1d27"/>
      <path d="M46 47 Q51 44 56 46 M64 46 Q69 44 74 47" stroke="#1b1d27" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <path d="M46 52 Q51 49 56 52 Q51 55 46 52Z M64 52 Q69 49 74 52 Q69 55 64 52Z" fill="#fff"/><circle cx="51" cy="52" r="1.8" fill="#1b1d27"/><circle cx="69" cy="52" r="1.8" fill="#1b1d27"/>
      <path d="M45 50 L41 48 M75 50 L79 48" stroke="#1b1d27" stroke-width="2" stroke-linecap="round"/>
      <path d="M60 54 L58 62 L62 62" fill="none" stroke="#d99a7a" stroke-width="1.8"/><path d="M52 67 Q60 71 68 65" fill="none" stroke="#b3202f" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="41" cy="62" r="2.2" fill="#f2b035"/><circle cx="79" cy="62" r="2.2" fill="#f2b035"/></svg>`,
    SOHAM: `<svg viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" fill="#c9d3e3"/>
      <path d="M4 120 Q12 88 60 84 Q108 88 116 120Z" fill="#8a8d99"/><ellipse cx="60" cy="86" rx="22" ry="9" fill="#6e717d"/><path d="M52 90 L52 106 M68 90 L68 106" stroke="#e7e9ef" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="52" y="68" width="16" height="16" fill="#d9a07c"/><ellipse cx="60" cy="50" rx="21" ry="25" fill="#e8b894"/>
      <path d="M39 46 Q40 22 60 22 Q80 22 81 46 Q72 33 60 33 Q48 33 39 46Z" fill="#2b1b3a"/>
      <rect x="43" y="46" width="14" height="10" rx="2.5" fill="rgba(191,233,255,.6)" stroke="#0d1117" stroke-width="2.2"/><rect x="63" y="46" width="14" height="10" rx="2.5" fill="rgba(191,233,255,.6)" stroke="#0d1117" stroke-width="2.2"/><path d="M57 50 H63" stroke="#0d1117" stroke-width="2.2"/>
      <circle cx="50" cy="51" r="1.8" fill="#0d1117"/><circle cx="70" cy="51" r="1.8" fill="#0d1117"/>
      <path d="M38 48 Q60 10 82 48" fill="none" stroke="#14161c" stroke-width="4.5" stroke-linecap="round"/>
      <rect x="31" y="44" width="9" height="19" rx="4" fill="#14161c"/><rect x="80" y="44" width="9" height="19" rx="4" fill="#14161c"/><rect x="33" y="47" width="2.5" height="12" rx="1.2" fill="#c8ccd8"/><rect x="84.5" y="47" width="2.5" height="12" rx="1.2" fill="#c8ccd8"/>
      <path d="M35 62 Q36 76 52 71" fill="none" stroke="#14161c" stroke-width="2.6" stroke-linecap="round"/><circle cx="52" cy="71" r="2.6" fill="#14161c"/>
      <path d="M54 66 Q60 70 66 66" fill="none" stroke="#9a4a3a" stroke-width="2.4" stroke-linecap="round"/></svg>`
  };
  const NAMES = { JUDGE: 'Judge Wisp', PROSECUTOR: 'The Prosecutor', SOHAM: 'Soham Bhar, defendant' };
  const KLASS = { JUDGE: 'J', PROSECUTOR: 'P', SOHAM: 'D' };

  /* ---------- sound: soft modern set for the site; the old 8-bit set (sfxR) is kept for the evidence files only ---------- */
  function soft(f, d, v, type = 'sine', t0 = 0, slide = 0) {
    if (!sfxOn || !actx) return;
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + t0;
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + d);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + 0.03);
  }
  function thud(d, v, cut = 900) {
    if (!sfxOn || !actx) return;
    const n = Math.floor(actx.sampleRate * d), buf = actx.createBuffer(1, n, actx.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
    const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
    s.buffer = buf; f.type = 'lowpass'; f.frequency.value = cut; g.gain.value = v; s.connect(f).connect(g).connect(actx.destination); s.start();
  }
  function sfx(k) {
    if (k === 'pick' || k === 'blip') soft(1900, 0.05, 0.012);
    else if (k === 'gavel') { soft(160, 0.24, 0.2, 'sine', 0, -80); thud(0.06, 0.08, 700); }
    else if (k === 'stamp') { soft(100, 0.18, 0.22, 'sine', 0, -40); thud(0.05, 0.06, 500); }
    else if (k === 'coin') { soft(784, 0.55, 0.05); soft(1175, 0.7, 0.04, 'sine', 0.09); }
    else if (k === 'up') soft(330, 0.4, 0.04, 'sine', 0, 330);
    else if (k === 'buzz') soft(120, 0.3, 0.04, 'triangle');
  }
  function toneR(f, d, type = 'square', v = 0.06, t0 = 0, slide = 0) {
    if (!sfxOn || !actx) return;
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + t0;
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.linearRampToValueAtTime(f + slide, t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + 0.02);
  }
  function noiseR(d, v = 0.2) {
    if (!sfxOn || !actx) return;
    const n = actx.sampleRate * d, buf = actx.createBuffer(1, n, actx.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = actx.createBufferSource(), g = actx.createGain(); s.buffer = buf; g.gain.value = v; s.connect(g).connect(actx.destination); s.start();
  }
  function sfxR(k) { /* retro 8-bit: evidence files and cabinet only */
    if (k === 'blip') toneR(880, 0.04, 'square', 0.025);
    else if (k === 'coin') { toneR(988, 0.07, 'square', 0.06); toneR(1319, 0.2, 'square', 0.06, 0.07); }
    else if (k === 'gavel') { toneR(90, 0.3, 'sine', 0.3); noiseR(0.12, 0.25); }
    else if (k === 'stamp') { toneR(60, 0.2, 'sine', 0.3); noiseR(0.06, 0.2); }
    else if (k === 'buzz') toneR(130, 0.4, 'sawtooth', 0.07);
    else if (k === 'up') toneR(300, 0.3, 'square', 0.05, 0, 600);
  }

  /* ---------- voice clips (missing files are fine) ---------- */
  function playClip(id) {
    stopClip();
    if (!id || !sfxOn) return null;
    try { clip = new Audio(`audio/${id}.mp3`); clip.play().catch(() => {}); } catch (e) { clip = null; }
    return clip;
  }
  function stopClip() { if (clip) { try { clip.pause(); } catch (e) {} clip = null; } document.querySelectorAll('.wavebar').forEach((w) => w.remove()); }
  function clipDur(a) {
    return new Promise((res) => {
      if (!a) return res(null);
      if (a.readyState >= 1 && isFinite(a.duration)) return res(a.duration);
      const t = setTimeout(() => res(null), 700);
      a.addEventListener('loadedmetadata', () => { clearTimeout(t); res(isFinite(a.duration) ? a.duration : null); }, { once: true });
      a.addEventListener('error', () => { clearTimeout(t); res(null); }, { once: true });
    });
  }

  /* ---------- court record ---------- */
  function rec(who, text) {
    const p = document.createElement('p'); p.className = KLASS[who] || 'I';
    p.innerHTML = `<b>${esc(NAMES[who] || who)}</b>${esc(text)}`;
    recList.appendChild(p); recList.scrollTop = recList.scrollHeight;
    if (who === 'SOHAM') stmts++;
  }

  /* ---------- speech: words light up in time with the voice ---------- */
  function reveal(text, dur) {
    const words = text.split(/\s+/);
    textEl.innerHTML = words.map((w) => `<span class="w">${esc(w)}</span>`).join(' ');
    const spans = [...textEl.querySelectorAll('.w')];
    const per = dur ? (dur * 1000 * 0.93) / spans.length : 1000 / 2.7;
    return new Promise((res) => {
      let i = 0, iv;
      const finish = () => { clearInterval(iv); spans.forEach((s) => s.classList.add('on')); typingSkip = null; res(); };
      iv = setInterval(() => { if (i < spans.length) spans[i++].classList.add('on'); else finish(); }, per);
      typingSkip = finish;
    });
  }
  function waitNext(typed) {
    return new Promise((res) => {
      let typing = true; typed.then(() => { typing = false; });
      const h = () => {
        if (typing && typingSkip) { typingSkip(); typing = false; return; }
        nextBtn.onclick = null; keyHandler = null; res();
      };
      nextBtn.onclick = h; keyHandler = h;
    });
  }
  async function say(who, text, id, shown) {
    dialog.hidden = false; choicesEl.innerHTML = ''; nextBtn.hidden = false;
    portrait.innerHTML = PORT[who] || PORT.SOHAM;
    rec(who, text);
    const a = playClip(id), dur = await clipDur(a);
    speakerEl.innerHTML = esc(NAMES[who] || who) + (a ? '<span class="wavebar" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>' : '');
    if (a) a.addEventListener('ended', () => document.querySelectorAll('.wavebar').forEach((w) => w.remove()), { once: true });
    await waitNext(reveal(shown || text, shown ? null : dur));
    stopClip();
  }
  document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'Enter') && keyHandler && e.target.tagName !== 'BUTTON' && !document.querySelector('.ov')) { e.preventDefault(); keyHandler(); }
  });

  /* ---------- questions ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function pick(items) {
    dialog.hidden = false; nextBtn.hidden = true; choicesEl.innerHTML = '';
    speakerEl.textContent = NAMES.JUDGE; portrait.innerHTML = PORT.JUDGE;
    textEl.textContent = 'Juror Twelve, you may question the witness.';
    return new Promise((res) => {
      const btns = items.map((it, k) => {
        const b = document.createElement('button');
        b.className = 'q' + (it.done ? ' done' : ''); b.disabled = it.done; b.type = 'button'; b.textContent = it.label;
        b.onclick = () => { sfx('pick'); res(k); }; choicesEl.appendChild(b); return b;
      });
      if (SR) { /* optional mic: say (part of) a question */
        const m = document.createElement('button'); m.className = 'btn mic'; m.type = 'button'; m.textContent = 'Say a question';
        m.onclick = () => {
          const r = new SR(); r.lang = 'en-IN'; r.onresult = (ev) => {
            const said = ev.results[0][0].transcript.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
            let best = -1, bs = 0;
            items.forEach((it, k) => { if (it.done) return; const s = said.filter((w) => it.label.toLowerCase().includes(w)).length; if (s > bs) { bs = s; best = k; } });
            if (best >= 0) btns[best].click(); else toastMsg('Did not catch that. Click a question.');
          };
          r.onerror = () => toastMsg('Mic unavailable. Click a question.'); m.textContent = 'Listening...'; r.start();
        };
        choicesEl.appendChild(m);
      }
    });
  }
  async function interrogate(qs) {
    const done = new Set();
    while (done.size < qs.length) {
      const i = await pick(qs.map((q, k) => ({ label: q.q, done: done.has(k) })));
      done.add(i); setMedia(MEDIA[qs[i].id]); await say('SOHAM', qs[i].a, qs[i].id);
      asked++; setMeter();
    }
  }
  function setMeter(force) { $('#meter i').style.transform = 'scaleX(' + ((force ?? Math.min(100, (asked / TOTAL_Q) * 100)) / 100) + ')'; }

  /* ---------- the project moment behind every question ---------- */
  const MEDIA = {
    D02: { kind: 'video', src: 'assets/clips/pave-teaser.mp4', cap: 'A-V1. The Pave launch teaser.' },
    D03: { kind: 'image', src: 'assets/img/pave-phone-route.jpg', cap: 'A-2. A route suggestion, with the area it would claim.' },
    D04: { kind: 'video', src: 'assets/clips/visn-intro.mp4', cap: 'D-V1. The prototype glasses and the braille reader.' },
    D05: { kind: 'image', src: 'assets/files/visn-hinge.jpg', cap: 'D-5. The hinge design sheet, registered 24 June 2026.' },
    D06: { kind: 'card', big: 'Always have a purpose.', small: 'The AI coding assistant I started in May 2025 and never committed.' },
    D07: { kind: 'card', big: 'Learn with a why.', small: 'Agents and vector stores meant nothing until I knew what to build.' },
    D08: { kind: 'image', src: 'assets/img/visn-glasses.jpg', cap: 'The ESP32-CAM board, on the VISN frame.' },
    D09: { kind: 'card', big: 'Never commit credentials.', small: 'Secrets live in environment files, out of the code.' },
    D10: { kind: 'video', src: 'assets/clips/pave-teaser.mp4', cap: 'A-V1. A run claims the streets it covers.' },
    D11: { kind: 'image', src: 'assets/img/pave-phone-map.jpg', cap: 'A-1. The map home on a real phone.' },
    D12: { kind: 'video', src: 'assets/clips/f1-replay.mp4', cap: 'B-V1. The 2024 Belgian Grand Prix replay at 4x.' },
    D13: { kind: 'image', src: 'assets/img/f1-replay-2.jpg', cap: 'B-2. Standings, weather, radio and tyre tables.' },
    D14: { kind: 'video', src: 'assets/clips/m5-demo.mp4', cap: 'C-V1. Opening a book, the contents list, turning pages.' },
    D15: { kind: 'image', src: 'assets/img/m5-photo.jpg', cap: 'C-1. The actual device, mid-read.' },
    D16: { kind: 'video', src: 'assets/clips/visn-bench.mp4', cap: 'D-V2. The bench demo.' },
    D17: { kind: 'image', src: 'assets/docs/design506847-1.jpg', cap: 'Certificate of registration, design 506847-001.' }
  };
  function setMedia(m) {
    const box = $('#mMedia'); if (!box || !m) return;
    if (m.kind === 'card') box.innerHTML = `<div class="quote"><div><strong>${esc(m.big)}</strong><span>${esc(m.small)}</span></div></div>`;
    else if (m.kind === 'video') box.innerHTML = `<video src="${esc(m.src)}" muted loop playsinline autoplay></video>`;
    else box.innerHTML = `<img src="${esc(m.src)}" alt="">`;
    const v = box.querySelector('video'); if (v) v.play().catch(() => {});
    $('#mCap').textContent = m.cap || '';
    $('#mFrame').classList.toggle('cover', m.kind === 'video' && m.src.includes('f1'));
  }
  function collage(stills, fileKey) {
    const s = (stills || []).slice(0, 2).map((t, i) => `<figure class="still s${i + 1}"><img src="${esc(t)}" alt=""><span>${esc(t.split('/').pop().replace(/\.\w+$/, '').replace(/-/g, ' '))}</span></figure>`).join('');
    return `<div class="collage"><figure class="maincard" id="mFrame"><div class="media" id="mMedia"></div><figcaption class="cap"><b>On screen</b><span id="mCap"></span></figcaption></figure>${s}</div>`;
  }

  /* ---------- UI helpers ---------- */
  let toastT;
  function toastMsg(t) { toast.textContent = t; toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('on'), 2600); }
  const setStage = (html) => { stage.innerHTML = html; window.scrollTo(0, 0); };
  function openModal(html) {
    modal.innerHTML = `<div class="card">${html}<div class="row"><button class="btn" id="mClose" type="button">Close</button></div></div>`;
    modal.hidden = false; $('#mClose').onclick = closeModal;
  }
  function closeModal() { modal.hidden = true; modal.innerHTML = ''; const v = modal.querySelector('video'); if (v) v.pause(); }
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  $('#recBtn').onclick = () => { recBox.hidden = !recBox.hidden; };
  $('#recClose').onclick = () => { recBox.hidden = true; };
  $('#muteBtn').onclick = (e) => { sfxOn = !sfxOn; e.target.textContent = sfxOn ? 'Sound on' : 'Sound off'; if (!sfxOn) stopClip(); };
  $('#objBtn').onclick = () => { sfx('gavel'); toastMsg('Judge Wisp: ' + C.objections[Math.floor(Math.random() * C.objections.length)]); };

  function plainHTML() {
    return `<div class="plain">${C.locker.map((b, i) => `<article><span class="bagtag">Bag ${String(i + 1).padStart(2, '0')}</span><h3>${esc(b.n)}</h3><p>${esc(b.d)}</p><i class="bagseal" aria-hidden="true">Sealed · reviewed</i></article>`).join('')}</div>`;
  }
  function openBuild(key, name) {
    openModal(`<div class="sub">Play the build</div><h3 style="font:900 22px/1.1 var(--display);text-transform:uppercase;margin:8px 0">${esc(name)}</h3><p class="cap" style="margin-bottom:10px">Reconstructed for illustration. Swap in the real dictation recording (assets/build/${esc(key)}.mp4) before submitting.</p>
      <video id="bv" src="assets/build/${esc(key)}.mp4" controls playsinline></video>
      <p class="cap" id="bvMsg" style="margin-top:10px"></p><pre id="bvTx"></pre>`);
    $('#bv').onerror = () => { $('#bv').style.display = 'none'; $('#bvMsg').textContent = 'The timelapse of the dictation session goes in assets/build/' + key + '.mp4'; };
    fetch(`assets/build/${key}.txt`).then((r) => (r.ok ? r.text() : '')).then((t) => { $('#bvTx').textContent = t; }).catch(() => {});
  }

  /* ---------- scenes ---------- */
  async function title() {
    setStage(`<section class="hero"><div>
        <div class="kick">${esc(C.caseNo)}</div>
        <h1>The People <em>vs.</em> Soham Bhar</h1>
        <p class="lead"><b>Charge:</b> being suspiciously employable. The projects take the stand, the evidence is real, and you are Juror Twelve. Ask the questions. Reach a verdict.</p>
        <div class="cta"><button class="big" id="start" type="button">Start the trial</button><button class="ghost" id="tSpeed" type="button">Watch the speed-run</button><button class="ghost" id="tIndex" type="button">Open the case index</button></div>
        <p class="hint">A portfolio by Soham Bhar. Best with sound on.</p></div>
      <div class="collage"><figure class="maincard cover" id="mFrame"><div class="media" id="mMedia"></div><figcaption class="cap"><b>On screen</b><span id="mCap"></span></figcaption></figure>
        <figure class="still s1"><img src="assets/img/visn-glasses.jpg" alt=""><span>The VISN glasses</span></figure><figure class="still s2"><img src="assets/img/pave-phone-map.jpg" alt=""><span>Pave, on a real phone</span></figure></div></section>`);
    setMedia({ kind: 'video', src: 'assets/clips/f1-replay.mp4', cap: 'F1 Terminal: a replay, 4x.' });
    $('#tSpeed').onclick = () => { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); window.Dossier.speedRun(); };
    $('#tIndex').onclick = () => window.Dossier.openIndex();
    await new Promise((res) => { $('#start').onclick = res; });
    actx = actx || new (window.AudioContext || window.webkitAudioContext)(); sfx('gavel');
  }
  async function arraignment() {
    setStage(`<div class="kick">The charges</div><ul class="rap">${C.counts.map((c) => `<li><b>${esc(c.title)}</b><span>${esc(c.sub)}</span></li>`).join('')}</ul>
      <div class="cast"><figure>${PORT.JUDGE}Judge Wisp</figure><figure>${PORT.PROSECUTOR}The prosecutor</figure><figure>${PORT.SOHAM}The defendant</figure></div>`);
    for (const l of C.arraignment) { await say(l.who, l.text, l.id); if (l.who === 'JUDGE') sfx('gavel'); }
    $('#objBtn').hidden = false;
  }
  async function briefing() {
    for (const b of C.briefing) {
      setStage(`<div class="exhibit-head"><div class="exhibit-top"><div class="kick">${esc(b.ex)}</div><h2>${esc(b.name)}</h2></div><button type="button" class="fileb" id="cfB">Open the evidence file</button></div>
        <div class="vidcard"><figure class="maincard"><div class="media"><video src="${esc(b.video)}" autoplay playsinline controls></video></div><figcaption class="cap"><b>Opening statement</b><span>${esc(b.name)}: watch, listen, then continue.</span></figcaption></figure></div>`);
      $('#cfB').onclick = () => window.Dossier.openFile(b.key);
      const v = stage.querySelector('video'); if (v) { v.volume = 1; v.play().catch(() => {}); }
      await say('SOHAM', b.text, undefined, 'My opening statement is playing above. Press play if it has not started, then continue. The full text is in the court record.'); /* the voice is baked into the explainer video */
    }
    setStage(`<div class="exhibit-top"><div class="kick">The rest of the evidence</div><h2>In plain English</h2></div>${plainHTML()}`);
    await say('JUDGE', 'The remaining exhibits are entered into the record. Read any of them. Then we begin.', 'J04');
  }
  const COUNT_FILE = ['pave', 'visn', null, null];
  const COUNT_STILLS = [['assets/img/pave-phone-map.jpg', 'assets/img/pave-phone-run.jpg'], ['assets/img/visn-objects.jpg', 'assets/img/visn-currency.jpg'], [], []];
  async function counts() {
    for (let n = 0; n < C.counts.length; n++) {
      const c = C.counts[n];
      setStage(`<div class="split"><div><div class="kick">${esc(c.title)}</div><h2>${esc(c.sub)}</h2><p class="charge">${esc(c.p)}</p>${COUNT_FILE[n] ? '<button class="fileb" id="fileB" type="button">Open the evidence file</button>' : ''}</div>${collage(COUNT_STILLS[n])}</div>`);
      setMedia(MEDIA[c.qs[0].id]); if (COUNT_FILE[n]) $('#fileB').onclick = () => window.Dossier.openFile(COUNT_FILE[n]);
      sfx('gavel'); await say('PROSECUTOR', c.p, c.pid); await interrogate(c.qs);
    }
    await say('JUDGE', 'The prosecution rests. Barely. The defence may proceed.', 'J05');
  }
  async function defence() {
    for (const d of C.defence) {
      setStage(`<div class="split"><div><div class="kick">${esc(d.ex)}</div><h2>${esc(d.name)}</h2><p class="charge">${esc(d.caption)}</p><button class="fileb" id="fileB" type="button">Open the evidence file</button><div class="row"><button class="btn" id="bBtn" type="button">Play the build</button></div></div>${collage(d.imgs.slice(1, 3))}</div>`);
      setMedia(MEDIA[d.qs[0].id]); $('#bBtn').onclick = () => openBuild(d.build, d.name); $('#fileB').onclick = () => window.Dossier.openFile(d.key);
      if (d.objection) { await say('PROSECUTOR', 'Objection! Already in evidence!', 'P06'); await say('JUDGE', 'Overruled. The defence is allowed to be good twice.', 'J06'); }
      await interrogate(d.qs);
    }
  }
  async function binder() {
    const b = C.binder;
    setStage(`<div class="exhibit-top"><div class="kick">Supporting documents</div><h2>The filing cabinet</h2></div><div id="cabHost" style="margin-top:26px"></div>`);
    window.Dossier.renderCabinet($('#cabHost'), { flow: true }); sfx('coin');
    await say('SOHAM', b.funds.d, b.funds.id);
    await say('JUDGE', 'The defence enters its filing cabinet. Open a drawer, Juror, and inspect any document. The prosecution will object. Let them.', 'J07');
    await say('JUDGE', 'When you are satisfied, press Continue and the jury will retire.', 'J08');
  }
  async function verdict() {
    setStage(`<div class="verdict"><div class="kick">The jury retires</div><h2 id="vt">Deliberating...</h2><div id="vs"></div><div class="stat" id="vc"></div></div>`);
    setMeter(100); sfx('up');
    for (const l of C.verdict) {
      await say(l.who, l.text, l.id); if (l.text.includes('GUILTY')) { $('#vt').innerHTML = 'Guilty of being <em>too employable.</em>'; $('#vs').innerHTML = '<div class="sentence">Sentence: hired</div>'; sfx('stamp'); }
    }
    dialog.hidden = true; $('#vt').innerHTML = 'Case closed.';
    const bs = C.buildStats;
    $('#vc').innerHTML = `<p>Questions asked: <b>${asked}</b> &middot; Statements on record: <b>${stmts}</b>${bs.words ? ` &middot; This site was dictated: <b>${bs.words}</b> words in <b>${bs.minutes}</b> minutes` : ''}</p>
      <div class="row"><a class="btn amber" href="${esc(C.contact.href)}">${esc(C.contact.label)}</a><a class="btn" href="${esc(C.contact.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
      <button class="btn" id="lk" type="button">Evidence locker</button><button class="btn" id="ix" type="button">Case index</button><button class="btn" id="again" type="button">Replay the trial</button></div>`;
    $('#again').onclick = () => location.reload();
    $('#ix').onclick = () => window.Dossier.openIndex();
    $('#lk').onclick = () => openModal(`<div class="sub">Evidence locker</div>${plainHTML()}`);
  }

  window.App = { sfx: sfxR, sfxR, soft: sfx, toast: toastMsg, playClip, stopClip, openRecord: () => { recBox.hidden = false; }, refreshMeter: () => {} };
  $('#idxBtn').onclick = () => window.Dossier.openIndex();
  (async function run() {
    await title(); await arraignment(); await briefing(); await counts(); await defence(); await binder(); await verdict();
  })();
})();
