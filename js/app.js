// OfficeQuest 13 — Main Application Controller

window.App = (function () {
  const STORAGE_KEY = "officequest13_players_v1";
  const ACTIVE_KEY = "officequest13_active_id";
  const THEME_KEY = "officequest13_theme_v1";
  const COURSE_SETTINGS_KEY = "officequest13_course_settings_v1";

  let players = [];
  let activePlayerId = null;
  let currentView = "welcome";
  let currentUnitId = 1;
  let currentUnitTab = "briefing"; // briefing | minigame | quiz
  let selectedZoneFilter = 0; // 0 = all, 1..4 = specific zone
  let currentTheme = "light";
  let isTeacherMode = false;
  let courseSettings = { lockedUnits: [], lockArcade: false, lockPostTest: false };

  const teacherPreviewPlayer = {
    id: "__teacher_preview__",
    name: "ครูผู้สอน (โหมดดูระบบ)",
    studentId: "TEACHER",
    classRoom: "ผู้สอนรายวิชา",
    department: "การจัดการสำนักงานดิจิทัล",
    avatarId: "av6",
    xp: 3000,
    badges: [],
    preTestScore: 13,
    postTestScore: 13,
    units: {},
    arcade: { bestScore: 0, bestCombo: 0, plays: 0, lastScore: 0 },
    isTeacherPreview: true
  };

  // ---------- Theme Helpers ----------
  function applyTheme(theme) {
    currentTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    try { localStorage.setItem(THEME_KEY, currentTheme); } catch (e) {}
    const isDark = currentTheme === "dark";
    const hudBtn = document.getElementById("btn-theme-toggle");
    if (hudBtn) {
      hudBtn.textContent = isDark ? "☀️" : "🌙";
      hudBtn.title = isDark ? "สลับเป็นโหมดสว่าง" : "สลับเป็นโหมดมืด";
    }
    const welcomeBtn = document.getElementById("btn-welcome-theme");
    if (welcomeBtn) {
      welcomeBtn.innerHTML = isDark ? "☀️ โหมดสว่าง" : "🌙 โหมดมืด";
    }
  }

  function loadTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "dark" || saved === "light") {
        applyTheme(saved);
        return;
      }
    } catch (e) {}
    applyTheme("light");
  }

  function toggleTheme() {
    SoundFX.click();
    applyTheme(currentTheme === "dark" ? "light" : "dark");
  }

  // ---------- Storage Helpers ----------
  function loadState() {
    try {
      players = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      activePlayerId = localStorage.getItem(ACTIVE_KEY);
      if (activePlayerId && !players.some(p => p.id === activePlayerId)) {
        activePlayerId = null;
      }
    } catch {
      players = [];
      activePlayerId = null;
    }
  }

  function saveState(skipCloud = false) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    if (activePlayerId) localStorage.setItem(ACTIVE_KEY, activePlayerId);
    else localStorage.removeItem(ACTIVE_KEY);

    if (!skipCloud && window.CloudSync && CloudSync.isAvailable()) {
      const p = players.find(x => x.id === activePlayerId) || null;
      if (p && !p.isTeacherPreview) CloudSync.savePlayer(p);
    }
  }

  function upsertPlayer(cloudPlayer) {
    if (!cloudPlayer || !cloudPlayer.id) return;
    const idx = players.findIndex(x => x.id === cloudPlayer.id || (cloudPlayer.uid && x.uid === cloudPlayer.uid));
    if (idx >= 0) {
      players[idx] = { ...players[idx], ...cloudPlayer };
    } else {
      players.push(cloudPlayer);
    }
  }

  async function refreshCloudPlayers() {
    if (!window.CloudSync || !CloudSync.isAvailable()) return false;
    const remoteList = await CloudSync.fetchAllPlayers();
    if (!Array.isArray(remoteList)) return false;
    remoteList.forEach(rp => upsertPlayer(rp));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
    return true;
  }

  function loadCourseSettings() {
    try {
      const raw = JSON.parse(localStorage.getItem(COURSE_SETTINGS_KEY) || "null");
      if (raw && typeof raw === "object") {
        courseSettings = {
          lockedUnits: Array.isArray(raw.lockedUnits) ? raw.lockedUnits.map(Number) : [],
          lockArcade: !!raw.lockArcade,
          lockPostTest: !!raw.lockPostTest
        };
      }
    } catch {}
  }

  function applyCourseSettings(remote) {
    if (!remote || typeof remote !== "object") return;
    courseSettings = {
      lockedUnits: Array.isArray(remote.lockedUnits) ? remote.lockedUnits.map(Number) : [],
      lockArcade: !!remote.lockArcade,
      lockPostTest: !!remote.lockPostTest
    };
    try { localStorage.setItem(COURSE_SETTINGS_KEY, JSON.stringify(courseSettings)); } catch {}
    if (currentView === "dashboard" || currentView === "teacher") {
      render();
    }
  }

  async function saveCourseSettings(nextSettings) {
    courseSettings = {
      lockedUnits: Array.isArray(nextSettings.lockedUnits) ? nextSettings.lockedUnits.map(Number) : [],
      lockArcade: !!nextSettings.lockArcade,
      lockPostTest: !!nextSettings.lockPostTest
    };
    try { localStorage.setItem(COURSE_SETTINGS_KEY, JSON.stringify(courseSettings)); } catch {}
    if (window.CloudSync && CloudSync.isAvailable()) {
      await CloudSync.saveCourseSettings(courseSettings);
    }
    render();
  }

  function getCourseSettings() {
    return courseSettings;
  }

  function isUnitLocked(unitId) {
    return (courseSettings.lockedUnits || []).includes(Number(unitId));
  }

  async function toggleUnitLock(unitId) {
    if (!isTeacherMode) return;
    SoundFX.click();
    const id = Number(unitId);
    const set = new Set(courseSettings.lockedUnits || []);
    const willLock = !set.has(id);
    if (willLock) set.add(id);
    else set.delete(id);
    await saveCourseSettings({ ...courseSettings, lockedUnits: Array.from(set).sort((a, b) => a - b) });
    showToast(willLock ? `🔒 ล็อกบทที่ ${id} แล้ว (ซิงก์ Cloud)` : `🔓 ปลดล็อกบทที่ ${id} แล้ว (ซิงก์ Cloud)`, "xp");
  }

  function isTeacher() {
    return isTeacherMode;
  }

  function getActivePlayer() {
    const student = players.find(p => p.id === activePlayerId) || null;
    if (student) return student;
    if (isTeacherMode) return teacherPreviewPlayer;
    return null;
  }

  function getAllPlayers() {
    return players;
  }

  function deletePlayer(id) {
    players = players.filter(p => p.id !== id);
    if (activePlayerId === id) activePlayerId = null;
    saveState();
  }

  // ---------- Gamification Logic ----------
  function getRank(xp) {
    const ranks = window.GAME_DATA.ranks;
    let cur = ranks[0];
    for (const r of ranks) {
      if (xp >= r.minXp) cur = r;
    }
    return cur;
  }

  function getNextRank(xp) {
    const ranks = window.GAME_DATA.ranks;
    for (const r of ranks) {
      if (r.minXp > xp) return r;
    }
    return null;
  }

  function isUnitCompleted(player, unitId) {
    const u = player.units?.[unitId];
    return !!(u && u.minigameDone && u.quizDone);
  }

  function countCompletedUnits(player) {
    return window.GAME_DATA.units.filter(u => isUnitCompleted(player, u.id)).length;
  }

  function addXP(amount, reason = "") {
    const p = getActivePlayer();
    if (!p || amount <= 0) return;
    const oldRank = getRank(p.xp);
    p.xp += amount;
    const newRank = getRank(p.xp);
    saveState();
    renderHUD();
    showToast(`⚡ +${amount} XP ${reason ? "(" + reason + ")" : ""}`, "xp");

    if (newRank.level > oldRank.level) {
      SoundFX.levelUp();
      showModal(`
        <div style="font-size:60px; margin-bottom:8px;">${newRank.icon}</div>
        <div class="badge-pill" style="margin-bottom:10px; display:inline-block;">LEVEL UP! เลื่อนตำแหน่งงาน</div>
        <h2 style="color:var(--primary); margin-bottom:6px;">Lv.${newRank.level}: ${newRank.title}</h2>
        <p style="color:var(--text-muted); margin-bottom:18px;">${newRank.eng}<br/>ยินดีด้วย! คุณพัฒนาทักษะการใช้เครื่องใช้สำนักงานดิจิทัลก้าวหน้าขึ้นอีกขั้นแล้ว</p>
        <button class="btn btn-primary" onclick="App.closeModal()">เยี่ยมเลย! ลุยภารกิจต่อ</button>
      `);
    }
  }

  function unlockBadge(badgeId) {
    const p = getActivePlayer();
    if (!p) return;
    if (!p.badges) p.badges = [];
    if (p.badges.includes(badgeId)) return;
    p.badges.push(badgeId);
    saveState();
    const b = window.GAME_DATA.badges.find(x => x.id === badgeId);
    if (b) {
      SoundFX.badge();
      showToast(`🏅 ปลดล็อกเหรียญตรา: ${b.title}!`, "badge");
    }
    renderHUD();
  }

  function checkAllBadges() {
    const p = getActivePlayer();
    if (!p) return;
    if (p.preTestScore !== null && p.preTestScore !== undefined) unlockBadge("pretest");

    // Zone badges
    window.GAME_DATA.zones.forEach(z => {
      if (z.unitIds.every(uid => isUnitCompleted(p, uid))) {
        unlockBadge(`zone${z.id}`);
      }
    });

    // Special skill badges
    if (p.units?.[5]?.minigameDone && p.units?.[7]?.minigameDone) unlockBadge("calc_pos");
    if (p.units?.[6]?.minigameDone && p.units?.[10]?.minigameDone) unlockBadge("copy_fax");
    if (p.units?.[9]?.minigameDone) unlockBadge("phone_pro");
    if (p.units?.[13]?.minigameDone) unlockBadge("search_pro");

    // Director badge (all 13 units + Post-test >= 70% i.e. >= 10/13)
    if (countCompletedUnits(p) === 13 && (p.postTestScore ?? 0) >= 10) {
      unlockBadge("director");
    }

    // Arcade badges
    if ((p.arcade?.plays || 0) >= 1) unlockBadge("arcade_rookie");
    if ((p.arcade?.bestCombo || 0) >= 5) unlockBadge("arcade_combo");
    if ((p.arcade?.bestScore || 0) >= 1000) unlockBadge("arcade_master");
  }

  function recordArcadeResult({ score, bestCombo, correctCount, totalAnswered }) {
    const p = getActivePlayer();
    if (!p) return { isNewRecord: false, xpEarned: 0 };
    if (!p.arcade) p.arcade = { bestScore: 0, bestCombo: 0, plays: 0, lastScore: 0 };
    const isNewRecord = score > (p.arcade.bestScore || 0);
    p.arcade.plays = (p.arcade.plays || 0) + 1;
    p.arcade.lastScore = score;
    if (isNewRecord) p.arcade.bestScore = score;
    if (bestCombo > (p.arcade.bestCombo || 0)) p.arcade.bestCombo = bestCombo;
    saveState();

    const xpEarned = score > 0 ? Math.min(80, Math.max(15, Math.round(score / 25))) : 10;
    addXP(xpEarned, "มินิเกมส์ Office Rush");
    checkAllBadges();
    return { isNewRecord, xpEarned };
  }

  // ---------- UI Utilities ----------
  function showToast(msg, type = "") {
    const wrap = document.getElementById("toast-container");
    const div = document.createElement("div");
    div.className = `toast ${type}`;
    div.textContent = msg;
    wrap.appendChild(div);
    setTimeout(() => {
      div.style.opacity = "0";
      div.style.transition = "opacity 0.3s";
      setTimeout(() => div.remove(), 320);
    }, 3200);
  }

  function showModal(html) {
    const overlay = document.getElementById("modal-overlay");
    document.getElementById("modal-box").innerHTML = html;
    overlay.classList.remove("hidden");
  }

  function closeModal() {
    const overlay = document.getElementById("modal-overlay");
    overlay.classList.add("hidden");
    const box = document.getElementById("modal-box");
    if (box) box.classList.remove("modal-wide");
  }

  function toggleSound() {
    const muted = SoundFX.toggle();
    const btn = document.getElementById("btn-sound-toggle");
    if (btn) btn.textContent = muted ? "🔇" : "🔊";
    if (!muted) SoundFX.click();
  }

  function renderAvatarContent(av) {
    if (av && av.img) {
      return `<img src="${av.img}" alt="${av.label || "Avatar"}" class="avatar-img" loading="lazy" />`;
    }
    return av ? av.emoji : "👤";
  }

  // ---------- Header / HUD ----------
  function renderHUD() {
    const header = document.getElementById("app-header");
    const p = getActivePlayer();
    if ((!p && !isTeacherMode) || currentView === "welcome") {
      header.classList.add("hidden");
      return;
    }
    header.classList.remove("hidden");
    const av = window.GAME_DATA.avatars.find(a => a.id === p.avatarId) || window.GAME_DATA.avatars[0];
    const rank = getRank(p.xp);
    const next = getNextRank(p.xp);
    const pct = next
      ? Math.min(100, Math.round(((p.xp - rank.minXp) / (next.minXp - rank.minXp)) * 100))
      : 100;

    document.getElementById("hud-player-stats").innerHTML = `
      <div class="hud-avatar" style="background:${av.bg}">${renderAvatarContent(av)}</div>
      <div class="hud-info">
        <div class="hud-name-row">
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${isTeacherMode ? "👩‍🏫 ครูผู้สอน" : p.name}</span>
          <span class="hud-rank-tag" style="background:${isTeacherMode ? "#0f172a" : rank.color}">${isTeacherMode ? "👩‍🏫 โหมดครูผู้สอน" : `${rank.icon} Lv.${rank.level} ${rank.title}`}</span>
        </div>
        <div class="xp-bar-wrap"><div class="xp-bar-fill" style="width:${pct}%"></div></div>
        <div class="hud-xp-meta">
          <span>${isTeacherMode ? `🔒 ล็อกอยู่ ${(courseSettings.lockedUnits || []).length}/13 บท` : `⚡ ${p.xp} XP ${next ? `/ ${next.minXp} XP` : "(MAX RANK!)"}`}</span>
          <span>🏅 ${(p.badges || []).length}/${window.GAME_DATA.badges.length} • 📚 ${countCompletedUnits(p)}/13 บท</span>
        </div>
      </div>
    `;
  }

  // ---------- Views ----------
  function renderWelcome() {
    const main = document.getElementById("app-main");
    let chosenAvatar = window.GAME_DATA.avatars[0].id;

    main.innerHTML = `
      <div class="welcome-topbar">
        <button type="button" class="theme-pill-btn" id="btn-welcome-theme" onclick="App.toggleTheme()">
          ${currentTheme === "dark" ? "☀️ โหมดสว่าง" : "🌙 โหมดมืด"}
        </button>
      </div>
      <div class="welcome-wrap">
        <div class="welcome-hero">
          <div class="hero-top">
            <h1>OfficeQuest 13</h1>
            <div class="hero-subtitle-main">พิชิตสำนักงานดิจิทัล</div>
            <p class="hero-subtitle-course">รายวิชา การใช้เครื่องใช้สำนักงานดิจิทัล</p>
          </div>
          <div class="hero-artwork-wrap">
            <img src="assets/hero-office.jpg" alt="OfficeQuest 13 สำนักงานดิจิทัล" class="hero-artwork-img" />
          </div>
          <div class="hero-bottom">
            <button class="btn btn-sm hero-teacher-btn" onclick="App.openTeacherAuth()">👩‍🏫 เข้าสู่โหมดครูผู้สอน</button>
          </div>
        </div>

        <div class="welcome-form-card">
          <h2 id="auth-card-title" style="margin-bottom:4px; text-align:center;">เข้าสู่ระบบ / ลงทะเบียน</h2>
          <p id="auth-card-sub" style="font-size:14px; color:var(--text-muted); margin-bottom:14px; text-align:center;">บันทึกความก้าวหน้าและคะแนนบน Cloud เล่นต่อได้ทุกอุปกรณ์</p>

          <div class="auth-mode-tabs">
            <button type="button" class="auth-mode-tab active" id="tab-auth-login">🔑 เข้าสู่ระบบ</button>
            <button type="button" class="auth-mode-tab" id="tab-auth-register">✨ ลงทะเบียนใหม่</button>
          </div>

          <div id="auth-error-box" class="auth-error-box"></div>

          <!-- Login Form -->
          <form id="login-form">
            <div class="form-group">
              <label>รหัสนักศึกษา *</label>
              <input class="form-control" id="login-id" placeholder="เช่น 6920201001" autocomplete="username" required />
            </div>
            <div class="form-group">
              <label>รหัสผ่าน *</label>
              <input type="password" class="form-control" id="login-pass" placeholder="กรอกรหัสผ่านที่ตั้งไว้" autocomplete="current-password" required />
            </div>
            <button type="submit" id="btn-login-submit" class="btn btn-primary" style="width:100%; margin-top:6px;">เข้าสู่ระบบ Cloud ➔</button>
          </form>

          <!-- Register Form -->
          <form id="reg-form" class="hidden">
            <div class="form-group">
              <label>ชื่อ - นามสกุล นักศึกษา *</label>
              <input class="form-control" id="reg-name" placeholder="เช่น นายกิตติพงศ์ ใจดี" required />
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div class="form-group">
                <label>รหัสนักศึกษา *</label>
                <input class="form-control" id="reg-id" placeholder="เช่น 6920201001" autocomplete="username" required />
              </div>
              <div class="form-group">
                <label>รหัสผ่าน (อย่างน้อย 6 ตัว) *</label>
                <input type="password" class="form-control" id="reg-pass" placeholder="ตั้งรหัสผ่าน..." minlength="6" autocomplete="new-password" required />
              </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div class="form-group">
                <label>ระดับชั้น / กลุ่ม *</label>
                <input class="form-control" id="reg-class" value="ปวช.1/1" required />
              </div>
              <div class="form-group">
                <label>สาขาวิชา / แผนกวิชา</label>
                <input class="form-control" id="reg-dept" placeholder="เช่น การจัดการสำนักงานฯ" />
              </div>
            </div>

            <div class="form-group">
              <label>ตัวละครประจำตัว (อวตารอนิเมะ)</label>
              ${(() => {
                const firstAv = window.GAME_DATA.avatars.find(a => a.id === chosenAvatar) || window.GAME_DATA.avatars[0];
                return `
                  <div class="avatar-selector-trigger" id="btn-open-avatar-picker" role="button" tabindex="0">
                    <div class="hud-avatar" id="selected-av-preview" style="width:52px; height:52px; background:${firstAv.bg}">${renderAvatarContent(firstAv)}</div>
                    <div style="flex:1; min-width:0; text-align:left;">
                      <div style="font-family:var(--font-head); font-weight:700; font-size:15px;" id="selected-av-label">${firstAv.label}</div>
                      <div style="font-size:12px; color:var(--text-muted);" id="selected-av-meta">คลิกเพื่อเปลี่ยนตัวละคร (${window.GAME_DATA.avatars.length} แบบ)</div>
                    </div>
                    <span class="btn btn-outline btn-sm" style="pointer-events:none; flex-shrink:0;">🎨 เลือกตัวละคร</span>
                  </div>
                `;
              })()}
            </div>

            <button type="submit" id="btn-reg-submit" class="btn btn-primary" style="width:100%; margin-top:6px;">ลงทะเบียนและเริ่มภารกิจ ➔</button>
          </form>

          <div class="cloud-note-bar">
            <span>☁️</span>
            <span>ระบบเชื่อมต่อ <strong>Firebase Cloud</strong> บันทึกคะแนนและเหรียญตราอัตโนมัติ</span>
          </div>
        </div>
      </div>
    `;

    function updateSelectedAvatarPreview() {
      const av = window.GAME_DATA.avatars.find(a => a.id === chosenAvatar) || window.GAME_DATA.avatars[0];
      const prev = main.querySelector("#selected-av-preview");
      const lbl = main.querySelector("#selected-av-label");
      const meta = main.querySelector("#selected-av-meta");
      if (prev) {
        prev.style.background = av.bg;
        prev.innerHTML = renderAvatarContent(av);
      }
      if (lbl) lbl.textContent = av.label;
      if (meta) meta.textContent = `คลิกเพื่อเปลี่ยนตัวละคร (${window.GAME_DATA.avatars.length} แบบ)`;
    }

    function openAvatarPickerModal() {
      SoundFX.click();
      const allAvs = window.GAME_DATA.avatars;

      showModal(`
        <div class="avatar-modal-content">
          <div style="margin-bottom:14px; text-align:center;">
            <h3 style="font-size:19px; margin-bottom:2px;">🎨 เลือกตัวละครประจำตัว (${allAvs.length} แบบ)</h3>
            <p style="font-size:12px; color:var(--text-muted); margin:0;">คลิกที่ตัวละครที่ชอบเพื่อเลือกใช้งานทันที</p>
          </div>

          <div class="avatar-modal-grid" id="modal-avatar-grid">
            ${allAvs.map(a => `
              <div class="avatar-opt ${a.id === chosenAvatar ? "selected" : ""}" data-av="${a.id}">
                <div class="av-circle" style="background:${a.bg}">${renderAvatarContent(a)}</div>
                <span class="av-label">${a.label}</span>
              </div>
            `).join("")}
          </div>

          <div style="margin-top:16px; text-align:right;">
            <button type="button" class="btn btn-outline btn-sm" onclick="App.closeModal()">ปิดหน้าต่าง</button>
          </div>
        </div>
      `);

      const modalBox = document.getElementById("modal-box");
      if (modalBox) modalBox.classList.add("modal-wide");

      modalBox.querySelectorAll(".avatar-opt").forEach(el => {
        el.onclick = () => {
          SoundFX.click();
          chosenAvatar = el.dataset.av;
          updateSelectedAvatarPreview();
          closeModal();
        };
      });
    }

    const triggerBtn = main.querySelector("#btn-open-avatar-picker");
    if (triggerBtn) {
      triggerBtn.onclick = openAvatarPickerModal;
      triggerBtn.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openAvatarPickerModal(); } };
    }

    const errBox = main.querySelector("#auth-error-box");
    const loginForm = main.querySelector("#login-form");
    const regForm = main.querySelector("#reg-form");
    const tabLogin = main.querySelector("#tab-auth-login");
    const tabReg = main.querySelector("#tab-auth-register");

    function showAuthError(msg) {
      if (!errBox) return;
      if (!msg) {
        errBox.textContent = "";
        errBox.classList.remove("show");
      } else {
        errBox.textContent = "⚠️ " + msg;
        errBox.classList.add("show");
      }
    }

    function switchAuthMode(mode) {
      SoundFX.click();
      showAuthError("");
      const isLogin = mode === "login";
      tabLogin.classList.toggle("active", isLogin);
      tabReg.classList.toggle("active", !isLogin);
      loginForm.classList.toggle("hidden", !isLogin);
      regForm.classList.toggle("hidden", isLogin);
    }

    tabLogin.onclick = () => switchAuthMode("login");
    tabReg.onclick = () => switchAuthMode("register");

    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      showAuthError("");
      const studentId = main.querySelector("#login-id").value.trim();
      const password = main.querySelector("#login-pass").value;
      const btn = main.querySelector("#btn-login-submit");

      btn.disabled = true;
      btn.textContent = "⏳ กำลังเข้าสู่ระบบ Cloud...";

      if (window.CloudSync && CloudSync.isAvailable()) {
        const res = await CloudSync.loginStudent(studentId, password);
        if (res.ok && res.player) {
          SoundFX.levelUp();
          upsertPlayer(res.player);
          activePlayerId = res.player.id;
          saveState(true);
          navigate("dashboard");
          showToast(`☁️ ยินดีต้อนรับกลับมา ${res.player.name}!`, "xp");
          return;
        }
        SoundFX.wrong();
        showAuthError(res.error || "เข้าสู่ระบบไม่สำเร็จ");
      } else {
        // Offline local fallback
        const found = players.find(pl => String(pl.studentId).trim().toLowerCase() === studentId.toLowerCase());
        if (found) {
          SoundFX.levelUp();
          activePlayerId = found.id;
          saveState(true);
          navigate("dashboard");
          showToast(`📴 เข้าสู่ระบบโหมดออฟไลน์: ${found.name}`, "xp");
          return;
        }
        SoundFX.wrong();
        showAuthError("ไม่สามารถเชื่อมต่อ Cloud ได้ และไม่พบบัญชีนี้ในเครื่อง");
      }

      btn.disabled = false;
      btn.textContent = "เข้าสู่ระบบ Cloud ➔";
    };

    regForm.onsubmit = async (e) => {
      e.preventDefault();
      showAuthError("");
      const name = main.querySelector("#reg-name").value.trim();
      const studentId = main.querySelector("#reg-id").value.trim();
      const password = main.querySelector("#reg-pass").value;
      const classRoom = main.querySelector("#reg-class").value.trim() || "ปวช.1";
      const department = main.querySelector("#reg-dept").value.trim();
      const btn = main.querySelector("#btn-reg-submit");

      btn.disabled = true;
      btn.textContent = "⏳ กำลังสร้างบัญชีบน Cloud...";

      if (window.CloudSync && CloudSync.isAvailable()) {
        const res = await CloudSync.registerStudent({
          studentId,
          password,
          name,
          classRoom,
          department,
          avatarId: chosenAvatar
        });
        if (res.ok && res.player) {
          SoundFX.levelUp();
          upsertPlayer(res.player);
          activePlayerId = res.player.id;
          saveState(true);
          navigate("dashboard");
          showToast(`☁️ ลงทะเบียนสำเร็จ! ยินดีต้อนรับ ${name}`, "xp");
          return;
        }
        SoundFX.wrong();
        showAuthError(res.error || "ลงทะเบียนไม่สำเร็จ");
        btn.disabled = false;
        btn.textContent = "ลงทะเบียนและเริ่มภารกิจ ➔";
        return;
      }

      // Offline local fallback
      SoundFX.levelUp();
      const newPlayer = {
        id: "p_" + Date.now(),
        name,
        studentId,
        classRoom,
        department,
        avatarId: chosenAvatar,
        xp: 0,
        badges: [],
        preTestScore: null,
        postTestScore: null,
        units: {},
        arcade: { bestScore: 0, bestCombo: 0, plays: 0, lastScore: 0 },
        createdAt: Date.now()
      };
      players.push(newPlayer);
      activePlayerId = newPlayer.id;
      saveState(true);
      navigate("dashboard");
      showToast(`🎉 ยินดีต้อนรับ ${name} (บันทึกในเครื่อง)`, "xp");
    };
  }

  // ---------- Dashboard (4 Zones / 13 Chapters) ----------
  function renderDashboard() {
    const p = getActivePlayer();
    if (!p) return navigate("welcome");
    const rank = getRank(p.xp);
    const doneCount = countCompletedUnits(p);
    const pctAll = Math.round((doneCount / 13) * 100);
    const main = document.getElementById("app-main");

    const zonesToShow = selectedZoneFilter === 0
      ? window.GAME_DATA.zones
      : window.GAME_DATA.zones.filter(z => z.id === selectedZoneFilter);

    main.innerHTML = `
      ${isTeacherMode ? `
        <div class="teacher-mode-strip">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:20px;">👩‍🏫</span>
            <div>
              <strong>กำลังใช้งานในโหมดครูผู้สอน</strong>
              <span style="font-size:13px; opacity:0.9;"> — ดูเนื้อหา มินิเกมส์ และแบบทดสอบได้ทุกส่วนเหมือนนักเรียน พร้อมกดล็อก/ปลดล็อกด่านได้ทันที</span>
            </div>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn btn-sm btn-warning" onclick="App.navigate('teacher')">📊 แดชบอร์ดครู & จัดการล็อกด่าน</button>
            <button class="btn btn-sm" style="background:rgba(255,255,255,0.2); color:#fff;" onclick="App.exitTeacherMode()">🚪 ออกจากโหมดครู</button>
          </div>
        </div>
      ` : ""}

      <div class="dash-banner">
        <div>
          <span class="hero-tag" style="margin-bottom:8px;">🏢 แผนที่ภารกิจครบ 13 บทเรียน ปวช.</span>
          <h2 style="font-size:26px; margin-bottom:4px;">สวัสดี, ${p.name}! (${rank.icon} ${rank.title})</h2>
          <p style="opacity:0.9; font-size:14px;">พิชิตมินิเกมปฏิบัติและแบบทดสอบครบทั้ง 13 บท เพื่อเลื่อนขั้นสู่ตำแหน่ง <strong>ผู้จัดการสำนักงานดิจิทัล</strong></p>
        </div>
        <div style="text-align:right;">
          <div style="margin-bottom:6px;"><span id="cloud-sync-badge" class="cloud-sync-badge ${window.CloudSync ? CloudSync.getStatus() : "offline"}">${window.CloudSync && CloudSync.isAvailable() ? "☁️ ซิงก์ Cloud แล้ว" : "📴 โหมดออฟไลน์"}</span></div>
          <div style="font-family:var(--font-head); font-size:32px; font-weight:800; line-height:1;">${pctAll}%</div>
          <div style="font-size:12px; opacity:0.85;">ความก้าวหน้ารวม (${doneCount}/13 บท)</div>
          <button class="btn btn-sm" style="margin-top:8px; background:rgba(255,255,255,0.2); color:#fff;" onclick="App.logoutStudent()">🚪 ออกจากระบบ</button>
        </div>
      </div>

      <div class="dash-stats-strip">
        <div class="stat-tile">
          <div class="stat-icon" style="background:#eef2ff;">⚡</div>
          <div><div class="stat-val">${p.xp} XP</div><div class="stat-lbl">คะแนนประสบการณ์สะสม</div></div>
        </div>
        <div class="stat-tile">
          <div class="stat-icon" style="background:#ecfdf5;">📚</div>
          <div><div class="stat-val">${doneCount} / 13</div><div class="stat-lbl">บทเรียนที่พิชิตแล้ว</div></div>
        </div>
        <div class="stat-tile">
          <div class="stat-icon" style="background:#fffbeb;">🏅</div>
          <div><div class="stat-val">${(p.badges || []).length} / ${window.GAME_DATA.badges.length}</div><div class="stat-lbl">เหรียญตราความสำเร็จ</div></div>
        </div>
        <div class="stat-tile">
          <div class="stat-icon" style="background:#eff6ff;">📈</div>
          <div><div class="stat-val">${p.preTestScore ?? "-"} ➔ ${p.postTestScore ?? "-"}</div><div class="stat-lbl">คะแนนก่อนเรียน ➔ หลังเรียน</div></div>
        </div>
      </div>

      <div class="assessment-bar">
        <div class="assess-card ${p.preTestScore !== null ? "done" : ""}">
          <div>
            <div style="font-family:var(--font-head); font-weight:700; font-size:16px;">📝 แบบทดสอบก่อนเรียน (Pre-Test)</div>
            <div style="font-size:13px; color:var(--text-muted);">13 ข้อ ครอบคลุมบทที่ 1–13 • ${p.preTestScore !== null ? `ทำแล้ว ได้ ${p.preTestScore}/13 คะแนน` : "แนะนำให้ทำก่อนเริ่มบทที่ 1 (+50 XP & เหรียญตรา)"}</div>
          </div>
          <button class="btn btn-sm ${p.preTestScore !== null ? "btn-outline" : "btn-primary"}" onclick="App.startAssessment('pre')">
            ${p.preTestScore !== null ? "ดูผล / ทำใหม่" : "เริ่มทำ Pre-Test"}
          </button>
        </div>

        <div class="assess-card ${p.postTestScore !== null ? "done" : ""} ${courseSettings.lockPostTest && !isTeacherMode ? "locked-card" : ""}">
          <div>
            <div style="font-family:var(--font-head); font-weight:700; font-size:16px;">🎓 แบบทดสอบหลังเรียน (Post-Test) ${courseSettings.lockPostTest ? `<span class="lock-inline-tag">🔒 ล็อก</span>` : ""}</div>
            <div style="font-size:13px; color:var(--text-muted);">${courseSettings.lockPostTest && !isTeacherMode ? "🔒 ครูผู้สอนล็อกแบบทดสอบหลังเรียนไว้ชั่วคราว กรุณารอครูเปิดสอบ" : `วัดผลสัมฤทธิ์ 13 ข้อ • ${p.postTestScore !== null ? `ได้ ${p.postTestScore}/13 คะแนน` : "ทำเมื่อเรียนครบหรือต้องการวัดผลหลังเรียน (+100 XP)"}`}</div>
          </div>
          <button class="btn btn-sm ${courseSettings.lockPostTest && !isTeacherMode ? "btn-outline" : (p.postTestScore !== null ? "btn-success" : "btn-warning")}" ${courseSettings.lockPostTest && !isTeacherMode ? "disabled" : ""} onclick="App.startAssessment('post')">
            ${courseSettings.lockPostTest && !isTeacherMode ? "🔒 รอครูเปิดสอบ" : (p.postTestScore !== null ? "ทำใหม่พัฒนาคะแนน" : "เริ่มทำ Post-Test")}
          </button>
        </div>
      </div>

      <div class="arcade-promo-bar ${courseSettings.lockArcade && !isTeacherMode ? "locked-card" : ""}">
        <div style="display:flex; align-items:center; gap:14px;">
          <div class="arcade-promo-icon">${courseSettings.lockArcade ? "🔒" : "🎮"}</div>
          <div>
            <div style="font-family:var(--font-head); font-weight:700; font-size:16px; color:#fff;">หมวดมินิเกมส์ท้าประลอง: Office Rush (60 วินาที) + ตารางคะแนน ${courseSettings.lockArcade ? "(🔒 ล็อกอยู่)" : ""}</div>
            <div style="font-size:13px; color:rgba(255,255,255,0.88);">
              ${courseSettings.lockArcade && !isTeacherMode ? "🔒 ครูผู้สอนล็อกหมวดมินิเกมส์ไว้ชั่วคราว กรุณารอครูเปิดใช้งาน" : `แข่งตอบไวสะสมคอมโบ ปลดล็อก 3 เหรียญตราพิเศษ และชิงอันดับ 1 บนตารางคะแนน! • สถิติสูงสุดของคุณ: <strong>${(p.arcade?.bestScore || 0).toLocaleString()} คะแนน</strong>`}
            </div>
          </div>
        </div>
        <button class="btn btn-warning btn-sm" style="flex-shrink:0;" ${courseSettings.lockArcade && !isTeacherMode ? "disabled" : ""} onclick="App.navigate('arcade')">
          ${courseSettings.lockArcade && !isTeacherMode ? "🔒 รอครูเปิดด่าน" : "🏆 เข้าเล่น & ดูตารางคะแนน ➔"}
        </button>
      </div>

      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; align-items:center;">
        <span style="font-family:var(--font-head); font-size:14px; font-weight:600; color:var(--text-muted);">กรองตามโซน:</span>
        <button class="btn btn-sm ${selectedZoneFilter === 0 ? "btn-primary" : "btn-outline"}" onclick="App.setZoneFilter(0)">ทั้งหมด (13 บท)</button>
        ${window.GAME_DATA.zones.map(z => `
          <button class="btn btn-sm ${selectedZoneFilter === z.id ? "btn-primary" : "btn-outline"}" onclick="App.setZoneFilter(${z.id})">${z.icon} โซน ${z.id} (บท ${z.unitIds[0]}–${z.unitIds[z.unitIds.length - 1]})</button>
        `).join("")}
      </div>

      ${zonesToShow.map(zone => {
        const zoneUnits = zone.unitIds.map(id => window.GAME_DATA.units.find(u => u.id === id));
        const zoneDone = zoneUnits.filter(u => isUnitCompleted(p, u.id)).length;
        return `
          <section class="zone-section">
            <div class="zone-header">
              <div class="zone-title-wrap">
                <div class="zone-badge" style="background:${zone.color}">${zone.icon}</div>
                <div>
                  <h3 style="font-size:19px;">${zone.title}</h3>
                  <div style="font-size:13px; color:var(--text-muted);">${zone.subtitle}</div>
                </div>
              </div>
              <span class="mini-pill ${zoneDone === zoneUnits.length ? "ok" : ""}" style="font-size:13px; padding:5px 12px;">
                ${zoneDone === zoneUnits.length ? "🏆 พิชิตโซนแล้ว" : `ผ่าน ${zoneDone}/${zoneUnits.length} บท`}
              </span>
            </div>

            <div class="units-grid">
              ${zoneUnits.map(u => {
                const st = p.units?.[u.id] || {};
                const completed = isUnitCompleted(p, u.id);
                const locked = isUnitLocked(u.id);
                return `
                  <div class="unit-card ${completed ? "completed" : ""} ${locked ? "locked-unit" : ""}">
                    <div>
                      <div class="unit-top-bar">
                        <span class="unit-code-pill" style="background:${locked ? "#64748b" : u.color}">${locked ? "🔒 " : ""}${u.code}</span>
                        <span class="unit-page-ref">${locked ? "🔒 ล็อกโดยครู" : `📖 ${u.pageRef}`}</span>
                      </div>
                      <div class="unit-icon-title" style="margin-top:10px;">
                        <div class="unit-emoji">${u.icon}</div>
                        <div>
                          <div class="unit-title">${u.title}</div>
                          <div class="unit-sub">${u.subtitle}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div class="unit-progress-pills" style="margin-bottom:12px;">
                        <span class="mini-pill ${st.minigameDone ? "ok" : ""}">${st.minigameDone ? "✓ มินิเกมผ่าน" : "🕹️ รอมินิเกม"}</span>
                        <span class="mini-pill ${st.quizDone ? "ok" : ""}">${st.quizDone ? `✓ สอบ ${st.quizScore}/4` : "📝 รอทดสอบ"}</span>
                      </div>
                      ${isTeacherMode ? `
                        <div style="display:flex; gap:6px;">
                          <button class="btn btn-sm btn-primary" style="flex:1;" onclick="App.openUnit(${u.id})">👁️ ดูบทเรียน</button>
                          <button class="btn btn-sm ${locked ? "btn-success" : "btn-danger"}" onclick="App.toggleUnitLock(${u.id})" title="${locked ? "ปลดล็อกด่านนี้" : "ล็อกด่านนี้"}">
                            ${locked ? "🔓 ปลดล็อก" : "🔒 ล็อก"}
                          </button>
                        </div>
                      ` : (locked ? `
                        <button class="btn btn-sm btn-outline" style="width:100%; opacity:0.75; cursor:not-allowed;" onclick="App.openUnit(${u.id})">
                          🔒 รอครูผู้สอนเปิดด่าน
                        </button>
                      ` : `
                        <button class="btn btn-sm ${completed ? "btn-success" : "btn-primary"}" style="width:100%;" onclick="App.openUnit(${u.id})">
                          ${completed ? "✓ ทบทวนบทเรียน" : "เข้าสู่ภารกิจ ➔"}
                        </button>
                      `)}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          </section>
        `;
      }).join("")}
    `;
  }

  // ---------- Unit View (Briefing / Minigame / Quiz) ----------
  function openUnit(unitId, tab = "briefing") {
    if (!isTeacherMode && isUnitLocked(unitId)) {
      SoundFX.wrong();
      showToast(`🔒 บทที่ ${unitId} ถูกล็อกโดยครูผู้สอน กรุณารอครูเปิดด่านครับ`, "");
      return;
    }
    SoundFX.click();
    currentUnitId = unitId;
    currentUnitTab = tab;
    currentView = "unit";
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openUnitTab(tab) {
    currentUnitTab = tab;
    renderUnitView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderUnitView() {
    const p = getActivePlayer();
    const u = window.GAME_DATA.units.find(x => x.id === currentUnitId);
    if (!p || !u) return navigate("dashboard");
    const st = p.units?.[u.id] || {};
    const main = document.getElementById("app-main");

    main.innerHTML = `
      <div style="margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <button class="btn btn-outline btn-sm" onclick="App.navigate('dashboard')">← กลับแผนที่ 13 บทเรียน</button>
        <div style="display:flex; gap:8px;">
          ${u.id > 1 ? `<button class="btn btn-outline btn-sm" onclick="App.openUnit(${u.id - 1})">◀ บทที่ ${u.id - 1}</button>` : ""}
          ${u.id < 13 ? `<button class="btn btn-outline btn-sm" onclick="App.openUnit(${u.id + 1})">บทที่ ${u.id + 1} ▶</button>` : ""}
        </div>
      </div>

      <div class="unit-hero" style="background: linear-gradient(135deg, ${u.color}, #1e293b);">
        <div>
          <span class="hero-tag">${u.code} • หนังสือเรียน ${u.pageRef}</span>
          <h2 style="font-size:26px;">${u.icon} ${u.title}</h2>
          <p style="opacity:0.9; font-size:14px;">${u.subtitle}</p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <span class="mini-pill ${st.minigameDone ? "ok" : ""}" style="font-size:13px; padding:6px 12px;">${st.minigameDone ? "✅ ผ่านมินิเกมแล้ว" : "🕹️ มินิเกมปฏิบัติ"}</span>
          <span class="mini-pill ${st.quizDone ? "ok" : ""}" style="font-size:13px; padding:6px 12px;">${st.quizDone ? `✅ แบบทดสอบ ${st.quizScore}/4` : "📝 แบบทดสอบ 4 ข้อ"}</span>
        </div>
      </div>

      <div class="step-tabs">
        <button class="step-tab ${currentUnitTab === "briefing" ? "active" : ""}" onclick="App.openUnitTab('briefing')">📖 1. สรุปเนื้อหาบทเรียน</button>
        <button class="step-tab ${currentUnitTab === "minigame" ? "active" : ""}" onclick="App.openUnitTab('minigame')">🕹️ 2. มินิเกมจำลองปฏิบัติ (ใบงาน)</button>
        <button class="step-tab ${currentUnitTab === "quiz" ? "active" : ""}" onclick="App.openUnitTab('quiz')">📝 3. แบบทดสอบท้ายบท (4 ข้อ)</button>
      </div>

      <div id="unit-tab-content"></div>
    `;

    const contentEl = document.getElementById("unit-tab-content");

    if (currentUnitTab === "briefing") {
      const extra = window.GAME_DATA.lessonDetails?.[u.id] || null;
      const visual = window.GAME_DATA.lessonVisuals?.[u.id] || null;
      contentEl.innerHTML = `
        <div class="card lesson-sheet" id="lesson-sheet">
          <div class="lesson-toolbar">
            <div>
              <h3 style="margin-bottom:4px;">📖 เนื้อหาบทเรียน ${u.code}: ${u.title}</h3>
              <p style="font-size:15px; color:var(--text-muted); margin:0;">${u.briefing.intro}</p>
            </div>
            <button type="button" class="btn btn-outline btn-sm" id="btn-present-mode" style="flex-shrink:0;">🖥️ ขยายตัวอักษรสอนหน้าชั้น</button>
          </div>

          ${extra?.objectives ? `
            <div class="lesson-objectives-box">
              <h4>🎯 จุดประสงค์การเรียนรู้</h4>
              <ul>
                ${extra.objectives.map(obj => `<li>${obj}</li>`).join("")}
              </ul>
            </div>
          ` : ""}

          <div class="briefing-grid">
            ${u.briefing.keyPoints.map(kp => `
              <div class="briefing-item">
                <h4><span>${kp.icon}</span> ${kp.title}</h4>
                <p style="font-size:14px; color:var(--text-muted);">${kp.desc}</p>
              </div>
            `).join("")}
          </div>

          ${extra?.sections ? `
            <div class="lesson-deep-sections">
              <h3 class="lesson-block-heading">📚 เนื้อหาบรรยายละเอียด</h3>
              ${visual ? `
                <figure class="lesson-visual-card">
                  ${visual.svg}
                  <figcaption>🖼️ ${visual.caption}</figcaption>
                </figure>
              ` : ""}
              ${extra.sections.map(sec => `
                <div class="lesson-section-card">
                  <h4>${sec.title}</h4>
                  <ul>
                    ${sec.bullets.map(b => `<li>${b}</li>`).join("")}
                  </ul>
                </div>
              `).join("")}
            </div>
          ` : ""}

          ${extra?.caseStudy ? `
            <div class="lesson-case-box">
              <div class="lc-badge">🏢 กรณีศึกษาจากสำนักงานจริง</div>
              <h4>${extra.caseStudy.title}</h4>
              <p class="lc-scenario">${extra.caseStudy.scenario}</p>
              <div class="lc-takeaway"><strong>✅ ข้อสรุปสำคัญ:</strong> ${extra.caseStudy.takeaway}</div>
            </div>
          ` : ""}

          ${extra?.discussions ? `
            <div class="lesson-discussion-wrap">
              <h3 class="lesson-block-heading">💬 คำถามชวนคิด / อภิปรายในห้องเรียน</h3>
              ${extra.discussions.map((d, i) => `
                <details class="discussion-item">
                  <summary><span class="disc-num">คำถามที่ ${i + 1}</span> ${d.q}</summary>
                  <div class="disc-answer"><strong>💡 แนวคำตอบ:</strong> ${d.a}</div>
                </details>
              `).join("")}
            </div>
          ` : ""}

          <div class="pro-tip-box">
            <strong>💡 เคล็ดลับจำแม่นระดับ ปวช.:</strong> ${u.briefing.proTip}
          </div>

          <div style="text-align:right; margin-top:16px;">
            <button class="btn btn-primary" onclick="App.openUnitTab('minigame')">พร้อมแล้ว! ลุยมินิเกมปฏิบัติ ➔</button>
          </div>
        </div>
      `;

      const presentBtn = contentEl.querySelector("#btn-present-mode");
      const sheetEl = contentEl.querySelector("#lesson-sheet");
      if (presentBtn && sheetEl) {
        presentBtn.onclick = () => {
          SoundFX.click();
          const on = sheetEl.classList.toggle("present-mode");
          presentBtn.textContent = on ? "🔽 กลับขนาดปกติ" : "🖥️ ขยายตัวอักษรสอนหน้าชั้น";
          presentBtn.classList.toggle("btn-primary", on);
          presentBtn.classList.toggle("btn-outline", !on);
        };
      }
    } else if (currentUnitTab === "minigame") {
      MiniGames.mount(u, contentEl, (res) => {
        const player = getActivePlayer();
        if (!player.units[u.id]) player.units[u.id] = {};
        const firstTime = !player.units[u.id].minigameDone;
        player.units[u.id].minigameDone = true;
        player.units[u.id].minigameScore = Math.max(player.units[u.id].minigameScore || 0, res.score);
        saveState();
        addXP(firstTime ? res.xp : 20, firstTime ? `ผ่านมินิเกม ${u.code}` : `ฝึกซ้ำมินิเกม ${u.code}`);
        checkAllBadges();
      });
    } else if (currentUnitTab === "quiz") {
      renderUnitQuiz(u, contentEl);
    }
  }

  function renderUnitQuiz(u, container) {
    let qIdx = 0;
    let score = 0;
    let streak = 0;
    const questions = u.quiz;
    const letters = ["ก", "ข", "ค", "ง"];

    function renderQ() {
      if (qIdx >= questions.length) {
        const player = getActivePlayer();
        if (!player.units[u.id]) player.units[u.id] = {};
        const prevBest = player.units[u.id].quizScore ?? -1;
        const firstTime = !player.units[u.id].quizDone;
        player.units[u.id].quizDone = true;
        player.units[u.id].quizScore = Math.max(prevBest, score);
        saveState();

        const earnedXp = firstTime ? (40 + score * 20) : (score > prevBest ? 30 : 15);
        addXP(earnedXp, `แบบทดสอบ ${u.code}`);
        checkAllBadges();
        SoundFX.victory();

        const nextUnit = u.id < 13 ? window.GAME_DATA.units.find(x => x.id === u.id + 1) : null;
        container.innerHTML = `
          <div class="card" style="text-align:center; padding:34px 24px;">
            <div style="font-size:58px; margin-bottom:8px;">${score >= 3 ? "🏆" : "👍"}</div>
            <h2 style="margin-bottom:6px;">สรุปผลแบบทดสอบ ${u.code}</h2>
            <div style="font-family:var(--font-head); font-size:36px; font-weight:800; color:var(--primary); margin:10px 0;">
              ${score} / ${questions.length} คะแนน
            </div>
            <p style="color:var(--text-muted); margin-bottom:22px;">
              ${score === 4 ? "ยอดเยี่ยมไร้ที่ติ! คุณเข้าใจเนื้อหาบทนี้อย่างทะลุปรุโปร่ง!" : score >= 3 ? "เก่งมาก! ผ่านเกณฑ์สมรรถนะประจำบทเรียนแล้ว" : "ลองทบทวนสรุปบทเรียนแล้วกลับมาทำใหม่เพื่อเพิ่มคะแนนได้นะครับ"}
            </p>
            <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
              <button class="btn btn-outline" onclick="App.openUnitTab('quiz')">↺ ทำแบบทดสอบอีกครั้ง</button>
              <button class="btn btn-outline" onclick="App.navigate('dashboard')">🗺️ กลับแผนที่ 13 บท</button>
              ${nextUnit ? `<button class="btn btn-primary" onclick="App.openUnit(${nextUnit.id})">ไปต่อ ${nextUnit.code}: ${nextUnit.title} ➔</button>` : `<button class="btn btn-success" onclick="App.startAssessment('post')">🎓 ไปทำแบบทดสอบหลังเรียน (Post-Test) ➔</button>`}
            </div>
          </div>
        `;
        return;
      }

      const q = questions[qIdx];
      container.innerHTML = `
        <div class="mg-stage">
          <div class="mg-header-bar">
            <div>
              <h3>📝 แบบทดสอบท้ายบทที่ ${u.id}: ${u.title}</h3>
              <div style="font-size:13px; color:var(--text-muted);">ตอบถูกต่อเนื่องรับโบนัสคอมโบ!</div>
            </div>
            <div style="display:flex; gap:8px;">
              ${streak >= 2 ? `<span class="mini-pill" style="background:#fff7ed; color:#ea580c; border-color:#fdba74;">🔥 Combo x${streak}</span>` : ""}
              <span class="mini-pill">ข้อ ${qIdx + 1} / ${questions.length}</span>
            </div>
          </div>

          <p style="font-size:17px; font-weight:700; margin-bottom:16px;">${qIdx + 1}. ${q.q}</p>

          <div class="choice-list">
            ${q.options.map((op, i) => `
              <button class="choice-btn quiz-opt" data-idx="${i}">
                <span class="choice-letter">${letters[i]}</span>
                <span>${op}</span>
              </button>
            `).join("")}
          </div>
          <div id="quiz-fb"></div>
        </div>
      `;

      container.querySelectorAll(".quiz-opt").forEach(btn => {
        btn.onclick = () => {
          const picked = Number(btn.dataset.idx);
          const fb = container.querySelector("#quiz-fb");
          container.querySelectorAll(".quiz-opt").forEach(b => b.disabled = true);

          if (picked === q.answer) {
            SoundFX.correct();
            btn.classList.add("correct");
            score++;
            streak++;
            fb.innerHTML = `
              <div class="mg-feedback ok">
                ✅ <strong>ถูกต้อง!</strong> ${q.explain}
                <div style="margin-top:10px;"><button class="btn btn-success btn-sm" id="quiz-next">${qIdx + 1 < questions.length ? "ข้อต่อไป ➔" : "ดูผลคะแนน ➔"}</button></div>
              </div>
            `;
          } else {
            SoundFX.wrong();
            streak = 0;
            btn.classList.add("wrong");
            container.querySelector(`.quiz-opt[data-idx="${q.answer}"]`).classList.add("correct");
            fb.innerHTML = `
              <div class="mg-feedback err">
                ❌ <strong>ยังไม่ถูกครับ</strong> — คำตอบที่ถูกต้องคือข้อ <strong>${letters[q.answer]}</strong><br/>
                <span style="color:#334155;">💡 ${q.explain}</span>
                <div style="margin-top:10px;"><button class="btn btn-primary btn-sm" id="quiz-next">${qIdx + 1 < questions.length ? "ข้อต่อไป ➔" : "ดูผลคะแนน ➔"}</button></div>
              </div>
            `;
          }
          container.querySelector("#quiz-next").onclick = () => {
            qIdx++;
            renderQ();
          };
        };
      });
    }
    renderQ();
  }

  // ---------- Pre-Test / Post-Test (13 Questions) ----------
  function startAssessment(mode) {
    if (mode === "post" && !isTeacherMode && courseSettings.lockPostTest) {
      SoundFX.wrong();
      showToast("🔒 แบบทดสอบหลังเรียนถูกล็อกโดยครูผู้สอน กรุณารอครูเปิดสอบครับ", "");
      return;
    }
    SoundFX.click();
    const p = getActivePlayer();
    if (!p) return navigate("welcome");
    currentView = "assessment";
    renderHUD();

    const main = document.getElementById("app-main");
    const questions = window.GAME_DATA.prePostQuestions;
    let idx = 0;
    let score = 0;
    const isPre = mode === "pre";
    const letters = ["ก", "ข", "ค", "ง"];

    function renderStep() {
      if (idx >= questions.length) {
        if (isPre) {
          const first = p.preTestScore === null;
          p.preTestScore = score;
          saveState();
          if (first) addXP(50, "ทำแบบทดสอบก่อนเรียน");
        } else {
          const first = p.postTestScore === null;
          p.postTestScore = Math.max(p.postTestScore ?? 0, score);
          saveState();
          addXP(first ? 100 : 30, "ทำแบบทดสอบหลังเรียน");
        }
        checkAllBadges();
        SoundFX.victory();

        const diff = (p.postTestScore ?? 0) - (p.preTestScore ?? 0);
        main.innerHTML = `
          <div class="card" style="max-width:680px; margin:20px auto; text-align:center; padding:34px 26px;">
            <div style="font-size:58px; margin-bottom:8px;">${isPre ? "🚀" : "🎓"}</div>
            <h2>สรุปผลแบบทดสอบ${isPre ? "ก่อนเรียน (Pre-Test)" : "หลังเรียน (Post-Test)"}</h2>
            <div style="font-family:var(--font-head); font-size:40px; font-weight:800; color:var(--primary); margin:12px 0;">
              ${score} / ${questions.length} คะแนน (${Math.round((score / questions.length) * 100)}%)
            </div>
            ${!isPre && p.preTestScore !== null ? `
              <div class="card" style="background:var(--surface-soft); margin:18px 0; padding:16px;">
                <div style="font-family:var(--font-head); font-weight:700; margin-bottom:8px;">📈 เปรียบเทียบพัฒนาการก่อนเรียน – หลังเรียน</div>
                <div style="display:flex; justify-content:center; gap:24px; font-size:16px;">
                  <span>ก่อนเรียน: <strong>${p.preTestScore}/13</strong></span>
                  <span>➔</span>
                  <span>หลังเรียน: <strong style="color:var(--success);">${score}/13</strong></span>
                  <span class="mini-pill ok">${diff >= 0 ? `+${diff}` : diff} คะแนน</span>
                </div>
              </div>
            ` : ""}
            <p style="color:var(--text-muted); margin-bottom:22px;">
              ${isPre ? "ยอดเยี่ยม! ตอนนี้คุณพร้อมลุยภารกิจทั้ง 13 บทเรียนแล้ว มาดูกันว่าหลังเรียนจบคะแนนจะพุ่งขึ้นแค่ไหน!" : "ยินดีด้วย! คุณสามารถตรวจสอบเหรียญตราและพิมพ์ใบเกียรติบัตรดิจิทัลได้เลย"}
            </p>
            <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
              <button class="btn btn-primary" onclick="App.navigate('dashboard')">🗺️ กลับแผนที่ 13 บทเรียน</button>
              ${!isPre ? `<button class="btn btn-success" onclick="App.navigate('certificate')">📜 ดูใบเกียรติบัตรดิจิทัล</button>` : ""}
            </div>
          </div>
        `;
        return;
      }

      const q = questions[idx];
      main.innerHTML = `
        <div style="max-width:760px; margin:0 auto;">
          <div style="margin-bottom:14px;">
            <button class="btn btn-outline btn-sm" onclick="App.navigate('dashboard')">← ยกเลิกกลับหน้าหลัก</button>
          </div>
          <div class="mg-stage">
            <div class="mg-header-bar">
              <div>
                <h3>${isPre ? "📝 แบบทดสอบก่อนเรียนรวม (Pre-Test)" : "🎓 แบบทดสอบหลังเรียนรวม (Post-Test)"}</h3>
                <div style="font-size:13px; color:var(--text-muted);">วัดความรู้ครบทั้ง 13 บทเรียน (บทละ 1 ข้อ)</div>
              </div>
              <span class="mini-pill">ข้อ ${idx + 1} / ${questions.length}</span>
            </div>

            <div class="xp-bar-wrap" style="margin-bottom:18px; height:10px;">
              <div class="xp-bar-fill" style="width:${Math.round(((idx) / questions.length) * 100)}%"></div>
            </div>

            <p style="font-size:17px; font-weight:700; margin-bottom:16px;">${idx + 1}. ${q.q}</p>

            <div class="choice-list">
              ${q.options.map((op, i) => `
                <button class="choice-btn assess-opt" data-idx="${i}">
                  <span class="choice-letter">${letters[i]}</span>
                  <span>${op}</span>
                </button>
              `).join("")}
            </div>
            <div id="assess-fb"></div>
          </div>
        </div>
      `;

      main.querySelectorAll(".assess-opt").forEach(btn => {
        btn.onclick = () => {
          const picked = Number(btn.dataset.idx);
          const correct = picked === q.answer;
          if (correct) score++;

          if (isPre) {
            SoundFX.click();
            idx++;
            renderStep();
          } else {
            // Post-Test shows immediate explanation for reinforcement
            main.querySelectorAll(".assess-opt").forEach(b => b.disabled = true);
            const fb = main.querySelector("#assess-fb");
            if (correct) {
              SoundFX.correct();
              btn.classList.add("correct");
              fb.innerHTML = `<div class="mg-feedback ok">✅ <strong>ถูกต้อง!</strong> ${q.explain}<div style="margin-top:10px;"><button class="btn btn-success btn-sm" id="assess-next">ข้อต่อไป ➔</button></div></div>`;
            } else {
              SoundFX.wrong();
              btn.classList.add("wrong");
              main.querySelector(`.assess-opt[data-idx="${q.answer}"]`).classList.add("correct");
              fb.innerHTML = `<div class="mg-feedback err">❌ <strong>เฉลยข้อ ${letters[q.answer]}:</strong> ${q.explain}<div style="margin-top:10px;"><button class="btn btn-primary btn-sm" id="assess-next">ข้อต่อไป ➔</button></div></div>`;
            }
            main.querySelector("#assess-next").onclick = () => { idx++; renderStep(); };
          }
        };
      });
    }
    renderStep();
  }

  // ---------- Profile & Badges View ----------
  function renderProfile() {
    const p = getActivePlayer();
    if (!p) return navigate("welcome");
    const av = window.GAME_DATA.avatars.find(a => a.id === p.avatarId) || window.GAME_DATA.avatars[0];
    const rank = getRank(p.xp);
    const main = document.getElementById("app-main");

    main.innerHTML = `
      <div style="margin-bottom:16px;">
        <button class="btn btn-outline btn-sm" onclick="App.navigate('dashboard')">← กลับแผนที่ภารกิจ</button>
      </div>

      <div class="card" style="display:flex; align-items:center; gap:20px; flex-wrap:wrap; margin-bottom:22px;">
        <div class="hud-avatar" style="width:80px; height:80px; font-size:40px; background:${av.bg}">${renderAvatarContent(av)}</div>
        <div style="flex:1;">
          <span class="badge-pill">รหัสนักศึกษา ${p.studentId} • ${p.classRoom} (${p.department})</span>
          <h2 style="font-size:24px; margin-top:4px;">${p.name}</h2>
          <div style="font-size:15px; color:${rank.color}; font-weight:700; font-family:var(--font-head);">
            ${rank.icon} Lv.${rank.level} ${rank.title} (${rank.eng}) — ${p.xp} XP
          </div>
        </div>
        <button class="btn btn-primary" onclick="App.navigate('certificate')">📜 ดูเกียรติบัตรดิจิทัล</button>
      </div>

      <h3 style="margin-bottom:12px;">🏅 เหรียญตราความสำเร็จ (${(p.badges || []).length} / ${window.GAME_DATA.badges.length})</h3>
      <div class="badges-grid" style="margin-bottom:28px;">
        ${window.GAME_DATA.badges.map(b => {
          const unlocked = (p.badges || []).includes(b.id);
          return `
            <div class="badge-card ${unlocked ? "unlocked" : "locked"}">
              <div class="badge-icon-big">${b.icon}</div>
              <div style="font-family:var(--font-head); font-weight:700; font-size:15px; margin-bottom:4px;">${b.title}</div>
              <div style="font-size:12px; color:var(--text-muted);">${b.desc}</div>
              <div style="margin-top:8px;">
                <span class="mini-pill ${unlocked ? "ok" : ""}">${unlocked ? "✓ ปลดล็อกแล้ว" : "🔒 ยังไม่ปลดล็อก"}</span>
              </div>
            </div>
          `;
        }).join("")}
      </div>

      <h3 style="margin-bottom:12px;">🎖️ เส้นทางเลื่อนตำแหน่งงาน (6 Career Ranks)</h3>
      <div class="card">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(170px, 1fr)); gap:10px;">
          ${window.GAME_DATA.ranks.map(r => {
            const reached = p.xp >= r.minXp;
            return `
              <div class="rank-step-card ${reached ? "reached" : ""}" style="border-color:${reached ? r.color : "var(--border)"};">
                <div style="font-size:28px;">${r.icon}</div>
                <div style="font-family:var(--font-head); font-weight:700; font-size:13px;">Lv.${r.level} ${r.title}</div>
                <div style="font-size:12px; color:var(--text-muted);">${r.minXp} XP+</div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  // ---------- Printable Certificate View ----------
  function renderCertificate() {
    const p = getActivePlayer();
    if (!p) return navigate("welcome");
    const rank = getRank(p.xp);
    const doneCnt = countCompletedUnits(p);
    const now = new Date();
    const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const dateStr = `${now.getDate()} ${thaiMonths[now.getMonth()]} พ.ศ. ${now.getFullYear() + 543}`;
    const main = document.getElementById("app-main");

    main.innerHTML = `
      <div class="no-print" style="margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <button class="btn btn-outline btn-sm" onclick="App.navigate('dashboard')">← กลับแผนที่ภารกิจ</button>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-primary" onclick="window.print()">🖨️ พิมพ์ / บันทึกเกียรติบัตรเป็น PDF</button>
        </div>
      </div>

      <div class="cert-frame">
        <div class="cert-seal">🏆</div>
        <div style="font-family:var(--font-head); font-size:14px; letter-spacing:2px; color:#d97706; font-weight:700;">CERTIFICATE OF ACHIEVEMENT</div>
        <h1 style="font-size:32px; color:#1e1b4b; margin:6px 0;">เกียรติบัตรดิจิทัล</h1>
        <p style="font-size:16px; color:#475569;">ขอมอบเกียรติบัตรฉบับนี้ให้ไว้เพื่อแสดงว่า</p>

        <div class="cert-student-name">${p.name}</div>
        <p style="font-size:15px; color:#334155; margin-top:6px;">
          รหัสนักศึกษา <strong>${p.studentId}</strong> • ระดับชั้น <strong>${p.classRoom}</strong> • สาขาวิชา <strong>${p.department}</strong>
        </p>

        <p style="font-size:16px; color:#1e293b; max-width:650px; margin:18px auto; line-height:1.8;">
          ได้เข้าร่วมกิจกรรมการเรียนรู้แบบเกมมิฟิเคชัน <strong>OfficeQuest 13</strong><br/>
          รายวิชา <strong>การใช้เครื่องใช้สำนักงานดิจิทัล (ระดับประกาศนียบัตรวิชาชีพ ปวช.)</strong><br/>
          สำเร็จภารกิจจำนวน <strong>${doneCnt} จาก 13 บทเรียน</strong> ได้รับตำแหน่งเกียรติยศ <strong>"${rank.title} (${rank.eng})"</strong>
        </p>

        <div style="display:inline-flex; gap:18px; flex-wrap:wrap; justify-content:center; background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:12px 24px; margin:10px 0 22px; font-size:14px;">
          <span>⚡ คะแนนสะสม: <strong>${p.xp} XP</strong></span>
          <span>🏅 เหรียญตรา: <strong>${(p.badges || []).length}/${window.GAME_DATA.badges.length}</strong></span>
          <span>📝 Pre-Test: <strong>${p.preTestScore ?? "-"}/13</strong></span>
          <span>🎓 Post-Test: <strong>${p.postTestScore ?? "-"}/13</strong></span>
        </div>

        <p style="font-size:14px; color:#64748b;">ออกให้ ณ วันที่ ${dateStr}</p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; max-width:560px; margin:34px auto 0;">
          <div>
            <div style="border-bottom:1px solid #94a3b8; height:28px;"></div>
            <div style="font-size:13px; color:#475569; margin-top:6px;">ลงชื่อ ครูผู้สอนรายวิชา</div>
          </div>
          <div>
            <div style="border-bottom:1px solid #94a3b8; height:28px;"></div>
            <div style="font-size:13px; color:#475569; margin-top:6px;">หัวหน้าแผนกวิชา</div>
          </div>
        </div>
      </div>
    `;
  }

  // ---------- Teacher Mode Auth ----------
  function openTeacherAuth() {
    SoundFX.click();
    if (isTeacherMode) {
      navigate("teacher");
      return;
    }
    showModal(`
      <div style="font-size:48px; margin-bottom:6px;">👩‍🏫</div>
      <h2 style="margin-bottom:6px;">เข้าสู่โหมดครูผู้สอน</h2>
      <p style="font-size:14px; color:var(--text-muted); margin-bottom:16px;">กรอกรหัสผ่านครูผู้สอน</p>
      <input type="password" id="teacher-pass-input" class="form-control" placeholder="กรอกรหัสผ่าน..." style="text-align:center; font-size:18px; letter-spacing:4px; margin-bottom:14px;" />
      <div id="teacher-auth-err" style="color:var(--danger); font-size:13px; margin-bottom:10px;"></div>
      <div style="display:flex; gap:10px; justify-content:center;">
        <button class="btn btn-outline" onclick="App.closeModal()">ยกเลิก</button>
        <button class="btn btn-primary" id="btn-teacher-login">เข้าสู่ระบบครู</button>
      </div>
    `);
    const inp = document.getElementById("teacher-pass-input");
    inp.focus();
    const doLogin = () => {
      if (inp.value.trim() === TeacherModule.getPassword()) {
        SoundFX.correct();
        closeModal();
        isTeacherMode = true;
        currentView = "teacher";
        render();
        showToast("👩‍🏫 เข้าสู่โหมดครูผู้สอนแล้ว (ดูได้ทุกหน้า + ล็อกด่านได้)", "xp");
      } else {
        SoundFX.wrong();
        document.getElementById("teacher-auth-err").textContent = "❌ รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
      }
    };
    document.getElementById("btn-teacher-login").onclick = doLogin;
    inp.onkeydown = (e) => { if (e.key === "Enter") doLogin(); };
  }

  function exitTeacherMode() {
    SoundFX.click();
    isTeacherMode = false;
    const realStudent = players.find(p => p.id === activePlayerId) || null;
    navigate(realStudent ? "dashboard" : "welcome");
  }

  function logoutStudent() {
    SoundFX.click();
    if (isTeacherMode) {
      return exitTeacherMode();
    }
    if (window.CloudSync) CloudSync.logout();
    activePlayerId = null;
    saveState(true);
    navigate("welcome");
  }

  function setZoneFilter(zId) {
    SoundFX.click();
    selectedZoneFilter = zId;
    renderDashboard();
  }

  // ---------- Navigation Router ----------
  function navigate(view) {
    if (view === "arcade" && !isTeacherMode && courseSettings.lockArcade) {
      SoundFX.wrong();
      showToast("🔒 หมวดมินิเกมส์ถูกล็อกโดยครูผู้สอน กรุณารอครูเปิดใช้งาน", "");
      return;
    }
    if (window.ArcadeModule) ArcadeModule.stopTimer();
    currentView = view;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function render() {
    renderHUD();
    const main = document.getElementById("app-main");
    if (currentView === "welcome") return renderWelcome();
    if (currentView === "dashboard") return renderDashboard();
    if (currentView === "arcade") {
      ArcadeModule.render(main);
      refreshCloudPlayers().then(ok => {
        if (ok && currentView === "arcade") ArcadeModule.render(main);
      });
      return;
    }
    if (currentView === "unit") return renderUnitView();
    if (currentView === "profile") return renderProfile();
    if (currentView === "certificate") return renderCertificate();
    if (currentView === "teacher") {
      TeacherModule.render(main);
      refreshCloudPlayers().then(ok => {
        if (ok && currentView === "teacher") TeacherModule.render(main);
      });
      return;
    }
  }

  function init() {
    loadTheme();
    loadCourseSettings();
    loadState();
    currentView = getActivePlayer() ? "dashboard" : "welcome";
    render();

    if (window.CloudSync && CloudSync.isAvailable()) {
      CloudSync.onAuthStateReady((cloudPlayer) => {
        if (cloudPlayer) {
          upsertPlayer(cloudPlayer);
          activePlayerId = cloudPlayer.id;
          saveState(true);
          if (currentView === "welcome") currentView = "dashboard";
          render();
        }
        CloudSync.subscribeCourseSettings(applyCourseSettings);
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    navigate, openUnit, openUnitTab, startAssessment, setZoneFilter,
    toggleSound, toggleTheme, openTeacherAuth, exitTeacherMode, logoutStudent,
    showToast, showModal, closeModal,
    getActivePlayer, getAllPlayers, deletePlayer, getRank, countCompletedUnits,
    recordArcadeResult,
    isTeacher, getCourseSettings, isUnitLocked, toggleUnitLock, saveCourseSettings
  };
})();
