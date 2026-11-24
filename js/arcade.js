/**
 * OfficeQuest 13 — Arcade Mini-Game Category & Leaderboard
 * หมวดมินิเกมส์ท้าประลอง "Office Rush (60 วินาที)" พร้อมระบบเหรียญตราและตารางคะแนน
 */

window.ArcadeModule = (() => {
  let timerId = null;
  let state = null;
  let leaderboardTab = "arcade"; // 'arcade' | 'xp'

  function stopTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function getArcadeBadges() {
    return window.GAME_DATA.badges.filter(b => b.id.startsWith("arcade_"));
  }

  function renderAvatarHtml(avatarId, size = 36) {
    const av = window.GAME_DATA.avatars.find(a => a.id === avatarId) || window.GAME_DATA.avatars[0];
    const inner = av.img
      ? `<img src="${av.img}" alt="${av.label}" class="avatar-img" loading="lazy" />`
      : av.emoji;
    return `<div class="hud-avatar" style="width:${size}px; height:${size}px; font-size:${Math.round(size * 0.5)}px; background:${av.bg}">${inner}</div>`;
  }

  function renderLeaderboardHtml(activePlayer) {
    const players = App.getAllPlayers().slice();
    const sorted = leaderboardTab === "arcade"
      ? players.sort((a, b) => ((b.arcade?.bestScore || 0) - (a.arcade?.bestScore || 0)) || ((b.xp || 0) - (a.xp || 0)))
      : players.sort((a, b) => ((b.xp || 0) - (a.xp || 0)) || ((b.arcade?.bestScore || 0) - (a.arcade?.bestScore || 0)));

    const medals = ["🥇", "🥈", "🥉"];

    return `
      <div class="card leaderboard-card">
        <div class="leaderboard-header">
          <div>
            <h3 style="font-size:19px; margin-bottom:2px;">🏆 ตารางคะแนนจัดอันดับ (Leaderboard)</h3>
            <p style="font-size:13px; color:var(--text-muted);">เปรียบเทียบคะแนนสูงสุดของผู้เล่นทั้งหมดที่บันทึกในเครื่องนี้ (${players.length} คน)</p>
          </div>
          <div class="avatar-filter-tabs">
            <button type="button" class="avatar-filter-btn ${leaderboardTab === "arcade" ? "active" : ""}" onclick="ArcadeModule.setLeaderboardTab('arcade')">🕹️ มินิเกมส์</button>
            <button type="button" class="avatar-filter-btn ${leaderboardTab === "xp" ? "active" : ""}" onclick="ArcadeModule.setLeaderboardTab('xp')">⚡ คะแนน XP รวม</button>
          </div>
        </div>

        ${sorted.length === 0 ? `
          <div style="text-align:center; padding:28px; color:var(--text-muted);">ยังไม่มีข้อมูลผู้เล่นในตารางคะแนน</div>
        ` : `
          <div style="overflow-x:auto;">
            <table class="leaderboard-table">
              <thead>
                <tr>
                  <th style="width:64px; text-align:center;">อันดับ</th>
                  <th>ผู้เล่น</th>
                  <th>ระดับชั้น</th>
                  <th style="text-align:center;">คะแนนสูงสุด</th>
                  <th style="text-align:center;">คอมโบสูงสุด</th>
                  <th style="text-align:center;">XP รวม</th>
                  <th style="text-align:center;">เหรียญตรา</th>
                </tr>
              </thead>
              <tbody>
                ${sorted.map((pl, idx) => {
                  const isMe = activePlayer && pl.id === activePlayer.id;
                  const rankBadge = idx < 3 ? `<span class="lb-medal">${medals[idx]}</span>` : `<span class="lb-rank-num">#${idx + 1}</span>`;
                  const bestScore = pl.arcade?.bestScore || 0;
                  const bestCombo = pl.arcade?.bestCombo || 0;
                  const totalBadges = window.GAME_DATA.badges.length;
                  const arcadeBadgesCount = (pl.badges || []).filter(id => id.startsWith("arcade_")).length;
                  return `
                    <tr class="${isMe ? "lb-row-me" : ""}">
                      <td style="text-align:center;">${rankBadge}</td>
                      <td>
                        <div style="display:flex; align-items:center; gap:10px;">
                          ${renderAvatarHtml(pl.avatarId, 36)}
                          <div>
                            <div style="font-weight:700; font-size:14px;">
                              ${pl.name} ${isMe ? `<span class="lb-me-pill">คุณ</span>` : ""}
                            </div>
                            <div style="font-size:11px; color:var(--text-muted);">รหัส ${pl.studentId}${pl.department ? ` • ${pl.department}` : ""}</div>
                          </div>
                        </div>
                      </td>
                      <td style="font-size:13px; color:var(--text-muted);">${pl.classRoom || "-"}</td>
                      <td style="text-align:center;">
                        <span class="lb-score-val">${bestScore.toLocaleString()}</span>
                      </td>
                      <td style="text-align:center; font-weight:700; color:#ea580c;">
                        ${bestCombo > 0 ? `🔥 x${bestCombo}` : "-"}
                      </td>
                      <td style="text-align:center; font-weight:700; color:var(--primary);">
                        ⚡ ${pl.xp || 0}
                      </td>
                      <td style="text-align:center; font-size:12px;">
                        <span class="mini-pill ${arcadeBadgesCount === 3 ? "ok" : ""}">🏅 ${(pl.badges || []).length}/${totalBadges}</span>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;
  }

  function renderBadgesStrip(player) {
    const arcadeBadges = getArcadeBadges();
    return `
      <div class="arcade-badges-strip">
        ${arcadeBadges.map(b => {
          const unlocked = (player.badges || []).includes(b.id);
          return `
            <div class="arcade-badge-pill ${unlocked ? "unlocked" : "locked"}">
              <div class="ab-icon">${b.icon}</div>
              <div>
                <div class="ab-title">${b.title}</div>
                <div class="ab-desc">${b.desc}</div>
              </div>
              <span class="mini-pill ${unlocked ? "ok" : ""}" style="margin-left:auto; flex-shrink:0;">
                ${unlocked ? "✓ ได้รับแล้ว" : "🔒 ล็อก"}
              </span>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderLobby(container) {
    stopTimer();
    state = null;
    const p = App.getActivePlayer();
    if (!p) return App.navigate("welcome");
    const stats = p.arcade || { bestScore: 0, bestCombo: 0, plays: 0, lastScore: 0 };

    container.innerHTML = `
      <div style="margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <button class="btn btn-outline btn-sm" onclick="App.navigate('dashboard')">← กลับแผนที่ภารกิจ</button>
        <span class="badge-pill">🎮 หมวดมินิเกมส์ท้าประลอง • Office Arcade</span>
      </div>

      <div class="arcade-hero">
        <div>
          <span class="hero-tag" style="margin-bottom:8px;">⚡ SPEED CHALLENGE • 60 วินาที</span>
          <h2 style="font-size:28px; margin-bottom:6px;">Office Rush: ท้าประลองเครื่องใช้สำนักงาน</h2>
          <p style="opacity:0.92; font-size:14px; max-width:580px;">
            ตอบคำถามสถานการณ์และอุปกรณ์สำนักงานให้เร็วและแม่นยำภายใน <strong>60 วินาที</strong>! ตอบถูกต่อเนื่องเพื่อสะสม <strong>Combo คูณคะแนน</strong> เก็บเหรียญตราพิเศษ และขึ้นอันดับ 1 บนตารางคะแนน
          </p>
          <div class="arcade-rules-row">
            <span>⏱️ เวลา 60 วินาที</span>
            <span>❤️ พลังชีวิต 3 ดวง</span>
            <span>🔥 Combo สูงสุด x4</span>
            <span>⚡ โบนัสสูงสุด +80 XP</span>
          </div>
        </div>
        <div class="arcade-start-box">
          <div style="font-size:12px; opacity:0.85;">สถิติสูงสุดของคุณ</div>
          <div style="font-family:var(--font-head); font-size:36px; font-weight:800; line-height:1.1;">${stats.bestScore.toLocaleString()}</div>
          <div style="font-size:12px; opacity:0.85; margin-bottom:14px;">🔥 คอมโบสูงสุด x${stats.bestCombo} • เล่นแล้ว ${stats.plays} รอบ</div>
          <button class="btn btn-warning" style="width:100%; font-size:16px; padding:12px 22px;" onclick="ArcadeModule.startGame()">🚀 เริ่มเกมส์เลย!</button>
        </div>
      </div>

      <div style="margin-bottom:22px;">
        <h3 style="font-size:17px; margin-bottom:10px;">🏅 เหรียญตราประจำหมวดมินิเกมส์ (3 เหรียญ)</h3>
        ${renderBadgesStrip(p)}
      </div>

      ${renderLeaderboardHtml(p)}
    `;
  }

  function startGame() {
    SoundFX.click();
    stopTimer();
    const pool = shuffle(window.GAME_DATA.arcadeQuestions || []);
    state = {
      pool,
      index: 0,
      score: 0,
      combo: 0,
      bestCombo: 0,
      correctCount: 0,
      totalAnswered: 0,
      lives: 3,
      timeLeft: 60,
      questionStartTime: Date.now(),
      locked: false
    };
    renderGameView();
    timerId = setInterval(() => {
      if (!state) return stopTimer();
      state.timeLeft--;
      const timerEl = document.getElementById("arcade-timer-val");
      const barEl = document.getElementById("arcade-time-bar");
      if (timerEl) {
        timerEl.textContent = `${state.timeLeft}s`;
        timerEl.style.color = state.timeLeft <= 10 ? "#ef4444" : "";
      }
      if (barEl) {
        barEl.style.width = `${Math.max(0, (state.timeLeft / 60) * 100)}%`;
        barEl.style.background = state.timeLeft <= 10 ? "#ef4444" : "linear-gradient(90deg, #4f46e5, #0ea5e9)";
      }
      if (state.timeLeft <= 0) {
        finishGame("หมดเวลา 60 วินาที!");
      }
    }, 1000);
  }

  function getMultiplier(combo) {
    if (combo >= 8) return 4;
    if (combo >= 5) return 3;
    if (combo >= 2) return 2;
    return 1;
  }

  function renderGameView() {
    const main = document.getElementById("app-main");
    if (!state) return renderLobby(main);

    // Reshuffle if player goes through all 24 questions
    if (state.index >= state.pool.length) {
      state.pool = shuffle(window.GAME_DATA.arcadeQuestions || []);
      state.index = 0;
    }

    const item = state.pool[state.index];
    const mult = getMultiplier(state.combo);
    const hearts = "❤️".repeat(state.lives) + "🖤".repeat(3 - state.lives);
    state.questionStartTime = Date.now();
    state.locked = false;

    main.innerHTML = `
      <div class="arcade-play-wrap">
        <div class="arcade-hud">
          <div class="arcade-hud-item">
            <span class="ah-lbl">⭐ คะแนน</span>
            <span class="ah-val" id="arcade-score-val">${state.score.toLocaleString()}</span>
          </div>
          <div class="arcade-hud-item">
            <span class="ah-lbl">🔥 คอมโบ</span>
            <span class="ah-val" style="color:#ea580c;">x${state.combo} <small style="font-size:12px;">(คูณ ${mult})</small></span>
          </div>
          <div class="arcade-hud-item">
            <span class="ah-lbl">❤️ พลังชีวิต</span>
            <span class="ah-val" style="font-size:18px;">${hearts}</span>
          </div>
          <div class="arcade-hud-item">
            <span class="ah-lbl">⏱️ เวลาที่เหลือ</span>
            <span class="ah-val" id="arcade-timer-val" style="${state.timeLeft <= 10 ? "color:#ef4444;" : ""}">${state.timeLeft}s</span>
          </div>
          <button class="btn btn-outline btn-sm" onclick="ArcadeModule.quitGame()">✖ ออก</button>
        </div>

        <div class="arcade-time-track">
          <div id="arcade-time-bar" class="arcade-time-fill" style="width:${(state.timeLeft / 60) * 100}%;"></div>
        </div>

        <div class="card arcade-q-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <span class="badge-pill">${item.tag}</span>
            <span style="font-size:13px; color:var(--text-muted); font-weight:600;">ข้อที่ ${state.totalAnswered + 1}</span>
          </div>

          <div class="arcade-q-icon">${item.icon}</div>
          <h3 class="arcade-q-text">${item.q}</h3>

          <div class="arcade-options-grid">
            ${item.options.map((opt, idx) => `
              <button type="button" class="arcade-opt-btn" data-idx="${idx}" onclick="ArcadeModule.answer(${idx})">
                <span class="arcade-opt-key">${["ก", "ข", "ค", "ง"][idx]}</span>
                <span>${opt}</span>
              </button>
            `).join("")}
          </div>

          <div id="arcade-feedback" class="arcade-feedback"></div>
        </div>
      </div>
    `;
  }

  function answer(idx) {
    if (!state || state.locked) return;
    state.locked = true;

    const item = state.pool[state.index];
    const isCorrect = idx === item.answer;
    const elapsedSec = (Date.now() - state.questionStartTime) / 1000;
    state.totalAnswered++;

    const btns = document.querySelectorAll(".arcade-opt-btn");
    btns.forEach((b, i) => {
      b.disabled = true;
      if (i === item.answer) b.classList.add("correct");
      else if (i === idx && !isCorrect) b.classList.add("wrong");
    });

    const fb = document.getElementById("arcade-feedback");
    if (isCorrect) {
      SoundFX.correct();
      state.correctCount++;
      state.combo++;
      if (state.combo > state.bestCombo) state.bestCombo = state.combo;
      const mult = getMultiplier(state.combo);
      const speedBonus = Math.max(10, Math.round((8 - Math.min(8, elapsedSec)) * 10));
      const gained = (100 + speedBonus) * mult;
      state.score += gained;
      if (fb) {
        fb.innerHTML = `<span style="color:#059669; font-weight:700;">✅ ถูกต้อง! +${gained} คะแนน (Speed +${speedBonus} × Combo ${mult})</span>`;
      }
      const scoreEl = document.getElementById("arcade-score-val");
      if (scoreEl) scoreEl.textContent = state.score.toLocaleString();
    } else {
      SoundFX.wrong();
      state.combo = 0;
      state.lives--;
      if (fb) {
        fb.innerHTML = `<span style="color:#dc2626; font-weight:700;">❌ ยังไม่ถูก! เฉลย: ${item.options[item.answer]}</span>`;
      }
    }

    setTimeout(() => {
      if (!state) return;
      if (state.lives <= 0) {
        finishGame("พลังชีวิตหมดแล้ว!");
      } else {
        state.index++;
        renderGameView();
      }
    }, 650);
  }

  function finishGame(reason) {
    stopTimer();
    const final = state;
    state = null;
    if (!final) return;

    const result = App.recordArcadeResult({
      score: final.score,
      bestCombo: final.bestCombo,
      correctCount: final.correctCount,
      totalAnswered: final.totalAnswered
    });

    SoundFX.levelUp();
    const main = document.getElementById("app-main");
    const p = App.getActivePlayer();

    main.innerHTML = `
      <div style="margin-bottom:14px;">
        <button class="btn btn-outline btn-sm" onclick="ArcadeModule.render(document.getElementById('app-main'))">← กลับหน้าหมวดมินิเกมส์</button>
      </div>

      <div class="card arcade-result-card">
        <div style="font-size:56px; margin-bottom:6px;">${final.score >= 1000 ? "🏆" : final.score >= 500 ? "🎉" : "🕹️"}</div>
        <div class="badge-pill" style="margin-bottom:8px; display:inline-block;">${reason}</div>
        <h2 style="font-size:28px; color:var(--primary); margin-bottom:4px;">สรุปผลคะแนน Office Rush</h2>
        ${result.isNewRecord ? `<div class="new-record-pill">🌟 สถิติสูงสุดใหม่ (NEW HIGH SCORE!)</div>` : ""}

        <div class="arcade-result-grid">
          <div class="ar-stat">
            <div class="ar-val" style="color:var(--primary);">${final.score.toLocaleString()}</div>
            <div class="ar-lbl">คะแนนรอบนี้</div>
          </div>
          <div class="ar-stat">
            <div class="ar-val" style="color:#ea580c;">🔥 x${final.bestCombo}</div>
            <div class="ar-lbl">คอมโบสูงสุด</div>
          </div>
          <div class="ar-stat">
            <div class="ar-val" style="color:#059669;">${final.correctCount}/${final.totalAnswered}</div>
            <div class="ar-lbl">ตอบถูกต้อง</div>
          </div>
          <div class="ar-stat">
            <div class="ar-val" style="color:#d97706;">+${result.xpEarned} XP</div>
            <div class="ar-lbl">รางวัลประสบการณ์</div>
          </div>
        </div>

        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:20px;">
          <button class="btn btn-primary" onclick="ArcadeModule.startGame()">🔄 เล่นอีกครั้งทำลายสถิติ</button>
          <button class="btn btn-outline" onclick="App.navigate('dashboard')">🗺️ กลับแผนที่ภารกิจ</button>
        </div>
      </div>

      <div style="margin:22px 0;">
        <h3 style="font-size:17px; margin-bottom:10px;">🏅 เหรียญตราประจำหมวดมินิเกมส์</h3>
        ${renderBadgesStrip(p)}
      </div>

      ${renderLeaderboardHtml(p)}
    `;
  }

  function quitGame() {
    SoundFX.click();
    stopTimer();
    state = null;
    renderLobby(document.getElementById("app-main"));
  }

  function setLeaderboardTab(tab) {
    SoundFX.click();
    leaderboardTab = tab;
    const main = document.getElementById("app-main");
    if (main && !state) renderLobby(main);
  }

  return {
    render: renderLobby,
    startGame,
    answer,
    quitGame,
    stopTimer,
    setLeaderboardTab
  };
})();
