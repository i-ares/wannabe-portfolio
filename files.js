/* CASE FILES, FILING CABINET, WITNESS STATEMENTS.
   Pure data. Section types: text, list, steps, media, timeline, ledger, tech, redact, statement, related.
   Facts here come from the real repos/files; anything unverified is marked TODO. */
(function () {
  const C = window.CONTENT;

  C.statements = {
    pave: { id: 'S01', text: 'The hardest part of Pave was making ownership fair. The server decides who owns which street, as real geometry, and the phone only displays it. Then I added a rule I am proud of: a rival\'s name never leaves the phone. The server sends a placeholder, and the app fills in the real name.' },
    f1: { id: 'S02', text: 'The hardest part of the F1 Terminal was being gentle with an unofficial data feed. So one process listens, and it fans the data out to every panel. And I made one rule for the screen: the track map is always half of it, so it never turns into a spreadsheet.' },
    m5: { id: 'S03', text: 'E-ink is slow, and that shaped everything. I only redraw what changed, I prepare the next chapter while you are reading, and I never read the SD card in the middle of drawing. That is how it stays quick and does not ghost.' },
    visn: { id: 'S04', text: 'VISN taught me that building something and launching something are different jobs. I had a prototype, a grant and two registered designs. I did not have a manufacturer, a team, or the time, because I was also finishing a thesis and writing papers. Next time I find the team first.' }
  };

  C.files = [
    {
      key: 'pave', tag: 'EXHIBIT A', no: 'FILE A-001', name: 'PAVE',
      line: 'A running game where the streets you cover become yours.',
      sections: [
        { type: 'text', h: 'SUMMARY OF FACTS', body: 'Pave is a running, walking and cycling game. Every outdoor route you finish turns into ground you own on a shared city map. A rival can take it back by running through it, and ground you stop visiting slowly fades away. It is built for Indian cities, starting with Kolkata, and it runs on Android.' },
        { type: 'text', h: 'THE PROBLEM', body: 'Fitness apps show you charts, and charts do not make you go outside. Pave gives skipping a run a visible cost: a rival could take your block overnight. The aim is simple. Give people a reason to go out today.' },
        { type: 'media', items: [
          { kind: 'video', src: 'assets/clips/pave-teaser.mp4', cap: 'A-V1. Launch teaser. The territory mechanic in 15 seconds.' },
          { kind: 'video', src: 'assets/clips/pave-device.mp4', cap: 'A-V2. Screen recording from a real phone.', tall: true } ] },
        { type: 'list', h: 'WHAT I BUILT', items: [
          'A map-first home screen with a five-tab bar and a Record button in the middle.',
          'Routes that become real shapes on the map. Close a loop and the area inside is yours too.',
          'Three separate maps for running, walking and cycling, so walkers are not crowded out.',
          'Monthly seasons, leaderboards, a follow feed and push alerts.',
          'Ground that decays when you stop visiting it. Laps over your own ground reset the clock.',
          'Account deletion and data export, built to India\'s data-protection rules.',
          'Insights: best efforts, an effort rating, and a short model-written read-back after each run.' ] },
        { type: 'steps', h: 'HOW IT WORKS', items: [
          { t: 'RECORD', d: 'A foreground GPS service records your route, only while the app is in use.' },
          { t: 'SAVE', d: 'The server turns the route into a real shape and works out who owns what.' },
          { t: 'CARVE', d: 'A run through a rival\'s ground cuts a true corridor out of it.' },
          { t: 'DRAW', d: 'The map is served as fast vector tiles, so it draws instantly.' },
          { t: 'FADE', d: 'A nightly sweep lets unvisited ground decay back to neutral.' } ] },
        { type: 'media', items: [
          { kind: 'img', src: 'assets/img/pave-phone-map.jpg', cap: 'A-1. Map home with the five-tab bar.', tall: true },
          { kind: 'img', src: 'assets/img/pave-phone-route.jpg', cap: 'A-2. Suggested route with area to be claimed.', tall: true },
          { kind: 'img', src: 'assets/img/pave-phone-run.jpg', cap: 'A-3. A live run: distance, pace, area being claimed.', tall: true } ] },
        { type: 'timeline', h: 'CHAIN OF EVENTS', items: [
          { d: '30 JUL 2026', t: 'First commit. Every version-one screen, running on a mock city.' },
          { d: 'RUN 2', t: 'The real thing: database, territory engine, real GPS on a phone.' },
          { d: 'RUNS 3 TO 4', t: 'Social features, privacy, seasons, decay, leaderboards, push alerts.' },
          { d: 'RUNS 5 TO 7', t: 'Sign-out, account deletion, and laps that strengthen ground.' },
          { d: 'RUNS 8 TO 9', t: 'Security review, data export, vector tiles, a nightly sweep.' },
          { d: 'RUN 10', t: 'Best efforts, effort rating, and the model-written read-back.' },
          { d: '20 SEP 2026', t: 'Legal pages and server-side privacy hardening for the Play Store.' } ] },
        { type: 'ledger', h: 'BY THE NUMBERS', rows: [
          ['COMMITS', '152'], ['BUILD RUNS', '10'], ['CODE', 'about 37,000 lines of TypeScript and SQL'],
          ['TERRITORY MAPS', '3 (run, walk, cycle)'], ['RUNNING COST TARGET', 'Rs 500 a month'], ['COST AT PROTOTYPE SCALE', 'Rs 0 a month'] ] },
        { type: 'redact', h: 'WITHHELD EXHIBITS', lines: [
          ['SOURCE CODE', 'Private repository. Available to an employer on request.'],
          ['SECURITY WORK', 'Public views were hardened and a spatial reference table was locked down on the server.'],
          ['RIVAL PRIVACY', 'A rival\'s name never leaves the phone. The server sends a placeholder and the app fills in the real name.'] ] },
        { type: 'tech', h: 'TECHNICAL APPENDIX', rows: [
          ['APP', 'Expo and React Native, Android first'], ['BACKEND', 'Supabase: Postgres, row-level security, Edge Functions'],
          ['TERRITORY ENGINE', 'PostGIS geometry, written in SQL; golden-fixture tests'], ['MAP', 'Vector tiles (ST_AsMVT) with one set of layer definitions'],
          ['GPS', 'Foreground service, "while using the app" location only'] ] },
        { type: 'statement', h: 'WITNESS STATEMENT', key: 'pave' },
        { type: 'related', h: 'RELATED COUNT', counts: [0] }
      ]
    },
    {
      key: 'f1', tag: 'EXHIBIT B', no: 'FILE B-002', name: 'F1 TERMINAL',
      line: 'A pit-wall timing screen for fans, live or replayed.',
      sections: [
        { type: 'text', h: 'SUMMARY OF FACTS', body: 'F1 Terminal is a Formula 1 timing screen you run yourself. During a session it shows live timing and telemetry. Any other time you can replay any race since 2018, scrub through it, and look up results and standings back to 1950.' },
        { type: 'text', h: 'THE PROBLEM', body: 'On TV you see cars going round. In the garage, engineers watch a hundred live numbers: speed, tyres, gaps, radio. That view is not available to fans in a form you can arrange yourself. This is that view.' },
        { type: 'media', items: [
          { kind: 'video', src: 'assets/clips/f1-replay.mp4', cap: 'B-V1. Screen recording: 2024 Belgian Grand Prix replay at 4x.' },
          { kind: 'img', src: 'assets/img/f1-replay.jpg', cap: 'B-1. Track map, telemetry, radio and lap tables in one view.' } ] },
        { type: 'list', h: 'WHAT I BUILT', items: [
          'A track map pinned to half of the screen, with every car moving on it.',
          'Telemetry for any driver: speed, throttle, brake, gear, RPM and DRS. Two panels can follow two different drivers.',
          'Lap times, sectors, tyres and pit stops, plus weather and race-control messages with team radio.',
          'A year and race switcher, with play, pause, speed and a scrub bar.',
          'Widgets you can add, remove, drag and resize.',
          'Results and championship tables for every season back to 1950.' ] },
        { type: 'steps', h: 'HOW IT WORKS', items: [
          { t: 'LISTEN', d: 'One process connects to the timing feed and keeps the latest state.' },
          { t: 'FAN OUT', d: 'The state is streamed to every open panel, so the feed is only used once.' },
          { t: 'REPLAY', d: 'For past races, a replay file is built once per session, then scrubbed locally.' },
          { t: 'DRAW', d: 'Each widget draws only the data it needs, and remembers its place.' } ] },
        { type: 'media', items: [
          { kind: 'img', src: 'assets/img/f1-replay-2.jpg', cap: 'B-2. Later in the same race: standings, weather, radio and tyre tables.' } ] },
        { type: 'timeline', h: 'CHAIN OF EVENTS', items: [
          { d: '14 SEP 2026', t: 'First and last commit on record: 26 commits, backend, frontend, replay and tests.' } ] },
        { type: 'ledger', h: 'BY THE NUMBERS', rows: [
          ['COMMITS ON RECORD', '26'], ['LIVE REPLAY', 'every race since 2018'], ['RESULTS', 'back to 1950'], ['TESTS', 'backend, frontend and browser tests'] ] },
        { type: 'tech', h: 'TECHNICAL APPENDIX', rows: [
          ['BACKEND', 'Python, FastAPI, WebSocket'], ['FRONTEND', 'React, TypeScript, Vite, a drag-and-resize grid'],
          ['DATA', 'The livef1 package and an Ergast-style results API'], ['TESTING', 'pytest, vitest, Playwright'] ] },
        { type: 'list', h: 'OBJECTIONS SUSTAINED AGAINST THIS EXHIBIT', items: [
          'The live feed is unofficial. Use it gently and do not point a crowd of browsers at it.',
          'Version one is for a single local user.',
          'Before 2018 only results and standings exist. There is no telemetry that old.' ] },
        { type: 'statement', h: 'WITNESS STATEMENT', key: 'f1' }
      ]
    },
    {
      key: 'm5', tag: 'EXHIBIT C', no: 'FILE C-003', name: 'M5PAPER READER',
      line: 'A Kindle I built from a bare e-ink board.',
      sections: [
        { type: 'text', h: 'SUMMARY OF FACTS', body: 'This is an e-reader I built from a bare e-ink board. It opens EPUB and text books from an SD card, lets you jump by chapter, remembers where you stopped, joins WiFi, and has an on-screen keyboard that I wrote myself.' },
        { type: 'text', h: 'THE PROBLEM', body: 'I wanted a Kindle I could control. E-ink screens are slow and keep faint ghosts of old pages, so every choice about drawing matters. The board gives you a blank screen and a touch panel. Everything else is code.' },
        { type: 'media', items: [
          { kind: 'img', src: 'assets/img/m5-photo.jpg', cap: 'C-1. The actual device, mid-read.', tall: true },
          { kind: 'video', src: 'assets/clips/m5-demo.mp4', cap: 'C-V1. Opening a book, the contents list, and turning pages.', tall: true } ] },
        { type: 'list', h: 'WHAT I BUILT', items: [
          'A file browser that shows book titles, not file names.',
          'EPUB opened on the device itself: unzipped, split into chapters, and wrapped into pages.',
          'A contents screen that opens on the chapter you are reading.',
          'Page caching and a prepared next chapter, so turns are quick.',
          'WiFi scan and join, with an on-screen keyboard.',
          'Settings, touch zones and the three hardware buttons.' ] },
        { type: 'steps', h: 'HOW IT WORKS', items: [
          { t: 'OPEN', d: 'The book is unzipped from the SD card into plain-text chapters.' },
          { t: 'WRAP', d: 'Each chapter is wrapped into pages that fit the screen.' },
          { t: 'DRAW', d: 'Only the part of the screen that changed is redrawn.' },
          { t: 'IDLE', d: 'When you pause, it prepares the next chapter and refreshes the page to full quality.' } ] },
        { type: 'ledger', h: 'BY THE NUMBERS', rows: [
          ['MAIN PROGRAM', 'about 100 KB of MicroPython'], ['FUNCTIONS', '157'], ['SCREENS', 'home, files, contents, reader, WiFi, keyboard, settings'], ['BUILT', 'August 2026'] ] },
        { type: 'tech', h: 'TECHNICAL APPENDIX', rows: [
          ['BOARD', 'M5Paper (ESP32) with a touch e-ink display'], ['LANGUAGE', 'MicroPython, flashed with M5Burner'],
          ['STORAGE', 'SD card, with a hidden cache folder for chapters'], ['DISPLAY', 'Fast partial refresh for menus, slow quality refresh when idle'] ] },
        { type: 'statement', h: 'WITNESS STATEMENT', key: 'm5' }
      ]
    },
    {
      key: 'visn', tag: 'EXHIBIT D', no: 'FILE D-004', name: 'VISN',
      line: 'Smart glasses and a braille reader for people who cannot see well.',
      sections: [
        { type: 'text', h: 'SUMMARY OF FACTS', body: 'VISN is a pair of smart glasses and a compact braille reader for people with visual impairment. The camera on the frame spots objects and currency and alerts the wearer. Say "speak" and it reads the text it sees out loud. Say "stop" and it pauses.' },
        { type: 'text', h: 'THE PROBLEM', body: 'About 253 million people live with visual impairment, and 89 percent of them live in low and middle income countries. In India alone there are about 4.95 million blind people and about 70 million with low vision. Assistive technology is expensive, so most of them go without.' },
        { type: 'media', items: [
          { kind: 'img', src: 'assets/img/visn-glasses.jpg', cap: 'D-1. The prototype. Camera board, speaker and battery on the frame.' },
          { kind: 'video', src: 'assets/clips/visn-intro.mp4', cap: 'D-V1. The glasses and the braille reader that sits on the arm.' } ] },
        { type: 'list', h: 'WHAT I BUILT', items: [
          'Glasses with a camera board, a speaker and a battery.',
          'Object detection that spots things like a bottle, phone, laptop or person, and alerts the wearer.',
          'Voice commands: "speak" turns on text reading, "stop" turns it off.',
          'Currency mode that recognises Rs 10, 20, 50 and 100 notes.',
          'A compact braille reader that wears on the arm.',
          'App screens for sign-in, with a role for the wearer and one for a caregiver.',
          'A hinge design, registered with IIT Hyderabad.' ] },
        { type: 'steps', h: 'HOW IT WORKS', items: [
          { t: 'SEE', d: 'The frame\'s camera streams pictures.' },
          { t: 'SPOT', d: 'Software finds objects and currency in each picture.' },
          { t: 'ALERT', d: 'A close object triggers a buzz so the wearer knows before touching it.' },
          { t: 'SPEAK', d: 'On a voice command, any text in view is read aloud.' } ] },
        { type: 'media', items: [
          { kind: 'img', src: 'assets/img/visn-objects.jpg', cap: 'D-2. Object detection: bottle, phone, laptop, backpack, mouse, book.' },
          { kind: 'img', src: 'assets/img/visn-currency.jpg', cap: 'D-3. Currency mode reading Rs 10, 20, 50 and 100.' },
          { kind: 'img', src: 'assets/img/visn-ocr.jpg', cap: 'D-4. Text in view, read out by the speaker.' } ] },
        { type: 'media', items: [
          { kind: 'video', src: 'assets/clips/visn-bench.mp4', cap: 'D-V2. Bench demo, filmed.' },
          { kind: 'video', src: 'assets/clips/visn-bench2.mp4', cap: 'D-V3. Bench demo, second angle.' } ] },
        { type: 'media', items: [
          { kind: 'img', src: 'assets/files/visn-hinge.jpg', cap: 'D-5. Hinge design sheet.' },
          { kind: 'img', src: 'assets/files/visn-frame.jpg', cap: 'D-6. Frame design sheet.' },
          { kind: 'img', src: 'assets/img/visn-app.jpg', cap: 'D-7. App screens: sign-in, roles, phone verification.', tall: true } ] },
        { type: 'timeline', h: 'CHAIN OF EVENTS', items: [
          { d: 'SEP 2024', t: 'First pitch deck. Dates in this file come from file records.' },
          { d: '25 NOV 2024', t: 'Selected for the BUILD October 2024 cohort at IIT Hyderabad: Rs 50,000 for VISN.' },
          { d: 'JAN TO MAY 2025', t: 'More decks, a one-page pitch, and a pitch deck for investors.' },
          { d: 'AUG 2025', t: 'Working prototype on the bench, photographed and filmed.' },
          { d: '17 OCT 2025', t: 'Letter of intent: selected for MeitY EIR pre-incubation support of up to Rs 4 lakh.' },
          { d: '24 JUN 2026', t: 'Hinge design registered with IIT Hyderabad.' } ] },
        { type: 'ledger', h: 'BY THE NUMBERS', rows: [
          ['BUILD GRANT', 'Rs 50,000 (October 2024 cohort)'], ['MEITY EIR', 'Selected for support of up to Rs 4 lakh (letter of intent)'], ['TOTAL', 'up to Rs 4.5 lakh'], ['REGISTERED DESIGNS', '2'],
          ['MARKET', 'Smart glasses forecast to grow about 29 percent a year, to a few billion dollars'] ] },
        { type: 'tech', h: 'TECHNICAL APPENDIX', rows: [
          ['CAMERA', 'AI-Thinker ESP32-CAM'], ['ALERTS', 'Buzz, with a speaker for reading'], ['DETECTION', 'Python. The prototype works; for demos the camera view is shown on a laptop so the detections are visible'],
          ['APP', 'Sign-in and roles stored in a cloud database'], ['POWER', 'Li-polymer battery'] ] },
        { type: 'media', items: [
          { kind: 'img', src: 'assets/files/visn-deck-02.jpg', cap: 'D-8. Pitch deck: how the glasses work.' },
          { kind: 'img', src: 'assets/files/visn-deck-05.jpg', cap: 'D-9. Pitch deck: vibration alerts.' },
          { kind: 'img', src: 'assets/files/visn-deck-08.jpg', cap: 'D-10. Pitch deck: India market.' } ] },
        { type: 'statement', h: 'WITNESS STATEMENT', key: 'visn' },
        { type: 'related', h: 'RELATED COUNT', counts: [1] }
      ]
    }
  ];

  /* FILING CABINET. A document is "ON FILE" when assets/docs/<id>.(jpg|png|jpeg|webp|mp4) exists.
     `pages` = several images/videos; `caps` = a caption per page. Anything without a file shows TESTIMONY ONLY. */
  C.cabinet = {
    objections: [
      'Objection! The defence is showing off.',
      'Objection! Relevance. (It is very relevant.)',
      'Objection! The witness is too prepared.',
      'Objection! This is a portfolio, not a trophy cabinet.',
      'Objection! Hearsay. Oh, it is a certificate. Withdrawn.'
    ],
    drawers: [
      { id: 'funding', name: 'FUNDING', note: 'Proof that I can raise money.', docs: [
        { id: 'build-grant', n: 'BUILD GRANT: Rs 50,000', d: 'IIT Hyderabad BUILD October 2024 cohort. VISN was selected, with a grant of Rs 50,000. Email dated 25 November 2024. Other applicants and all email addresses are withheld.' },
        { id: 'meity-eir', n: 'MEITY EIR: UP TO Rs 4 LAKH', d: 'Letter of intent from the IIT Hyderabad Technology Incubation Centre, 17 October 2025. VISN was selected for pre-incubation and financial support of up to Rs 4,00,000 under MeitY EIR, with 12 months of incubation. The support is subject to registrations, due diligence and agreements.' } ] },
      { id: 'designs', name: 'REGISTERED DESIGNS', note: 'Two designs, registered with IIT Hyderabad.', docs: [
        { id: 'design506847-1', n: 'DESIGN 506847-001', d: 'Hinge of spectacle. Certificate of registration, dated 24 June 2026, with the design drawings.', pages: ['design506847-1', 'design506847-2', 'design506847-3'], caps: ['The certificate.', 'Drawing: perspective view.', 'Drawing: front view.'] },
        { id: 'design-506848', n: 'DESIGN 506848-001', d: 'Temple arm of spectacles. Certificate of registration, design date 24 June 2026, issued 14 September 2026. Registered to IIT Hyderabad, myself and two professors.' } ] },
      { id: 'compete', name: 'COMPETE AND PLAY', note: 'Volleyball, chess and more.', docs: [
        { id: 'chess', n: 'CHESS.COM RAPID 2041', d: 'Rated 2041 in rapid.' },
        { id: 'volleyball', n: 'SENIOR STATE VOLLEYBALL', d: 'Played at senior state level.' },
        { id: 'inter-iiser-2022', n: 'INTER IISER 2022: 2ND IN VOLLEYBALL', d: 'Certificate of Merit. Second position in Volleyball (Men\'s) at the 9th Inter IISER Sports Meet, held at IISER Bhopal, 21 to 26 December 2022.' },
        { id: 'inter-iiser-2023', n: 'INTER IISER 2023', d: 'Inter IISER Sports Meet 2023.' },
        { id: 'inter-iit', n: 'INTER IIT x2: VOLLEYBALL', d: 'Played volleyball for IIT Hyderabad at the 57th Inter-IIT Sports Meet in 2024 (hosted by IIT Kanpur) and the 58th in 2025 (hosted by IIT Hyderabad). Certificates of participation.', pages: ['inter-iit-2024', 'inter-iit-2025'], caps: ['57th Inter-IIT Sports Meet 2024, IIT Kanpur.', '58th Inter-IIT Sports Meet 2025, IIT Hyderabad.'] } ] },
      { id: 'work', name: 'WORK AND TRAVEL', note: 'Out in the world.', docs: [
        { id: 'espc', n: 'ESPC 2022: 2ND POSITION', d: 'Environmental Sensing Project Competition, University of Helsinki. The IISER Bhopal team placed second with PawaMaan, an air quality monitoring system. The final was on 9 December 2022. Entered in the official results.', pages: ['espc', 'espc-post', 'espc-email'], caps: ['The official results page.', 'The college announcement.', 'The congratulations email (contact details cropped out).'] },
        { id: 'finland', n: 'UNIVERSITY OF HELSINKI TRAINEE', d: 'Internship at the University of Helsinki, Finland. The hosting agreement is shown with its contents withheld. The photos are from the trip.', pages: ['finland', 'finland-photo', 'finland-merch'], caps: ['The hosting agreement. Letterhead only; everything else withheld.', 'Outside the University of Helsinki.', 'University of Helsinki merchandise.'] },
        { id: 'suzuki', n: 'NEXT BHARAT INTERN (A SUZUKI INITIATIVE)', d: 'Internship from 11 March to 15 October 2025. Certificate of completion issued by NBV Community Private Limited, Next Bharat, a Suzuki initiative, dated 29 October 2025. Plus a photo from the workplace.', pages: ['suzuki-cert', 'suzuki'], caps: ['The certificate of completion.', 'A desk at the workplace.'] } ] },
      { id: 'hacks', name: 'HACKS AND HONOURS', note: 'Late nights and medals.', docs: [
        { id: 'byte-battles', n: 'BYTE BATTLES 2.0: TOP 30', d: 'The All India Firmware Development Challenge by Ather Energy. Certified as one of the Top 30 teams. Team: Git commit and run. Firmware for an autonomous scooter.', pages: ['byte-battles', 'byte-battles-team', 'byte-battles-banner'], caps: ['The Top 30 Achiever certificate.', 'The team at the event.', 'The event banner.'] },
        { id: 'silver-medal', n: 'INSTITUTE SILVER MEDAL', d: 'Convocation 2026. Institute Silver Medalist for the highest overall CGPA in M.Tech, Entrepreneurship and Management.' },
        { id: 'press', n: 'TWO NEWSPAPER FEATURES', d: 'Featured in two newspapers with the VISN smart glasses.', pages: ['press', 'press-2', 'press-3'], caps: ['Eenadu (Telugu daily), Telangana edition, 15 Feb 2026, page 12.', 'Kandili news.', 'The printed copy, photographed.'] } ] }
    ]
  };
})();
