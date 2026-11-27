/* ═══════════════════════════════════════════════════════════════
   와글링 산수 (Wagling Math) v1 — app.js
   · 0원 정적 웹앱 · 서버/DB/외부 API 없음 · 기록은 localStorage 에만
   · 놀이 4가지: 덧셈·뺄셈 / 구구단 노래·퀴즈 / 시계 보기 / 동전·지폐 세기
   · 효과음(Web Audio) + 별 스티커 + 따뜻한 격려 + 폰 뒤로가기
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─────────── 도움 함수 ─────────── */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KEY_SET = 'sansu.set.v1';
  var KEY_STAR = 'sansu.stars.v1';
  var DAY = 86400000;
  var WD = ['일', '월', '화', '수', '목', '금', '토'];
  var WD_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function keyOf(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function todayKey() { return keyOf(new Date()); }
  function normH(h) { return ((h - 1) % 12 + 12) % 12 + 1; }
  function normM(m) { return ((m % 60) + 60) % 60; }

  /* ─────────── 말 (한/EN) ─────────── */
  var I18N = {
    ko: {
      appName: '와글링 산수', sub: '놀이로 배우는 신나는 셈',
      docTitle: '어린이 산수 놀이',
      install: '설치', share: '공유', back: '뒤로',
      helloTitle: '안녕! 오늘은 어떤 놀이 할까?', helloSmall: '한 놀이에 3분이면 충분해요.',
      g1: '덧셈·뺄셈', g1s: '사과를 세며 더하고 빼요',
      g2: '구구단 노래', g2s: '노래로 외우고 퀴즈로 확인',
      g3: '시계 보기', g3s: '몇 시 몇 분인지 맞혀요',
      g4: '동전·지폐 세기', g4s: '동전을 세어 모두 얼마',
      openCalc: '덧셈 뺄셈 놀이예요. 답을 눌러 볼까요?',
      openGugudan: '구구단 노래예요. 노래로 듣고 퀴즈도 풀어 봐요.',
      openClock: '시계 보기 놀이예요. 시계를 잘 보고 맞혀 봐요.',
      openMoney: '동전과 지폐를 세는 놀이예요. 모두 얼마인지 맞혀 봐요.',
      starTitle: '내 별 스티커', starUnit: '개', week: '이번 주', bigStar: '큰 별 하나 더!',
      starNext: '큰 별까지 {n}개', starNextOne: '큰 별까지 1개',
      stMsg0: '첫 별을 모아 볼까요?',
      stMsgLow: '별 {n}개를 모았어요! 하나둘 늘어나요.',
      stMsgMid: '큰 별까지 {n}개 남았어요!',
      bigStarMsg: '큰 별 {n}개! 정말 대단해요 🏅',
      setTitle: '⚙️ 놀이 설정', soundLabel: '소리', hintLabel: '그림 힌트', on: '켜짐', off: '꺼짐',
      hintOn: '힌트 켜짐', hintOff: '힌트 꺼짐',
      setHint: '소리를 켜면 즐거운 효과음과 문제 읽기를 들려줘요. 모은 별은 이 기기에만 저장되고, 어디로도 보내지 않아요.',
      ver: '와글링 산수 v1 · 무료 · 광고 없음 · 기록은 이 기기에만',
      calcTitle: '➕ 덧셈·뺄셈', lvEasy: '한 자리', lvTwo: '두 자리',
      plusTag: '➕ 더하기', minusTag: '➖ 빼기', readQ: '읽어 주기', check: '확인', delKey: '지우기',
      sayPlus: '{a} 더하기 {b}는 얼마일까요?', sayMinus: '{a} 빼기 {b}는 얼마일까요?',
      typeAnswer: '숫자를 눌러 답을 만들어요', needAnswer: '답을 먼저 눌러 볼까요?',
      correctFb: '정답이야! 별 하나 받았어 ⭐', wrong1: '아깝다! 다시 해 보자 💪',
      answerIs: '정답은 {a}야. 다음에 또 해 보자!',
      hintLegend: '긴 막대 하나는 10, 노란 점 하나는 1이에요.',
      gugudanTitle: '🎵 구구단 노래', tabTable: '📖 암기표', tabQuiz: '🎯 퀴즈',
      sing: '노래로 듣기', stopSing: '그만 듣기', gTag: '{n}단',
      singHint: '노래에 맞춰 한 줄씩 불러 줄게요. 노란 줄을 같이 따라 불러 봐요!',
      gSay: '{a} 곱하기 {b}는 {c}', sayGq: '{a} 곱하기 {b}는 얼마일까요?',
      clockTitle: '🕒 시계 보기', lvHour: '정각', lvHalf: '30분', lvFive: '5분',
      clockQ: '지금 몇 시 몇 분일까요?', sayClock: '시계를 보고 몇 시 몇 분인지 맞혀 보세요.',
      timeIs: '정답은 {a}야. 잘 봐 두자!',
      moneyTitle: '💰 동전·지폐 세기', lvCoin: '동전', lvBill: '지폐까지', lvBig: '큰돈',
      moneyQ: '모두 얼마일까요?', sayMoney: '동전과 지폐를 세어 모두 얼마인지 맞혀 보세요.',
      won: '원', moneyIs: '정답은 {a}야. 다시 세어 보자!',
      doneTitle: '참 잘했어요!', donePerfect: '완벽해요!',
      doneScore: '{n}문제 중 {s}개를 맞혔어요.', doneStar: '이번에 별 {n}개를 모았어요 ⭐',
      doneHigh: '별을 척척! 정말 대단해요 🏆', doneMid: '아주 잘했어요. 한 번 더 해 볼까요?',
      doneLow: '괜찮아요. 천천히 다시 해 보면 더 잘할 수 있어요.',
      again: '한 번 더', goHome: '첫 화면',
      installTitle: '📲 홈 화면에 산수 놀이 두기',
      installLead: '한 번만 담아 두면 다음부터 앱처럼 바로 열려요. 인터넷이 없어도 열려요.',
      instOk: '알겠어요', copied: '주소를 복사했어요. 카톡·문자에 붙여 넣어 보세요.',
      copyFail: '주소창의 주소를 복사해 주세요.', installed: '홈 화면에 넣었어요!',
      alreadyApp: '이미 홈 화면 앱으로 열려 있어요.',
      shareTitle: '와글링 산수', shareText: '덧셈·뺄셈, 구구단 노래, 시계 보기, 동전 세기까지 — 어린이 무료 산수 놀이'
    },
    en: {
      appName: 'Wagling Math', sub: 'Happy numbers through play',
      docTitle: 'Math games for kids',
      install: 'Install', share: 'Share', back: 'Back',
      helloTitle: 'Hi! Which game shall we play?', helloSmall: 'One game takes about 3 minutes.',
      g1: 'Add & Subtract', g1s: 'Count apples to add and take away',
      g2: 'Times Table Song', g2s: 'Sing it, then try the quiz',
      g3: 'Telling Time', g3s: 'Read the clock hands',
      g4: 'Count Money', g4s: 'Add up coins and notes',
      openCalc: 'Add and subtract. Shall we build the answer?',
      openGugudan: 'Times table song. Listen, then try the quiz.',
      openClock: 'Telling time. Look at the clock and tell me.',
      openMoney: 'Counting money. How much is it in all?',
      starTitle: 'My star stickers', starUnit: '', week: 'This week', bigStar: 'One more big star!',
      starNext: '{n} more to a big star', starNextOne: 'One more to a big star',
      stMsg0: 'Shall we collect the first star?',
      stMsgLow: 'You have {n} stars! They keep growing.',
      stMsgMid: '{n} more stars to a big star!',
      bigStarMsg: '{n} big stars! Wonderful 🏅',
      setTitle: '⚙️ Play settings', soundLabel: 'Sound', hintLabel: 'Picture hints', on: 'On', off: 'Off',
      hintOn: 'Hints on', hintOff: 'Hints off',
      setHint: 'With sound on, you hear cheerful effects and questions read aloud. Stars stay only on this device.',
      ver: 'Wagling Math v1 · Free · No ads · Saved on this device only',
      calcTitle: '➕ Add & Subtract', lvEasy: 'One digit', lvTwo: 'Two digits',
      plusTag: '➕ Add', minusTag: '➖ Take away', readQ: 'Read', check: 'Check', delKey: 'Del',
      sayPlus: 'What is {a} plus {b}?', sayMinus: 'What is {a} minus {b}?',
      typeAnswer: 'Tap the numbers to build your answer', needAnswer: 'Tap a number first!',
      correctFb: 'That is right! You earned a star ⭐', wrong1: 'So close! Try again 💪',
      answerIs: 'The answer is {a}. Let us try again next time!',
      hintLegend: 'One long rod is 10, one yellow dot is 1.',
      gugudanTitle: '🎵 Times Table Song', tabTable: '📖 Table', tabQuiz: '🎯 Quiz',
      sing: 'Sing it', stopSing: 'Stop', gTag: 'Table of {n}',
      singHint: 'I will sing it line by line. Sing along with the yellow line!',
      gSay: '{a} times {b} is {c}', sayGq: 'What is {a} times {b}?',
      clockTitle: '🕒 Telling Time', lvHour: 'O’clock', lvHalf: 'Half past', lvFive: 'Five minutes',
      clockQ: 'What time is it?', sayClock: 'Look at the clock and tell me the time.',
      timeIs: 'The answer is {a}. Look again!',
      moneyTitle: '💰 Count Money', lvCoin: 'Coins', lvBill: 'With notes', lvBig: 'Big money',
      moneyQ: 'How much in all?', sayMoney: 'Count the coins and notes and tell me the total.',
      won: '', moneyIs: 'The answer is {a}. Let us count again!',
      doneTitle: 'Well done!', donePerfect: 'Perfect!',
      doneScore: 'You got {s} of {n} right.', doneStar: 'You earned {n} stars ⭐',
      doneHigh: 'Star after star! Amazing 🏆', doneMid: 'Very good. Shall we play once more?',
      doneLow: 'That is all right. Take your time and try again.',
      again: 'Once more', goHome: 'Home',
      installTitle: '📲 Put Math games on your home screen',
      installLead: 'Add it once and it opens like an app. It even works offline.',
      instOk: 'Got it', copied: 'Link copied. Paste it into a message.',
      copyFail: 'Please copy the address from the address bar.', installed: 'Added to your home screen!',
      alreadyApp: 'Already running as a home screen app.',
      shareTitle: 'Wagling Math', shareText: 'Add & subtract, times table songs, telling time, counting money — free math play for kids'
    }
  };

  var lang = 'ko';
  function t(k, v) {
    var s = (I18N[lang] && I18N[lang][k] != null) ? I18N[lang][k] : I18N.ko[k];
    if (s == null) s = k;
    if (v) { Object.keys(v).forEach(function (key) { s = s.split('{' + key + '}').join(String(v[key])); }); }
    return s;
  }
  function fmtTime(h, m) {
    if (lang === 'ko') return (m === 0) ? (h + '시') : (h + '시 ' + m + '분');
    return h + ':' + pad2(m);
  }
  function fmtWon(n) {
    return (lang === 'ko') ? (Number(n).toLocaleString('ko-KR') + '원') : ('₩' + Number(n).toLocaleString('en-US'));
  }

  var PRAISE = {
    ko: ['정답이야! 최고야! 🎉', '와, 똑똑한데? ⭐', '딱 맞았어! 👏', '멋져! 하나 더 해 볼까? ✨', '우와, 산수 왕! 🏅', '정확해! 아주 좋아! 🌟'],
    en: ['That is right! Awesome! 🎉', 'Wow, so clever! ⭐', 'Exactly! 👏', 'Great! Shall we do one more? ✨', 'You are a math star! 🏅', 'Spot on! Very good! 🌟']
  };
  function praiseWord() { return rnd(PRAISE[lang] || PRAISE.ko); }

  /* ─────────── 저장 (설정·별) ─────────── */
  var set = { sound: true, hint: true };
  function loadSet() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY_SET) || 'null');
      if (!s || typeof s !== 'object') return;
      if (typeof s.sound === 'boolean') set.sound = s.sound;
      if (typeof s.hint === 'boolean') set.hint = s.hint;
      if (s.lang === 'en' || s.lang === 'ko') lang = s.lang;
    } catch (e) {}
  }
  function saveSet() {
    try { localStorage.setItem(KEY_SET, JSON.stringify({ sound: set.sound, hint: set.hint, lang: lang })); } catch (e) {}
  }

  var STARS = { total: 0, byGame: {}, days: {} };
  function loadStars() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY_STAR) || 'null');
      if (!s || typeof s !== 'object') return;
      STARS.total = Math.max(0, parseInt(s.total, 10) || 0);
      STARS.byGame = (s.byGame && typeof s.byGame === 'object') ? s.byGame : {};
      STARS.days = (s.days && typeof s.days === 'object') ? s.days : {};
    } catch (e) {}
  }
  function saveStars() {
    try {
      var keys = Object.keys(STARS.days).sort();
      while (keys.length > 60) { delete STARS.days[keys.shift()]; }
      localStorage.setItem(KEY_STAR, JSON.stringify(STARS));
    } catch (e) {}
  }
  function awardStar(game) {
    STARS.total += 1;
    STARS.byGame[game] = (STARS.byGame[game] || 0) + 1;
    var k = todayKey();
    STARS.days[k] = (STARS.days[k] || 0) + 1;
    saveStars();
    renderHome();
    starPop();
  }

  /* ─────────── 효과음 (Web Audio, 외부 파일 없음) ─────────── */
  var AC = null;
  function ac() {
    if (!AC) {
      try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; }
    }
    if (AC && AC.state === 'suspended') { try { AC.resume(); } catch (e) {} }
    return AC;
  }
  function ensureAudio() { try { ac(); } catch (e) {} }
  // 화면을 떠날 때 오디오를 닫아 기기 오디오를 붙잡지 않는다
  window.addEventListener('pagehide', function () {
    try { if (AC && AC.close) { AC.close(); } } catch (e) {}
    AC = null;
  });
  function tone(freq, delay, dur, type, vol) {
    var c = ac(); if (!c) return;
    try {
      var o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.value = freq;
      o.connect(g); g.connect(c.destination);
      var t0 = c.currentTime + (delay || 0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(vol || 0.12, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
      o.start(t0); o.stop(t0 + dur + 0.05);
    } catch (e) {}
  }
  function sfx(kind) {
    if (!set.sound) return;
    if (kind === 'good') { tone(659, 0, 0.18, 'triangle', 0.12); tone(880, 0.09, 0.24, 'triangle', 0.11); }
    else if (kind === 'great') { tone(523, 0, 0.15); tone(659, 0.09, 0.15); tone(784, 0.18, 0.15); tone(1047, 0.27, 0.3); }
    else if (kind === 'star') { tone(1175, 0, 0.1, 'sine', 0.08); tone(1568, 0.08, 0.16, 'sine', 0.07); }
    else if (kind === 'tap') { tone(520, 0, 0.045, 'triangle', 0.05); }
    else if (kind === 'soft') { tone(392, 0, 0.18, 'sine', 0.09); tone(311, 0.12, 0.24, 'sine', 0.08); }
  }

  /* ─────────── 🔊 읽어 주기 ─────────── */
  var voices = [], speakGen = 0, speakTimer = null, speakGuard = null;
  var IS_ANDROID = /Android/i.test(navigator.userAgent || '');
  function loadVoices() {
    try { voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; } catch (e) { voices = []; }
  }
  if ('speechSynthesis' in window) {
    loadVoices();
    try { window.speechSynthesis.onvoiceschanged = loadVoices; } catch (e) {}
  }
  function stopSpeak() {
    speakGen++;
    try { clearTimeout(speakTimer); clearTimeout(speakGuard); } catch (e) {}
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
  }
  function speak(text) {
    if (!set.sound) return;
    var ss = window.speechSynthesis;
    if (!ss || typeof SpeechSynthesisUtterance === 'undefined') return;
    var say = String(text == null ? '' : text).replace(/\s+/g, ' ').trim();
    if (!say) return;
    if (!voices.length) loadVoices();
    var gen = ++speakGen, tries = 0;
    try { clearTimeout(speakTimer); clearTimeout(speakGuard); } catch (e) {}
    function make() {
      var u = new SpeechSynthesisUtterance(say);
      u.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
      u.rate = lang === 'ko' ? 0.94 : 0.98;
      u.pitch = 1.05; u.volume = 1;
      if (!IS_ANDROID) {
        var want = lang === 'ko' ? 'ko' : 'en', hit = null;
        for (var i = 0; i < voices.length; i++) {
          var vl = String(voices[i].lang || '').toLowerCase().replace(/_/g, '-');
          if (vl.indexOf(want) === 0) { hit = voices[i]; break; }
        }
        if (hit) u.voice = hit;
      }
      return u;
    }
    function fire() {
      if (gen !== speakGen) return;
      tries++;
      var u = make(), started = false;
      u.onstart = function () { started = true; };
      try { ss.speak(u); } catch (e) { return; }
      try { clearTimeout(speakGuard); } catch (e) {}
      speakGuard = setTimeout(function () {
        if (gen !== speakGen || started) return;
        if (tries >= 2) return;
        try { if (ss.speaking || ss.pending) ss.cancel(); } catch (e) {}
        setTimeout(fire, 160);
      }, 1600);
    }
    try {
      if (ss.speaking || ss.pending || ss.paused) {
        ss.cancel();
        speakTimer = setTimeout(fire, 140);
      } else { fire(); }
    } catch (e) { fire(); }
  }
  function setSound(on) {
    set.sound = !!on; saveSet();
    if (!set.sound) stopSpeak();
    syncToggles();
  }
  function setHint(on) {
    set.hint = !!on; saveSet();
    syncToggles();
    // 지금 풀던 문제의 입력은 그대로 두고 그림 힌트만 여닫는다
    if (CALC.list.length) {
      var h = $('#calcHint'), q = CALC.q();
      if (h && q) {
        if (set.hint) { h.hidden = false; h.innerHTML = hintHTML(q); }
        else { h.hidden = true; h.innerHTML = ''; }
      }
    }
  }

  /* ─────────── 배너·토스트·별 ─────────── */
  var praiseT = null;
  function praise(text) {
    var el = $('#praise');
    if (!el) return;
    el.textContent = text;
    el.classList.add('on');
    clearTimeout(praiseT);
    praiseT = setTimeout(function () { el.classList.remove('on'); }, 1400);
  }
  var toastT = null;
  function toast(text) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = text;
    el.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { el.classList.remove('on'); }, 2300);
  }
  var starT = null;
  function starPop() {
    var el = $('#starPop');
    if (!el) return;
    el.classList.remove('on');
    void el.offsetWidth;
    el.classList.add('on');
    clearTimeout(starT);
    starT = setTimeout(function () { el.classList.remove('on'); }, 1200);
    sfx('star');
  }

  /* ─────────── 화면 이동 · 폰 뒤로가기 ─────────── */
  var layers = [];
  function pushLayer(close) {
    try { history.pushState({ sansu: layers.length + 1 }, ''); } catch (e) { return; }
    layers.push({ close: close });
  }
  window.addEventListener('popstate', function () {
    var top = layers.pop();
    if (!top) return;
    try { if (typeof top.close === 'function') top.close(); } catch (e) {}
  });
  var curScreen = 'home';
  function showScreen(name) {
    curScreen = name;
    $$('.screen').forEach(function (s) { s.hidden = (s.id !== 'screen-' + name); });
    try { window.scrollTo({ top: 0, behavior: 'auto' }); } catch (e) { window.scrollTo(0, 0); }
  }
  function goBack() {
    if (layers.length) { try { history.back(); return; } catch (e) {} }
    showScreen('home');
  }
  function goHome() {
    if (layers.length) { try { history.back(); return; } catch (e) {} }
    showScreen('home'); renderHome();
  }
  function closeGame() {
    showScreen('home');
    renderHome();
    stopSpeak();
    CALC.cancel(); GD.cancel(); CLK.cancel(); MON.cancel();
  }
  var INTRO = {
    calc: 'openCalc', gugudan: 'openGugudan', clock: 'openClock', money: 'openMoney'
  };
  function openGame(name) {
    ensureAudio();
    stopSpeak();
    showScreen(name);
    if (name === 'calc') CALC.enter();
    else if (name === 'gugudan') GD.enter();
    else if (name === 'clock') CLK.enter();
    else if (name === 'money') MON.enter();
    pushLayer(function () { closeGame(); });
    if (set.sound && INTRO[name]) setTimeout(function () { speak(t(INTRO[name])); }, 260);
  }
  function speakCurrent() {
    if (curScreen === 'calc') CALC.say();
    else if (curScreen === 'gugudan') { if (GD.tab === 'quiz') GD.say(); else GD.sayTable(); }
    else if (curScreen === 'clock') CLK.say();
    else if (curScreen === 'money') MON.say();
  }

  /* ─────────── 첫 화면 ─────────── */
  function renderHome() {
    var total = STARS.total || 0;
    var elTotal = $('#starTotal'); if (elTotal) elTotal.textContent = total;
    var rem = 10 - (total % 10);
    var next = $('#starNext');
    if (next) next.textContent = (rem === 1) ? t('starNextOne') : t('starNext', { n: rem });
    var row = $('#tenRow');
    if (row) {
      var filled = total % 10, html = '';
      for (var i = 0; i < 10; i++) html += '<i class="' + (i < filled ? 'on' : '') + '">★</i>';
      row.innerHTML = html;
    }
    var msg = $('#starMsg');
    if (msg) {
      var txt, cls = 'stmsg';
      if (total === 0) { txt = t('stMsg0'); cls += ' none'; }
      else if (total % 10 === 0) { txt = t('bigStarMsg', { n: Math.floor(total / 10) }); }
      else if (total < 10) { txt = t('stMsgLow', { n: total }); }
      else { txt = t('stMsgMid', { n: rem }); }
      msg.textContent = txt; msg.className = cls;
    }
    var wk = $('#weekRow');
    if (wk) {
      var h = '', base = new Date(); base.setHours(12, 0, 0, 0);
      for (var d = 6; d >= 0; d--) {
        var dt = new Date(base.getTime() - d * DAY);
        var n = (STARS.days[keyOf(dt)] || 0);
        h += '<div class="wch' + (n ? ' on' : '') + (d === 0 ? ' today' : '') + '">' +
          '<b>' + (lang === 'ko' ? WD[dt.getDay()] : WD_EN[dt.getDay()].slice(0, 1)) + '</b>' +
          '<i>' + (n ? '★' : '·') + '</i></div>';
      }
      wk.innerHTML = h;
    }
    var map = { calc: '#cCalc', gugudan: '#cGugudan', clock: '#cClock', money: '#cMoney' };
    Object.keys(map).forEach(function (k) {
      var el = $(map[k]);
      if (el) el.textContent = '★ ' + (STARS.byGame[k] || 0);
    });
  }
  function syncToggles() {
    var sb = $('#soundBtn'), hb = $('#hintBtn'), ch = $('#calcHintBtn');
    if (sb) { sb.setAttribute('aria-pressed', set.sound ? 'true' : 'false'); $('#soundState').textContent = set.sound ? t('on') : t('off'); }
    if (hb) { hb.setAttribute('aria-pressed', set.hint ? 'true' : 'false'); $('#hintState').textContent = set.hint ? t('on') : t('off'); }
    if (ch) {
      ch.setAttribute('aria-pressed', set.hint ? 'true' : 'false');
      var cs = $('#calcHintState');
      if (cs) cs.textContent = set.hint ? t('hintOn') : t('hintOff');
    }
    $$('[data-tts]').forEach(function (b) { b.setAttribute('aria-pressed', set.sound ? 'true' : 'false'); });
  }

  /* ─────────── 공통 그리기 ─────────── */
  function setDots(el, list, res, cur) {
    if (!el) return;
    var h = '';
    for (var i = 0; i < list.length; i++) {
      var c = res[i] || '';
      h += '<i class="' + c + '"></i>';
    }
    el.innerHTML = h;
  }
  function fbShow(el, kind, text) {
    if (!el) return;
    el.className = 'fb ' + kind;
    el.textContent = text;
    el.hidden = false;
  }
  function fbHide(el) { if (el) { el.hidden = true; el.className = 'fb'; el.textContent = ''; } }

  function drawOpts(el, labels, picked, correctIdx) {
    if (!el) return;
    el.innerHTML = labels.map(function (s, k) {
      var cls = 'opt';
      if (correctIdx >= 0) {
        if (k === correctIdx) cls += ' good';
        else if (k === picked) cls += ' bad';
        else cls += ' dim';
      } else if (k === picked) cls += ' bad';
      return '<button type="button" class="' + cls + '" data-k="' + k + '">' +
        '<span class="num">' + 'ABCD'.charAt(k) + '</span><span class="ot">' + esc(s) + '</span></button>';
    }).join('');
  }

  /* ═══════════ 1. 덧셈·뺄셈 ═══════════ */
  var APPLE_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 34c-9-9-25-7-29 6-4 13 6 25 13 32 6 6 11 6 16 2 5 4 10 4 16-2 7-7 17-19 13-32-4-13-20-15-29-6z" fill="#E0513C"/><path d="M50 36c0-9 2-13 6-17" fill="none" stroke="#7B5A2C" stroke-width="5" stroke-linecap="round"/><path d="M57 21c8-6 16-3 17 0-6 6-13 7-17 3z" fill="#4E9B3A"/></svg>';
  var STAR_SVG = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8l12.4 25.2 27.8 4-20.1 19.6 4.7 27.7L50 71.4 25.2 84.5l4.7-27.7L9.8 37.2l27.8-4z" fill="#FFC53D" stroke="#E8A800" stroke-width="4" stroke-linejoin="round"/></svg>';

  function genCalc(lv) {
    var op = Math.random() < 0.5 ? '+' : '-';
    var a, b;
    if (lv === 'easy') {
      if (op === '+') { a = ri(1, 9); b = ri(1, 9); }
      else { a = ri(2, 9); b = ri(1, a - 1); }
    } else {
      if (op === '+') { a = ri(11, 79); b = ri(11, 99 - a); }
      else {
        // 두 자리 빼기: 십을 부수지 않는(받아내림 없는) 문제로 낸다
        a = ri(31, 99);
        var at = Math.floor(a / 10), ao = a % 10;
        var bt = ri(1, at - 1), bo = ri(0, ao);
        b = bt * 10 + bo;
        if (b < 10) b = 10;
      }
    }
    return { a: a, b: b, op: op, ans: (op === '+') ? a + b : a - b, kind: Math.random() < 0.5 ? 'apple' : 'star' };
  }
  function rep(icon, n, gone) {
    var s = '';
    for (var i = 0; i < n; i++) s += '<span class="hico' + (i >= n - gone ? ' gone' : '') + '">' + icon + '</span>';
    return s;
  }
  function blocks(n, goneTens, goneOnes) {
    var tens = Math.floor(n / 10), ones = n % 10, arr = [], i;
    goneTens = goneTens || 0; goneOnes = goneOnes || 0;
    for (i = 0; i < tens; i++) arr.push({ k: 'ten', g: i >= tens - goneTens });
    for (i = 0; i < ones; i++) arr.push({ k: 'one', g: i >= ones - goneOnes });
    var s = '';
    for (i = 0; i < arr.length; i++) {
      var g = arr[i].g ? ' gone' : '';
      s += (arr[i].k === 'ten') ? '<span class="hten' + g + '"></span>' : '<span class="hone' + g + '"></span>';
    }
    return s;
  }
  function hintHTML(q) {
    var icon = (q.kind === 'star') ? STAR_SVG : APPLE_SVG;
    if (q.a <= 9 && q.b <= 9) {
      if (q.op === '+') {
        return '<div class="hgrp">' + rep(icon, q.a, 0) + '</div>' +
          '<div class="hrow"><span class="hsign">+</span><div class="hgrp">' + rep(icon, q.b, 0) + '</div></div>';
      }
      return '<div class="hgrp">' + rep(icon, q.a, q.b) + '</div>';
    }
    var out = (q.op === '+')
      ? '<div class="hgrp">' + blocks(q.a, 0, 0) + '</div>' +
        '<div class="hrow"><span class="hsign">+</span><div class="hgrp">' + blocks(q.b, 0, 0) + '</div></div>'
      : '<div class="hgrp">' + blocks(q.a, Math.floor(q.b / 10), q.b % 10) + '</div>';
    return out + '<p class="hlegend">' + esc(t('hintLegend')) + '</p>';
  }

  var CALC = {
    lv: 'easy', list: [], i: 0, typed: '', wrong: 0, score: 0, stars: 0,
    res: [], lock: false, timer: null, lastRead: 0,
    cancel: function () { clearTimeout(this.timer); this.timer = null; },
    enter: function () { this.newRound(); },
    restart: function () { this.newRound(); },
    newRound: function () {
      this.cancel();
      var seen = {}, list = [], tries;
      for (var k = 0; k < 5; k++) {
        var q, key;
        tries = 0;
        do { q = genCalc(this.lv); key = q.a + q.op + q.b; tries++; } while (seen[key] && tries < 60);
        seen[key] = 1; list.push(q);
      }
      this.list = list; this.i = 0; this.score = 0; this.stars = 0; this.res = [];
      this.typed = ''; this.wrong = 0; this.lock = false;
      this.render();
    },
    q: function () { return this.list[this.i]; },
    render: function () {
      var q = this.q(); if (!q) return;
      $('#calcProg').textContent = (this.i + 1) + ' / ' + this.list.length;
      setDots($('#calcDots'), this.list, this.res, this.i);
      $('#calcTag').textContent = (q.op === '+') ? t('plusTag') : t('minusTag');
      var ansTxt = this.typed === '' ? '?' : this.typed;
      $('#calcEq').innerHTML = '<span>' + q.a + '</span><i>' + q.op + '</i><span>' + q.b + '</span><i>=</i>' +
        '<b class="' + (this.typed ? 'filled' : '') + '">' + ansTxt + '</b>';
      var h = $('#calcHint');
      if (set.hint) { h.hidden = false; h.innerHTML = hintHTML(q); }
      else { h.hidden = true; h.innerHTML = ''; }
      fbHide($('#calcFb'));
      var tip = $('#calcTip');
      tip.classList.remove('warn');
      tip.textContent = t('typeAnswer');
    },
    redraw: function () {
      if (!this.list.length) return;
      var q = this.q(); if (!q) return;
      $('#calcTag').textContent = (q.op === '+') ? t('plusTag') : t('minusTag');
      var b = $('#calcEq b');
      if (b) { b.textContent = this.typed || '?'; b.classList.toggle('filled', !!this.typed); }
      var h = $('#calcHint');
      if (h && set.hint && !h.hidden) h.innerHTML = hintHTML(q);
      var tip = $('#calcTip');
      if (tip && !tip.classList.contains('warn')) tip.textContent = t('typeAnswer');
      setDots($('#calcDots'), this.list, this.res, this.i);
    },
    paint: function () {
      var b = $('#calcEq b'); if (!b) return;
      b.textContent = this.typed || '?';
      b.classList.toggle('filled', !!this.typed);
    },
    key: function (k) {
      if (this.lock) return;
      ensureAudio();
      if (k === 'del') { this.typed = this.typed.slice(0, -1); sfx('tap'); this.paint(); return; }
      if (k === 'ok') { this.check(); return; }
      if (this.typed.length >= 2) { sfx('tap'); return; }
      if (this.typed === '0') this.typed = '';
      this.typed += k;
      sfx('tap');
      this.paint();
    },
    check: function () {
      if (this.lock) return;
      var q = this.q(); if (!q) return;
      if (!this.typed) {
        var tip = $('#calcTip');
        tip.textContent = t('needAnswer'); tip.classList.add('warn');
        sfx('soft');
        return;
      }
      var v = parseInt(this.typed, 10);
      if (v === q.ans) {
        this.lock = true;
        this.res[this.i] = 'ok';
        this.score++; this.stars++;
        awardStar('calc');
        sfx('great'); praise(praiseWord());
        fbShow($('#calcFb'), 'good', t('correctFb'));
        setDots($('#calcDots'), this.list, this.res, this.i);
        var self = this;
        this.timer = setTimeout(function () { self.next(); }, 1150);
      } else {
        this.wrong++;
        sfx('soft');
        var eq = $('#calcEq');
        eq.classList.remove('shake'); void eq.offsetWidth; eq.classList.add('shake');
        if (this.wrong === 1) {
          fbShow($('#calcFb'), 'bad', t('wrong1'));
          this.typed = ''; this.paint();
        } else {
          this.lock = true;
          this.res[this.i] = 'no';
          fbShow($('#calcFb'), 'bad', t('answerIs', { a: q.ans }));
          var b = $('#calcEq b');
          if (b) { b.textContent = q.ans; b.classList.add('filled'); }
          setDots($('#calcDots'), this.list, this.res, this.i);
          var self2 = this;
          this.timer = setTimeout(function () { self2.next(); }, 2000);
        }
      }
    },
    next: function () {
      this.cancel();
      this.i++;
      if (this.i >= this.list.length) { finishGame('calc', this.score, this.list.length, this.stars); return; }
      this.typed = ''; this.wrong = 0; this.lock = false;
      this.render();
    },
    say: function () {
      var q = this.q(); if (!q) return;
      speak(t(q.op === '+' ? 'sayPlus' : 'sayMinus', { a: q.a, b: q.b }));
    }
  };

  /* ═══════════ 2. 구구단 ═══════════ */
  var GD = {
    dan: 3, tab: 'table', list: [], i: 0, score: 0, stars: 0, res: [], lock: false,
    picked: -1, correctIdx: -1, opts: [], timer: null,
    singing: false, songTimers: [], rows: [],
    cancel: function () { clearTimeout(this.timer); this.timer = null; this.stopSong(); },
    enter: function () { this.dan = this.dan || 3; this.singing = false; this.showTab('table'); },
    restart: function () { this.showTab('quiz'); },
    renderDans: function () {
      var el = $('#dans'); if (!el) return;
      var h = '';
      for (var d = 2; d <= 9; d++) {
        h += '<button type="button" class="chip" data-dan="' + d + '" aria-pressed="' + (d === this.dan ? 'true' : 'false') + '">' + d + '단</button>';
      }
      el.innerHTML = h;
    },
    showTab: function (tab) {
      this.stopSong();
      this.tab = tab;
      $$('#gdTabs .tab').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-tab') === tab ? 'true' : 'false'); });
      $('#gdTable').hidden = (tab !== 'table');
      $('#gdQuiz').hidden = (tab !== 'quiz');
      if (tab === 'table') { this.renderTable(); this.setSingBtn(); }
      else { this.newQuiz(); }
    },
    renderTable: function () {
      $('#gdDanTitle').textContent = t('gTag', { n: this.dan });
      var h = '';
      for (var b = 1; b <= 9; b++) {
        h += '<button type="button" class="grow" data-b="' + b + '"><span class="gl">' + this.dan + ' × ' + b + '</span><span class="gr">= ' + (this.dan * b) + '</span></button>';
      }
      $('#gRows').innerHTML = h;
    },
    sayTable: function () { speak(t('gTag', { n: this.dan }) + '. ' + t('gSay', { a: this.dan, b: 1, c: this.dan })); },
    setSingBtn: function () {
      var b = $('#singBtn'); if (!b) return;
      b.setAttribute('aria-pressed', this.singing ? 'true' : 'false');
      b.innerHTML = this.singing
        ? '⏹ <span>' + esc(t('stopSing')) + '</span>'
        : '🎵 <span>' + esc(t('sing')) + '</span>';
    },
    sing: function () {
      if (this.singing) { this.stopSong(); return; }
      if (!set.sound) setSound(true);
      ensureAudio();
      var self = this, dan = this.dan;
      var rows = $$('#gRows .grow');
      if (!rows.length) return;
      this.singing = true; this.setSingBtn();
      var notes = [[523, 659], [587, 698], [659, 784], [698, 880], [784, 988], [880, 1047], [698, 880], [587, 698], [523, 659]];
      rows.forEach(function (row, k) {
        self.songTimers.push(setTimeout(function () {
          rows.forEach(function (r) { r.classList.remove('on'); });
          row.classList.add('on');
          var n = notes[k] || notes[0];
          tone(n[0], 0, 0.24, 'triangle', 0.09);
          tone(n[1], 0.16, 0.24, 'triangle', 0.07);
          if (k % 3 === 0) tone(n[0] / 2, 0, 0.34, 'sine', 0.05);
          speak(t('gSay', { a: dan, b: k + 1, c: dan * (k + 1) }));
        }, k * 980));
      });
      this.songTimers.push(setTimeout(function () { self.stopSong(); }, rows.length * 980 + 260));
    },
    stopSong: function () {
      this.songTimers.forEach(function (x) { clearTimeout(x); });
      this.songTimers = [];
      this.singing = false;
      $$('#gRows .grow').forEach(function (r) { r.classList.remove('on'); });
      this.setSingBtn();
      stopSpeak();
    },
    newQuiz: function () {
      this.cancel();
      var used = {}, list = [];
      for (var k = 0; k < 5; k++) {
        var b, tries = 0;
        do { b = ri(1, 9); tries++; } while (used[b] && tries < 50);
        used[b] = 1; list.push({ a: this.dan, b: b, ans: this.dan * b });
      }
      this.list = list; this.i = 0; this.score = 0; this.stars = 0; this.res = [];
      this.picked = -1; this.correctIdx = -1; this.lock = false;
      this.renderQuiz();
    },
    renderQuiz: function () {
      var q = this.list[this.i]; if (!q) return;
      $('#gdProg').textContent = (this.i + 1) + ' / ' + this.list.length;
      setDots($('#gdDots'), this.list, this.res, this.i);
      $('#gdTag').textContent = t('gTag', { n: q.a });
      $('#gdQ').innerHTML = q.a + ' × ' + q.b + ' = <b>?</b>';
      var opts = [q.ans], seen = {}; seen[q.ans] = 1;
      var cand = [q.ans + q.a, q.ans - q.a, q.ans + q.b, q.ans - q.b, q.ans + 1, q.ans - 1,
        q.ans + 10, q.ans - 10, (q.a + 1) * q.b, (q.a - 1) * q.b];
      shuffle(cand);
      for (var k = 0; k < cand.length && opts.length < 4; k++) {
        var v = cand[k];
        if (v > 0 && !seen[v]) { seen[v] = 1; opts.push(v); }
      }
      while (opts.length < 4) {
        var v2 = ri(2, 81);
        if (!seen[v2]) { seen[v2] = 1; opts.push(v2); }
      }
      this.opts = shuffle(opts);
      this.correctIdx = this.opts.indexOf(q.ans);
      this.picked = -1;
      drawOpts($('#gdOpts'), this.opts.map(String), -1, -1);
      fbHide($('#gdFb'));
    },
    pick: function (k) {
      if (this.lock) return;
      var q = this.list[this.i]; if (!q) return;
      var v = this.opts[k];
      ensureAudio();
      this.picked = k;
      if (v === q.ans) {
        this.lock = true; this.res[this.i] = 'ok'; this.score++; this.stars++;
        drawOpts($('#gdOpts'), this.opts.map(String), k, this.correctIdx);
        awardStar('gugudan');
        sfx('great'); praise(praiseWord());
        fbShow($('#gdFb'), 'good', t('correctFb'));
        setDots($('#gdDots'), this.list, this.res, this.i);
        var self = this;
        this.timer = setTimeout(function () { self.next(); }, 1050);
      } else {
        this.lock = true; this.res[this.i] = 'no';
        drawOpts($('#gdOpts'), this.opts.map(String), k, this.correctIdx);
        sfx('soft');
        fbShow($('#gdFb'), 'bad', t('answerIs', { a: q.ans }));
        setDots($('#gdDots'), this.list, this.res, this.i);
        var self2 = this;
        this.timer = setTimeout(function () { self2.next(); }, 1700);
      }
    },
    next: function () {
      this.cancel();
      this.i++;
      if (this.i >= this.list.length) { finishGame('gugudan', this.score, this.list.length, this.stars); return; }
      this.lock = false;
      this.renderQuiz();
    },
    say: function () {
      var q = this.list[this.i]; if (!q) return;
      speak(t('sayGq', { a: q.a, b: q.b }));
    },
    redraw: function () {
      this.renderDans();
      if (this.tab === 'table') { this.renderTable(); this.setSingBtn(); }
      else if (this.list.length) {
        this.renderTable(); // 단 이름 등은 그대로 두고
        var q = this.list[this.i];
        if (q) {
          $('#gdTag').textContent = t('gTag', { n: q.a });
          $('#gdQ').innerHTML = q.a + ' × ' + q.b + ' = <b>?</b>';
          drawOpts($('#gdOpts'), this.opts.map(String), this.picked, this.correctIdx);
          if (!this.lock) fbHide($('#gdFb'));
        }
      }
    }
  };

  /* ═══════════ 3. 시계 ═══════════ */
  function clockSVG(h, m) {
    var ticks = '', nums = '', i;
    for (i = 0; i < 60; i++) {
      var ang = i * 6 * Math.PI / 180, big = (i % 5 === 0);
      var r1 = big ? 77 : 82.5, r2 = 87;
      ticks += '<line x1="' + (100 + Math.sin(ang) * r1).toFixed(1) + '" y1="' + (100 - Math.cos(ang) * r1).toFixed(1) +
        '" x2="' + (100 + Math.sin(ang) * r2).toFixed(1) + '" y2="' + (100 - Math.cos(ang) * r2).toFixed(1) +
        '" stroke="' + (big ? '#7EA8D8' : '#D5E5F5') + '" stroke-width="' + (big ? 2.4 : 1.2) + '" stroke-linecap="round"/>';
    }
    for (i = 1; i <= 12; i++) {
      var a = (i * 30 - 90) * Math.PI / 180;
      nums += '<text x="' + (100 + Math.cos(a) * 65).toFixed(1) + '" y="' + (100 + Math.sin(a) * 65 + 5.6).toFixed(1) +
        '" text-anchor="middle" font-size="17" font-weight="900" fill="#2B4160" font-family="inherit">' + i + '</text>';
    }
    var hAng = (h % 12) * 30 + m * 0.5, mAng = m * 6;
    return '<svg viewBox="0 0 200 200" role="img" aria-label="' + esc(fmtTime(h, m)) + '">' +
      '<defs><radialGradient id="cf" cx="50%" cy="36%" r="72%">' +
      '<stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F0F8FF"/></radialGradient>' +
      '<linearGradient id="cr" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#9CCBF6"/><stop offset="1" stop-color="#5A9BE8"/></linearGradient></defs>' +
      '<circle cx="100" cy="100" r="95" fill="url(#cr)"/>' +
      '<circle cx="100" cy="100" r="87" fill="url(#cf)" stroke="#E4F0FB" stroke-width="2"/>' +
      ticks + nums +
      '<g transform="rotate(' + hAng + ' 100 100)"><line x1="100" y1="107" x2="100" y2="63" stroke="#2F7DE1" stroke-width="9" stroke-linecap="round"/></g>' +
      '<g transform="rotate(' + mAng + ' 100 100)"><line x1="100" y1="112" x2="100" y2="43" stroke="#FF6F91" stroke-width="5.5" stroke-linecap="round"/></g>' +
      '<circle cx="100" cy="100" r="7" fill="#2F7DE1"/><circle cx="100" cy="100" r="3" fill="#FFFFFF"/>' +
      '</svg>';
  }
  function genTime(lv) {
    var h = ri(1, 12);
    var m = lv === 'hour' ? 0 : (lv === 'half' ? rnd([0, 30]) : rnd([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]));
    return { h: h, m: m };
  }
  function timeChoices(h, m) {
    var out = [{ h: h, m: m }], seen = {};
    seen[h + ':' + m] = 1;
    var shift = (m === 0) ? 30 : (m === 30 ? -30 : (m < 30 ? 5 : -5));
    var cand = [
      { h: normH(h + 1), m: m }, { h: normH(h - 1), m: m },
      { h: h, m: normM(m + shift) }, { h: h, m: normM(m + 5) }, { h: h, m: normM(m - 5) },
      { h: normH(h + 1), m: normM(m + 5) }, { h: normH(h - 1), m: normM(m - 5) },
      { h: h, m: normM(m + 30) }, { h: normH(h + 2), m: m }, { h: normH(h - 1), m: normM(m + 30) }
    ];
    shuffle(cand);
    for (var i = 0; i < cand.length && out.length < 4; i++) {
      var k = cand[i].h + ':' + cand[i].m;
      if (seen[k]) continue;
      seen[k] = 1; out.push(cand[i]);
    }
    return shuffle(out);
  }

  var CLK = {
    lv: 'hour', list: [], i: 0, score: 0, stars: 0, res: [], lock: false,
    opts: [], picked: -1, correctIdx: -1, timer: null, q: null,
    cancel: function () { clearTimeout(this.timer); this.timer = null; },
    enter: function () { this.newRound(); },
    restart: function () { this.newRound(); },
    newRound: function () {
      this.cancel();
      var used = {}, list = [];
      for (var k = 0; k < 5; k++) {
        var q, key, tries = 0;
        do { q = genTime(this.lv); key = q.h + ':' + q.m; tries++; } while (used[key] && tries < 80);
        used[key] = 1; list.push(q);
      }
      var allSame = true;
      for (var j = 1; j < list.length; j++) if (list[j].m !== list[0].m || list[j].h !== list[0].h) { allSame = false; break; }
      if (allSame) { list[0].h = normH(list[0].h + 3); list[0].m = normM(list[0].m + (this.lv === 'hour' ? 0 : 5)); }
      this.list = list; this.i = 0; this.score = 0; this.stars = 0; this.res = [];
      this.picked = -1; this.correctIdx = -1; this.lock = false;
      this.render();
    },
    render: function () {
      var q = this.q = this.list[this.i]; if (!q) return;
      $('#clkProg').textContent = (this.i + 1) + ' / ' + this.list.length;
      setDots($('#clkDots'), this.list, this.res, this.i);
      $('#clkArt').innerHTML = clockSVG(q.h, q.m);
      $('#clkDigital').textContent = '';
      $('#clkQText').textContent = t('clockQ');
      this.opts = timeChoices(q.h, q.m);
      this.correctIdx = -1;
      for (var k = 0; k < this.opts.length; k++) {
        if (this.opts[k].h === q.h && this.opts[k].m === q.m) { this.correctIdx = k; break; }
      }
      this.picked = -1;
      drawOpts($('#clkOpts'), this.opts.map(function (o) { return fmtTime(o.h, o.m); }), -1, -1);
      fbHide($('#clkFb'));
    },
    pick: function (k) {
      if (this.lock) return;
      var q = this.q, o = this.opts[k]; if (!q || !o) return;
      ensureAudio();
      this.picked = k;
      if (o.h === q.h && o.m === q.m) {
        this.lock = true; this.res[this.i] = 'ok'; this.score++; this.stars++;
        drawOpts($('#clkOpts'), this.opts.map(function (x) { return fmtTime(x.h, x.m); }), k, this.correctIdx);
        $('#clkDigital').textContent = fmtTime(q.h, q.m);
        awardStar('clock');
        sfx('great'); praise(praiseWord());
        fbShow($('#clkFb'), 'good', t('correctFb'));
        setDots($('#clkDots'), this.list, this.res, this.i);
        var self = this;
        this.timer = setTimeout(function () { self.next(); }, 1350);
      } else {
        this.lock = true; this.res[this.i] = 'no';
        drawOpts($('#clkOpts'), this.opts.map(function (x) { return fmtTime(x.h, x.m); }), k, this.correctIdx);
        $('#clkDigital').textContent = fmtTime(q.h, q.m);
        sfx('soft');
        fbShow($('#clkFb'), 'bad', t('timeIs', { a: fmtTime(q.h, q.m) }));
        setDots($('#clkDots'), this.list, this.res, this.i);
        var self2 = this;
        this.timer = setTimeout(function () { self2.next(); }, 2000);
      }
    },
    next: function () {
      this.cancel();
      this.i++;
      if (this.i >= this.list.length) { finishGame('clock', this.score, this.list.length, this.stars); return; }
      this.lock = false;
      this.render();
    },
    say: function () { speak(t('sayClock')); },
    redraw: function () {
      if (!this.list.length) return;
      $('#clkQText').textContent = t('clockQ');
      drawOpts($('#clkOpts'), this.opts.map(function (o) { return fmtTime(o.h, o.m); }),
        this.lock ? this.picked : -1, this.lock ? this.correctIdx : -1);
      if (this.lock) $('#clkDigital').textContent = fmtTime(this.q.h, this.q.m);
    }
  };

  /* ═══════════ 4. 동전·지폐 ═══════════ */
  function moneySVG(v) {
    if (v < 1000) {
      var gold = (v === 500);
      var deep = gold ? '#C88E10' : '#B7C7D8', face = gold ? '#FFE08A' : '#E9EFF6',
        ring = gold ? '#D9A21B' : '#9FB3C8', txt = gold ? '#7A5200' : '#3E5A78';
      return '<svg viewBox="0 0 100 100">' +
        '<circle cx="50" cy="50" r="46" fill="' + deep + '"/>' +
        '<circle cx="50" cy="50" r="41" fill="' + face + '" stroke="' + ring + '" stroke-width="2.5"/>' +
        '<circle cx="50" cy="50" r="33" fill="none" stroke="' + ring + '" stroke-width="2" opacity=".7"/>' +
        '<text x="50" y="53" text-anchor="middle" font-size="28" font-weight="900" fill="' + txt + '" font-family="inherit">' + v + '</text>' +
        '<text x="50" y="72" text-anchor="middle" font-size="13" font-weight="900" fill="' + txt + '" font-family="inherit" opacity=".8">원</text>' +
        '</svg>';
    }
    var col = (v === 1000) ? ['#CFE3F6', '#4E86BD', '#1F4E7A']
      : (v === 5000) ? ['#FFE0C7', '#C9743A', '#7A3C12']
        : ['#DFF3D9', '#5A9B4E', '#2F5F28'];
    return '<svg viewBox="0 0 120 64">' +
      '<rect x="1.5" y="1.5" width="117" height="61" rx="7" fill="' + col[0] + '" stroke="' + col[1] + '" stroke-width="3"/>' +
      '<rect x="8" y="8" width="104" height="48" rx="4" fill="none" stroke="' + col[1] + '" stroke-width="1.8" opacity=".5"/>' +
      '<circle cx="25" cy="32" r="11" fill="none" stroke="' + col[1] + '" stroke-width="2.4" opacity=".85"/>' +
      '<text x="71" y="35" text-anchor="middle" font-size="23" font-weight="900" fill="' + col[2] + '" font-family="inherit">' + v.toLocaleString('en-US') + '</text>' +
      '<text x="71" y="53" text-anchor="middle" font-size="12" font-weight="900" fill="' + col[2] + '" font-family="inherit" opacity=".8">원</text>' +
      '</svg>';
  }
  function genMoney(lv) {
    var den = (lv === 'coin') ? [100, 500] : (lv === 'bill') ? [100, 500, 1000] : [100, 500, 1000, 5000];
    var pool = shuffle(den.slice());
    var items = {};
    items[pool[0]] = 1 + Math.floor(Math.random() * 3);
    items[pool[1]] = 1 + Math.floor(Math.random() * 2);
    if (pool[2] != null && Math.random() < 0.75) items[pool[2]] = 1;
    else if (Math.random() < 0.4) items[pool[1]] = (items[pool[1]] || 0) + 1;
    var arr = Object.keys(items).map(function (k) { return { v: +k, c: items[k] }; })
      .sort(function (a, b) { return b.v - a.v; });
    var total = arr.reduce(function (s, it) { return s + it.v * it.c; }, 0);
    return { items: arr, total: total };
  }
  function moneyChoices(total) {
    var step = total >= 5000 ? 1000 : (total >= 1000 ? 500 : 100);
    var out = [total], seen = {}; seen[total] = 1;
    var cand = [total + step, total - step, total + step * 2, total - step * 2,
      total + 100, total - 100, total + 500, total - 500, total + 1000];
    shuffle(cand);
    for (var i = 0; i < cand.length && out.length < 4; i++) {
      var v = cand[i];
      if (v > 0 && !seen[v]) { seen[v] = 1; out.push(v); }
    }
    return shuffle(out);
  }

  var MON = {
    lv: 'coin', list: [], i: 0, score: 0, stars: 0, res: [], lock: false,
    opts: [], picked: -1, correctIdx: -1, timer: null, q: null,
    cancel: function () { clearTimeout(this.timer); this.timer = null; },
    enter: function () { this.newRound(); },
    restart: function () { this.newRound(); },
    newRound: function () {
      this.cancel();
      var used = {}, list = [];
      for (var k = 0; k < 5; k++) {
        var q, key, tries = 0;
        do { q = genMoney(this.lv); key = q.items.map(function (it) { return it.v + 'x' + it.c; }).join('+'); tries++; }
        while (used[key] && tries < 60);
        used[key] = 1; list.push(q);
      }
      this.list = list; this.i = 0; this.score = 0; this.stars = 0; this.res = [];
      this.picked = -1; this.correctIdx = -1; this.lock = false;
      this.render();
    },
    render: function () {
      var q = this.q = this.list[this.i]; if (!q) return;
      $('#monProg').textContent = (this.i + 1) + ' / ' + this.list.length;
      setDots($('#monDots'), this.list, this.res, this.i);
      var h = '';
      q.items.forEach(function (it) {
        var cls = (it.v >= 1000) ? 'mbill' : 'mcoin';
        h += '<div class="mitem ' + cls + '">' + moneySVG(it.v) + '<span class="mc">× ' + it.c + '</span></div>';
      });
      $('#monArt').innerHTML = h;
      $('#monQText').textContent = t('moneyQ');
      this.opts = moneyChoices(q.total);
      this.correctIdx = this.opts.indexOf(q.total);
      this.picked = -1;
      drawOpts($('#monOpts'), this.opts.map(fmtWon), -1, -1);
      fbHide($('#monFb'));
    },
    pick: function (k) {
      if (this.lock) return;
      var q = this.q; if (!q || this.opts[k] == null) return;
      ensureAudio();
      this.picked = k;
      var labels = this.opts.map(fmtWon);
      if (this.opts[k] === q.total) {
        this.lock = true; this.res[this.i] = 'ok'; this.score++; this.stars++;
        drawOpts($('#monOpts'), labels, k, this.correctIdx);
        awardStar('money');
        sfx('great'); praise(praiseWord());
        fbShow($('#monFb'), 'good', t('correctFb'));
        setDots($('#monDots'), this.list, this.res, this.i);
        var self = this;
        this.timer = setTimeout(function () { self.next(); }, 1150);
      } else {
        this.lock = true; this.res[this.i] = 'no';
        drawOpts($('#monOpts'), labels, k, this.correctIdx);
        sfx('soft');
        fbShow($('#monFb'), 'bad', t('moneyIs', { a: fmtWon(q.total) }));
        setDots($('#monDots'), this.list, this.res, this.i);
        var self2 = this;
        this.timer = setTimeout(function () { self2.next(); }, 2000);
      }
    },
    next: function () {
      this.cancel();
      this.i++;
      if (this.i >= this.list.length) { finishGame('money', this.score, this.list.length, this.stars); return; }
      this.lock = false;
      this.render();
    },
    say: function () { speak(t('sayMoney')); },
    redraw: function () {
      if (!this.list.length) return;
      $('#monQText').textContent = t('moneyQ');
      var labels = this.opts.map(fmtWon);
      drawOpts($('#monOpts'), labels, this.lock ? this.picked : -1, this.lock ? this.correctIdx : -1);
    }
  };

  /* ═══════════ 놀이 끝 덮개 ═══════════ */
  var doneOpen = false, doneOnAgain = null;
  function hideDone() { doneOpen = false; doneOnAgain = null; $('#doneWrap').hidden = true; }
  function openDone() {
    doneOpen = true;
    $('#doneWrap').hidden = false;
    pushLayer(hideDone);
    try { $('#doneAgain').focus({ preventScroll: true }); } catch (e) {}
  }
  function finishGame(game, score, total, stars) {
    var ratio = total ? (score / total) : 0;
    $('#doneEmoji').textContent = ratio === 1 ? '🏆' : (ratio >= 0.6 ? '🎉' : '🌈');
    $('#doneTitle').textContent = ratio === 1 ? t('donePerfect') : t('doneTitle');
    $('#doneScore').textContent = t('doneScore', { s: score, n: total });
    $('#doneText').textContent = (stars > 0 ? t('doneStar', { n: stars }) + ' ' : '') +
      (ratio === 1 ? t('doneHigh') : (ratio >= 0.6 ? t('doneMid') : t('doneLow')));
    doneOnAgain = function () {
      var g = ({ calc: CALC, gugudan: GD, clock: CLK, money: MON })[game];
      if (g && g.restart) g.restart();
    };
    openDone();
    sfx(ratio === 1 ? 'great' : 'good');
  }
  function leaveDone(action) {
    if (!doneOpen) {
      if (action === 'home') goHome();
      return;
    }
    doneOpen = false;
    $('#doneWrap').hidden = true;
    var cb = doneOnAgain;
    doneOnAgain = null;
    if (layers.length) { try { history.back(); } catch (e) {} }
    setTimeout(function () {
      if (action === 'again' && cb) cb();
      else if (action === 'home') goHome();
    }, 230);
  }

  /* ═══════════ 설치·공유 ═══════════ */
  var instPrompt = null, instDone = false, instOpen = false;
  function uaIsIOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent); }
  function uaIsSamsung() { return /SamsungBrowser/.test(navigator.userAgent); }
  function uaIsAndroid() { return /Android/.test(navigator.userAgent); }
  function isStandaloneNow() {
    try {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
      if (navigator.standalone) return true;
    } catch (e) {}
    return false;
  }
  function instStepsHTML() {
    if (lang === 'en') {
      if (uaIsIOS()) return '<ol><li>Tap <b>Share ⤴</b> at the bottom.</li><li>Tap <b>Add to Home Screen</b>.</li><li>Tap <b>Add</b>.</li></ol>';
      if (uaIsAndroid()) return '<ol><li>Tap <b>⋮</b> at the top right of Chrome.</li><li>Tap <b>Add to Home screen</b>.</li><li>Tap <b>Add</b>.</li></ol>';
      return '<ol><li>Open this page in Chrome or Safari.</li><li>Tap the menu and <b>Add to Home screen</b>.</li></ol>';
    }
    if (uaIsIOS()) return '<ol><li>아래 <b>공유 ⤴</b>를 누릅니다.</li><li><b>홈 화면에 추가</b>를 누릅니다.</li><li><b>추가</b>를 누릅니다.</li></ol>';
    if (uaIsSamsung()) return '<ol><li>삼성 인터넷이면 아래 <b>≡</b>를 누릅니다.</li><li><b>홈 화면에 추가</b>를 누릅니다.</li><li><b>추가</b>를 누릅니다.</li></ol>';
    if (uaIsAndroid()) return '<ol><li>크롬 오른쪽 위 <b>⋮</b>를 누릅니다.</li><li><b>홈 화면에 추가</b>를 누릅니다.</li><li><b>추가</b>를 누릅니다.</li></ol>';
    return '<ol><li>휴대폰 브라우저의 메뉴를 엽니다.</li><li><b>홈 화면에 추가</b>를 누릅니다.</li><li><b>추가</b>를 누릅니다.</li></ol>';
  }
  function instTipHTML() {
    if (lang === 'en') return 'Install adds an icon to your home screen. It works offline and needs no account.';
    if (uaIsIOS()) return '사파리 기준이에요. 크롬으로 열었다면 오른쪽 위 <b>⋮</b> → <b>홈 화면에 추가</b>를 눌러 주세요.';
    if (uaIsSamsung()) return '삼성 인터넷 메뉴 ≡ 는 화면 <b>아래 가운데</b>에 있어요.';
    if (uaIsAndroid()) return '삼성 인터넷은 <b>≡</b> → 홈 화면에 추가, 아이폰은 <b>공유 ⤴</b> → 홈 화면에 추가예요.';
    return '휴대폰 크롬은 <b>⋮ → 홈 화면에 추가</b>, 아이폰 사파리는 <b>공유 ⤴ → 홈 화면에 추가</b>예요.';
  }
  function hideInstall() { $('#instWrap').hidden = true; instOpen = false; }
  function closeInstall() {
    if (!instOpen) return;
    instOpen = false;
    $('#instWrap').hidden = true;
    if (layers.length) { try { history.back(); } catch (e) {} }
  }
  function openInstall() {
    $('#instSteps').innerHTML = instStepsHTML();
    $('#instTip').innerHTML = instTipHTML();
    $('#instWrap').hidden = false;
    instOpen = true;
    pushLayer(hideInstall);
    try { $('#instOk').focus({ preventScroll: true }); } catch (e) {}
  }
  function installTap() {
    if (isStandaloneNow()) { toast(t('alreadyApp')); return; }
    if (instPrompt) {
      var dp = instPrompt; instPrompt = null;
      try {
        dp.prompt();
        if (dp.userChoice && dp.userChoice.then) {
          dp.userChoice.then(function (r) {
            if (r && r.outcome === 'accepted') { instDone = true; toast(t('installed')); }
          }, function () {});
        }
        return;
      } catch (e) {}
    }
    openInstall();
  }
  function copyUrl(url) {
    try {
      navigator.clipboard.writeText(url).then(function () { toast(t('copied')); }, function () { toast(t('copyFail')); });
    } catch (e) { toast(t('copyFail')); }
  }
  function shareApp() {
    var url = location.href;
    var data = { title: t('shareTitle'), text: t('shareText'), url: url };
    if (navigator.share) {
      try {
        navigator.share(data).catch(function (e) {
          if (e && e.name === 'AbortError') return;
          copyUrl(url);
        });
        return;
      } catch (e) {}
    }
    copyUrl(url);
  }

  /* ═══════════ 언어 ═══════════ */
  function applyLang() {
    document.documentElement.lang = lang;
    document.title = t('appName') + ' · ' + t('docTitle');
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    renderHome(); syncToggles();
    CALC.redraw(); GD.redraw(); CLK.redraw(); MON.redraw();
  }

  /* ═══════════ 이벤트 묶기 ═══════════ */
  function bind() {
    $('#langBtn').addEventListener('click', function () {
      lang = (lang === 'ko') ? 'en' : 'ko';
      saveSet(); GD.stopSong(); stopSpeak(); applyLang();
    });
    $('#installTop').addEventListener('click', installTap);
    $('#shareTop').addEventListener('click', shareApp);
    $('#instOk').addEventListener('click', closeInstall);
    $('#instWrap').addEventListener('click', function (e) { if (e.target === $('#instWrap')) closeInstall(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (!$('#instWrap').hidden) closeInstall();
        else if (doneOpen) leaveDone(null);
        else if (curScreen !== 'home') goBack();
      }
    });

    $('#soundBtn').addEventListener('click', function () {
      setSound(!set.sound);
      if (set.sound) { ensureAudio(); speak(t('helloTitle')); }
    });
    $('#hintBtn').addEventListener('click', function () { setHint(!set.hint); });
    $('#calcHintBtn').addEventListener('click', function () {
      setHint(!set.hint);
      if (set.hint) sfx('tap');
    });
    $$('[data-tts]').forEach(function (b) {
      b.addEventListener('click', function () {
        setSound(!set.sound);
        if (set.sound) { ensureAudio(); speakCurrent(); }
      });
    });

    $('#menu').addEventListener('click', function (e) {
      var b = e.target.closest('[data-open]');
      if (!b) return;
      openGame(b.getAttribute('data-open'));
    });

    $('#calcLv').addEventListener('click', function (e) {
      var b = e.target.closest('[data-lv]');
      if (!b) return;
      CALC.lv = b.getAttribute('data-lv');
      $$('#calcLv .chip[data-lv]').forEach(function (x) {
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      CALC.newRound();
    });
    $('#calcPad').addEventListener('click', function (e) {
      var b = e.target.closest('[data-k]');
      if (b) CALC.key(b.getAttribute('data-k'));
    });
    $('#calcRead').addEventListener('click', function () { ensureAudio(); CALC.say(); });

    $('#dans').addEventListener('click', function (e) {
      var b = e.target.closest('[data-dan]');
      if (!b) return;
      GD.dan = parseInt(b.getAttribute('data-dan'), 10);
      GD.stopSong();
      GD.renderDans();
      GD.renderTable();
      if (GD.tab === 'quiz') GD.newQuiz();
      sfx('tap');
      if (set.sound) setTimeout(function () { speak(t('gTag', { n: GD.dan })); }, 120);
    });
    $('#gdTabs').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tab]');
      if (!b) return;
      GD.showTab(b.getAttribute('data-tab'));
      sfx('tap');
    });
    $('#singBtn').addEventListener('click', function () { GD.sing(); });
    $('#gRows').addEventListener('click', function (e) {
      var b = e.target.closest('[data-b]');
      if (!b) return;
      ensureAudio();
      if (GD.singing) GD.stopSong();
      var n = parseInt(b.getAttribute('data-b'), 10);
      speak(t('gSay', { a: GD.dan, b: n, c: GD.dan * n }));
    });
    $('#gdOpts').addEventListener('click', function (e) {
      var b = e.target.closest('[data-k]');
      if (b) GD.pick(parseInt(b.getAttribute('data-k'), 10));
    });
    $('#gdRead').addEventListener('click', function () { ensureAudio(); GD.say(); });

    $('#clkLv').addEventListener('click', function (e) {
      var b = e.target.closest('[data-lv]');
      if (!b) return;
      CLK.lv = b.getAttribute('data-lv');
      $$('#clkLv .chip').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      CLK.newRound();
    });
    $('#clkOpts').addEventListener('click', function (e) {
      var b = e.target.closest('[data-k]');
      if (b) CLK.pick(parseInt(b.getAttribute('data-k'), 10));
    });
    $('#clkQText').addEventListener('click', function () { ensureAudio(); CLK.say(); });

    $('#monLv').addEventListener('click', function (e) {
      var b = e.target.closest('[data-lv]');
      if (!b) return;
      MON.lv = b.getAttribute('data-lv');
      $$('#monLv .chip').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      MON.newRound();
    });
    $('#monOpts').addEventListener('click', function (e) {
      var b = e.target.closest('[data-k]');
      if (b) MON.pick(parseInt(b.getAttribute('data-k'), 10));
    });
    $('#monQText').addEventListener('click', function () { ensureAudio(); MON.say(); });

    $('#doneAgain').addEventListener('click', function () { leaveDone('again'); });
    $('#doneHome').addEventListener('click', function () { leaveDone('home'); });

    document.addEventListener('click', function (e) {
      var b = e.target.closest('[data-back]');
      if (b) goBack();
    });

    window.addEventListener('beforeinstallprompt', function (e) {
      try { e.preventDefault(); } catch (err) {}
      instPrompt = e;
    });
    window.addEventListener('appinstalled', function () {
      instDone = true; instPrompt = null; toast(t('installed'));
    });
  }

  /* ═══════════ 시작 ═══════════ */
  function init() {
    loadSet();
    loadStars();
    bind();
    applyLang();
    renderHome();
    try { history.replaceState({ sansu: 0 }, ''); } catch (e) {}
    if ('serviceWorker' in navigator) {
      try { navigator.serviceWorker.register('./sw.js').catch(function () {}); } catch (e) {}
    }
  }

  window.__sansu = {
    CALC: CALC, GD: GD, CLK: CLK, MON: MON,
    openGame: openGame, goBack: goBack, renderHome: renderHome,
    get set() { return set; }, get stars() { return STARS; }, get lang() { return lang; }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
