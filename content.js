/* ALL COPY LIVES HERE. Edit text, swap audio ids, add exhibits. No build step needed.
   Audio: put recorded clips in /audio/<ID>.mp3 (e.g. audio/I01.mp3). Missing clips are skipped gracefully.
   All TODO lines in the trial script are resolved (2 Nov). Only proof images and the build stats remain open. */
window.CONTENT = {
  contact: { label: 'POST BAIL', href: 'mailto:sohambhar.sb@gmail.com', linkedin: 'https://www.linkedin.com/in/soham-bhar-159063201/' },
  caseNo: 'CASE 04-11-2026',
  title: 'THE PEOPLE vs. SOHAM BHAR',
  charge: 'CHARGE: SUSPICIOUS LEVELS OF EMPLOYABILITY',

  objections: [
    'Sustained. Sit.',
    'Overruled. Barely.',
    'Counsel, this is a portfolio, not a podcast.',
    'Objection noted. Ignored.',
    'The court is not amused. The court is mildly interested.'
  ],

  arraignment: [
    { who: 'JUDGE', id: 'J01', text: 'Order. ORDER. Juror Twelve, sit. You will ask questions. The defendant will answer. I will pretend to be patient.' },
    { who: 'PROSECUTOR', id: 'P01', text: 'Your Honor, the defendant stands accused of four counts of imperfection. He built things. Some failed. We have receipts.' },
    { who: 'JUDGE', id: 'J02', text: 'How does the defendant plead?' },
    { who: 'SOHAM', id: 'D01', text: 'Not guilty of being unemployable. Guilty of learning in public.' },
    { who: 'JUDGE', id: 'J03', text: 'Before the jury asks anything, the defence will explain what these things ARE. In English. Briefly.' }
  ],

  /* Opening statements: one explainer video + one founder pitch each */
  briefing: [
    { key: 'pave', ex: 'EXHIBIT A', name: 'PAVE', video: 'assets/video/pave.mp4', id: 'I01',
      text: 'Imagine Monopoly, but the board is your city and you play it by walking. Every run, walk or ride colours the streets you cover as yours. A rival can run through your block and take it, and if you stop visiting, it fades. Most fitness apps show you charts. Pave gives you something to lose. I built the app, the map engine and the backend, and it is tested on real phones.' },
    { key: 'f1', ex: 'EXHIBIT B', name: 'F1 TERMINAL', video: 'assets/video/f1.mp4', id: 'I02',
      text: 'On TV you see a car going around a track. In the pit wall, engineers stare at a hundred live numbers: speed, tyres, gaps. I built that wall for fans. Pick any race since 2018, press play, and watch the cars move while the data scrolls by. Every panel can be dragged around, like building your own control room.' },
    { key: 'm5', ex: 'EXHIBIT C', name: 'M5PAPER READER', video: 'assets/video/m5paper.mp4', id: 'I03',
      text: 'I wanted a Kindle I could actually control, so I built one from a bare e-ink board. It opens ebooks, remembers your chapter, joins WiFi, and even has a keyboard I wrote from scratch. The screen only refreshes what changes, so it is easy on the eyes and the battery. It is my own e-reader.' },
    { key: 'visn', ex: 'EXHIBIT D', name: 'VISN', video: 'assets/video/visn.mp4', id: 'I04',
      text: 'There are 253 million people with visual impairment in the world, and about five million blind people in India. Most assistive tech is expensive. VISN is smart glasses that help people spot objects and find their way, plus a pocket braille reader. It was backed with up to Rs 4.5 lakh in grants and incubation support, led to two registered designs, and became a working prototype. And, as the prosecutor will tell you, it never launched. We will get to why.' }
  ],

  /* Plain-English strip: the rest of the projects */
  locker: [
    { n: 'SCREEN SAUCE', d: 'Turns a phone on a wireless charger into a pitch-black bedside clock, with a timer, alarm and music controls hidden until you tap.' },
    { n: 'BS PROJECT (IISER BHOPAL)', d: 'A camera that measures how much virus protein is in a sample by how brightly it glows.' },
    { n: 'DFCC', d: 'Software that reads 10 years of railway reports and measures how positive the mood is about new technology.' },
    { n: 'INNOVEST', d: 'A dashboard that compares mutual funds so normal investors can see risk against return.' },
    { n: 'SAM TRANSPORT HUB', d: 'A campus site to book buses and share rides.' },
    { n: 'BYTEBATTLES 2.0', d: 'Firmware for an autonomous scooter at the All India Firmware Development Challenge. Top 30 team.' },
    { n: 'REEL EDITOR', d: 'Software that cuts travel clips to the beat of a song.' },
    { n: 'JAPANESE SYSTEM', d: 'A study plan with self-scheduling flashcards.' },
    { n: 'AUV DOCKING REVIEW', d: 'How underwater robots park themselves to recharge.' },
    { n: 'BLENDER WORLD', d: 'A 3D off-road map.' }
  ],

  /* Prosecution: 4 counts, ask every question */
  counts: [
    { title: 'COUNT 1', sub: 'THE PRIVACY ZONES (PAVE)', pid: 'P02',
      p: 'Pave. Privacy zones: built, ripped out, left dormant in the database like a ghost.',
      qs: [
        { q: 'Why did you remove them?', id: 'D02', a: 'Privacy zones let you hide somewhere like your home. I built them by cutting that area out of your claims and clipping your route near it. It made the territory rules confusing and easy to get wrong, so I took it out. And I learned that with location data, deleting a feature is not the same as undoing it.' },
        { q: 'What went wrong?', id: 'D03', a: 'Removing the clipping was retroactive, so it republished some route segments that a privacy zone had been hiding. Two accounts had saved zones, and I have told both of them. It is the kind of bug that keeps you up, and it is why I now check what a change does to old data before I ship it.' }
      ] },
    { title: 'COUNT 2', sub: 'THE STARTUP THAT NEVER LAUNCHED (VISN)', pid: 'P03',
      p: 'Up to Rs 4.5 lakh in grant and incubation support. A prototype. A launch? Silence.',
      qs: [
        { q: 'Why no launch?', id: 'D04', a: 'Funding was thin, hardware is expensive, I could not find the right manufacturers or contacts, and I could not build a team while writing my thesis and papers. A startup is a team sport.' },
        { q: 'What did you do instead?', id: 'D05', a: 'I finished the thesis, wrote the papers, and got two designs registered with IIT Hyderabad. The idea stays alive, protected.' }
      ] },
    { title: 'COUNT 3', sub: 'THE ABANDONED AI ASSISTANT', pid: 'P04',
      p: 'An AI coding assistant. Never committed. Abandoned in May 2025.',
      qs: [
        { q: 'Why did you quit?', id: 'D06', a: 'The learning curve was steep and I did not know what to build. I had no purpose.' },
        { q: 'Did you learn anything?', id: 'D07', a: 'Always have a purpose, in life or in learning a skill. Agents and vector stores meant nothing without a why.' }
      ] },
    { title: 'COUNT 4', sub: 'THE WIFI PASSWORD (ESP32-CAM)', pid: 'P05',
      p: 'A camera on the network, with the WiFi password in the source code.',
      qs: [
        { q: 'What is your defence?', id: 'D08', a: 'I do not have one. It was a demo sketch and I pasted the WiFi password straight into the code. I have since changed that password, and now I keep secrets in environment files, out of the code.' },
        { q: 'What is the lesson?', id: 'D09', a: 'Never commit credentials. Even if you are the only one reading it.' }
      ] }
  ],

  /* Defence: exhibits with evidence + 2 questions each */
  defence: [
    { key: 'pave', ex: 'EXHIBIT A', name: 'PAVE', build: 'pave',
      imgs: ['assets/img/pave-phone-map.jpg', 'assets/img/pave-phone-route.jpg', 'assets/img/pave-phone-run.jpg'],
      caption: 'Real screens from a real phone. Map home, route suggestion, live run.',
      qs: [
        { q: 'How does ownership work?', id: 'D10', a: 'Ownership is real map geometry, not a grid. A run through a rival\'s ground carves a true corridor out of it.' },
        { q: 'What was the hardest part?', id: 'D11', a: 'Making it fair and fast: the server decides, the phone only displays. And keeping rivals\' names private.' }
      ] },
    { key: 'f1', ex: 'EXHIBIT B', name: 'F1 TERMINAL', build: 'f1',
      imgs: ['assets/img/f1-replay.jpg', 'assets/img/f1-standings.jpg'],
      caption: '2024 Belgian GP replay: track map, telemetry, team radio. Standings back to 1950.',
      qs: [
        { q: 'How does it work?', id: 'D12', a: 'One process listens to the timing feed and fans it out to every panel. Live races stream, old races replay.' },
        { q: 'What was the hardest part?', id: 'D13', a: 'The feed is unofficial, so I had to be gentle with it. And the track map is always half the screen.' }
      ] },
    { key: 'm5', ex: 'EXHIBIT C', name: 'M5PAPER READER', build: 'm5paper',
      imgs: ['assets/img/m5-photo.jpg'],
      caption: 'The actual device, reading a book.',
      qs: [
        { q: 'How does it work?', id: 'D14', a: 'It unzips the book onto an SD card, splits it into chapters, and draws one page at a time.' },
        { q: 'What was the hardest part?', id: 'D15', a: 'E-ink is slow. Partial refresh without ghosting, and no freezing while reading the SD card.' }
      ] },
    { key: 'visn', ex: 'EXHIBIT D', name: 'VISN', build: 'visn', objection: true,
      imgs: ['assets/img/visn-glasses.jpg', 'assets/img/visn-objects.jpg', 'assets/img/visn-currency.jpg', 'assets/img/visn-ocr.jpg'],
      caption: 'The real prototype and its real detections: objects, currency (Rs 10, 20, 50, 100) and text.',
      qs: [
        { q: 'What did the prototype do?', id: 'D16', a: 'The glasses see through a camera. They spot objects and currency, then alert you with a buzz. Say "speak" and they read text out loud. Say "stop" and they pause. The prototype works. For the demo I show the camera view on a laptop so you can see what it detects.' },
        { q: 'What was registered?', id: 'D17', a: 'Two designs: 506847-001 and 506848-001, registered with IIT Hyderabad.' }
      ] }
  ],

  binder: {
    funds: { id: 'D18', n: 'CAPABLE OF RAISING FUNDS', d: 'A Rs 50,000 BUILD grant, and selected for up to Rs 4 lakh more under MeitY EIR. Up to Rs 4.5 lakh in support, before I had a team.' },
    docs: []
  },

  verdict: [
    { who: 'JUDGE', id: 'J09', text: 'The jury has deliberated for 0.4 seconds.' },
    { who: 'JUDGE', id: 'J10', text: 'The verdict: GUILTY of being too employable. Sentence: HIRED.' },
    { who: 'PROSECUTOR', id: 'P07', text: 'The prosecution rests. And would like to apply for the job.' },
    { who: 'SOHAM', id: 'D19', text: 'Thank you, Your Honor. I accept the sentence.' }
  ],

  /* TODO: fill after dictating the build */
  buildStats: { words: 0, minutes: 0 }
};
