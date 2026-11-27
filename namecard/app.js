/* 와글링 명함집 (Wagling Namecards) v1 — 2026-11-27
   내 명함 만들기(8가지 테마·PNG 저장·카톡/문자 공유·vCard QR) + 받은 명함 보관함(사진·검색·태그·전화/문자/메일)
   모든 자료는 이 기기(localStorage)에만 저장. 서버·DB·유료 API 없음. */
(function () {
  'use strict';

  /* ── 작은 도구 ───────────────────────────── */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function uid() { return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function digits(s) { return String(s || '').replace(/[^0-9]/g, ''); }
  function telOf(s) { return String(s || '').replace(/[^0-9+]/g, ''); }
  function pretty(s) {
    var raw = String(s || '').trim();
    if (!raw) return '';
    if (/[-.]/.test(raw)) return raw.replace(/\./g, '-');
    var d = digits(raw);
    if (d.length === 11) return d.slice(0, 3) + '-' + d.slice(3, 7) + '-' + d.slice(7);
    if (d.length === 10) return d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6);
    if (d.length === 8) return d.slice(0, 4) + '-' + d.slice(4);
    return raw;
  }
  function clampText(t, n) { t = String(t || '').trim(); return t.length > n ? t.slice(0, n - 1) + '…' : t; }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  /* ── 언어 ─────────────────────────────────── */
  var I18N = {
    ko: {
      'app.title': '와글링 명함집', 'app.sub': '내 명함 만들기 · 받은 명함 보관함',
      'top.install': '설치', 'top.share': '공유',
      'tab.mine': '내 명함', 'tab.wallet': '받은 명함',
      'today.loading': '날씨 확인 중',
      'mine.hero': '내 대표 명함', 'mine.edit': '고치기',
      'mine.hint': '명함은 이 폰에만 저장돼요 · QR을 찍으면 상대 연락처에 바로 들어가요',
      'mine.list': '내 명함', 'mine.none': '아직 내 명함이 없어요',
      'mine.noneSub': '일·모임·부업·개인용 명함을 여러 장 만들어 두고, 필요할 때 바로 보여 주거나 보낼 수 있어요.',
      'mine.sample': '✍️ 예시로 미리 채워 보기', 'mine.add': '새 명함 만들기',
      'mine.selected': '대표', 'mine.tapPick': '눌러서 대표 명함으로', 'mine.noName': '(이름 없음)',
      'act.save': '이미지 저장', 'act.send': '카톡·문자', 'act.qr': '명함 QR',
      'wallet.search': '이름·소속·메모로 찾기', 'wallet.none': '받은 명함이 없어요',
      'wallet.noneSub': '받은 명함을 사진으로 찍어 담아 두면, 필요할 때 이름·소속으로 찾아 바로 전화하고 문자할 수 있어요.',
      'wallet.add': '받은 명함 담기', 'wallet.noMatch': '찾는 명함이 없어요',
      'tag.all': '전체', 'tag.biz': '거래처', 'tag.care': '병원·돌봄', 'tag.club': '모임', 'tag.friend': '지인', 'tag.etc': '기타',
      'backup.title': '백업 (명함 잃지 않기)',
      'backup.desc': '내 명함·받은 명함·사진을 한 파일(JSON)로 저장해 두고, 폰을 바꾸거나 지웠을 때 다시 불러올 수 있어요. 파일은 이 폰에만 저장돼요.',
      'backup.save': '백업 저장', 'backup.load': '백업 불러오기', 'backup.count': '지금 내 명함 {a}장 · 받은 명함 {b}장',
      'backup.saved': '백업 파일을 저장했어요.',
      'backup.bad': '이 파일은 명함집 백업 파일이 아니에요.',
      'backup.merged': '백업에서 {n}장을 가져왔어요.',
      'backup.nothing': '새로 가져올 명함이 없었어요.',
      'backup.empty': '아직 백업할 명함이 없어요.',
      'f.purpose': '목적', 'f.name': '이름 *', 'f.title': '직함 · 한 줄 소개', 'f.org': '소속 · 브랜드',
      'f.phone': '전화번호', 'f.email': '이메일', 'f.web': '홈페이지 · SNS', 'f.addr': '주소 · 지역', 'f.memo': '한 줄 메모',
      'f.photo': '프로필 · 로고 사진 (선택)', 'f.photoPick': '사진 넣기', 'f.photoDel': '빼기',
      'f.photoTip': '사진은 이 폰에만 저장되고, QR 코드에는 들어가지 않아요. (명함 이미지에는 들어가요)',
      'f.save': '저장', 'f.cancel': '취소',
      'f.cardPhoto': '명함 사진 (선택)', 'f.camera': '사진 찍기', 'f.gallery': '사진 고르기',
      'p.work': '일', 'p.club': '모임', 'p.side': '부업', 'p.personal': '개인', 'p.etc': '기타',
      'edit.new': '내 명함 만들기', 'edit.edit': '내 명함 고치기', 'edit.needName': '이름을 넣어 주세요.',
      'edit.saved': '명함을 저장했어요.', 'edit.deleted': '명함을 지웠어요.', 'edit.undo': '되돌리기',
      'edit.delAsk': '이 명함을 지울까요?', 'edit.deleted2': '지웠어요. 5초 안에 되돌릴 수 있어요.',
      'recv.new': '받은 명함 담기', 'recv.edit': '받은 명함 고치기', 'recv.needName': '이름을 넣어 주세요.',
      'recv.saved': '받은 명함을 저장했어요.', 'recv.deleted': '받은 명함을 지웠어요.',
      'r.name': '이름 *', 'r.org': '소속 · 회사', 'r.title': '직함', 'r.phone': '전화번호', 'r.email': '이메일',
      'r.tag': '분류', 'r.memo': '메모 (어디서 만났는지)',
      'detail.title': '받은 명함', 'detail.edit': '고치기', 'detail.vcf': '연락처 저장',
      'detail.phone': '전화', 'detail.sms': '문자', 'detail.email': '메일',
      'detail.memo': '메모', 'detail.tag': '분류', 'detail.saved': '담은 날',
      'detail.zoom': '🔍 크게 보기', 'detail.copy': '복사', 'detail.copied': '복사했어요.', 'detail.vcfSaved': '연락처 파일(.vcf)을 저장했어요.',
      'detail.vcfHint': '저장한 파일을 눌러 연락처에 추가할 수 있어요.',
      'qr.title': '명함 QR', 'qr.note': '상대가 카메라로 찍으면 연락처에 바로 저장돼요. 화면을 밝게 해 주세요.',
      'qr.save': 'QR 이미지 저장', 'qr.copy': '명함 정보 복사',
      'qr.tooLong': '명함 내용이 너무 길어 QR에 담기 어려워요. 메모나 소개를 조금 줄여 주세요.',
      'qr.saved': 'QR 이미지를 저장했어요.', 'qr.copied': '명함 정보를 복사했어요.',
      'inst.title': '홈 화면에 설치', 'inst.go': '설치하기',
      'inst.android': '크롬(Chrome)에서 이 화면을 연 뒤, 오른쪽 위 ⋮ 를 누르고 <b>홈 화면에 추가</b>를 눌러 주세요.',
      'inst.ios': '사파리에서 아래 <b>공유</b> 버튼을 누르고 <b>홈 화면에 추가</b>를 눌러 주세요.',
      'inst.kakao': '카톡 안에서는 설치가 잘 안 돼요. 아래 버튼으로 크롬에 열어 주세요.',
      'inst.chrome': '🌐 크롬으로 바로 열기',
      'toast.needCard': '먼저 내 명함을 만들어 주세요.',
      'toast.exported': '명함 이미지를 저장했어요.',
      'toast.exportFail': '이미지를 만들지 못했어요. 다시 눌러 주세요.',
      'toast.savedSend': '이미지를 저장했어요. 카톡을 열어 사진첩에서 보내 주세요.',
      'toast.shareFail': '공유를 열지 못했어요. 이미지로 저장해 보세요.',
      'toast.photoBig': '사진이 커서 저장하지 못했어요. 더 작은 사진으로 해 주세요.',
      'toast.photoFail': '사진을 읽지 못했어요. 다른 사진으로 해 주세요.',
      'toast.storageFull': '폰 저장 공간이 가득 찼어요. 받은 명함 사진 몇 장을 지운 뒤 다시 해 주세요.',
      'toast.copyFail': '복사하지 못했어요. 길게 눌러 복사해 주세요.',
      'toast.tel': '전화 앱이 열려요 — 초록색 통화 버튼을 눌러 주세요.',
      'toast.sms': '문자 앱이 열려요 — 보내기 버튼을 눌러 주세요.',
      'toast.needPhone': '전화번호가 없어요.',
      'toast.needEmail': '이메일이 없어요.',
      'toast.appShared': '주소를 복사했어요 — 붙여 넣어 보내 주세요.',
      'toast.installed': '홈 화면에 넣었어요.'
    },
    en: {
      'app.title': 'Wagling Namecards', 'app.sub': 'Make your cards · Keep the ones you get',
      'top.install': 'Install', 'top.share': 'Share',
      'tab.mine': 'My cards', 'tab.wallet': 'Received',
      'today.loading': 'Checking weather',
      'mine.hero': 'My main card', 'mine.edit': 'Edit',
      'mine.hint': 'Cards stay on this phone · Scanning the QR saves you straight to contacts',
      'mine.list': 'My cards', 'mine.none': 'No card yet',
      'mine.noneSub': 'Keep a card for work, clubs, your side project, and yourself — show it or send it in a tap.',
      'mine.sample': '✍️ Fill with an example', 'mine.add': 'New card',
      'mine.selected': 'Main', 'mine.tapPick': 'Tap to make it your main card', 'mine.noName': '(no name)',
      'act.save': 'Save image', 'act.send': 'Kakao·SMS', 'act.qr': 'Card QR',
      'wallet.search': 'Search name, company, note', 'wallet.none': 'No received cards yet',
      'wallet.noneSub': 'Photograph a card you receive. Later, find it by name or company and call or text in one tap.',
      'wallet.add': 'Add received card', 'wallet.noMatch': 'No card matches',
      'tag.all': 'All', 'tag.biz': 'Clients', 'tag.care': 'Care', 'tag.club': 'Clubs', 'tag.friend': 'Friends', 'tag.etc': 'Other',
      'backup.title': 'Backup (never lose a card)',
      'backup.desc': 'Save your cards and photos in one JSON file, and load it back when you change phones. The file stays on this phone.',
      'backup.save': 'Save backup', 'backup.load': 'Load backup', 'backup.count': '{a} mine · {b} received',
      'backup.saved': 'Backup file saved.',
      'backup.bad': 'That is not a namecard backup file.',
      'backup.merged': 'Imported {n} cards from the backup.',
      'backup.nothing': 'Nothing new to import.',
      'backup.empty': 'There are no cards to back up yet.',
      'f.purpose': 'Purpose', 'f.name': 'Name *', 'f.title': 'Title · short intro', 'f.org': 'Company · brand',
      'f.phone': 'Phone', 'f.email': 'Email', 'f.web': 'Website · SNS', 'f.addr': 'Address · area', 'f.memo': 'One-line note',
      'f.photo': 'Profile · logo photo (optional)', 'f.photoPick': 'Add photo', 'f.photoDel': 'Remove',
      'f.photoTip': 'The photo stays on this phone and is not included in the QR code. (It is included in the card image.)',
      'f.save': 'Save', 'f.cancel': 'Cancel',
      'f.cardPhoto': 'Card photo (optional)', 'f.camera': 'Take photo', 'f.gallery': 'Choose photo',
      'p.work': 'Work', 'p.club': 'Club', 'p.side': 'Side', 'p.personal': 'Personal', 'p.etc': 'Other',
      'edit.new': 'Make my card', 'edit.edit': 'Edit my card', 'edit.needName': 'Please enter a name.',
      'edit.saved': 'Card saved.', 'edit.deleted': 'Card deleted.', 'edit.undo': 'Undo',
      'edit.delAsk': 'Delete this card?', 'edit.deleted2': 'Deleted. You can undo for 5 seconds.',
      'recv.new': 'Add received card', 'recv.edit': 'Edit received card', 'recv.needName': 'Please enter a name.',
      'recv.saved': 'Received card saved.', 'recv.deleted': 'Received card deleted.',
      'r.name': 'Name *', 'r.org': 'Company', 'r.title': 'Title', 'r.phone': 'Phone', 'r.email': 'Email',
      'r.tag': 'Category', 'r.memo': 'Note (where you met)',
      'detail.title': 'Received card', 'detail.edit': 'Edit', 'detail.vcf': 'Save contact',
      'detail.phone': 'Call', 'detail.sms': 'Text', 'detail.email': 'Email',
      'detail.memo': 'Note', 'detail.tag': 'Category', 'detail.saved': 'Saved',
      'detail.zoom': '🔍 View large', 'detail.copy': 'Copy', 'detail.copied': 'Copied.', 'detail.vcfSaved': 'Contact file (.vcf) saved.',
      'detail.vcfHint': 'Tap the saved file to add them to contacts.',
      'qr.title': 'Card QR', 'qr.note': 'The other person scans it with a camera and it saves straight to contacts. Keep the screen bright.',
      'qr.save': 'Save QR image', 'qr.copy': 'Copy card info',
      'qr.tooLong': 'The card text is too long for a QR code. Please shorten the note or intro.',
      'qr.saved': 'QR image saved.', 'qr.copied': 'Card info copied.',
      'inst.title': 'Install on home screen', 'inst.go': 'Install',
      'inst.android': 'Open this page in Chrome, tap ⋮ at the top right, then <b>Add to Home screen</b>.',
      'inst.ios': 'In Safari, tap <b>Share</b>, then <b>Add to Home Screen</b>.',
      'inst.kakao': 'Installing does not work well inside KakaoTalk. Open it in Chrome with the button below.',
      'inst.chrome': '🌐 Open in Chrome',
      'toast.needCard': 'Please make your card first.',
      'toast.exported': 'Card image saved.',
      'toast.exportFail': 'Could not make the image. Please tap again.',
      'toast.savedSend': 'Image saved. Open KakaoTalk and send it from Photos.',
      'toast.shareFail': 'Could not open sharing. Try saving the image instead.',
      'toast.photoBig': 'That photo is too large to store. Please use a smaller one.',
      'toast.photoFail': 'Could not read that photo. Please try another one.',
      'toast.storageFull': 'Phone storage is full. Delete a few received-card photos and try again.',
      'toast.copyFail': 'Could not copy. Please press and hold to copy.',
      'toast.tel': 'The phone app is opening — tap the green call button.',
      'toast.sms': 'The message app is opening — tap Send.',
      'toast.needPhone': 'No phone number.',
      'toast.needEmail': 'No email address.',
      'toast.appShared': 'Link copied — paste it to send.',
      'toast.installed': 'Added to your home screen.'
    }
  };
  var LANG = 'ko';
  function t(key, vars) {
    var s = (I18N[LANG] && I18N[LANG][key]) || I18N.ko[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]); });
    return s;
  }
  function applyI18n() {
    $$('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-ph]').forEach(function (el) { el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph'))); });
    document.documentElement.lang = LANG;
    $('#langBtn').textContent = LANG === 'ko' ? '🌐 한' : '🌐 EN';
    document.title = LANG === 'ko'
      ? '와글링 명함집 · 내 명함 만들기 · 받은 명함 보관함'
      : 'Wagling Namecards · Make a card · Keep received cards';
  }
  function toast(msg, actLabel, actFn, ms) {
    var box = $('#toast'), m = $('#toastMsg'), a = $('#toastAct');
    m.textContent = msg;
    toastAct = actFn || null;
    if (actLabel && actFn) { a.textContent = actLabel; a.hidden = false; }
    else { a.hidden = true; a.textContent = ''; }
    box.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { box.classList.remove('on'); }, ms || 3400);
  }
  var toastTimer = null, toastAct = null;

  /* ── 저장 ─────────────────────────────────── */
  var K_MINE = 'wagleNamecard.mine.v1';
  var K_WALLET = 'wagleNamecard.wallet.v1';
  var K_UI = 'wagleNamecard.ui.v1';
  var K_WX = 'wagleNamecard.wx.v1';
  var S = { mine: [], wallet: [], sel: null, tag: 'all', q: '' };

  function load() {
    try {
      var a = JSON.parse(localStorage.getItem(K_MINE) || '[]');
      if (Array.isArray(a)) S.mine = a.filter(function (x) { return x && x.id; });
    } catch (e) { S.mine = []; }
    try {
      var b = JSON.parse(localStorage.getItem(K_WALLET) || '[]');
      if (Array.isArray(b)) S.wallet = b.filter(function (x) { return x && x.id; });
    } catch (e) { S.wallet = []; }
    try {
      var u = JSON.parse(localStorage.getItem(K_UI) || '{}');
      if (u && typeof u === 'object') {
        if (u.lang === 'en' || u.lang === 'ko') LANG = u.lang;
        if (u.tag) S.tag = u.tag;
        if (u.sel) S.sel = u.sel;
      }
    } catch (e) {}
    if (!S.mine.some(function (x) { return x.id === S.sel; })) S.sel = S.mine[0] ? S.mine[0].id : null;
  }
  function saveMine() { try { localStorage.setItem(K_MINE, JSON.stringify(S.mine)); return true; } catch (e) { toast(t('toast.storageFull'), null, null, 5200); return false; } }
  function saveWallet() { try { localStorage.setItem(K_WALLET, JSON.stringify(S.wallet)); return true; } catch (e) { toast(t('toast.storageFull'), null, null, 5200); return false; } }
  function saveUI() { try { localStorage.setItem(K_UI, JSON.stringify({ lang: LANG, tag: S.tag, sel: S.sel })); } catch (e) {} }

  /* ── 테마 ─────────────────────────────────── */
  var THEMES = [
    { id: 'white', ko: '깔끔 화이트', en: 'Clean White', bg: '#FFFFFF', bg2: '#F4F7F9', ink: '#17222E', sub: '#5C6A78', accent: '#1E6E78', line: '#D9E1E6', style: 'clean' },
    { id: 'navy', ko: '네이비 골드', en: 'Navy Gold', bg: '#0F2238', bg2: '#193A57', ink: '#FBF4E2', sub: '#CDBB94', accent: '#D9B36A', line: '#3C5876', style: 'gold' },
    { id: 'dark', ko: '다크 모던', en: 'Dark Modern', bg: '#14171A', bg2: '#232A30', ink: '#F3F5F6', sub: '#9DAAB2', accent: '#4FD1C5', line: '#39444C', style: 'edge' },
    { id: 'hanji', ko: '한국 한지', en: 'Hanji', bg: '#F3E8D2', bg2: '#EADCC0', ink: '#3A2C20', sub: '#7B6653', accent: '#9C3B2E', line: '#CDB995', style: 'hanji' },
    { id: 'mint', ko: '파스텔 민트', en: 'Pastel Mint', bg: '#EAF7F0', bg2: '#DCEFE4', ink: '#14483C', sub: '#4E7C6E', accent: '#2E9E7E', line: '#BFDCCE', style: 'clean' },
    { id: 'coral', ko: '코랄 포인트', en: 'Coral Pop', bg: '#FFF3EE', bg2: '#FFE5DA', ink: '#46231C', sub: '#8B5C4F', accent: '#E4634A', line: '#F3CCBF', style: 'clean' },
    { id: 'olive', ko: '올리브 세이지', en: 'Olive Sage', bg: '#EFF1E4', bg2: '#E4E8D4', ink: '#333A22', sub: '#6C7551', accent: '#6B7B3C', line: '#CFD6B6', style: 'clean' },
    { id: 'plum', ko: '로열 퍼플', en: 'Royal Plum', bg: '#291B3C', bg2: '#3A2654', ink: '#F7EFFF', sub: '#C6B1E0', accent: '#D0A9FF', line: '#4F3B6C', style: 'gold' }
  ];
  function themeOf(id) { for (var i = 0; i < THEMES.length; i++) if (THEMES[i].id === id) return THEMES[i]; return THEMES[0]; }
  function themeName(th) { return LANG === 'ko' ? th.ko : th.en; }
  function themeSwatch(th) {
    return 'style="--sw:' + th.accent + ';background:linear-gradient(135deg,' + th.bg + ' 55%,' + (th.bg2 || th.bg) + ')"';
  }

  /* ── 사진 캐시 ────────────────────────────── */
  var imgCache = {};
  function photoImg(url) {
    if (!url) return null;
    var im = imgCache[url];
    if (im && im.complete && im.naturalWidth) return im;
    if (!im) {
      im = new Image();
      im.onload = function () { redrawAll(); };
      im.src = url;
      imgCache[url] = im;
    }
    return (im.complete && im.naturalWidth) ? im : null;
  }
  function redrawAll() {
    if (S.mine.length) heroDraw();
    if (!$('#sheetEdit').hidden) editDraw();
  }

  /* ── 명함 그리기(미리보기 = 내보내기 같은 화면) ── */
  var FONT = '"Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';

  function rrect(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, Math.min(w, h) / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function fitFont(ctx, text, maxW, start, min, weight) {
    var size = start;
    for (; size > min; size -= 2) {
      ctx.font = weight + ' ' + size + 'px ' + FONT;
      if (ctx.measureText(text).width <= maxW) break;
    }
    ctx.font = weight + ' ' + size + 'px ' + FONT;
    return size;
  }
  function ellipsis(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    var s = String(text), lo = 0, hi = s.length;
    while (lo < hi) {
      var mid = Math.ceil((lo + hi) / 2);
      if (ctx.measureText(s.slice(0, mid) + '…').width <= maxW) lo = mid; else hi = mid - 1;
    }
    return s.slice(0, Math.max(1, lo)) + '…';
  }
  function icon(ctx, type, x, y, size, color) {
    var s = size / 24;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (type === 'tel') {
      rrect(ctx, 7.5, 2.5, 9, 19, 2.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(10.6, 18.2); ctx.lineTo(13.4, 18.2); ctx.stroke();
      ctx.beginPath(); ctx.arc(12, 5.6, 0.7, 0, Math.PI * 2); ctx.fill();
    } else if (type === 'mail') {
      rrect(ctx, 2.5, 5, 19, 14, 2.2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(3.6, 6.6); ctx.lineTo(12, 13); ctx.lineTo(20.4, 6.6); ctx.stroke();
    } else if (type === 'web') {
      ctx.beginPath(); ctx.arc(12, 12, 9, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(3, 12); ctx.lineTo(21, 12); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(12, 12, 4.2, 9, 0, 0, Math.PI * 2); ctx.stroke();
    } else if (type === 'pin') {
      ctx.beginPath(); ctx.arc(12, 9.6, 6.1, Math.PI * 0.85, Math.PI * 2.15); ctx.lineTo(12, 21.4); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.arc(12, 9.6, 2.1, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  function purposeLabel(p) {
    var m = { work: 'p.work', club: 'p.club', side: 'p.side', personal: 'p.personal', etc: 'p.etc' };
    return t(m[p] || 'p.etc');
  }
  function contactLines(c) {
    var arr = [];
    if (c.phone) arr.push({ i: 'tel', v: pretty(c.phone) });
    if (c.email) arr.push({ i: 'mail', v: c.email });
    if (c.web) arr.push({ i: 'web', v: c.web });
    if (c.addr) arr.push({ i: 'pin', v: c.addr });
    return arr;
  }

  function drawCard(ctx, W, H, c, th) {
    var s = W / 1080;
    ctx.save();
    ctx.clearRect(0, 0, W, H);

    /* 배경 */
    var g = ctx.createLinearGradient(0, 0, W * 0.95, H);
    g.addColorStop(0, th.bg);
    g.addColorStop(1, th.bg2 || th.bg);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    var pad = 60 * s, colW = 724 * s;

    /* 테마 장식 */
    if (th.style === 'clean') {
      ctx.fillStyle = th.accent;
      ctx.fillRect(0, 0, 12 * s, H);
      ctx.strokeStyle = 'rgba(120,140,155,.18)';
      ctx.lineWidth = 1.5 * s;
      ctx.beginPath(); ctx.arc(W - 92 * s, 96 * s, 150 * s, 0, Math.PI * 2); ctx.stroke();
    } else if (th.style === 'gold') {
      ctx.strokeStyle = th.accent;
      ctx.globalAlpha = .55;
      ctx.lineWidth = 2 * s;
      ctx.strokeRect(26 * s, 26 * s, W - 52 * s, H - 52 * s);
      ctx.globalAlpha = 1;
      [[26, 26], [W - 26, 26], [26, H - 26], [W - 26, H - 26]].forEach(function (p) {
        ctx.save(); ctx.translate(p[0] * 1, p[1] * 1); ctx.rotate(Math.PI / 4);
        ctx.fillStyle = th.accent; ctx.fillRect(-5 * s, -5 * s, 10 * s, 10 * s); ctx.restore();
      });
    } else if (th.style === 'edge') {
      var gg = ctx.createRadialGradient(W * 0.86, H * 0.1, 10 * s, W * 0.86, H * 0.1, 420 * s);
      gg.addColorStop(0, 'rgba(79,209,197,.22)');
      gg.addColorStop(1, 'rgba(79,209,197,0)');
      ctx.fillStyle = gg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = th.accent;
      ctx.fillRect(0, 0, 9 * s, H);
    } else if (th.style === 'hanji') {
      var seed = 7;
      function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      ctx.fillStyle = 'rgba(120,92,54,.13)';
      for (var i = 0; i < 70; i++) {
        var rx = rnd() * W, ry = rnd() * H, rr = (0.7 + rnd() * 1.7) * s;
        ctx.beginPath(); ctx.arc(rx, ry, rr, 0, Math.PI * 2); ctx.fill();
      }
      ctx.strokeStyle = 'rgba(140,110,70,.32)';
      ctx.lineWidth = 1.4 * s;
      ctx.strokeRect(26 * s, 26 * s, W - 52 * s, H - 52 * s);
      /* 창살 문양 */
      ctx.save();
      ctx.globalAlpha = .10;
      ctx.strokeStyle = th.accent;
      ctx.lineWidth = 3 * s;
      var mx = W - 200 * s, my = H - 180 * s;
      ctx.beginPath(); ctx.arc(mx, my, 120 * s, 0, Math.PI * 2); ctx.stroke();
      for (var k = 0; k < 8; k++) {
        var a = Math.PI * 2 * k / 8;
        ctx.beginPath(); ctx.moveTo(mx + Math.cos(a) * 46 * s, my + Math.sin(a) * 46 * s);
        ctx.lineTo(mx + Math.cos(a) * 120 * s, my + Math.sin(a) * 120 * s); ctx.stroke();
      }
      ctx.restore();
    }

    /* 사진 또는 첫 글자 */
    var d = 196 * s, cx = W - pad - d / 2, cy = pad + d / 2, rad = d / 2;
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
    var im = photoImg(c.photo);
    if (im) {
      var sc = Math.max(d / im.naturalWidth, d / im.naturalHeight);
      var dw = im.naturalWidth * sc, dh = im.naturalHeight * sc;
      ctx.drawImage(im, cx - dw / 2, cy - dh / 2, dw, dh);
    } else {
      ctx.fillStyle = th.style === 'gold' ? 'rgba(255,255,255,.10)' : 'rgba(120,140,160,.14)';
      ctx.fillRect(cx - rad, cy - rad, d, d);
      var ch = String(c.name || '').trim().charAt(0) || '·';
      ctx.fillStyle = th.accent;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '900 ' + (78 * s) + 'px ' + FONT;
      ctx.fillText(ch, cx, cy + 4 * s);
    }
    ctx.restore();
    ctx.beginPath(); ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.strokeStyle = th.style === 'hanji' ? 'rgba(140,110,70,.5)' : (th.style === 'gold' ? th.accent : th.line);
    ctx.lineWidth = 3 * s; ctx.stroke();

    /* 목적 칩 */
    var pp = String(c.purpose || 'etc');
    var pl = purposeLabel(pp);
    ctx.font = '900 ' + (22 * s) + 'px ' + FONT;
    var pw = ctx.measureText(pl).width + 30 * s;
    rrect(ctx, pad, pad, pw, 38 * s, 19 * s);
    ctx.strokeStyle = th.style === 'gold' ? 'rgba(217,179,106,.75)' : th.accent;
    ctx.lineWidth = 1.6 * s; ctx.stroke();
    ctx.fillStyle = th.accent; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(pl, pad + 15 * s, pad + 20 * s);

    /* 소속 */
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    if (c.org) {
      var org = String(c.org);
      fitFont(ctx, org, colW, 27 * s, 17 * s, '800');
      if ('letterSpacing' in ctx) ctx.letterSpacing = (2.4 * s) + 'px';
      ctx.fillStyle = th.accent;
      ctx.fillText(ellipsis(ctx, org, colW), pad, 158 * s);
      if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';
    }

    /* 이름 */
    var name = String(c.name || '');
    if (name) {
      fitFont(ctx, name, colW, 64 * s, 32 * s, '900');
      ctx.fillStyle = th.ink;
      ctx.fillText(name, pad, (c.org ? 242 : 210) * s);
    }
    /* 직함 */
    if (c.title) {
      ctx.font = '700 ' + (29 * s) + 'px ' + FONT;
      ctx.fillStyle = th.sub;
      ctx.fillText(ellipsis(ctx, String(c.title), colW), pad, (c.org ? 294 : 262) * s);
    }

    /* 구분선 */
    var lineY = (c.org ? 322 : 290) * s;
    ctx.strokeStyle = th.line; ctx.globalAlpha = .85; ctx.lineWidth = 1.4 * s;
    ctx.beginPath(); ctx.moveTo(pad, lineY); ctx.lineTo(pad + colW, lineY); ctx.stroke();
    ctx.globalAlpha = 1;

    /* 연락처 */
    var lines = contactLines(c);
    var ly = lineY + 50 * s;
    ctx.textBaseline = 'middle';
    for (var j = 0; j < lines.length && j < 4; j++) {
      icon(ctx, lines[j].i, pad + 2 * s, ly - 11 * s, 24 * s, th.accent);
      ctx.font = '700 ' + (26 * s) + 'px ' + FONT;
      ctx.fillStyle = th.ink;
      ctx.fillText(ellipsis(ctx, lines[j].v, colW - 42 * s), pad + 40 * s, ly);
      ly += 43 * s;
    }

    /* 메모 */
    if (c.memo) {
      ctx.font = 'italic 600 ' + (23 * s) + 'px ' + FONT;
      ctx.fillStyle = th.sub;
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(ellipsis(ctx, '“' + String(c.memo) + '”', colW), pad, H - 52 * s);
    }

    /* 한지 도장 */
    if (th.style === 'hanji') {
      var ss = 86 * s, sx = W - pad - ss, sy = H - pad - ss;
      rrect(ctx, sx, sy, ss, ss, 10 * s);
      ctx.fillStyle = '#A83A2E'; ctx.fill();
      ctx.fillStyle = '#F8EEDC';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '900 ' + (46 * s) + 'px ' + FONT;
      ctx.fillText(String(c.name || '').trim().charAt(0) || '名', sx + ss / 2, sy + ss / 2 + 2 * s);
      ctx.textAlign = 'left';
    }
    ctx.restore();
  }

  function drawPlaceholder(ctx, W, H, th) {
    var s = W / 1080;
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = th.bg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = th.accent; ctx.globalAlpha = .10; ctx.fillRect(0, 0, 12 * s, H); ctx.globalAlpha = 1;
    ctx.setLineDash([13 * s, 11 * s]);
    ctx.strokeStyle = th.line; ctx.lineWidth = 2.4 * s;
    rrect(ctx, 34 * s, 34 * s, W - 68 * s, H - 68 * s, 18 * s); ctx.stroke();
    ctx.setLineDash([]);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = th.sub;
    ctx.font = '900 ' + (34 * s) + 'px ' + FONT;
    ctx.fillText(LANG === 'ko' ? '여기에 내 명함이 보여요' : 'Your card will appear here', W / 2, H / 2 - 19 * s);
    ctx.fillStyle = th.accent;
    ctx.font = '800 ' + (26 * s) + 'px ' + FONT;
    ctx.fillText(LANG === 'ko' ? '아래 ➕ 새 명함 만들기를 눌러 주세요' : 'Tap ➕ New card below', W / 2, H / 2 + 34 * s);
    ctx.restore();
  }

  function heroDraw() {
    var cv = $('#heroCanvas'), ctx = cv.getContext('2d');
    if (!ctx) return;
    var c = currentCard();
    if (!c) { drawPlaceholder(ctx, cv.width, cv.height, THEMES[0]); return; }
    drawCard(ctx, cv.width, cv.height, c, themeOf(c.theme));
  }
  function currentCard() {
    for (var i = 0; i < S.mine.length; i++) if (S.mine[i].id === S.sel) return S.mine[i];
    return S.mine[0] || null;
  }

  /* ── vCard · QR · 내보내기 ─────────────────── */
  function vesc(v) {
    return String(v == null ? '' : v).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  }
  function vcardOf(c) {
    var L = ['BEGIN:VCARD', 'VERSION:3.0'];
    L.push('N:;' + vesc(c.name) + ';;;');
    L.push('FN:' + vesc(c.name));
    if (c.org) L.push('ORG:' + vesc(c.org));
    if (c.title) L.push('TITLE:' + vesc(c.title));
    if (c.phone) L.push('TEL;TYPE=CELL:' + telOf(c.phone));
    if (c.email) L.push('EMAIL;TYPE=INTERNET:' + String(c.email).trim());
    if (c.web) L.push('URL:' + String(c.web).trim());
    if (c.addr) L.push('ADR;TYPE=WORK:;;' + vesc(c.addr) + ';;;;');
    if (c.memo) L.push('NOTE:' + vesc(c.memo));
    L.push('END:VCARD');
    return L.join('\r\n');
  }
  function safeName(s) { return String(s || '명함').replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, '_').slice(0, 30) || '명함'; }

  function canvasBlob(cv) {
    return new Promise(function (res, rej) {
      try {
        cv.toBlob(function (b) { if (b) res(b); else rej(new Error('blob')); }, 'image/png');
      } catch (e) { rej(e); }
    });
  }
  function download(blob, name) {
    try {
      var a = document.createElement('a');
      var url = URL.createObjectURL(blob);
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 2000);
    } catch (e) {}
  }
  function cardCanvas(card, mult) {
    var cv = document.createElement('canvas');
    cv.width = Math.round(1080 * (mult || 1));
    cv.height = Math.round(600 * (mult || 1));
    var ctx = cv.getContext('2d');
    drawCard(ctx, cv.width, cv.height, card, themeOf(card.theme));
    return cv;
  }
  function shareTextOf(c) {
    var parts = [];
    if (c.name) parts.push(c.name);
    if (c.title) parts.push(c.title);
    if (c.org) parts.push(c.org);
    if (c.phone) parts.push('☎ ' + pretty(c.phone));
    if (c.email) parts.push('✉ ' + c.email);
    if (c.web) parts.push('🌐 ' + c.web);
    if (c.addr) parts.push('📍 ' + c.addr);
    return parts.join('\n');
  }

  function exportCardImage() {
    var c = currentCard();
    if (!c) { toast(t('toast.needCard')); return Promise.resolve();
      }
    return canvasBlob(cardCanvas(c, 1.5)).then(function (blob) {
      download(blob, '명함_' + safeName(c.name) + '.png');
      toast(t('toast.exported'));
    }).catch(function () { toast(t('toast.exportFail')); });
  }

  function sendCardImage() {
    var c = currentCard();
    if (!c) { toast(t('toast.needCard')); return; }
    canvasBlob(cardCanvas(c, 1.5)).then(function (blob) {
      var file;
      try { file = new File([blob], '명함_' + safeName(c.name) + '.png', { type: 'image/png' }); } catch (e) { file = null; }
      var data = { files: file ? [file] : undefined, title: c.name + (c.org ? ' · ' + c.org : ''), text: shareTextOf(c) };
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share(data).catch(function (err) {
          if (err && err.name === 'AbortError') return;
          download(blob, '명함_' + safeName(c.name) + '.png');
          toast(t('toast.savedSend'), null, null, 4600);
        });
        return;
      }
      download(blob, '명함_' + safeName(c.name) + '.png');
      toast(t('toast.savedSend'), null, null, 4600);
    }).catch(function () { toast(t('toast.exportFail')); });
  }

  var qrText = '';
  function drawQRTo(cv, text) {
    var ctx = cv.getContext('2d');
    var W = cv.width, H = cv.height;
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H);
    if (!window.qrcode) return false;
    var q;
    try {
      q = qrcode(0, 'M');
      q.addData(text, 'Byte');
      q.make();
    } catch (e) { return false; }
    var n = q.getModuleCount();
    /* 칸 크기를 정수로 맞춰 모든 모듈을 같은 크기로 또렷하게 그린다 */
    var cell = Math.max(1, Math.floor(Math.min(W, H) / (n + 8)));
    var span = cell * n;
    var ox = Math.floor((W - span) / 2), oy = Math.floor((H - span) / 2);
    ctx.fillStyle = '#0E1820';
    for (var r = 0; r < n; r++) {
      for (var col = 0; col < n; col++) {
        if (q.isDark(r, col)) ctx.fillRect(ox + col * cell, oy + r * cell, cell, cell);
      }
    }
    return true;
  }
  function fitQRCanvas() {
    var cv = $('#qrCanvas');
    var fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 18;
    var cssW = Math.max(220, Math.min(window.innerWidth * 0.8, 17 * fs));
    var dpr = Math.min(3, window.devicePixelRatio || 1);
    cv.style.width = cssW + 'px';
    cv.style.height = cssW + 'px';
    cv.width = Math.round(cssW * dpr);
    cv.height = Math.round(cssW * dpr);
  }
  function paintQR() {
    var cv = $('#qrCanvas');
    if (!cv || !qrText) return false;
    var bytes = new TextEncoder().encode(qrText).length;
    var warn = $('#qrWarn'), ok = true;
    if (bytes > 1100) {
      warn.textContent = t('qr.tooLong'); warn.hidden = false; ok = false;
      var c0 = cv.getContext('2d'); c0.fillStyle = '#fff'; c0.fillRect(0, 0, cv.width, cv.height);
    } else {
      warn.hidden = true;
      ok = drawQRTo(cv, qrText);
      if (!ok) { warn.textContent = t('qr.tooLong'); warn.hidden = false; }
    }
    $('#qrSave').disabled = !ok;
    $('#qrSave').style.opacity = ok ? '' : '.45';
    return ok;
  }
  function openQR() {
    var c = currentCard();
    if (!c) { toast(t('toast.needCard')); return; }
    qrText = vcardOf(c);
    $('#qrName').textContent = (c.name || '') + (c.org ? ' · ' + c.org : '');
    openPanel('sheetQR');
    requestAnimationFrame(function () { fitQRCanvas(); paintQR(); });
  }
  function saveQRImage() {
    var c = currentCard();
    if (!c || !qrText) return;
    var cv = document.createElement('canvas');
    cv.width = 1024; cv.height = 1024;
    if (!drawQRTo(cv, qrText)) { toast(t('qr.tooLong')); return; }
    canvasBlob(cv).then(function (blob) {
      download(blob, '명함QR_' + safeName(c.name) + '.png');
      toast(t('qr.saved'));
    }).catch(function () { toast(t('toast.exportFail')); });
  }
  function copyText(text, okMsg) {
    function done() { toast(okMsg || t('detail.copied')); }
    function fail() { toast(t('toast.copyFail')); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { legacyCopy(text, done, fail); });
    } else legacyCopy(text, done, fail);
  }
  function legacyCopy(text, done, fail) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.top = '-9999px';
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand && document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) done(); else fail();
    } catch (e) { fail(); }
  }

  /* ── 사진 줄이기 ──────────────────────────── */
  function shrinkPhoto(file, maxSide, quality) {
    return new Promise(function (res, rej) {
      if (!file) return rej(new Error('nofile'));
      var fr = new FileReader();
      fr.onerror = function () { rej(new Error('read')); };
      fr.onload = function () {
        var im = new Image();
        im.onerror = function () { rej(new Error('img')); };
        im.onload = function () {
          var w = im.naturalWidth || im.width, h = im.naturalHeight || im.height;
          if (!w || !h) return rej(new Error('size'));
          var k = Math.min(1, maxSide / Math.max(w, h));
          w = Math.max(1, Math.round(w * k)); h = Math.max(1, Math.round(h * k));
          var cv = document.createElement('canvas');
          cv.width = w; cv.height = h;
          var ctx = cv.getContext('2d');
          ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, w, h);
          ctx.drawImage(im, 0, 0, w, h);
          try { res(cv.toDataURL('image/jpeg', quality)); } catch (e) { rej(e); }
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  /* ── 폰 뒤로가기 — 창 하나씩 닫기 ─────────── */
  var navLayers = [], navQuiet = 0, navBackBusy = false, navBackQueue = 0, navPopping = false;
  function navPushLayer(key, close) {
    if (navPopping) return;
    try { history.pushState({ wagleNamecard: navLayers.length + 1 }, '', location.href); }
    catch (e) { return; }
    navLayers.push({ key: key, close: close });
  }
  function navPumpBack() {
    if (navBackBusy || navBackQueue <= 0) return;
    navBackBusy = true; navQuiet++; navBackQueue--;
    try { history.back(); }
    catch (e) { navQuiet = Math.max(0, navQuiet - 1); navBackBusy = false; navPumpBack(); return; }
    setTimeout(function () {
      if (navBackBusy) { navBackBusy = false; navQuiet = Math.max(0, navQuiet - 1); navPumpBack(); }
    }, 900);
  }
  function navBackOnce() { navBackQueue++; navPumpBack(); }
  function navConsume(key) {
    if (navPopping) return 0;
    var n = 0;
    for (var i = navLayers.length - 1; i >= 0; i--) {
      if (navLayers[i].key === key) { navLayers.splice(i, 1); n++; }
    }
    for (var k = 0; k < n; k++) navBackOnce();
    return n;
  }
  window.addEventListener('popstate', function () {
    if (navQuiet > 0) { navQuiet--; navBackBusy = false; navPumpBack(); return; }
    var top = navLayers.pop();
    if (!top) return;
    navPopping = true;
    try { if (typeof top.close === 'function') top.close(); } catch (e) {}
    finally { navPopping = false; }
  });

  /* ── 창 열고 닫기 ─────────────────────────── */
  var panels = [];
  function lockScroll(on) { document.body.style.overflow = on ? 'hidden' : ''; }
  function openPanel(id) {
    var el = $('#' + id);
    if (!el || !el.hidden) return;
    el.hidden = false;
    panels.push(id);
    el.style.zIndex = String(80 + panels.length);
    lockScroll(true);
    document.body.classList.add('sheet-open');
    navPushLayer('panel:' + id, function () { closePanel(id, true); });
    try {
      var f = el.querySelector('input:not([type=file]),textarea,.btn.primary');
      if (f) f.focus({ preventScroll: true });
    } catch (e) {}
    el.querySelector('.sheetBody').scrollTop = 0;
  }
  function closePanel(id, fromBack) {
    var el = $('#' + id);
    if (!el || el.hidden) return;
    el.hidden = true;
    panels = panels.filter(function (x) { return x !== id; });
    if (!panels.length) { lockScroll(false); document.body.classList.remove('sheet-open'); }
    if (!fromBack) navConsume('panel:' + id);
  }
  $$('.sheetwrap').forEach(function (w) {
    w.addEventListener('click', function (e) { if (e.target === w) closePanel(w.id); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!$('#zoomWrap').hidden) { closeZoom(); return; }
    var top = panels[panels.length - 1];
    if (top) closePanel(top);
  });

  function goTab(tab, push) {
    if (tab !== 'mine' && tab !== 'wallet') return;
    if (tab === curTab) return;
    var prev = curTab;
    curTab = tab;
    $('#viewMine').hidden = tab !== 'mine';
    $('#viewWallet').hidden = tab !== 'wallet';
    $$('.tab').forEach(function (b) {
      var on = b.getAttribute('data-tab') === tab;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (push) navPushLayer('tab:' + tab, function () { goTab(prev, false); });
    window.scrollTo(0, 0);
    if (tab === 'wallet') renderWallet();
  }
  var curTab = 'mine';

  /* ── 내 명함 목록 ─────────────────────────── */
  function renderMine() {
    var c = currentCard();
    $('#mineCount').textContent = String(S.mine.length);
    $('#mineEmpty').hidden = S.mine.length > 0;
    $('#heroPill').innerHTML = c
      ? '🪪 ' + esc(purposeLabel(c.purpose)) + ' · ' + esc(t('mine.hero'))
      : '🪪 ' + esc(t('mine.hero'));
    ['#saveImgBtn', '#sendBtn', '#qrBtn'].forEach(function (sel) {
      $(sel).setAttribute('aria-disabled', c ? 'false' : 'true');
    });
    var list = $('#mineList');
    var html = '';
    S.mine.forEach(function (m) {
      var th = themeOf(m.theme);
      html += '<div class="mrow' + (m.id === S.sel ? ' sel' : '') + '">' +
        '<button class="mbtn" type="button" data-pick="' + esc(m.id) + '" aria-label="' + esc(m.name + ' ' + t('mine.tapPick')) + '">' +
          '<span class="mswatch" ' + themeSwatch(th) + '><i></i><b></b></span>' +
          '<span class="mtxt"><b>' + esc(m.name || t('mine.noName')) + '</b>' +
          '<span>' + esc([m.org, m.title].filter(Boolean).join(' · ') || purposeLabel(m.purpose)) + '</span></span>' +
        '</button>' +
        (m.id === S.sel ? '<span class="mbadge">' + esc(t('mine.selected')) + '</span>' : '') +
      '</div>';
    });
    list.innerHTML = html;
    heroDraw();
  }

  /* ── 내 명함 편집 ─────────────────────────── */
  var editId = null, draft = {}, editRAF = 0;
  var MY_FIELDS = { fName: 'name', fTitle: 'title', fOrg: 'org', fPhone: 'phone', fEmail: 'email', fWeb: 'web', fAddr: 'addr', fMemo: 'memo' };

  function renderThemes() {
    var row = $('#themeRow');
    row.innerHTML = THEMES.map(function (th) {
      return '<button class="thm' + (draft.theme === th.id ? ' on' : '') + '" type="button" data-theme="' + th.id + '">' +
        '<span class="sw" ' + themeSwatch(th) + '><i></i><b></b></span>' +
        '<span>' + esc(themeName(th)) + '</span></button>';
    }).join('');
  }
  function renderPurpose() {
    var box = $('#fPurpose');
    var list = [['work', '💼'], ['club', '🤝'], ['side', '🌱'], ['personal', '🙂'], ['etc', '✳️']];
    box.innerHTML = list.map(function (p) {
      return '<button class="pick' + (draft.purpose === p[0] ? ' on' : '') + '" type="button" data-purpose="' + p[0] + '">' +
        p[1] + ' ' + esc(t('p.' + p[0])) + '</button>';
    }).join('');
  }
  function editDraw() {
    if ($('#sheetEdit').hidden) return;
    var cv = $('#editCanvas');
    drawCard(cv.getContext('2d'), cv.width, cv.height, draft, themeOf(draft.theme));
  }
  function scheduleEditDraw() {
    if (editRAF) return;
    editRAF = requestAnimationFrame(function () { editRAF = 0; editDraw(); });
  }
  function readMyForm() {
    Object.keys(MY_FIELDS).forEach(function (id) {
      var el = $('#' + id);
      if (el) draft[MY_FIELDS[id]] = el.value;
    });
  }
  function setPhotoPrev() {
    var im = $('#myPhotoPrev');
    if (draft.photo) { im.src = draft.photo; im.classList.add('on'); }
    else { im.removeAttribute('src'); im.classList.remove('on'); }
  }
  function openMineEditor(cardId, prefill) {
    editId = cardId || null;
    var base = cardId ? S.mine.filter(function (x) { return x.id === cardId; })[0] : null;
    if (!base) {
      base = prefill ? Object.assign({}, prefill) : {
        purpose: 'work', name: '', title: '', org: '', phone: '', email: '', web: '', addr: '', memo: '',
        photo: '', theme: S.mine.length ? S.mine[0].theme : 'white'
      };
    }
    draft = Object.assign({}, base);
    if (!draft.theme) draft.theme = 'white';
    Object.keys(MY_FIELDS).forEach(function (id) { $('#' + id).value = draft[MY_FIELDS[id]] || ''; });
    setPhotoPrev();
    renderThemes();
    renderPurpose();
    $('#editTitle').textContent = t(editId ? 'edit.edit' : 'edit.new');
    $('#editDel').hidden = !editId;
    openPanel('sheetEdit');
    setTimeout(editDraw, 30);
  }
  function saveMineCard() {
    readMyForm();
    var name = String(draft.name || '').trim();
    if (!name) { toast(t('edit.needName')); $('#fName').focus(); return; }
    var c = {
      id: editId || uid(),
      purpose: draft.purpose || 'etc',
      name: name,
      title: String(draft.title || '').trim(),
      org: String(draft.org || '').trim(),
      phone: String(draft.phone || '').trim(),
      email: String(draft.email || '').trim(),
      web: String(draft.web || '').trim(),
      addr: String(draft.addr || '').trim(),
      memo: String(draft.memo || '').trim(),
      photo: draft.photo || '',
      theme: draft.theme || 'white',
      updated: Date.now()
    };
    if (editId) {
      for (var i = 0; i < S.mine.length; i++) if (S.mine[i].id === editId) { S.mine[i] = c; break; }
    } else {
      S.mine.unshift(c);
      S.sel = c.id;
    }
    if (!saveMine()) return;
    saveUI();
    closePanel('sheetEdit');
    renderMine();
    toast(t('edit.saved'));
  }
  function deleteMineCard() {
    var id = editId;
    var idx = -1, card = null;
    for (var i = 0; i < S.mine.length; i++) if (S.mine[i].id === id) { idx = i; card = S.mine[i]; break; }
    if (!card) return;
    S.mine.splice(idx, 1);
    if (S.sel === id) S.sel = S.mine[0] ? S.mine[0].id : null;
    if (!saveMine()) { S.mine.splice(idx, 0, card); return; }
    saveUI();
    closePanel('sheetEdit');
    renderMine();
    toast(t('edit.deleted'), t('edit.undo'), function () {
      S.mine.splice(Math.min(idx, S.mine.length), 0, card);
      if (!S.sel) S.sel = card.id;
      saveMine(); saveUI(); renderMine();
    }, 5200);
  }

  /* ── 받은 명함 ─────────────────────────────── */
  var TAGS = [
    { id: 'all', key: 'tag.all' }, { id: 'biz', key: 'tag.biz' }, { id: 'care', key: 'tag.care' },
    { id: 'club', key: 'tag.club' }, { id: 'friend', key: 'tag.friend' }, { id: 'etc', key: 'tag.etc' }
  ];
  function tagKey(id) { for (var i = 0; i < TAGS.length; i++) if (TAGS[i].id === id) return TAGS[i].key; return 'tag.etc'; }
  function norm(s) { return String(s || '').toLowerCase().replace(/\s+/g, ''); }
  function walletFiltered() {
    var q = norm(S.q), qd = digits(S.q);
    return S.wallet.filter(function (w) {
      if (S.tag !== 'all' && (w.tag || 'etc') !== S.tag) return false;
      if (!q) return true;
      var hay = norm([w.name, w.org, w.title, w.memo, w.email].join(' '));
      if (hay.indexOf(q) >= 0) return true;
      if (qd && digits(w.phone).indexOf(qd) >= 0) return true;
      return false;
    }).sort(function (a, b) { return (b.savedAt || 0) - (a.savedAt || 0); });
  }
  function renderTags() {
    var box = $('#tagChips');
    var counts = { all: S.wallet.length };
    S.wallet.forEach(function (w) { var k = w.tag || 'etc'; counts[k] = (counts[k] || 0) + 1; });
    box.innerHTML = TAGS.map(function (tg) {
      var n = counts[tg.id] || 0;
      if (tg.id !== 'all' && !n) return '';
      return '<button class="chip' + (S.tag === tg.id ? ' on' : '') + '" type="button" data-tag="' + tg.id + '" aria-pressed="' + (S.tag === tg.id) + '">' +
        esc(t(tg.key)) + '<small>' + n + '</small></button>';
    }).join('');
  }
  function renderWallet() {
    renderTags();
    $('#tabWalletN').textContent = String(S.wallet.length);
    var list = walletFiltered();
    var box = $('#walletList');
    var searching = !!(S.q || S.tag !== 'all');
    if (!S.wallet.length) {
      box.innerHTML = '';
      $('#walletEmpty').hidden = false;
      $('#walletEmpty').querySelector('h3').textContent = t('wallet.none');
      return;
    }
    $('#walletEmpty').hidden = !!list.length;
    if (!list.length) {
      box.innerHTML = '<div class="wempty"><span class="eico">🔍</span>' + esc(t('wallet.noMatch')) + '</div>';
      return;
    }
    box.innerHTML = list.map(function (w) {
      var initial = String(w.name || '?').trim().charAt(0) || '?';
      var thumb = w.photo ? '<img src="' + esc(w.photo) + '" alt="" loading="lazy" />' : initial;
      var tg = '<span class="tg ' + esc(w.tag || 'etc') + '">' + esc(t(tagKey(w.tag))) + '</span>';
      var phone = telOf(w.phone);
      return '<article class="wcard" data-id="' + esc(w.id) + '">' +
        '<button class="wmain" type="button" data-open="' + esc(w.id) + '" aria-label="' + esc(w.name + ' — ' + t('detail.title')) + '">' +
          '<span class="wthumb">' + thumb + '</span>' +
          '<span class="wtxt"><b>' + esc(w.name || '?') + '</b>' +
            '<span>' + esc([w.org, w.title].filter(Boolean).join(' · ') || pretty(w.phone) || '—') + '</span>' +
            '<span class="wtags">' + tg + (w.memo ? '<span class="tg etc" style="opacity:.85">' + esc(clampText(w.memo, 14)) + '</span>' : '') + '</span>' +
          '</span>' +
        '</button>' +
        '<div class="wquick">' +
          '<a class="q tel' + (phone ? '' : ' off') + '" href="' + (phone ? 'tel:' + phone : '#') + '" aria-label="' + esc(t('detail.phone')) + '">📞</a>' +
          '<a class="q sms' + (phone ? '' : ' off') + '" href="' + (phone ? 'sms:' + phone : '#') + '" aria-label="' + esc(t('detail.sms')) + '">💬</a>' +
          '<a class="q mail' + (w.email ? '' : ' off') + '" href="' + (w.email ? 'mailto:' + encodeURIComponent(w.email) : '#') + '" aria-label="' + esc(t('detail.email')) + '">✉️</a>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* ── 받은 명함 편집 ───────────────────────── */
  var recvId = null, recvPhoto = '', recvTag = 'biz';
  function renderRecvTags() {
    $('#rTags').innerHTML = TAGS.filter(function (x) { return x.id !== 'all'; }).map(function (tg) {
      return '<button class="pick' + (recvTag === tg.id ? ' on' : '') + '" type="button" data-rtag="' + tg.id + '">' +
        esc(t(tg.key)) + '</button>';
    }).join('');
  }
  function setRecvPhotoPrev() {
    var im = $('#rPhotoPrev');
    if (recvPhoto) { im.src = recvPhoto; im.classList.add('on'); }
    else { im.removeAttribute('src'); im.classList.remove('on'); }
  }
  function openRecvEditor(id) {
    recvId = id || null;
    var w = id ? S.wallet.filter(function (x) { return x.id === id; })[0] : null;
    $('#rName').value = w ? w.name || '' : '';
    $('#rOrg').value = w ? w.org || '' : '';
    $('#rTitle').value = w ? w.title || '' : '';
    $('#rPhone').value = w ? w.phone || '' : '';
    $('#rEmail').value = w ? w.email || '' : '';
    $('#rMemo').value = w ? w.memo || '' : '';
    recvPhoto = w ? (w.photo || '') : '';
    recvTag = w ? (w.tag || 'etc') : (S.tag !== 'all' ? S.tag : 'biz');
    setRecvPhotoPrev();
    renderRecvTags();
    $('#recvTitle').textContent = t(recvId ? 'recv.edit' : 'recv.new');
    $('#recvDel').hidden = !recvId;
    openPanel('sheetRecv');
  }
  function saveRecvCard() {
    var name = $('#rName').value.trim();
    if (!name) { toast(t('recv.needName')); $('#rName').focus(); return; }
    var w = {
      id: recvId || uid(),
      name: name,
      org: $('#rOrg').value.trim(),
      title: $('#rTitle').value.trim(),
      phone: $('#rPhone').value.trim(),
      email: $('#rEmail').value.trim(),
      memo: $('#rMemo').value.trim(),
      tag: recvTag || 'etc',
      photo: recvPhoto || '',
      savedAt: Date.now()
    };
    if (recvId) {
      var old = S.wallet.filter(function (x) { return x.id === recvId; })[0];
      w.savedAt = old ? (old.savedAt || Date.now()) : Date.now();
      for (var i = 0; i < S.wallet.length; i++) if (S.wallet[i].id === recvId) { S.wallet[i] = w; break; }
    } else {
      S.wallet.unshift(w);
    }
    if (!saveWallet()) return;
    closePanel('sheetRecv');
    renderWallet();
    if (!$('#sheetDetail').hidden && detailId === w.id) renderDetail(w);
    toast(t('recv.saved'));
  }
  function deleteRecvCard(id) {
    var idx = -1, item = null;
    for (var i = 0; i < S.wallet.length; i++) if (S.wallet[i].id === id) { idx = i; item = S.wallet[i]; break; }
    if (!item) return;
    S.wallet.splice(idx, 1);
    if (!saveWallet()) { S.wallet.splice(idx, 0, item); return; }
    if (!$('#sheetDetail').hidden && detailId === id) closePanel('sheetDetail');
    if (!$('#sheetRecv').hidden && recvId === id) closePanel('sheetRecv');
    renderWallet();
    toast(t('recv.deleted'), t('edit.undo'), function () {
      S.wallet.splice(Math.min(idx, S.wallet.length), 0, item);
      saveWallet(); renderWallet();
    }, 5200);
  }

  /* ── 받은 명함 상세 ───────────────────────── */
  var detailId = null;
  function renderDetail(w) {
    if (!w) return;
    detailId = w.id;
    var phone = telOf(w.phone), mail = w.email ? encodeURIComponent(w.email) : '';
    var hero = w.photo
      ? '<div class="detailHero"><img src="' + esc(w.photo) + '" alt="' + esc(w.name) + ' 명함 사진" /><button class="zoom" type="button" data-zoom="1">' + esc(t('detail.zoom')) + '</button></div>'
      : '<div class="detailHero"><div class="ph">' + esc(String(w.name || '?').charAt(0)) + '</div></div>';
    var rows = '';
    if (w.phone) rows += '<div class="irow"><span class="k">☎ ' + esc(t('detail.phone')) + '</span><span class="v">' + esc(pretty(w.phone)) + '</span><button class="cp" type="button" data-copy="' + esc(pretty(w.phone)) + '">' + esc(t('detail.copy')) + '</button></div>';
    if (w.email) rows += '<div class="irow"><span class="k">✉ ' + esc(t('detail.email')) + '</span><span class="v">' + esc(w.email) + '</span><button class="cp" type="button" data-copy="' + esc(w.email) + '">' + esc(t('detail.copy')) + '</button></div>';
    if (w.memo) rows += '<div class="irow"><span class="k">📝 ' + esc(t('detail.memo')) + '</span><span class="v">' + esc(w.memo) + '</span></div>';
    rows += '<div class="irow"><span class="k">🏷 ' + esc(t('detail.tag')) + '</span><span class="v"><span class="tg ' + esc(w.tag || 'etc') + '">' + esc(t(tagKey(w.tag))) + '</span></span></div>';
    if (w.savedAt) {
      var d = new Date(w.savedAt);
      var ds = d.getFullYear() + '.' + pad2(d.getMonth() + 1) + '.' + pad2(d.getDate());
      rows += '<div class="irow"><span class="k">📅 ' + esc(t('detail.saved')) + '</span><span class="v">' + ds + '</span></div>';
    }
    $('#detailBody').innerHTML =
      hero +
      '<div class="dname"><h3 id="detailName">' + esc(w.name || '?') + '</h3><span class="tg ' + esc(w.tag || 'etc') + '">' + esc(t(tagKey(w.tag))) + '</span></div>' +
      '<div class="dsub">' + esc([w.org, w.title].filter(Boolean).join(' · ') || '—') + '</div>' +
      '<div class="dacts">' +
        '<a class="dact tel" ' + (phone ? 'href="tel:' + phone + '"' : 'aria-disabled="true"') + '><span class="ico">📞</span>' + esc(t('detail.phone')) + '</a>' +
        '<a class="dact sms" ' + (phone ? 'href="sms:' + phone + '"' : 'aria-disabled="true"') + '><span class="ico">💬</span>' + esc(t('detail.sms')) + '</a>' +
        '<a class="dact mail" ' + (w.email ? 'href="mailto:' + mail + '"' : 'aria-disabled="true"') + '><span class="ico">✉️</span>' + esc(t('detail.email')) + '</a>' +
      '</div>' + rows;
  }
  function openDetail(id) {
    var w = S.wallet.filter(function (x) { return x.id === id; })[0];
    if (!w) return;
    renderDetail(w);
    openPanel('sheetDetail');
  }

  /* ── 사진 크게 보기 ───────────────────────── */
  function openZoom(src) {
    if (!src) return;
    $('#zoomImg').src = src;
    $('#zoomWrap').hidden = false;
    lockScroll(true);
    document.body.classList.add('sheet-open');
    navPushLayer('zoom', function () { closeZoom(true); });
  }
  function closeZoom(fromBack) {
    if ($('#zoomWrap').hidden) return;
    $('#zoomWrap').hidden = true;
    $('#zoomImg').removeAttribute('src');
    if (!panels.length) { lockScroll(false); document.body.classList.remove('sheet-open'); }
    if (!fromBack) navConsume('zoom');
  }

  /* ── 백업 ─────────────────────────────────── */
  function backupJSON() {
    return JSON.stringify({ app: 'wagle-namecard', version: 1, exportedAt: new Date().toISOString(), mine: S.mine, wallet: S.wallet });
  }
  function doBackup() {
    if (!S.mine.length && !S.wallet.length) { toast(t('backup.empty')); return; }
    var d = new Date();
    var day = d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
    var blob = new Blob([backupJSON()], { type: 'application/json' });
    download(blob, '명함집_백업_' + day + '.json');
    toast(t('backup.saved'));
  }
  function doRestore(file) {
    if (!file) return;
    var fr = new FileReader();
    fr.onerror = function () { toast(t('backup.bad')); };
    fr.onload = function () {
      var j = null;
      try { j = JSON.parse(fr.result); } catch (e) { j = null; }
      if (!j || (j.app !== 'wagle-namecard' && !Array.isArray(j.mine) && !Array.isArray(j.wallet))) {
        toast(t('backup.bad'), null, null, 4400); return;
      }
      var added = 0;
      var mineIds = {}; S.mine.forEach(function (x) { mineIds[x.id] = 1; });
      (Array.isArray(j.mine) ? j.mine : []).forEach(function (x) {
        if (!x || !x.id) return;
        var hit = S.mine.filter(function (y) { return y.id === x.id; })[0];
        if (hit) { Object.assign(hit, x); } else { S.mine.push(x); added++; }
      });
      var wIds = {}; S.wallet.forEach(function (x) { wIds[x.id] = 1; });
      (Array.isArray(j.wallet) ? j.wallet : []).forEach(function (x) {
        if (!x || !x.id) return;
        var hit = S.wallet.filter(function (y) { return y.id === x.id; })[0];
        if (hit) { Object.assign(hit, x); } else { S.wallet.push(x); added++; }
      });
      saveMine(); saveWallet();
      if (!S.sel && S.mine[0]) S.sel = S.mine[0].id;
      saveUI();
      renderMine(); renderWallet();
      closePanel('sheetBackup');
      toast(added ? t('backup.merged', { n: added }) : t('backup.nothing'), null, null, 4400);
    };
    fr.readAsText(file);
  }

  /* ── 오늘 날짜 · 날씨 ─────────────────────── */
  var KO_DOW = ['일', '월', '화', '수', '목', '금', '토'];
  var EN_DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var EN_MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var WMO = {
    0: ['☀️', '맑음', 'Clear'], 1: ['🌤️', '대체로 맑음', 'Mostly clear'], 2: ['⛅', '조금 흐림', 'Partly cloudy'], 3: ['☁️', '흐림', 'Cloudy'],
    45: ['🌫️', '안개', 'Fog'], 48: ['🌫️', '안개', 'Fog'],
    51: ['🌦️', '이슬비', 'Drizzle'], 53: ['🌦️', '이슬비', 'Drizzle'], 55: ['🌦️', '이슬비', 'Drizzle'],
    56: ['🌧️', '어는 비', 'Freezing rain'], 57: ['🌧️', '어는 비', 'Freezing rain'],
    61: ['🌧️', '비', 'Rain'], 63: ['🌧️', '비', 'Rain'], 65: ['🌧️', '비', 'Rain'],
    66: ['🌧️', '어는 비', 'Freezing rain'], 67: ['🌧️', '어는 비', 'Freezing rain'],
    71: ['🌨️', '눈', 'Snow'], 73: ['🌨️', '눈', 'Snow'], 75: ['🌨️', '눈', 'Snow'], 77: ['🌨️', '눈', 'Snow'],
    80: ['🌦️', '소나기', 'Showers'], 81: ['🌦️', '소나기', 'Showers'], 82: ['🌧️', '소나기', 'Showers'],
    85: ['🌨️', '눈 소나기', 'Snow showers'], 86: ['🌨️', '눈 소나기', 'Snow showers'],
    95: ['⛈️', '천둥번개', 'Thunderstorm'], 96: ['⛈️', '천둥번개', 'Thunderstorm'], 99: ['⛈️', '천둥번개', 'Thunderstorm']
  };
  var WX_DEFAULT = { lat: 35.23, lon: 128.89, place: '김해' };
  var wxNow = null, wxAt = 0, wxBusy = false, wxSeq = 0, wxRank = 0, wxPlace = WX_DEFAULT.place;
  var WX_TTL = 20 * 60 * 1000;

  function renderToday() {
    var d = new Date();
    if (LANG === 'ko') $('#todayDate').textContent = (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (' + KO_DOW[d.getDay()] + ')';
    else $('#todayDate').textContent = EN_MON[d.getMonth()] + ' ' + d.getDate() + ' (' + EN_DOW[d.getDay()] + ')';
    var txt, loading = false;
    if (wxNow) txt = wxNow.emoji + ' ' + wxNow.text + ' ' + wxNow.t + '°';
    else { txt = t('today.loading'); loading = true; }
    var el = $('#todayWx');
    el.textContent = txt;
    el.classList.toggle('loading', loading);
    $('#wxPlace').textContent = wxPlace;
  }
  function wxText(m) { return LANG === 'ko' ? m[1] : m[2]; }
  function loadWxCache() {
    try {
      var raw = localStorage.getItem(K_WX);
      if (!raw) return;
      var j = JSON.parse(raw);
      if (!j || typeof j.t !== 'number') return;
      if (Date.now() - j.at > 12 * 60 * 60 * 1000) return;
      var m = WMO[j.code] || ['🌡️', '날씨', 'Weather'];
      wxNow = { emoji: m[0], text: wxText(m), t: Math.round(j.t), code: j.code };
      wxAt = j.at;
      wxPlace = j.place || WX_DEFAULT.place;
    } catch (e) {}
  }
  function saveWxCache(code, t) {
    try { localStorage.setItem(K_WX, JSON.stringify({ code: code, t: t, at: Date.now(), place: wxPlace })); } catch (e) {}
  }
  function fetchWx(lat, lon, rank) {
    if (!window.fetch || navigator.onLine === false) return Promise.resolve(false);
    rank = rank || 1;
    var seq = wxSeq;
    var ctl = window.AbortController ? new AbortController() : null;
    var to = null;
    if (ctl) to = setTimeout(function () { try { ctl.abort(); } catch (e) {} }, 8000);
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=temperature_2m,weather_code&timezone=auto';
    return fetch(url, ctl ? { cache: 'no-store', signal: ctl.signal } : { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (to) clearTimeout(to);
        var c = j && j.current;
        if (!c || typeof c.temperature_2m !== 'number') return false;
        if (seq !== wxSeq || rank < wxRank) return false;
        wxRank = rank;
        var m = WMO[c.weather_code] || ['🌡️', '날씨', 'Weather'];
        wxNow = { emoji: m[0], text: wxText(m), t: Math.round(c.temperature_2m), code: c.weather_code };
        wxAt = Date.now();
        saveWxCache(c.weather_code, c.temperature_2m);
        renderToday();
        return true;
      })
      .catch(function () { if (to) clearTimeout(to); return false; });
  }
  function geoCoords() {
    return new Promise(function (resolve) {
      if (!navigator.geolocation) return resolve(null);
      try {
        navigator.geolocation.getCurrentPosition(function (pos) {
          var c = pos && pos.coords;
          if (!c) return resolve(null);
          resolve({ lat: Math.round(c.latitude * 100) / 100, lon: Math.round(c.longitude * 100) / 100 });
        }, function () { resolve(null); }, { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 });
      } catch (e) { resolve(null); }
    });
  }
  function loadWeather(force) {
    renderToday();
    if (wxBusy) return;
    if (!force && wxAt && Date.now() - wxAt < WX_TTL) return;
    wxBusy = true; wxSeq++;
    fetchWx(WX_DEFAULT.lat, WX_DEFAULT.lon, 1).then(function () { wxBusy = false; });
  }
  function hereWeather() {
    toast('📍 ' + (LANG === 'ko' ? '현위치 날씨를 확인하는 중…' : 'Checking weather here…'), null, null, 2000);
    geoCoords().then(function (p) {
      if (!p) { loadWeather(true); return; }
      wxPlace = LANG === 'ko' ? '현위치' : 'Here';
      wxRank = 0; wxSeq++;
      fetchWx(p.lat, p.lon, 2).then(function (ok) { if (!ok) loadWeather(true); });
      renderToday();
    });
  }

  /* ── 설치 · 공유 ──────────────────────────── */
  var instPrompt = null, instDone = false;
  function uaInfo() {
    var ua = navigator.userAgent || '';
    return {
      inApp: /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|Line\/|DaumApps/i.test(ua),
      ios: /iPhone|iPad|iPod/i.test(ua),
      android: /Android/i.test(ua)
    };
  }
  function syncInstall() {
    $('#installBtn').style.opacity = instDone ? '.6' : '';
  }
  function installTap() {
    if (instPrompt) {
      instPrompt.prompt();
      instPrompt.userChoice.then(function () { instPrompt = null; }).catch(function () {});
      return;
    }
    var u = uaInfo();
    var body = $('#instBody');
    var html = '';
    if (u.inApp) {
      html += '<p>' + t('inst.kakao') + '</p>' +
        '<a class="chrome" href="intent://starpicklife-design.github.io/namecard/#Intent;scheme=https;package=com.android.chrome;end">' + t('inst.chrome') + '</a>';
    } else if (u.ios) {
      html += '<ol><li>' + (LANG === 'ko' ? '사파리 아래쪽 <b>공유</b> 버튼을 눌러요.' : 'Tap <b>Share</b> at the bottom of Safari.') + '</li>' +
        '<li>' + (LANG === 'ko' ? '<b>홈 화면에 추가</b>를 눌러요.' : 'Tap <b>Add to Home Screen</b>.') + '</li>' +
        '<li>' + (LANG === 'ko' ? '오른쪽 위 <b>추가</b>를 눌러요.' : 'Tap <b>Add</b> at the top right.') + '</li></ol>';
    } else {
      html += '<p>' + t('inst.android') + '</p>';
    }
    html += '<p style="margin-top:.7rem;font-size:.74rem;opacity:.8">' + (LANG === 'ko'
      ? '설치하면 인터넷이 없어도 내 명함과 받은 명함을 볼 수 있어요.'
      : 'Once installed, your cards open even without internet.') + '</p>';
    body.innerHTML = html;
    $('#instGo').hidden = u.inApp || u.ios;
    openPanel('sheetInstall');
  }
  function shareApp() {
    var p = {
      title: LANG === 'ko' ? '와글링 명함집 · 내 명함 만들기' : 'Wagling Namecards',
      text: LANG === 'ko'
        ? '내 명함을 여러 장 만들고, 받은 명함을 사진으로 담아 두는 무료 앱이에요. 명함은 이 폰에만 저장돼요.'
        : 'Make your own cards and keep the ones you receive. Free, and everything stays on your phone.',
      url: 'https://starpicklife-design.github.io/namecard/'
    };
    var usable = true;
    try { if (navigator.canShare && !navigator.canShare(p)) usable = false; } catch (e) {}
    if (navigator.share && usable) {
      try {
        navigator.share(p).catch(function (err) {
          if (err && err.name === 'AbortError') return;
          copyText(p.text + '\n\n' + p.url, t('toast.appShared'));
        });
        return;
      } catch (e) {}
    }
    copyText(p.text + '\n\n' + p.url, t('toast.appShared'));
  }

  /* ── 이벤트 연결 ──────────────────────────── */
  var SAMPLE = {
    purpose: 'work', name: '김하늘', title: '대표 · 도자기 공방', org: '푸른공방',
    phone: '010-0000-0000', email: 'hello@example.com', web: 'blog.example.com',
    addr: '경남 김해시', memo: '흙과 손으로 만드는 그릇', photo: '', theme: 'hanji'
  };

  function renderBkBody() {
    $('#bkBody').innerHTML =
      '<p style="font-size:.84rem;font-weight:700;line-height:1.55">' + t('backup.desc') + '</p>' +
      '<p style="margin-top:.5rem;font-size:.86rem;font-weight:900;color:#24405C">' +
      t('backup.count', { a: S.mine.length, b: S.wallet.length }) + '</p>' +
      '<p style="margin-top:.6rem;font-size:.74rem;font-weight:700;opacity:.78;line-height:1.5">' +
      (LANG === 'ko'
        ? '불러오기는 지금 명함을 지우지 않고 더해요. 같은 명함은 백업 파일 내용으로 맞춰져요.'
        : 'Loading adds to what you have. Nothing is deleted; matching cards take the backup version.') + '</p>';
  }

  function bind() {
    $('#langBtn').addEventListener('click', function () {
      LANG = LANG === 'ko' ? 'en' : 'ko';
      saveUI();
      applyI18n();
      renderMine(); renderWallet(); renderToday();
      if (!$('#sheetEdit').hidden) { renderThemes(); renderPurpose(); $('#editTitle').textContent = t(editId ? 'edit.edit' : 'edit.new'); }
      if (!$('#sheetRecv').hidden) { renderRecvTags(); $('#recvTitle').textContent = t(recvId ? 'recv.edit' : 'recv.new'); }
      if (!$('#sheetBackup').hidden) renderBkBody();
    });
    $('#installBtn').addEventListener('click', installTap);
    $('#shareBtn').addEventListener('click', shareApp);
    $('#todayCard').addEventListener('click', hereWeather);

    $$('.tab').forEach(function (b) {
      b.addEventListener('click', function () {
        var tab = b.getAttribute('data-tab');
        if (tab === curTab) { window.scrollTo(0, 0); return; }
        goTab(tab, true);
      });
    });

    $('#saveImgBtn').addEventListener('click', function () { if (!currentCard()) { toast(t('toast.needCard')); return; } exportCardImage(); });
    $('#sendBtn').addEventListener('click', function () { if (!currentCard()) { toast(t('toast.needCard')); return; } sendCardImage(); });
    $('#qrBtn').addEventListener('click', openQR);
    $('#heroEdit').addEventListener('click', function () {
      var c = currentCard();
      openMineEditor(c ? c.id : null);
    });
    $('#addMineBtn').addEventListener('click', function () { openMineEditor(null); });
    $('#sampleBtn').addEventListener('click', function () { openMineEditor(null, SAMPLE); });
    $('#mineList').addEventListener('click', function (e) {
      var b = e.target.closest('[data-pick]');
      if (!b) return;
      S.sel = b.getAttribute('data-pick');
      saveUI();
      renderMine();
      try { $('#heroCanvas').scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (err) { window.scrollTo(0, 0); }
    });

    Object.keys(MY_FIELDS).forEach(function (id) {
      var el = $('#' + id);
      if (!el) return;
      el.addEventListener('input', function () { readMyForm(); scheduleEditDraw(); });
      el.addEventListener('change', function () { readMyForm(); scheduleEditDraw(); });
    });
    $('#themeRow').addEventListener('click', function (e) {
      var b = e.target.closest('[data-theme]');
      if (!b) return;
      draft.theme = b.getAttribute('data-theme');
      renderThemes();
      scheduleEditDraw();
    });
    $('#fPurpose').addEventListener('click', function (e) {
      var b = e.target.closest('[data-purpose]');
      if (!b) return;
      draft.purpose = b.getAttribute('data-purpose');
      renderPurpose();
      scheduleEditDraw();
    });
    $('#myPhotoPick').addEventListener('click', function () { $('#myPhotoInput').click(); });
    $('#myPhotoInput').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!f) return;
      shrinkPhoto(f, 640, 0.82).then(function (url) {
        draft.photo = url;
        setPhotoPrev();
        scheduleEditDraw();
      }).catch(function () { toast(t('toast.photoFail')); });
    });
    $('#myPhotoDel').addEventListener('click', function () {
      draft.photo = '';
      setPhotoPrev();
      scheduleEditDraw();
    });
    $('#editSave').addEventListener('click', saveMineCard);
    $('#editDel').addEventListener('click', deleteMineCard);

    document.addEventListener('click', function (e) {
      var c = e.target.closest('[data-close]');
      if (c) closePanel(c.getAttribute('data-close'));
    });

    /* 받은 명함 */
    $('#addRecvBtn').addEventListener('click', function () { openRecvEditor(null); });
    var qel = $('#q');
    qel.addEventListener('input', function () {
      S.q = qel.value || '';
      $('#qClear').hidden = !S.q;
      renderWallet();
    });
    $('#qClear').addEventListener('click', function () {
      qel.value = ''; S.q = ''; $('#qClear').hidden = true; renderWallet(); qel.focus();
    });
    $('#tagChips').addEventListener('click', function (e) {
      var b = e.target.closest('[data-tag]');
      if (!b) return;
      S.tag = b.getAttribute('data-tag');
      saveUI(); renderWallet();
    });
    $('#walletList').addEventListener('click', function (e) {
      var b = e.target.closest('[data-open]');
      if (b) openDetail(b.getAttribute('data-open'));
    });
    $('#rTags').addEventListener('click', function (e) {
      var b = e.target.closest('[data-rtag]');
      if (!b) return;
      recvTag = b.getAttribute('data-rtag');
      renderRecvTags();
    });
    $('#rPhotoCam').addEventListener('click', function () { $('#rPhotoCamInput').click(); });
    $('#rPhotoPick').addEventListener('click', function () { $('#rPhotoInput').click(); });
    ['#rPhotoCamInput', '#rPhotoInput'].forEach(function (sel) {
      $(sel).addEventListener('change', function (e) {
        var f = e.target.files && e.target.files[0];
        e.target.value = '';
        if (!f) return;
        shrinkPhoto(f, 900, 0.78).then(function (url) {
          recvPhoto = url;
          setRecvPhotoPrev();
        }).catch(function () { toast(t('toast.photoFail')); });
      });
    });
    $('#rPhotoDel').addEventListener('click', function () { recvPhoto = ''; setRecvPhotoPrev(); });
    $('#recvSave').addEventListener('click', saveRecvCard);
    $('#recvDel').addEventListener('click', function () { if (recvId) deleteRecvCard(recvId); });

    /* 상세 */
    $('#detailBody').addEventListener('click', function (e) {
      var cp = e.target.closest('[data-copy]');
      if (cp) { copyText(cp.getAttribute('data-copy')); return; }
      var zm = e.target.closest('[data-zoom]');
      if (zm) {
        var w = S.wallet.filter(function (x) { return x.id === detailId; })[0];
        if (w && w.photo) openZoom(w.photo);
      }
    });
    $('#detailEdit').addEventListener('click', function () { if (detailId) openRecvEditor(detailId); });
    $('#detailDel').addEventListener('click', function () { if (detailId) deleteRecvCard(detailId); });
    $('#detailVcf').addEventListener('click', function () {
      var w = S.wallet.filter(function (x) { return x.id === detailId; })[0];
      if (!w) return;
      var blob = new Blob([vcardOf(w)], { type: 'text/vcard;charset=utf-8' });
      download(blob, safeName(w.name) + '.vcf');
      toast(t('detail.vcfSaved'), null, null, 4200);
    });

    /* QR */
    $('#qrSave').addEventListener('click', saveQRImage);
    window.addEventListener('resize', function () {
      if (!$('#sheetQR').hidden) { fitQRCanvas(); paintQR(); }
    });
    $('#qrCopy').addEventListener('click', function () { if (qrText) copyText(qrText, t('qr.copied')); });

    /* 백업 */
    $('#backupSave').addEventListener('click', doBackup);
    $('#backupLoad').addEventListener('click', function () { renderBkBody(); openPanel('sheetBackup'); });
    $('#bkSave2').addEventListener('click', doBackup);
    $('#bkLoad2').addEventListener('click', function () { $('#backupFile').click(); });
    $('#backupFile').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      e.target.value = '';
      doRestore(f);
    });

    /* 사진 크게 */
    $('#zoomClose').addEventListener('click', function () { closeZoom(false); });
    $('#zoomWrap').addEventListener('click', function (e) {
      if (e.target === $('#zoomWrap')) closeZoom(false);
    });

    /* 토스트 되돌리기 */
    $('#toastAct').addEventListener('click', function () {
      var fn = toastAct;
      toastAct = null;
      $('#toast').classList.remove('on');
      if (typeof fn === 'function') fn();
    });

    window.addEventListener('appinstalled', function () {
      instDone = true; instPrompt = null; syncInstall(); toast(t('toast.installed'));
    });
    window.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault(); instPrompt = e;
    });
    window.addEventListener('online', function () { loadWeather(true); });
  }

  /* ── 시작 ─────────────────────────────────── */
  function boot() {
    load();
    applyI18n();
    if (window.qrcode) {
      qrcode.stringToBytes = function (s) { return Array.prototype.slice.call(new TextEncoder().encode(s)); };
    }
    if (!S.mine.some(function (x) { return x.id === S.sel; })) S.sel = S.mine[0] ? S.mine[0].id : null;
    renderMine();
    renderTags();
    renderWallet();
    bind();
    loadWxCache();
    renderToday();
    loadWeather(false);
    syncInstall();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { redrawAll(); });
    }
    setInterval(renderToday, 60 * 1000);
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('./sw.js').catch(function () {});
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* 검수용 (화면에는 영향 없음) */
  window.__wn = {
    state: function () { return { mine: S.mine, wallet: S.wallet, sel: S.sel, tag: S.tag, q: S.q, tab: curTab, lang: LANG }; },
    t: t, vcardOf: vcardOf, themeOf: themeOf, drawCard: drawCard, cardCanvas: cardCanvas,
    goTab: goTab, openMineEditor: openMineEditor, openRecvEditor: openRecvEditor, openDetail: openDetail,
    openQR: openQR, renderMine: renderMine, renderWallet: renderWallet, currentCard: currentCard,
    backupJSON: backupJSON, shrinkPhoto: shrinkPhoto
  };
})();
