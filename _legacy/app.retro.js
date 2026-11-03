/* The People vs. Soham Bhar: courtroom portfolio. Vanilla JS, no build step.
   Flow: title > arraignment > opening statements (briefing) > prosecution > defence > binder > verdict. */
(() => {
  const C = window.CONTENT;
  const $ = (s) => document.querySelector(s);
  const stage = $('#stage'), dialog = $('#dialog'), textEl = $('#text'), speakerEl = $('#speaker');
  const choicesEl = $('#choices'), nextBtn = $('#next'), portrait = $('#portrait');
  const recList = $('#recList'), recBox = $('#record'), toast = $('#toast'), modal = $('#modal');
  let sfxOn = true, actx = null, asked = 0, stmts = 0, clip = null, keyHandler = null, typingSkip = null;
  const TOTAL_Q = C.counts.length * 2 + C.defence.length * 2;

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ---------- pixel sprites ---------- */
  function sprite(rows, pal) {
    const w = Math.max(...rows.map((r) => r.length)), h = rows.length;
    let s = '';
    rows.forEach((r, y) => [...r].forEach((c, x) => { if (pal[c]) s += `<rect x="${x}" y="${y}" width="1" height="1" fill="${pal[c]}"/>`; }));
    return `<svg viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" aria-hidden="true">${s}</svg>`;
  }
  const SPR = {
    JUDGE: sprite(['....WWWWWW....', '...WWWWWWWW...', '..WWWWWWWWWW..', '..WWSSSSSSWW..', '..WSGGSSGGSW..', '..WSGGSSGGSW..', '...SSSSSSSS...', '...SSKKKKSS...', '....SSSSSS....', '..CCCCCCCCCC..', '.CCCCCCCCCCCC.', 'CCC..CCCC..CCC', 'C.....CC.....C'],
      { W: '#eeeaff', S: '#ffcfa3', G: '#201030', K: '#7a3a3a', C: '#35e0ff' }),
    PROSECUTOR: sprite(['...HHHHHH...', '..HHHHHHHH..', '..HSSSSSSH..', '..SKSSSSKS..', '..SSSSSSSS..', '...SSMMSS...', '..RRWWWWRR..', '.RRRWWWWRRR.', '.RRRRRRRRRR.', '.RR.RRRR.RR.', '....RRRR....', '....RR.RR...'],
      { H: '#2b1b3a', S: '#ffcfa3', K: '#201030', M: '#a03a3a', R: '#ff4f81', W: '#f4ecd0' }),
    SOHAM: sprite(['..HHHHHH..', '.HHHHHHHH.', '.HSSSSSSH.', '..SKSSKS..', '..SSSSSS..', '...SSSS...', '.BBBBBBBB.', 'BBBBBBBBBB', 'BB.BBBB.BB', '...LLLL...', '...L..L...'],
      { H: '#2b1b3a', S: '#ffcfa3', K: '#201030', B: '#5dff9a', L: '#7c86b8' })
  };
  const NAMES = { JUDGE: 'JUDGE WISP', PROSECUTOR: 'THE PROSECUTOR', SOHAM: 'SOHAM (DEFENDANT)' };
  const KLASS = { JUDGE: 'J', PROSECUTOR: 'P', SOHAM: 'D' };

  /* ---------- sound effects (WebAudio, no files) ---------- */
  function tone(f, d, type = 'square', v = 0.06, t0 = 0, slide = 0) {
    if (!sfxOn || !actx) return;
    const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + t0;
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.linearRampToValueAtTime(f + slide, t + d);
    g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g).connect(actx.destination); o.start(t); o.stop(t + d + 0.02);
  }
  function noise(d, v = 0.2) {
    if (!sfxOn || !actx) return;
    const n = actx.sampleRate * d, buf = actx.createBuffer(1, n, actx.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = actx.createBufferSource(), g = actx.createGain(); s.buffer = buf; g.gain.value = v; s.connect(g).connect(actx.destination); s.start();
  }
  function sfx(k) {
    if (k === 'blip') tone(880, 0.04, 'square', 0.025);
    else if (k === 'coin') { tone(988, 0.07, 'square', 0.06); tone(1319, 0.2, 'square', 0.06, 0.07); }
    else if (k === 'gavel') { tone(90, 0.3, 'sine', 0.3); noise(0.12, 0.25); }
    else if (k === 'stamp') { tone(60, 0.2, 'sine', 0.3); noise(0.06, 0.2); }
    else if (k === 'buzz') tone(130, 0.4, 'sawtooth', 0.07);
    else if (k === 'up') tone(300, 0.3, 'square', 0.05, 0, 600);
  }

  /* ---------- clips (your recorded voice). Missing files are fine. ---------- */
  function playClip(id) {
    stopClip();
    if (!id || !sfxOn) return;
    try { clip = new Audio(`audio/${id}.mp3`); clip.play().catch(() => {}); } catch (e) { clip = null; }
  }
  function stopClip() { if (clip) { try { clip.pause(); } catch (e) {} clip = null; } }

  /* ---------- court record ---------- */
  function rec(who, text) {
    const p = document.createElement('p'); p.className = KLASS[who] || 'I';
    p.innerHTML = `<b>${esc(NAMES[who] || who)}</b>${esc(text)}`;
    recList.appendChild(p); recList.scrollTop = recList.scrollHeight;
    if (who === 'SOHAM') stmts++;
  }

  /* ---------- typing + dialog ---------- */
  function type(el, txt) {
    return new Promise((res) => {
      let i = 0; el.textContent = '';
      const iv = setInterval(() => {
        i += 2; el.textContent = txt.slice(0, i); if (i % 8 === 0) sfx('blip');
        if (i >= txt.length) { clearInterval(iv); el.textContent = txt; typingSkip = null; res(); }
      }, 26);
      typingSkip = () => { clearInterval(iv); el.textContent = txt; typingSkip = null; res(); };
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
  async function say(who, text, id) {
    dialog.hidden = false; choicesEl.innerHTML = ''; nextBtn.hidden = false;
    speakerEl.textContent = NAMES[who] || who; portrait.innerHTML = SPR[who] || SPR.SOHAM;
    rec(who, text); playClip(id);
    await waitNext(type(textEl, text));
    stopClip();
  }
  document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.code === 'Enter') && keyHandler && e.target.tagName !== 'BUTTON') { e.preventDefault(); keyHandler(); }
  });

  /* ---------- questions ---------- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  function pick(items) {
    dialog.hidden = false; nextBtn.hidden = true; choicesEl.innerHTML = '';
    speakerEl.textContent = NAMES.JUDGE; portrait.innerHTML = SPR.JUDGE;
    textEl.textContent = 'Juror Twelve, you may question the witness.';
    return new Promise((res) => {
      const btns = items.map((it, k) => {
        const b = document.createElement('button');
        b.className = 'btn' + (it.done ? ' done' : ''); b.disabled = it.done; b.textContent = '▶ ' + it.label;
        b.onclick = () => { sfx('stamp'); res(k); }; choicesEl.appendChild(b); return b;
      });
      if (SR) { /* optional mic: say (part of) a question */
        const m = document.createElement('button'); m.className = 'btn amber'; m.textContent = 'MIC: SAY A QUESTION';
        m.onclick = () => {
          const r = new SR(); r.lang = 'en-IN'; r.onresult = (ev) => {
            const said = ev.results[0][0].transcript.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
            let best = -1, bs = 0;
            items.forEach((it, k) => { if (it.done) return; const s = said.filter((w) => it.label.toLowerCase().includes(w)).length; if (s > bs) { bs = s; best = k; } });
            if (best >= 0) btns[best].click(); else toastMsg('Did not catch that. Click a question.');
          };
          r.onerror = () => toastMsg('Mic unavailable. Click a question.'); m.textContent = 'LISTENING...'; r.start();
        };
        choicesEl.appendChild(m);
      }
    });
  }
  async function interrogate(qs) {
    const done = new Set();
    while (done.size < qs.length) {
      const i = await pick(qs.map((q, k) => ({ label: q.q, done: done.has(k) })));
      done.add(i); await say('SOHAM', qs[i].a, qs[i].id);
      asked++; setMeter();
    }
  }
  function setMeter(force) { $('#meter i').style.transform = 'scaleX(' + ((force ?? Math.min(100, (asked / TOTAL_Q) * 100)) / 100) + ')'; }

  /* ---------- UI helpers ---------- */
  let toastT;
  function toastMsg(t) { toast.textContent = t; toast.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('on'), 2600); }
  const setStage = (html) => { stage.innerHTML = html; stage.scrollTop = 0; window.scrollTo(0, 0); };
  function openModal(html) {
    modal.innerHTML = `<div class="card">${html}<div class="row"><button class="btn" id="mClose">CLOSE</button></div></div>`;
    modal.hidden = false; $('#mClose').onclick = closeModal;
  }
  function closeModal() { modal.hidden = true; modal.innerHTML = ''; }
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  $('#recBtn').onclick = () => { recBox.hidden = !recBox.hidden; };
  $('#recClose').onclick = () => { recBox.hidden = true; };
  $('#muteBtn').onclick = (e) => { sfxOn = !sfxOn; e.target.textContent = sfxOn ? 'SFX ON' : 'SFX OFF'; if (!sfxOn) stopClip(); };
  $('#objBtn').onclick = () => { sfx('gavel'); toastMsg('JUDGE WISP: ' + C.objections[Math.floor(Math.random() * C.objections.length)]); };

  function bagsHTML() {
    return `<div class="grid">${C.locker.map((b) => `<button class="bag" type="button"><b>${esc(b.n)}</b><span class="more">${esc(b.d)}</span><span class="st">TAGGED</span></button>`).join('')}</div>`;
  }
  function wireToggles(sel) {
    stage.querySelectorAll(sel).forEach((el) => el.addEventListener('click', () => { el.classList.toggle('open'); sfx(el.classList.contains('open') ? 'stamp' : 'blip'); }));
  }
  function openBuild(key, name) {
    openModal(`<div class="sub">PLAY THE BUILD</div><h3 style="font-size:14px;margin:10px 0;line-height:1.8">${esc(name)}: build log</h3><p class="cap" style="margin-bottom:10px">RECONSTRUCTED FOR ILLUSTRATION. Swap in the real dictation recording (assets/build/${esc(key)}.mp4) before submitting.</p>
      <video id="bv" src="assets/build/${esc(key)}.mp4" controls playsinline></video>
      <p class="cap" id="bvMsg" style="margin-top:10px"></p><pre id="bvTx" class="cap" style="white-space:pre-wrap;text-align:left;margin-top:10px"></pre>`);
    $('#bv').onerror = () => { $('#bv').style.display = 'none'; $('#bvMsg').textContent = 'TODO: timelapse of the dictation session goes in assets/build/' + key + '.mp4'; };
    fetch(`assets/build/${key}.txt`).then((r) => (r.ok ? r.text() : '')).then((t) => { $('#bvTx').textContent = t; }).catch(() => {});
  }

  /* ---------- scenes ---------- */
  async function title() {
    setStage(`<div class="card titlecard"><div class="sub">${esc(C.caseNo)}</div><div style="width:120px;margin:18px auto">${SPR.JUDGE}</div>
      <h1>${esc(C.title)}</h1><p>${esc(C.charge)}</p><p style="margin-top:18px">A portfolio by Soham Bhar. You are Juror Twelve: ask questions, then reach a verdict.</p>
      <div class="row"><button class="btn amber" id="start">PRESS START</button></div>
      <div class="row" style="margin-top:22px"><button class="btn" id="tSpeed">WATCH THE SPEED-RUN</button><button class="btn" id="tIndex">OPEN THE CASE INDEX</button></div>
      <p class="cap" style="margin-top:14px">In a hurry? Skip the trial. Best with sound on.</p></div>`);
    $('#tSpeed').onclick = () => { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); window.Dossier.speedRun(); };
    $('#tIndex').onclick = () => window.Dossier.openIndex();
    await new Promise((res) => { $('#start').onclick = res; });
    actx = actx || new (window.AudioContext || window.webkitAudioContext)(); sfx('gavel');
  }
  async function arraignment() {
    setStage(`<div class="card"><div class="sub">THE CHARGES</div><ul class="rapsheet" style="margin-top:12px">${C.counts.map((c) => `<li>${esc(c.title)}: ${esc(c.sub)}</li>`).join('')}</ul></div>`);
    for (const l of C.arraignment) { await say(l.who, l.text, l.id); if (l.who === 'JUDGE') sfx('gavel'); }
    $('#objBtn').hidden = false;
  }
  async function briefing() {
    for (const b of C.briefing) {
      setStage(`<div class="sub">${esc(b.ex)}</div><h2 style="font-size:clamp(16px,2.6vw,26px)">${esc(b.name)}</h2>
        <div class="vid"><video src="${esc(b.video)}" autoplay playsinline controls></video></div>
        <div class="row"><button type="button" class="btn amber" id="cfB">OPEN CASE FILE</button></div>`);
      $('#cfB').onclick = () => window.Dossier.openFile(b.key);
      const v = stage.querySelector('video'); if (v) { v.volume = 1; v.play().catch(() => {}); }
      await say('SOHAM', b.text); /* the voice is baked into the explainer video now */
    }
    setStage(`<div class="sub">THE REST OF THE EVIDENCE, IN PLAIN ENGLISH (TAP A BAG)</div>${bagsHTML()}`); wireToggles('.bag');
    await say('JUDGE', 'The remaining exhibits are entered into the record. Tap any evidence bag. Then we begin.', 'J04');
  }
  async function counts() {
    for (const c of C.counts) {
      setStage(`<div class="card"><div class="sub">${esc(c.title)}</div><h2 style="font-size:clamp(14px,2.4vw,22px);line-height:1.8;margin-top:10px;color:var(--pink)">${esc(c.sub)}</h2></div>`);
      sfx('gavel'); await say('PROSECUTOR', c.p, c.pid); await interrogate(c.qs);
    }
    await say('JUDGE', 'The prosecution rests. Barely. The defence may proceed.', 'J05');
  }
  async function defence() {
    for (const d of C.defence) {
      setStage(`<div class="sub">${esc(d.ex)}</div><h2 style="font-size:clamp(16px,2.6vw,26px)">${esc(d.name)}</h2>
        <div class="gallery">${d.imgs.map((s) => `<figure><img src="${esc(s)}" alt="${esc(d.name)} evidence" loading="lazy"></figure>`).join('')}</div>
        <p class="cap">${esc(d.caption)}</p><div class="row"><button class="btn amber" id="cfD">OPEN CASE FILE</button><button class="btn" id="bBtn">PLAY THE BUILD</button></div>`);
      $('#bBtn').onclick = () => openBuild(d.build, d.name);
      $('#cfD').onclick = () => window.Dossier.openFile(d.key);
      if (d.objection) { await say('PROSECUTOR', 'Objection! Already in evidence!', 'P06'); await say('JUDGE', 'Overruled. The defence is allowed to be good twice.', 'J06'); }
      await interrogate(d.qs);
    }
  }
  async function binder() {
    const b = C.binder;
    setStage('<div id="cabHost" style="width:100%;max-width:1100px"></div>');
    window.Dossier.renderCabinet($('#cabHost'), { flow: true }); sfx('coin');
    await say('SOHAM', b.funds.d, b.funds.id);
    await say('JUDGE', 'The defence enters its filing cabinet. Open a drawer, Juror, and inspect any document. The prosecution will object. Let them.', 'J07');
    await say('JUDGE', 'When you are satisfied, press Next and the jury will retire.', 'J08');
  }
  async function verdict() {
    setStage(`<div class="card verdict"><div class="sub">THE JURY RETIRES</div><div style="width:110px;margin:16px auto">${SPR.JUDGE}</div><h2 id="vt">...</h2><div id="vs"></div><div class="credits" id="vc"></div></div>`);
    setMeter(100); sfx('up');
    for (const l of C.verdict) {
      await say(l.who, l.text, l.id); if (l.text.includes('GUILTY')) { $('#vt').textContent = 'GUILTY of being too employable.'; $('#vs').innerHTML = '<div class="stampbox">SENTENCE: HIRED</div>'; sfx('stamp'); }
    }
    dialog.hidden = true; $('#vt').textContent = 'CASE CLOSED.';
    const bs = C.buildStats;
    $('#vc').innerHTML = `Questions asked: ${asked} &middot; Statements on record: ${stmts}${bs.words ? ` &middot; This site was dictated: ${bs.words} words in ${bs.minutes} minutes` : ''}
      <div class="row"><a class="btn amber" href="${esc(C.contact.href)}">${esc(C.contact.label)}</a><a class="btn" href="${esc(C.contact.linkedin)}" target="_blank" rel="noopener">LINKEDIN</a>
      <button class="btn" id="lk">EVIDENCE LOCKER</button><button class="btn" id="ix">CASE INDEX</button><button class="btn" id="again">REPLAY TRIAL</button></div>`;
    $('#again').onclick = () => location.reload();
    $('#ix').onclick = () => window.Dossier.openIndex();
    $('#lk').onclick = () => { openModal(`<div class="sub">EVIDENCE LOCKER</div>${bagsHTML()}`); modal.querySelectorAll('.bag').forEach((el) => el.addEventListener('click', () => el.classList.toggle('open'))); };
  }

  window.App = { sfx, toast: toastMsg, playClip, stopClip, openRecord: () => { recBox.hidden = false; }, refreshMeter: () => {} };
  $('#idxBtn').onclick = () => window.Dossier.openIndex();
  (async function run() {
    await title(); await arraignment(); await briefing(); await counts(); await defence(); await binder(); await verdict();
  })();
})();
