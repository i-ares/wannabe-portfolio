/* Dossier: evidence case files, filing cabinet, case index, speed-run.
   Depends on window.CONTENT (content.js + files.js) and window.App (app.js). */
(() => {
  const C = window.CONTENT;
  const A = () => window.App;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const $ = (s, r = document) => r.querySelector(s);
  const mk = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  /* ---------- overlay shell (stacked layers) ---------- */
  const stack = [];
  function openLayer(id, cls) {
    const dup = stack.findIndex((l) => l.id === id);
    if (dup >= 0) { const [l] = stack.splice(dup, 1); stopMedia(l); l.remove(); }
    const prevFocus = document.activeElement;
    const el = mk('div', 'ov ' + (cls || ''));
    el.id = id; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el._prevFocus = prevFocus;
    document.body.appendChild(el); stack.push(el);
    document.body.classList.add('noscroll');
    return el;
  }
  function closeLayer() {
    const el = stack.pop(); if (!el) return;
    stopMedia(el); el.remove();
    if (!stack.length) document.body.classList.remove('noscroll');
    A() && A().stopClip();
    if (el._prevFocus && el._prevFocus.focus && el._prevFocus.isConnected) { try { el._prevFocus.focus(); } catch (e) {} }
  }
  function stopMedia(root) { root.querySelectorAll('video,audio').forEach((m) => { try { m.pause(); } catch (e) {} }); }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && stack.length) closeLayer(); });

  /* ---------- case file ---------- */
  const SECTION = {
    text: (s) => `<section class="sheet"><h3 class="sh">${esc(s.h)}</h3><p>${esc(s.body)}</p></section>`,
    list: (s) => `<section class="sheet"><h3 class="sh">${esc(s.h)}</h3><ul class="plist">${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></section>`,
    steps: (s) => `<section class="sheet"><h3 class="sh">${esc(s.h)}</h3><ol class="steps">${s.items.map((i) => `<li><b>${esc(i.t)}</b><span>${esc(i.d)}</span></li>`).join('')}</ol></section>`,
    media: (s) => `<div class="mgrid">${s.items.map((m, i) => {
      const tilt = i % 2 ? 'r' : 'l';
      const body = m.kind === 'video'
        ? `<video src="${esc(m.src)}#t=0.4" muted loop playsinline controls preload="metadata"></video>`
        : `<img src="${esc(m.src)}" alt="${esc(m.cap)}" loading="lazy">`;
      return `<figure class="photo ${tilt}${m.tall ? ' tall' : ''}"><span class="tape"></span><div class="pframe">${body}</div><figcaption>${esc(m.cap)}</figcaption></figure>`;
    }).join('')}</div>`,
    timeline: (s) => `<section class="sheet"><h3 class="sh">${esc(s.h)}</h3><ol class="tline">${s.items.map((i) => `<li><time>${esc(i.d)}</time><span>${esc(i.t)}</span></li>`).join('')}</ol></section>`,
    ledger: (s) => `<section class="sheet"><h3 class="sh">${esc(s.h)}</h3><dl class="ledger">${s.rows.map((r) => `<div><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl></section>`,
    tech: (s) => `<section class="sheet"><h3 class="sh">${esc(s.h)}</h3><dl class="ledger tech">${s.rows.map((r) => `<div><dt>${esc(r[0])}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl></section>`,
    redact: (s) => `<section class="sheet"><h3 class="sh">${esc(s.h)}</h3><p class="hint">Tap a black bar to unredact it.</p>${s.lines.map((l) => `<p class="rdline"><b>${esc(l[0])}:</b> <button type="button" class="rd" aria-pressed="false"><span>${esc(l[1])}</span></button></p>`).join('')}</section>`,
    statement: (s, f) => { const st = C.statements[s.key]; return `<section class="sheet stmt"><h3 class="sh">${esc(s.h)}</h3><blockquote>${esc(st.text)}</blockquote><button type="button" class="btn amber playst" data-id="${esc(st.id)}">PLAY STATEMENT</button></section>`; },
    related: (s) => `<section class="sheet"><h3 class="sh">${esc(s.h)}</h3>${s.counts.map((k) => `<p class="rel">Connected to <b>${esc(C.counts[k].title)}</b>: ${esc(C.counts[k].sub)}. The prosecution reads it. The defence answers it.</p>`).join('')}</section>`
  };

  function openFile(key) {
    const f = C.files.find((x) => x.key === key); if (!f) return;
    const o = openLayer('cf', 'cfov');
    o.innerHTML = `<button type="button" class="btn red cfclose" aria-label="Close case file">CLOSE FILE</button>
      <article class="folder"><div class="ftab">${esc(f.tag)} &middot; ${esc(f.no)}</div><div class="fstamp" aria-hidden="true">ADMITTED</div>
      <header class="fhead"><h2>${esc(f.name)}</h2><p>${esc(f.line)}</p></header>
      ${f.sections.map((s) => SECTION[s.type](s, f)).join('')}
      <footer class="ffoot"><button type="button" class="btn cfclose2">CLOSE FILE</button></footer></article>`;
    o.querySelectorAll('.cfclose,.cfclose2').forEach((b) => (b.onclick = closeLayer));
    o.querySelectorAll('.rd').forEach((b) => b.addEventListener('click', () => { const on = b.classList.toggle('on'); b.setAttribute('aria-pressed', on); A().sfx(on ? 'stamp' : 'blip'); }));
    o.querySelectorAll('.playst').forEach((b) => b.addEventListener('click', () => { A().playClip(b.dataset.id); A().toast(window.CONTENT.statements && 'Statement playing. (Audio clip pending if silent.)'); }));
    /* autoplay clips only while on screen */
    const io = new IntersectionObserver((es) => es.forEach((e) => { const v = e.target; if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }), { root: o, threshold: 0.5 });
    o.querySelectorAll('video').forEach((v) => io.observe(v));
    o.scrollTop = 0; $('.cfclose', o).focus();
    A().sfx('stamp');
  }

  /* ---------- filing cabinet ---------- */
  /* Proof lookup. assets/docs/manifest.json (written by tools/docs-manifest.py) lists the proof files, so the page makes no failing
     requests for documents that have no proof yet. If the manifest is missing, fall back to probing common file names. */
  const probes = {};
  let manifestP = null;
  const manifest = () => (manifestP = manifestP || fetch('assets/docs/manifest.json').then((r) => (r.ok ? r.json() : null)).catch(() => null));
  function legacyProbe(id) {
    return new Promise((res) => {
      const exts = ['jpg', 'png', 'jpeg', 'webp']; let i = 0;
      const vid = () => { const v = document.createElement('video'); const u = `assets/docs/${id}.mp4`; v.onloadedmetadata = () => res(u); v.onerror = () => res(null); v.preload = 'metadata'; v.src = u; };
      const next = () => { if (i >= exts.length) return vid(); const im = new Image(); const u = `assets/docs/${id}.${exts[i++]}`; im.onload = () => res(u); im.onerror = next; im.src = u; };
      next();
    });
  }
  function probe(id) {
    if (probes[id] !== undefined) return probes[id];
    probes[id] = manifest().then((m) => {
      if (m && Array.isArray(m.files)) { const f = m.files.find((x) => x.replace(/\.[^.]+$/, '') === id); return f ? 'assets/docs/' + f : null; }
      return legacyProbe(id);
    });
    return probes[id];
  }
  const admitted = new Set();
  let objOn = (() => { try { return localStorage.getItem('objOff') !== '1'; } catch (e) { return true; } })();
  const allDocs = () => C.cabinet.drawers.flatMap((d) => d.docs.map((x) => Object.assign({ drawer: d.name }, x)));

  function renderCabinet(root, opts) {
    opts = opts || {};
    const total = allDocs().length;
    root.innerHTML = `<div class="cab"><div class="cabhead"><div class="sub">THE DEFENCE'S FILING CABINET</div>
      <div class="cabstat"><span id="admN">ADMITTED ${admitted.size}/${total}</span><button type="button" class="btn" id="objT">OBJECTIONS: ${objOn ? 'ON' : 'OFF'}</button></div></div>
      <div class="drawers">${C.cabinet.drawers.map((d) => `<section class="drawer" data-d="${esc(d.id)}"><button type="button" class="dface" aria-expanded="false"><span class="plate">${esc(d.name)}</span><span class="handle" aria-hidden="true"></span><span class="dnote">${esc(d.note)}</span></button><div class="dfold" hidden>${d.docs.map((x) => `<button type="button" class="dfile" data-id="${esc(x.id)}"><span class="dn">${esc(x.n)}</span><span class="dt" data-st>CHECKING...</span></button>`).join('')}</div></section>`).join('')}</div></div>`;
    $('#objT', root).onclick = (e) => { objOn = !objOn; try { localStorage.setItem('objOff', objOn ? '0' : '1'); } catch (er) {} e.target.textContent = 'OBJECTIONS: ' + (objOn ? 'ON' : 'OFF'); };
    root.querySelectorAll('.dface').forEach((b) => b.addEventListener('click', () => {
      const open = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', !open);
      b.nextElementSibling.hidden = open; A().sfx(open ? 'blip' : 'up');
    }));
    const docs = allDocs();
    docs.forEach((doc) => probe(doc.pages ? doc.pages[0] : doc.id).then((u) => {
      doc.url = u;
      const el = root.querySelector(`.dfile[data-id="${CSS.escape(doc.id)}"] [data-st]`);
      if (el) { el.textContent = admitted.has(doc.id) ? 'ADMITTED' : (u ? 'ON FILE' : 'TESTIMONY ONLY'); el.className = 'dt ' + (admitted.has(doc.id) ? 'ok' : (u ? 'file' : 'pend')); }
    }));
    root.querySelectorAll('.dfile').forEach((b) => b.addEventListener('click', () => openDoc(allDocs().find((x) => x.id === b.dataset.id), root)));
  }

  async function openDoc(doc, cabRoot) {
    const urls = [], caps = [];
    if (doc.pages) { for (let k = 0; k < doc.pages.length; k++) { const u = await probe(doc.pages[k]); if (u) { urls.push(u); caps.push((doc.caps || [])[k] || ''); } } }
    else { const u = await probe(doc.id); if (u) { urls.push(u); caps.push(''); } }
    const v = openLayer('dv', 'dvov');
    const verified = urls.length > 0;
    v.innerHTML = `<div class="dview"><button type="button" class="btn red dvclose" aria-label="Close document">CLOSE</button>
      <div class="dpaper"><h3>${esc(doc.n)}</h3><p>${esc(doc.d)}</p><p class="dstat ${verified ? 'ok' : 'pend'}">${verified ? 'DOCUMENT ON FILE. Tap an image to zoom.' : 'TESTIMONY ONLY. Proof has not been filed yet.'}</p></div>
      <div class="dimgs">${verified ? urls.map((u, k) => `<figure class="dfig">${/\.mp4$/.test(u) ? `<video src="${esc(u)}" controls playsinline loop></video>` : `<img src="${esc(u)}" alt="${esc(caps[k] || doc.n)}" class="zoomable">`}${caps[k] ? `<figcaption>${esc(caps[k])}</figcaption>` : ''}</figure>`).join('') : '<div class="slot"><b>PROOF NOT YET FILED</b><span>The defence states this under oath. It is not independently documented here.</span></div>'}</div>
      <div id="objbox" class="objbox"></div><div class="stampwrap"><div class="admstamp" id="admstamp" aria-hidden="true">ADMITTED</div></div></div>`;
    $('.dvclose', v).onclick = () => { closeLayer(); if (cabRoot && cabRoot.isConnected) renderCabinetKeep(cabRoot); };
    v.querySelectorAll('.zoomable').forEach((im) => (im.onclick = () => im.classList.toggle('zoomed')));
    const finish = () => { admitted.add(doc.id); $('#admstamp', v).classList.add('on'); A().sfx('stamp'); A().refreshMeter && A().refreshMeter(admitted.size); $('#objbox', v).innerHTML = ''; };
    if (admitted.has(doc.id)) { $('#admstamp', v).classList.add('on'); }
    else if (!objOn) finish();
    else {
      const line = C.cabinet.objections[Math.floor(Math.random() * C.cabinet.objections.length)];
      $('#objbox', v).innerHTML = `<p class="obj"><b>PROSECUTOR:</b> ${esc(line)}</p><div class="row"><button type="button" class="btn amber" id="bAd">ADMIT</button><button type="button" class="btn red" id="bSu">SUSTAIN</button></div>`;
      $('#bAd', v).onclick = () => { A().toast('JUDGE WISP: Admitted. Obviously.'); finish(); };
      $('#bSu', v).onclick = () => { A().toast('JUDGE WISP: Sustained... no. Overruled. It is too good.'); A().sfx('gavel'); finish(); };
    }
    $('.dvclose', v).focus();
  }
  function renderCabinetKeep(root) {
    const open = [...root.querySelectorAll('.dface[aria-expanded="true"]')].map((b) => b.parentElement.dataset.d);
    renderCabinet(root); open.forEach((id) => { const b = root.querySelector(`.drawer[data-d="${CSS.escape(id)}"] .dface`); if (b) { b.setAttribute('aria-expanded', 'true'); b.nextElementSibling.hidden = false; } });
  }

  /* ---------- case index + speed-run ---------- */
  function openIndex() {
    const o = openLayer('idx', 'idxov');
    o.innerHTML = `<div class="idx card"><button type="button" class="btn red cfclose" style="float:right">CLOSE</button><h2>CASE INDEX</h2>
      <p class="cap" style="text-align:left">Short on time? Jump straight to the evidence.</p>
      <div class="idxgrid">
        <button class="btn amber" data-go="speed">SPEED-RUN: UNDER 90 SECONDS</button>
        ${C.files.map((f) => `<button class="btn" data-go="file" data-k="${esc(f.key)}">${esc(f.tag)}: ${esc(f.name)}<br><small>${esc(f.line)}</small></button>`).join('')}
        <button class="btn" data-go="cab">FILING CABINET: SUPPORTING DOCUMENTS</button>
        <button class="btn" data-go="rec">COURT RECORD</button>
        <a class="btn amber" href="${esc(C.contact.href)}">${esc(C.contact.label)}</a>
      </div></div>`;
    $('.cfclose', o).onclick = closeLayer;
    o.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => {
      const g = b.dataset.go;
      if (g === 'file') openFile(b.dataset.k); else if (g === 'speed') speedRun();
      else if (g === 'cab') openCabinetOverlay(); else if (g === 'rec') { closeLayer(); A().openRecord(); }
    }));
  }
  function openCabinetOverlay() {
    const o = openLayer('cabov', 'cfov');
    o.innerHTML = '<button type="button" class="btn red cfclose">CLOSE</button><div id="cabroot" style="max-width:1100px;margin:60px auto"></div>';
    $('.cfclose', o).onclick = closeLayer; renderCabinet($('#cabroot', o));
  }
  function speedRun() {
    const o = openLayer('sr', 'idxov');
    const items = C.briefing; let i = 0;
    o.innerHTML = `<div class="idx card"><button type="button" class="btn red cfclose" style="float:right">CLOSE</button><h2 id="srt"></h2><div class="vid"><video id="srv" playsinline controls autoplay></video></div>
      <div class="row"><button type="button" class="btn" id="srn">SKIP</button><button type="button" class="btn amber" id="sro">OPEN THIS FILE</button></div><p class="cap" id="srp"></p></div>`;
    const v = $('#srv', o);
    const play = () => {
      if (i >= items.length) { $('#srt', o).textContent = 'VERDICT: GUILTY OF BEING TOO EMPLOYABLE.'; v.remove(); $('#srn', o).remove(); $('#sro', o).remove(); $('#srp', o).innerHTML = `<div class="stampbox" style="position:static;opacity:1;display:inline-block;color:#5dff9a;border-color:#5dff9a">SENTENCE: HIRED</div><div class="row"><a class="btn amber" href="${esc(C.contact.href)}">${esc(C.contact.label)}</a><button type="button" class="btn" id="srall">VIEW ALL CASE FILES</button></div>`; $('#srall', o).onclick = openIndex; return; }
      const b = items[i]; $('#srt', o).textContent = `${b.ex}: ${b.name} (${i + 1}/${items.length})`; $('#srp', o).textContent = b.text; v.src = b.video; v.volume = 1; v.play().catch(() => {});
    };
    v.onended = () => { i++; play(); };
    $('#srn', o).onclick = () => { i++; play(); };
    $('#sro', o).onclick = () => openFile(items[Math.min(i, items.length - 1)].key);
    $('.cfclose', o).onclick = closeLayer; play();
  }


  /* Deep links: ?file=pave|f1|m5|visn opens that case file, ?cabinet=1 the filing cabinet, ?index=1 the Case Index, ?speedrun=1 the speed-run. */
  function deepLink() {
    const q = new URLSearchParams(location.search);
    const f = q.get('file');
    if (f && C.files.some((x) => x.key === f)) openFile(f);
    else if (q.get('cabinet')) openCabinetOverlay();
    else if (q.get('index')) openIndex();
    else if (q.get('speedrun')) speedRun();
  }
  window.addEventListener('load', () => setTimeout(deepLink, 300));

  window.Dossier = { openFile, renderCabinet, openIndex, speedRun, openCabinet: openCabinetOverlay, admittedCount: () => admitted.size, totalDocs: () => allDocs().length };
})();
