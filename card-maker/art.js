/* 와글링 카드 — 카드 배경 · 사진 액자 그림 (100% 자체 오리지널 SVG)
   v2: 중국식 홍등·금색 구름문양을 걷어내고 한국 전통(청사초롱·까치·소나무·매화·한옥 처마·
   창호지·색동·한지·해돋이·복주머니)과 크리스마스를 담았다. 2D/3D 두 벌, 사진 액자 8종.
   v3: 해마다 바뀌는 간지·띠를 WC_ART.setYear()로 받아 테마 이름·설명·추천 문구와
   새해 배경의 띠 동물(십이지신 스티커)을 함께 바꾼다. */
(function () {
  'use strict';
  var W = 1080, H = 1440, uid = 0;

  function sv(inner, defs) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' +
      (defs ? '<defs>' + defs + '</defs>' : '') + inner + '</svg>';
  }
  function lg(id, x1, y1, x2, y2, stops) {
    return '<linearGradient id="' + id + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' +
      stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] != null ? ' stop-opacity="' + s[2] + '"' : '') + '/>'; }).join('') +
      '</linearGradient>';
  }
  function rg(id, cx, cy, r, stops) {
    return '<radialGradient id="' + id + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '">' +
      stops.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] != null ? ' stop-opacity="' + s[2] + '"' : '') + '/>'; }).join('') +
      '</radialGradient>';
  }
  function rnd(seed) { var s = seed; return function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; }; }

  function stk(key, gloss) {
    var r = window.WC_STICKERS.inner(key, gloss);
    var p = 'k' + (++uid) + '_';
    var d = r.d.replace(/id="([pl]\d+)"/g, function (m, id) { return 'id="' + p + id + '"'; })
      .replace(/url\(#([pl]\d+)\)/g, function (m, id) { return 'url(#' + p + id + ')'; });
    var b = r.b.replace(/url\(#([pl]\d+)\)/g, function (m, id) { return 'url(#' + p + id + ')'; });
    return { d: d, b: b };
  }
  function put(key, cx, cy, size, gloss, filter, rot) {
    var r = stk(key, gloss), k = size / 100;
    return '<g transform="translate(' + (cx - size / 2) + ' ' + (cy - size / 2) + ') scale(' + k + ')' +
      (rot ? ' rotate(' + rot + ' 50 50)' : '') + '"' +
      (filter ? ' filter="' + filter + '"' : '') + '><defs>' + r.d + '</defs>' + r.b + '</g>';
  }

  function sparklePath(x, y, r, col, op) {
    return '<path d="M' + x + ' ' + (y - r) + 'c' + (r * .18).toFixed(2) + ' ' + (r * .55).toFixed(2) + ' ' + (r * .45).toFixed(2) + ' ' + (r * .82).toFixed(2) + ' ' + (r * .82).toFixed(2) + ' ' + (r * .82).toFixed(2) +
      'c-' + (r * .37).toFixed(2) + ' 0-' + (r * .64).toFixed(2) + ' ' + (r * .3).toFixed(2) + '-' + (r * .82).toFixed(2) + ' ' + (r * .82).toFixed(2) +
      'c-' + (r * .18).toFixed(2) + '-' + (r * .55).toFixed(2) + '-' + (r * .45).toFixed(2) + '-' + (r * .82).toFixed(2) + '-' + (r * .82).toFixed(2) + '-' + (r * .82).toFixed(2) +
      'c' + (r * .37).toFixed(2) + ' 0 ' + (r * .64).toFixed(2) + '-' + (r * .3).toFixed(2) + ' ' + (r * .82).toFixed(2) + '-' + (r * .82).toFixed(2) + 'z" fill="' + col + '" opacity="' + (op == null ? 1 : op) + '"/>';
  }
  function blossom(x, y, r, petal, center, op) {
    var s = '';
    for (var i = 0; i < 5; i++) s += '<circle cx="' + x + '" cy="' + (y - r * .92).toFixed(1) + '" r="' + (r * .40).toFixed(1) + '" fill="' + petal + '" transform="rotate(' + (i * 72) + ' ' + x + ' ' + y + ')"/>';
    return '<g opacity="' + (op == null ? 1 : op) + '">' + s + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * .28).toFixed(1) + '" fill="' + center + '"/></g>';
  }
  function glow(cx, cy, r, col, op) {
    var id = 'gl' + (++uid);
    return '<defs>' + rg(id, .5, .5, .5, [[0, col, op], [.55, col, op * .45], [1, col, 0]]) + '</defs>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#' + id + ')"/>';
  }
  function dots(seed, n, color, rmin, rmax, x0, y0, x1, y1, op) {
    var R = rnd(seed), s = '';
    for (var i = 0; i < n; i++) {
      s += '<circle cx="' + (x0 + R() * (x1 - x0)).toFixed(0) + '" cy="' + (y0 + R() * (y1 - y0)).toFixed(0) + '" r="' +
        (rmin + R() * (rmax - rmin)).toFixed(2) + '" fill="' + color + '" opacity="' + (op * (.4 + R() * .6)).toFixed(2) + '"/>';
    }
    return s;
  }
  function fibers(seed, n, color, op) {
    var R = rnd(seed), s = '';
    for (var i = 0; i < n; i++) {
      var x = R() * W, y = R() * H, len = 10 + R() * 40, a = R() * 3.14;
      s += '<path d="M' + x.toFixed(0) + ' ' + y.toFixed(0) + 'l' + (Math.cos(a) * len).toFixed(0) + ' ' + (Math.sin(a) * len).toFixed(0) +
        '" stroke="' + color + '" stroke-width="' + (1 + R() * 1.6).toFixed(1) + '" opacity="' + (op * (.3 + R() * .7)).toFixed(2) + '" stroke-linecap="round"/>';
    }
    return s;
  }
  function confetti(seed, n, colors, y0, y1) {
    var R = rnd(seed), s = '';
    for (var i = 0; i < n; i++) {
      var x = 30 + R() * (W - 60), y = y0 + R() * (y1 - y0), w = 10 + R() * 14, h = 6 + R() * 8;
      var c = colors[Math.floor(R() * colors.length)];
      var shape = Math.floor(R() * 3);
      if (shape === 0) s += '<rect x="' + x.toFixed(0) + '" y="' + y.toFixed(0) + '" width="' + w.toFixed(0) + '" height="' + h.toFixed(0) + '" rx="3" fill="' + c + '" opacity=".85" transform="rotate(' + (R() * 90 - 45).toFixed(0) + ' ' + x.toFixed(0) + ' ' + y.toFixed(0) + ')"/>';
      else if (shape === 1) s += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + (h / 2).toFixed(0) + '" fill="' + c + '" opacity=".85"/>';
      else s += sparklePath(x, y, 8 + R() * 7, c, .8);
    }
    return s;
  }
  function frameRect(inset, color, w, op, rx) {
    return '<rect x="' + inset + '" y="' + inset + '" width="' + (W - inset * 2) + '" height="' + (H - inset * 2) + '" rx="' + (rx || 0) + '" fill="none" stroke="' + color + '" stroke-width="' + w + '" opacity="' + op + '"/>';
  }
  function waveBand(y, color, op, amp, step) {
    var d = 'M-20 ' + y;
    for (var x = -20; x < W + 40; x += step) d += ' q' + (step / 4) + ' -' + amp + ' ' + (step / 2) + ' 0 q' + (step / 4) + ' ' + amp + ' ' + (step / 2) + ' 0';
    d += ' V' + (y + 260) + ' H-20 Z';
    return '<path d="' + d + '" fill="' + color + '" opacity="' + op + '"/>';
  }
  function sunburst(cx, cy, n, color, op, r1, r2) {
    var s = '';
    for (var i = 0; i < n; i++) {
      var a = i * 2 * Math.PI / n;
      s += '<path d="M' + (cx + Math.cos(a) * r1).toFixed(0) + ' ' + (cy + Math.sin(a) * r1).toFixed(0) + 'L' +
        (cx + Math.cos(a - .05) * r2).toFixed(0) + ' ' + (cy + Math.sin(a - .05) * r2).toFixed(0) + 'L' +
        (cx + Math.cos(a + .05) * r2).toFixed(0) + ' ' + (cy + Math.sin(a + .05) * r2).toFixed(0) + 'z" fill="' + color + '" opacity="' + op + '"/>';
    }
    return s;
  }
  function hills(baseY, colors) {
    var s = '';
    colors.forEach(function (c, i) {
      var y = baseY + i * 46;
      s += '<path d="M0 ' + y + 'c120 -' + (90 - i * 18) + ' 240 -' + (30 + i * 8) + ' 360 0s220 -' + (70 - i * 12) + ' 360 0 260 -40 360 -10V1440H0z" fill="' + c + '"/>';
    });
    return s;
  }

  /* ── 한국 전통 장식 헬퍼 ─────────────────────────────── */

  /* 한옥 처마 띠 (화면 위쪽) */
  function eave(g) {
    var tile = g ? 'url(#eav)' : '#3A2A2C';
    var s = '';
    s += '<path d="M0 0h1080v66c-140 20-250 6-380 14s-240 22-360 10S160 78 0 92z" fill="' + tile + '"/>';
    /* 기와 골 */
    for (var i = 0; i < 24; i++) {
      var x = 14 + i * 46;
      s += '<path d="M' + x + ' 4c3 24 3 46 1 66" stroke="rgba(255,255,255,.16)" stroke-width="3" fill="none"/>';
    }
    /* 처마 끝 와당 */
    for (var j = 0; j < 24; j++) {
      s += '<circle cx="' + (14 + j * 46) + '" cy="' + (72 + Math.sin(j * .5) * 8) + '" r="7" fill="' + (g ? '#E8C173' : '#C9A24A') + '" opacity=".55"/>';
    }
    /* 단청 띠 */
    s += '<path d="M0 96c140-14 250-2 380-10s240-20 360-8 200 2 340-12v34H0z" fill="#2E6E46" opacity=".92"/>';
    for (var k = 0; k < 12; k++) {
      s += '<circle cx="' + (48 + k * 92) + '" cy="110" r="5" fill="#E8B84A" opacity=".9"/>' +
        '<circle cx="' + (94 + k * 92) + '" cy="108" r="3.4" fill="#D8534F" opacity=".85"/>';
    }
    s += '<path d="M0 96c140-14 250-2 380-10s240-20 360-8 200 2 340-12" fill="none" stroke="#E8C173" stroke-width="2.4" opacity=".55"/>';
    return s;
  }

  /* 색동 띠 */
  function saekdong(y, h, op) {
    var cols = ['#2E5EAA', '#C8302F', '#F2C14E', '#3E8E5A', '#D4657F'];
    var s = '';
    for (var i = 0; i < 5; i++) {
      var yy = y + i * (h / 5);
      s += '<path d="M-10 ' + yy + 'c200 -26 420 -26 620 0s280 8 480-6v' + (h / 5) + 'c-200 14-280 6-480-6s-420 26-620 0z" fill="' + cols[i] + '" opacity="' + op + '"/>';
    }
    s += '<path d="M-10 ' + y + 'c200 -26 420 -26 620 0s280 8 480-6" fill="none" stroke="#E8B84A" stroke-width="2.6" opacity=".8"/>';
    return s;
  }

  /* 창호지 문살 */
  function lattice(x, y, w, h, cols, rows) {
    var s = '';
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="#B98A5A"/>';
    s += '<rect x="' + (x + 10) + '" y="' + (y + 10) + '" width="' + (w - 20) + '" height="' + (h - 20) + '" fill="#FFFBF0"/>';
    var i;
    for (i = 1; i < cols; i++) s += '<rect x="' + (x + 10 + i * (w - 20) / cols - 3) + '" y="' + (y + 10) + '" width="6" height="' + (h - 20) + '" fill="#B98A5A" opacity=".85"/>';
    for (i = 1; i < rows; i++) s += '<rect x="' + (x + 10) + '" y="' + (y + 10 + i * (h - 20) / rows - 3) + '" width="' + (w - 20) + '" height="6" fill="#B98A5A" opacity=".8"/>';
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="none" stroke="#8A5E3A" stroke-width="3"/>';
    s += '<circle cx="' + (x + w / 2) + '" cy="' + (y + h / 2) + '" r="7" fill="#D8342F" opacity=".9"/>' +
      blossom(x + w / 2, y + h / 2, 16, '#F7C6D2', '#E8A93C', .95);
    return s;
  }

  /* 눈송이 */
  function flake(x, y, r, op) {
    var s = '';
    for (var i = 0; i < 3; i++) {
      var a = i * 60 * Math.PI / 180;
      s += '<path d="M' + (x - Math.cos(a) * r).toFixed(1) + ' ' + (y - Math.sin(a) * r).toFixed(1) + 'L' +
        (x + Math.cos(a) * r).toFixed(1) + ' ' + (y + Math.sin(a) * r).toFixed(1) + '" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/>';
      var bx = x + Math.cos(a) * r * .5, by = y + Math.sin(a) * r * .5;
      s += '<path d="M' + bx.toFixed(1) + ' ' + by.toFixed(1) + 'l' + (Math.cos(a + .8) * r * .34).toFixed(1) + ' ' + (Math.sin(a + .8) * r * .34).toFixed(1) +
        'M' + bx.toFixed(1) + ' ' + by.toFixed(1) + 'l' + (Math.cos(a - .8) * r * .34).toFixed(1) + ' ' + (Math.sin(a - .8) * r * .34).toFixed(1) + '" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>';
    }
    return '<g opacity="' + op + '">' + s + '</g>';
  }

  /* 소나무 실루엣 (눈 쌓인 겨울 산) */
  function pineSil(x, y, s, color, op) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')" fill="' + color + '" opacity="' + op + '">' +
      '<path d="M0 0c-6-14-22-24-26-40-10 18-4 32 10 40zM0 0c6-14 22-24 26-40 10 18 4 32-10 40zM0 0c-4-18-2-34 0-48 2 14 4 30 0 48z"/></g>';
  }

  /* ── 테마 ─────────────────────────────────────────────── */

  var THEMES = [
    { id: 'jeongmi', name: '{G}년 한지', nameEn: '{Y} New Year', tag: '새해', tagEn: 'New Year',
      sub: '{A}의 해 · 한지와 색동', subEn: 'Year of the {AE} on Korean paper', ink: '#FFF3D6', accent: '#F6D68F', swatch: '#A81C2C', font: 'jua',
      greeting: '새해 복 많이 받으세요', greetingEn: 'Happy New Year {Y}!',
      chips: ['새해 복 많이 받으세요', '{Y} {G}년, 복 많이 받으세요', '건강하고 행복한 한 해 되세요', '하는 일마다 형통하소서', '설날 복 많이 받으세요', '올 한 해도 함께해요'],
      chipsEn: ['Happy New Year {Y}!', 'Wishing you a joyful Year of the {AE}', 'May blessings fill your new year', 'Wishing you health and happiness all year', 'Best wishes for the Lunar New Year', 'Happy Seollal to your family'] },
    { id: 'haedon', name: '신년 해돋이', nameEn: 'New Year Sunrise', tag: '새해', tagEn: 'New Year',
      sub: '첫 해처럼 환한 한 해', subEn: 'A year as bright as the first sun', ink: '#6B2F16', accent: '#C8541A', swatch: '#FFC98F', font: 'jua',
      greeting: '새해 복 많이 받으세요', greetingEn: 'Happy New Year!',
      chips: ['새해 첫 해처럼 힘차게 시작해요', '{Y}년, 좋은 일만 가득하길', '해돋이처럼 밝은 한 해 되세요', '새해 복 많이 받으세요', '올 한 해 건강하세요', '새로운 시작을 응원해요'],
      chipsEn: ['Happy New Year! Here is to new beginnings', 'May your year rise bright as the sun', 'Wishing you a hopeful new morning', 'New year, new light, new joy', 'Warm wishes at sunrise', 'May every day of {Y} shine for you'] },
    { id: 'seollal', name: '설날 창호지', nameEn: 'Seollal Hanji', tag: '설날', tagEn: 'Seollal',
      sub: '떡국 한 그릇의 마음', subEn: 'Warmth of a bowl of tteokguk', ink: '#5A2A21', accent: '#C8302F', swatch: '#F6E7CC', font: 'gowun',
      greeting: '설날 복 많이 받으세요', greetingEn: 'Happy Seollal!',
      chips: ['설날 복 많이 받으세요', '떡국 한 그릇처럼 따뜻한 한 해', '가족 모두 행복하세요', '어머니 아버지 새해 복 많이 받으세요', '올해도 건강하세요', '복 많이 받으세요'],
      chipsEn: ['Happy Seollal! Have a warm bowl of tteokguk', 'Wishing your family peace and health', 'May blessings fill your home', 'Happy Lunar New Year to you and yours', 'A joyful holiday with family', 'Health and happiness to your whole family'] },
    { id: 'byeolbam', name: '새해 새벽별', nameEn: 'Starry New Year', tag: '새해', tagEn: 'New Year',
      sub: '별빛 아래 첫 인사', subEn: 'A first greeting under the stars', ink: '#FFF3D6', accent: '#F6D68F', swatch: '#17224A', font: 'gowun',
      greeting: '새해 복 많이 받으세요', greetingEn: 'Happy New Year under the stars',
      chips: ['새해 복 많이 받으세요', '별처럼 빛나는 한 해 되세요', '{Y} {G}년, 복 가득하세요', '소원 이루어지는 한 해', '좋은 일만 가득하세요', '올 한 해도 잘 부탁해요'],
      chipsEn: ['Happy New Year under the stars', 'May your wishes come true', 'Shine bright in {Y}', 'A peaceful new year night to you', 'May the stars guide you', 'Sweet dreams and a happy new year'] },
    { id: 'snowtree', name: '눈 내리는 크리스마스', nameEn: 'Snowy Christmas', tag: '크리스마스', tagEn: 'Christmas',
      sub: '반짝이는 트리와 눈', subEn: 'A sparkling tree in the snow', ink: '#F2F7FF', accent: '#9ED4FF', swatch: '#1B2E5C', font: 'jua',
      greeting: '메리 크리스마스!', greetingEn: 'Merry Christmas!',
      chips: ['메리 크리스마스!', '눈처럼 반짝이는 하루 되세요', '따뜻한 크리스마스 보내세요', '메리 크리스마스 & 해피 뉴 이어', '사랑을 담아 보내요', '평화롭고 행복한 성탄절'],
      chipsEn: ['Merry Christmas!', 'Wishing you a magical Christmas', 'May your days sparkle like snow', 'Merry Christmas and a Happy New Year', 'Sending you warm hugs', 'Wishing you peace, joy and love'] },
    { id: 'xmasnight', name: '벽난로 선물의 밤', nameEn: 'Christmas by the Fire', tag: '크리스마스', tagEn: 'Christmas',
      sub: '따뜻한 벽난로와 선물', subEn: 'A warm fire and presents', ink: '#FFEFD2', accent: '#F6C453', swatch: '#4A2430', font: 'gowun',
      greeting: '메리 크리스마스', greetingEn: 'Merry Christmas',
      chips: ['메리 크리스마스', '벽난로처럼 따뜻한 밤 되세요', '우리 가족 모두 메리 크리스마스', '선물보다 소중한 사람들', '즐거운 성탄절 보내세요', '따뜻한 마음을 전해요'],
      chipsEn: ['Merry Christmas from our home to yours', 'May your Christmas be warm and cozy', 'A night full of joy to you', 'Enjoy the little moments', 'Warmest wishes this season', 'Have a blessed Christmas Eve'] },
    { id: 'xmasmorning', name: '눈 내린 마을', nameEn: 'Snowy Village', tag: '크리스마스', tagEn: 'Christmas',
      sub: '첫눈 내린 고요한 아침', subEn: 'A quiet white Christmas morning', ink: '#22405A', accent: '#4A7EA8', swatch: '#E4F0FF', font: 'gowun',
      greeting: '즐거운 성탄절 보내세요', greetingEn: 'Merry Christmas!',
      chips: ['즐거운 성탄절 아침이에요', '화이트 크리스마스 되세요', '눈 내린 아침, 행복하세요', '메리 크리스마스!', '사랑하는 가족에게', '따뜻한 겨울 보내세요'],
      chipsEn: ['Good morning and Merry Christmas!', 'Wishing you a white Christmas', 'A Christmas morning full of smiles', 'Merry Christmas! Stay warm and happy', 'Happy holidays from all of us', 'Snow much love this Christmas'] },
    { id: 'birthday', name: '생일 파티', nameEn: 'Birthday Party', tag: '생일', tagEn: 'Birthday',
      sub: '케이크와 풍선', subEn: 'Cake and balloons', ink: '#5A2540', accent: '#E05D84', swatch: '#FFD7E6', font: 'jua',
      greeting: '생일 축하해요!', greetingEn: 'Happy Birthday!',
      chips: ['생일 축하해요!', '태어나 줘서 고마워요', '오늘 하루가 가장 반짝이길', '사랑하는 ○○아, 생일 축하해', '행복한 하루 보내세요', '늘 건강하고 웃자'],
      chipsEn: ['Happy Birthday!', 'Wishing you the happiest birthday', 'So glad you were born', 'May all your wishes come true', 'Have a wonderful year ahead', 'Cheers to you on your special day'] },
    { id: 'congrats', name: '축하 소식', nameEn: 'Congratulations', tag: '축하', tagEn: 'Congrats',
      sub: '합격·개업·첫걸음', subEn: 'Passing, opening, first step', ink: '#1D3B5C', accent: '#C99A2C', swatch: '#DDF2FF', font: 'jua',
      greeting: '축하합니다!', greetingEn: 'Congratulations!',
      chips: ['축하합니다!', '합격을 진심으로 축하해요', '첫걸음, 멋지게 응원해요', '개업을 축하드립니다', '노력이 꽃피웠네요', '정말 자랑스러워요'],
      chipsEn: ['Congratulations!', 'So proud of you', 'Wishing you every success', 'Well deserved! Congratulations', 'Cheers to your new beginning', 'Wishing you great things ahead'] },
    { id: 'thanks', name: '감사 마음', nameEn: 'Thank You', tag: '감사', tagEn: 'Thanks',
      sub: '동백꽃 한 가지', subEn: 'A single camellia', ink: '#5A3320', accent: '#C8302F', swatch: '#FFF3E2', font: 'gowun',
      greeting: '늘 감사한 마음이에요', greetingEn: 'Thank you so much',
      chips: ['늘 감사한 마음이에요', '고마움이 가득한 하루 되세요', '덕분에 힘이 났어요', '따뜻한 마음 잊지 않을게요', '감사합니다', '항상 고맙습니다'],
      chipsEn: ['Thank you so much', 'I am grateful for you', 'Thank you from the bottom of my heart', 'Your kindness means the world to me', 'Thanks for always being there', 'With heartfelt gratitude'] },
    { id: 'hyodo', name: '효도 꽃다발', nameEn: 'For My Parents', tag: '효도', tagEn: 'Parents',
      sub: '어버이 마음', subEn: 'Love for mom and dad', ink: '#5A2E24', accent: '#D4657F', swatch: '#FFE6D8', font: 'gowun',
      greeting: '늘 건강하세요', greetingEn: 'Wishing you health and long life',
      chips: ['늘 건강하세요', '어머니, 아버지 고맙습니다', '사랑합니다', '오래오래 곁에 있어 주세요', '몸조리 잘하세요', '감사하고 사랑합니다'],
      chipsEn: ['Wishing you health and long life', 'Thank you, Mom and Dad', 'I love you, always', 'Please take good care of yourself', 'Wishing you comfort and joy', 'With love and respect'] },
    { id: 'cheer', name: '응원 새싹', nameEn: 'Cheer Up', tag: '응원', tagEn: 'Cheer',
      sub: '힘내세요', subEn: 'You can do it', ink: '#1E4E36', accent: '#3E8E5A', swatch: '#E6FAEC', font: 'jua',
      greeting: '힘내세요!', greetingEn: 'You can do it!',
      chips: ['힘내세요!', '당신은 잘 하고 있어요', '조금씩 앞으로 가요', '물 한 모금 마시고 쉬어 가요', '제가 응원할게요', '웃는 하루 되세요'],
      chipsEn: ['You can do it!', 'You are doing great', 'One step at a time', 'I am cheering for you', 'Take a break if you need to', 'Keep going, I believe in you'] },
    { id: 'console', name: '위로 달빛', nameEn: 'Comfort', tag: '위로', tagEn: 'Comfort',
      sub: '조용한 곁', subEn: 'A quiet place beside you', ink: '#3A2E5A', accent: '#7A62B8', swatch: '#EFE9FF', font: 'gowun',
      greeting: '오늘도 수고 많았어요', greetingEn: 'You did well today',
      chips: ['오늘도 수고 많았어요', '천천히 가도 괜찮아요', '당신 편이에요', '마음 놓고 쉬어 가요', '그 마음 잘 알고 있어요', '괜찮아질 거예요'],
      chipsEn: ['You did well today', 'It is okay to take it slow', 'I am here for you', 'Rest your heart for a while', 'Everything will be alright', 'Sending you a quiet hug'] }
  ];
  var TMAP = {};
  THEMES.forEach(function (t) { TMAP[t.id] = t; });

  /* ── 해 정보(간지·띠) 연동 ──────────────────────────────
     index.html이 해마다 계산해 넘겨 주면 테마 이름·설명·문구·배경 띠 동물이 함께 바뀐다. */
  var YV = { year: 2027, ganji: '정미', color: '붉은', animal: '양', colorAnimal: '붉은 양',
    animalEn: 'Sheep', colorAnimalEn: 'Red Sheep', emoji: '🐑', zkey: 'zSheep' };
  var YTPL = THEMES.map(function (th) {
    var o = {};
    ['name', 'nameEn', 'sub', 'subEn', 'greeting', 'greetingEn'].forEach(function (k) { o[k] = th[k]; });
    o.chips = th.chips.slice(); o.chipsEn = th.chipsEn.slice();
    return o;
  });
  function ysub(s) {
    if (typeof s !== 'string' || s.indexOf('{') < 0) return s;
    return s.replace(/\{(Y|G|A|AN|AE|ANE|EM)\}/g, function (m, k) {
      if (k === 'Y') return YV.year;
      if (k === 'G') return YV.ganji;
      if (k === 'A') return YV.colorAnimal;
      if (k === 'AN') return YV.animal;
      if (k === 'AE') return YV.colorAnimalEn;
      if (k === 'ANE') return YV.animalEn;
      if (k === 'EM') return YV.emoji;
      return m;
    });
  }
  function applyYear(v) {
    if (v) { for (var k in v) if (v[k] != null) YV[k] = v[k]; }
    THEMES.forEach(function (th, i) {
      var tp = YTPL[i];
      ['name', 'nameEn', 'sub', 'subEn', 'greeting', 'greetingEn'].forEach(function (key) { th[key] = ysub(tp[key]); });
      th.chips = tp.chips.map(ysub);
      th.chipsEn = tp.chipsEn.map(ysub);
    });
    BGCACHE = {};          /* 배경 그림을 새 띠 동물로 다시 그린다 */
  }

  /* ── 배경 ─────────────────────────────────────────────── */

  /* 정미년 한지 — 붉은 한지 + 한옥 처마 + 청사초롱 + 소나무·매화 + 그 해 띠 동물 + 복주머니 */
  function bgJeongmi(g) {
    var defs = lg('bg', 0, 0, 0, 1, [[0, '#B82C38'], [.32, '#9E1B2B'], [.7, '#80101F'], [1, '#5E0A15']]) +
      rg('warm', .5, .2, .74, [[0, '#FFE3A8', .34], [.5, '#E0645C', .08], [1, '#5C0A15', 0]]) +
      lg('eav', 0, 0, 0, 1, [[0, '#4A3336'], [.55, '#332326'], [1, '#241719']]) +
      rg('vig', .5, .5, .78, [[0, '#3A0710', 0], [.64, '#3A0710', 0], [1, '#2A040A', .5]]);
    var art = '';
    art += '<rect width="1080" height="1440" fill="url(#bg)"/><rect width="1080" height="1440" fill="url(#warm)"/>';
    art += fibers(7, 90, '#FFE9C4', .16);
    art += dots(9, 46, '#F6D68F', 1, 2.4, 0, 0, 1080, 1440, .13);
    art += eave(g);
    /* 청사초롱 두 개 */
    art += '<path d="M180 122v46M900 122v42" stroke="#E8C173" stroke-width="2.4" opacity=".65"/>';
    art += put('cheongsachorong', 180, 262, 214, g, g ? 'url(#soft)' : '');
    art += put('cheongsachorong', 900, 256, 196, g, g ? 'url(#soft)' : '');
    /* 소나무·매화·까치 */
    art += put('pine', 74, 512, 300, g, g ? 'url(#soft)' : '', 14);
    art += put('plum', 1012, 470, 320, g, g ? 'url(#soft)' : '', -12);
    art += put('magpie', 236, 560, 178, g, g ? 'url(#soft)' : '', -6);
    art += '<g opacity=".85">' + sparklePath(360, 360, 11, '#FFE9A8', .7) + sparklePath(742, 322, 9, '#FFE9A8', .6) + sparklePath(654, 470, 7, '#FFE9A8', .5) + '</g>';
    /* 아래 — 한복 양과 복주머니 */
    art += '<path d="M0 1218c150-40 280-10 420 6s260-8 400-2 180 6 260 0v218H0z" fill="#490812" opacity=".55"/>';
    art += put(YV.zkey, 540, 1216, 360, g, g ? 'url(#soft)' : '');
    art += put('pouchSaekdong', 208, 1252, 248, g, g ? 'url(#soft)' : '', -6);
    art += put('pouchGold', 856, 1258, 236, g, g ? 'url(#soft)' : '', 7);
    art += put('coin', 336, 1360, 112, g, g ? 'url(#soft)' : '');
    art += put('coin', 742, 1362, 104, g, g ? 'url(#soft)' : '');
    art += put('plum', 980, 1360, 190, g, g ? 'url(#soft)' : '', 150);
    art += saekdong(1398, 42, .95);
    /* 테두리 */
    art += frameRect(50, '#E8C173', 3, .55, 18) + frameRect(68, '#E8C173', 1.4, .32, 12);
    var corner = '';
    [[50, 50, 0], [1030, 50, 90], [50, 1390, -90], [1030, 1390, 180]].forEach(function (c) {
      corner += '<g transform="translate(' + c[0] + ' ' + c[1] + ') rotate(' + c[2] + ')" stroke="#E8C173" stroke-width="2.4" fill="none" opacity=".65">' +
        '<path d="M0 40c0-22 18-40 40-40"/><path d="M0 24c0-13 11-24 24-24"/><circle cx="7" cy="7" r="2.6" fill="#E8C173" stroke="none"/></g>';
    });
    art += corner;
    art += '<rect width="1080" height="1440" fill="url(#vig)"/>';
    return sv(art, defs + (g ? softFilter() : ''));
  }

  /* 신년 해돋이 — 첫 해와 겹겹 산, 까치와 소나무 */
  function bgHaedon(g) {
    var defs = lg('bg', 0, 0, 0, 1, [[0, '#FEF3DC'], [.3, '#FFE4BC'], [.56, '#FFC99A'], [.78, '#F9B183'], [1, '#F2A57C']]) +
      rg('sunglow', .5, .5, .5, [[0, '#FFF6C4', .95], [.42, '#FFD87A', .55], [1, '#FFC66A', 0]]) +
      lg('sun', 0, 0, 0, 1, [[0, '#FFF9D8'], [.55, '#FFD35E'], [1, '#F09A18']]) +
      lg('m1', 0, 0, 0, 1, [[0, '#A9BECD'], [1, '#7E96A8']]) +
      lg('m2', 0, 0, 0, 1, [[0, '#8AA3B4'], [1, '#5F7E92']]) +
      lg('m3', 0, 0, 0, 1, [[0, '#5C7C90'], [1, '#3A5A70']]) +
      rg('vig', .5, .5, .8, [[0, '#7A3A18', 0], [.78, '#7A3A18', 0], [1, '#7A3A18', .16]]);
    var art = '';
    art += '<rect width="1080" height="1440" fill="url(#bg)"/>';
    art += glow(540, 548, 420, '#FFE9A8', .55);
    art += '<circle cx="540" cy="548" r="128" fill="url(#sun)"/>';
    art += sunburst(540, 548, 26, '#FFE9A8', .28, 150, 520);
    /* 새 한 마리 */
    art += '<path d="M300 300c6-8 12-8 18 0M336 280c5-7 11-7 16 0M282 322c4-6 9-6 13 0" stroke="#6B4A3A" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".6"/>';
    /* 겹겹 산 */
    art += '<path d="M-20 760L170 566l120 96 150-150 148 140 120-86 212 174 180-70v300H-20z" fill="url(#m1)" opacity=".85"/>';
    art += '<path d="M-20 880L140 704l120 88 150-118 160 126 150-70 200 130 200-50v260H-20z" fill="url(#m2)" opacity=".92"/>';
    art += '<path d="M-20 1000L150 852l110 74 160-96 170 110 160-58 180 118 170-24v264H-20z" fill="url(#m3)"/>';
    /* 안개 */
    art += '<path d="M0 986c180-30 340 10 540 0s340-40 540-10v34c-200-26-360 6-540 16s-360-20-540 4z" fill="#FFFFFF" opacity=".3"/>';
    art += '<path d="M0 1066c200-26 360 8 540 0s340-30 540-6v26c-200-22-360 12-540 20s-340-14-540 8z" fill="#FFFFFF" opacity=".22"/>';
    /* 소나무와 까치 */
    art += put('pine', 108, 1236, 430, g, g ? 'url(#soft)' : '', -4);
    art += put('magpie', 858, 300, 200, g, g ? 'url(#soft)' : '', 4);
    art += put('magpie', 690, 218, 140, g, g ? 'url(#soft)' : '', -8);
    art += '<g opacity=".8">' + sparklePath(250, 470, 12, '#FFF3C4', .8) + sparklePath(760, 470, 10, '#FFF3C4', .7) + '</g>';
    art += waveBand(1352, '#F6DDB6', .35, 16, 180);
    art += frameRect(50, '#C8541A', 2.6, .35, 16) + frameRect(66, '#C8541A', 1.2, .22, 10);
    art += '<rect width="1080" height="1440" fill="url(#vig)"/>';
    return sv(art, defs + (g ? softFilter() : ''));
  }

  /* 설날 창호지 — 한지 + 창호지 문 + 노리개 + 떡국 + 색동 복주머니 */
  function bgSeollal(g) {
    var defs = lg('bg', 0, 0, 0, 1, [[0, '#FFFCF3'], [.4, '#FFF6E3'], [.8, '#FDEDD4'], [1, '#F7E3C4']]) +
      rg('warm', .5, .28, .64, [[0, '#FFFFFF', .8], [1, '#FFF3DC', 0]]) +
      rg('vig', .5, .5, .78, [[0, '#7A4A20', 0], [.76, '#7A4A20', 0], [1, '#8A5A2A', .2]]);
    var art = '';
    art += '<rect width="1080" height="1440" fill="url(#bg)"/>';
    art += fibers(21, 160, '#B98A52', .26);
    art += '<rect width="1080" height="1440" fill="url(#warm)"/>';
    /* 창호지 문 + 노리개 */
    art += lattice(376, 74, 328, 318, 4, 4);
    art += '<path d="M540 392v34" stroke="#C9A24A" stroke-width="3"/>';
    art += put('norigae', 540, 470, 150, g, g ? 'url(#soft)' : '');
    /* 매화 가지 */
    art += put('plum', 104, 330, 330, g, g ? 'url(#soft)' : '', 8);
    art += put('plum', 992, 900, 250, g, g ? 'url(#soft)' : '', -150);
    art += '<g opacity=".9">' + sparklePath(268, 520, 12, '#D9A441', .7) + sparklePath(806, 560, 10, '#D9A441', .6) + '</g>';
    /* 아래 */
    art += '<path d="M0 1210c180-30 300 10 440-6s300-26 400-10 180 20 240 12v234H0z" fill="#F4DEBB" opacity=".7"/>';
    art += put('tteokguk', 540, 1240, 370, g, g ? 'url(#soft)' : '');
    art += put('pouchSaekdong', 186, 1250, 262, g, g ? 'url(#soft)' : '', -5);
    art += put('pouchGold', 892, 1262, 244, g, g ? 'url(#soft)' : '', 6);
    art += put('coin', 340, 1352, 116, g, g ? 'url(#soft)' : '');
    art += put('plum', 700, 1358, 190, g, g ? 'url(#soft)' : '', 160);
    art += saekdong(1392, 48, .9);
    art += frameRect(46, '#B4573F', 2.6, .45, 14) + frameRect(64, '#D9A441', 1.2, .32, 10);
    var corner = '';
    [[46, 46, 0], [1034, 46, 90], [46, 1394, -90], [1034, 1394, 180]].forEach(function (c) {
      corner += '<g transform="translate(' + c[0] + ' ' + c[1] + ') rotate(' + c[2] + ')" fill="none" stroke="#B4573F" stroke-width="2.2" opacity=".5">' +
        '<path d="M0 34c0-19 15-34 34-34"/></g>';
    });
    art += corner;
    art += '<rect width="1080" height="1440" fill="url(#vig)"/>';
    return sv(art, defs + (g ? softFilter() : ''));
  }

  /* 새해 새벽별 — 별밤 + 소나무 실루엣 + 청사초롱 */
  function bgByeolbam(g) {
    var defs = lg('bg', 0, 0, 0, 1, [[0, '#0D1533'], [.45, '#1A2650'], [.8, '#131C3E'], [1, '#080C20']]) +
      rg('moon', .5, .5, .5, [[0, '#FFF6D2', .9], [.4, '#FFE7A0', .35], [1, '#FFE7A0', 0]]) +
      rg('vig', .5, .45, .7, [[0, '#050914', 0], [.7, '#050914', .05], [1, '#050914', .55]]);
    var art = '';
    art += '<rect width="1080" height="1440" fill="url(#bg)"/>';
    art += dots(31, 150, '#FFF6D2', .8, 2.6, 0, 0, 1080, 1440, .75);
    art += '<g>' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) {
      var R = rnd(90 + i), x = 60 + R() * 960, y = 60 + R() * 780;
      return sparklePath(x, y, 8 + R() * 12, '#FFF3C4', .8);
    }).join('') + '</g>';
    art += glow(838, 232, 270, '#FFE7A0', .55);
    art += put('moon', 838, 232, 236, g, '');
    art += '<ellipse cx="838" cy="232" rx="150" ry="150" fill="none" stroke="#F6D68F" stroke-width="1.2" opacity=".25"/>';
    /* 별자리 */
    var stars = [[126, 300], [186, 246], [258, 258], [316, 310], [330, 396], [268, 430], [196, 372]];
    art += '<g stroke="#F6D68F" stroke-width="1.8" opacity=".55">' + stars.map(function (p, i) {
      if (i === 0) return '';
      return '<line x1="' + stars[i - 1][0] + '" y1="' + stars[i - 1][1] + '" x2="' + p[0] + '" y2="' + p[1] + '"/>';
    }).join('') + '</g>' + stars.map(function (p, i) {
      return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + (i % 3 === 0 ? 4 : 2.8) + '" fill="#FFF3C4"/>' +
        (i % 3 === 0 ? sparklePath(p[0], p[1], 9, '#FFF3C4', .5) : '');
    }).join('');
    art += '<path d="M0 1300c150-60 280 30 420 6s260-60 400-24 180 30 260 18v140H0z" fill="#0C1430" opacity=".9"/>';
    art += pineSil(120, 1340, 5.2, '#0A1128', .95) + pineSil(950, 1350, 4.4, '#0A1128', .95);
    /* 그 해 띠 동물 — 어두운 밤에도 보이도록 따뜻한 빛을 뒤에 깔고 소나무 앞에 그린다 */
    art += glow(300, 1196, 200, '#FFE7A0', .34);
    art += put(YV.zkey, 300, 1196, 300, g, g ? 'url(#soft)' : '');
    art += glow(946, 1236, 130, '#FFE7A0', .5);
    art += put('cheongsachorong', 946, 1230, 150, g, '');
    art += dots(44, 30, '#FFD98A', 1.4, 3, 80, 1300, 1000, 1400, .8);
    art += frameRect(50, '#F6D68F', 1.8, .4, 16) + frameRect(68, '#F6D68F', 1, .22, 10);
    art += '<rect width="1080" height="1440" fill="url(#vig)"/>';
    return sv(art, defs + (g ? softFilter() : ''));
  }

  /* 눈 내리는 크리스마스 — 밤하늘 + 눈 + 트리 + 선물 */
  function bgSnowtree(g) {
    var defs = lg('bg', 0, 0, 0, 1, [[0, '#0B1730'], [.34, '#172A52'], [.7, '#22406E'], [1, '#2E5286']]) +
      rg('treeglow', .5, .5, .5, [[0, '#FFE9A8', .4], [.5, '#FFD98A', .14], [1, '#FFD98A', 0]]) +
      rg('vig', .5, .5, .78, [[0, '#040A18', 0], [.66, '#040A18', 0], [1, '#040A18', .5]]);
    var art = '';
    art += '<rect width="1080" height="1440" fill="url(#bg)"/>';
    art += dots(71, 120, '#E8F2FF', .8, 2.4, 0, 0, 1080, 1100, .8);
    art += '<g>' + [0, 1, 2, 3, 4, 5].map(function (i) {
      var R = rnd(140 + i), x = 70 + R() * 940, y = 60 + R() * 640;
      return sparklePath(x, y, 7 + R() * 10, '#DCEBFF', .8);
    }).join('') + '</g>';
    art += put('star', 540, 168, 128, g, g ? 'url(#soft)' : '');
    art += flake(150, 300, 16, .8) + flake(920, 250, 13, .7) + flake(760, 470, 10, .6) + flake(280, 560, 11, .65) + flake(1000, 640, 9, .55);
    art += '<g>' + Array.apply(null, Array(46)).map(function (_, i) {
      var R = rnd(400 + i), x = R() * 1080, y = R() * 1300, r = 2 + R() * 3.4;
      return '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + r.toFixed(1) + '" fill="#FFFFFF" opacity="' + (.45 + R() * .5).toFixed(2) + '"/>';
    }).join('') + '</g>';
    /* 트리 뒤 빛 */
    art += glow(540, 1140, 430, '#FFE9A8', .4);
    /* 눈 언덕 */
    art += '<path d="M0 1230c150-60 300-46 420 0s240 54 380 10 200-40 280-22v222H0z" fill="#EAF3FF" opacity=".95"/>';
    art += '<path d="M0 1300c170-40 300-10 440 16s260-6 380-20 180 0 260 12v132H0z" fill="#FFFFFF"/>';
    art += put('xmasTree', 540, 1148, 470, g, g ? 'url(#soft)' : '');
    art += put('snowman', 178, 1256, 214, g, g ? 'url(#soft)' : '');
    art += put('giftBox', 852, 1296, 190, g, g ? 'url(#soft)' : '', -6);
    art += put('gift', 760, 1348, 138, g, g ? 'url(#soft)' : '', 5);
    art += put('snowflake', 330, 1330, 120, g, g ? 'url(#soft)' : '');
    art += put('lights', 540, 300, 620, g, g ? 'url(#soft)' : '');
    art += frameRect(50, '#DCEBFF', 2, .35, 16) + frameRect(66, '#DCEBFF', 1, .2, 10);
    art += '<rect width="1080" height="1440" fill="url(#vig)"/>';
    return sv(art, defs + (g ? softFilter() : ''));
  }

  /* 벽난로 선물의 밤 — 따뜻한 실내 + 벽난로 + 양말 + 선물 */
  function bgXmasNight(g) {
    var defs = lg('bg', 0, 0, 0, 1, [[0, '#2A1522'], [.36, '#3E1E2A'], [.7, '#552A30'], [1, '#3A1A22']]) +
      rg('fire', .5, .82, .55, [[0, '#FFD08A', .6], [.45, '#F08040', .3], [1, '#8A3018', 0]]) +
      lg('wood', 0, 0, 0, 1, [[0, '#A8764C'], [.5, '#7A5234'], [1, '#53341F']]) +
      lg('brick', 0, 0, 0, 1, [[0, '#6E4536'], [1, '#4A2C24']]) +
      rg('vig', .5, .5, .8, [[0, '#1A0A12', 0], [.7, '#1A0A12', .05], [1, '#1A0A12', .5]]);
    var art = '';
    art += '<rect width="1080" height="1440" fill="url(#bg)"/>';
    art += '<rect width="1080" height="1440" fill="url(#fire)"/>';
    art += fibers(33, 40, '#FFD9A8', .1);
    /* 위쪽 가랜드 */
    art += '<path d="M0 96c180 74 360 74 540 20s360-60 540 14" fill="none" stroke="#2E6E46" stroke-width="16" opacity=".9"/>';
    art += '<g>' + [0, 1, 2, 3, 4, 5, 6].map(function (i) {
      var x = 96 + i * 148, y = 128 + Math.sin(i * .9) * 22;
      var cols = ['#E7373F', '#F6C453', '#7FD8C0', '#FF8FA8'];
      return '<path d="M' + x + ' ' + (y - 6) + 'v8" stroke="#C9A24A" stroke-width="2.4"/>' +
        '<ellipse cx="' + x + '" cy="' + (y + 8) + '" rx="9" ry="12" fill="' + cols[i % 4] + '"/>';
    }).join('') + '</g>';
    /* 벽난로 */
    art += '<rect x="190" y="1128" width="700" height="46" rx="8" fill="url(#wood)"/>';
    art += '<rect x="210" y="1174" width="660" height="266" fill="url(#brick)"/>';
    art += '<path d="M340 1440v-140c0-52 40-90 90-90h220c50 0 90 38 90 90v140z" fill="#1E0E12"/>';
    art += '<path d="M360 1440v-128c0-44 34-76 76-76h208c42 0 76 32 76 76v128z" fill="#2A1218"/>';
    /* 불꽃 */
    art += glow(540, 1380, 210, '#FFB056', .65);
    art += '<path d="M540 1268c26 44 60 62 60 104 0 34-27 60-60 60s-60-26-60-60c0-42 34-60 60-104z" fill="#F0803A"/>';
    art += '<path d="M540 1316c16 28 36 40 36 66 0 22-16 38-36 38s-36-16-36-38c0-26 20-38 36-66z" fill="#FFC24B"/>';
    art += '<path d="M540 1352c9 16 20 24 20 38 0 13-9 22-20 22s-20-9-20-22c0-14 11-22 20-38z" fill="#FFF3C4"/>';
    /* 양말 */
    art += put('stocking', 300, 1090, 150, g, g ? 'url(#soft)' : '', -8);
    art += put('stocking', 540, 1084, 160, g, g ? 'url(#soft)' : '');
    art += put('stocking', 780, 1090, 148, g, g ? 'url(#soft)' : '', 8);
    /* 선물 */
    art += put('giftBox', 236, 1330, 210, g, g ? 'url(#soft)' : '', -5);
    art += put('giftBox', 848, 1338, 200, g, g ? 'url(#soft)' : '', 6);
    art += put('bell', 948, 250, 150, g, g ? 'url(#soft)' : '', 12);
    art += put('holly', 130, 300, 150, g, g ? 'url(#soft)' : '');
    art += frameRect(50, '#E8C173', 2.4, .4, 16) + frameRect(66, '#E8C173', 1.2, .22, 10);
    art += '<rect width="1080" height="1440" fill="url(#vig)"/>';
    return sv(art, defs + (g ? softFilter() : ''));
  }

  /* 눈 내린 마을 — 고요한 성탄 아침, 한옥 지붕 마을 */
  function bgXmasMorning(g) {
    var defs = lg('bg', 0, 0, 0, 1, [[0, '#DCE9FA'], [.3, '#EFF6FF'], [.6, '#FFF8EC'], [1, '#FFE9D4']]) +
      rg('warm', .72, .22, .6, [[0, '#FFF3C4', .55], [1, '#FFF3C4', 0]]) +
      rg('vig', .5, .5, .8, [[0, '#3A5A80', 0], [.8, '#3A5A80', 0], [1, '#3A5A80', .14]]);
    var art = '';
    art += '<rect width="1080" height="1440" fill="url(#bg)"/>';
    art += glow(860, 260, 230, '#FFF3C4', .5);
    art += '<circle cx="860" cy="260" r="86" fill="#FFF6D8"/>';
    art += '<rect width="1080" height="1440" fill="url(#warm)"/>';
    art += fibers(51, 60, '#C9D8EA', .2);
    art += '<g>' + Array.apply(null, Array(40)).map(function (_, i) {
      var R = rnd(600 + i), x = R() * 1080, y = R() * 1180, r = 2 + R() * 3.2;
      return '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + r.toFixed(1) + '" fill="#FFFFFF" opacity="' + (.5 + R() * .45).toFixed(2) + '"/>';
    }).join('') + '</g>';
    /* 먼 산 */
    art += '<path d="M-20 900L200 700l150 120 170-160 180 170 160-90 220 160v200H-20z" fill="#C6D8EC" opacity=".8"/>';
    art += '<path d="M-20 990L180 830l160 100 170-120 180 130 150-70 240 130v180H-20z" fill="#AFC8E2" opacity=".85"/>';
    /* 눈 덮인 언덕 */
    art += '<path d="M0 1180c170-40 330-20 500 20s330 20 580-30v270H0z" fill="#FFFFFF"/>';
    /* 한옥 마을 (작은 집 3채) */
    function house(cx, cy, s, rot) {
      return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s + ') rotate(' + (rot || 0) + ')">' +
        '<rect x="-52" y="-14" width="104" height="62" fill="#F6E9D4" stroke="#B98A5A" stroke-width="3"/>' +
        '<path d="M-74 -12C-60 -46 60 -46 74 -12L60 -2C42 -26 -42 -26 -60 -2z" fill="#5A5E6C" stroke="#3A3E4A" stroke-width="3"/>' +
        '<path d="M-74 -12C-60 -46 60 -46 74 -12" fill="#FFFFFF" stroke="none" opacity=".85"/>' +
        '<rect x="-34" y="2" width="30" height="30" fill="#FFE9A8" stroke="#B98A5A" stroke-width="2.4"/>' +
        '<rect x="6" y="2" width="30" height="30" fill="#FFE9A8" stroke="#B98A5A" stroke-width="2.4"/>' +
        '<path d="M-34 17h30M6 17h30M-19 2v30M21 2v30" stroke="#B98A5A" stroke-width="2"/>' +
        '</g>';
    }
    art += '<g opacity=".95">' + house(220, 1210, 1.0, -2) + house(560, 1180, 1.25, 0) + house(880, 1222, .95, 2) + '</g>';
    art += pineSil(120, 1120, 4.6, '#3E6E5A', .9) + pineSil(980, 1110, 4.0, '#3E6E5A', .9);
    art += put('snowman', 700, 1276, 200, g, g ? 'url(#soft)' : '');
    art += put('wreath', 200, 300, 180, g, g ? 'url(#soft)' : '');
    art += put('magpie', 900, 480, 170, g, g ? 'url(#soft)' : '', -6);
    art += put('snowflake', 420, 380, 110, g, g ? 'url(#soft)' : '');
    art += put('snowflake', 780, 640, 90, g, g ? 'url(#soft)' : '');
    art += frameRect(50, '#FFFFFF', 8, .6, 18);
    art += '<rect width="1080" height="1440" fill="url(#vig)"/>';
    return sv(art, defs + (g ? softFilter() : ''));
  }

  function bgBirthday(g) {
    var defs = lg('bg', 0, 0, 0, 1, [[0, '#FFEAF3'], [.4, '#FFF7FB'], [.75, '#FFE4EF'], [1, '#FFD3E3']]) +
      rg('warm', .5, .25, .6, [[0, '#FFFFFF', .8], [1, '#FFFFFF', 0]]) +
      rg('vig', .5, .5, .78, [[0, '#B04070', 0], [.8, '#B04070', 0], [1, '#B04070', .14]]);
    var art = '';
    art += '<rect width="1080" height="1440" fill="url(#bg)"/>';
    art += '<rect width="1080" height="1440" fill="url(#warm)"/>';
    var bunt = '';
    for (var i = 0; i < 9; i++) {
      var x = 60 + i * 118;
      bunt += '<path d="M' + x + ' 60 l60 0 -30 62z" fill="' + ['#FF9DB4', '#8FD8C4', '#F6C453', '#9EC1F2'][i % 4] + '" opacity=".9"/>';
    }
    art += '<path d="M40 60c160 40 800 40 1000 0" fill="none" stroke="#D8A6B8" stroke-width="3"/>' + bunt;
    var balloons = [[120, 210, '#FF8FA8', 1], [190, 160, '#8FD8C4', .9], [255, 225, '#F6C453', .85], [930, 200, '#9EC1F2', 1], [865, 150, '#FF9DB4', .9], [980, 260, '#C8B4F0', .85]];
    balloons.forEach(function (b) {
      art += '<g opacity="' + b[3] + '"><ellipse cx="' + b[0] + '" cy="' + b[1] + '" rx="34" ry="42" fill="' + b[2] + '"/>' +
        '<ellipse cx="' + (b[0] - 11) + '" cy="' + (b[1] - 14) + '" rx="9" ry="13" fill="#FFFFFF" opacity=".5" transform="rotate(-25 ' + (b[0] - 11) + ' ' + (b[1] - 14) + ')"/>' +
        '<path d="M' + b[0] + ' ' + (b[1] + 42) + 'c-8 34 8 52 0 82" fill="none" stroke="#C98FA4" stroke-width="1.6"/>' +
        '<path d="M' + (b[0] - 6) + ' ' + (b[1] + 42) + 'h12l-6 8z" fill="' + b[2] + '"/></g>';
    });
    art += confetti(5, 34, ['#FF9DB4', '#8FD8C4', '#F6C453', '#9EC1F2', '#C8B4F0'], 60, 400);
    art += confetti(6, 26, ['#FF9DB4', '#8FD8C4', '#F6C453', '#9EC1F2'], 1050, 1380);
    art += put('cake', 540, 1248, 440, g, g ? 'url(#soft)' : '');
    art += put('gift', 150, 1284, 252, g, g ? 'url(#soft)' : '');
    art += put('cupcake', 940, 1274, 228, g, g ? 'url(#soft)' : '');
    art += put('balloon', 330, 1320, 150, g, g ? 'url(#soft)' : '');
    art += put('hat', 760, 1320, 150, g, g ? 'url(#soft)' : '');
    art += '<g opacity=".8">' + sparklePath(420, 250, 14, '#FFFFFF', .9) + sparklePath(720, 320, 11, '#FFFFFF', .8) + sparklePath(580, 120, 9, '#FFFFFF', .7) + '</g>';
    art += frameRect(46, '#FFFFFF', 8, .55, 20);
    art += '<rect width="1080" height="1440" fill="url(#vig)"/>';
    return sv(art, defs + (g ? softFilter() : ''));
  }

  function bgCongrats(g) {
    var defs = lg('bg', 0, 0, 0, 1, [[0, '#E6F6FF'], [.45, '#F3FCF9'], [.8, '#E2F7EC'], [1, '#D2F0E4']]) +
      rg('warm', .72, .16, .7, [[0, '#FFFFFF', .85], [1, '#FFFFFF', 0]]) +
      rg('vig', .5, .5, .78, [[0, '#2A5A50', 0], [.8, '#2A5A50', 0], [1, '#2A5A50', .16]]);
    var art = '';
    art += '<rect width="1080" height="1440" fill="url(#bg)"/>';
    art += sunburst(960, 120, 16, '#FFFFFF', .35, 120, 900);
    art += '<rect width="1080" height="1440" fill="url(#warm)"/>';
    art += confetti(11, 42, ['#F6C453', '#7EA9F2', '#E9A0B4', '#7FD8C0', '#C8B4F0'], 60, 380);
    art += confetti(12, 36, ['#F6C453', '#7EA9F2', '#E9A0B4', '#7FD8C0'], 1080, 1390);
    var leaves = '';
    [-1, 1].forEach(function (sd) {
      art += '<path d="M540 1250 C ' + (540 + sd * 90) + ' 1222 ' + (540 + sd * 236) + ' 1128 ' + (540 + sd * 344) + ' 976" fill="none" stroke="#B08A3C" stroke-width="4" opacity=".55"/>';
      for (var i = 0; i < 9; i++) {
        var t = i / 8;
        var x = 540 + sd * (52 + t * 300);
        var y = 1236 - t * 250 + Math.sin(t * 3.1) * 8;
        leaves += '<ellipse cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" rx="31" ry="12" fill="' + (i % 2 ? '#C9A24A' : '#8FB08F') + '" opacity=".82" transform="rotate(' + (sd * (26 + t * 48)).toFixed(0) + ' ' + x.toFixed(0) + ' ' + y.toFixed(0) + ')"/>';
      }
    });
    art += leaves;
    art += put('sparkler', 160, 210, 220, g, g ? 'url(#soft)' : '');
    art += put('crown', 920, 260, 220, g, g ? 'url(#soft)' : '');
    art += put('ribbon', 200, 1280, 230, g, g ? 'url(#soft)' : '');
    art += put('sparkle', 900, 1300, 180, g, g ? 'url(#soft)' : '');
    art += frameRect(46, '#C9A24A', 2.4, .35, 18) + frameRect(62, '#C9A24A', 1, .2, 12);
    art += '<rect width="1080" height="1440" fill="url(#vig)"/>';
    return sv(art, defs + (g ? softFilter() : ''));
  }

  function bgThanks(g) {
    var defs = lg('bg', 0, 0, 0, 1, [[0, '#FFFBF2'], [.4, '#FFF6E7'], [.8, '#FFEEDA'], [1, '#FBE3C8']]) +
      rg('warm', .78, .18, .62, [[0, '#FFF3C4', .55], [1, '#FFF3C4', 0]]) +
      rg('vig', .5, .5, .78, [[0, '#8A5A2A', 0], [.8, '#8A5A2A', 0], [1, '#8A5A2A', .16]]);
    var art = '';
    art += '<rect width="1080" height="1440" fill="url(#bg)"/>';
    art += sunburst(1010, 90, 12, '#FFFFFF', .28, 80, 720);
    art += fibers(23, 90, '#C9A06A', .2);
    art += '<rect width="1080" height="1440" fill="url(#warm)"/>';
    art += put('camellia', 152, 230, 282, g, g ? 'url(#soft)' : '');
    art += put('leaf', 268, 372, 176, g, g ? 'url(#soft)' : '');
    art += put('plum', 900, 300, 300, g, g ? 'url(#soft)' : '');
    art += put('letter', 168, 1286, 240, g, g ? 'url(#soft)' : '');
    art += put('envelope', 918, 1300, 240, g, g ? 'url(#soft)' : '');
    art += put('carnation', 540, 1330, 170, g, g ? 'url(#soft)' : '');
    art += '<g opacity=".7">' + sparklePath(380, 330, 12, '#D9A441', .8) + sparklePath(700, 250, 9, '#D9A441', .7) + '</g>';
    art += dots(51, 26, '#E8C9A0', 6, 18, 60, 420, 1020, 1380, .35);
    art += frameRect(46, '#B98A52', 2, .4, 14);
    art += '<rect width="1080" height="1440" fill="url(#vig)"/>';
    return sv(art, defs + (g ? softFilter() : ''));
  }

  function bgHyodo(g) {
    var defs = lg('bg', 0, 0, 0, 1, [[0, '#FFF6EC'], [.42, '#FFEEE0'], [.8, '#FFE2D0'], [1, '#FBD3BD']]) +
      rg('warm', .5, .3, .62, [[0, '#FFFFFF', .65], [1, '#FFFFFF', 0]]) +
      rg('vig', .5, .5, .78, [[0, '#9A5040', 0], [.8, '#9A5040', 0], [1, '#9A5040', .16]]);
    var art = '';
    art += '<rect width="1080" height="1440" fill="url(#bg)"/>';
    art += fibers(26, 70, '#C98F6A', .18);
    art += '<rect width="1080" height="1440" fill="url(#warm)"/>';
    art += dots(53, 22, '#FFFFFF', 12, 34, 40, 60, 1040, 500, .35);
    art += put('carnation', 154, 228, 258, g, g ? 'url(#soft)' : '');
    art += put('bouquet', 540, 1284, 442, g, g ? 'url(#soft)' : '');
    art += put('heart', 900, 1240, 130, g, g ? 'url(#soft)' : '');
    art += put('leaf', 150, 1300, 210, g, g ? 'url(#soft)' : '');
    art += '<g opacity=".7">' + sparklePath(330, 300, 12, '#FFFFFF', .9) + sparklePath(880, 360, 10, '#FFFFFF', .8) + '</g>';
    art += frameRect(46, '#D9A441', 2.2, .4, 16) + frameRect(62, '#D9A441', 1, .22, 10);
    art += '<rect width="1080" height="1440" fill="url(#vig)"/>';
    return sv(art, defs + (g ? softFilter() : ''));
  }

  function bgCheer(g) {
    var defs = lg('bg', 0, 0, 0, 1, [[0, '#F1FDF4'], [.4, '#E9FBEE'], [.75, '#FFFCE6'], [1, '#FFF7CF']]) +
      rg('sun', .5, .5, .5, [[0, '#FFF3A8', .95], [.5, '#FFE07A', .4], [1, '#FFE07A', 0]]) +
      rg('vig', .5, .5, .8, [[0, '#4A7A30', 0], [.8, '#4A7A30', 0], [1, '#4A7A30', .12]]);
    var art = '';
    art += '<rect width="1080" height="1440" fill="url(#bg)"/>';
    art += sunburst(190, 180, 14, '#FFF3C4', .5, 90, 420);
    art += '<circle cx="190" cy="180" r="92" fill="#FFE27A"/>';
    art += '<circle cx="190" cy="180" r="92" fill="url(#sun)"/>';
    art += put('cloud', 902, 200, 230, g, '');
    art += put('cloud', 640, 130, 180, g, '');
    art += put('rainbow', 800, 430, 250, g, g ? 'url(#soft)' : '');
    art += '<g fill="none" stroke="#7FA8B8" stroke-width="4" stroke-linecap="round" opacity=".7">' +
      '<path d="M420 250q14-16 28 0q14-16 28 0"/><path d="M520 190q10-12 20 0q10-12 20 0"/></g>';
    art += put('leaf', 900, 1290, 240, g, g ? 'url(#soft)' : '');
    art += put('cloud', 180, 1260, 220, g, '');
    art += hills(1210, ['#BFE8BE', '#94D2A0', '#68B37E']);
    art += put('tulip', 300, 1300, 180, g, g ? 'url(#soft)' : '');
    art += '<g opacity=".75">' + sparklePath(620, 420, 12, '#FFFFFF', .9) + sparklePath(760, 520, 9, '#FFFFFF', .8) + '</g>';
    art += frameRect(46, '#FFFFFF', 7, .5, 18);
    art += '<rect width="1080" height="1440" fill="url(#vig)"/>';
    return sv(art, defs + (g ? softFilter() : ''));
  }

  function bgConsole(g) {
    var defs = lg('bg', 0, 0, 0, 1, [[0, '#F5EFFF'], [.42, '#F0E8FF'], [.78, '#E7DCFA'], [1, '#DCD0F4']]) +
      rg('moon', .5, .5, .5, [[0, '#FFF6D8', .8], [1, '#FFF6D8', 0]]) +
      rg('vig', .5, .5, .8, [[0, '#4A3A70', 0], [.8, '#4A3A70', 0], [1, '#4A3A70', .16]]);
    var art = '';
    art += '<rect width="1080" height="1440" fill="url(#bg)"/>';
    art += dots(61, 48, '#FFFFFF', 1, 3, 0, 0, 1080, 900, .55);
    art += glow(868, 236, 230, '#FFF6D8', .55);
    art += put('moon', 868, 236, 220, g, '');
    art += put('star', 300, 220, 120, g, g ? 'url(#soft)' : '');
    art += put('cloud', 620, 330, 210, g, '');
    art += put('coffee', 912, 1286, 252, g, g ? 'url(#soft)' : '');
    art += put('cherry', 190, 1240, 130, g, g ? 'url(#soft)' : '');
    art += put('letter', 350, 1330, 170, g, g ? 'url(#soft)' : '');
    art += hills(1230, ['#D3C6F0', '#BFB0E4', '#A99AD6']);
    art += frameRect(46, '#9C87CC', 2, .35, 16);
    art += '<rect width="1080" height="1440" fill="url(#vig)"/>';
    return sv(art, defs + (g ? softFilter() : ''));
  }

  function softFilter() {
    return '<filter id="soft" x="-40%" y="-40%" width="180%" height="190%"><feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#3A1230" flood-opacity=".26"/></filter>';
  }

  var BG = {
    jeongmi: bgJeongmi, haedon: bgHaedon, seollal: bgSeollal, byeolbam: bgByeolbam,
    snowtree: bgSnowtree, xmasnight: bgXmasNight, xmasmorning: bgXmasMorning,
    birthday: bgBirthday, congrats: bgCongrats, thanks: bgThanks, hyodo: bgHyodo,
    cheer: bgCheer, console: bgConsole
  };

  /* ── 사진 액자 ───────────────────────────────────────── */

  var FRAMES = [
    { id: 'hanji', name: '한지 액자', nameEn: 'Hanji', tag: '설날', tagEn: 'Seollal', sub: '가족사진에 복을 담아', subEn: 'Family photo on Korean paper' },
    { id: 'gold', name: '금빛 액자', nameEn: 'Gold', tag: '고급', tagEn: 'Classic', sub: '차분한 금테', subEn: 'A quiet gold frame' },
    { id: 'polaroid', name: '폴라로이드', nameEn: 'Polaroid', tag: '추억', tagEn: 'Memory', sub: '하얀 여백에 한 줄', subEn: 'White margin, one line' },
    { id: 'flower', name: '꽃 액자', nameEn: 'Flower', tag: '화사', tagEn: 'Blooming', sub: '꽃으로 두른 테', subEn: 'Wrapped in flowers' },
    { id: 'heart', name: '하트 액자', nameEn: 'Heart', tag: '사랑', tagEn: 'Love', sub: '분홍 물결 테', subEn: 'Soft pink hearts' },
    { id: 'snow', name: '눈 액자', nameEn: 'Snow', tag: '겨울', tagEn: 'Winter', sub: '눈송이 테', subEn: 'Border of snowflakes' },
    { id: 'none', name: '민무늬', nameEn: 'Plain', tag: '깔끔', tagEn: 'Clean', sub: '사진 그대로', subEn: 'Just the photo' }
  ];

  function frGold(g) {
    var art = '';
    art += '<rect x="28" y="28" width="1024" height="1384" rx="26" fill="none" stroke="#E2B85F" stroke-width="12"/>';
    art += '<rect x="52" y="52" width="976" height="1336" rx="18" fill="none" stroke="#FFF0BE" stroke-width="4" opacity=".9"/>';
    art += '<rect x="66" y="66" width="948" height="1308" rx="14" fill="none" stroke="#B98624" stroke-width="2" opacity=".6"/>';
    var c = '';
    [[70, 70, 0], [1010, 70, 90], [70, 1370, -90], [1010, 1370, 180]].forEach(function (p) {
      c += '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')">' +
        '<path d="M0 96c0-52 40-96 96-96" fill="none" stroke="#E2B85F" stroke-width="6"/>' +
        '<path d="M14 84c0-38 30-70 70-70" fill="none" stroke="#FFF0BE" stroke-width="2" opacity=".8"/>' +
        '<circle cx="26" cy="26" r="8" fill="#E2B85F"/><circle cx="60" cy="10" r="4" fill="#E2B85F"/><circle cx="10" cy="60" r="4" fill="#E2B85F"/></g>';
    });
    art += c;
    art += '<g opacity=".9">' + sparklePath(540, 46, 16, '#E2B85F', .8) + sparklePath(540, 1394, 16, '#E2B85F', .8) + '</g>';
    return sv(art, '');
  }

  function frPolaroid(g) {
    var art = '';
    art += '<rect x="34" y="34" width="1012" height="1372" fill="none" stroke="#FFFFFF" stroke-width="68"/>';
    art += '<rect x="70" y="70" width="940" height="1180" fill="none" stroke="#E6DED2" stroke-width="2" opacity=".8"/>';
    art += '<rect x="34" y="34" width="1012" height="1372" fill="none" stroke="#D8CFC2" stroke-width="2"/>';
    art += '<path d="M120 1330h840" stroke="#E8DFD2" stroke-width="1.4" opacity=".9"/>';
    art += '<g opacity=".8">' + blossom(140, 1340, 14, '#F7C6D2', '#E8A93C') + blossom(940, 1340, 14, '#F7C6D2', '#E8A93C') + '</g>';
    return sv(art, '');
  }

  function frFlower(g) {
    var art = '';
    var R = rnd(77);
    var cols = ['#FFC6D6', '#FFE0B0', '#C8E6C9', '#D7CCF2', '#FFD9C0'];
    for (var i = 0; i < 40; i++) {
      var t = i / 40, x, y;
      if (t < .25) { x = t / .25 * 1080; y = 54; }
      else if (t < .5) { x = 1026; y = (t - .25) / .25 * 1440; }
      else if (t < .75) { x = 1080 - (t - .5) / .25 * 1080; y = 1386; }
      else { x = 54; y = 1440 - (t - .75) / .25 * 1440; }
      x += (R() - .5) * 26; y += (R() - .5) * 26;
      art += blossom(x, y, 20 + R() * 16, cols[i % cols.length], '#F2C14E', .95);
      art += '<circle cx="' + (x + (R() - .5) * 44).toFixed(0) + '" cy="' + (y + (R() - .5) * 44).toFixed(0) + '" r="5" fill="#8FBF8F" opacity=".8"/>';
    }
    art += '<rect x="78" y="78" width="924" height="1284" rx="18" fill="none" stroke="#FFFFFF" stroke-width="4" opacity=".65"/>';
    return sv(art, '');
  }

  /* 한지 액자 — 한지 바탕 + 색동 모서리 + 매화 (중국 문양 없이) */
  function frHanji(g) {
    var defs = lg('band', 0, 0, 0, 1, [[0, '#FFF7E6'], [.5, '#FBEBD2'], [1, '#F2DDBB']]) +
      lg('gd', 0, 0, 0, 1, [[0, '#FFF0BE'], [.5, '#F2C463'], [1, '#C08B30']]);
    var art = '';
    art += '<path d="M0 0h1080v1440H0zM120 150h840v1140H120z" fill="url(#band)" fill-rule="evenodd"/>';
    art += fibers(83, 130, '#C9A06A', .22);
    art += '<rect x="120" y="150" width="840" height="1140" fill="none" stroke="url(#gd)" stroke-width="8"/>';
    art += '<rect x="138" y="168" width="804" height="1104" fill="none" stroke="#E2BC72" stroke-width="2" opacity=".7"/>';
    /* 색동 모서리 */
    var cols = ['#2E5EAA', '#C8302F', '#F2C14E', '#3E8E5A', '#D4657F'];
    var corners = '';
    [[0, 0, 0], [1080, 0, 90], [0, 1440, -90], [1080, 1440, 180]].forEach(function (p) {
      var c = '<g transform="translate(' + p[0] + ' ' + p[1] + ') rotate(' + p[2] + ')">';
      cols.forEach(function (col, i) {
        c += '<rect x="0" y="' + (i * 16) + '" width="' + (150 - i * 22) + '" height="16" fill="' + col + '" opacity=".9"/>';
      });
      c += '</g>';
      corners += c;
    });
    art += corners;
    art += '<g opacity=".95">' + blossom(540, 86, 22, '#FFC6D6', '#F2C14E') + blossom(486, 100, 14, '#FFD9E2', '#F2C14E') + blossom(596, 104, 14, '#FFC6D6', '#F2C14E') + '</g>';
    art += '<g opacity=".9">' + blossom(540, 1354, 20, '#FFC6D6', '#F2C14E') + blossom(492, 1370, 13, '#FFD9E2', '#F2C14E') + blossom(590, 1372, 13, '#FFC6D6', '#F2C14E') + '</g>';
    art += put('plum', 62, 700, 150, false, '', 12) + put('plum', 1018, 760, 140, false, '', 192);
    art += '<path d="M340 1404c60-22 120-30 200-30s140 8 200 30" fill="none" stroke="#E8B84A" stroke-width="4" opacity=".8"/>';
    return sv(art, defs);
  }

  function frHeart(g) {
    var art = '';
    var R = rnd(91);
    var s = '';
    for (var i = 0; i < 44; i++) {
      var t = i / 44, x, y;
      if (t < .25) { x = t / .25 * 1080; y = 40; }
      else if (t < .5) { x = 1040; y = (t - .25) / .25 * 1440; }
      else if (t < .75) { x = 1080 - (t - .5) / .25 * 1080; y = 1400; }
      else { x = 40; y = 1440 - (t - .75) / .25 * 1440; }
      var sz = 20 + R() * 14;
      s += '<path d="M' + x + ' ' + (y + sz * .8) + 'C' + (x - sz * 1.4) + ' ' + (y - sz * .2) + ' ' + (x - sz * .6) + ' ' + (y - sz * 1.1) + ' ' + x + ' ' + (y - sz * .4) +
        'C' + (x + sz * .6) + ' ' + (y - sz * 1.1) + ' ' + (x + sz * 1.4) + ' ' + (y - sz * .2) + ' ' + x + ' ' + (y + sz * .8) + 'z" fill="' + (i % 3 ? '#FF9FB4' : '#FFC6D6') + '" opacity=".95"/>';
    }
    art += s;
    art += '<rect x="74" y="74" width="932" height="1292" rx="22" fill="none" stroke="#FFFFFF" stroke-width="5" opacity=".7"/>';
    return sv(art, '');
  }

  /* 눈 액자 */
  function frSnow(g) {
    var art = '';
    art += '<rect x="0" y="0" width="1080" height="1440" fill="none" stroke="#EAF3FF" stroke-width="96"/>';
    art += '<rect x="48" y="48" width="984" height="1344" fill="none" stroke="#9EC8F0" stroke-width="4" opacity=".8"/>';
    art += '<rect x="96" y="96" width="888" height="1248" fill="none" stroke="#FFFFFF" stroke-width="4" opacity=".9"/>';
    var R = rnd(97), s = '';
    for (var i = 0; i < 26; i++) {
      var t = i / 26, x, y;
      if (t < .25) { x = t / .25 * 1080; y = 48; }
      else if (t < .5) { x = 1032; y = (t - .25) / .25 * 1440; }
      else if (t < .75) { x = 1080 - (t - .5) / .25 * 1080; y = 1392; }
      else { x = 48; y = 1440 - (t - .75) / .25 * 1440; }
      s += '<g opacity="' + (.7 + R() * .3).toFixed(2) + '">' + flake(x, y, 10 + R() * 8, 1) + '</g>';
    }
    art += s;
    art += flake(120, 120, 26, .9) + flake(960, 120, 24, .9) + flake(120, 1320, 24, .9) + flake(960, 1320, 26, .9);
    return sv(art, '');
  }

  var FR = { gold: frGold, polaroid: frPolaroid, flower: frFlower, hanji: frHanji, heart: frHeart, snow: frSnow, none: function () { return ''; } };

  function depthOverlay() {
    var id = 'dp' + (++uid), id2 = 'sh' + (++uid), id3 = 'rim' + (++uid);
    function sphere(cx, cy, r, op) {
      return '<g opacity="' + op + '"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#' + id + ')"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#FFFFFF" stroke-width="1.6" opacity=".45"/>' +
        '<ellipse cx="' + (cx - r * .34) + '" cy="' + (cy - r * .38) + '" rx="' + (r * .30) + '" ry="' + (r * .20) + '" fill="#FFFFFF" opacity=".55" transform="rotate(-28 ' + (cx - r * .34) + ' ' + (cy - r * .38) + ')"/>' +
        '<circle cx="' + (cx + r * .38) + '" cy="' + (cy + r * .40) + '" r="' + (r * .10) + '" fill="#FFFFFF" opacity=".35"/></g>';
    }
    return '<defs>' +
      rg(id, .34, .28, .78, [[0, '#FFFFFF', .92], [.42, '#FFF4E2', .5], [.82, '#E8C9B0', .28], [1, '#B98A74', .34]]) +
      lg(id2, 0, 0, 1, 1, [[0, '#FFFFFF', .12], [.45, '#FFFFFF', 0], [1, '#FFFFFF', .06]]) +
      rg(id3, .5, 1, .7, [[0, '#3A0E1A', .2], [1, '#3A0E1A', 0]]) +
      '</defs>' +
      '<rect width="1080" height="1440" fill="url(#' + id3 + ')"/>' +
      sphere(946, 1046, 84, .8) + sphere(126, 898, 56, .75) + sphere(828, 552, 30, .7) +
      '<rect width="1080" height="1440" fill="url(#' + id2 + ')"/>';
  }
  var BGCACHE = {}, FRCACHE = {};
  function bg(themeId, gloss) {
    var ck = themeId + '|' + (gloss ? 1 : 0) + '|' + YV.zkey;
    if (BGCACHE[ck]) return BGCACHE[ck];
    uid = 0;
    var f = BG[themeId] || BG.jeongmi;
    var out = f(!!gloss);
    if (gloss) out = out.replace('</svg>', depthOverlay() + '</svg>');
    BGCACHE[ck] = out;
    return out;
  }
  function frame(frameId) {
    if (FRCACHE[frameId] != null) return FRCACHE[frameId];
    uid = 0;
    var f = FR[frameId];
    var out = f ? f(false) : '';
    FRCACHE[frameId] = out;
    return out;
  }

  window.WC_ART = {
    W: W, H: H,
    themes: THEMES, theme: function (id) { return TMAP[id] || THEMES[0]; },
    frames: FRAMES,
    bg: bg,
    frame: frame,
    setYear: applyYear,
    year: function () { return YV; }
  };
})();
