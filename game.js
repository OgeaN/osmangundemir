/* ============================================================
   "Defend Your Stack" — mini space shooter
   Shoot the FAKE tags (not mine). Never shoot MY real skills.
   HTML5 Canvas · vanilla JS · touch + mouse + keyboard
   ============================================================ */
(function () {
  "use strict";

  var host = document.getElementById("gameHost");
  if (!host) return;

  var L = (document.documentElement.lang === "en") ? "en" : "tr";
  var TALL = {
    tr: {
      hint: "GERÇEK bilgilerimi VURMA · SAHTE olanları VUR",
      move: "← → hareket · BOŞLUK ateş · (mobilde dokun = nişan al + ateş)",
      score: "SKOR", lives: "CAN", best: "REKOR",
      start: "▶ BAŞLA", again: "↻ TEKRAR DENE",
      over: "GAME OVER", win: "CV KORUNDU!",
      hitMine: "Kendi bilgini vurdun!", missFake: "Sahte bilgi geçti!",
      combo: "KOMBO"
    },
    en: {
      hint: "Do NOT shoot my REAL facts · SHOOT the FALSE ones",
      move: "← → move · SPACE fire · (tap on mobile = aim + fire)",
      score: "SCORE", lives: "LIVES", best: "BEST",
      start: "▶ START", again: "↻ TRY AGAIN",
      over: "GAME OVER", win: "CV DEFENDED!",
      hitMine: "You shot your own fact!", missFake: "A false fact got through!",
      combo: "COMBO"
    }
  };
  var T = TALL[L];

  // Everything TRUE about Osman (must NOT be shot) vs FALSE / not-mine (must be shot).
  // Bilingual: tech names stay identical; worded facts change with language.
  var DATA = {
    tr: {
      real: [
        "Osman Gündemir", "Bilgisayar Müh.", "Konya Teknik Üni.", "GPA 3.61", "Konya, TR",
        "AvioTest", "Aselsan", "Atiker", "Berka Software", "Freelance", "VR Simülasyon",
        "Türkçe", "İngilizce B1",
        "Unity", "C#", "FastAPI", "Python", "PyTorch", "HTC Vive", "URP",
        "MongoDB", "Firebase", "Railway", "XR Toolkit", "Git", "Flutter"
      ],
      fake: [
        "PHP developer", "10 yıl deneyim", "Boğaziçi Üni.", "GPA 2.10", "Makine Müh.",
        "Almanca C2", "Google'da çalıştım", "Fransızca",
        "PHP", "jQuery", "WordPress", "Excel VBA", "COBOL", "Flash",
        "IE6", "Delphi", "FoxPro", "Perl", "Comic Sans"
      ]
    },
    en: {
      real: [
        "Osman Gündemir", "Computer Eng.", "Konya Tech Uni.", "GPA 3.61", "Konya, TR",
        "AvioTest", "Aselsan", "Atiker", "Berka Software", "Freelance", "VR Simulation",
        "Turkish", "English B1",
        "Unity", "C#", "FastAPI", "Python", "PyTorch", "HTC Vive", "URP",
        "MongoDB", "Firebase", "Railway", "XR Toolkit", "Git", "Flutter"
      ],
      fake: [
        "PHP developer", "10 yrs experience", "Boğaziçi Uni.", "GPA 2.10", "Mechanical Eng.",
        "German C2", "Worked at Google", "French",
        "PHP", "jQuery", "WordPress", "Excel VBA", "COBOL", "Flash",
        "IE6", "Delphi", "FoxPro", "Perl", "Comic Sans"
      ]
    }
  };
  var REAL = DATA[L].real, FAKE = DATA[L].fake;

  var COL = {
    bg: "#06080D", grid: "rgba(86,212,221,.05)",
    ship: "#56D4DD", bullet: "#7EE787", real: "#7EE787", fake: "#FF6B9D",
    ink: "#C9D1E4", dim: "#6B7488", pink: "#FF6B9D", green: "#7EE787", cyan: "#56D4DD", yellow: "#E3B341"
  };

  // profile photo used as the player "ship"
  var photo = new Image(), photoReady = false;
  photo.onload = function () { photoReady = true; };
  photo.src = "assets/img/headshot.jpg";

  var canvas = document.createElement("canvas");
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "Space shooter mini game");
  host.appendChild(canvas);
  var ctx = canvas.getContext("2d");

  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = 0, H = 0;
  function resize() {
    var r = host.getBoundingClientRect();
    W = Math.max(320, r.width);
    H = Math.max(360, r.height);
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  new ResizeObserver(resize).observe(host);
  resize();

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- state ----------
  var STATE = "menu"; // menu | play | over
  var ship, bullets, tags, particles, stars;
  var score, lives, best, combo, spawnT, speedMul, msg, msgT, frame;
  try { best = parseInt(localStorage.getItem("og_game_best") || "0", 10); } catch (e) { best = 0; }

  function reset() {
    ship = { x: W / 2, y: 0, w: 34, h: 26, cd: 0 };
    bullets = []; tags = []; particles = [];
    stars = [];
    for (var i = 0; i < 60; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, z: Math.random() * 2 + .3 });
    score = 0; lives = 3; combo = 0; spawnT = 0; speedMul = 1; msg = ""; msgT = 0; frame = 0;
  }

  function start() { reset(); STATE = "play"; }

  // init arrays so the menu can render stars before first play
  reset();

  // debug: ?autostart begins immediately, ?seed forces a few tags (for screenshots/tests)
  try {
    var qs = new URLSearchParams(location.search);
    if (qs.has("autostart") || qs.has("seed")) start();
    if (qs.has("seed")) { for (var q = 0; q < 3; q++) { spawnTag(); if (tags[q]) tags[q].y = 90 + q * 150; } }
  } catch (e) {}

  // ---------- input ----------
  var keys = {};
  window.addEventListener("keydown", function (e) {
    if (["ArrowLeft", "ArrowRight", " ", "Spacebar"].indexOf(e.key) >= 0) e.preventDefault();
    keys[e.key] = true;
    if ((e.key === " " || e.key === "Enter") && STATE !== "play") start();
  });
  window.addEventListener("keyup", function (e) { keys[e.key] = false; });

  var pointerX = null, firing = false;
  function localX(clientX) { return clientX - host.getBoundingClientRect().left; }
  canvas.addEventListener("pointerdown", function (e) {
    if (STATE !== "play") { start(); return; }
    pointerX = localX(e.clientX); firing = true;
    canvas.setPointerCapture && canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", function (e) { if (pointerX !== null) pointerX = localX(e.clientX); });
  window.addEventListener("pointerup", function () { firing = false; pointerX = null; });

  // ---------- helpers ----------
  function spawnTag() {
    // cap how many tags can be on screen at once so it never gets crowded
    if (tags.length >= 3) return;

    var isFake = Math.random() < 0.5;
    var label = (isFake ? FAKE : REAL)[Math.floor(Math.random() * (isFake ? FAKE : REAL).length)];
    ctx.font = "600 14px 'Cascadia Code',Consolas,monospace";
    var tw = Math.max(54, ctx.measureText(label).width + 22);

    // pick an x that doesn't overlap existing tags near the top (no side-by-side clutter)
    var x, tries = 0, ok;
    do {
      x = Math.random() * (W - tw - 20) + 10 + tw / 2;
      ok = true;
      for (var i = 0; i < tags.length; i++) {
        var o = tags[i];
        // if another tag is still near the top, keep horizontal distance
        if (o.y < 120 && Math.abs(o.x - x) < (o.w + tw) / 2 + 40) { ok = false; break; }
      }
      tries++;
    } while (!ok && tries < 14);
    if (!ok) return; // couldn't find a clear lane this time — skip, spawns next cycle

    tags.push({
      x: x, y: -20, w: tw, h: 30, label: label, fake: isFake,
      vy: (0.5 + Math.random() * 0.3) * speedMul, dead: false, hitFlash: 0
    });
  }
  function boom(x, y, color, n) {
    for (var i = 0; i < n; i++) particles.push({
      x: x, y: y, vx: (Math.random() - .5) * 4, vy: (Math.random() - .5) * 4,
      life: 1, color: color
    });
  }
  function flash(text) { msg = text; msgT = 90; }
  function loseLife(text) {
    lives--; combo = 0; flash(text);
    if (!reduce) { /* screen shake handled in draw via msgT */ }
    if (lives <= 0) {
      STATE = "over";
      if (score > best) { best = score; try { localStorage.setItem("og_game_best", String(best)); } catch (e) {} }
    }
  }

  // ---------- update ----------
  function update() {
    frame++;
    ship.y = H - 46;

    // move — pointer snaps the ship straight to the tapped X (no sliding),
    // so bullets always leave from where you're actually aiming.
    var sp = 5;
    if (keys["ArrowLeft"]) ship.x -= sp;
    if (keys["ArrowRight"]) ship.x += sp;
    if (pointerX !== null) ship.x = pointerX;
    ship.x = Math.max(ship.w / 2, Math.min(W - ship.w / 2, ship.x));

    // fire — bullet always spawns from the ship's CURRENT (post-move) position
    ship.cd--;
    var wantFire = keys[" "] || keys["Spacebar"] || firing;
    if (wantFire && ship.cd <= 0) {
      var glyphs = ["</>", "{}", "0", "1", ";", "()"];
      bullets.push({ x: ship.x, y: ship.y - 16, vy: -4.2, g: glyphs[Math.floor(Math.random() * glyphs.length)], rot: (Math.random() - .5) * 0.4 });
      ship.cd = 11;
    }

    // difficulty ramp — gentle: slower fall, slower ramp, longer gaps between spawns
    speedMul = 1 + Math.min(score / 900, 1.0);
    spawnT--;
    if (spawnT <= 0) { spawnTag(); spawnT = Math.max(55, 105 - score / 20); }

    // bullets
    for (var i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y += bullets[i].vy;
      if (bullets[i].y < -10) bullets.splice(i, 1);
    }

    // tags
    for (var t = tags.length - 1; t >= 0; t--) {
      var tag = tags[t];
      tag.y += tag.vy;
      if (tag.hitFlash > 0) tag.hitFlash--;

      // bullet collision
      for (var b = bullets.length - 1; b >= 0; b--) {
        var bl = bullets[b];
        if (bl.x > tag.x - tag.w / 2 - 6 && bl.x < tag.x + tag.w / 2 + 6 && bl.y > tag.y - tag.h / 2 - 6 && bl.y < tag.y + tag.h / 2 + 6) {
          bullets.splice(b, 1);
          if (tag.fake) {
            // correct: destroyed a fake tag
            combo++; var gain = 10 + Math.min(combo, 10) * 2;
            score += gain;
            boom(tag.x, tag.y, COL.fake, 14);
            tag.dead = true;
          } else {
            // wrong: shot a real skill
            boom(tag.x, tag.y, COL.yellow, 10);
            tag.dead = true;
            loseLife(T.hitMine);
          }
          break;
        }
      }

      if (tag.dead) { tags.splice(t, 1); continue; }

      // reached bottom
      if (tag.y - tag.h / 2 > H) {
        tags.splice(t, 1);
        if (tag.fake) {
          // missed a fake -> it got through
          loseLife(T.missFake);
        } else {
          // real skill safely passed -> small reward
          score += 2;
        }
      }
    }

    // particles
    for (var p = particles.length - 1; p >= 0; p--) {
      var pr = particles[p];
      pr.x += pr.vx; pr.y += pr.vy; pr.vy += 0.05; pr.life -= 0.03;
      if (pr.life <= 0) particles.splice(p, 1);
    }

    // stars
    for (var s = 0; s < stars.length; s++) {
      stars[s].y += stars[s].z * 0.6 * speedMul;
      if (stars[s].y > H) { stars[s].y = -2; stars[s].x = Math.random() * W; }
    }

    if (msgT > 0) msgT--;
  }

  // ---------- draw ----------
  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function drawShip() {
    var x = ship.x, y = ship.y;
    ctx.save();
    ctx.translate(x, y);

    // thruster flame (behind)
    if (frame % 6 < 3) {
      ctx.fillStyle = COL.pink;
      ctx.beginPath(); ctx.moveTo(-6, 12); ctx.lineTo(6, 12); ctx.lineTo(0, 26 + Math.random() * 5); ctx.closePath(); ctx.fill();
    }

    var R = 18;
    if (photo && photoReady) {
      // profile photo in a glowing circle = the "hero ship"
      ctx.shadowColor = COL.cyan; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.closePath();
      ctx.fillStyle = "#0B0E14"; ctx.fill();
      ctx.shadowBlur = 0;
      ctx.save();
      ctx.beginPath(); ctx.arc(0, 0, R - 2, 0, Math.PI * 2); ctx.closePath(); ctx.clip();
      ctx.drawImage(photo, -R + 2, -R + 2, (R - 2) * 2, (R - 2) * 2);
      ctx.restore();
      // ring
      ctx.lineWidth = 2; ctx.strokeStyle = COL.cyan;
      ctx.beginPath(); ctx.arc(0, 0, R - 1, 0, Math.PI * 2); ctx.stroke();
      // little fins so it still reads as a ship
      ctx.fillStyle = COL.cyan;
      ctx.beginPath(); ctx.moveTo(-R + 2, 6); ctx.lineTo(-R - 6, 14); ctx.lineTo(-R + 2, 14); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(R - 2, 6); ctx.lineTo(R + 6, 14); ctx.lineTo(R - 2, 14); ctx.closePath(); ctx.fill();
    } else {
      // fallback: cyan arrow ship
      ctx.shadowColor = COL.cyan; ctx.shadowBlur = 14;
      ctx.fillStyle = COL.ship;
      ctx.beginPath();
      ctx.moveTo(0, -16); ctx.lineTo(15, 12); ctx.lineTo(5, 8); ctx.lineTo(0, 14);
      ctx.lineTo(-5, 8); ctx.lineTo(-15, 12); ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  function drawTag(tag) {
    var col = tag.fake ? COL.fake : COL.real;
    ctx.save();
    ctx.globalAlpha = 1;
    roundRect(tag.x - tag.w / 2, tag.y - tag.h / 2, tag.w, tag.h, 8);
    ctx.fillStyle = tag.fake ? "rgba(255,107,157,.12)" : "rgba(126,231,135,.12)";
    ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = col; ctx.stroke();
    ctx.fillStyle = col;
    ctx.font = "600 14px 'Cascadia Code',Consolas,monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(tag.label, tag.x, tag.y + 1);
    // marker: X = shoot, ✓ = protect
    ctx.font = "700 11px 'Cascadia Code',monospace";
    ctx.fillText(tag.fake ? "✕" : "✓", tag.x, tag.y - tag.h / 2 - 8);
    ctx.restore();
  }

  var CV_TEXT = {
    tr: [
      "OSMAN GÜNDEMİR", "Yazılım Geliştirici · Bilgisayar Mühendisi",
      "osmangundemir1@gmail.com", "─────────────────────",
      "EĞİTİM", "Konya Teknik Üniversitesi", "Bilgisayar Mühendisliği · GPA 3.61 / 4.00", "2021 – 2025",
      "─────────────────────", "DENEYİM",
      "AvioTest — Freelance Unity & Backend Developer",
      "Aselsan Konya — Unity Developer (Simülasyon)",
      "Atiker Software — Stajyer AI Developer",
      "Berka Software — Stajyer Mobil Oyun Developer",
      "─────────────────────", "YETENEKLER",
      "Unity · C# · URP · FastAPI · Python · PyTorch",
      "HTC Vive · XR Toolkit · Firebase · MongoDB · Git",
      "─────────────────────", "DİLLER", "Türkçe (ana dil) · İngilizce (B1)"
    ],
    en: [
      "OSMAN GÜNDEMİR", "Software Developer · Computer Engineer",
      "osmangundemir1@gmail.com", "─────────────────────",
      "EDUCATION", "Konya Technical University", "B.Sc. Computer Engineering · GPA 3.61 / 4.00", "2021 – 2025",
      "─────────────────────", "EXPERIENCE",
      "AvioTest — Freelance Unity & Backend Developer",
      "Aselsan Konya — Unity Developer (Simulation)",
      "Atiker Software — Intern AI Developer",
      "Berka Software — Intern Mobile Game Developer",
      "─────────────────────", "SKILLS",
      "Unity · C# · URP · FastAPI · Python · PyTorch",
      "HTC Vive · XR Toolkit · Firebase · MongoDB · Git",
      "─────────────────────", "LANGUAGES", "Turkish (native) · English (B1)"
    ]
  };
  var CV_LINES = CV_TEXT[L];
  var cvScroll = 0;
  function drawCVBackdrop() {
    cvScroll += 0.25;
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "#56D4DD";
    ctx.font = "12px 'Cascadia Code',Consolas,monospace";
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    var lh = 26, total = CV_LINES.length * lh;
    var off = cvScroll % total;
    for (var i = -1; i < CV_LINES.length + 2; i++) {
      var y = i * lh - off + (H - total) / 2 * 0 + 20;
      // wrap so it loops
      var yy = ((y % total) + total) % total;
      ctx.fillText(CV_LINES[(i + CV_LINES.length) % CV_LINES.length], 24, yy);
    }
    ctx.restore();
  }

  function draw() {
    // bg
    ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H);
    // faint scrolling CV backdrop (atmosphere, very subtle)
    drawCVBackdrop();
    // stars
    for (var s = 0; s < stars.length; s++) {
      ctx.globalAlpha = 0.3 + stars[s].z * 0.3;
      ctx.fillStyle = "#9fb0c8";
      ctx.fillRect(stars[s].x, stars[s].y, stars[s].z, stars[s].z);
    }
    ctx.globalAlpha = 1;

    if (STATE === "menu") { drawCenter(T.start, T.hint, T.move); return; }

    // particles
    for (var p = 0; p < particles.length; p++) {
      ctx.globalAlpha = Math.max(0, particles[p].life);
      ctx.fillStyle = particles[p].color;
      ctx.fillRect(particles[p].x, particles[p].y, 3, 3);
    }
    ctx.globalAlpha = 1;

    // bullets — little code glyphs flying up
    ctx.fillStyle = COL.bullet; ctx.shadowColor = COL.bullet; ctx.shadowBlur = 8;
    ctx.font = "700 15px 'Cascadia Code',Consolas,monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (var b = 0; b < bullets.length; b++) {
      var bu = bullets[b];
      ctx.save();
      ctx.translate(bu.x, bu.y); ctx.rotate(bu.rot || 0);
      ctx.fillText(bu.g || "</>", 0, 0);
      ctx.restore();
    }
    ctx.shadowBlur = 0;

    for (var t = 0; t < tags.length; t++) drawTag(tags[t]);
    drawShip();

    // HUD
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.font = "600 13px 'Cascadia Code',Consolas,monospace";
    ctx.fillStyle = COL.dim;
    ctx.fillText(T.score + " ", 12, 12);
    ctx.fillStyle = COL.green;
    ctx.fillText(String(score), 12 + ctx.measureText(T.score + " ").width, 12);
    // lives (right)
    ctx.textAlign = "right";
    ctx.fillStyle = COL.dim; ctx.fillText(T.lives + " ", W - 12 - lifeIconsWidth(), 12);
    for (var i = 0; i < 3; i++) {
      ctx.fillStyle = i < lives ? COL.pink : "rgba(255,107,157,.2)";
      var lx = W - 12 - (2 - i) * 20 - 12;
      ctx.beginPath(); // heart-ish triangle ship
      ctx.moveTo(lx, 14); ctx.lineTo(lx + 12, 14); ctx.lineTo(lx + 6, 26); ctx.closePath(); ctx.fill();
    }
    // combo
    if (combo >= 3) {
      ctx.textAlign = "center"; ctx.fillStyle = COL.yellow;
      ctx.font = "700 13px 'Cascadia Code',monospace";
      ctx.fillText(T.combo + " x" + combo, W / 2, 12);
    }

    // toast message
    if (msgT > 0) {
      ctx.textAlign = "center"; ctx.globalAlpha = Math.min(1, msgT / 30);
      ctx.fillStyle = COL.pink; ctx.font = "700 15px 'Cascadia Code',monospace";
      ctx.fillText(msg, W / 2, H - 74);
      ctx.globalAlpha = 1;
    }

    if (STATE === "over") {
      ctx.fillStyle = "rgba(6,8,13,.82)"; ctx.fillRect(0, 0, W, H);
      drawCenter(T.again, T.over + "  ·  " + T.score + " " + score, T.best + " " + best, true);
    }
  }

  function lifeIconsWidth() { return 3 * 20 + 6; }

  function drawCenter(btn, line1, line2, isOver) {
    ctx.textAlign = "center";
    ctx.fillStyle = isOver ? COL.pink : COL.cyan;
    ctx.font = "700 26px 'Cascadia Code',Consolas,monospace";
    ctx.textBaseline = "middle";
    ctx.fillText(isOver ? T.over : "DEFEND YOUR STACK", W / 2, H / 2 - 44);

    ctx.fillStyle = COL.ink; ctx.font = "600 14px 'Cascadia Code',monospace";
    ctx.fillText(line1, W / 2, H / 2 - 8);
    ctx.fillStyle = COL.dim; ctx.font = "13px 'Cascadia Code',monospace";
    ctx.fillText(line2, W / 2, H / 2 + 16);

    // button
    var bw = Math.max(160, ctx.measureText(btn).width + 40), bh = 44;
    roundRect(W / 2 - bw / 2, H / 2 + 44, bw, bh, 10);
    ctx.fillStyle = COL.cyan; ctx.fill();
    ctx.fillStyle = "#04252b"; ctx.font = "700 15px 'Cascadia Code',monospace";
    ctx.fillText(btn, W / 2, H / 2 + 44 + bh / 2 + 1);
  }

  // ---------- loop ----------
  function loop() {
    if (STATE === "play") update();
    draw();
    requestAnimationFrame(loop);
  }
  loop();

  // allow language switch to update labels live if user toggles
  window.__gameSetLang = function (lang) {
    L = (lang === "en") ? "en" : "tr";
    T = TALL[L];
    REAL = DATA[L].real; FAKE = DATA[L].fake;
    CV_LINES = CV_TEXT[L];
    // relabel any tags currently on screen so they switch language too
    for (var i = 0; i < tags.length; i++) {
      var pool = tags[i].fake ? FAKE : REAL;
      tags[i].label = pool[Math.floor(Math.random() * pool.length)];
    }
  };
})();
