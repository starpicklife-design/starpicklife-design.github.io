/* ═══════════════════════════════════════════════════════════════
   와글링 두뇌놀이 (Wagling Brain Play) v1 — app.js
   · 0원 정적 웹앱 · 서버/DB/외부 API 없음 · 기록은 localStorage 에만
   · 놀이 4가지: 그림 짝맞추기 / 속담·낱말 / 장보기·계산 / 한지 붓글씨
   · 음성 읽어주기(ko-KR TTS) + 효과음 토글 · 오늘의 도장 · 폰 뒤로가기
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─────────── 도움 함수 ─────────── */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var KEY_SET = 'brain.settings.v1';
  var KEY_STAMP = 'brain.stamps.v1';
  var DAY = 86400000;
  var WD = ['일', '월', '화', '수', '목', '금', '토'];
  var WD_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  function nowMs() { return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function keyOf(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function todayKey() { return keyOf(new Date()); }
  function won(n) {
    return lang === 'ko' ? (Number(n).toLocaleString('ko-KR') + '원') : ('₩' + Number(n).toLocaleString('en-US'));
  }

  /* ─────────── 말 (한/EN) ─────────── */
  var I18N = {
    ko: {
      appName: '와글링 두뇌놀이', sub: '매일 5분, 머리가 맑아지는 놀이',
      install: '설치', share: '공유', back: '뒤로',
      helloMsg: '오늘도 머리를 즐겁게 깨워 볼까요?',
      helloSmall: '놀이 하나에 3~5분이면 넉넉해요.',
      g1: '그림 짝맞추기', g1s: '같은 그림 두 장을 찾아요',
      g2: '속담·낱말 이어맞추기', g2s: '익숙한 속담과 사계절 낱말',
      g3: '장보기·거스름돈 계산', g3s: '시장에서 쓰는 생활 셈',
      g4: '한지 붓글씨', g4s: '복·건강·사랑을 따라 써요',
      g5: '큰 그림 색칠하기', g5s: '꽃·나비를 알록달록',
      g6: '숨은그림찾기', g6s: '그림 속 물건을 찾아요',
      colorTitle: '🎨 큰 그림 색칠하기', findTitle: '🔍 숨은그림찾기',
      undoOne: '한 번', hintOne: '힌트', otherPic: '다른 그림',
      colorHint: '색을 고르고 그림을 톡 누르면 그 부분이 칠해져요. 손가락으로 문질러도 색칠돼요.',
      findHint: '찾을 물건을 먼저 보고, 그림 속에서 같은 물건을 손가락으로 톡 눌러 보세요.',
      colorSay: '색을 골라 그림을 톡 눌러 보세요.',
      colorSaved: '그림을 저장했어요. 오늘 도장 하나 더!',
      colorEmpty: '먼저 색을 칠해 보세요.',
      findSay: '그림 속에 숨은 물건을 찾아보세요.',
      findStart: '숨은 물건 {n}개를 찾아보세요.',
      foundOne: '{n}을 찾았어요!',
      notHere: '여기는 아니에요. 천천히 둘러보세요.',
      hintSay: '{n}을 찾아보세요. 반짝이는 곳을 보세요.',
      findDone: '모두 찾으셨어요!',
      findDoneText: '숨은 물건 {n}개를 다 찾으셨어요.',
      openColor: '색칠 놀이예요. 색을 골라 그림을 눌러 보세요.',
      openHidden: '숨은그림찾기예요. 그림 속 물건을 찾아보세요.',
      plays: '오늘 {n}판',
      stampTitle: '🧠 오늘의 두뇌 체조 도장', stampMini: '이번 주',
      stampNone: '오늘은 아직이에요. 놀이 하나만 해 볼까요?',
      stampSome: '오늘 도장 {n}개를 모았어요. 참 잘하셨어요!',
      setTitle: '⚙️ 어르신 설정', soundLabel: '소리로 읽어주기', bigLabel: '글씨 크게',
      on: '켜짐', off: '꺼짐',
      setHint: '소리를 켜면 문제와 그림 이름을 또박또박 읽어 드려요. 적은 기록은 이 기기에만 남고, 어디로도 보내지 않아요.',
      ver: '와글링 두뇌놀이 v1 · 무료 · 광고 없음',
      matchTitle: '🃏 그림 짝맞추기', lvEasy: '쉬움', lvNormal: '보통', lvHard: '도전',
      tapCard: '카드를 눌러 보세요', restart: '다시 섞기', pairs: '{a} / {b} 짝',
      foundMsg: '{n}을 찾았어요!', cardBack: '뒤집힌 카드',
      quizTitle: '💬 속담·낱말 이어맞추기', calcTitle: '🧮 장보기·거스름돈 계산',
      catProverb: '속담', catSeason: '사계절·낱말', catShop: '장보기', catChange: '거스름돈',
      nextQ: '다음 문제', lastQ: '결과 보기 🎉', readAgain: '다시 듣기',
      correct: '정답이에요! 참 잘하셨어요 👏',
      wrong: '아깝네요. 정답은 ‘{a}’이에요.',
      scoreLine: '{n}문제 중 {s}문제를 맞히셨어요.',
      scoreHigh: '백 점이에요! 정말 대단하세요 🏆',
      scoreMid: '아주 잘하셨어요. 한 번 더 해 볼까요?',
      scoreLow: '괜찮아요. 천천히 다시 해 보면 더 잘하실 거예요.',
      doneSay: '참 잘하셨어요!', doneMatch: '모두 맞추셨어요!',
      again: '한 번 더', otherPlay: '다른 놀이', goHome: '첫 화면',
      stampOne: '도장 하나 더!',
      brushTitle: '🖌️ 한지 붓글씨', brushSize: '붓 굵기', inkColor: '먹 색',
      wThin: '가는', wNormal: '보통', wThick: '굵은',
      cBlack: '먹', cBlue: '청묵', cRed: '홍묵', cBrown: '황토',
      undo: '한 획', clear: '지우기', saveArt: '작품 저장',
      brushHint: '손가락이나 터치펜으로 한지 위에 써 보세요. 천천히 쓰면 획이 굵고, 빠르게 쓰면 가늘어져요.',
      brushEmpty: '먼저 한 획 써 보세요.', brushSaved: '작품을 저장했어요. 오늘 도장 하나 더!',
      saveFail: '저장하지 못했어요. 다시 눌러 주세요.',
      gBok: '복', gHealth: '건강', gLove: '사랑', gHyo: '효도', gGana: '가나다', gFree: '빈 종이',
      sayBok: '복. 복을 따라 써 보세요.', sayHealth: '건강. 건강하게 오래 사세요.',
      sayLove: '사랑. 사랑을 따라 써 보세요.', sayHyo: '효도. 효도는 아름다운 마음이에요.',
      sayGana: '가 나 다. 천천히 써 보세요.', sayFree: '빈 종이예요. 마음껏 써 보세요.',
      openMatch: '그림 짝맞추기예요. 같은 그림 두 장을 찾아보세요.',
      openQuiz: '속담과 낱말 놀이예요. 알맞은 말을 골라 보세요.',
      openCalc: '장보기 계산 놀이예요. 천천히 셈해 보세요.',
      openBrush: '한지 붓글씨예요. 손가락으로 천천히 써 보세요.',
      installTitle: '📲 홈 화면에 두뇌놀이 두기',
      installLead: '한 번만 담아 두면 다음부터 앱처럼 바로 열려요. 인터넷이 없어도 열려요.',
      instOk: '알겠어요', copied: '주소를 복사했어요. 카톡·문자에 붙여 넣어 보세요.',
      copyFail: '주소창의 주소를 복사해 주세요.', installed: '홈 화면에 넣었어요!',
      alreadyApp: '이미 홈 화면 앱으로 열려 있어요.',
      shareTitle: '와글링 두뇌놀이', shareText: '그림 짝맞추기·속담·생활 계산·한지 붓글씨까지, 어르신 무료 두뇌 놀이'
    },
    en: {
      appName: 'Wagling Brain Play', sub: 'Five minutes a day to clear the mind',
      install: 'Install', share: 'Share', back: 'Back',
      helloMsg: 'Shall we wake up the brain happily today?',
      helloSmall: 'One game takes about 3 to 5 minutes.',
      g1: 'Picture Pairs', g1s: 'Find the two matching pictures',
      g2: 'Proverbs & Words', g2s: 'Familiar proverbs and seasonal words',
      g3: 'Market Math', g3s: 'Shopping totals and change',
      g4: 'Hanji Brush Writing', g4s: 'Trace 福, health, love and thanks',
      g5: 'Big Picture Coloring', g5s: 'Color flowers and butterflies',
      g6: 'Hidden Pictures', g6s: 'Find the things in the picture',
      colorTitle: '🎨 Big Picture Coloring', findTitle: '🔍 Hidden Pictures',
      undoOne: 'Undo', hintOne: 'Hint', otherPic: 'Another picture',
      colorHint: 'Pick a color and tap a part of the picture to fill it. You can also rub with your finger.',
      findHint: 'Look at the list first, then tap the same thing hidden in the picture.',
      colorSay: 'Pick a color and tap the picture.',
      colorSaved: 'Your picture is saved. One more stamp today!',
      colorEmpty: 'Color something first.',
      findSay: 'Find the things hidden in the picture.',
      findStart: 'Find {n} hidden things.',
      foundOne: 'You found the {n}!',
      notHere: 'Not here. Look around slowly.',
      hintSay: 'Look for the {n}. Watch for the blink.',
      findDone: 'You found them all!',
      findDoneText: 'You found all {n} hidden things.',
      openColor: 'Coloring. Pick a color and tap the picture.',
      openHidden: 'Hidden pictures. Find the things in the picture.',
      plays: '{n} today',
      stampTitle: '🧠 Today’s brain exercise stamps', stampMini: 'This week',
      stampNone: 'Nothing yet today. Shall we try one game?',
      stampSome: 'You collected {n} stamps today. Well done!',
      setTitle: '⚙️ Comfort settings', soundLabel: 'Read aloud', bigLabel: 'Larger text',
      on: 'On', off: 'Off',
      setHint: 'With sound on, the app reads questions and picture names slowly. Records stay only on this device.',
      ver: 'Wagling Brain Play v1 · Free · No ads',
      matchTitle: '🃏 Picture Pairs', lvEasy: 'Easy', lvNormal: 'Normal', lvHard: 'Challenge',
      tapCard: 'Tap a card to begin', restart: 'Shuffle again', pairs: '{a} / {b} pairs',
      foundMsg: 'You found {n}!', cardBack: 'Face-down card',
      quizTitle: '💬 Proverbs & Words', calcTitle: '🧮 Market Math',
      catProverb: 'Proverbs', catSeason: 'Seasons', catShop: 'Shopping', catChange: 'Change',
      nextQ: 'Next question', lastQ: 'See result 🎉', readAgain: 'Read again',
      correct: 'That is right! Well done 👏',
      wrong: 'So close. The answer is “{a}”.',
      scoreLine: 'You got {s} of {n} right.',
      scoreHigh: 'A perfect score! Wonderful 🏆',
      scoreMid: 'Very good. Shall we try once more?',
      scoreLow: 'That is all right. Take your time and try again.',
      doneSay: 'Well done!', doneMatch: 'You matched them all!',
      again: 'Once more', otherPlay: 'Other game', goHome: 'Home',
      stampOne: 'One more stamp!',
      brushTitle: '🖌️ Hanji Brush Writing', brushSize: 'Brush', inkColor: 'Ink',
      wThin: 'Thin', wNormal: 'Normal', wThick: 'Thick',
      cBlack: 'Black', cBlue: 'Blue', cRed: 'Red', cBrown: 'Ochre',
      undo: 'Undo', clear: 'Clear', saveArt: 'Save work',
      brushHint: 'Write on the hanji with a finger or a stylus. Slow strokes are thick, fast strokes are thin.',
      brushEmpty: 'Write one stroke first.', brushSaved: 'Your work is saved. One more stamp today!',
      saveFail: 'Could not save. Please tap again.',
      gBok: '福', gHealth: 'Health', gLove: 'Love', gHyo: 'Thanks', gGana: 'ABC', gFree: 'Blank',
      sayBok: 'Bok. Trace the character for blessing.', sayHealth: 'Health. May you live long and well.',
      sayLove: 'Love. Trace the word for love.', sayHyo: 'Filial love. A beautiful heart.',
      sayGana: 'Ga, na, da. Write slowly.', sayFree: 'A blank sheet. Write freely.',
      openMatch: 'Picture pairs. Find the two matching pictures.',
      openQuiz: 'Proverbs and words. Choose the right word.',
      openCalc: 'Market math. Count slowly.',
      openBrush: 'Hanji brush writing. Write slowly with your finger.',
      installTitle: '📲 Add Brain Play to your home screen',
      installLead: 'Add it once and it opens like an app, even without internet.',
      instOk: 'Got it', copied: 'Link copied. Paste it into a message.',
      copyFail: 'Please copy the address from the address bar.', installed: 'Added to your home screen!',
      alreadyApp: 'You are already using the home screen app.',
      shareTitle: 'Wagling Brain Play', shareText: 'Free brain games for elders: pairs, proverbs, market math and hanji brush writing'
    }
  };
  var lang = 'ko';
  function t(k, v) {
    var s = (I18N[lang] && I18N[lang][k]) || I18N.ko[k] || '';
    if (v) { Object.keys(v).forEach(function (key) { s = s.split('{' + key + '}').join(String(v[key])); }); }
    return s;
  }

  var PRAISE = {
    ko: ['참 잘하셨어요!', '아이고 똑똑하시네요!', '딱 맞았어요!', '기억력이 참 좋으세요!'],
    en: ['Well done!', 'How clever!', 'That is right!', 'Great memory!']
  };

  /* ─────────── 설정·도장 (localStorage) ─────────── */
  var set = { lang: 'ko', sound: true, big: false, guide: 'bok', brushW: 'normal', ink: 'black' };
  function loadSet() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY_SET) || '{}');
      if (raw && typeof raw === 'object') {
        if (raw.lang === 'en' || raw.lang === 'ko') set.lang = raw.lang;
        if (typeof raw.sound === 'boolean') set.sound = raw.sound;
        if (typeof raw.big === 'boolean') set.big = raw.big;
        if (raw.guide) set.guide = raw.guide;
        if (raw.brushW) set.brushW = raw.brushW;
        if (raw.ink) set.ink = raw.ink;
      }
    } catch (e) {}
    lang = set.lang;
  }
  function saveSet() {
    set.lang = lang;
    try { localStorage.setItem(KEY_SET, JSON.stringify(set)); } catch (e) {}
  }
  function loadStamps() {
    try { return JSON.parse(localStorage.getItem(KEY_STAMP) || '{}') || {}; } catch (e) { return {}; }
  }
  function addStamp(kind) {
    var s = loadStamps();
    var k = todayKey();
    s[k] = s[k] || {};
    s[k][kind] = (s[k][kind] || 0) + 1;
    s[k].total = (s[k].total || 0) + 1;
    try { localStorage.setItem(KEY_STAMP, JSON.stringify(s)); } catch (e) {}
    renderHome();
  }
  function stampOf(kind) {
    var s = loadStamps()[todayKey()];
    return s ? (s[kind] || 0) : 0;
  }
  function todayTotal() {
    var s = loadStamps()[todayKey()];
    return s ? (s.total || 0) : 0;
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
  function tone(freq, delay, dur, type, vol) {
    var c = ac(); if (!c) return;
    try {
      var o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.value = freq;
      o.connect(g); g.connect(c.destination);
      var t0 = c.currentTime + delay;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(vol || 0.14, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
      o.start(t0); o.stop(t0 + dur + 0.05);
    } catch (e) {}
  }
  function sfx(kind) {
    if (!set.sound) return;
    if (kind === 'good') { tone(659, 0, 0.18); tone(880, 0.09, 0.22); }
    else if (kind === 'great') { tone(523, 0, 0.16); tone(659, 0.1, 0.16); tone(784, 0.2, 0.16); tone(1047, 0.3, 0.3); }
    else if (kind === 'tap') { tone(420, 0, 0.05, 'triangle', 0.05); }
    else if (kind === 'soft') { tone(330, 0, 0.2, 'sine', 0.09); tone(262, 0.13, 0.24, 'sine', 0.08); }
  }

  /* ─────────── 🔊 한국어 읽어주기 (Web Speech) ───────────
     · 안드로이드는 getVoices()에 설치 안 된 음성까지 올라와 무음이 되므로 lang 만 넘긴다 */
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
      u.rate = lang === 'ko' ? 0.82 : 0.92;
      u.pitch = 1; u.volume = 1;
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

  /* ─────────── 배너·토스트 ─────────── */
  var praiseT = null;
  function praise(text) {
    var el = $('#praise');
    if (!el) return;
    el.textContent = text;
    el.classList.add('on');
    clearTimeout(praiseT);
    praiseT = setTimeout(function () { el.classList.remove('on'); }, 1500);
  }
  function hidePraise() {
    var el = $('#praise');
    if (el) el.classList.remove('on');
    clearTimeout(praiseT);
  }
  var toastT = null;
  function toast(text) {
    var el = $('#toast');
    if (!el) return;
    el.textContent = text;
    el.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { el.classList.remove('on'); }, 2400);
  }

  /* ─────────── 화면 이동 · 폰 뒤로가기 ─────────── */
  var layers = [];
  function pushLayer(close) {
    try { history.pushState({ brain: layers.length + 1 }, ''); } catch (e) { return; }
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
  function closeGame() {
    showScreen('home');
    renderHome();
    stopSpeak();
  }
  var INTRO = { match: 'openMatch', quiz: 'openQuiz', calc: 'openCalc', brush: 'openBrush', color: 'openColor', hidden: 'openHidden' };
  function openGame(name) {
    showScreen(name);
    if (name === 'match') { MATCH.start(MATCH.level); }
    else if (name === 'quiz') { QUIZ.quiz.start(); }
    else if (name === 'calc') { QUIZ.calc.start(); }
    else if (name === 'brush') { BRUSH.open(); }
    else if (name === 'color') { COLOR.open(); }
    else if (name === 'hidden') { HIDDEN.open(); }
    pushLayer(function () { closeGame(); });
    if (set.sound) setTimeout(function () { speak(t(INTRO[name])); }, 240);
  }

  /* ─────────── 칭찬 배너 문구 ─────────── */
  function praiseWord() { return rnd(PRAISE[lang] || PRAISE.ko); }

  /* ─────────── 첫 화면 ─────────── */
  function renderDate() {
    var d = new Date();
    var el = $('#dateLine');
    if (!el) return;
    if (lang === 'ko') el.textContent = (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + WD[d.getDay()] + '요일';
    else el.textContent = WD_EN[d.getDay()] + ', ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()] + ' ' + d.getDate();
  }
  function renderHome() {
    renderDate();
    var GAMES = ['match', 'quiz', 'calc', 'brush', 'color', 'hidden'];
    GAMES.forEach(function (k, i) {
      var el = $('#d' + k.charAt(0).toUpperCase() + k.slice(1));
      if (el) el.innerHTML = esc(t('g' + (i + 1) + 's')) +
        ' <span class="pc">' + esc(t('plays', { n: stampOf(k) })) + '</span>';
    });
    var row = $('#weekRow');
    if (row) {
      var html = '', base = new Date(); base.setHours(12, 0, 0, 0);
      for (var i = 6; i >= 0; i--) {
        var d = new Date(base.getTime() - i * DAY);
        var rec = loadStamps()[keyOf(d)];
        var n = rec ? (rec.total || 0) : 0;
        var isToday = (i === 0);
        html += '<div class="wch' + (n ? ' on' : '') + (isToday ? ' today' : '') + '">' +
          '<b>' + (lang === 'ko' ? WD[d.getDay()] : WD_EN[d.getDay()].slice(0, 1)) + '</b>' +
          '<i>' + (n ? '★' : '·') + '</i></div>';
      }
      row.innerHTML = html;
    }
    var total = todayTotal();
    var msg = $('#stampMsg');
    if (msg) {
      msg.textContent = total ? t('stampSome', { n: total }) : t('stampNone');
      msg.className = 'stmsg' + (total ? '' : ' none');
    }
  }
  function syncToggles() {
    var sb = $('#soundBtn'), bb = $('#bigBtn');
    if (sb) {
      sb.setAttribute('aria-pressed', set.sound ? 'true' : 'false');
      var ss = $('#soundState'); if (ss) ss.textContent = set.sound ? t('on') : t('off');
    }
    if (bb) {
      bb.setAttribute('aria-pressed', set.big ? 'true' : 'false');
      var bs = $('#bigState'); if (bs) bs.textContent = set.big ? t('on') : t('off');
    }
    $$('[data-tts]').forEach(function (b) { b.setAttribute('aria-pressed', set.sound ? 'true' : 'false'); });
  }

  /* ─────────── 그림 (자체 오리지널 SVG) ─────────── */
  var ART = {
    apple: { ko: '사과', en: 'Apple', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 34c-9-9-25-7-29 6-4 13 6 25 13 32 6 6 11 6 16 2 5 4 10 4 16-2 7-7 17-19 13-32-4-13-20-15-29-6z" fill="#C0402C"/><path d="M50 36c0-9 2-13 6-17" fill="none" stroke="#7B5A2C" stroke-width="5" stroke-linecap="round"/><path d="M57 21c8-6 16-3 17 0-6 6-13 7-17 3z" fill="#4E8B3A"/></svg>' },
    pear: { ko: '배', en: 'Pear', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 28c-7 0-11 7-11 15 0 6-10 12-10 25 0 12 9 20 21 20s21-8 21-20c0-13-10-19-10-25 0-8-4-15-11-15z" fill="#C8B94C"/><path d="M50 28c0-6 1-9 4-12" fill="none" stroke="#7B5A2C" stroke-width="4.5" stroke-linecap="round"/><path d="M55 18c7-5 13-2 14 1-5 5-11 5-14 2z" fill="#4E8B3A"/></svg>' },
    dog: { ko: '강아지', en: 'Puppy', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="50" cy="58" rx="27" ry="24" fill="#C08A55"/><ellipse cx="25" cy="42" rx="9" ry="14" fill="#A9743F" transform="rotate(-20 25 42)"/><ellipse cx="75" cy="42" rx="9" ry="14" fill="#A9743F" transform="rotate(20 75 42)"/><ellipse cx="50" cy="70" rx="15" ry="11" fill="#EFD6B6"/><circle cx="40" cy="54" r="4" fill="#2B211A"/><circle cx="60" cy="54" r="4" fill="#2B211A"/><ellipse cx="50" cy="64" rx="6" ry="4.5" fill="#2B211A"/><path d="M50 68v5" stroke="#2B211A" stroke-width="2.6" stroke-linecap="round"/><path d="M43 74c4 3 10 3 14 0" fill="none" stroke="#2B211A" stroke-width="2.6" stroke-linecap="round"/></svg>' },
    cat: { ko: '고양이', en: 'Cat', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M28 36l-3-20 20 10z" fill="#8F8F99"/><path d="M72 36l3-20-20 10z" fill="#8F8F99"/><circle cx="50" cy="56" r="26" fill="#A6A6AF"/><circle cx="40" cy="53" r="4" fill="#2B211A"/><circle cx="60" cy="53" r="4" fill="#2B211A"/><path d="M50 60l-4 4h8z" fill="#D98A8A"/><path d="M22 58H10M22 64H10M78 58h12M78 64h12" stroke="#2B211A" stroke-width="2.4" stroke-linecap="round"/><path d="M43 68c3 4 11 4 14 0" fill="none" stroke="#2B211A" stroke-width="2.4" stroke-linecap="round"/></svg>' },
    flower: { ko: '꽃', en: 'Flower', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 62V92" stroke="#4E8B3A" stroke-width="5" stroke-linecap="round"/><path d="M50 78c-10-2-16-8-17-14 9-1 15 4 17 14z" fill="#5EA34A"/><g fill="#E986A8"><circle cx="50" cy="26" r="13"/><circle cx="66" cy="40" r="13"/><circle cx="60" cy="58" r="13"/><circle cx="40" cy="58" r="13"/><circle cx="34" cy="40" r="13"/></g><circle cx="50" cy="43" r="11" fill="#F2C14E"/></svg>' },
    butterfly: { ko: '나비', en: 'Butterfly', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><ellipse cx="32" cy="40" rx="17" ry="20" fill="#E5A23B" transform="rotate(-18 32 40)"/><ellipse cx="68" cy="40" rx="17" ry="20" fill="#E5A23B" transform="rotate(18 68 40)"/><ellipse cx="35" cy="68" rx="13" ry="14" fill="#D9822B" transform="rotate(14 35 68)"/><ellipse cx="65" cy="68" rx="13" ry="14" fill="#D9822B" transform="rotate(-14 65 68)"/><rect x="46" y="30" width="8" height="48" rx="4" fill="#3A2C22"/><path d="M47 32c-5-8-11-11-17-11M53 32c5-8 11-11 17-11" fill="none" stroke="#3A2C22" stroke-width="2.6" stroke-linecap="round"/><circle cx="50" cy="34" r="6" fill="#3A2C22"/></svg>' },
    sun: { ko: '해', en: 'Sun', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><g stroke="#E9A81F" stroke-width="5" stroke-linecap="round"><path d="M50 8v10M50 82v10M8 50h10M82 50h10M20 20l7 7M73 73l7 7M80 20l-7 7M27 73l-7 7"/></g><circle cx="50" cy="50" r="24" fill="#F2B933"/><circle cx="42" cy="46" r="3.4" fill="#7A4A00"/><circle cx="58" cy="46" r="3.4" fill="#7A4A00"/><path d="M43 56c4 5 10 5 14 0" fill="none" stroke="#7A4A00" stroke-width="3" stroke-linecap="round"/></svg>' },
    moon: { ko: '달', en: 'Moon', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path fill-rule="evenodd" fill="#EFD072" d="M50 50m0-32a32 32 0 1 1 0 64a32 32 0 1 1 0-64M58 46m0-25a25 25 0 1 0 0 50a25 25 0 1 0 0-50"/><circle cx="20" cy="24" r="3" fill="#E9C25A"/><circle cx="26" cy="74" r="2.4" fill="#E9C25A"/><circle cx="82" cy="22" r="2.6" fill="#E9C25A"/></svg>' },
    house: { ko: '집', en: 'House', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M22 50l28-26 28 26v28a4 4 0 01-4 4H26a4 4 0 01-4-4z" fill="#DDBB90"/><path d="M12 52L50 18l38 34" fill="none" stroke="#A9542F" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><rect x="42" y="62" width="16" height="20" rx="2" fill="#8C5A32"/><rect x="28" y="58" width="11" height="9" rx="2" fill="#BFE0EE" stroke="#8C5A32" stroke-width="2"/><rect x="61" y="58" width="11" height="9" rx="2" fill="#BFE0EE" stroke="#8C5A32" stroke-width="2"/></svg>' },
    car: { ko: '자동차', en: 'Car', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="10" y="52" width="80" height="20" rx="9" fill="#3F79A0"/><path d="M28 53l9-16h26l9 16z" fill="#4B89B0"/><rect x="35" y="41" width="12" height="11" rx="2" fill="#D6ECF6"/><rect x="53" y="41" width="12" height="11" rx="2" fill="#D6ECF6"/><circle cx="29" cy="73" r="9" fill="#2B2B2B"/><circle cx="29" cy="73" r="3.6" fill="#B9B9B9"/><circle cx="71" cy="73" r="9" fill="#2B2B2B"/><circle cx="71" cy="73" r="3.6" fill="#B9B9B9"/></svg>' },
    fish: { ko: '물고기', en: 'Fish', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M20 50c10-15 27-21 41-15 7 3 11 9 13 15-2 6-6 12-13 15-14 6-31 0-41-15z" fill="#5FA8C7"/><path d="M74 50l16-13v26z" fill="#4E92B0"/><circle cx="34" cy="46" r="3.6" fill="#173540"/><path d="M46 50c4 4 4 8 0 12" fill="none" stroke="#3D88A6" stroke-width="3" stroke-linecap="round"/><path d="M58 40c3 3 3 17 0 20" fill="none" stroke="#3D88A6" stroke-width="3" stroke-linecap="round"/></svg>' },
    umbrella: { ko: '우산', en: 'Umbrella', svg: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 54a38 38 0 0176 0z" fill="#B4483C"/><path d="M50 54v24a9 9 0 0018 0" fill="none" stroke="#6B4A2A" stroke-width="6" stroke-linecap="round"/><path d="M50 16v6" stroke="#6B4A2A" stroke-width="6" stroke-linecap="round"/><path d="M50 54V16" stroke="#6B4A2A" stroke-width="3" opacity=".45"/></svg>' }
  };

  /* ═══════════ 1. 그림 짝맞추기 ═══════════ */
  var MATCH = {
    level: 'easy',
    levels: { easy: { cols: 2, pairs: 3 }, normal: { cols: 3, pairs: 6 }, hard: { cols: 4, pairs: 8 } },
    cards: [], first: -1, lock: false, found: 0,
    start: function (level) {
      if (level && this.levels[level]) this.level = level;
      var lv = this.levels[this.level];
      var ids = shuffle(Object.keys(ART)).slice(0, lv.pairs);
      var cards = [];
      ids.forEach(function (id) {
        cards.push({ id: id, done: false, open: false, bad: false });
        cards.push({ id: id, done: false, open: false, bad: false });
      });
      shuffle(cards);
      this.cards = cards; this.first = -1; this.lock = false; this.found = 0;
      this.renderLevels(); this.renderBoard();
      this.updateStat(t('tapCard'));
    },
    renderLevels: function () {
      var self = this;
      $$('#levels .chip').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-level') === self.level ? 'true' : 'false');
      });
    },
    renderBoard: function () {
      var el = $('#board');
      if (!el) return;
      var lv = this.levels[this.level];
      el.className = 'board c' + lv.cols;
      var html = '';
      this.cards.forEach(function (c, idx) {
        var art = ART[c.id];
        var label = c.open ? (art[lang] || art.ko) : t('cardBack');
        html += '<button type="button" class="mcard' + (c.open ? ' open' : '') + (c.done ? ' done' : '') + (c.bad ? ' bad' : '') +
          '" data-idx="' + idx + '" data-id="' + c.id + '" aria-label="' + esc(label) + '">' +
          '<span class="back" aria-hidden="true">?</span>' +
          '<span class="face">' + art.svg + '<b>' + esc(art[lang] || art.ko) + '</b></span></button>';
      });
      el.innerHTML = html;
    },
    updateStat: function (msg) {
      var lv = this.levels[this.level];
      var a = $('#mScore'), b = $('#mLast');
      if (a) a.textContent = t('pairs', { a: this.found, b: lv.pairs });
      if (b) b.textContent = msg || t('tapCard');
    },
    flip: function (idx) {
      var c = this.cards[idx];
      if (!c || this.lock || c.done || c.open) return;
      var art = ART[c.id];
      c.open = true;
      this.renderBoard();
      this.updateStat(art[lang] || art.ko);
      sfx('tap');
      if (set.sound) speak(art[lang] || art.ko);
      if (this.first < 0) { this.first = idx; return; }
      var fi = this.first;
      if (fi === idx) return;
      var a = this.cards[fi];
      this.first = -1;
      if (a.id === c.id) {
        a.done = c.done = true;
        this.found++;
        this.renderBoard();
        this.updateStat(t('foundMsg', { n: art[lang] || art.ko }));
        sfx('good');
        var pw = praiseWord();
        praise(pw);
        if (set.sound) speak(pw);
        if (this.found === this.levels[this.level].pairs) this.complete();
      } else {
        this.lock = true;
        a.bad = c.bad = true;
        this.renderBoard();
        sfx('soft');
        this.updateStat(t('tapCard'));
        var self = this;
        setTimeout(function () {
          a.open = false; c.open = false; a.bad = false; c.bad = false;
          self.lock = false;
          self.renderBoard();
        }, 820);
      }
    },
    complete: function () {
      addStamp('match');
      sfx('great');
      openDone({
        emoji: '🏆',
        title: t('doneMatch'),
        text: t('pairs', { a: this.found, b: this.found }) + ' · ' + t('stampOne'),
        onAgain: function () { MATCH.start(); }
      });
      speak(t('doneMatch') + ' ' + praiseWord());
    }
  };

  /* ═══════════ 2·3. 문제 놀이 데이터 ═══════════ */
  var PROVERBS = [
    { q: '낮말은 새가 듣고 밤말은 {b}가 듣는다', a: '쥐', opts: ['쥐', '개', '소', '닭'], en: 'Birds hear by day and the mouse hears by night. Be careful with words.' },
    { q: '가는 말이 고와야 오는 말이 {b}', a: '곱다', opts: ['곱다', '밉다', '크다', '짧다'], en: 'Speak kindly and kindness comes back.' },
    { q: '백지장도 맞들면 {b}', a: '낫다', opts: ['낫다', '무겁다', '찢어진다', '비싸다'], en: 'Even a sheet of paper is easier to lift together.' },
    { q: '소 잃고 외양간 {b}', a: '고친다', opts: ['고친다', '판다', '짓는다', '닫는다'], en: 'Fixing the barn after losing the cow.' },
    { q: '티끌 모아 {b}', a: '태산', opts: ['태산', '바다', '구름', '산길'], en: 'Small dust gathered becomes a great mountain.' },
    { q: '우물 안 {b}', a: '개구리', opts: ['개구리', '고기', '달', '거북이'], en: 'A frog in a well sees only its own world.' },
    { q: '원숭이도 나무에서 {b}', a: '떨어진다', opts: ['떨어진다', '잔다', '웃는다', '논다'], en: 'Even monkeys fall from trees.' },
    { q: '열 번 찍어 안 넘어가는 나무 {b}', a: '없다', opts: ['없다', '크다', '많다', '있다'], en: 'No tree stays standing after ten strikes.' },
    { q: '고생 끝에 {b} 온다', a: '낙', opts: ['낙', '눈', '봄', '손님'], en: 'After hardship comes joy.' },
    { q: '세 살 버릇 여든까지 {b}', a: '간다', opts: ['간다', '온다', '멈춘다', '자란다'], en: 'A habit from age three lasts to eighty.' },
    { q: '발 없는 말이 {b} 간다', a: '천 리', opts: ['천 리', '만 리', '하루', '이틀'], en: 'Words travel far without feet.' },
    { q: '말 한 마디에 천 냥 빚을 {b}', a: '갚는다', opts: ['갚는다', '준다', '잃는다', '산다'], en: 'One kind word can repay a thousand coins of debt.' }
  ];
  var SEASONS = [
    { q: '봄에 노랗게 피는 꽃은?', a: '개나리', opts: ['진달래', '개나리', '코스모스', '국화'], en: 'Which flower blooms yellow in spring?' },
    { q: '겨울에 하얗게 내리는 것은?', a: '눈', opts: ['눈', '비', '잎', '안개'], en: 'What falls white in winter?' },
    { q: '여름에 시원하게 먹는 큰 과일은?', a: '수박', opts: ['수박', '감', '배추', '밤'], en: 'Which big fruit is eaten cold in summer?' },
    { q: '추석에 빚어 먹는 떡은?', a: '송편', opts: ['송편', '떡국', '팥빙수', '김밥'], en: 'Which rice cake is made for Chuseok?' },
    { q: '단풍이 곱게 드는 계절은?', a: '가을', opts: ['봄', '여름', '가을', '겨울'], en: 'In which season do leaves turn red and gold?' },
    { q: '설날 아침에 먹는 음식은?', a: '떡국', opts: ['떡국', '송편', '삼계탕', '팥죽'], en: 'What is eaten on Lunar New Year morning?' },
    { q: '장마가 오는 계절은?', a: '여름', opts: ['봄', '여름', '가을', '겨울'], en: 'In which season does the long rainy spell come?' },
    { q: '겨울에 담그는 김치는?', a: '김장', opts: ['김장', '장아찌', '오이소박이', '백김치'], en: 'Which kimchi making happens before winter?' },
    { q: '벚꽃이 피는 계절은?', a: '봄', opts: ['봄', '여름', '가을', '겨울'], en: 'In which season do cherry blossoms open?' },
    { q: '설날에 어른께 하는 인사는?', a: '세배', opts: ['세배', '축하', '생일', '노래'], en: 'What is the New Year bow to elders called?' },
    { q: '정월 대보름에 깨물어 먹는 것은?', a: '부럼', opts: ['부럼', '송편', '약과', '엿'], en: 'What nuts are cracked with the teeth at Daeboreum?' },
    { q: '더울 때 부채 대신 쓰는 것은?', a: '선풍기', opts: ['선풍기', '난로', '가습기', '전기장판'], en: 'What do we use instead of a fan when it is hot?' }
  ];
  var SHOP = [
    { q: '두부와 콩나물을 샀어요. 모두 얼마일까요?', en: 'You bought tofu and bean sprouts. How much in all?', a: 2700,
      items: [{ e: '🥬', n: '두부', en: 'Tofu', p: 1500 }, { e: '🌱', n: '콩나물', en: 'Sprouts', p: 1200 }] },
    { q: '사과 한 개가 1,000원이에요. 세 개를 사면 얼마일까요?', en: 'One apple is 1,000 won. How much for three?', a: 3000,
      items: [{ e: '🍎', n: '사과', en: 'Apple', p: 1000 }, { e: '✖️', n: '세 개', en: '× 3', p: null }] },
    { q: '계란 한 판과 우유를 샀어요. 모두 얼마일까요?', en: 'You bought eggs and milk. How much in all?', a: 6700,
      items: [{ e: '🥚', n: '계란 한 판', en: 'Eggs', p: 4800 }, { e: '🥛', n: '우유', en: 'Milk', p: 1900 }] },
    { q: '과자 한 봉지가 1,200원이에요. 세 봉지면 얼마일까요?', en: 'One bag of snacks is 1,200 won. How much for three?', a: 3600,
      items: [{ e: '🍪', n: '과자', en: 'Snacks', p: 1200 }, { e: '✖️', n: '세 봉지', en: '× 3', p: null }] },
    { q: '라면 두 개와 생수를 샀어요. 모두 얼마일까요?', en: 'You bought two ramyeon and water. How much in all?', a: 2800,
      items: [{ e: '🍜', n: '라면', en: 'Ramyeon', p: 1100 }, { e: '💧', n: '생수', en: 'Water', p: 600 }] },
    { q: '배추와 무를 샀어요. 모두 얼마일까요?', en: 'You bought cabbage and radish. How much in all?', a: 5500,
      items: [{ e: '🥬', n: '배추', en: 'Cabbage', p: 3500 }, { e: '🥕', n: '무', en: 'Radish', p: 2000 }] },
    { q: '두 봉지에 2,800원이에요. 한 봉지는 얼마일까요?', en: 'Two bags cost 2,800 won. How much is one bag?', a: 1400,
      items: [{ e: '🛍️', n: '두 봉지', en: 'Two bags', p: 2800 }] },
    { q: '고등어 두 마리에 5,000원이에요. 한 마리는 얼마일까요?', en: 'Two mackerel cost 5,000 won. How much is one?', a: 2500,
      items: [{ e: '🐟', n: '고등어 두 마리', en: 'Two mackerel', p: 5000 }] },
    { q: '콩나물, 시금치, 두부를 샀어요. 모두 얼마일까요?', en: 'You bought sprouts, spinach and tofu. How much in all?', a: 5000,
      items: [{ e: '🌱', n: '콩나물', en: 'Sprouts', p: 1200 }, { e: '🥬', n: '시금치', en: 'Spinach', p: 2300 }, { e: '🧊', n: '두부', en: 'Tofu', p: 1500 }] },
    { q: '귤 한 봉지가 4,000원이에요. 두 봉지면 얼마일까요?', en: 'One bag of tangerines is 4,000 won. How much for two?', a: 8000,
      items: [{ e: '🍊', n: '귤', en: 'Tangerines', p: 4000 }, { e: '✖️', n: '두 봉지', en: '× 2', p: null }] }
  ];
  var CHANGE = [
    { q: '만 원을 내고 3,800원짜리를 샀어요. 거스름돈은 얼마일까요?', en: 'You paid 10,000 won for a 3,800 won item. How much change?', a: 6200, items: [] },
    { q: '5,000원을 내고 2,500원짜리를 샀어요. 거스름돈은 얼마일까요?', en: 'You paid 5,000 won for a 2,500 won item. How much change?', a: 2500, items: [] },
    { q: '2만 원을 내고 14,300원짜리를 샀어요. 거스름돈은 얼마일까요?', en: 'You paid 20,000 won for a 14,300 won item. How much change?', a: 5700, items: [] },
    { q: '만 원을 내고 4,000원짜리를 두 개 샀어요. 거스름돈은 얼마일까요?', en: 'You paid 10,000 won for two 4,000 won items. How much change?', a: 2000, items: [] },
    { q: '시장에서 6,000원을 2,000원 깎아 주셨어요. 얼마를 내면 될까요?', en: 'A 6,000 won price is cut by 2,000 won. How much do you pay?', a: 4000, items: [] },
    { q: '500원짜리 동전이 네 개 있어요. 모두 얼마일까요?', en: 'You have four 500 won coins. How much in all?', a: 2000, items: [] },
    { q: '만 원짜리 두 장을 내고 11,000원짜리를 샀어요. 거스름돈은 얼마일까요?', en: 'You paid two 10,000 won notes for an 11,000 won item. How much change?', a: 9000, items: [] },
    { q: '3,000원을 내고 1,800원짜리를 샀어요. 거스름돈은 얼마일까요?', en: 'You paid 3,000 won for a 1,800 won item. How much change?', a: 1200, items: [] },
    { q: '5만 원을 내고 32,500원짜리를 샀어요. 거스름돈은 얼마일까요?', en: 'You paid 50,000 won for a 32,500 won item. How much change?', a: 17500, items: [] },
    { q: '만 원을 내고 7,900원짜리를 샀어요. 거스름돈은 얼마일까요?', en: 'You paid 10,000 won for a 7,900 won item. How much change?', a: 2100, items: [] }
  ];
  function moneyOpts(ans) {
    var offs = [1000, -1000, 500, -500, 2000, -2000, 300, -300], out = [ans], i = 0;
    while (out.length < 4 && i < offs.length) {
      var v = ans + offs[i++];
      if (v > 0 && out.indexOf(v) === -1) out.push(v);
    }
    var k = 100;
    while (out.length < 4) { var v2 = ans + k; if (out.indexOf(v2) === -1) out.push(v2); k += 100; }
    return out;
  }
  SHOP.concat(CHANGE).forEach(function (q) { q.opts = moneyOpts(q.a); });

  /* ═══════════ 문제 놀이 엔진 ═══════════ */
  function optText(o) { return (typeof o === 'number') ? won(o) : String(o); }

  function makeQuiz(cfg) {
    var root = cfg.root;
    var catsEl = root.querySelector('.qcats');
    var progEl = root.querySelector('.qprog');
    var dotsEl = root.querySelector('.qdots');
    var textEl = root.querySelector('.qtext');
    var itemEl = root.querySelector('.qitems');
    var optsEl = root.querySelector('.opts');
    var fbEl = root.querySelector('.fb');
    var nextEl = root.querySelector('.next');
    var readEl = root.querySelector('.readbtn');
    var catMap = {};
    cfg.cats.forEach(function (c) { catMap[c.id] = c; });
    var st = { cat: cfg.cats[0].id, list: [], i: 0, score: 0, marks: [], answered: false, picked: -1 };

    function cur() { return st.list[st.i]; }

    function renderChips() {
      catsEl.innerHTML = cfg.cats.map(function (c) {
        return '<button type="button" class="chip" data-cat="' + c.id + '" aria-pressed="' +
          (c.id === st.cat ? 'true' : 'false') + '">' + esc(c.name[lang] || c.name.ko) + '</button>';
      }).join('');
    }

    function render() {
      var q = cur();
      if (!q) return;
      progEl.textContent = (st.i + 1) + ' / ' + st.list.length;
      dotsEl.innerHTML = st.list.map(function (_, k) {
        var cls = k < st.marks.length ? (st.marks[k] ? 'ok' : 'no') : '';
        return '<i class="' + cls + '"></i>';
      }).join('');
      var qt = (lang === 'ko') ? q.q : (q.en || q.q);
      var blank = st.answered
        ? '<span class="blank filled">' + esc(q.a) + '</span>'
        : '<span class="blank">' + esc(q.a) + '</span>';
      textEl.innerHTML = esc(qt).replace(/\{b\}/g, blank);

      if (q.items && q.items.length) {
        itemEl.innerHTML = q.items.map(function (it) {
          var nm = (lang === 'ko') ? it.n : (it.en || it.n);
          return '<span class="qitem"><span class="qi-e">' + it.e + '</span><span class="qi-t"><b>' +
            esc(nm) + '</b>' + (it.p ? '<span>' + won(it.p) + '</span>' : '') + '</span></span>';
        }).join('');
        itemEl.hidden = false;
      } else {
        itemEl.innerHTML = '';
        itemEl.hidden = true;
      }

      optsEl.innerHTML = q._o.map(function (o, k) {
        var cls = 'opt';
        if (st.answered) {
          if (o === q.a) cls += ' good';
          else if (k === st.picked) cls += ' no';
        }
        return '<button type="button" class="' + cls + '" data-k="' + k + '"' + (st.answered ? ' disabled' : '') + '>' +
          '<span class="num">' + (k + 1) + '</span><span class="ot">' + esc(optText(o)) + '</span></button>';
      }).join('');

      if (st.answered) {
        var ok = st.marks[st.marks.length - 1];
        fbEl.hidden = false;
        fbEl.className = 'fb ' + (ok ? 'good' : 'bad');
        fbEl.textContent = ok ? t('correct') : t('wrong', { a: optText(q.a) });
      } else {
        fbEl.hidden = true;
        fbEl.textContent = '';
        fbEl.className = 'fb';
      }
      nextEl.hidden = !st.answered;
      var sp = nextEl.querySelector('span');
      if (sp) sp.textContent = (st.i === st.list.length - 1) ? t('lastQ') : t('nextQ');
    }

    function fullSentence(q) {
      if (typeof q.a === 'number') return (lang === 'ko' ? q.q : (q.en || q.q));
      return q.q.replace('{b}', q.a);
    }

    function speakQ() {
      var q = cur();
      if (!q) return;
      var s;
      if (lang === 'ko') {
        s = q.q.replace('{b}', '무엇');
        if (q.items && q.items.length) {
          s += '. ' + q.items.map(function (it) { return it.n + ' ' + (it.p ? won(it.p) : ''); }).join(', ');
        }
        s += '. ' + q._o.map(function (o, i) { return (i + 1) + '번 ' + optText(o); }).join(', ') + '. 골라 보세요.';
      } else {
        s = (q.en || q.q) + '. ' + q._o.map(function (o, i) { return (i + 1) + '. ' + optText(o); }).join(', ');
      }
      speak(s);
    }

    function start(catId) {
      if (catId && catMap[catId]) st.cat = catId;
      var pool = catMap[st.cat].pool.slice();
      shuffle(pool);
      st.list = pool.slice(0, Math.min(10, pool.length));
      st.list.forEach(function (q) {
        if (!q._o) { q._o = q.opts.slice(); shuffle(q._o); }
      });
      st.i = 0; st.score = 0; st.marks = []; st.answered = false; st.picked = -1;
      renderChips(); render();
      if (set.sound) setTimeout(speakQ, 300);
    }

    function answer(k) {
      if (st.answered) return;
      var q = cur(), o = q._o[k], ok = (o === q.a);
      st.answered = true; st.picked = k; st.marks.push(ok);
      if (ok) st.score++;
      render();
      if (ok) {
        sfx('good');
        var pw = praiseWord();
        praise(pw);
        if (set.sound) speak(pw + ' ' + fullSentence(q));
      } else {
        sfx('soft');
        if (set.sound) speak(t('wrong', { a: optText(q.a) }) + ' ' + fullSentence(q));
      }
    }

    function next() {
      if (!st.answered) return;
      if (st.i >= st.list.length - 1) { finish(); return; }
      st.i++; st.answered = false; st.picked = -1;
      render();
      if (set.sound) speakQ();
    }

    function finish() {
      var n = st.list.length, s = st.score;
      addStamp(cfg.kind);
      sfx('great');
      var extra = s === n ? t('scoreHigh') : (s >= Math.ceil(n * 0.6) ? t('scoreMid') : t('scoreLow'));
      openDone({
        emoji: s === n ? '🏆' : '🎉',
        title: t('doneSay'),
        text: t('scoreLine', { s: s, n: n }) + ' ' + extra + ' ' + t('stampOne'),
        onAgain: function () { start(st.cat); }
      });
      speak(t('scoreLine', { s: s, n: n }) + ' ' + extra);
    }

    optsEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-k]');
      if (!b || b.disabled) return;
      answer(Number(b.getAttribute('data-k')));
    });
    nextEl.addEventListener('click', next);
    readEl.addEventListener('click', function () {
      if (!set.sound) setSound(true);
      speakQ();
    });
    catsEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cat]');
      if (!b) return;
      var id = b.getAttribute('data-cat');
      if (id === st.cat) return;
      start(id);
    });

    return {
      start: start, refresh: function () { renderChips(); render(); },
      state: st, kind: cfg.kind
    };
  }

  var QUIZ = {};

  /* ═══════════ 4. 한지 붓글씨 ═══════════ */
  var GUIDES = [
    { id: 'bok', chars: ['복'], note: '福', name: { ko: '복', en: '福' }, say: 'sayBok' },
    { id: 'health', chars: ['건', '강'], note: '健康', name: { ko: '건강', en: 'Health' }, say: 'sayHealth' },
    { id: 'love', chars: ['사', '랑'], note: '사랑', name: { ko: '사랑', en: 'Love' }, say: 'sayLove' },
    { id: 'hyo', chars: ['효', '도'], note: '孝道', name: { ko: '효도', en: 'Thanks' }, say: 'sayHyo' },
    { id: 'gana', chars: ['가', '나', '다'], note: '가나다', name: { ko: '가나다', en: 'ABC' }, say: 'sayGana' },
    { id: 'free', chars: [], note: '', name: { ko: '빈 종이', en: 'Blank' }, say: 'sayFree' }
  ];
  var INK = { black: '#211C16', blue: '#20395A', red: '#8A2B20', brown: '#75571F' };
  var BRUSH_W = { thin: 0.011, normal: 0.019, thick: 0.028 };

  var BRUSH = (function () {
    var wrap, hanjiC, guideC, inkC, hctx, gctx, ictx;
    var cssW = 0, cssH = 0, dpr = 1, ready = false;
    var strokes = [], cur = null, drawing = false, lastT = 0, wSmooth = 1;

    function guideById(id) {
      for (var i = 0; i < GUIDES.length; i++) { if (GUIDES[i].id === id) return GUIDES[i]; }
      return GUIDES[0];
    }
    function mulberry32(a) {
      return function () {
        a |= 0; a = a + 0x6D2B79F5 | 0;
        var t = Math.imul(a ^ a >>> 15, 1 | a);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };
    }
    function paintHanji(c, W, H) {
      var rnd = mulberry32(20261127);
      var g = c.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, '#FCF4E1'); g.addColorStop(0.45, '#F8EBD1'); g.addColorStop(1, '#F1DFBE');
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      var i, n;
      c.lineCap = 'round';
      n = Math.round(W * H / 1200);
      for (i = 0; i < n; i++) {
        var x = rnd() * W, y = rnd() * H, len = (4 + rnd() * 26) * (W / 380);
        c.strokeStyle = 'rgba(150,116,64,' + (0.03 + rnd() * 0.05).toFixed(3) + ')';
        c.lineWidth = (0.5 + rnd() * 1.1) * (W / 380);
        c.beginPath(); c.moveTo(x, y);
        c.quadraticCurveTo(x + len * 0.5, y + (rnd() - 0.5) * 4, x + len, y + (rnd() - 0.5) * 3);
        c.stroke();
      }
      n = Math.round(W * H / 7000);
      for (i = 0; i < n; i++) {
        c.fillStyle = 'rgba(120,92,48,' + (0.04 + rnd() * 0.07).toFixed(3) + ')';
        c.beginPath(); c.arc(rnd() * W, rnd() * H, (0.6 + rnd() * 1.3) * (W / 380), 0, 6.2832); c.fill();
      }
      var rg = c.createRadialGradient(W * 0.5, H * 0.45, Math.min(W, H) * 0.15, W * 0.5, H * 0.5, Math.max(W, H) * 0.82);
      rg.addColorStop(0, 'rgba(255,250,238,0.16)');
      rg.addColorStop(0.6, 'rgba(120,90,40,0.03)');
      rg.addColorStop(1, 'rgba(110,80,30,0.15)');
      c.fillStyle = rg; c.fillRect(0, 0, W, H);
    }
    function drawGrid(x, y, s) {
      gctx.save();
      gctx.strokeStyle = 'rgba(168,53,42,.42)'; gctx.lineWidth = 1.6;
      gctx.setLineDash([7, 6]); gctx.strokeRect(x, y, s, s);
      gctx.setLineDash([]);
      gctx.strokeStyle = 'rgba(168,53,42,.20)'; gctx.lineWidth = 1;
      gctx.beginPath(); gctx.moveTo(x, y); gctx.lineTo(x + s, y + s);
      gctx.moveTo(x + s, y); gctx.lineTo(x, y + s); gctx.stroke();
      gctx.strokeStyle = 'rgba(168,53,42,.2)'; gctx.setLineDash([4, 7]);
      gctx.beginPath();
      gctx.moveTo(x + s / 2, y); gctx.lineTo(x + s / 2, y + s);
      gctx.moveTo(x, y + s / 2); gctx.lineTo(x + s, y + s / 2); gctx.stroke();
      gctx.restore();
    }
    function drawChar(ch, x, y, s) {
      gctx.save();
      gctx.fillStyle = 'rgba(50,38,24,.30)';
      gctx.textAlign = 'center'; gctx.textBaseline = 'middle';
      gctx.font = '700 ' + Math.round(s * 0.74) + 'px "Noto Serif CJK KR","Nanum Myeongjo","Batang","Gungsuh",serif';
      gctx.fillText(ch, x + s / 2, y + s / 2 + s * 0.02);
      gctx.restore();
    }
    function paintGuide() {
      if (!ready) return;
      gctx.clearRect(0, 0, cssW, cssH);
      var g = guideById(set.guide);
      if (!g.chars.length) return;
      var n = g.chars.length;
      var padX = cssW * 0.07, padY = cssH * 0.1;
      var availW = cssW - padX * 2, availH = cssH * 0.66;
      var gap = n > 1 ? Math.min(cssW * 0.05, 24) : 0;
      var s = Math.min((availW - gap * (n - 1)) / n, availH);
      var totalW = s * n + gap * (n - 1);
      var x0 = (cssW - totalW) / 2, y0 = (cssH - s) / 2 - cssH * 0.02;
      for (var i = 0; i < n; i++) {
        var x = x0 + i * (s + gap);
        drawGrid(x, y0, s);
        drawChar(g.chars[i], x, y0, s);
      }
    }
    function wbase() { return cssW * (BRUSH_W[set.brushW] || BRUSH_W.normal); }
    function seg(a, b, color) {
      var wb = wbase();
      var ax = a.x * cssW, ay = a.y * cssH, bx = b.x * cssW, by = b.y * cssH;
      var ra = Math.max(0.6, a.w * wb), rb = Math.max(0.6, b.w * wb);
      var d = Math.sqrt((bx - ax) * (bx - ax) + (by - ay) * (by - ay));
      var steps = Math.max(1, Math.ceil(d / Math.max(1, Math.min(ra, rb) * 0.45)));
      ictx.fillStyle = color;
      for (var i = 1; i <= steps; i++) {
        var k = i / steps, r = ra + (rb - ra) * k;
        ictx.beginPath();
        ictx.arc(ax + (bx - ax) * k, ay + (by - ay) * k, r, 0, 6.2832);
        ictx.fill();
      }
    }
    function paintInk() {
      if (!ready) return;
      ictx.clearRect(0, 0, cssW, cssH);
      ictx.save(); ictx.globalAlpha = 0.94;
      for (var i = 0; i < strokes.length; i++) {
        var st = strokes[i];
        if (st.pts.length === 1) {
          var p = st.pts[0];
          ictx.fillStyle = st.color;
          ictx.beginPath(); ictx.arc(p.x * cssW, p.y * cssH, Math.max(1, wbase() * p.w * 0.85), 0, 6.2832); ictx.fill();
          continue;
        }
        for (var k = 1; k < st.pts.length; k++) seg(st.pts[k - 1], st.pts[k], st.color);
      }
      ictx.restore();
    }
    function layout() {
      if (!wrap) return;
      var w = wrap.clientWidth;
      if (!w) return;
      var h = Math.round(Math.min(Math.max(w * 1.12, 300), 580));
      wrap.style.height = h + 'px';
      cssW = w; cssH = h;
      dpr = Math.min(2.5, window.devicePixelRatio || 1);
      [hanjiC, guideC, inkC].forEach(function (c) {
        c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
      });
      hctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ictx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ready = true;
      paintHanji(hctx, w, h);
      paintGuide(); paintInk();
    }
    function point(e) {
      var r = inkC.getBoundingClientRect();
      var src = (e.touches && e.touches[0]) ? e.touches[0] : e;
      if (src.clientX == null) return null;
      return { x: (src.clientX - r.left) / r.width, y: (src.clientY - r.top) / r.height };
    }
    function startStroke(e) {
      if (!ready) layout();
      if (e.button != null && e.button > 0) return;
      var p = point(e);
      if (!p) return;
      drawing = true;
      var press = (e.pointerType === 'pen' && e.pressure > 0) ? e.pressure : 0;
      var w = press ? (0.42 + 1.05 * press) : 1.06;
      wSmooth = w;
      cur = { color: INK[set.ink] || INK.black, pts: [{ x: p.x, y: p.y, w: w }] };
      strokes.push(cur);
      lastT = nowMs();
      ictx.save(); ictx.globalAlpha = 0.94; ictx.fillStyle = cur.color;
      ictx.beginPath(); ictx.arc(p.x * cssW, p.y * cssH, Math.max(1, wbase() * w * 0.8), 0, 6.2832); ictx.fill();
      ictx.restore();
      try { if (e.pointerId != null && inkC.setPointerCapture) inkC.setPointerCapture(e.pointerId); } catch (err) {}
      if (e.cancelable) { try { e.preventDefault(); } catch (err) {} }
    }
    function moveStroke(e) {
      if (!drawing || !cur) return;
      var p = point(e);
      if (!p) return;
      var last = cur.pts[cur.pts.length - 1];
      var t = nowMs(), dt = Math.max(6, t - lastT);
      var dx = (p.x - last.x) * cssW, dy = (p.y - last.y) * cssH;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.5) return;
      var v = dist / dt;
      var k = 1.14 - 0.56 * Math.min(1, v / 1.7);
      if (e.pointerType === 'pen' && e.pressure > 0) k = 0.42 + 1.05 * e.pressure;
      wSmooth = wSmooth * 0.55 + k * 0.45;
      var w = Math.max(0.4, Math.min(1.32, wSmooth));
      var pt = { x: p.x, y: p.y, w: w };
      cur.pts.push(pt);
      ictx.save(); ictx.globalAlpha = 0.94;
      seg(last, pt, cur.color);
      ictx.restore();
      lastT = t;
      if (e.cancelable) { try { e.preventDefault(); } catch (err) {} }
    }
    function endStroke() { if (!drawing) return; drawing = false; cur = null; }

    function bind() {
      if (window.PointerEvent) {
        inkC.addEventListener('pointerdown', startStroke);
        inkC.addEventListener('pointermove', moveStroke);
        window.addEventListener('pointerup', endStroke);
        window.addEventListener('pointercancel', endStroke);
      } else {
        inkC.addEventListener('touchstart', startStroke, { passive: false });
        inkC.addEventListener('touchmove', function (e) { moveStroke(e); }, { passive: false });
        inkC.addEventListener('touchend', endStroke);
        inkC.addEventListener('mousedown', startStroke);
        inkC.addEventListener('mousemove', moveStroke);
        window.addEventListener('mouseup', endStroke);
      }
    }

    function renderGuides() {
      var el = $('#guides');
      if (!el) return;
      el.innerHTML = GUIDES.map(function (g) {
        return '<button type="button" class="gchip" data-guide="' + g.id + '" aria-pressed="' +
          (g.id === set.guide ? 'true' : 'false') + '">' + esc(t('g' + g.id.charAt(0).toUpperCase() + g.id.slice(1))) +
          (g.note && g.id !== 'free' ? '<small>' + esc(g.note) + '</small>' : '<small>' + (g.id === 'free' ? '✎' : '') + '</small>') +
          '</button>';
      }).join('');
    }
    function syncTools() {
      $$('#widths .wbtn').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-w') === set.brushW ? 'true' : 'false');
      });
      $$('#colors .cbtn').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-c') === set.ink ? 'true' : 'false');
      });
    }
    function selectGuide(id) {
      set.guide = id; saveSet();
      renderGuides(); paintGuide();
      var g = guideById(id);
      if (set.sound) speak(t(g.say));
    }
    function undo() {
      if (!strokes.length) { toast(t('brushEmpty')); return; }
      strokes.pop(); paintInk();
    }
    function clear() {
      if (!strokes.length) { toast(t('brushEmpty')); return; }
      strokes = []; paintInk();
    }
    function saveArt() {
      if (!strokes.length) {
        toast(t('brushEmpty'));
        if (set.sound) speak(t('brushEmpty'));
        return;
      }
      var W = Math.round(cssW * 2), H = Math.round(cssH * 2);
      var cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      var c = cv.getContext('2d');
      paintHanji(c, W, H);
      c.drawImage(guideC, 0, 0, W, H);
      c.drawImage(inkC, 0, 0, W, H);
      var g = guideById(set.guide);
      var nm = g.chars.length ? g.chars.join('') : '자유';
      var done = function () {
        toast(t('brushSaved'));
        addStamp('brush');
        sfx('great');
        praise(t('stampOne'));
        if (set.sound) speak(t('brushSaved'));
      };
      if (cv.toBlob) {
        cv.toBlob(function (blob) {
          if (!blob) { toast(t('saveFail')); return; }
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = '두뇌놀이_서예_' + nm + '_' + todayKey() + '.png';
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(url); }, 8000);
          done();
        }, 'image/png');
      } else {
        try {
          var url2 = cv.toDataURL('image/png');
          var a2 = document.createElement('a');
          a2.href = url2; a2.download = '두뇌놀이_서예_' + nm + '_' + todayKey() + '.png';
          document.body.appendChild(a2); a2.click(); a2.remove();
          done();
        } catch (e) { toast(t('saveFail')); }
      }
    }

    function init() {
      wrap = $('#paperwrap');
      if (!wrap) return;
      hanjiC = $('#hanjiC'); guideC = $('#guideC'); inkC = $('#inkC');
      hctx = hanjiC.getContext('2d'); gctx = guideC.getContext('2d'); ictx = inkC.getContext('2d');
      bind();
      $$('#widths .wbtn').forEach(function (b) {
        b.addEventListener('click', function () { set.brushW = b.getAttribute('data-w'); saveSet(); syncTools(); });
      });
      $$('#colors .cbtn').forEach(function (b) {
        b.addEventListener('click', function () { set.ink = b.getAttribute('data-c'); saveSet(); syncTools(); });
      });
      $('#guides').addEventListener('click', function (e) {
        var b = e.target.closest('[data-guide]');
        if (b) selectGuide(b.getAttribute('data-guide'));
      });
      $('#undoBtn').addEventListener('click', undo);
      $('#clearBtn').addEventListener('click', clear);
      $('#saveBtn').addEventListener('click', saveArt);
      var rt = null;
      window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () { if (curScreen === 'brush') layout(); }, 160);
      });
      syncTools(); renderGuides();
    }

    return {
      init: init, open: function () { layout(); renderGuides(); syncTools(); },
      refresh: function () { renderGuides(); paintGuide(); },
      layout: layout, save: saveArt, undo: undo, clear: clear,
      select: selectGuide,
      get strokes() { return strokes; }
    };
  })();

  /* ═══════════ 5. 큰 그림 색칠하기 ═══════════ */
  var PALETTE = [
    { c: '#E5483C', ko: '빨강', en: 'Red' },
    { c: '#F08A24', ko: '주황', en: 'Orange' },
    { c: '#F2C63C', ko: '노란', en: 'Yellow' },
    { c: '#8FBF4A', ko: '연두', en: 'Lime' },
    { c: '#3E8E5A', ko: '초록', en: 'Green' },
    { c: '#4FB3C4', ko: '하늘', en: 'Sky' },
    { c: '#3C63A8', ko: '파랑', en: 'Blue' },
    { c: '#9A6BC0', ko: '보라', en: 'Purple' },
    { c: '#E98AA6', ko: '분홍', en: 'Pink' },
    { c: '#A9744F', ko: '갈색', en: 'Brown' }
  ];
  var SHEETS = [
    { id: 'flower', name: { ko: '꽃', en: 'Flower' }, svg:
      '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="400" height="300" fill="#FFFDF7"/>' +
      '<path d="M200 270 C197 242 198 216 200 188" fill="none" stroke="#2B241C" stroke-width="7" stroke-linecap="round"/>' +
      '<path data-rg="1" d="M200 240 C176 234 156 246 148 266 C176 272 194 260 200 240 Z" fill="#FFFFFF" stroke="#2B241C" stroke-width="5" stroke-linejoin="round"/>' +
      '<path data-rg="1" d="M200 216 C224 210 244 222 252 242 C224 248 206 236 200 216 Z" fill="#FFFFFF" stroke="#2B241C" stroke-width="5" stroke-linejoin="round"/>' +
      '<ellipse data-rg="1" cx="200" cy="62" rx="27" ry="35" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<ellipse data-rg="1" cx="200" cy="62" rx="27" ry="35" transform="rotate(60 200 104)" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<ellipse data-rg="1" cx="200" cy="62" rx="27" ry="35" transform="rotate(120 200 104)" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<ellipse data-rg="1" cx="200" cy="62" rx="27" ry="35" transform="rotate(180 200 104)" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<ellipse data-rg="1" cx="200" cy="62" rx="27" ry="35" transform="rotate(240 200 104)" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<ellipse data-rg="1" cx="200" cy="62" rx="27" ry="35" transform="rotate(300 200 104)" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<circle data-rg="1" cx="200" cy="104" r="32" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '</svg>' },
    { id: 'apple', name: { ko: '사과', en: 'Apple' }, svg:
      '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="400" height="300" fill="#FFFDF7"/>' +
      '<path data-rg="1" d="M200 104 C158 64 92 82 80 144 C68 206 118 262 168 274 C186 278 194 272 200 266 C206 272 214 278 232 274 C282 262 332 206 320 144 C308 82 242 64 200 104 Z" fill="#FFFFFF" stroke="#2B241C" stroke-width="6" stroke-linejoin="round"/>' +
      '<path d="M200 104 C200 78 204 60 216 44" fill="none" stroke="#2B241C" stroke-width="7" stroke-linecap="round"/>' +
      '<path data-rg="1" d="M216 66 C238 42 282 46 294 66 C272 92 232 92 216 66 Z" fill="#FFFFFF" stroke="#2B241C" stroke-width="5" stroke-linejoin="round"/>' +
      '</svg>' },
    { id: 'butterfly', name: { ko: '나비', en: 'Butterfly' }, svg:
      '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="400" height="300" fill="#FFFDF7"/>' +
      '<ellipse data-rg="1" cx="146" cy="112" rx="54" ry="46" transform="rotate(-18 146 112)" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<ellipse data-rg="1" cx="254" cy="112" rx="54" ry="46" transform="rotate(18 254 112)" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<ellipse data-rg="1" cx="162" cy="198" rx="42" ry="36" transform="rotate(12 162 198)" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<ellipse data-rg="1" cx="238" cy="198" rx="42" ry="36" transform="rotate(-12 238 198)" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<ellipse data-rg="1" cx="200" cy="156" rx="13" ry="64" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<path d="M193 98 C182 74 168 62 152 56" fill="none" stroke="#2B241C" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M207 98 C218 74 232 62 248 56" fill="none" stroke="#2B241C" stroke-width="6" stroke-linecap="round"/>' +
      '</svg>' },
    { id: 'pouch', name: { ko: '복주머니', en: 'Lucky pouch' }, svg:
      '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="400" height="300" fill="#FFFDF7"/>' +
      '<path data-rg="1" d="M200 86 C146 86 112 130 112 178 C112 230 152 260 200 260 C248 260 288 230 288 178 C288 130 254 86 200 86 Z" fill="#FFFFFF" stroke="#2B241C" stroke-width="6" stroke-linejoin="round"/>' +
      '<path data-rg="1" d="M158 84 C168 68 232 68 242 84 C232 100 168 100 158 84 Z" fill="#FFFFFF" stroke="#2B241C" stroke-width="5" stroke-linejoin="round"/>' +
      '<path data-rg="1" d="M200 76 C176 44 136 54 146 76 C154 92 190 92 200 76 Z" fill="#FFFFFF" stroke="#2B241C" stroke-width="5" stroke-linejoin="round"/>' +
      '<path data-rg="1" d="M200 76 C224 44 264 54 254 76 C246 92 210 92 200 76 Z" fill="#FFFFFF" stroke="#2B241C" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M200 68 L200 38" fill="none" stroke="#2B241C" stroke-width="6" stroke-linecap="round"/>' +
      '</svg>' },
    { id: 'house', name: { ko: '집', en: 'House' }, svg:
      '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="400" height="300" fill="#FFFDF7"/>' +
      '<circle data-rg="1" cx="322" cy="66" r="30" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<path data-rg="1" d="M58 152 L200 56 L342 152 Z" fill="#FFFFFF" stroke="#2B241C" stroke-width="6" stroke-linejoin="round"/>' +
      '<rect data-rg="1" x="84" y="152" width="232" height="118" fill="#FFFFFF" stroke="#2B241C" stroke-width="6"/>' +
      '<rect data-rg="1" x="176" y="196" width="48" height="74" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<rect data-rg="1" x="108" y="176" width="48" height="40" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<rect data-rg="1" x="252" y="176" width="48" height="40" fill="#FFFFFF" stroke="#2B241C" stroke-width="5"/>' +
      '<rect x="0" y="268" width="400" height="32" fill="#CDE3B0"/>' +
      '</svg>' }
  ];

  var COLOR = (function () {
    var stage, art, canvas, ctx, cssW = 0, cssH = 0, dpr = 1, ready = false;
    var cur = { color: PALETTE[0].c, sheet: 'flower', hist: [], strokes: [] };
    var downPt = null, moved = false;

    function sheetById(id) {
      for (var i = 0; i < SHEETS.length; i++) { if (SHEETS[i].id === id) return SHEETS[i]; }
      return SHEETS[0];
    }
    function renderSheets() {
      var el = $('#colorSheets');
      if (!el) return;
      el.innerHTML = SHEETS.map(function (s) {
        return '<button type="button" class="chip" data-sheet="' + s.id + '" aria-pressed="' +
          (s.id === cur.sheet ? 'true' : 'false') + '"><span>' + esc(s.name[lang] || s.name.ko) + '</span></button>';
      }).join('');
    }
    function renderPalette() {
      var el = $('#palette');
      if (!el) return;
      el.innerHTML = PALETTE.map(function (p) {
        return '<button type="button" class="sw" data-c="' + p.c + '" aria-pressed="' + (p.c === cur.color ? 'true' : 'false') +
          '" style="background:' + p.c + '" aria-label="' + esc(p[lang] || p.ko) + '"></button>';
      }).join('');
    }
    function paintAll() {
      if (!ready) return;
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (var i = 0; i < cur.strokes.length; i++) {
        var st = cur.strokes[i];
        ctx.fillStyle = st.color; ctx.strokeStyle = st.color; ctx.lineWidth = 16;
        if (st.pts.length === 1) {
          ctx.beginPath(); ctx.arc(st.pts[0].x * cssW, st.pts[0].y * cssH, 8, 0, 6.2832); ctx.fill();
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(st.pts[0].x * cssW, st.pts[0].y * cssH);
        for (var k = 1; k < st.pts.length; k++) ctx.lineTo(st.pts[k].x * cssW, st.pts[k].y * cssH);
        ctx.stroke();
      }
    }
    function layout() {
      if (!stage) return;
      var r = stage.getBoundingClientRect();
      if (!r.width) return;
      cssW = r.width; cssH = r.height;
      dpr = Math.min(2.5, window.devicePixelRatio || 1);
      canvas.width = Math.round(cssW * dpr); canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ready = true;
      paintAll();
    }
    function loadSheet(id) {
      if (id) cur.sheet = id;
      var s = sheetById(cur.sheet);
      art.innerHTML = s.svg;
      cur.hist = []; cur.strokes = [];
      renderSheets();
      layout();
      if (set.sound) speak((s.name[lang] || s.name.ko) + '. ' + t('colorSay'));
    }
    function pt(e) {
      var r = canvas.getBoundingClientRect();
      var s = (e.touches && e.touches[0]) ? e.touches[0] : e;
      return { x: (s.clientX - r.left) / r.width, y: (s.clientY - r.top) / r.height, cx: s.clientX, cy: s.clientY };
    }
    function onDown(e) {
      if (e.button != null && e.button > 0) return;
      downPt = pt(e); moved = false;
      if (e.cancelable) { try { e.preventDefault(); } catch (err) {} }
    }
    function onMove(e) {
      if (!downPt) return;
      var p = pt(e);
      var d = Math.sqrt(Math.pow((p.x - downPt.x) * cssW, 2) + Math.pow((p.y - downPt.y) * cssH, 2));
      if (!moved && d > 9) {
        moved = true;
        cur.strokes.push({ color: cur.color, pts: [downPt] });
        ctx.fillStyle = cur.color;
        ctx.beginPath(); ctx.arc(downPt.x * cssW, downPt.y * cssH, 8, 0, 6.2832); ctx.fill();
      }
      if (moved) {
        var st = cur.strokes[cur.strokes.length - 1];
        var prev = st.pts[st.pts.length - 1];
        st.pts.push(p);
        ctx.strokeStyle = cur.color; ctx.lineWidth = 16; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(prev.x * cssW, prev.y * cssH);
        ctx.lineTo(p.x * cssW, p.y * cssH);
        ctx.stroke();
      }
      if (e.cancelable) { try { e.preventDefault(); } catch (err) {} }
    }
    function onUp(e) {
      if (!downPt) return;
      if (moved) {
        cur.hist.push({ kind: 'stroke' });
      } else {
        var s = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : e;
        var el = document.elementFromPoint(s.clientX, s.clientY);
        var rg = (el && el.closest) ? el.closest('[data-rg]') : null;
        if (rg) {
          var prevFill = rg.getAttribute('fill');
          rg.setAttribute('fill', cur.color);
          cur.hist.push({ kind: 'fill', el: rg, prev: prevFill });
          sfx('tap');
        }
      }
      downPt = null; moved = false;
    }
    function undo() {
      var h = cur.hist.pop();
      if (!h) { toast(t('colorEmpty')); return; }
      if (h.kind === 'fill') h.el.setAttribute('fill', h.prev || '#FFFFFF');
      else { cur.strokes.pop(); paintAll(); }
    }
    function clearAll() {
      cur.hist = []; cur.strokes = [];
      $$('#colorArt [data-rg]').forEach(function (el) { el.setAttribute('fill', '#FFFFFF'); });
      paintAll();
    }
    function save() {
      var svg = art.querySelector('svg');
      if (!svg) return;
      var used = cur.hist.length || cur.strokes.length;
      if (!used) { toast(t('colorEmpty')); return; }
      var clone = svg.cloneNode(true);
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clone.setAttribute('width', '800');
      clone.setAttribute('height', '600');
      var str = new XMLSerializer().serializeToString(clone);
      var cv = document.createElement('canvas');
      cv.width = 800; cv.height = 600;
      var c = cv.getContext('2d');
      c.fillStyle = '#FFFDF7'; c.fillRect(0, 0, 800, 600);
      var img = new Image();
      var done = function () {
        toast(t('colorSaved')); addStamp('color'); sfx('great'); praise(t('stampOne'));
        if (set.sound) speak(t('colorSaved'));
      };
      img.onload = function () {
        try {
          c.drawImage(img, 0, 0, 800, 600);
          c.drawImage(canvas, 0, 0, 800, 600);
          cv.toBlob(function (blob) {
            if (!blob) { toast(t('saveFail')); return; }
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = '두뇌놀이_색칠_' + (sheetById(cur.sheet).name.ko) + '_' + todayKey() + '.png';
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(function () { URL.revokeObjectURL(url); }, 8000);
            done();
          }, 'image/png');
        } catch (e) { toast(t('saveFail')); }
      };
      img.onerror = function () { toast(t('saveFail')); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(str);
    }
    function init() {
      stage = $('#colorStage'); art = $('#colorArt'); canvas = $('#colorInk');
      if (!stage || !canvas) return;
      ctx = canvas.getContext('2d');
      if (window.PointerEvent) {
        stage.addEventListener('pointerdown', onDown);
        stage.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', function () { downPt = null; moved = false; });
      } else {
        stage.addEventListener('touchstart', onDown, { passive: false });
        stage.addEventListener('touchmove', onMove, { passive: false });
        stage.addEventListener('touchend', onUp);
        stage.addEventListener('mousedown', onDown);
        stage.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
      }
      $('#colorSheets').addEventListener('click', function (e) {
        var b = e.target.closest('[data-sheet]');
        if (b) loadSheet(b.getAttribute('data-sheet'));
      });
      $('#palette').addEventListener('click', function (e) {
        var b = e.target.closest('[data-c]');
        if (!b) return;
        cur.color = b.getAttribute('data-c');
        renderPalette();
        sfx('tap');
      });
      $('#colorUndo').addEventListener('click', undo);
      $('#colorClear').addEventListener('click', clearAll);
      $('#colorSave').addEventListener('click', save);
      var rt = null;
      window.addEventListener('resize', function () {
        clearTimeout(rt);
        rt = setTimeout(function () { if (curScreen === 'color') layout(); }, 160);
      });
      renderPalette();
    }
    return {
      init: init,
      open: function () {
        if (!art.querySelector('svg')) loadSheet(cur.sheet);
        else { renderSheets(); layout(); }
      },
      refresh: function () { renderSheets(); renderPalette(); },
      layout: layout, save: save, undo: undo, clear: clearAll,
      state: cur
    };
  })();

  /* ═══════════ 6. 숨은그림찾기 ═══════════ */
  var HID = {
    butterfly: {
      n: { ko: '나비', en: 'Butterfly' }, e: '🦋',
      svg: '<g><ellipse cx="-9" cy="-4" rx="11" ry="13" fill="#E5A23B" transform="rotate(-20 -9 -4)"/>' +
        '<ellipse cx="9" cy="-4" rx="11" ry="13" fill="#E5A23B" transform="rotate(20 9 -4)"/>' +
        '<ellipse cx="-7" cy="10" rx="8" ry="9" fill="#D9822B"/>' +
        '<ellipse cx="7" cy="10" rx="8" ry="9" fill="#D9822B"/>' +
        '<rect x="-2.5" y="-12" width="5" height="26" rx="2.5" fill="#3A2C22"/></g>'
    },
    teacup: {
      n: { ko: '찻잔', en: 'Teacup' }, e: '☕',
      svg: '<g><path d="M-13 -6 h24 v9 a12 12 0 0 1 -24 0 z" fill="#FFFFFF" stroke="#5E5147" stroke-width="2.6"/>' +
        '<path d="M11 -3 a7 7 0 0 1 0 11" fill="none" stroke="#5E5147" stroke-width="2.6"/>' +
        '<ellipse cx="-1" cy="13" rx="17" ry="4" fill="#EFE2CB" stroke="#5E5147" stroke-width="2.4"/></g>'
    },
    key: {
      n: { ko: '열쇠', en: 'Key' }, e: '🔑',
      svg: '<g><circle cx="-11" cy="0" r="8" fill="none" stroke="#C9A227" stroke-width="4"/>' +
        '<rect x="-3" y="-2.5" width="23" height="5" rx="2.5" fill="#C9A227"/>' +
        '<rect x="12" y="2" width="4" height="9" rx="1.5" fill="#C9A227"/>' +
        '<rect x="18" y="2" width="4" height="6" rx="1.5" fill="#C9A227"/></g>'
    },
    pouch: {
      n: { ko: '복주머니', en: 'Lucky pouch' }, e: '🧧',
      svg: '<g><path d="M0 -7 C-13 -7 -18 3 -17 11 C-16 19 -8 23 0 23 C8 23 16 19 17 11 C18 3 13 -7 0 -7 Z" fill="#C0402C" stroke="#7E241B" stroke-width="2.4"/>' +
        '<path d="M-9 -7 h18 v5 h-18z" fill="#F2C14E"/>' +
        '<path d="M0 -7 C-6 -16 -15 -13 -12 -7 C-10 -2 -4 -3 0 -7 Z" fill="#F2C14E" stroke="#B07A22" stroke-width="2"/></g>'
    },
    apple: {
      n: { ko: '사과', en: 'Apple' }, e: '🍎',
      svg: '<g><path d="M0 -4 C-8 -12 -20 -9 -22 2 C-24 14 -14 22 -5 22 C-2 22 0 20 0 18 C0 20 2 22 5 22 C14 22 24 14 22 2 C20 -9 8 -12 0 -4 Z" fill="#C0402C" stroke="#7E241B" stroke-width="2.4"/>' +
        '<path d="M0 -5 C0 -10 1 -13 4 -16" fill="none" stroke="#6B4A2A" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M5 -14 c6 -5 12 -3 13 0 -5 4 -10 4 -13 1 z" fill="#4E8B3A"/></g>'
    },
    spoon: {
      n: { ko: '수저', en: 'Spoon' }, e: '🥄',
      svg: '<g><ellipse cx="-8" cy="-6" rx="7" ry="9" fill="#C8CFD4" stroke="#7A868E" stroke-width="2"/>' +
        '<rect x="-9.6" y="2" width="4" height="20" rx="2" fill="#C8CFD4" stroke="#7A868E" stroke-width="2"/>' +
        '<rect x="4" y="-8" width="3.4" height="30" rx="1.7" fill="#B98A5A"/></g>'
    },
    glasses: {
      n: { ko: '안경', en: 'Glasses' }, e: '👓',
      svg: '<g><circle cx="-11" cy="0" r="9" fill="none" stroke="#5E5147" stroke-width="3"/>' +
        '<circle cx="11" cy="0" r="9" fill="none" stroke="#5E5147" stroke-width="3"/>' +
        '<path d="M-2 0 h4" stroke="#5E5147" stroke-width="3"/>' +
        '<path d="M-20 -3 l-6 -4 M20 -3 l6 -4" stroke="#5E5147" stroke-width="3" stroke-linecap="round"/></g>'
    }
  };

  var SCENES = [
    { id: 'garden', name: { ko: '정원', en: 'Garden' },
      bg: '<rect width="400" height="300" fill="#EAF3E2"/>' +
        '<circle cx="338" cy="56" r="30" fill="#F7D35A"/>' +
        '<path d="M0 164 Q96 128 190 162 T400 156 L400 300 L0 300 Z" fill="#C6E0A8"/>' +
        '<path d="M0 212 Q120 184 240 212 T400 206 L400 300 L0 300 Z" fill="#AFD189"/>' +
        '<rect x="78" y="148" width="18" height="84" rx="8" fill="#8B5E3C"/>' +
        '<circle cx="87" cy="122" r="44" fill="#6FA84A"/>' +
        '<circle cx="50" cy="144" r="27" fill="#7CB755"/>' +
        '<circle cx="124" cy="144" r="27" fill="#7CB755"/>' +
        '<rect x="250" y="186" width="9" height="58" rx="4" fill="#D9B36B"/>' +
        '<rect x="274" y="186" width="9" height="58" rx="4" fill="#D9B36B"/>' +
        '<rect x="298" y="186" width="9" height="58" rx="4" fill="#D9B36B"/>' +
        '<rect x="322" y="186" width="9" height="58" rx="4" fill="#D9B36B"/>' +
        '<rect x="244" y="196" width="96" height="8" rx="4" fill="#C9A227"/>' +
        '<rect x="244" y="220" width="96" height="8" rx="4" fill="#C9A227"/>' +
        '<rect x="118" y="236" width="98" height="11" rx="5" fill="#A9714B"/>' +
        '<rect x="128" y="247" width="9" height="18" fill="#8B5E3C"/>' +
        '<rect x="197" y="247" width="9" height="18" fill="#8B5E3C"/>' +
        '<circle cx="32" cy="262" r="6" fill="#E98AA6"/><circle cx="46" cy="268" r="6" fill="#E98AA6"/>' +
        '<circle cx="238" cy="272" r="6" fill="#F2C63C"/><circle cx="252" cy="266" r="6" fill="#F2C63C"/>' +
        '<circle cx="214" cy="280" r="5" fill="#E98AA6"/>',
      items: [{ id: 'butterfly', x: 208, y: 104, s: 0.95 }, { id: 'teacup', x: 168, y: 224, s: 0.95 },
              { id: 'key', x: 330, y: 262, s: 0.95 }, { id: 'pouch', x: 44, y: 232, s: 0.95 }] },
    { id: 'kitchen', name: { ko: '부엌', en: 'Kitchen' },
      bg: '<rect width="400" height="300" fill="#F8EEDA"/>' +
        '<rect y="198" width="400" height="102" fill="#E4C9A2"/>' +
        '<ellipse cx="200" cy="262" rx="130" ry="30" fill="#EAD3AC"/>' +
        '<rect x="0" y="72" width="250" height="10" rx="4" fill="#C9A227"/>' +
        '<rect x="28" y="30" width="34" height="42" rx="8" fill="#C9DCE8" stroke="#7A9AAE" stroke-width="3"/>' +
        '<rect x="78" y="24" width="34" height="48" rx="8" fill="#E8D3B0" stroke="#A98B62" stroke-width="3"/>' +
        '<rect x="128" y="32" width="34" height="40" rx="8" fill="#C9DCE8" stroke="#7A9AAE" stroke-width="3"/>' +
        '<rect x="264" y="18" width="120" height="120" rx="8" fill="#EBD8B8" stroke="#B08F63" stroke-width="4"/>' +
        '<rect x="278" y="32" width="92" height="42" rx="4" fill="#F6EAD6" stroke="#C9AE84" stroke-width="3"/>' +
        '<rect x="278" y="84" width="92" height="42" rx="4" fill="#F6EAD6" stroke="#C9AE84" stroke-width="3"/>' +
        '<circle cx="324" cy="53" r="4" fill="#B08F63"/><circle cx="324" cy="105" r="4" fill="#B08F63"/>' +
        '<rect y="150" width="400" height="48" fill="#D9B98C"/>' +
        '<rect y="150" width="400" height="12" fill="#C7A473"/>' +
        '<rect x="36" y="112" width="72" height="38" rx="10" fill="#B7C2C8" stroke="#5E6E76" stroke-width="4"/>' +
        '<rect x="26" y="104" width="92" height="12" rx="6" fill="#9AA7AD" stroke="#5E6E76" stroke-width="3"/>' +
        '<rect x="132" y="128" width="104" height="22" rx="6" fill="#E8C79A" stroke="#A98B62" stroke-width="3"/>' +
        '<path d="M142 146 l38 -12 6 4 -38 12 z" fill="#D3DADE" stroke="#7A868E" stroke-width="2.6"/>' +
        '<rect x="250" y="120" width="34" height="30" rx="6" fill="#E8D3B0" stroke="#A98B62" stroke-width="3"/>',
      items: [{ id: 'apple', x: 200, y: 42, s: 0.9 }, { id: 'teacup', x: 246, y: 134, s: 0.9 },
              { id: 'spoon', x: 198, y: 138, s: 0.95 }, { id: 'key', x: 330, y: 238, s: 0.95 }] },
    { id: 'room', name: { ko: '방', en: 'Room' },
      bg: '<rect width="400" height="300" fill="#F5E8D2"/>' +
        '<rect y="204" width="400" height="96" fill="#E3C9A4"/>' +
        '<rect x="36" y="34" width="126" height="104" rx="6" fill="#CFE7F5" stroke="#A98B62" stroke-width="6"/>' +
        '<path d="M99 34 v104 M36 86 h126" stroke="#A98B62" stroke-width="6"/>' +
        '<path d="M36 34 q20 0 26 26 v78 h-26z" fill="#E9C7CE"/>' +
        '<path d="M162 34 q-20 0 -26 26 v78 h26z" fill="#E9C7CE"/>' +
        '<ellipse cx="250" cy="258" rx="120" ry="26" fill="#EBC9A9"/>' +
        '<rect x="206" y="196" width="164" height="72" rx="10" fill="#F3D8DC" stroke="#C99AA4" stroke-width="4"/>' +
        '<path d="M206 216 h164" stroke="#E3BCC4" stroke-width="3"/>' +
        '<rect x="220" y="180" width="56" height="28" rx="12" fill="#FFFFFF" stroke="#C99AA4" stroke-width="3"/>' +
        '<rect x="30" y="186" width="112" height="76" rx="8" fill="#C99A6B" stroke="#8B5E3C" stroke-width="4"/>' +
        '<path d="M30 210 h112 M30 236 h112" stroke="#8B5E3C" stroke-width="3"/>' +
        '<circle cx="86" cy="198" r="4" fill="#8B5E3C"/><circle cx="86" cy="224" r="4" fill="#8B5E3C"/>' +
        '<rect x="352" y="150" width="10" height="54" fill="#8B5E3C"/>' +
        '<path d="M334 150 h46 l-9 -34 h-28 z" fill="#F2C14E" stroke="#B07A22" stroke-width="3"/>',
      items: [{ id: 'glasses', x: 86, y: 224, s: 0.95 }, { id: 'key', x: 186, y: 232, s: 0.95 },
              { id: 'pouch', x: 300, y: 204, s: 0.95 }, { id: 'apple', x: 56, y: 272, s: 0.9 }] }
  ];

  var HIDDEN = (function () {
    var idx = 0, found = [];
    function scene() { return SCENES[idx]; }
    function renderChips() {
      $('#hiddenScenes').innerHTML = SCENES.map(function (s, i) {
        return '<button type="button" class="chip" data-scene="' + i + '" aria-pressed="' + (i === idx ? 'true' : 'false') +
          '"><span>' + esc(s.name[lang] || s.name.ko) + '</span></button>';
      }).join('');
    }
    function renderList() {
      var sc = scene();
      $('#findList').innerHTML = sc.items.map(function (it) {
        var h = HID[it.id];
        var done = found.indexOf(it.id) >= 0;
        return '<button type="button" class="find' + (done ? ' done' : '') + '" data-say="' + it.id + '">' +
          '<span class="fe">' + (done ? '✅' : h.e) + '</span><span>' + esc(h.n[lang] || h.n.ko) + '</span></button>';
      }).join('');
    }
    function msg(text, good) {
      var el = $('#hiddenMsg');
      el.textContent = text || '';
      el.className = 'xfb' + (good ? ' good' : '');
    }
    function render() {
      var sc = scene();
      found = [];
      $('#hiddenArt').innerHTML = '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">' + sc.bg +
        sc.items.map(function (it) {
          return '<g class="hid" data-fid="' + it.id + '" transform="translate(' + it.x + ',' + it.y + ') scale(' + it.s + ')">' +
            HID[it.id].svg +
            '<circle class="ring" r="32" fill="none" stroke="#2C6B4B" stroke-width="4" stroke-dasharray="7 5"/>' +
            '<circle r="34" fill="rgba(0,0,0,0)"/></g>';
        }).join('') + '</svg>';
      renderChips(); renderList();
      msg(t('findStart', { n: sc.items.length }));
    }
    function hit(g) {
      var id = g.getAttribute('data-fid');
      if (!id || g.classList.contains('found')) return;
      g.classList.add('found');
      found.push(id);
      sfx('good');
      praise(rnd(PRAISE[lang] || PRAISE.ko));
      msg(t('foundOne', { n: HID[id].n[lang] || HID[id].n.ko }), true);
      if (set.sound) speak(t('foundOne', { n: HID[id].n[lang] || HID[id].n.ko }));
      renderList();
      if (found.length === scene().items.length) setTimeout(complete, 700);
    }
    function miss() {
      if (found.length === scene().items.length) return;
      sfx('soft');
      msg(t('notHere'));
    }
    function complete() {
      addStamp('hidden');
      sfx('great');
      openDone({
        emoji: '🔍',
        title: t('findDone'),
        text: t('findDoneText', { n: found.length }) + ' ' + t('stampOne'),
        onAgain: function () { next(); }
      });
      speak(t('findDone'));
    }
    function next() {
      idx = (idx + 1) % SCENES.length;
      render();
      if (set.sound) speak((scene().name[lang] || scene().name.ko) + '. ' + t('findSay'));
    }
    function hint() {
      var sc = scene();
      for (var i = 0; i < sc.items.length; i++) {
        if (found.indexOf(sc.items[i].id) < 0) {
          var g = $('#hiddenArt [data-fid="' + sc.items[i].id + '"]');
          if (g) {
            g.classList.add('hint');
            setTimeout(function () { g.classList.remove('hint'); }, 2400);
          }
          if (set.sound) speak(t('hintSay', { n: HID[sc.items[i].id].n[lang] || HID[sc.items[i].id].n.ko }));
          return;
        }
      }
    }
    function init() {
      $('#hiddenArt').addEventListener('click', function (e) {
        var g = e.target.closest ? e.target.closest('[data-fid]') : null;
        if (g) hit(g); else miss();
      });
      $('#findList').addEventListener('click', function (e) {
        var b = e.target.closest('[data-say]');
        if (!b) return;
        var h = HID[b.getAttribute('data-say')];
        if (h && set.sound) speak(h.n[lang] || h.n.ko);
      });
      $('#hiddenScenes').addEventListener('click', function (e) {
        var b = e.target.closest('[data-scene]');
        if (!b) return;
        idx = Number(b.getAttribute('data-scene'));
        render();
      });
      $('#hiddenHint').addEventListener('click', hint);
      $('#hiddenRestart').addEventListener('click', next);
      renderChips();
    }
    return {
      init: init, open: function () { render(); if (set.sound) setTimeout(function () { speak(t('findSay')); }, 250); },
      refresh: function () { renderChips(); renderList(); },
      next: next, state: function () { return { idx: idx, found: found.slice() }; }
    };
  })();

  /* ═══════════ 놀이 끝 덮개 ═══════════ */
  var doneCb = null;
  function openDone(o) {
    hidePraise();
    doneCb = o || {};
    $('#doneEmoji').textContent = doneCb.emoji || '🎉';
    $('#doneTitle').textContent = doneCb.title || t('doneSay');
    $('#doneText').textContent = doneCb.text || '';
    $('#doneWrap').hidden = false;
    pushLayer(function () { $('#doneWrap').hidden = true; });
  }
  function closeDone(cb) {
    $('#doneWrap').hidden = true;
    if (layers.length) { try { history.back(); } catch (e) {} }
    if (cb) setTimeout(cb, 90);
  }

  /* ═══════════ 설치·공유 ═══════════ */
  var instPrompt = null, instOn = false, instDone = false;
  function isStandaloneNow() {
    try {
      return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator.standalone === true;
    } catch (e) { return false; }
  }
  function uaIsIOS() { return /iPad|iPhone|iPod/.test(navigator.userAgent); }
  function uaIsSamsung() { return /SamsungBrowser/.test(navigator.userAgent); }
  function uaIsAndroid() { return /Android/.test(navigator.userAgent); }
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
  function hideInstall() { $('#instWrap').hidden = true; instOn = false; }
  function closeInstall(byButton) {
    if ($('#instWrap').hidden) return;
    if (instOn && byButton && layers.length) { instOn = false; try { history.back(); return; } catch (e) {} }
    hideInstall();
  }
  function openInstall() {
    $('#instSteps').innerHTML = instStepsHTML();
    $('#instTip').innerHTML = instTipHTML();
    $('#instWrap').hidden = false;
    instOn = true;
    pushLayer(function () { hideInstall(); });
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

  /* ═══════════ 언어·글씨 크게 ═══════════ */
  function applyLang() {
    document.documentElement.lang = (lang === 'ko') ? 'ko' : 'en';
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    renderHome();
    syncToggles();
    if (MATCH.cards.length) { MATCH.renderLevels(); MATCH.renderBoard(); }
    if (QUIZ.quiz) QUIZ.quiz.refresh();
    if (QUIZ.calc) QUIZ.calc.refresh();
    BRUSH.refresh();
    COLOR.refresh();
    HIDDEN.refresh();
  }
  function applyBig(on) {
    set.big = !!on;
    document.documentElement.classList.toggle('big', set.big);
    saveSet(); syncToggles();
  }

  /* ═══════════ 이벤트 묶기 ═══════════ */
  function bind() {
    $('#langBtn').addEventListener('click', function () {
      lang = (lang === 'ko') ? 'en' : 'ko';
      saveSet();
      stopSpeak();
      applyLang();
    });
    $('#installTop').addEventListener('click', installTap);
    $('#shareTop').addEventListener('click', shareApp);
    $('#instOk').addEventListener('click', function () { closeInstall(true); });
    $('#instWrap').addEventListener('click', function (e) { if (e.target === $('#instWrap')) closeInstall(true); });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (!$('#instWrap').hidden) closeInstall(true);
    });

    $('#soundBtn').addEventListener('click', function () {
      setSound(!set.sound);
      if (set.sound) speak(t('helloMsg'));
    });
    $('#bigBtn').addEventListener('click', function () { applyBig(!set.big); });
    $$('[data-tts]').forEach(function (b) {
      b.addEventListener('click', function () {
        setSound(!set.sound);
        if (set.sound) {
          if (curScreen === 'quiz' || curScreen === 'calc') speakQuizNow(curScreen);
          else if (curScreen === 'brush') speak(t(guideSay()));
          else if (curScreen === 'match') speak(t('openMatch'));
        }
      });
    });

    $('#menu').addEventListener('click', function (e) {
      var b = e.target.closest('[data-open]');
      if (!b) return;
      var name = b.getAttribute('data-open');
      ensureAudio();
      openGame(name);
    });

    $('#levels').addEventListener('click', function (e) {
      var b = e.target.closest('[data-level]');
      if (!b) return;
      MATCH.start(b.getAttribute('data-level'));
      if (set.sound) speak(t('matchTitle') + ' ' + t(b.getAttribute('data-level') === 'easy' ? 'lvEasy' : (b.getAttribute('data-level') === 'normal' ? 'lvNormal' : 'lvHard')));
    });
    $('#board').addEventListener('click', function (e) {
      var b = e.target.closest('[data-idx]');
      if (b) MATCH.flip(Number(b.getAttribute('data-idx')));
    });
    $('#mRestart').addEventListener('click', function () { MATCH.start(); });

    $('#doneAgain').addEventListener('click', function () {
      var cb = doneCb && doneCb.onAgain;
      closeDone(cb);
    });
    $('#doneHome').addEventListener('click', function () {
      closeDone(function () { goBack(); });
    });

    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-back]')) { goBack(); }
    });

    window.addEventListener('beforeinstallprompt', function (e) {
      try { e.preventDefault(); } catch (err) {}
      instPrompt = e;
    });
    window.addEventListener('appinstalled', function () {
      instDone = true; instPrompt = null; toast(t('installed'));
    });

    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') return;
      renderHome();
    });
    window.addEventListener('resize', function () { renderHome(); });
  }

  var guidesSay = { bok: 'sayBok', health: 'sayHealth', love: 'sayLove', hyo: 'sayHyo', gana: 'sayGana', free: 'sayFree' };
  function guideSay() { return guidesSay[set.guide] || 'sayBok'; }
  function ensureAudio() { try { ac(); } catch (e) {} }
  function speakQuizNow(which) {
    var el = document.querySelector('#screen-' + which + ' .readbtn');
    if (el) el.click();
  }

  /* ═══════════ 시작 ═══════════ */
  function init() {
    loadSet();
    if (set.big) document.documentElement.classList.add('big');
    QUIZ.quiz = makeQuiz({
      root: $('#screen-quiz'), kind: 'quiz',
      cats: [
        { id: 'proverb', name: { ko: '속담', en: 'Proverbs' }, pool: PROVERBS },
        { id: 'season', name: { ko: '사계절·낱말', en: 'Seasons' }, pool: SEASONS }
      ]
    });
    QUIZ.calc = makeQuiz({
      root: $('#screen-calc'), kind: 'calc',
      cats: [
        { id: 'shop', name: { ko: '장보기', en: 'Shopping' }, pool: SHOP },
        { id: 'change', name: { ko: '거스름돈', en: 'Change' }, pool: CHANGE }
      ]
    });
    BRUSH.init();
    COLOR.init();
    HIDDEN.init();
    bind();
    applyLang();
    try { history.replaceState({ brain: 0 }, ''); } catch (e) {}
    if ('serviceWorker' in navigator) {
      try { navigator.serviceWorker.register('./sw.js').catch(function () {}); } catch (e) {}
    }
  }

  window.__brain = { MATCH: MATCH, QUIZ: QUIZ, BRUSH: BRUSH, COLOR: COLOR, HIDDEN: HIDDEN, openGame: openGame, goBack: goBack, get set() { return set; } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
