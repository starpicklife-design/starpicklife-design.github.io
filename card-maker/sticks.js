/* 와글링 카드꾸미기 — 스티커 그림 (100% 자체 오리지널 SVG · 2D 손그림 / 3D 입체 두 가지)
   좌표계: viewBox 0 0 100 100 · 바깥 여백 약 6 */
(function () {
  'use strict';

  function make(g) {
    var defs = [], n = 0;
    function grad(a, b, c) {
      if (!g) return b;
      var id = 'p' + (++n);
      defs.push('<radialGradient id="' + id + '" cx=".36" cy=".28" r=".92"><stop offset="0" stop-color="' + a +
        '"/><stop offset=".58" stop-color="' + b + '"/><stop offset="1" stop-color="' + c + '"/></radialGradient>');
      return 'url(#' + id + ')';
    }
    function lin(a, b, c) {
      if (!g) return b;
      var id = 'l' + (++n);
      defs.push('<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a +
        '"/><stop offset=".55" stop-color="' + b + '"/><stop offset="1" stop-color="' + c + '"/></linearGradient>');
      return 'url(#' + id + ')';
    }
    return { defs: defs, grad: grad, lin: lin, g: g };
  }
  function OUT(g) {
    return g ? 'stroke="rgba(74,40,52,.26)" stroke-width="1.5"' : 'stroke="#4A3540" stroke-width="3.2"';
  }
  function INK(g) { return g ? '#5A3B46' : '#4A3540'; }

  var F = {};
  var PCID = 0, CCID = 0;

  /* ── 정미년 · 설날 ───────────────────────────────────── */

  F.sheep = function (g) {
    var m = make(g), wool = m.grad('#FFFFFF', '#FFF7EB', '#E9D2BA'), face = m.grad('#FFFDF8', '#FFF5E6', '#F2DDC6');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<g fill="' + wool + '"><circle cx="24" cy="48" r="12"/><circle cx="32" cy="33" r="13"/><circle cx="47" cy="27" r="13"/>' +
      '<circle cx="63" cy="29" r="13"/><circle cx="75" cy="40" r="12"/><circle cx="78" cy="56" r="12"/><circle cx="70" cy="70" r="12"/>' +
      '<circle cx="55" cy="76" r="12"/><circle cx="38" cy="75" r="12"/><circle cx="26" cy="63" r="11"/><ellipse cx="50" cy="52" rx="27" ry="25"/></g>' +
      '<path d="M33 33c-8-4-13 2-10 8 2 5 8 3 9-1" fill="none" stroke="#DFA23A" stroke-width="3.4"/>' +
      '<path d="M67 33c8-4 13 2 10 8-2 5-8 3-9-1" fill="none" stroke="#DFA23A" stroke-width="3.4"/>' +
      '<ellipse cx="50" cy="55" rx="19" ry="18" fill="' + face + '"/>' +
      '<ellipse cx="31" cy="49" rx="7.5" ry="5" fill="' + face + '" transform="rotate(-22 31 49)"/>' +
      '<ellipse cx="69" cy="49" rx="7.5" ry="5" fill="' + face + '" transform="rotate(22 69 49)"/>' +
      '<circle cx="43" cy="52" r="2.7" fill="' + INK(g) + '" stroke="none"/><circle cx="57" cy="52" r="2.7" fill="' + INK(g) + '" stroke="none"/>' +
      '<path d="M47 60q3 3 6 0" fill="none" stroke="' + INK(g) + '" stroke-width="2.2"/>' +
      '<ellipse cx="37.5" cy="62" rx="4" ry="2.6" fill="#FFB3BC" stroke="none" opacity=".85"/>' +
      '<ellipse cx="62.5" cy="62" rx="4" ry="2.6" fill="#FFB3BC" stroke="none" opacity=".85"/>' +
      (g ? '<ellipse cx="42" cy="41" rx="9" ry="5" fill="#fff" opacity=".45" stroke="none" transform="rotate(-20 42 41)"/>' : '') +
      '</g>' };
  };

  F.sheepFull = function (g) {
    var m = make(g), wool = m.grad('#FFFFFF', '#FFF6E8', '#E7CFB6'), face = m.grad('#FFFDF8', '#FFF4E3', '#F0DBC3');
    var leg = g ? '#F3DFC9' : '#FFF6E8';
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<rect x="32" y="62" width="8" height="22" rx="4" fill="' + leg + '"/>' +
      '<rect x="46" y="66" width="8" height="19" rx="4" fill="' + leg + '"/>' +
      '<rect x="60" y="66" width="8" height="19" rx="4" fill="' + leg + '"/>' +
      '<rect x="73" y="62" width="8" height="21" rx="4" fill="' + leg + '"/>' +
      '<circle cx="82" cy="52" r="6" fill="' + wool + '"/>' +
      '<g fill="' + wool + '"><circle cx="38" cy="46" r="13"/><circle cx="52" cy="38" r="14"/><circle cx="66" cy="42" r="13"/>' +
      '<circle cx="74" cy="54" r="12"/><circle cx="42" cy="58" r="13"/><circle cx="58" cy="58" r="13"/><circle cx="68" cy="60" r="11"/></g>' +
      '<circle cx="25" cy="40" r="14" fill="' + face + '"/>' +
      '<ellipse cx="14" cy="34" rx="7" ry="5" fill="' + face + '" transform="rotate(-30 14 34)"/>' +
      '<ellipse cx="22" cy="34" rx="6" ry="4" fill="' + face + '" transform="rotate(-16 22 34)"/>' +
      '<circle cx="21" cy="40" r="2.3" fill="' + INK(g) + '" stroke="none"/><circle cx="30" cy="40" r="2.3" fill="' + INK(g) + '" stroke="none"/>' +
      '<path d="M24 46q3 2.4 5.5 0" fill="none" stroke="' + INK(g) + '" stroke-width="1.8"/>' +
      '<path d="M27 28c-6-4-10 1-8 6 2 4 6 2 6-1" fill="none" stroke="#DFA23A" stroke-width="2.8"/>' +
      '<ellipse cx="22" cy="48" rx="3.4" ry="2.2" fill="#FFB3BC" stroke="none" opacity=".85"/>' +
      (g ? '<ellipse cx="52" cy="42" rx="10" ry="5" fill="#fff" opacity=".45" stroke="none" transform="rotate(-16 52 42)"/>' : '') +
      '</g>' };
  };

  F.pouch = function (g) {
    var m = make(g), red = m.grad('#F0625C', '#D8342F', '#A31E22'), gold = m.lin('#FFE29A', '#F0BE55', '#C9902C');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M27 33c0-9 9-14 23-14s23 5 23 14c0 6-5 8-5 13 5 10 8 20 3 31-4 9-12 14-21 14s-17-5-21-14c-5-11-2-21 3-31 0-5-5-7-5-13z" fill="' + red + '"/>' +
      '<path d="M27 33c0-9 9-14 23-14s23 5 23 14" fill="none" stroke="' + (g ? '#FFD98A' : '#F6D68F') + '" stroke-width="2"/>' +
      '<rect x="28" y="24" width="44" height="10" rx="5" fill="' + gold + '"/>' +
      '<path d="M42 24c0-6 3-9 8-9s8 3 8 9" fill="none" stroke="' + (g ? '#D8A43C' : '#B98624') + '" stroke-width="3"/>' +
      '<circle cx="50" cy="62" r="9" fill="' + gold + '" opacity=".95"/>' +
      '<path d="M50 55v14M43 62h14" stroke="#B98624" stroke-width="2.4" opacity=".55"/>' +
      (g ? '<ellipse cx="40" cy="48" rx="8" ry="5" fill="#fff" opacity=".35" stroke="none" transform="rotate(-25 40 48)"/>' : '') +
      '</g>' };
  };

  F.coin = function (g) {
    var m = make(g), gold = m.grad('#FFF0BD', '#F3C759', '#C08B22');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round">' +
      '<circle cx="50" cy="50" r="30" fill="' + gold + '"/>' +
      '<circle cx="50" cy="50" r="24" fill="none" stroke="' + (g ? 'rgba(255,255,255,.55)' : '#B98624') + '" stroke-width="2"/>' +
      '<rect x="41" y="41" width="18" height="18" rx="2.5" fill="' + (g ? '#B07C1E' : '#8E6210') + '"/>' +
      (g ? '<ellipse cx="39" cy="35" rx="9" ry="5" fill="#fff" opacity=".5" stroke="none" transform="rotate(-28 39 35)"/>' : '') +
      '<path d="M78 24l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#FFE9A8" stroke="none"/>' +
      '</g>' };
  };

  F.tteokguk = function (g) {
    var m = make(g), bowl = m.grad('#FFFFFF', '#FFF6EA', '#E3C9AE'), soup = m.lin('#FBF0D4', '#F3E2BA', '#E8D2A2');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M16 58h68c-1 15-13 27-34 27S17 73 16 58z" fill="' + bowl + '"/>' +
      '<ellipse cx="50" cy="58" rx="34" ry="7.5" fill="' + bowl + '"/>' +
      '<ellipse cx="50" cy="58" rx="27" ry="5.2" fill="' + soup + '" stroke="none"/>' +
      '<ellipse cx="38" cy="57" rx="7" ry="3.4" fill="#FFFDF6" stroke="#E7D3B6" stroke-width="1"/>' +
      '<ellipse cx="52" cy="59" rx="7.5" ry="3.4" fill="#FFFDF6" stroke="#E7D3B6" stroke-width="1"/>' +
      '<ellipse cx="64" cy="56" rx="6.5" ry="3.2" fill="#FFFDF6" stroke="#E7D3B6" stroke-width="1"/>' +
      '<circle cx="49" cy="55" r="4.4" fill="#F6CB58" stroke="#E8B23A" stroke-width="1"/>' +
      '<path d="M31 55c2-2 4-1 4 1M69 55c2-2 4-1 4 1" stroke="#5C9E63" stroke-width="2.2" fill="none"/>' +
      '<path d="M16 58h68" stroke="' + (g ? 'rgba(120,80,60,.28)' : '#C9A97E') + '" stroke-width="2"/>' +
      '<path d="M36 44c-4-4 3-7 0-12M50 42c-4-5 4-8 0-14M64 44c-4-4 3-7 0-12" stroke="' + (g ? '#FFFFFF' : '#C9B89C') + '" stroke-width="3.2" fill="none" opacity=".9" stroke-linecap="round"/>' +
      (g ? '<ellipse cx="32" cy="70" rx="9" ry="4" fill="#fff" opacity=".45" stroke="none"/>' : '') +
      '</g>' };
  };

  /* 청사초롱 — 한국 전통 등(파랑·빨강 비단 + 금테 + 술). 중국식 홍등을 대신한다. */
  F.cheongsachorong = function (g) {
    var m = make(g), blue = m.lin('#8FC0F0', '#2E6BA8', '#173F6E'), red = m.lin('#F58B82', '#D8342F', '#9E1618'),
      gold = m.lin('#FFF3CC', '#EFC05B', '#C08B22');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 3v10" stroke="' + (g ? '#E7C070' : '#B98B44') + '" stroke-width="3"/>' +
      '<path d="M43 12h14" stroke="' + (g ? '#E7C070' : '#B98B44') + '" stroke-width="3"/>' +
      '<path d="M32 25c0-4 3-7 7-7h22c4 0 7 3 7 7v19H32z" fill="' + blue + '"/>' +
      '<path d="M32 44h36v20c0 4-3 8-7 8H39c-4 0-7-4-7-8z" fill="' + red + '"/>' +
      '<path d="M38 22v45M46 21v48M54 21v48M62 22v45" stroke="rgba(255,255,255,.32)" stroke-width="1.5" fill="none"/>' +
      '<rect x="29" y="18" width="42" height="6" rx="3" fill="' + gold + '"/>' +
      '<rect x="29" y="66" width="42" height="6" rx="3" fill="' + gold + '"/>' +
      '<path d="M50 72v7" stroke="#C08B22" stroke-width="3"/>' +
      '<circle cx="50" cy="80" r="3" fill="' + gold + '"/>' +
      '<path d="M50 83c-5 3-7 8-6 13M50 83c5 3 7 8 6 13M50 83v13M44 84c-5 2-7 7-7 12M56 84c5 2 7 7 7 12" stroke="#C8302F" stroke-width="2.8" fill="none"/>' +
      '<path d="M43 84c-4 2-6 7-6 11M57 84c4 2 6 7 6 11" stroke="#2E5EAA" stroke-width="2.4" fill="none"/>' +
      (g ? '<ellipse cx="39" cy="30" rx="4" ry="7" fill="#fff" opacity=".38" stroke="none"/>' : '') +
      '</g>' };
  };

  F.plum = function (g) {
    var m = make(g), petal = m.grad('#FFE9EF', '#FFC2D2', '#EE8FAC');
    function blossom(x, y, r, rot) {
      var s = '';
      for (var i = 0; i < 5; i++) {
        s += '<ellipse cx="' + x + '" cy="' + (y - r * .66).toFixed(1) + '" rx="' + (r * .34).toFixed(1) + '" ry="' + (r * .48).toFixed(1) +
          '" fill="' + petal + '" stroke="#E39AB0" stroke-width="1.1" transform="rotate(' + (rot + i * 72) + ' ' + x + ' ' + y + ')"/>';
      }
      return s + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * .24).toFixed(1) + '" fill="#F2C14E" stroke="#D9A441" stroke-width="1"/>';
    }
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M10 90C26 68 30 52 40 34c5-9 10-15 18-20" fill="none" stroke="' + (g ? '#8A5A44' : '#5A3A2E') + '" stroke-width="4.6"/>' +
      '<path d="M30 62c8-1 13 3 16 8M44 40c-7 0-10-4-12-8" fill="none" stroke="' + (g ? '#8A5A44' : '#5A3A2E') + '" stroke-width="3"/>' +
      '<path d="M56 20c5-4 10-2 12 2" fill="none" stroke="#5A3A2E" stroke-width="2.4"/>' +
      blossom(22, 74, 12, 8) + blossom(38, 48, 11, 22) + blossom(58, 26, 12, 0) + blossom(78, 22, 9, 14) +
      '</g>' };
  };

  F.sparkler = function (g) {
    var m = make(g), gold = m.grad('#FFF7CE', '#FFD35E', '#E89A16');
    var rays = '';
    for (var i = 0; i < 12; i++) {
      var a = i * Math.PI / 6, r1 = i % 2 ? 26 : 32, r2 = i % 2 ? 40 : 46;
      rays += '<path d="M' + (50 + Math.cos(a) * r1).toFixed(1) + ' ' + (50 + Math.sin(a) * r1).toFixed(1) +
        'L' + (50 + Math.cos(a) * r2).toFixed(1) + ' ' + (50 + Math.sin(a) * r2).toFixed(1) +
        '" stroke="' + (g ? '#FFD86B' : '#E8A93C') + '" stroke-width="4" stroke-linecap="round"/>';
    }
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round">' + rays +
      '<circle cx="50" cy="50" r="20" fill="' + gold + '"/>' +
      '<circle cx="50" cy="50" r="12" fill="none" stroke="#FFF8DC" stroke-width="3" opacity=".9"/>' +
      '<circle cx="50" cy="50" r="5" fill="#FFFDF0"/>' +
      '</g>' };
  };

  F.goldbar = function (g) {
    var m = make(g), gold = m.lin('#FFEAA6', '#F2C154', '#C08B22');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round">' +
      '<path d="M22 62h52l8 14H14z" fill="' + gold + '"/>' +
      '<path d="M30 46h44l7 14H24z" fill="' + m.grad('#FFF2C4', '#F5C85F', '#C99A2C') + '"/>' +
      '<path d="M38 32h30l6 12H32z" fill="' + gold + '"/>' +
      '<path d="M46 40l4-6 4 6" fill="none" stroke="#8A5E12" stroke-width="2" opacity=".6"/>' +
      (g ? '<ellipse cx="40" cy="52" rx="10" ry="4" fill="#fff" opacity=".5" stroke="none"/>' : '') +
      '</g>' };
  };

  F.norigae = function (g) {
    var m = make(g), red = m.grad('#F4737A', '#D8342F', '#A31E22'), gold = m.grad('#FFF4D2', '#EFC463', '#B98A2C');
    var jade = m.grad('#D4F6E2', '#79C9A8', '#2F7A5C');
    function strand(dx, col) {
      return '<path d="M' + (50 + dx) + ' 58v26" stroke="' + col + '" stroke-width="6.5" stroke-linecap="round"/>' +
        '<path d="M' + (50 + dx) + ' 58v8" stroke="#D9A441" stroke-width="6.5" stroke-linecap="round"/>';
    }
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 3v9" stroke="' + (g ? '#C9A24A' : '#9A7432') + '" stroke-width="3"/>' +
      '<ellipse cx="34" cy="24" rx="16" ry="11" fill="' + red + '" transform="rotate(-22 34 24)"/>' +
      '<ellipse cx="66" cy="24" rx="16" ry="11" fill="' + red + '" transform="rotate(22 66 24)"/>' +
      '<circle cx="50" cy="24" r="9" fill="' + gold + '"/>' +
      '<path d="M50 33v7" stroke="#B98624" stroke-width="2.6"/>' +
      '<circle cx="50" cy="47" r="9" fill="' + jade + '"/>' +
      '<circle cx="46.5" cy="44" r="3" fill="#FFFFFF" opacity=".55" stroke="none"/>' +
      '<path d="M36 57h28" stroke="#B98624" stroke-width="3"/>' +
      strand(-13, '#C8302F') + strand(0, '#2E5EAA') + strand(13, '#3E8E5A') +
      '<path d="M37 84v8M50 84v8M63 84v8" stroke="#E8B23A" stroke-width="6.5" stroke-linecap="round"/>' +
      '</g>' };
  };

  /* 까치 — 새해를 알리는 한국의 새 */
  F.magpie = function (g) {
    var m = make(g), body = m.grad('#FFFFFF', '#F3F4F8', '#DDE1EC'), back = m.lin('#444A66', '#232838', '#12151F'),
      wing = m.lin('#7E9EDF', '#34508F', '#1E3160');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M36 46L8 74l5 8 32-26z" fill="' + back + '"/>' +
      '<ellipse cx="54" cy="55" rx="19" ry="15" fill="' + body + '"/>' +
      '<path d="M36 49c1-12 12-20 26-18l3 10c-10 6-20 8-29 8z" fill="' + back + '"/>' +
      '<circle cx="73" cy="32" r="11" fill="' + back + '"/>' +
      '<path d="M83 29l11 3-11 4z" fill="#22242E"/>' +
      '<circle cx="76" cy="29" r="2.2" fill="#FFFFFF" stroke="none"/>' +
      '<path d="M46 46c9-6 19-4 23 4-7 7-16 7-23 2z" fill="' + wing + '"/>' +
      '<path d="M57 69l-2 9M65 69l2 9" stroke="#6B6E7A" stroke-width="2.6" fill="none"/>' +
      '<path d="M55 78h-6M55 78h5M67 78h-5M67 78h5" stroke="#6B6E7A" stroke-width="2.2" stroke-linecap="round"/>' +
      '<ellipse cx="52" cy="62" rx="4" ry="2.6" fill="#F6A9B0" stroke="none" opacity=".65"/>' +
      (g ? '<ellipse cx="46" cy="47" rx="8" ry="4" fill="#fff" opacity=".4" stroke="none" transform="rotate(-22 46 47)"/>' : '') +
      '</g>' };
  };

  /* 소나무 — 곧은 줄기와 부채꼴 솔잎 */
  F.pine = function (g) {
    var m = make(g), bark = m.lin('#A47A52', '#7A5436', '#4A3222'), needle = m.grad('#A8E2B4', '#3E8E5A', '#1F5233');
    function fan(cx, cy, r, rot) {
      var s = '<g transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')">' +
        '<path d="M' + (cx - r) + ' ' + cy + 'A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy + 'Z" fill="' + needle + '"/>';
      for (var i = 0; i <= 8; i++) {
        var a = Math.PI + i * Math.PI / 8;
        s += '<path d="M' + cx + ' ' + cy + 'l' + (Math.cos(a) * r * 1.0).toFixed(1) + ' ' + (Math.sin(a) * r * 1.0).toFixed(1) +
          '" stroke="' + (g ? '#2E6E4A' : '#1F5233') + '" stroke-width="1.5" opacity=".45" stroke-linecap="round"/>';
      }
      return s + '</g>';
    }
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 94c3-12-2-22 1-32 3-9 1-16-2-22" fill="none" stroke="' + bark + '" stroke-width="7"/>' +
      '<path d="M52 64c-9-1-16-7-20-15M53 50c9 0 15-5 18-12" fill="none" stroke="' + bark + '" stroke-width="4.4"/>' +
      fan(50, 26, 15, 0) + fan(30, 42, 14, -14) + fan(70, 42, 14, 14) + fan(38, 58, 12, -8) + fan(62, 56, 12, 8) +
      '<path d="M26 92c12-3 36-3 48 0" fill="none" stroke="#8A6A4A" stroke-width="2" opacity=".32"/>' +
      '</g>' };
  };

  /* 한옥 처마 — 기와지붕 + 단청 */
  F.hanok = function (g) {
    var m = make(g), tile = m.lin('#7C8090', '#4E5260', '#33363F'), wood = m.lin('#C49A6A', '#8A5E3A', '#5E3E24');
    var ribs = '';
    for (var i = 1; i < 10; i++) {
      var x = 8 + i * 9;
      ribs += '<path d="M' + x + ' 40c2 5 2 9 1 13" stroke="rgba(255,255,255,.22)" stroke-width="1.8" fill="none"/>';
    }
    var dan = '';
    for (var j = 0; j < 7; j++) {
      dan += '<circle cx="' + (20 + j * 10.5) + '" cy="58" r="2.2" fill="#E8B84A"/>';
    }
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M4 44C26 28 74 28 96 44L88 56C68 44 32 44 12 56z" fill="' + tile + '"/>' +
      '<path d="M8 42C28 28 72 28 92 42" fill="none" stroke="#9BA0B0" stroke-width="2" opacity=".7"/>' + ribs +
      '<path d="M12 56C32 44 68 44 88 56L86 63C68 53 32 53 14 63z" fill="' + (g ? '#2E7A52' : '#2E6E46') + '"/>' + dan +
      '<path d="M22 63v23M78 63v23" stroke="' + wood + '" stroke-width="6"/>' +
      '<rect x="30" y="63" width="40" height="23" fill="#FBF3E2"/>' +
      '<path d="M40 63v23M60 63v23M30 74h40" stroke="#E2D2B8" stroke-width="2"/>' +
      '<path d="M8 88h84" stroke="#8A6A4A" stroke-width="3" opacity=".5"/>' +
      '</g>' };
  };

  /* 창호지 창 — 한지 문살 */
  F.window = function (g) {
    var m = make(g), wood = m.lin('#C9A06E', '#9A6E44', '#6E4A2C'), paper = m.lin('#FFFFFF', '#FDF6E6', '#F2E4CB');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<rect x="14" y="10" width="72" height="80" rx="4" fill="' + wood + '"/>' +
      '<rect x="21" y="17" width="58" height="66" rx="2" fill="' + paper + '"/>' +
      '<path d="M21 39h58M21 61h58M40 17v66M60 17v66" stroke="' + (g ? '#C9A06E' : '#B98A5A') + '" stroke-width="3"/>' +
      '<rect x="14" y="10" width="72" height="80" rx="4" fill="none" stroke="' + (g ? 'rgba(255,255,255,.35)' : '#7A5436') + '" stroke-width="2"/>' +
      '<circle cx="50" cy="50" r="4.4" fill="#D8342F" stroke="none" opacity=".9"/>' +
      '<path d="M50 46c-3-3-7-2-7 1s4 4 7 1c3 3 7 2 7-1s-4-4-7-1" fill="#E9737C" stroke="none"/>' +
      '<path d="M12 90h76" stroke="#8A6A4A" stroke-width="3" opacity=".45"/>' +
      '</g>' };
  };

  /* 색동 — 오방색 비단 띠 */
  F.saekdong = function (g) {
    var cols = ['#2E5EAA', '#C8302F', '#F2C14E', '#3E8E5A', '#D4657F'];
    var b = '';
    for (var i = 0; i < 5; i++) {
      var y = 26 + i * 9.4;
      b += '<path d="M7 ' + y + 'C30 ' + (y - 6) + ' 70 ' + (y - 6) + ' 93 ' + y + 'l0 9.4c-23 -6 -63 -6 -86 0z" fill="' + cols[i] + '"/>';
    }
    return { d: '', b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' + b +
      '<path d="M7 26c23-6 63-6 86 0M7 73c23-6 63-6 86 0" fill="none" stroke="#E8B84A" stroke-width="2" opacity=".9"/>' +
      '<path d="M12 32l4 6-4 6M88 32l-4 6 4 6" stroke="#E8B84A" stroke-width="2" fill="none"/>' +
      (g ? '<path d="M12 30c20-5 56-5 76 0" stroke="#fff" stroke-width="3" opacity=".18" fill="none"/>' : '') +
      '</g>' };
  };

  /* 해돋이 — 새해 첫 해 */
  F.sunrise = function (g) {
    var m = make(g), sun = m.grad('#FFF9DA', '#FFD05A', '#EF9518'), back = m.lin('#8FB2CC', '#5A7E96', '#345670'),
      front = m.lin('#4A6E8A', '#2E4A63', '#1B3044');
    var rays = '';
    for (var i = 0; i < 11; i++) {
      var a = Math.PI + i * Math.PI / 10;
      var r1 = 23, r2 = i % 2 ? 30 : 34;
      rays += '<path d="M' + (50 + Math.cos(a) * r1).toFixed(1) + ' ' + (44 + Math.sin(a) * r1).toFixed(1) + 'L' +
        (50 + Math.cos(a) * r2).toFixed(1) + ' ' + (44 + Math.sin(a) * r2).toFixed(1) + '" stroke="#F6C453" stroke-width="3" stroke-linecap="round"/>';
    }
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' + rays +
      '<circle cx="50" cy="44" r="19" fill="' + sun + '"/>' +
      '<path d="M4 78L26 56l15 13 15-19 20 22 14 6z" fill="' + back + '"/>' +
      '<path d="M4 92L18 76l13 9 14-14 16 16 12-8 19 13z" fill="' + front + '"/>' +
      '<path d="M22 126" fill="none"/>' +
      '<path d="M30 34c4-3 8-3 12 0M62 28c3-2 6-2 9 0" stroke="#2E4A63" stroke-width="2.4" fill="none" opacity=".55"/>' +
      (g ? '<ellipse cx="42" cy="35" rx="7" ry="5" fill="#fff" opacity=".55" stroke="none" transform="rotate(-25 42 35)"/>' : '') +
      '</g>' };
  };

  /* 한복 입은 양 — 정미년 */
  F.sheepHanbok = function (g) {
    var m = make(g), wool = m.grad('#FFFFFF', '#FFF7EB', '#E9D2BA'), face = m.grad('#FFFDF8', '#FFF5E6', '#F2DDC6'),
      han = m.lin('#F5949B', '#D8342F', '#A31E22'), trim = m.lin('#FFFDF6', '#F6EAD2', '#DFC9A6');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<ellipse cx="24" cy="60" rx="8" ry="10" fill="' + han + '" transform="rotate(-18 24 60)"/>' +
      '<ellipse cx="76" cy="60" rx="8" ry="10" fill="' + han + '" transform="rotate(18 76 60)"/>' +
      '<path d="M26 52c0-9 10-14 24-14s24 5 24 14v20c0 7-11 11-24 11s-24-4-24-11z" fill="' + han + '"/>' +
      '<path d="M26 54c8 4 40 4 48 0" stroke="#F6C453" stroke-width="2.6" fill="none" opacity=".8"/>' +
      '<path d="M42 38l8 9 8-9" fill="none" stroke="' + trim + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M50 46c-3 6-9 9-13 8M50 46c3 6 9 9 13 8" fill="none" stroke="#F6EAD2" stroke-width="4"/>' +
      '<path d="M50 47v13l-6 3M50 60l6 3" fill="none" stroke="#2E5EAA" stroke-width="3"/>' +
      '<circle cx="50" cy="47" r="3" fill="#E8B84A"/>' +
      '<ellipse cx="40" cy="87" rx="6" ry="3.4" fill="#4A3540" stroke="none"/><ellipse cx="60" cy="87" rx="6" ry="3.4" fill="#4A3540" stroke="none"/>' +
      '<g fill="' + wool + '"><circle cx="38" cy="34" r="8"/><circle cx="62" cy="34" r="8"/><circle cx="50" cy="26" r="9"/></g>' +
      '<path d="M38 30c-5-4-9 0-7 5 1 3 5 2 6-1M62 30c5-4 9 0 7 5-1 3-5 2-6-1" fill="none" stroke="#DFA23A" stroke-width="2.8"/>' +
      '<ellipse cx="50" cy="37" rx="12" ry="10" fill="' + face + '"/>' +
      '<circle cx="45" cy="36" r="1.9" fill="' + INK(g) + '" stroke="none"/><circle cx="55" cy="36" r="1.9" fill="' + INK(g) + '" stroke="none"/>' +
      '<path d="M47 41q3 2.4 6 0" fill="none" stroke="' + INK(g) + '" stroke-width="1.8"/>' +
      '<ellipse cx="41" cy="41" rx="3" ry="2" fill="#FFB3BC" stroke="none" opacity=".85"/>' +
      '<ellipse cx="59" cy="41" rx="3" ry="2" fill="#FFB3BC" stroke="none" opacity=".85"/>' +
      (g ? '<ellipse cx="44" cy="31" rx="6" ry="3.4" fill="#fff" opacity=".45" stroke="none" transform="rotate(-20 44 31)"/>' : '') +
      '</g>' };
  };

  /* 방패연 — 한국 연 */
  F.kite = function (g) {
    var m = make(g), paper = m.lin('#FFFFFF', '#FFF7E8', '#EADCC0'), wood = m.lin('#C49A6A', '#8A5E3A', '#5E3E24');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 6C64 16 78 30 82 46c4 18-12 34-32 44C30 80 14 64 18 46 22 30 36 16 50 6z" fill="' + paper + '"/>' +
      '<path d="M50 10c-10 12-22 26-25 42-2 13 8 24 25 33" fill="none" stroke="#D8342F" stroke-width="5" opacity=".85"/>' +
      '<path d="M50 10c10 12 22 26 25 42 2 13-8 24-25 33" fill="none" stroke="#2E5EAA" stroke-width="5" opacity=".85"/>' +
      '<circle cx="50" cy="46" r="9" fill="#F2E6CE" stroke="' + (g ? 'rgba(120,90,60,.5)' : '#B98A5A') + '" stroke-width="2"/>' +
      '<path d="M50 6v80M18 46h64" stroke="' + wood + '" stroke-width="2.4" opacity=".75"/>' +
      '<path d="M50 90c-4 8 2 12-2 20M50 90c4 8-2 12 2 20" fill="none" stroke="#D8342F" stroke-width="2.6"/>' +
      '<path d="M28 30c6-4 12-4 18 0M72 30c-6-4-12-4-18 0" fill="none" stroke="#E8B84A" stroke-width="2.4" opacity=".8"/>' +
      '</g>' };
  };

  /* ── 크리스마스 ──────────────────────────────────────── */

  F.xmasTree = function (g) {
    var m = make(g), leaf = m.lin('#6FD1A0', '#2F8A5C', '#1B5A3C'), trunk = m.lin('#B98A5A', '#8A5E3A', '#5E3E24'),
      gold = m.grad('#FFF7D2', '#FFD35E', '#E39A17');
    var orn = '', pts = [[50, 34], [41, 47], [59, 47], [33, 62], [67, 62], [44, 74], [56, 74], [38, 82], [62, 82], [50, 55], [47, 41], [57, 67]];
    var cols = ['#E7373F', '#F6C453', '#7EA9F2', '#FF8FA8', '#7FD8C0'];
    pts.forEach(function (p, i) {
      orn += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.4" fill="' + cols[i % 5] + '" stroke="none"/>';
    });
    var star = '';
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 3.6 : 8;
      star += (50 + Math.cos(a) * rr).toFixed(1) + ',' + (20 + Math.sin(a) * rr).toFixed(1) + ' ';
    }
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<rect x="46" y="86" width="8" height="9" rx="2" fill="' + trunk + '"/>' +
      '<path d="M50 26L30 52h40z" fill="' + leaf + '"/>' +
      '<path d="M50 44L22 72h56z" fill="' + leaf + '"/>' +
      '<path d="M50 62L14 90h72z" fill="' + leaf + '"/>' +
      '<path d="M32 50c12-4 24-4 36 0M24 70c16-5 36-5 52 0" stroke="#F6C453" stroke-width="2.4" fill="none" opacity=".85"/>' +
      orn +
      '<polygon points="' + star + '" fill="' + gold + '"/>' +
      '<path d="M30 88c6-2 12-2 18-1M70 88c-6-2-12-2-18-1" stroke="#FFFFFF" stroke-width="3" opacity=".55" fill="none"/>' +
      '</g>' };
  };

  F.snowman = function (g) {
    var m = make(g), snow = m.grad('#FFFFFF', '#F4FAFF', '#D8E6F2'), hat = m.lin('#F58B82', '#D8342F', '#A31E22'),
      twig = m.lin('#8A6A4A', '#6A4A32', '#3E2C1E');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<ellipse cx="50" cy="92" rx="26" ry="4" fill="#CFE0EE" stroke="none" opacity=".6"/>' +
      '<circle cx="50" cy="70" r="19" fill="' + snow + '"/>' +
      '<circle cx="50" cy="42" r="14" fill="' + snow + '"/>' +
      '<path d="M26 58c-6-6-12-8-16-6M74 58c6-6 12-8 16-6M14 52l-2-5M86 52l2-5" stroke="' + twig + '" stroke-width="3" fill="none"/>' +
      '<path d="M38 40c2 2 4 2 6 0M56 40c2 2 4 2 6 0" stroke="' + INK(g) + '" stroke-width="2.4" fill="none"/>' +
      '<path d="M50 44l8 3-8 3z" fill="#F59A2E"/>' +
      '<circle cx="44" cy="49" r="1.4" fill="' + INK(g) + '" stroke="none"/>' +
      '<circle cx="50" cy="52" r="1.4" fill="' + INK(g) + '" stroke="none"/>' +
      '<circle cx="56" cy="49" r="1.4" fill="' + INK(g) + '" stroke="none"/>' +
      '<path d="M36 32c4-9 24-9 28 0z" fill="' + hat + '"/>' +
      '<rect x="33" y="30" width="34" height="7" rx="3.5" fill="#FFFDF6"/>' +
      '<circle cx="64" cy="24" r="6" fill="#FFFDF6"/>' +
      '<path d="M36 56c6 3 22 3 28 0" stroke="#D8342F" stroke-width="6" fill="none"/>' +
      '<path d="M60 58l6 8" stroke="#D8342F" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="50" cy="66" r="2" fill="#5A5E6E" stroke="none"/><circle cx="50" cy="74" r="2" fill="#5A5E6E" stroke="none"/>' +
      '</g>' };
  };

  F.santaHat = function (g) {
    var m = make(g), red = m.lin('#FF8E86', '#D8342F', '#9E1618'), fur = m.grad('#FFFFFF', '#FFF8F0', '#E6D9CA');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M28 72c1-26 10-44 25-50 0 16 10 34 19 50z" fill="' + red + '"/>' +
      '<rect x="22" y="68" width="56" height="13" rx="6.5" fill="' + fur + '"/>' +
      '<circle cx="55" cy="23" r="7.5" fill="' + fur + '"/>' +
      '<path d="M37 62c6-14 12-24 18-30" stroke="rgba(255,255,255,.4)" stroke-width="3" fill="none"/>' +
      '<circle cx="40" cy="80" r="2.2" fill="#FFFFFF" stroke="none" opacity=".8"/>' +
      '</g>' };
  };

  F.reindeer = function (g) {
    var m = make(g), fur = m.grad('#E0B98E', '#B98A5A', '#8A5E3A'), muz = m.grad('#FFF3E2', '#F6DFC4', '#E0C4A2'),
      ant = m.lin('#C9A06E', '#8A5E3A', '#5E3E24');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M38 30c-6-8-6-14-2-18 0 6 3 10 6 12M62 30c6-8 6-14 2-18 0 6-3 10-6 12M40 26l-8-2M60 26l8-2" fill="none" stroke="' + ant + '" stroke-width="3"/>' +
      '<ellipse cx="34" cy="40" rx="7" ry="10" fill="' + fur + '" transform="rotate(-24 34 40)"/>' +
      '<ellipse cx="66" cy="40" rx="7" ry="10" fill="' + fur + '" transform="rotate(24 66 40)"/>' +
      '<ellipse cx="50" cy="52" rx="19" ry="21" fill="' + fur + '"/>' +
      '<ellipse cx="50" cy="64" rx="13" ry="10" fill="' + muz + '"/>' +
      '<circle cx="43" cy="45" r="2.6" fill="' + INK(g) + '" stroke="none"/><circle cx="57" cy="45" r="2.6" fill="' + INK(g) + '" stroke="none"/>' +
      '<ellipse cx="50" cy="61" rx="5" ry="4" fill="#6B4A3A" stroke="none"/>' +
      '<path d="M50 65v3M50 68c-3 2-6 1-7-1M50 68c3 2 6 1 7-1" fill="none" stroke="' + INK(g) + '" stroke-width="1.8"/>' +
      '<ellipse cx="36" cy="57" rx="4" ry="2.6" fill="#F6A9B0" stroke="none" opacity=".8"/>' +
      '<ellipse cx="64" cy="57" rx="4" ry="2.6" fill="#F6A9B0" stroke="none" opacity=".8"/>' +
      '<path d="M32 38c4-8 14-11 22-8" stroke="#6B4A3A" stroke-width="3" fill="none" opacity=".5"/>' +
      (g ? '<ellipse cx="42" cy="40" rx="7" ry="4" fill="#fff" opacity=".35" stroke="none" transform="rotate(-20 42 40)"/>' : '') +
      '</g>' };
  };

  F.giftBox = function (g) {
    var m = make(g), box = m.lin('#F58B82', '#D8342F', '#A31E22'), lid = m.lin('#FFA29A', '#E74A44', '#B4262A'),
      gold = m.lin('#FFF3CC', '#F2C463', '#C08B22');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<rect x="18" y="46" width="64" height="40" rx="3" fill="' + box + '"/>' +
      '<rect x="14" y="34" width="72" height="14" rx="3" fill="' + lid + '"/>' +
      '<rect x="43" y="34" width="14" height="52" fill="' + gold + '"/>' +
      '<path d="M50 34c-13 0-17-6-15-11 2-5 8-4 11 1 2 4 4 6 4 10zM50 34c13 0 17-6 15-11-2-5-8-4-11 1-2 4-4 6-4 10z" fill="' + gold + '"/>' +
      '<path d="M20 54h60M20 78h60" stroke="#FFFFFF" stroke-width="2" opacity=".25"/>' +
      '<circle cx="28" cy="60" r="3" fill="#FFF3C4" stroke="none" opacity=".8"/>' +
      '<circle cx="72" cy="70" r="3" fill="#FFF3C4" stroke="none" opacity=".8"/>' +
      '<circle cx="28" cy="74" r="2.4" fill="#FFF3C4" stroke="none" opacity=".7"/>' +
      '</g>' };
  };

  F.wreath = function (g) {
    var m = make(g), leaf = m.grad('#8FDBAA', '#3E8E5A', '#1F5A38'), red = m.grad('#FF8A82', '#D8342F', '#9E1618');
    var lv = '';
    for (var i = 0; i < 16; i++) {
      var a = i * Math.PI / 8;
      var cx = 50 + Math.cos(a) * 27, cy = 50 + Math.sin(a) * 27;
      lv += '<ellipse cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" rx="8" ry="4.4" fill="' + leaf + '" transform="rotate(' + (a * 57.3 + 90).toFixed(0) + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')"/>';
    }
    var ber = '';
    [[50, 20], [74, 34], [76, 62], [50, 79], [24, 62], [22, 34]].forEach(function (p) {
      ber += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.4" fill="' + red + '"/>';
    });
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<circle cx="50" cy="50" r="27" fill="none" stroke="' + (g ? '#2E7A52' : '#2E6E46') + '" stroke-width="9"/>' + lv + ber +
      '<path d="M42 74l-6 10 8-2 3 6 5-10zM58 74l6 10-8-2-3 6-5-10z" fill="' + red + '"/>' +
      '<circle cx="50" cy="74" r="4" fill="#F2C463"/>' +
      '</g>' };
  };

  F.bell = function (g) {
    var m = make(g), gold = m.lin('#FFF7D6', '#F2C463', '#B98624');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 14c-6 0-9 5-9 9 0 2 1 3 1 4-12 6-16 18-16 27 0 6-4 8-4 12h56c0-4-4-6-4-12 0-9-4-21-16-27 0-1 1-2 1-4 0-4-3-9-9-9z" fill="' + gold + '"/>' +
      '<path d="M26 66h48" stroke="#B98624" stroke-width="3"/>' +
      '<circle cx="50" cy="72" r="5" fill="#D8342F"/>' +
      '<path d="M50 12v3M46 12h8" stroke="#B98624" stroke-width="3"/>' +
      '<path d="M36 74l-6 10 8-2 3 6 5-10zM64 74l6 10-8-2-3 6-5-10z" fill="#D8342F"/>' +
      '<path d="M38 42c2-8 6-12 10-14" stroke="#FFFFFF" stroke-width="3" opacity=".5" fill="none"/>' +
      '</g>' };
  };

  F.snowflake = function (g) {
    var m = make(g), c = g ? '#DCEFFF' : '#7FB6E8';
    var arms = '';
    for (var i = 0; i < 6; i++) {
      var a = i * Math.PI / 3, cx = 50 + Math.cos(a) * 38, cy = 50 + Math.sin(a) * 38;
      arms += '<path d="M50 50L' + cx.toFixed(1) + ' ' + cy.toFixed(1) + '" stroke="' + c + '" stroke-width="4" stroke-linecap="round"/>';
      [0.45, 0.7].forEach(function (t) {
        var bx = 50 + Math.cos(a) * 38 * t, by = 50 + Math.sin(a) * 38 * t;
        [1, -1].forEach(function (sd) {
          var aa = a + sd * 0.9;
          arms += '<path d="M' + bx.toFixed(1) + ' ' + by.toFixed(1) + 'l' + (Math.cos(aa) * 10).toFixed(1) + ' ' + (Math.sin(aa) * 10).toFixed(1) + '" stroke="' + c + '" stroke-width="3" stroke-linecap="round"/>';
        });
      });
    }
    return { d: m.defs, b: '<g stroke-linejoin="round">' + arms + '<circle cx="50" cy="50" r="5" fill="' + c + '"/></g>' };
  };

  F.candyCane = function (g) {
    var m = make(g), id = 'cc' + (++CCID);
    var cane = 'M50 90V40c0-14 10-24 24-24 8 0 8 12 0 12-7 0-11 5-11 12v50z';
    return { d: m.defs + '<clipPath id="' + id + '"><path d="' + cane + '"/></clipPath>',
      b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="' + cane + '" fill="#FFFFFF"/>' +
      '<g clip-path="url(#' + id + ')" stroke="#D8342F" stroke-width="7">' +
      '<path d="M30 94l50-50M30 74l40-40M34 52l30-30M52 30l16-16"/></g>' +
      '<path d="' + cane + '" fill="none" stroke="' + (g ? 'rgba(255,255,255,.5)' : '#E8DCCB') + '" stroke-width="1.6"/>' +
      '</g>' };
  };

  F.stocking = function (g) {
    var m = make(g), c = m.lin('#FF9E96', '#D8342F', '#9E1618'), fur = m.grad('#FFFFFF', '#FFF9F0', '#E6D9CA');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M32 20h34v38c0 8 14 8 14 20 0 10-10 16-24 16s-24-6-24-16z" fill="' + c + '"/>' +
      '<path d="M60 58c8 4 20 8 20 20" fill="none" stroke="#FFF3C4" stroke-width="2.4" opacity=".45"/>' +
      '<rect x="27" y="14" width="44" height="12" rx="6" fill="' + fur + '"/>' +
      '<path d="M50 14V6c0-3 4-4 6-2" fill="none" stroke="' + (g ? '#E7C070' : '#B98B44') + '" stroke-width="3"/>' +
      '<circle cx="56" cy="66" r="3" fill="#FFF3C4" stroke="none" opacity=".8"/>' +
      '<circle cx="48" cy="76" r="3" fill="#FFF3C4" stroke="none" opacity=".8"/>' +
      '<path d="M40 84h14" stroke="#FFFFFF" stroke-width="3" opacity=".4"/>' +
      '</g>' };
  };

  F.holly = function (g) {
    var m = make(g), leaf = m.grad('#8FDBAA', '#3E8E5A', '#1B5232'), red = m.grad('#FF8A82', '#D8342F', '#9E1618');
    function lf(x, y, rot) {
      return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"><path d="M0 32C-10 22-12 8-6-4-4 2-2 4 0 2 2 4 4 2 6-4 12 8 10 22 0 32z" fill="' + leaf + '"/>' +
        '<path d="M0 28V0" stroke="#1B5232" stroke-width="1.6" opacity=".5"/></g>';
    }
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      lf(50, 22, 0) + lf(24, 52, -52) + lf(76, 52, 52) +
      '<circle cx="42" cy="56" r="5" fill="' + red + '"/><circle cx="58" cy="56" r="5" fill="' + red + '"/><circle cx="50" cy="66" r="4" fill="' + red + '"/>' +
      '<circle cx="41" cy="54" r="1.6" fill="#FFF3C4" stroke="none" opacity=".8"/>' +
      '</g>' };
  };

  F.mug = function (g) {
    var m = make(g), cup = m.lin('#FF9E96', '#D8342F', '#9E1618'), cream = m.grad('#FFFDF6', '#F6E9D6', '#DCC7AE');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M24 40h48v34c0 8-9 13-24 13s-24-5-24-13z" fill="' + cup + '"/>' +
      '<ellipse cx="48" cy="40" rx="24" ry="6" fill="' + cream + '"/>' +
      '<ellipse cx="48" cy="40" rx="17" ry="3.6" fill="#7A4A2E"/>' +
      '<ellipse cx="40" cy="39" rx="4.4" ry="2.2" fill="#FFFDF6"/><ellipse cx="52" cy="41" rx="4" ry="2" fill="#FFFDF6"/>' +
      '<path d="M72 46c10-3 15 4 12 11-2 5-8 7-13 5" fill="none" stroke="#D8342F" stroke-width="7"/>' +
      '<path d="M36 30c-4-4 3-6 0-11M48 28c-4-4 3-6 0-11M60 30c-4-4 3-6 0-11" fill="none" stroke="' + (g ? '#FFFFFF' : '#C9B89C') + '" stroke-width="3"/>' +
      '<path d="M32 50c6 3 22 3 30 0" stroke="#FFFFFF" stroke-width="2.4" fill="none" opacity=".45"/>' +
      '</g>' };
  };

  F.gingerbread = function (g) {
    var m = make(g), c = m.grad('#F6D9A8', '#D8A66A', '#A87240');
    var star = '';
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 17 : 34;
      star += (50 + Math.cos(a) * rr).toFixed(1) + ',' + (50 + Math.sin(a) * rr).toFixed(1) + ' ';
    }
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<polygon points="' + star + '" fill="' + c + '"/>' +
      '<path d="M50 26l4 10 10 2-8 8 2 10-8-6-8 6 2-10-8-8 10-2z" fill="none" stroke="#FFFDF6" stroke-width="2.6" opacity=".9"/>' +
      '<circle cx="50" cy="50" r="2.6" fill="#FFFDF6"/>' +
      '<circle cx="34" cy="66" r="2" fill="#FFFDF6"/><circle cx="66" cy="66" r="2" fill="#FFFDF6"/>' +
      '<circle cx="50" cy="76" r="2" fill="#FFFDF6"/>' +
      '<circle cx="28" cy="40" r="1.8" fill="#8A5E3A" opacity=".5"/><circle cx="72" cy="40" r="1.8" fill="#8A5E3A" opacity=".5"/>' +
      '</g>' };
  };

  F.lights = function (g) {
    var m = make(g), cols = ['#E7373F', '#F6C453', '#7EA9F2', '#7FD8C0', '#FF8FA8'];
    var bulbs = '', wire = 'M4 30c14 20 28 20 46 6s32-14 46 6';
    for (var i = 0; i < 5; i++) {
      var x = 16 + i * 17, y = 36 + Math.sin(i * 1.1) * 8;
      bulbs += '<path d="M' + x + ' ' + (y - 4) + 'v4" stroke="#8A8E9A" stroke-width="2"/>' +
        '<ellipse cx="' + x + '" cy="' + (y + 6) + '" rx="6" ry="8" fill="' + cols[i] + '"/>' +
        '<ellipse cx="' + (x - 2) + '" cy="' + (y + 3) + '" rx="2" ry="2.6" fill="#FFFFFF" opacity=".55" stroke="none"/>';
    }
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="' + wire + '" fill="none" stroke="#3E4250" stroke-width="2.6" opacity=".8"/>' + bulbs +
      '<path d="M4 26c14 20 28 20 46 6s32-14 46 6" fill="none" stroke="#FFFFFF" stroke-width="1.6" opacity=".25"/></g>' };
  };

  F.mitten = function (g) {
    var m = make(g), c = m.lin('#8FDBAA', '#3E8E5A', '#1F5A38'), cuff = m.grad('#FFFFFF', '#FFF9F0', '#E6D9CA');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M36 44c-2-10 4-18 13-18 7 0 11 4 12 10 4-3 10-1 10 4 0 3-2 5-5 6 3 2 3 7-1 9-2 1-4 1-6 0v9c0 8-6 12-14 12-9 0-15-6-15-15z" fill="' + c + '"/>' +
      '<rect x="30" y="70" width="36" height="14" rx="6" fill="' + cuff + '"/>' +
      '<path d="M38 74c8 3 16 3 24 0" stroke="#E6D9CA" stroke-width="2" fill="none"/>' +
      '<path d="M44 34c5-3 10-1 12 4" stroke="#FFFFFF" stroke-width="2.6" opacity=".5" fill="none"/>' +
      '<circle cx="58" cy="60" r="3" fill="#FFF3C4" stroke="none" opacity=".85"/>' +
      '</g>' };
  };

  /* 색동 복주머니 — 오방색 비단 조각을 이어 붙인 한국식 복주머니 */
  F.pouchSaekdong = function (g) {
    var m = make(g), gold = m.lin('#FFF3CC', '#EFC05B', '#C08B22'), red = m.lin('#F58B82', '#D8342F', '#9E1618'),
      cid = 'ps' + (++PCID), bp = 'M27 33c0-9 9-14 23-14s23 5 23 14c0 6-5 8-5 13 5 10 8 20 3 31-4 9-12 14-21 14s-17-5-21-14c-5-11-2-21 3-31 0-5-5-7-5-13z';
    return { d: m.defs + '<clipPath id="' + cid + '"><path d="' + bp + '"/></clipPath>',
      b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="' + bp + '" fill="' + red + '"/>' +
      '<g clip-path="url(#' + cid + ')">' +
      '<rect x="20" y="40" width="60" height="8" fill="#2E5EAA"/>' +
      '<rect x="20" y="48" width="60" height="8" fill="#F2C14E"/>' +
      '<rect x="20" y="56" width="60" height="8" fill="#3E8E5A"/>' +
      '<rect x="20" y="64" width="60" height="8" fill="#D4657F"/>' +
      '<rect x="20" y="72" width="60" height="8" fill="#C8302F"/>' +
      '</g>' +
      '<rect x="28" y="22" width="44" height="11" rx="5.5" fill="' + gold + '"/>' +
      '<path d="M41 23c0-6 3-9 9-9s9 3 9 9" fill="none" stroke="#B98624" stroke-width="3"/>' +
      '<circle cx="50" cy="62" r="10" fill="' + gold + '"/>' +
      '<circle cx="50" cy="62" r="6.2" fill="#D8342F"/>' +
      '<path d="M50 56v12M45 62h10" stroke="#FFF3C4" stroke-width="1.8"/>' +
      '<path d="M44 92v4M50 92v5M56 92v4" stroke="#E8B23A" stroke-width="3.4" stroke-linecap="round"/>' +
      (g ? '<ellipse cx="39" cy="50" rx="7" ry="4" fill="#fff" opacity=".3" stroke="none" transform="rotate(-24 39 50)"/>' : '') +
      '</g>' };
  };

  /* 금빛 비단 복주머니 */
  F.pouchGold = function (g) {
    var m = make(g), gold = m.lin('#FFF7D6', '#F2C463', '#B98624'), red = m.lin('#F58B82', '#D8342F', '#9E1618'),
      jade = m.grad('#D8F6E4', '#79C9A8', '#2F7A5C');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M27 33c0-9 9-14 23-14s23 5 23 14c0 6-5 8-5 13 5 10 8 20 3 31-4 9-12 14-21 14s-17-5-21-14c-5-11-2-21 3-31 0-5-5-7-5-13z" fill="' + gold + '"/>' +
      '<path d="M28 34c14 6 30 6 44 0" fill="none" stroke="#B98624" stroke-width="2" opacity=".5"/>' +
      '<rect x="27" y="30" width="46" height="9" rx="4.5" fill="' + red + '"/>' +
      '<path d="M41 30c0-6 3-9 9-9s9 3 9 9" fill="none" stroke="#B98624" stroke-width="3"/>' +
      '<circle cx="50" cy="62" r="10" fill="' + red + '"/>' +
      '<circle cx="50" cy="62" r="5.6" fill="' + jade + '"/>' +
      '<path d="M50 56v12M45 62h10" stroke="#FFF3C4" stroke-width="1.6"/>' +
      '<path d="M36 44c2 8 2 20-1 30M64 44c-2 8-2 20 1 30" stroke="rgba(255,255,255,.4)" stroke-width="2.4" fill="none"/>' +
      '<path d="M44 92v4M50 92v5M56 92v4" stroke="#D8342F" stroke-width="3.4" stroke-linecap="round"/>' +
      '<circle cx="38" cy="78" r="2" fill="#B98624" opacity=".6" stroke="none"/><circle cx="62" cy="78" r="2" fill="#B98624" opacity=".6" stroke="none"/>' +
      (g ? '<ellipse cx="39" cy="48" rx="7" ry="4" fill="#fff" opacity=".45" stroke="none" transform="rotate(-24 39 48)"/>' : '') +
      '</g>' };
  };

  /* ── 십이지신 12종 ───────────────────────────────────── */

  function zBase(g, fur, muz, cy, rx, ry) {
    cy = cy || 58; rx = rx || 24; ry = ry || 22;
    return '<ellipse cx="50" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + fur + '"/>' +
      '<ellipse cx="50" cy="' + (cy + 7) + '" rx="' + (rx * .56).toFixed(1) + '" ry="' + (ry * .46).toFixed(1) + '" fill="' + muz + '"/>' +
      '<circle cx="' + (50 - rx * .36).toFixed(1) + '" cy="' + (cy - 4) + '" r="2.7" fill="' + INK(g) + '" stroke="none"/>' +
      '<circle cx="' + (50 + rx * .36).toFixed(1) + '" cy="' + (cy - 4) + '" r="2.7" fill="' + INK(g) + '" stroke="none"/>' +
      '<ellipse cx="' + (50 - rx * .66).toFixed(1) + '" cy="' + (cy + 5) + '" rx="4" ry="2.4" fill="#FFB3BC" stroke="none" opacity=".8"/>' +
      '<ellipse cx="' + (50 + rx * .66).toFixed(1) + '" cy="' + (cy + 5) + '" rx="4" ry="2.4" fill="#FFB3BC" stroke="none" opacity=".8"/>';
  }
  function zEars(g, cx1, cx2, cy, r1, r2, col) {
    return '<circle cx="' + cx1 + '" cy="' + cy + '" r="' + r1 + '" fill="' + col + '"/>' +
      '<circle cx="' + cx2 + '" cy="' + cy + '" r="' + r1 + '" fill="' + col + '"/>' +
      '<circle cx="' + cx1 + '" cy="' + cy + '" r="' + r2 + '" fill="#F6B9C2" stroke="none"/>' +
      '<circle cx="' + cx2 + '" cy="' + cy + '" r="' + r2 + '" fill="#F6B9C2" stroke="none"/>';
  }

  /* 자 — 쥐 */
  F.zRat = function (g) {
    var m = make(g), fur = m.grad('#EFF2F8', '#C9CFDD', '#9AA2B8'), muz = m.grad('#FFF7F4', '#FBE6E2', '#EBCFC8'),
      ear = m.grad('#FCE4E8', '#F2C4CC', '#D89AA6');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M76 74c9 3 12 11 8 15-4 4-10 0-8-5" fill="none" stroke="#B9BFCE" stroke-width="2.6"/>' +
      zEars(g, 26, 74, 28, 13, 6, ear) + zBase(g, fur, muz, 58, 24, 22) +
      '<ellipse cx="50" cy="65" rx="4.2" ry="3.2" fill="#E78A96"/>' +
      '<path d="M50 69v3M50 72c-2 2-5 1-6-1M50 72c2 2 5 1 6-1" fill="none" stroke="' + INK(g) + '" stroke-width="1.6"/>' +
      '<path d="M45 77v4M50 78v4M55 77v4" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M30 62l-9-3M30 67l-9 3M70 62l9-3M70 67l9 3" stroke="#8A8E9A" stroke-width="1.6"/>' +
      (g ? '<ellipse cx="42" cy="45" rx="8" ry="4" fill="#fff" opacity=".45" stroke="none" transform="rotate(-20 42 45)"/>' : '') +
      '</g>' };
  };

  /* 축 — 소 */
  F.zOx = function (g) {
    var m = make(g), fur = m.grad('#F0C9A2', '#C99A6A', '#9A6E44'), muz = m.grad('#FFF6E8', '#F6E4CC', '#E0C6A6'),
      horn = m.lin('#FFF9E2', '#E6D3AE', '#BFA47A');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M18 56c-7-2-11-7-11-12 4 2 7 2 10 1z" fill="' + horn + '"/>' +
      '<path d="M82 56c7-2 11-7 11-12-4 2-7 2-10 1z" fill="' + horn + '"/>' +
      '<path d="M36 38c-6-6-8-16-4-23 2 10 6 15 12 17z" fill="' + horn + '"/>' +
      '<path d="M64 38c6-6 8-16 4-23-2 10-6 15-12 17z" fill="' + horn + '"/>' +
      '<ellipse cx="23" cy="54" rx="5.4" ry="3.6" fill="' + fur + '" transform="rotate(-24 23 54)"/>' +
      '<ellipse cx="77" cy="54" rx="5.4" ry="3.6" fill="' + fur + '" transform="rotate(24 77 54)"/>' +
      '<circle cx="50" cy="58" r="25" fill="' + fur + '"/>' +
      '<path d="M43 35c2-3 4-4 7-4s5 1 7 4" fill="none" stroke="#8A5E3A" stroke-width="2.4" opacity=".45"/>' +
      '<circle cx="40" cy="50" r="2.8" fill="' + INK(g) + '" stroke="none"/><circle cx="60" cy="50" r="2.8" fill="' + INK(g) + '" stroke="none"/>' +
      '<ellipse cx="50" cy="67" rx="14" ry="9.4" fill="' + muz + '"/>' +
      '<ellipse cx="45" cy="66" rx="2.2" ry="1.7" fill="#8A5E3A" stroke="none"/><ellipse cx="55" cy="66" rx="2.2" ry="1.7" fill="#8A5E3A" stroke="none"/>' +
      '<path d="M45 74q5 3 10 0" fill="none" stroke="' + INK(g) + '" stroke-width="1.8"/>' +
      '<ellipse cx="27" cy="62" rx="3.6" ry="2.2" fill="#FFB3BC" stroke="none" opacity=".8"/>' +
      '<ellipse cx="73" cy="62" rx="3.6" ry="2.2" fill="#FFB3BC" stroke="none" opacity=".8"/>' +
      (g ? '<ellipse cx="40" cy="44" rx="8" ry="4" fill="#fff" opacity=".35" stroke="none" transform="rotate(-20 40 44)"/>' : '') +
      '</g>' };
  };

  /* 인 — 호랑이 */
  F.zTiger = function (g) {
    var m = make(g), fur = m.grad('#FFD9A2', '#F2A24E', '#D0742A'), muz = m.grad('#FFFFFF', '#FFF6EA', '#F0DDC6'),
      line = '#3A2A22';
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<circle cx="24" cy="30" r="12" fill="' + fur + '"/><circle cx="76" cy="30" r="12" fill="' + fur + '"/>' +
      '<circle cx="24" cy="30" r="5" fill="#F6B9C2" stroke="none"/><circle cx="76" cy="30" r="5" fill="#F6B9C2" stroke="none"/>' +
      zBase(g, fur, muz, 58, 25, 23) +
      '<path d="M50 36v7M42 38l-3 6M58 38l3 6M32 52l-6 3M32 60l-6 2M68 52l6 3M68 60l6 2" stroke="' + line + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="50" cy="64" rx="4" ry="3" fill="#E78A96"/>' +
      '<path d="M50 68v3M50 71c-2 2-5 1-6-1M50 71c2 2 5 1 6-1" fill="none" stroke="' + line + '" stroke-width="1.8"/>' +
      '<path d="M30 64l-8-2M30 69l-8 2M70 64l8-2M70 69l8 2" stroke="' + line + '" stroke-width="1.6"/>' +
      (g ? '<ellipse cx="42" cy="45" rx="8" ry="4" fill="#fff" opacity=".4" stroke="none" transform="rotate(-20 42 45)"/>' : '') +
      '</g>' };
  };

  /* 묘 — 토끼 */
  F.zRabbit = function (g) {
    var m = make(g), fur = m.grad('#FFFFFF', '#F7F4F0', '#DCD3CE'), muz = m.grad('#FFF9F6', '#FBE9E4', '#EED6D0'),
      ear = m.grad('#FCE4E8', '#F2C4CC', '#D89AA6');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<ellipse cx="34" cy="22" rx="8" ry="20" fill="' + ear + '" transform="rotate(-12 34 22)"/>' +
      '<ellipse cx="66" cy="22" rx="8" ry="20" fill="' + ear + '" transform="rotate(12 66 22)"/>' +
      zBase(g, fur, muz, 60, 24, 22) +
      '<path d="M46 54c2-3 6-3 8 0" fill="none" stroke="' + INK(g) + '" stroke-width="2"/>' +
      '<ellipse cx="50" cy="64" rx="3.6" ry="2.8" fill="#F08A9A"/>' +
      '<path d="M50 67v3M50 70c-2 2-5 1-6-1M50 70c2 2 5 1 6-1" fill="none" stroke="' + INK(g) + '" stroke-width="1.6"/>' +
      '<path d="M47 74v5M53 74v5" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/>' +
      '<path d="M30 62l-8-2M30 67l-8 2M70 62l8-2M70 67l8 2" stroke="#C9BDB8" stroke-width="1.6"/>' +
      '</g>' };
  };

  /* 진 — 용 */
  F.zDragon = function (g) {
    var m = make(g), fur = m.grad('#B8F0DC', '#4FB294', '#23705C'), muz = m.grad('#FFF7E2', '#F6E6C4', '#DECBA2'),
      gold = m.lin('#FFF3CC', '#EFC05B', '#C08B22'), mane = m.lin('#FFE9A8', '#F2C14E', '#C9902C');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M30 40c-7-5-9-14-4-20 1 8 4 12 9 14zM70 40c7-5 9-14 4-20-1 8-4 12-9 14z" fill="' + mane + '"/>' +
      '<path d="M40 32c-3-8-1-15 4-19 0 7 2 11 6 14zM60 32c3-8 1-15-4-19 0 7-2 11-6 14z" fill="' + mane + '"/>' +
      '<path d="M36 34c-6-4-8-12-5-17 2 6 5 9 9 10zM64 34c6-4 8-12 5-17-2 6-5 9-9 10z" fill="' + gold + '"/>' +
      '<circle cx="50" cy="58" r="25" fill="' + fur + '"/>' +
      '<ellipse cx="50" cy="67" rx="10.5" ry="7.6" fill="' + muz + '"/>' +
      '<circle cx="46.5" cy="66" r="1.7" fill="#23705C" stroke="none"/><circle cx="53.5" cy="66" r="1.7" fill="#23705C" stroke="none"/>' +
      '<circle cx="41" cy="49" r="3.4" fill="#FFFDF6" stroke="' + INK(g) + '" stroke-width="1.3"/>' +
      '<circle cx="59" cy="49" r="3.4" fill="#FFFDF6" stroke="' + INK(g) + '" stroke-width="1.3"/>' +
      '<circle cx="41" cy="49" r="1.6" fill="' + INK(g) + '" stroke="none"/><circle cx="59" cy="49" r="1.6" fill="' + INK(g) + '" stroke="none"/>' +
      '<path d="M50 71c-2 2-5 2-7 0M50 71c2 2 5 2 7 0" fill="none" stroke="' + INK(g) + '" stroke-width="1.5"/>' +
      '<path d="M40 68c-7 1-11 5-13 10M60 68c7 1 11 5 13 10" fill="none" stroke="#23705C" stroke-width="2" opacity=".7"/>' +
      '<path d="M44 76c-2 4 0 7 3 8M56 76c2 4 0 7-3 8" fill="none" stroke="#23705C" stroke-width="1.8" opacity=".55"/>' +
      '<circle cx="33" cy="60" r="2" fill="#23705C" opacity=".4" stroke="none"/><circle cx="67" cy="60" r="2" fill="#23705C" opacity=".4" stroke="none"/>' +
      (g ? '<ellipse cx="38" cy="44" rx="7" ry="4" fill="#fff" opacity=".35" stroke="none" transform="rotate(-22 38 44)"/>' : '') +
      '</g>' };
  };

  /* 사 — 뱀 */
  F.zSnake = function (g) {
    var m = make(g), fur = m.grad('#C8F0B8', '#5FAE62', '#2E6E3E'), muz = m.grad('#FFF9E8', '#F2E7C6', '#DCCBA2');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 78c-22 0-32-10-30-20 2-9 12-13 20-10 7 3 9 11 4 15-4 3-9 1-9-3" fill="none" stroke="' + fur + '" stroke-width="13"/>' +
      '<path d="M50 78c22 0 30 6 24 12-4 4-12 2-12-3" fill="none" stroke="' + fur + '" stroke-width="12"/>' +
      '<circle cx="46" cy="40" r="8" fill="#2E6E3E" opacity=".35" stroke="none"/><circle cx="58" cy="52" r="6" fill="#2E6E3E" opacity=".35" stroke="none"/>' +
      '<ellipse cx="50" cy="40" rx="23" ry="20" fill="' + fur + '"/>' +
      '<ellipse cx="50" cy="46" rx="13" ry="9" fill="' + muz + '"/>' +
      '<circle cx="41" cy="35" r="3" fill="#FFFDF6" stroke="' + INK(g) + '" stroke-width="1.4"/>' +
      '<circle cx="59" cy="35" r="3" fill="#FFFDF6" stroke="' + INK(g) + '" stroke-width="1.4"/>' +
      '<circle cx="41" cy="35" r="1.4" fill="' + INK(g) + '" stroke="none"/><circle cx="59" cy="35" r="1.4" fill="' + INK(g) + '" stroke="none"/>' +
      '<path d="M50 46v4" stroke="' + INK(g) + '" stroke-width="1.6"/>' +
      '<path d="M50 50c-2 2-4 2-6 1M50 50c2 2 4 2 6 1" fill="none" stroke="' + INK(g) + '" stroke-width="1.4"/>' +
      '<path d="M50 54v5M50 59l-4 5M50 59l4 5" fill="none" stroke="#E7373F" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M32 30c2-6 8-10 14-11M68 30c-2-6-8-10-14-11" stroke="#2E6E3E" stroke-width="2" fill="none" opacity=".45"/>' +
      '</g>' };
  };

  /* 오 — 말 */
  F.zHorse = function (g) {
    var m = make(g), fur = m.grad('#E8C9A6', '#B98A5A', '#8A5E3A'), muz = m.grad('#FFF8EC', '#F6E8D4', '#E0CBAC'),
      mane = m.lin('#8A5E3A', '#5E3E24', '#3E2A18');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M34 34c-6-8-6-16-2-20 1 7 4 11 8 13zM66 34c6-8 6-16 2-20-1 7-4 11-8 13z" fill="' + fur + '"/>' +
      '<path d="M36 34c-8 2-12 10-10 18l6-4-2 10c4-4 8-6 12-6z" fill="' + mane + '"/>' +
      zBase(g, fur, muz, 58, 24, 23) +
      '<ellipse cx="50" cy="68" rx="12" ry="9" fill="' + muz + '"/>' +
      '<ellipse cx="45" cy="67" rx="1.8" ry="1.4" fill="#6B4A3A" stroke="none"/><ellipse cx="55" cy="67" rx="1.8" ry="1.4" fill="#6B4A3A" stroke="none"/>' +
      '<path d="M45 76q5 3 10 0" fill="none" stroke="' + INK(g) + '" stroke-width="1.8"/>' +
      '<path d="M42 36c4-4 12-4 16 0" fill="none" stroke="' + mane + '" stroke-width="3"/>' +
      '<path d="M30 50c-4 4-6 10-5 16" fill="none" stroke="#5E3E24" stroke-width="2.4" opacity=".5"/>' +
      '</g>' };
  };

  /* 미 — 양 */
  F.zSheep = function (g) {
    var m = make(g), wool = m.grad('#FFFFFF', '#FFF7EB', '#E7D2BA'), face = m.grad('#FFF8EE', '#F6E8D2', '#E0C9AC'),
      horn = m.lin('#F6E2B4', '#D9B47A', '#A8804A');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<g fill="' + wool + '"><circle cx="26" cy="42" r="10"/><circle cx="32" cy="28" r="11"/><circle cx="46" cy="22" r="11"/><circle cx="60" cy="24" r="11"/><circle cx="72" cy="34" r="10"/><circle cx="76" cy="50" r="10"/><circle cx="70" cy="64" r="10"/><circle cx="58" cy="74" r="10"/><circle cx="40" cy="74" r="10"/><circle cx="28" cy="62" r="10"/><ellipse cx="50" cy="50" rx="24" ry="23"/></g>' +
      '<path d="M22 46c-8-1-12-7-10-13 3-5 9-4 11 1 1 4 1 8-1 12z" fill="' + horn + '"/>' +
      '<path d="M78 46c8-1 12-7 10-13-3-5-9-4-11 1-1 4-1 8 1 12z" fill="' + horn + '"/>' +
      '<ellipse cx="50" cy="53" rx="18" ry="16" fill="' + face + '"/>' +
      '<circle cx="43" cy="50" r="2.6" fill="' + INK(g) + '" stroke="none"/><circle cx="57" cy="50" r="2.6" fill="' + INK(g) + '" stroke="none"/>' +
      '<ellipse cx="50" cy="58" rx="4" ry="3" fill="#E78A96"/>' +
      '<path d="M50 61v2M47 64c2 2 4 2 6 0" fill="none" stroke="' + INK(g) + '" stroke-width="1.5"/>' +
      '<ellipse cx="36" cy="57" rx="3.6" ry="2.2" fill="#FFB3BC" stroke="none" opacity=".8"/>' +
      '<ellipse cx="64" cy="57" rx="3.6" ry="2.2" fill="#FFB3BC" stroke="none" opacity=".8"/>' +
      '</g>' };
  };

  /* 신 — 원숭이 */
  F.zMonkey = function (g) {
    var m = make(g), fur = m.grad('#E0B98E', '#A8784E', '#7A5232'), face = m.grad('#FFF3E2', '#F2DCC2', '#D9BE9E');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<circle cx="20" cy="52" r="11" fill="' + fur + '"/><circle cx="80" cy="52" r="11" fill="' + fur + '"/>' +
      '<circle cx="20" cy="52" r="6" fill="#F6C4AE" stroke="none"/><circle cx="80" cy="52" r="6" fill="#F6C4AE" stroke="none"/>' +
      zBase(g, fur, face, 54, 24, 23) +
      '<ellipse cx="50" cy="45" rx="16" ry="15" fill="' + face + '"/>' +
      '<path d="M34 60c4 8 12 12 16 12s12-4 16-12" fill="' + face + '" stroke="none"/>' +
      '<circle cx="43" cy="48" r="2.8" fill="' + INK(g) + '" stroke="none"/><circle cx="57" cy="48" r="2.8" fill="' + INK(g) + '" stroke="none"/>' +
      '<ellipse cx="50" cy="55" rx="3" ry="2.2" fill="#C98A6A" stroke="none"/>' +
      '<path d="M50 58v2M46 61c2 2 6 2 8 0" fill="none" stroke="' + INK(g) + '" stroke-width="1.5"/>' +
      '<path d="M34 38c4-6 12-9 16-9s12 3 16 9" fill="none" stroke="' + fur + '" stroke-width="4"/>' +
      '</g>' };
  };

  /* 유 — 닭 */
  F.zRooster = function (g) {
    var m = make(g), fur = m.grad('#FFFFFF', '#FFF6EA', '#E8D8C6'), muz = m.grad('#FFE9A8', '#F6C453', '#D89B22'),
      comb = m.lin('#FF8A82', '#D8342F', '#9E1618');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M39 41c-4-5-2-11 3-9 0-6 6-9 9-4 3-5 9-2 9 4 5-2 7 4 3 7-3 3-8 4-12 3z" fill="' + comb + '"/>' +
      '<circle cx="50" cy="57" r="23" fill="' + fur + '"/>' +
      '<circle cx="43" cy="51" r="2.9" fill="' + INK(g) + '" stroke="none"/><circle cx="57" cy="51" r="2.9" fill="' + INK(g) + '" stroke="none"/>' +
      '<path d="M60 55l9 3.6-9 4.4z" fill="' + muz + '"/>' +
      '<path d="M60 61h7" stroke="#D89B22" stroke-width="1.4" opacity=".55"/>' +
      '<ellipse cx="59.5" cy="67" rx="3" ry="4.4" fill="' + comb + '"/>' +
      '<ellipse cx="35" cy="61" rx="4" ry="2.6" fill="#FFB3BC" stroke="none" opacity=".85"/>' +
      '<path d="M39 72c4 3 12 3 16 0" fill="none" stroke="#F0DCC0" stroke-width="2.6"/>' +
      '</g>' };
  };

  /* 술 — 개 */
  F.zDog = function (g) {
    var m = make(g), fur = m.grad('#F6DCBC', '#D8AE7E', '#B07E52'), ear = m.lin('#B98A5A', '#8A5E3A', '#5E3E24'),
      muz = m.grad('#FFF8EE', '#F6E8D4', '#E0CBAC');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<ellipse cx="24" cy="50" rx="9" ry="15" fill="' + ear + '" transform="rotate(14 24 50)"/>' +
      '<ellipse cx="76" cy="50" rx="9" ry="15" fill="' + ear + '" transform="rotate(-14 76 50)"/>' +
      zBase(g, fur, muz, 56, 24, 22) +
      '<ellipse cx="50" cy="66" rx="11" ry="8" fill="' + muz + '"/>' +
      '<ellipse cx="50" cy="63" rx="4.6" ry="3.4" fill="#4A3540" stroke="none"/>' +
      '<path d="M50 66v3M50 69c-3 3-7 2-8-1M50 69c3 3 7 2 8-1" fill="none" stroke="' + INK(g) + '" stroke-width="1.8"/>' +
      '<path d="M47 74c0 3 6 3 6 0" fill="#F58B82"/>' +
      '<path d="M36 40c3-6 10-9 14-9" fill="none" stroke="#A8784E" stroke-width="2.4" opacity=".5"/>' +
      '</g>' };
  };

  /* 해 — 돼지 */
  F.zPig = function (g) {
    var m = make(g), fur = m.grad('#FFD9E0', '#FFA8BE', '#E9799A'), muz = m.grad('#FFE8EE', '#FFC6D6', '#F0A0B8'),
      ear = m.grad('#FFB6C8', '#F58FAB', '#D9567A');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<ellipse cx="29" cy="36" rx="8.5" ry="11" fill="' + ear + '" transform="rotate(-28 29 36)"/>' +
      '<ellipse cx="71" cy="36" rx="8.5" ry="11" fill="' + ear + '" transform="rotate(28 71 36)"/>' +
      '<circle cx="50" cy="59" r="24" fill="' + fur + '"/>' +
      '<circle cx="41" cy="53" r="2.9" fill="' + INK(g) + '" stroke="none"/><circle cx="59" cy="53" r="2.9" fill="' + INK(g) + '" stroke="none"/>' +
      '<ellipse cx="50" cy="66" rx="11.5" ry="8.6" fill="' + muz + '"/>' +
      '<ellipse cx="45.5" cy="66" rx="2.2" ry="3" fill="#D9567A" stroke="none"/><ellipse cx="54.5" cy="66" rx="2.2" ry="3" fill="#D9567A" stroke="none"/>' +
      '<path d="M44 76q6 4 12 0" fill="none" stroke="' + INK(g) + '" stroke-width="1.8"/>' +
      '<ellipse cx="31" cy="62" rx="4.4" ry="2.8" fill="#F06A8E" stroke="none" opacity=".55"/>' +
      '<ellipse cx="69" cy="62" rx="4.4" ry="2.8" fill="#F06A8E" stroke="none" opacity=".55"/>' +
      (g ? '<ellipse cx="40" cy="46" rx="7" ry="4" fill="#fff" opacity=".4" stroke="none" transform="rotate(-20 40 46)"/>' : '') +
      '</g>' };
  };

  /* ── 꽃 · 자연 ───────────────────────────────────────── */

  F.cherry = function (g) {
    var m = make(g), petal = m.grad('#FFEAEF', '#FFC6D6', '#F09CB4');
    var s = '';
    for (var i = 0; i < 5; i++) s += '<ellipse cx="50" cy="33" rx="10.5" ry="15" fill="' + petal + '" transform="rotate(' + (i * 72) + ' 50 50)"/>';
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round">' + s +
      '<circle cx="50" cy="50" r="6" fill="#F6C453"/>' +
      '<path d="M50 40v-3M50 60v3M40 50h-3M60 50h3" stroke="#E8A93C" stroke-width="2" stroke-linecap="round"/>' +
      '</g>' };
  };

  F.tulip = function (g) {
    var m = make(g), petal = m.grad('#FFE3EC', '#FF9DBE', '#E2608D');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 56v34" stroke="#3E8E5A" stroke-width="4"/>' +
      '<path d="M50 78c-12 2-18-4-20-12 10-2 17 3 20 12z" fill="#69B177"/>' +
      '<path d="M50 68c11 1 16-5 18-13-9-1-16 4-18 13z" fill="#69B177"/>' +
      '<path d="M30 26c0 16 8 30 20 30s20-14 20-30c-6 5-9 3-13-1-3 3-6 3-7 0-1 3-4 3-7 0-4 4-7 6-13 1z" fill="' + petal + '"/>' +
      (g ? '<ellipse cx="42" cy="38" rx="6" ry="9" fill="#fff" opacity=".35" stroke="none" transform="rotate(-20 42 38)"/>' : '') +
      '</g>' };
  };

  F.sunflower = function (g) {
    var m = make(g), petal = m.grad('#FFE9A8', '#FFC53D', '#E09312');
    var s = '';
    for (var i = 0; i < 12; i++) s += '<ellipse cx="50" cy="25" rx="6.5" ry="12" fill="' + petal + '" transform="rotate(' + (i * 30) + ' 50 50)"/>';
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round">' + s +
      '<circle cx="50" cy="50" r="16" fill="' + m.grad('#8A5A2E', '#6B4220', '#4A2B12') + '"/>' +
      '<circle cx="45" cy="46" r="1.8" fill="#D9A45B" stroke="none"/><circle cx="55" cy="45" r="1.8" fill="#D9A45B" stroke="none"/>' +
      '<circle cx="50" cy="55" r="1.8" fill="#D9A45B" stroke="none"/><circle cx="44" cy="53" r="1.6" fill="#D9A45B" stroke="none"/>' +
      '<circle cx="56" cy="54" r="1.6" fill="#D9A45B" stroke="none"/>' +
      '</g>' };
  };

  F.camellia = function (g) {
    var m = make(g), petal = m.grad('#FF8A8A', '#E7373F', '#A81621');
    var s = '';
    for (var i = 0; i < 5; i++) s += '<ellipse cx="50" cy="34" rx="12" ry="16" fill="' + petal + '" transform="rotate(' + (i * 72) + ' 50 50)"/>';
    var s2 = '';
    for (var j = 0; j < 4; j++) s2 += '<ellipse cx="50" cy="44" rx="6.5" ry="9" fill="' + petal + '" transform="rotate(' + (j * 90 + 45) + ' 50 50)"/>';
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round">' + s + s2 +
      '<circle cx="50" cy="50" r="7" fill="#F6C453"/>' +
      '<circle cx="48" cy="48" r="1.5" fill="#B98624" stroke="none"/><circle cx="53" cy="50" r="1.5" fill="#B98624" stroke="none"/>' +
      '<circle cx="49" cy="54" r="1.4" fill="#B98624" stroke="none"/>' +
      '</g>' };
  };

  F.carnation = function (g) {
    var m = make(g), petal = m.grad('#FFE0E8', '#FF9EB2', '#E4657F');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 58v32" stroke="#3E8E5A" stroke-width="4"/>' +
      '<path d="M50 76c-10 1-15-4-17-11 9-2 15 2 17 11z" fill="#69B177"/>' +
      '<path d="M38 36c-8 4-8 16 2 20 6 3 6 8 10 8s4-5 10-8c10-4 10-16 2-20-6-3-9 2-12 2s-6-5-12-2z" fill="' + petal + '"/>' +
      '<path d="M42 42c-4 3-4 9 1 11M58 42c4 3 4 9-1 11M50 40v16" stroke="#E4657F" stroke-width="2" fill="none" opacity=".65"/>' +
      '<path d="M38 50c2 6 5 9 8 10M62 50c-2 6-5 9-8 10" stroke="#E4657F" stroke-width="2" fill="none" opacity=".55"/>' +
      '</g>' };
  };

  F.leaf = function (g) {
    var m = make(g), lf = m.grad('#B7E8B9', '#69B177', '#3E8E5A');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M26 86C34 62 44 44 58 26" fill="none" stroke="#3E8E5A" stroke-width="3.6"/>' +
      '<path d="M46 52c-12-2-16-10-14-18 10-1 17 5 14 18z" fill="' + lf + '"/>' +
      '<path d="M54 38c2-12 9-16 17-14 1 10-5 16-17 14z" fill="' + lf + '"/>' +
      '<path d="M36 70c-11-1-16-7-16-14 9-2 16 3 16 14z" fill="' + lf + '"/>' +
      '<path d="M46 52l-10-12M54 38l11-9M36 70l-11-10" stroke="#2F6E46" stroke-width="1.6" fill="none" opacity=".55"/>' +
      '</g>' };
  };

  F.rainbow = function (g) {
    var m = make(g);
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linecap="round" fill="none">' +
      '<path d="M16 66c0-22 15-38 34-38s34 16 34 38" stroke="#F26D6D" stroke-width="9"/>' +
      '<path d="M22 68c0-18 12-31 28-31s28 13 28 31" stroke="#F6C453" stroke-width="8"/>' +
      '<path d="M29 70c0-13 9-23 21-23s21 10 21 23" stroke="#7FD8C0" stroke-width="8"/>' +
      '<path d="M36 72c0-9 6-16 14-16s14 7 14 16" stroke="#8FB8F2" stroke-width="7"/>' +
      '<g stroke-width="3"><circle cx="20" cy="72" r="9" fill="#FFFFFF"/><circle cx="30" cy="74" r="7" fill="#FFFFFF"/>' +
      '<circle cx="80" cy="72" r="9" fill="#FFFFFF"/><circle cx="70" cy="74" r="7" fill="#FFFFFF"/></g>' +
      '</g>' };
  };

  F.cloud = function (g) {
    var m = make(g), c = m.grad('#FFFFFF', '#F4FBFF', '#CFE4F2');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round">' +
      '<path d="M24 66c-9 0-15-6-15-14s7-14 16-13c2-9 10-15 19-13 6-8 18-8 24 1 10-1 18 5 18 14 8 1 13 6 13 12 0 8-7 13-15 13z" fill="' + c + '"/>' +
      (g ? '<ellipse cx="60" cy="40" rx="16" ry="7" fill="#fff" opacity=".7" stroke="none"/>' : '') +
      '</g>' };
  };

  F.star = function (g) {
    var m = make(g), gold = m.grad('#FFF7D2', '#FFD35E', '#E39A17');
    var pts = [], i, R = 34, r = 14.5;
    for (i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r : R;
      pts.push((50 + Math.cos(a) * rr).toFixed(1) + ',' + (52 + Math.sin(a) * rr).toFixed(1));
    }
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round">' +
      '<polygon points="' + pts.join(' ') + '" fill="' + gold + '"/>' +
      (g ? '<ellipse cx="42" cy="40" rx="7" ry="4" fill="#fff" opacity=".5" stroke="none" transform="rotate(-30 42 40)"/>' : '') +
      '</g>' };
  };

  F.moon = function (g) {
    var m = make(g), c = m.grad('#FFF9E0', '#FFEBAE', '#E7C05E');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round">' +
      '<path d="M63 12a39 39 0 1 0 0 76 31 31 0 1 1 0-76z" fill="' + c + '"/>' +
      '<circle cx="80" cy="24" r="3.4" fill="#FFF3C4" stroke="none"/><circle cx="90" cy="46" r="2.4" fill="#FFF3C4" stroke="none"/>' +
      '<circle cx="78" cy="72" r="2.8" fill="#FFF3C4" stroke="none"/>' +
      '</g>' };
  };

  /* ── 생일 · 파티 ─────────────────────────────────────── */

  F.cake = function (g) {
    var m = make(g), cream = m.grad('#FFFFFF', '#FFF6EA', '#EAD2B8'), sponge = m.lin('#FFE1B0', '#F8C98A', '#E0A563'),
      pink = m.grad('#FFD3DE', '#FFA8BE', '#E9799A');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<ellipse cx="50" cy="86" rx="36" ry="6" fill="#E6D3C4" stroke="none" opacity=".7"/>' +
      '<rect x="16" y="60" width="68" height="20" rx="5" fill="' + sponge + '"/>' +
      '<path d="M16 62c6 4 10-3 16 1s10-4 16 0 10-4 16 0 10-3 20 1v-9c0-3-2-5-5-5H21c-3 0-5 2-5 5z" fill="' + cream + '"/>' +
      '<rect x="26" y="38" width="48" height="18" rx="5" fill="' + sponge + '"/>' +
      '<path d="M26 42c5 4 9-3 14 1s9-4 14 0 9-4 14 0 8-3 12 0v-5c0-3-2-5-5-5H31c-3 0-5 2-5 5z" fill="' + pink + '"/>' +
      '<path d="M32 30v-8M44 28v-6M56 28v-6M68 30v-8" stroke="#8FB8F2" stroke-width="4"/>' +
      '<path d="M32 18c-3-4 2-6 0-9 4 2 5 6 2 9zM44 18c-3-4 2-6 0-9 4 2 5 6 2 9zM56 18c-3-4 2-6 0-9 4 2 5 6 2 9zM68 18c-3-4 2-6 0-9 4 2 5 6 2 9z" fill="#FFB23E"/>' +
      '<circle cx="30" cy="56" r="4" fill="#F26D6D"/><circle cx="50" cy="56" r="4" fill="#F26D6D"/><circle cx="70" cy="56" r="4" fill="#F26D6D"/>' +
      (g ? '<ellipse cx="34" cy="70" rx="9" ry="3.4" fill="#fff" opacity=".35" stroke="none"/>' : '') +
      '</g>' };
  };

  F.cupcake = function (g) {
    var m = make(g), cup = m.grad('#FFD9E3', '#F79EB6', '#D9668A'), fro = m.grad('#FFFFFF', '#FFF0F5', '#F3CBD9');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M30 54h40l-5 30H35z" fill="' + cup + '"/>' +
      '<path d="M40 54l-2 30M50 54v30M60 54l2 30" stroke="#C9557A" stroke-width="1.8" opacity=".55"/>' +
      '<path d="M30 54c-6-4-6-10 0-13-1-7 6-11 11-8 2-8 13-9 16-2 6-4 13 1 11 8 6 3 6 11 0 15z" fill="' + fro + '"/>' +
      '<circle cx="50" cy="22" r="6" fill="#E7373F"/>' +
      '<path d="M50 16c2-5 6-6 9-5" fill="none" stroke="#3E8E5A" stroke-width="2.2"/>' +
      '<path d="M24 40l3 4M74 38l3 3M32 26l-2 4" stroke="#F6C453" stroke-width="2.6" stroke-linecap="round"/>' +
      '</g>' };
  };

  F.balloon = function (g) {
    var m = make(g), b = m.grad('#FFC2CE', '#FF7E96', '#D64A67');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 58c-14-6-24-19-24-31 0-9 7-15 16-15 4 0 7 2 8 4 1-2 4-4 8-4 9 0 16 6 16 15 0 12-10 25-24 31z" fill="' + b + '"/>' +
      '<path d="M50 58l-4 7h8z" fill="#D64A67"/>' +
      '<path d="M50 65c-4 9 5 13 0 22" fill="none" stroke="#B98624" stroke-width="2.4"/>' +
      (g ? '<ellipse cx="38" cy="28" rx="8" ry="5" fill="#fff" opacity=".5" stroke="none" transform="rotate(-30 38 28)"/>' : '') +
      '</g>' };
  };

  F.gift = function (g) {
    var m = make(g), box = m.grad('#FFF3C9', '#F6C453', '#D08F1E'), rib = m.grad('#FF9FB0', '#F26D7D', '#C64A5B');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round">' +
      '<rect x="18" y="44" width="64" height="40" rx="4" fill="' + box + '"/>' +
      '<rect x="14" y="32" width="72" height="14" rx="4" fill="' + m.lin('#FFF6D6', '#F8CD66', '#D89B22') + '"/>' +
      '<rect x="43" y="32" width="14" height="52" fill="' + rib + '"/>' +
      '<path d="M50 32c-14 0-18-6-16-12 2-5 9-5 12 1 2 4 4 7 4 11zM50 32c14 0 18-6 16-12-2-5-9-5-12 1-2 4-4 7-4 11z" fill="' + rib + '"/>' +
      '<circle cx="50" cy="31" r="4" fill="#F26D7D"/>' +
      (g ? '<ellipse cx="30" cy="52" rx="9" ry="4" fill="#fff" opacity=".4" stroke="none"/>' : '') +
      '</g>' };
  };

  F.hat = function (g) {
    var m = make(g), c = m.grad('#B9D8FF', '#7EA9F2', '#4A6FC9');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 14L78 76H22z" fill="' + c + '"/>' +
      '<path d="M36 46h28M30 60h40" stroke="#FFFFFF" stroke-width="5" opacity=".85"/>' +
      '<circle cx="50" cy="12" r="8" fill="#FFD35E"/>' +
      '<path d="M22 76c8 5 48 5 56 0" fill="none" stroke="#3F5FA0" stroke-width="3"/>' +
      '<circle cx="50" cy="76" r="4" fill="#F26D6D"/>' +
      '</g>' };
  };

  F.candy = function (g) {
    var m = make(g), c = m.grad('#FFE0EC', '#FF9FBF', '#E1658D');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M18 34l14 16-14 16zM82 34L68 50l14 16z" fill="' + c + '"/>' +
      '<circle cx="50" cy="50" r="20" fill="' + c + '"/>' +
      '<path d="M40 38c-6 8-6 16 0 24M50 32c-8 10-8 26 0 36M60 38c6 8 6 16 0 24" fill="none" stroke="#FFFFFF" stroke-width="3" opacity=".75"/>' +
      '</g>' };
  };

  F.cookie = function (g) {
    var m = make(g), c = m.grad('#FFE4B8', '#E8B271', '#C08A4A');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round">' +
      '<circle cx="50" cy="52" r="30" fill="' + c + '"/>' +
      '<circle cx="38" cy="42" r="4" fill="#5A3A22" stroke="none"/><circle cx="58" cy="38" r="3.4" fill="#5A3A22" stroke="none"/>' +
      '<circle cx="64" cy="56" r="4.2" fill="#5A3A22" stroke="none"/><circle cx="46" cy="60" r="3.6" fill="#5A3A22" stroke="none"/>' +
      '<circle cx="42" cy="70" r="3" fill="#5A3A22" stroke="none"/><circle cx="34" cy="56" r="2.8" fill="#5A3A22" stroke="none"/>' +
      '<path d="M50 22c6 1 10 4 12 8" fill="none" stroke="#FFF1D6" stroke-width="3" opacity=".7"/>' +
      '</g>' };
  };

  F.candle = function (g) {
    var m = make(g), c = m.lin('#FFF6E6', '#F6E3C4', '#D9BE94');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<rect x="38" y="40" width="24" height="44" rx="6" fill="' + c + '"/>' +
      '<path d="M38 52c4 6-3 9 1 14s-2 8 1 12M62 56c-4 6 3 9-1 14" fill="none" stroke="#F26D6D" stroke-width="2.6" opacity=".7"/>' +
      '<path d="M50 40V30" stroke="#6B4A3A" stroke-width="2.4"/>' +
      '<path d="M50 12c7 8 9 13 5 18-2 3-8 3-10 0-4-5-2-10 5-18z" fill="#FFC24B"/>' +
      '<path d="M50 20c3 4 4 7 2 9-2 2-5 1-6-1-1-3 1-5 4-8z" fill="#FFF3C4" stroke="none"/>' +
      '</g>' };
  };

  /* ── 마음 · 선물 ─────────────────────────────────────── */

  F.heart = function (g) {
    var m = make(g), c = m.grad('#FFD3DB', '#FF6E86', '#C8324F');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round">' +
      '<path d="M50 84C34 72 16 60 16 43c0-11 8-19 18-19 7 0 12 4 16 10 4-6 9-10 16-10 10 0 18 8 18 19 0 17-18 29-34 41z" fill="' + c + '"/>' +
      (g ? '<ellipse cx="34" cy="36" rx="7" ry="10" fill="#fff" opacity=".45" stroke="none" transform="rotate(-28 34 36)"/>' : '') +
      '</g>' };
  };

  F.sparkle = function (g) {
    function sp(x, y, r, col) {
      return '<path d="M' + x + ' ' + (y - r) + 'c1.4 ' + (r * 0.52) + ' ' + (r * 0.5) + ' ' + (r * 0.98) + ' ' + (r * 0.9) + ' ' + r +
        'c-' + (r * 0.4) + ' .02 -' + (r * 0.76) + ' .38 -' + (r * 0.9) + ' ' + r + 'c-1.4 -' + (r * 0.52) + ' -' + (r * 0.5) + ' -' + (r * 0.98) + ' -' + (r * 0.9) + ' -' + r +
        'c' + (r * 0.4) + ' -.02 ' + (r * 0.76) + ' -.38 ' + (r * 0.9) + ' -' + r + 'z" fill="' + col + '"/>';
    }
    var m = make(g);
    return { d: m.defs, b: '<g>' + sp(46, 46, 30, g ? '#FFE58F' : '#FFD35E') + sp(76, 26, 12, '#FFF3C4') + sp(72, 72, 8, '#FFE58F') +
      '<circle cx="26" cy="70" r="4" fill="#FFF3C4"/>' +
      '</g>' };
  };

  F.ribbon = function (g) {
    var m = make(g), c = m.grad('#FFD9E2', '#F98BA6', '#CF5575');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 50L20 34c-6 8-4 22 4 26 8 4 20-4 26-10z" fill="' + c + '"/>' +
      '<path d="M50 50l30-16c6 8 4 22-4 26-8 4-20-4-26-10z" fill="' + c + '"/>' +
      '<path d="M44 56c-8 8-14 14-18 24 8 0 14-4 18-10 4 6 10 10 18 10-4-10-10-16-18-24z" fill="' + c + '"/>' +
      '<circle cx="50" cy="50" r="8" fill="' + m.grad('#FFE9EF', '#F98BA6', '#C64A68') + '"/>' +
      '</g>' };
  };

  F.envelope = function (g) {
    var m = make(g), c = m.grad('#FFFDF6', '#FFF3DE', '#EAD3B4');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<rect x="14" y="28" width="72" height="48" rx="5" fill="' + c + '"/>' +
      '<path d="M14 32l36 26 36-26" fill="none" stroke="#C9A97E" stroke-width="3"/>' +
      '<path d="M50 70c-7-5-12-9-12-15 0-5 4-8 8-8 2 0 3 1 4 2 1-1 2-2 4-2 4 0 8 3 8 8 0 6-5 10-12 15z" fill="#E7373F" stroke="none"/>' +
      '</g>' };
  };

  F.letter = function (g) {
    var m = make(g), c = m.grad('#FFFFFF', '#FFF8EC', '#F0DFC6');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M20 24h60v56H20z" fill="' + c + '"/>' +
      '<path d="M20 24h60v56H20z" fill="none" stroke="#D8BFA0" stroke-width="2"/>' +
      '<path d="M30 40h40M30 50h40M30 60h26" stroke="#C9B49B" stroke-width="3"/>' +
      '<path d="M64 68c-5-4-9-7-9-11 0-4 3-6 6-6 1 0 2 1 3 2 1-1 2-2 3-2 3 0 6 2 6 6 0 4-4 7-9 11z" fill="#E7373F" stroke="none"/>' +
      '</g>' };
  };

  F.coffee = function (g) {
    var m = make(g), cup = m.grad('#FFFFFF', '#F6EBDD', '#DCC7AE');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M22 44h44v20c0 10-8 16-22 16s-22-6-22-16z" fill="' + cup + '"/>' +
      '<ellipse cx="44" cy="44" rx="22" ry="6" fill="#FFFDF7"/>' +
      '<ellipse cx="44" cy="44" rx="15" ry="3.6" fill="#8A5A38"/>' +
      '<path d="M66 48c9-2 13 4 11 10-2 5-7 6-11 4" fill="none" stroke="#C9A97E" stroke-width="3.4"/>' +
      '<path d="M22 80h48" stroke="#C9A97E" stroke-width="3"/>' +
      '<path d="M34 34c-4-4 3-6 0-11M46 32c-4-4 3-6 0-11" fill="none" stroke="' + (g ? '#FFFFFF' : '#C9B89C') + '" stroke-width="3"/>' +
      '<path d="M56 30c6-3 11-1 13 3" fill="none" stroke="#69B177" stroke-width="3"/>' +
      '</g>' };
  };

  F.bouquet = function (g) {
    var m = make(g), wrap = m.grad('#FFF6E8', '#F2DFC6', '#D8BE9C');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M34 56L28 88h44l-6-32z" fill="' + wrap + '"/>' +
      '<path d="M34 56l16 32 16-32" fill="none" stroke="#C9A97E" stroke-width="2.4"/>' +
      '<path d="M42 54c-10 0-16-7-16-16 0-7 5-12 11-12 4 0 7 2 9 5 2-3 5-5 9-5 6 0 11 5 11 12 0 9-6 16-16 16z" fill="' + m.grad('#FFE0E8', '#FF9EB2', '#E4657F') + '" transform="translate(-12 -8)"/>' +
      '<path d="M52 46c-8 0-14-6-14-14 0-6 4-10 9-10 3 0 6 2 7 4 2-2 4-4 7-4 5 0 9 4 9 10 0 8-6 14-14 14z" fill="' + m.grad('#FFF3D6', '#F6C453', '#D89B22') + '" transform="translate(14 -16)"/>' +
      '<path d="M46 50c-6 0-11-4-11-10 0-5 3-8 7-8 2 0 4 1 5 3 1-2 3-3 5-3 4 0 7 3 7 8 0 6-5 10-13 10z" fill="#FFFFFF" transform="translate(6 6)"/>' +
      '<path d="M40 64c-8-3-12-9-11-15 6 0 11 5 11 15zM60 64c8-3 12-9 11-15-6 0-11 5-11 15z" fill="#69B177"/>' +
      '</g>' };
  };

  F.crown = function (g) {
    var m = make(g), gold = m.lin('#FFF2C4', '#F5C85F', '#C99A2C');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M18 72l6-34 16 16 10-24 10 24 16-16 6 34z" fill="' + gold + '"/>' +
      '<path d="M18 72h64" stroke="#B98624" stroke-width="3"/>' +
      '<circle cx="50" cy="66" r="5" fill="#E7373F"/><circle cx="34" cy="68" r="4" fill="#7EA9F2"/><circle cx="66" cy="68" r="4" fill="#7FD8C0"/>' +
      '<circle cx="50" cy="38" r="3.4" fill="#FFF3C4"/>' +
      (g ? '<ellipse cx="34" cy="52" rx="6" ry="4" fill="#fff" opacity=".45" stroke="none" transform="rotate(-30 34 52)"/>' : '') +
      '</g>' };
  };

  F.hydrangea = function (g) {
    var m = make(g), p1 = m.grad('#DCEBFF', '#9BC1EE', '#6E96D8'), p2 = m.grad('#F2E4FF', '#C8B4F0', '#9C86D8');
    function floret(x, y, r, col) {
      var s = '';
      for (var i = 0; i < 4; i++) {
        s += '<ellipse cx="' + x + '" cy="' + (y - r * .62).toFixed(1) + '" rx="' + (r * .46).toFixed(1) + '" ry="' + (r * .56).toFixed(1) +
          '" fill="' + col + '" transform="rotate(' + (i * 90) + ' ' + x + ' ' + y + ')"/>';
      }
      return '<g>' + s + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * .2).toFixed(1) + '" fill="#FFF7D6" stroke="none"/></g>';
    }
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round">' +
      '<path d="M50 74c0 10-2 16-6 22" fill="none" stroke="#3E8E5A" stroke-width="3.6"/>' +
      '<path d="M50 82c-10 2-16-2-18-9 9-1 15 3 18 9zM50 88c9 1 14-3 16-9-8-1-13 3-16 9z" fill="#69B177"/>' +
      floret(50, 40, 15, p1) + floret(28, 52, 13, p2) + floret(72, 52, 13, p1) +
      floret(40, 66, 12, p2) + floret(62, 66, 12, p1) + floret(50, 22, 12, p2) +
      '</g>' };
  };

  F.maple = function (g) {
    var m = make(g), c = m.grad('#FFC98F', '#F0653A', '#B8321C');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 88V56M50 56L34 40 26 46 24 30 12 22l14-6 6-12 10 8 8-14 8 14 10-8 6 12 14 6-12 8-2 16-8-6-16 16z" fill="' + c + '"/>' +
      '<path d="M50 56V30M50 42l-10-8M50 42l10-8M50 54l-8 8M50 54l8 8" stroke="#8A2A16" stroke-width="2" opacity=".55" fill="none"/>' +
      (g ? '<ellipse cx="40" cy="34" rx="7" ry="4" fill="#fff" opacity=".3" stroke="none" transform="rotate(-25 40 34)"/>' : '') +
      '</g>' };
  };

  F.hamster = function (g) {
    var m = make(g), fur = m.grad('#FFF3D9', '#F6DCAE', '#DDB77C'), belly = m.grad('#FFFFFF', '#FFF9EC', '#F0DFC4'),
      ear = m.grad('#FBE4D4', '#F3C7B4', '#D9A08C');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<circle cx="28" cy="32" r="9" fill="' + ear + '"/><circle cx="72" cy="32" r="9" fill="' + ear + '"/>' +
      '<circle cx="28" cy="32" r="4" fill="#F6B9C2" stroke="none"/><circle cx="72" cy="32" r="4" fill="#F6B9C2" stroke="none"/>' +
      '<ellipse cx="50" cy="56" rx="27" ry="25" fill="' + fur + '"/>' +
      '<ellipse cx="50" cy="66" rx="17" ry="13" fill="' + belly + '" stroke="none" opacity=".85"/>' +
      '<circle cx="40" cy="50" r="3" fill="' + INK(g) + '" stroke="none"/><circle cx="60" cy="50" r="3" fill="' + INK(g) + '" stroke="none"/>' +
      '<ellipse cx="50" cy="60" rx="3.2" ry="2.4" fill="#E78A96" stroke="none"/>' +
      '<path d="M50 62v3M50 65c-2 2-5 1-6-1M50 65c2 2 5 1 6-1" fill="none" stroke="' + INK(g) + '" stroke-width="1.6"/>' +
      '<ellipse cx="33" cy="58" rx="6" ry="4" fill="#FFB3BC" stroke="none" opacity=".8"/>' +
      '<ellipse cx="67" cy="58" rx="6" ry="4" fill="#FFB3BC" stroke="none" opacity=".8"/>' +
      '<path d="M24 54l-7-2M24 59l-7 2M76 54l7-2M76 59l7 2" stroke="' + (g ? 'rgba(120,90,60,.45)' : '#B98A5A') + '" stroke-width="1.8"/>' +
      '<ellipse cx="40" cy="78" rx="6" ry="4" fill="' + belly + '"/><ellipse cx="60" cy="78" rx="6" ry="4" fill="' + belly + '"/>' +
      (g ? '<ellipse cx="42" cy="40" rx="9" ry="5" fill="#fff" opacity=".45" stroke="none" transform="rotate(-20 42 40)"/>' : '') +
      '</g>' };
  };

  F.tag = function (g) {
    var m = make(g), c = m.lin('#FFFDF6', '#FFF3DE', '#E8D3B4'), cord = m.lin('#C9A06E', '#8A5E3A', '#5E3E24');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M28 16h44c4 0 8 4 8 8v52c0 4-4 8-8 8H28c-4 0-8-4-8-8V24c0-4 4-8 8-8z" fill="' + c + '" transform="rotate(-6 50 50)"/>' +
      '<circle cx="50" cy="27" r="4.6" fill="#FFFDF6" stroke="#B98A5A" stroke-width="2" transform="rotate(-6 50 50)"/>' +
      '<path d="M50 22c-6-6-14-8-20-6" fill="none" stroke="' + cord + '" stroke-width="2.6"/>' +
      '<path d="M33 46h34M33 56h34M33 66h22" stroke="#C9A97E" stroke-width="3" opacity=".8" transform="rotate(-6 50 50)"/>' +
      '</g>' };
  };

  F.tape = function (g) {
    var m = make(g), c = m.lin('#FFF6D6', '#F6D48A', '#DDAE45');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M12 62L62 12h26L38 62z" fill="' + c + '"/>' +
      '<path d="M20 54L56 18M30 62L66 26M42 62L78 26M54 62L88 28" stroke="#E8A93C" stroke-width="2.2" opacity=".45"/>' +
      '<path d="M12 62l6 6 4-7 5 7 4-6" fill="' + c + '"/>' +
      '<path d="M20 70l56-56" stroke="rgba(255,255,255,.6)" stroke-width="1.6"/>' +
      '</g>' };
  };

  F.badge = function (g) {
    var m = make(g), gold = m.lin('#FFF2C4', '#F5C85F', '#C99A2C'), red = m.lin('#FF9E96', '#D8342F', '#9E1618');
    var star = '';
    for (var i = 0; i < 10; i++) {
      var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 5 : 11;
      star += (50 + Math.cos(a) * rr).toFixed(1) + ',' + (50 + Math.sin(a) * rr).toFixed(1) + ' ';
    }
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M36 66L30 92l14-6 6 8 6-8 14 6-6-26z" fill="' + red + '"/>' +
      '<circle cx="50" cy="44" r="25" fill="' + gold + '"/>' +
      '<circle cx="50" cy="44" r="19" fill="none" stroke="#B98624" stroke-width="1.6" opacity=".55"/>' +
      '<polygon points="' + star + '" fill="#B98624" opacity=".85"/>' +
      '<path d="M36 30c5-8 14-11 22-9" stroke="#FFFFFF" stroke-width="3" opacity=".5" fill="none"/>' +
      '</g>' };
  };

  F.fireworks = function (g) {
    var m = make(g), cols = ['#FFD35E', '#FF8FA8', '#8FB8F2', '#7FD8C0', '#C8B4F0'];
    var s = '';
    for (var i = 0; i < 16; i++) {
      var a = i * Math.PI / 8, r1 = 14, r2 = i % 2 ? 30 : 36;
      s += '<path d="M' + (50 + Math.cos(a) * r1).toFixed(1) + ' ' + (50 + Math.sin(a) * r1).toFixed(1) + 'L' +
        (50 + Math.cos(a) * r2).toFixed(1) + ' ' + (50 + Math.sin(a) * r2).toFixed(1) + '" stroke="' + cols[i % 5] + '" stroke-width="3.4" stroke-linecap="round"/>';
    }
    var sp = '';
    [[50, 16], [82, 50], [50, 84], [18, 50]].forEach(function (p) {
      sp += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="2.6" fill="#FFF3C4"/>';
    });
    return { d: m.defs, b: '<g stroke-linejoin="round">' + s + sp +
      '<circle cx="50" cy="50" r="10" fill="#FFE9A8" opacity=".8"/></g>' };
  };

  F.bubbleHeart = function (g) {
    var m = make(g), c = m.grad('#FFFFFF', '#FFF6F8', '#F2DCE4');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 78C36 68 18 56 18 40c0-11 8-19 18-19 6 0 11 3 14 8 3-5 8-8 14-8 10 0 18 8 18 19 0 16-18 28-32 38z" fill="' + c + '"/>' +
      '<path d="M50 78l-4 10 10-6" fill="' + c + '"/>' +
      '</g>' };
  };

  F.clover = function (g) {
    var m = make(g), c = m.grad('#D8F5D8', '#79C97F', '#3E8E5A');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M50 54c-3-10-14-12-18-5-4 6 2 14 12 13-6 8-3 18 5 19 8 1 12-9 6-16 10 1 16-7 12-13-4-7-15-5-18 5z" fill="' + c + '"/>' +
      '<path d="M50 54c0 10 3 20 9 30" fill="none" stroke="#3E8E5A" stroke-width="3"/>' +
      '</g>' };
  };

  /* ── 동물 ────────────────────────────────────────────── */

  F.bear = function (g) {
    var m = make(g), fur = m.grad('#F6D9B8', '#D8A87A', '#B07E52'), muz = m.grad('#FFF1DE', '#F8E2C6', '#E3C5A2');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<circle cx="26" cy="32" r="12" fill="' + fur + '"/><circle cx="74" cy="32" r="12" fill="' + fur + '"/>' +
      '<circle cx="26" cy="32" r="6" fill="#F6BFC4" stroke="none"/><circle cx="74" cy="32" r="6" fill="#F6BFC4" stroke="none"/>' +
      '<circle cx="50" cy="54" r="30" fill="' + fur + '"/>' +
      '<ellipse cx="50" cy="62" rx="19" ry="15" fill="' + muz + '"/>' +
      '<circle cx="40" cy="48" r="3.2" fill="' + INK(g) + '" stroke="none"/><circle cx="60" cy="48" r="3.2" fill="' + INK(g) + '" stroke="none"/>' +
      '<ellipse cx="50" cy="58" rx="4.4" ry="3.4" fill="' + INK(g) + '" stroke="none"/>' +
      '<path d="M50 61v4M50 65c-3 3-7 2-8-1M50 65c3 3 7 2 8-1" fill="none" stroke="' + INK(g) + '" stroke-width="2"/>' +
      '<ellipse cx="30" cy="60" rx="5" ry="3.2" fill="#F6A9B0" stroke="none" opacity=".8"/>' +
      '<ellipse cx="70" cy="60" rx="5" ry="3.2" fill="#F6A9B0" stroke="none" opacity=".8"/>' +
      (g ? '<ellipse cx="38" cy="36" rx="9" ry="5" fill="#fff" opacity=".35" stroke="none" transform="rotate(-18 38 36)"/>' : '') +
      '</g>' };
  };

  F.rabbit = function (g) {
    var m = make(g), fur = m.grad('#FFFFFF', '#FFF7F2', '#EDD8D2');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<ellipse cx="36" cy="28" rx="8" ry="22" fill="' + fur + '"/><ellipse cx="64" cy="28" rx="8" ry="22" fill="' + fur + '"/>' +
      '<ellipse cx="36" cy="28" rx="3.6" ry="15" fill="#F8C3CC" stroke="none"/><ellipse cx="64" cy="28" rx="3.6" ry="15" fill="#F8C3CC" stroke="none"/>' +
      '<ellipse cx="50" cy="56" rx="26" ry="24" fill="' + fur + '"/>' +
      '<circle cx="41" cy="52" r="3.2" fill="' + INK(g) + '" stroke="none"/><circle cx="59" cy="52" r="3.2" fill="' + INK(g) + '" stroke="none"/>' +
      '<path d="M47 60q3 3 6 0" fill="none" stroke="' + INK(g) + '" stroke-width="2"/>' +
      '<ellipse cx="50" cy="58" rx="3" ry="2.4" fill="#F08A9A" stroke="none"/>' +
      '<path d="M22 56l-8-2M22 61l-8 3M78 56l8-2M78 61l8 3" stroke="' + (g ? 'rgba(120,90,90,.5)' : '#B99A94') + '" stroke-width="2"/>' +
      '<ellipse cx="33" cy="62" rx="4.6" ry="3" fill="#F8B6BF" stroke="none" opacity=".85"/>' +
      '<ellipse cx="67" cy="62" rx="4.6" ry="3" fill="#F8B6BF" stroke="none" opacity=".85"/>' +
      '</g>' };
  };

  F.chick = function (g) {
    var m = make(g), y = m.grad('#FFF6C4', '#FFD95E', '#E8A81E');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M48 22c-2-6 2-10 6-12-1 5 0 8 3 10" fill="#FFD95E"/>' +
      '<circle cx="50" cy="56" r="28" fill="' + y + '"/>' +
      '<circle cx="40" cy="50" r="3.2" fill="' + INK(g) + '" stroke="none"/><circle cx="60" cy="50" r="3.2" fill="' + INK(g) + '" stroke="none"/>' +
      '<path d="M44 58h12l-6 7z" fill="#F59A2E"/>' +
      '<path d="M26 62c-5 6-3 12 2 12 4 0 6-4 4-8" fill="' + y + '"/>' +
      '<path d="M46 84v5M46 89h-5M54 84v5M54 89h5" stroke="#F59A2E" stroke-width="2.6"/>' +
      '<ellipse cx="32" cy="58" rx="4.6" ry="3" fill="#F6A9B0" stroke="none" opacity=".8"/>' +
      '<ellipse cx="68" cy="58" rx="4.6" ry="3" fill="#F6A9B0" stroke="none" opacity=".8"/>' +
      '</g>' };
  };

  F.cat = function (g) {
    var m = make(g), fur = m.grad('#FFF3E4', '#F6D3AE', '#D8A87A');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M24 36L26 12l20 14h8l20-14 2 24" fill="' + fur + '"/>' +
      '<path d="M30 30l2-12 12 9M70 30l-2-12-12 9" fill="#F8C3CC" stroke="none"/>' +
      '<ellipse cx="50" cy="55" rx="28" ry="25" fill="' + fur + '"/>' +
      '<path d="M36 47c2-3 6-3 8 0M56 47c2-3 6-3 8 0" fill="none" stroke="' + INK(g) + '" stroke-width="2.6"/>' +
      '<path d="M47 57h6l-3 4z" fill="#F08A9A"/>' +
      '<path d="M50 61c0 3-3 4-5 3M50 61c0 3 3 4 5 3" fill="none" stroke="' + INK(g) + '" stroke-width="1.8"/>' +
      '<path d="M22 55l-9-3M22 61l-9 2M78 55l9-3M78 61l9 2" stroke="' + (g ? 'rgba(120,90,90,.5)' : '#B99A94') + '" stroke-width="2"/>' +
      '<ellipse cx="34" cy="60" rx="4.4" ry="3" fill="#F6A9B0" stroke="none" opacity=".8"/>' +
      '<ellipse cx="66" cy="60" rx="4.4" ry="3" fill="#F6A9B0" stroke="none" opacity=".8"/>' +
      '</g>' };
  };

  /* ── 말풍선 · 배너 ───────────────────────────────────── */

  F.bubbleRound = function (g) {
    var m = make(g), c = m.grad('#FFFFFF', '#FFF9F0', '#EFDCC8');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M14 34c0-10 8-18 18-18h36c10 0 18 8 18 18v20c0 10-8 18-18 18H44L28 86l2-14h-8c-10 0-18-8-18-18z" fill="' + c + '"/>' +
      '</g>' };
  };
  F.bubbleCloud = function (g) {
    var m = make(g), c = m.grad('#FFFFFF', '#FFF9F0', '#EFDCC8');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M18 46c-8-4-8-14 0-18 0-8 10-12 16-8 4-8 16-8 20 0 8-3 16 2 15 9 8 2 9 12 2 16 2 9-8 15-15 11H46l-10 12 1-12z" fill="' + c + '"/>' +
      '<path d="M22 46c-1 10 8 16 16 13" fill="none" stroke="' + (g ? 'rgba(120,90,70,.3)' : '#C9A97E') + '" stroke-width="2"/>' +
      '</g>' };
  };
  F.bubbleRect = function (g) {
    var m = make(g), c = m.grad('#FFFDF6', '#FFF4DE', '#EBD4B6');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<rect x="12" y="22" width="76" height="48" rx="8" fill="' + c + '"/>' +
      '<path d="M38 70l6 14 6-14z" fill="' + c + '"/>' +
      '</g>' };
  };
  F.banner = function (g) {
    var m = make(g), c = m.lin('#FFF3D6', '#F6D48A', '#DDAE45');
    return { d: m.defs, b: '<g ' + OUT(g) + ' stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M8 30h84l-8 14 8 14H8l8-14z" fill="' + c + '"/>' +
      '<path d="M14 38h72M14 52h72" stroke="#B98624" stroke-width="1.6" opacity=".5" stroke-dasharray="3 4"/>' +
      '</g>' };
  };

  /* ── 목록 ────────────────────────────────────────────── */

  var META = [
    /* 새해 · 설날 (한국) 16 */
    { k: 'sheep', n: '양 얼굴', c: 'newyear', s: 0.30 },
    { k: 'sheepFull', n: '양', c: 'newyear', s: 0.32 },
    { k: 'sheepHanbok', n: '한복 양', c: 'newyear', s: 0.34 },
    { k: 'pouch', n: '복주머니', c: 'newyear', s: 0.24 },
    { k: 'coin', n: '엽전', c: 'newyear', s: 0.18 },
    { k: 'tteokguk', n: '떡국', c: 'newyear', s: 0.28 },
    { k: 'cheongsachorong', n: '청사초롱', c: 'newyear', s: 0.26 },
    { k: 'magpie', n: '까치', c: 'newyear', s: 0.28 },
    { k: 'pine', n: '소나무', c: 'newyear', s: 0.32 },
    { k: 'plum', n: '매화', c: 'newyear', s: 0.30 },
    { k: 'hanok', n: '한옥 처마', c: 'newyear', s: 0.34 },
    { k: 'window', n: '창호지 창', c: 'newyear', s: 0.30 },
    { k: 'saekdong', n: '색동', c: 'newyear', s: 0.30 },
    { k: 'norigae', n: '노리개', c: 'newyear', s: 0.20 },
    { k: 'sunrise', n: '해돋이', c: 'newyear', s: 0.32 },
    { k: 'kite', n: '방패연', c: 'newyear', s: 0.30 },
    { k: 'pouchSaekdong', n: '색동 복주머니', c: 'newyear', s: 0.26 },
    { k: 'pouchGold', n: '금빛 복주머니', c: 'newyear', s: 0.26 },

    /* 십이지신 12 */
    { k: 'zRat', n: '쥐(자)', c: 'zodiac', s: 0.30 },
    { k: 'zOx', n: '소(축)', c: 'zodiac', s: 0.30 },
    { k: 'zTiger', n: '호랑이(인)', c: 'zodiac', s: 0.30 },
    { k: 'zRabbit', n: '토끼(묘)', c: 'zodiac', s: 0.30 },
    { k: 'zDragon', n: '용(진)', c: 'zodiac', s: 0.30 },
    { k: 'zSnake', n: '뱀(사)', c: 'zodiac', s: 0.30 },
    { k: 'zHorse', n: '말(오)', c: 'zodiac', s: 0.30 },
    { k: 'zSheep', n: '양(미)', c: 'zodiac', s: 0.30 },
    { k: 'zMonkey', n: '원숭이(신)', c: 'zodiac', s: 0.30 },
    { k: 'zRooster', n: '닭(유)', c: 'zodiac', s: 0.30 },
    { k: 'zDog', n: '개(술)', c: 'zodiac', s: 0.30 },
    { k: 'zPig', n: '돼지(해)', c: 'zodiac', s: 0.30 },

    /* 크리스마스 15 */
    { k: 'xmasTree', n: '크리스마스 트리', c: 'xmas', s: 0.34 },
    { k: 'snowman', n: '눈사람', c: 'xmas', s: 0.32 },
    { k: 'santaHat', n: '산타 모자', c: 'xmas', s: 0.26 },
    { k: 'reindeer', n: '루돌프', c: 'xmas', s: 0.30 },
    { k: 'giftBox', n: '선물 상자', c: 'xmas', s: 0.26 },
    { k: 'wreath', n: '리스', c: 'xmas', s: 0.30 },
    { k: 'bell', n: '종', c: 'xmas', s: 0.24 },
    { k: 'snowflake', n: '눈송이', c: 'xmas', s: 0.22 },
    { k: 'candyCane', n: '사탕지팡이', c: 'xmas', s: 0.26 },
    { k: 'stocking', n: '양말', c: 'xmas', s: 0.24 },
    { k: 'holly', n: '호랑가시', c: 'xmas', s: 0.24 },
    { k: 'mug', n: '코코아', c: 'xmas', s: 0.24 },
    { k: 'gingerbread', n: '진저 쿠키', c: 'xmas', s: 0.24 },
    { k: 'lights', n: '전구 줄', c: 'xmas', s: 0.30 },
    { k: 'mitten', n: '벙어리장갑', c: 'xmas', s: 0.24 },

    /* 꽃 · 자연 10 */
    { k: 'cherry', n: '벚꽃', c: 'flower', s: 0.20 },
    { k: 'tulip', n: '튤립', c: 'flower', s: 0.22 },
    { k: 'sunflower', n: '해바라기', c: 'flower', s: 0.24 },
    { k: 'camellia', n: '동백', c: 'flower', s: 0.22 },
    { k: 'carnation', n: '카네이션', c: 'flower', s: 0.22 },
    { k: 'hydrangea', n: '수국', c: 'flower', s: 0.26 },
    { k: 'maple', n: '단풍잎', c: 'flower', s: 0.24 },
    { k: 'leaf', n: '잎', c: 'flower', s: 0.22 },
    { k: 'cloud', n: '구름', c: 'flower', s: 0.24 },
    { k: 'rainbow', n: '무지개', c: 'flower', s: 0.32 },

    /* 별 · 반짝이 5 */
    { k: 'star', n: '별', c: 'star', s: 0.18 },
    { k: 'sparkle', n: '반짝이', c: 'star', s: 0.18 },
    { k: 'sparkler', n: '불꽃', c: 'star', s: 0.22 },
    { k: 'moon', n: '달', c: 'star', s: 0.22 },
    { k: 'fireworks', n: '불꽃놀이', c: 'star', s: 0.26 },

    /* 마음 · 선물 7 */
    { k: 'heart', n: '하트', c: 'heart', s: 0.20 },
    { k: 'envelope', n: '봉투', c: 'heart', s: 0.24 },
    { k: 'letter', n: '편지', c: 'heart', s: 0.26 },
    { k: 'coffee', n: '커피', c: 'heart', s: 0.22 },
    { k: 'bouquet', n: '꽃다발', c: 'heart', s: 0.28 },
    { k: 'clover', n: '네잎클로버', c: 'heart', s: 0.18 },
    { k: 'bubbleHeart', n: '하트 말풍선', c: 'heart', s: 0.30 },

    /* 리본 · 장식 6 */
    { k: 'ribbon', n: '리본', c: 'ribbon', s: 0.24 },
    { k: 'banner', n: '리본 배너', c: 'ribbon', s: 0.34 },
    { k: 'crown', n: '왕관', c: 'ribbon', s: 0.22 },
    { k: 'tag', n: '종이 태그', c: 'ribbon', s: 0.24 },
    { k: 'tape', n: '마스킹 테이프', c: 'ribbon', s: 0.26 },
    { k: 'badge', n: '훈장 배지', c: 'ribbon', s: 0.24 },

    /* 생일 · 파티 8 */
    { k: 'cake', n: '케이크', c: 'party', s: 0.30 },
    { k: 'cupcake', n: '컵케이크', c: 'party', s: 0.24 },
    { k: 'balloon', n: '풍선', c: 'party', s: 0.24 },
    { k: 'gift', n: '선물', c: 'party', s: 0.24 },
    { k: 'hat', n: '파티모자', c: 'party', s: 0.22 },
    { k: 'candy', n: '사탕', c: 'party', s: 0.18 },
    { k: 'cookie', n: '쿠키', c: 'party', s: 0.18 },
    { k: 'candle', n: '초', c: 'party', s: 0.16 },

    /* 동물 5 */
    { k: 'bear', n: '곰', c: 'animal', s: 0.28 },
    { k: 'rabbit', n: '토끼', c: 'animal', s: 0.28 },
    { k: 'chick', n: '병아리', c: 'animal', s: 0.24 },
    { k: 'cat', n: '고양이', c: 'animal', s: 0.28 },
    { k: 'hamster', n: '햄스터', c: 'animal', s: 0.28 },

    /* 말풍선 2 */
    { k: 'bubbleRound', n: '둥근 말풍선', c: 'bubble', s: 0.34 },
    { k: 'bubbleCloud', n: '구름 말풍선', c: 'bubble', s: 0.32 },
    { k: 'bubbleRect', n: '네모 말풍선', c: 'bubble', s: 0.34 }
  ];

  var MAP = {};
  META.forEach(function (m) { MAP[m.k] = m; });

  var CATS = [
    { k: 'all', n: '전체' },
    { k: 'newyear', n: '새해·설날' },
    { k: 'zodiac', n: '십이지신' },
    { k: 'xmas', n: '크리스마스' },
    { k: 'flower', n: '꽃·자연' },
    { k: 'star', n: '별·반짝이' },
    { k: 'heart', n: '마음·선물' },
    { k: 'ribbon', n: '리본·장식' },
    { k: 'party', n: '생일·파티' },
    { k: 'animal', n: '동물' },
    { k: 'bubble', n: '말풍선' }
  ];

  function inner(key, gloss) {
    var f = F[key];
    if (!f) return { d: '', b: '' };
    var r = f(!!gloss);
    return { d: Array.isArray(r.d) ? r.d.join('') : (r.d || ''), b: r.b || '' };
  }

  var SVGCACHE = {};
  window.WC_STICKERS = {
    meta: META,
    cats: CATS,
    map: MAP,
    inner: inner,
    svg: function (key, gloss) {
      var ck = key + '|' + (gloss ? 1 : 0);
      if (SVGCACHE[ck]) return SVGCACHE[ck];
      var r = inner(key, gloss);
      var shadow = gloss ? '<filter id="ds" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="2.2" stdDeviation="2.2" flood-color="#3B2340" flood-opacity=".3"/></filter>' : '';
      var out = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">' +
        '<defs>' + r.d + '</defs>' + shadow +
        '<g' + (gloss ? ' filter="url(#ds)"' : '') + '>' + r.b + '</g></svg>';
      SVGCACHE[ck] = out;
      return out;
    }
  };
})();
