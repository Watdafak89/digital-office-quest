// OfficeQuest Minigames Engine — รองรับ 7 รูปแบบมินิเกมจำลองสถานการณ์ครบทั้ง 13 บทเรียน

window.MiniGames = (function () {
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function renderCompleteCard(container, title, scoreText, xpEarned, onDone) {
    SoundFX.victory();
    container.innerHTML = `
      <div class="mg-stage" style="text-align:center; padding:32px 22px;">
        <div style="font-size:56px; margin-bottom:8px;">🎉</div>
        <h2 style="color:var(--success); margin-bottom:6px;">ภารกิจปฏิบัติสำเร็จ!</h2>
        <p style="font-size:16px; color:var(--text-muted); margin-bottom:16px;">${title}</p>
        <div style="display:inline-flex; gap:12px; flex-wrap:wrap; justify-content:center; margin-bottom:22px;">
          <span class="mini-pill ok" style="font-size:14px; padding:6px 14px;">✅ ผลการปฏิบัติ: ${scoreText}</span>
          <span class="mini-pill" style="font-size:14px; padding:6px 14px; background:#eef2ff; color:#4f46e5; border-color:#c7d2fe;">⚡ ได้รับ +${xpEarned} XP</span>
        </div>
        <div>
          <button class="btn btn-primary" id="mg-finish-next">ไปทำแบบทดสอบท้ายบทเรียน ➔</button>
        </div>
      </div>
    `;
    container.querySelector("#mg-finish-next").onclick = () => {
      SoundFX.click();
      onDone();
    };
  }

  // =========================================================================
  // 1. CLASSIFIER ENGINE (Units 1, 2, 8)
  // =========================================================================
  function runClassifier(unit, container, onComplete) {
    const items = shuffle(unit.minigameData.items);
    const cats = unit.minigameData.categories;
    let idx = 0;
    let correctFirstTry = 0;
    let triedWrongCurrent = false;

    function render() {
      if (idx >= items.length) {
        const xp = 60 + correctFirstTry * 10;
        onComplete({ score: correctFirstTry, maxScore: items.length, xp });
        renderCompleteCard(container, unit.minigameTitle, `${correctFirstTry}/${items.length} (ตอบถูกทันที)`, xp, () => App.openUnitTab("quiz"));
        return;
      }
      const item = items[idx];
      container.innerHTML = `
        <div class="mg-stage">
          <div class="mg-header-bar">
            <div>
              <h3>${unit.icon} ${unit.minigameTitle}</h3>
              <div style="font-size:13px; color:var(--text-muted);">${unit.minigameDesc}</div>
            </div>
            <span class="mini-pill">ชิ้นที่ ${idx + 1} / ${items.length}</span>
          </div>

          <div class="classifier-item-card">
            <div style="font-size:48px; margin-bottom:6px;">${item.emoji}</div>
            <h3 style="font-size:20px; margin-bottom:6px;">${item.name}</h3>
            <p style="font-size:14px; color:var(--text-muted);">${item.desc}</p>
          </div>

          <p style="text-align:center; font-family:var(--font-head); font-size:14px; margin-bottom:12px; color:var(--text-muted);">
            👇 คลิกเลือกหมวดหมู่ที่ถูกต้องสำหรับอุปกรณ์ชิ้นนี้
          </p>

          <div class="classifier-bins">
            ${cats.map(c => `
              <button class="bin-btn" data-cat="${c.id}" style="border-top: 4px solid ${c.color};">
                <div style="font-size:28px; margin-bottom:4px;">${c.icon}</div>
                <div style="font-family:var(--font-head); font-weight:700; font-size:14px;">${c.label}</div>
              </button>
            `).join("")}
          </div>

          <div id="mg-fb"></div>
        </div>
      `;

      container.querySelectorAll(".bin-btn").forEach(btn => {
        btn.onclick = () => {
          const chosen = btn.dataset.cat;
          const fb = container.querySelector("#mg-fb");
          if (chosen === item.cat) {
            SoundFX.correct();
            if (!triedWrongCurrent) correctFirstTry++;
            fb.innerHTML = `
              <div class="mg-feedback ok">
                ✅ <strong>ถูกต้อง!</strong> ${item.reason}
                <div style="margin-top:10px;">
                  <button class="btn btn-success btn-sm" id="mg-next-item">ข้อต่อไป ➔</button>
                </div>
              </div>
            `;
            container.querySelectorAll(".bin-btn").forEach(b => b.disabled = true);
            container.querySelector("#mg-next-item").onclick = () => {
              idx++;
              triedWrongCurrent = false;
              render();
            };
          } else {
            SoundFX.wrong();
            triedWrongCurrent = true;
            fb.innerHTML = `<div class="mg-feedback err">❌ ยังไม่ใช่นะครับ ลองพิจารณาหน้าที่หลักของ "${item.name}" แล้วเลือกหมวดหมู่อีกครั้ง!</div>`;
          }
        };
      });
    }
    render();
  }

  // =========================================================================
  // 2. SCENARIO ENGINE (Units 3, 4, 9)
  // =========================================================================
  function runScenario(unit, container, onComplete) {
    const scenarios = unit.minigameData.scenarios;
    let idx = 0;
    let score = 0;
    let wrongThisStep = false;

    function render() {
      if (idx >= scenarios.length) {
        const xp = 60 + score * 15;
        onComplete({ score, maxScore: scenarios.length, xp });
        renderCompleteCard(container, unit.minigameTitle, `${score}/${scenarios.length} สถานการณ์`, xp, () => App.openUnitTab("quiz"));
        return;
      }
      const sc = scenarios[idx];
      const letters = ["ก", "ข", "ค", "ง"];
      container.innerHTML = `
        <div class="mg-stage">
          <div class="mg-header-bar">
            <div>
              <h3>${unit.icon} ${sc.title}</h3>
              <div style="font-size:13px; color:var(--text-muted);">${unit.minigameDesc}</div>
            </div>
            <span class="mini-pill">ด่าน ${idx + 1} / ${scenarios.length}</span>
          </div>

          <div class="visual-banner">${sc.visual}</div>
          <p style="font-size:16px; font-weight:600; margin-bottom:14px;">${sc.scene}</p>

          <div class="choice-list">
            ${sc.choices.map((ch, i) => `
              <button class="choice-btn" data-idx="${i}">
                <span class="choice-letter">${letters[i]}</span>
                <span>${ch.text}</span>
              </button>
            `).join("")}
          </div>
          <div id="mg-fb"></div>
        </div>
      `;

      container.querySelectorAll(".choice-btn").forEach(btn => {
        btn.onclick = () => {
          const ch = sc.choices[Number(btn.dataset.idx)];
          const fb = container.querySelector("#mg-fb");
          if (ch.correct) {
            SoundFX.correct();
            btn.classList.add("correct");
            if (!wrongThisStep) score++;
            container.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);
            fb.innerHTML = `
              <div class="mg-feedback ok">
                ✅ <strong>ยอดเยี่ยม!</strong> ${ch.feedback}
                <div style="margin-top:10px;">
                  <button class="btn btn-success btn-sm" id="mg-next-sc">${idx + 1 < scenarios.length ? "สถานการณ์ถัดไป ➔" : "สรุปผลภารกิจ ➔"}</button>
                </div>
              </div>
            `;
            container.querySelector("#mg-next-sc").onclick = () => {
              idx++;
              wrongThisStep = false;
              render();
            };
          } else {
            SoundFX.wrong();
            wrongThisStep = true;
            btn.classList.add("wrong");
            btn.disabled = true;
            fb.innerHTML = `<div class="mg-feedback err">❌ <strong>ยังไม่เหมาะสม:</strong> ${ch.feedback} ลองเลือกใหม่นะครับ</div>`;
          }
        };
      });
    }
    render();
  }

  // =========================================================================
  // 3. CALCULATOR SIMULATOR ENGINE (Unit 5)
  // =========================================================================
  function runCalcSim(unit, container, onComplete) {
    const challenges = unit.minigameData.challenges;
    let idx = 0;
    let score = 0;
    let wrongCur = false;
    let expr = "";
    let display = "0";

    const keyLayout = [
      { k: "MC", cls: "fn" }, { k: "MR", cls: "fn" }, { k: "M-", cls: "fn" }, { k: "M+", cls: "fn" },
      { k: "GT", cls: "warn" }, { k: "MU", cls: "warn" }, { k: "CE", cls: "warn" }, { k: "C", cls: "fn" },
      { k: "7", cls: "" }, { k: "8", cls: "" }, { k: "9", cls: "" }, { k: "÷", cls: "op" },
      { k: "4", cls: "home-key" }, { k: "5", cls: "home-key" }, { k: "6", cls: "home-key" }, { k: "×", cls: "op" },
      { k: "1", cls: "" }, { k: "2", cls: "" }, { k: "3", cls: "" }, { k: "-", cls: "op" },
      { k: "0", cls: "" }, { k: ".", cls: "" }, { k: "=", cls: "op" }, { k: "+", cls: "op" }
    ];

    function render() {
      if (idx >= challenges.length) {
        const xp = 70 + score * 15;
        onComplete({ score, maxScore: challenges.length, xp });
        renderCompleteCard(container, unit.minigameTitle, `${score}/${challenges.length} ภารกิจเครื่องคำนวณ`, xp, () => App.openUnitTab("quiz"));
        return;
      }
      const ch = challenges[idx];
      container.innerHTML = `
        <div class="mg-stage">
          <div class="mg-header-bar">
            <div>
              <h3>🧮 ${unit.minigameTitle}</h3>
              <div style="font-size:13px; color:var(--text-muted);">กรอบสีน้ำเงินที่เลข 4-5-6 คือตำแหน่งแป้นเหย้า (Home Keys) ของนิ้วชี้-กลาง-นาง</div>
            </div>
            <span class="mini-pill">ภารกิจ ${idx + 1} / ${challenges.length}</span>
          </div>

          <div class="card" style="background:var(--primary-soft); border-color:#c7d2fe; margin-bottom:18px; padding:16px;">
            <div style="font-family:var(--font-head); font-weight:700; color:var(--primary-dark); margin-bottom:4px;">${ch.prompt}</div>
            <div style="font-size:13px; color:var(--text-muted);">💡 คำใบ้: ${ch.hint}</div>
          </div>

          <div class="calc-device">
            <div class="calc-lcd" id="calc-lcd">${display}</div>
            <div class="calc-keys">
              ${keyLayout.map(btn => `
                <button class="calc-key ${btn.cls}" data-k="${btn.k}">
                  ${btn.k}${btn.k === "5" ? "•" : ""}
                </button>
              `).join("")}
            </div>
          </div>

          <div id="mg-fb"></div>
        </div>
      `;

      const lcd = container.querySelector("#calc-lcd");
      const fb = container.querySelector("#mg-fb");

      container.querySelectorAll(".calc-key").forEach(btn => {
        btn.onclick = () => {
          const k = btn.dataset.k;
          SoundFX.calcKey();

          if (ch.type === "press_key") {
            lcd.textContent = `KEY: ${k}`;
            if (k === ch.targetKey) {
              SoundFX.correct();
              if (!wrongCur) score++;
              container.querySelectorAll(".calc-key").forEach(b => b.disabled = true);
              fb.innerHTML = `
                <div class="mg-feedback ok">
                  ✅ <strong>ถูกต้อง!</strong> ${ch.successMsg}
                  <div style="margin-top:10px;"><button class="btn btn-success btn-sm" id="mg-next-calc">ภารกิจถัดไป ➔</button></div>
                </div>
              `;
              container.querySelector("#mg-next-calc").onclick = () => {
                idx++;
                wrongCur = false;
                expr = "";
                display = "0";
                render();
              };
            } else {
              SoundFX.wrong();
              wrongCur = true;
              fb.innerHTML = `<div class="mg-feedback err">❌ ปุ่ม "${k}" ยังไม่ตรงกับภารกิจครับ ลองอ่านคำใบ้และกดใหม่!</div>`;
            }
          } else if (ch.type === "compute") {
            if (k === "C" || k === "CE") {
              expr = "";
              display = "0";
              lcd.textContent = display;
              return;
            }
            if (k === "=") {
              try {
                const safeExpr = expr.replace(/×/g, "*").replace(/÷/g, "/");
                if (!/^[0-9+\-*/.\s]+$/.test(safeExpr)) throw new Error();
                const res = Function('"use strict";return (' + safeExpr + ')')();
                lcd.textContent = String(res);
                if (Math.abs(res - ch.expectedResult) < 0.001) {
                  SoundFX.correct();
                  if (!wrongCur) score++;
                  container.querySelectorAll(".calc-key").forEach(b => b.disabled = true);
                  fb.innerHTML = `
                    <div class="mg-feedback ok">
                      ✅ <strong>คำนวณถูกต้อง!</strong> ${ch.successMsg}
                      <div style="margin-top:10px;"><button class="btn btn-success btn-sm" id="mg-next-calc">สรุปผลภารกิจ ➔</button></div>
                    </div>
                  `;
                  container.querySelector("#mg-next-calc").onclick = () => {
                    idx++;
                    render();
                  };
                } else {
                  SoundFX.wrong();
                  wrongCur = true;
                  fb.innerHTML = `<div class="mg-feedback err">❌ ได้ผลลัพธ์ ${res} ยังไม่ใช่ ${ch.expectedResult} ครับ กดปุ่ม C แล้วลองกด 250 × 4 = ใหม่อีกครั้ง!</div>`;
                  expr = "";
                }
              } catch {
                lcd.textContent = "ERR";
                expr = "";
              }
              return;
            }
            if (/^[0-9.+\-×÷]$/.test(k)) {
              expr += k;
              display = expr;
              lcd.textContent = display;
            }
          }
        };
      });
    }
    render();
  }

  // =========================================================================
  // 4. COPIER & FAX PANEL SIMULATOR ENGINE (Units 6 & 10)
  // =========================================================================
  function runPanelSim(unit, container, onComplete) {
    const isCopier = unit.minigameData.deviceType === "copier";
    const orders = unit.minigameData.orders;
    let idx = 0;
    let score = 0;
    let wrongCur = false;

    const copierFields = [
      { key: "paper", label: "ขนาดกระดาษ (Paper Size)", opts: ["A4", "A3"] },
      { key: "zoom", label: "อัตราส่วนย่อ-ขยาย (Zoom)", opts: ["100%", "70% (A3→A4)", "141% (A4→A3)"] },
      { key: "duplex", label: "รูปแบบหน้า (Simplex / Duplex)", opts: ["1 หน้า", "2 หน้า"] },
      { key: "collate", label: "การเรียงชุดอัตโนมัติ (Collate)", opts: ["เปิดเรียงชุด", "ปิดเรียงชุด"] }
    ];

    const faxFields = [
      { key: "res", label: "ความละเอียดการสแกนส่งแฟกซ์ (Resolution)", opts: ["Standard (ปกติ)", "Fine (ตัวอักษรเล็ก)", "Photo (ภาพถ่าย)"] },
      { key: "feed", label: "การเตรียมเอกสารก่อนสอดเข้าถาด (Paper Feed)", opts: ["ถอดลวดเย็บ + วางตามสัญลักษณ์", "สอดทั้งลวดเย็บกระดาษเลย"] },
      { key: "mode", label: "การตรวจสอบผลการส่ง (Confirmation)", opts: ["ส่งแฟกซ์ + ขอใบยืนยัน (Report)", "ส่งแล้วปิดเครื่องทันทีไม่ต้องดูผล"] }
    ];

    const fields = isCopier ? copierFields : faxFields;
    let state = {};

    function resetState() {
      state = {};
      fields.forEach(f => { state[f.key] = f.opts[0]; });
    }
    resetState();

    function render() {
      if (idx >= orders.length) {
        const xp = 70 + score * 15;
        onComplete({ score, maxScore: orders.length, xp });
        renderCompleteCard(container, unit.minigameTitle, `${score}/${orders.length} ใบสั่งงาน`, xp, () => App.openUnitTab("quiz"));
        return;
      }
      const ord = orders[idx];
      container.innerHTML = `
        <div class="mg-stage">
          <div class="mg-header-bar">
            <div>
              <h3>${unit.icon} ${unit.minigameTitle}</h3>
              <div style="font-size:13px; color:var(--text-muted);">${unit.minigameDesc}</div>
            </div>
            <span class="mini-pill">ใบงาน ${idx + 1} / ${orders.length}</span>
          </div>

          <div class="card" style="background:#fef3c7; border-color:#fcd34d; margin-bottom:18px; padding:16px; display:flex; gap:12px; align-items:flex-start;">
            <div style="font-size:34px;">${ord.avatar}</div>
            <div>
              <div style="font-family:var(--font-head); font-weight:700; color:#92400e;">ใบสั่งงานจาก ${ord.requester}</div>
              <p style="font-size:15px; color:#78350f; margin-top:4px;">"${ord.request}"</p>
            </div>
          </div>

          <div class="panel-device">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <span style="font-family:var(--font-head); font-weight:700; color:#38bdf8;">⚡ ${unit.minigameData.deviceName}</span>
              <span style="font-size:12px; color:#4ade80;">● READY</span>
            </div>

            <div class="panel-screen">
              ${fields.map(f => `
                <div class="panel-control-group">
                  <div class="panel-control-label">${f.label}</div>
                  <div class="panel-btn-row">
                    ${f.opts.map(opt => `
                      <button class="panel-opt-btn ${state[f.key] === opt ? "selected" : ""}" data-key="${f.key}" data-val="${opt}">${opt}</button>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div style="font-size:12px; color:#94a3b8;">ตรวจสอบค่าให้ครบทุกช่องแล้วกดปุ่ม START สีเขียว</div>
              <button class="btn btn-success" id="btn-panel-start">▶ ${isCopier ? "START ถ่ายเอกสาร" : "START ส่งโทรสาร (FAX)"}</button>
            </div>
          </div>

          <div id="mg-fb"></div>
        </div>
      `;

      container.querySelectorAll(".panel-opt-btn").forEach(btn => {
        btn.onclick = () => {
          SoundFX.click();
          state[btn.dataset.key] = btn.dataset.val;
          render();
        };
      });

      container.querySelector("#btn-panel-start").onclick = () => {
        const fb = container.querySelector("#mg-fb");
        const allMatch = Object.keys(ord.target).every(k => state[k] === ord.target[k]);
        if (allMatch) {
          SoundFX.correct();
          if (!wrongCur) score++;
          container.querySelector("#btn-panel-start").disabled = true;
          fb.innerHTML = `
            <div class="mg-feedback ok">
              ✅ <strong>ตั้งค่าสมบูรณ์แบบ!</strong> ${isCopier ? "เครื่องถ่ายเอกสารทำงานเรียบร้อยตรงตามใบสั่งงาน!" : "ส่งโทรสารถึงปลายทางคมชัดและได้รับใบยืนยันแล้ว!"}
              <div style="margin-top:10px;"><button class="btn btn-success btn-sm" id="mg-next-ord">${idx + 1 < orders.length ? "ใบงานถัดไป ➔" : "สรุปผลภารกิจ ➔"}</button></div>
            </div>
          `;
          container.querySelector("#mg-next-ord").onclick = () => {
            idx++;
            wrongCur = false;
            resetState();
            render();
          };
        } else {
          SoundFX.wrong();
          wrongCur = true;
          fb.innerHTML = `<div class="mg-feedback err">❌ ยังตั้งค่าไม่ตรงตามใบสั่งงานบางรายการครับ ลองเช็กดูอีกครั้ง (คำใบ้: ${ord.hint})</div>`;
        }
      };
    }
    render();
  }

  // =========================================================================
  // 5. POS CASH REGISTER & BARCODE SIMULATOR (Unit 7)
  // =========================================================================
  function runPosSim(unit, container, onComplete) {
    const data = unit.minigameData;
    const scanned = new Set();
    let step = "scan"; // scan -> change -> quiz
    let errors = 0;

    function render() {
      const total = data.products.filter(p => scanned.has(p.code)).reduce((s, p) => s + p.price, 0);

      if (step === "done") {
        const score = Math.max(1, 3 - errors);
        const xp = 75 + score * 10;
        onComplete({ score, maxScore: 3, xp });
        renderCompleteCard(container, unit.minigameTitle, "สแกนรหัสแท่ง คิดเงินทอน และตอบคำถาม EAN-13 สำเร็จ!", xp, () => App.openUnitTab("quiz"));
        return;
      }

      container.innerHTML = `
        <div class="mg-stage">
          <div class="mg-header-bar">
            <div>
              <h3>💵 ${unit.minigameTitle}</h3>
              <div style="font-size:13px; color:var(--text-muted);">${unit.minigameDesc}</div>
            </div>
            <span class="mini-pill">${step === "scan" ? "ขั้น 1/3: สแกนบาร์โค้ด" : step === "change" ? "ขั้น 2/3: ทอนเงิน" : "ขั้น 3/3: รหัส EAN-13"}</span>
          </div>

          ${step === "scan" || step === "change" ? `
            <div class="pos-layout">
              <div>
                <h4 style="margin-bottom:10px;">🛒 สินค้าที่เคาน์เตอร์ (คลิกปุ่มสแกนบาร์โค้ดให้ครบ 3 ชิ้น)</h4>
                <div style="display:grid; gap:10px;">
                  ${data.products.map(p => {
                    const isScanned = scanned.has(p.code);
                    return `
                      <div class="card" style="padding:13px; display:flex; align-items:center; justify-content:space-between; gap:10px; ${isScanned ? "background:#ecfdf5; border-color:#6ee7b7;" : ""}">
                        <div>
                          <div style="font-family:var(--font-head); font-weight:700;">${p.emoji} ${p.name} — ${p.price} ฿</div>
                          <div style="margin-top:4px; display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                            <div class="barcode-lines">
                              <span style="width:2px"></span><span style="width:1px"></span><span style="width:3px"></span><span style="width:1px"></span><span style="width:2px"></span><span style="width:3px"></span><span style="width:1px"></span><span style="width:2px"></span>
                            </div>
                            <code style="font-size:12px; color:#334155;">${p.code}</code>
                            <span class="mini-pill">${p.country}</span>
                          </div>
                        </div>
                        <button class="btn btn-sm ${isScanned ? "btn-success" : "btn-primary"} btn-scan" data-code="${p.code}" ${isScanned ? "disabled" : ""}>
                          ${isScanned ? "✓ สแกนแล้ว" : "📡 สแกน"}
                        </button>
                      </div>
                    `;
                  }).join("")}
                </div>
              </div>

              <div class="pos-receipt">
                <div style="text-align:center; font-weight:700; border-bottom:1px dashed #b45309; padding-bottom:8px; margin-bottom:10px;">
                  🧾 OFFICEQUEST POS RECEIPT<br/><small>ระบบขายปลีกหน้าร้าน (POS)</small>
                </div>
                ${scanned.size === 0 ? `<div style="color:#92400e; text-align:center; padding:16px 0;">รอสแกนบาร์โค้ดสินค้า...</div>` : ""}
                ${data.products.filter(p => scanned.has(p.code)).map(p => `
                  <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:6px;">
                    <span>${p.name}</span><span>${p.price}.00</span>
                  </div>
                `).join("")}
                <div style="border-top:1px dashed #b45309; margin-top:10px; padding-top:8px; display:flex; justify-content:space-between; font-weight:700; font-size:16px;">
                  <span>ยอดรวมสุทธิ</span><span>${total}.00 ฿</span>
                </div>
                ${step === "change" ? `
                  <div style="margin-top:14px; background:#fff; padding:12px; border-radius:10px; border:1px solid #fcd34d; font-family:var(--font-body);">
                    <div style="font-weight:700; color:#92400e; margin-bottom:8px;">
                      💵 ลูกค้าจ่ายธนบัตร ${data.customerPaid} บาท<br/>ต้องทอนเงินให้ลูกค้ากี่บาท?
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                      ${[290, 310, 320, 410].map(amt => `
                        <button class="btn btn-outline btn-sm btn-change" data-amt="${amt}">${amt} บาท</button>
                      `).join("")}
                    </div>
                  </div>
                ` : ""}
              </div>
            </div>
          ` : `
            <div class="card" style="background:var(--surface-soft);">
              <div class="visual-banner">🦓 EAN-13 : 885 - 1234 - 00101 - [2]</div>
              <p style="font-size:16px; font-weight:700; margin-bottom:12px;">${data.barcodeQuiz.q}</p>
              <div class="choice-list">
                ${data.barcodeQuiz.options.map((op, i) => `
                  <button class="choice-btn btn-bq" data-idx="${i}">
                    <span class="choice-letter">${["ก", "ข", "ค", "ง"][i]}</span>
                    <span>${op}</span>
                  </button>
                `).join("")}
              </div>
            </div>
          `}
          <div id="mg-fb"></div>
        </div>
      `;

      container.querySelectorAll(".btn-scan").forEach(btn => {
        btn.onclick = () => {
          SoundFX.scanBeep();
          scanned.add(btn.dataset.code);
          if (scanned.size === data.products.length) {
            step = "change";
          }
          render();
        };
      });

      container.querySelectorAll(".btn-change").forEach(btn => {
        btn.onclick = () => {
          const amt = Number(btn.dataset.amt);
          const fb = container.querySelector("#mg-fb");
          if (amt === data.expectedChange) {
            SoundFX.correct();
            fb.innerHTML = `
              <div class="mg-feedback ok">
                ✅ <strong>ทอนเงินถูกต้อง!</strong> 500 - 190 = 310 บาท ลิ้นชักเก็บเงินเปิดออกและพิมพ์ใบเสร็จเรียบร้อย!
                <div style="margin-top:10px;"><button class="btn btn-success btn-sm" id="pos-to-quiz">ขั้นสุดท้าย: ทดสอบรหัสแท่ง EAN-13 ➔</button></div>
              </div>
            `;
            container.querySelectorAll(".btn-change").forEach(b => b.disabled = true);
            container.querySelector("#pos-to-quiz").onclick = () => {
              step = "quiz";
              render();
            };
          } else {
            SoundFX.wrong();
            errors++;
            fb.innerHTML = `<div class="mg-feedback err">❌ ยังทอนไม่ถูกต้องครับ ลองคำนวณ 500 - ${data.expectedTotal} ใหม่อีกครั้ง!</div>`;
          }
        };
      });

      container.querySelectorAll(".btn-bq").forEach(btn => {
        btn.onclick = () => {
          const i = Number(btn.dataset.idx);
          const fb = container.querySelector("#mg-fb");
          if (i === data.barcodeQuiz.answer) {
            SoundFX.correct();
            btn.classList.add("correct");
            container.querySelectorAll(".btn-bq").forEach(b => b.disabled = true);
            fb.innerHTML = `
              <div class="mg-feedback ok">
                ✅ <strong>ถูกต้อง!</strong> ${data.barcodeQuiz.explain}
                <div style="margin-top:10px;"><button class="btn btn-success btn-sm" id="pos-finish">รับรางวัล XP ➔</button></div>
              </div>
            `;
            container.querySelector("#pos-finish").onclick = () => {
              step = "done";
              render();
            };
          } else {
            SoundFX.wrong();
            errors++;
            btn.classList.add("wrong");
            btn.disabled = true;
            fb.innerHTML = `<div class="mg-feedback err">❌ ยังไม่ใช่ครับ ลองดูความหมายของหลักที่ 13 ในรหัสแท่ง EAN-13 อีกครั้ง!</div>`;
          }
        };
      });
    }
    render();
  }

  // =========================================================================
  // 6. SEQUENCE BUILDER ENGINE (Units 11 & 12)
  // =========================================================================
  function runSequence(unit, container, onComplete) {
    const correctList = unit.minigameData.correctOrder;
    const pool = shuffle(correctList);
    let chosen = [];
    let stage = "order"; // order -> bonus -> done
    let attempts = 0;

    function render() {
      if (stage === "done") {
        const score = attempts === 0 ? 2 : 1;
        const xp = 75 + score * 10;
        onComplete({ score, maxScore: 2, xp });
        renderCompleteCard(container, unit.minigameTitle, "เรียงลำดับโครงสร้างและตอบคำถามโบนัสสำเร็จ!", xp, () => App.openUnitTab("quiz"));
        return;
      }

      if (stage === "bonus") {
        const bq = unit.minigameData.bonusQuestion;
        container.innerHTML = `
          <div class="mg-stage">
            <div class="mg-header-bar">
              <div><h3>⭐ คำถามโบนัสปฏิบัติการ: ${unit.title}</h3></div>
              <span class="mini-pill">ขั้น 2 / 2</span>
            </div>
            <p style="font-size:16px; font-weight:700; margin-bottom:14px;">${bq.q}</p>
            <div class="choice-list">
              ${bq.options.map((op, i) => `
                <button class="choice-btn btn-seq-bq" data-idx="${i}">
                  <span class="choice-letter">${["ก", "ข", "ค", "ง"][i]}</span>
                  <span>${op}</span>
                </button>
              `).join("")}
            </div>
            <div id="mg-fb"></div>
          </div>
        `;
        container.querySelectorAll(".btn-seq-bq").forEach(btn => {
          btn.onclick = () => {
            const fb = container.querySelector("#mg-fb");
            if (Number(btn.dataset.idx) === bq.answer) {
              SoundFX.correct();
              btn.classList.add("correct");
              container.querySelectorAll(".btn-seq-bq").forEach(b => b.disabled = true);
              fb.innerHTML = `
                <div class="mg-feedback ok">
                  ✅ <strong>ถูกต้อง!</strong> ${bq.explain}
                  <div style="margin-top:10px;"><button class="btn btn-success btn-sm" id="seq-done">สรุปผลภารกิจ ➔</button></div>
                </div>
              `;
              container.querySelector("#seq-done").onclick = () => { stage = "done"; render(); };
            } else {
              SoundFX.wrong();
              attempts++;
              btn.classList.add("wrong");
              btn.disabled = true;
              fb.innerHTML = `<div class="mg-feedback err">❌ ยังไม่ใช่นะครับ ลองเลือกใหม่อีกครั้ง!</div>`;
            }
          };
        });
        return;
      }

      const remaining = pool.filter(p => !chosen.some(c => c.id === p.id));

      container.innerHTML = `
        <div class="mg-stage">
          <div class="mg-header-bar">
            <div>
              <h3>${unit.icon} ${unit.minigameTitle}</h3>
              <div style="font-size:13px; color:var(--text-muted);">${unit.minigameData.instruction}</div>
            </div>
            <span class="mini-pill">ขั้น 1 / 2</span>
          </div>

          <div class="seq-layout">
            <div>
              <h4 style="margin-bottom:8px;">📋 ลำดับที่คุณจัดวาง (${chosen.length}/${correctList.length})</h4>
              <div class="seq-slots">
                ${correctList.map((_, i) => {
                  const item = chosen[i];
                  return `
                    <div class="seq-slot ${item ? "filled" : ""}">
                      <span>${item ? `${item.emoji} ${item.label.replace(/^\d+\.\s*/, "")}` : `ลำดับที่ ${i + 1} (รอเลือก)`}</span>
                      ${item ? `<button class="btn btn-outline btn-sm btn-remove-seq" data-id="${item.id}" style="padding:2px 8px;">✕</button>` : ""}
                    </div>
                  `;
                }).join("")}
              </div>
              <div style="display:flex; gap:8px;">
                <button class="btn btn-primary btn-sm" id="btn-check-seq" ${chosen.length < correctList.length ? "disabled" : ""}>✓ ตรวจลำดับ</button>
                <button class="btn btn-outline btn-sm" id="btn-clear-seq">↺ ล้างทั้งหมด</button>
              </div>
            </div>

            <div>
              <h4 style="margin-bottom:8px;">🧩 รายการให้คลิกเลือกเรียงลำดับ</h4>
              <div class="seq-pool">
                ${remaining.length === 0 ? `<div class="card" style="text-align:center; color:var(--text-muted); padding:20px;">เลือกครบทุกรายการแล้ว กดปุ่ม "ตรวจลำดับ" ได้เลย!</div>` : ""}
                ${remaining.map(item => `
                  <button class="choice-btn btn-pick-seq" data-id="${item.id}" style="padding:11px 14px;">
                    <span style="font-size:20px;">${item.emoji}</span>
                    <span>${item.label.replace(/^\d+\.\s*/, "")}</span>
                  </button>
                `).join("")}
              </div>
            </div>
          </div>

          <div id="mg-fb"></div>
        </div>
      `;

      container.querySelectorAll(".btn-pick-seq").forEach(btn => {
        btn.onclick = () => {
          SoundFX.click();
          const item = pool.find(p => p.id === btn.dataset.id);
          if (item) chosen.push(item);
          render();
        };
      });

      container.querySelectorAll(".btn-remove-seq").forEach(btn => {
        btn.onclick = () => {
          SoundFX.click();
          chosen = chosen.filter(c => c.id !== btn.dataset.id);
          render();
        };
      });

      container.querySelector("#btn-clear-seq").onclick = () => {
        SoundFX.click();
        chosen = [];
        render();
      };

      container.querySelector("#btn-check-seq").onclick = () => {
        const isCorrect = chosen.every((item, i) => item.id === correctList[i].id);
        const fb = container.querySelector("#mg-fb");
        if (isCorrect) {
          SoundFX.correct();
          fb.innerHTML = `
            <div class="mg-feedback ok">
              ✅ <strong>เรียงลำดับได้ถูกต้อง 100%!</strong>
              <div style="margin-top:10px;"><button class="btn btn-success btn-sm" id="seq-to-bonus">ไปต่อคำถามโบนัส ➔</button></div>
            </div>
          `;
          container.querySelector("#seq-to-bonus").onclick = () => { stage = "bonus"; render(); };
        } else {
          SoundFX.wrong();
          attempts++;
          fb.innerHTML = `<div class="mg-feedback err">❌ ลำดับบางข้อยังไม่ถูกต้องครับ กด "✕" เพื่อปรับหรือกด "ล้างทั้งหมด" แล้วลองเรียงใหม่!</div>`;
        }
      };
    }
    render();
  }

  // =========================================================================
  // 7. SEARCH ENGINE & E-MAIL LAB (Unit 13)
  // =========================================================================
  function runSearchEmail(unit, container, onComplete) {
    const tasks = unit.minigameData.tasks;
    let idx = 0;
    let score = 0;
    let wrongCur = false;

    function render() {
      if (idx >= tasks.length) {
        const xp = 75 + score * 15;
        onComplete({ score, maxScore: tasks.length, xp });
        renderCompleteCard(container, unit.minigameTitle, `${score}/${tasks.length} ภารกิจอินเทอร์เน็ตและอีเมล`, xp, () => App.openUnitTab("quiz"));
        return;
      }
      const t = tasks[idx];
      const mockup = t.mode === "search"
        ? `🔍 <span style="background:#fff; color:#0f172a; padding:6px 16px; border-radius:99px; font-size:15px;">Search Engine: [ พิมพ์คีย์เวิร์ดที่แม่นยำที่สุด... ]</span>`
        : t.mode === "email"
          ? `📧 <span style="font-size:16px;">New Message — To: [ ? ] | CC: [ ? ] | BCC: [ ? ]</span>`
          : `🌐 <span style="font-size:16px;">https://office.company.co.th/supply &nbsp; ⭐ Favorites</span>`;

      container.innerHTML = `
        <div class="mg-stage">
          <div class="mg-header-bar">
            <div>
              <h3>🌐 ${t.title}</h3>
              <div style="font-size:13px; color:var(--text-muted);">${unit.minigameDesc}</div>
            </div>
            <span class="mini-pill">ภารกิจ ${idx + 1} / ${tasks.length}</span>
          </div>

          <div class="visual-banner">${mockup}</div>
          <p style="font-size:16px; font-weight:600; margin-bottom:14px;">${t.prompt}</p>

          <div class="choice-list">
            ${t.choices.map((ch, i) => `
              <button class="choice-btn" data-idx="${i}">
                <span class="choice-letter">${["ก", "ข", "ค"][i]}</span>
                <span><code>${ch.text}</code></span>
              </button>
            `).join("")}
          </div>
          <div id="mg-fb"></div>
        </div>
      `;

      container.querySelectorAll(".choice-btn").forEach(btn => {
        btn.onclick = () => {
          const ch = t.choices[Number(btn.dataset.idx)];
          const fb = container.querySelector("#mg-fb");
          if (ch.correct) {
            SoundFX.correct();
            btn.classList.add("correct");
            if (!wrongCur) score++;
            container.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);
            fb.innerHTML = `
              <div class="mg-feedback ok">
                ✅ <strong>แม่นยำมาก!</strong> ${ch.feedback}
                <div style="margin-top:10px;"><button class="btn btn-success btn-sm" id="se-next">${idx + 1 < tasks.length ? "ภารกิจถัดไป ➔" : "สรุปผลภารกิจ ➔"}</button></div>
              </div>
            `;
            container.querySelector("#se-next").onclick = () => {
              idx++;
              wrongCur = false;
              render();
            };
          } else {
            SoundFX.wrong();
            wrongCur = true;
            btn.classList.add("wrong");
            btn.disabled = true;
            fb.innerHTML = `<div class="mg-feedback err">❌ ${ch.feedback}</div>`;
          }
        };
      });
    }
    render();
  }

  return {
    mount(unit, container, onComplete) {
      switch (unit.minigameType) {
        case "classifier": return runClassifier(unit, container, onComplete);
        case "scenario": return runScenario(unit, container, onComplete);
        case "calc_sim": return runCalcSim(unit, container, onComplete);
        case "panel_sim": return runPanelSim(unit, container, onComplete);
        case "pos_sim": return runPosSim(unit, container, onComplete);
        case "sequence": return runSequence(unit, container, onComplete);
        case "search_email": return runSearchEmail(unit, container, onComplete);
        default: return runScenario(unit, container, onComplete);
      }
    }
  };
})();
