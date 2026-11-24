// OfficeQuest Teacher Dashboard — โหมดครูผู้สอน ดูสถิติ 13 บทเรียน และส่งออก CSV (UTF-8 BOM)

window.TeacherModule = (function () {
  const PASS_KEY = "officequest13_teacher_pass";

  function getPassword() {
    return localStorage.getItem(PASS_KEY) || "1234";
  }

  function setPassword(newPass) {
    localStorage.setItem(PASS_KEY, newPass);
  }

  function escapeCsv(val) {
    const s = String(val ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  function exportCSV(players) {
    const units = window.GAME_DATA.units;
    const headers = [
      "รหัสนักศึกษา", "ชื่อ-สกุล", "ชั้น/กลุ่ม", "แผนกวิชา",
      "ตำแหน่งงาน", "XP รวม", "จำนวนเหรียญตรา",
      "Pre-Test (/13)", "Post-Test (/13)", "จำนวนบทที่ผ่าน (/13)",
      ...units.map(u => `บทที่ ${u.id} มินิเกม`),
      ...units.map(u => `บทที่ ${u.id} แบบทดสอบ(/4)`)
    ];

    const rows = players.map(p => {
      const rank = App.getRank(p.xp);
      const completedCount = App.countCompletedUnits(p);
      return [
        p.studentId, p.name, p.classRoom, p.department,
        rank.title, p.xp, (p.badges || []).length,
        p.preTestScore ?? "-", p.postTestScore ?? "-", completedCount,
        ...units.map(u => (p.units?.[u.id]?.minigameDone ? "ผ่าน" : "-")),
        ...units.map(u => (p.units?.[u.id]?.quizScore !== undefined ? p.units[u.id].quizScore : "-"))
      ];
    });

    const csvLines = [headers, ...rows].map(r => r.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csvLines], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const today = new Date().toISOString().slice(0, 10);
    a.download = `OfficeQuest13_คะแนนนักศึกษา_${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    App.showToast("📥 ส่งออกไฟล์ CSV (เปิดใน Excel ภาษาไทยได้ทันที) สำเร็จ!", "xp");
  }

  function render(container) {
    const players = App.getAllPlayers();
    const totalStudents = players.length;
    const avgXp = totalStudents ? Math.round(players.reduce((s, p) => s + p.xp, 0) / totalStudents) : 0;
    const preList = players.filter(p => p.preTestScore !== null && p.preTestScore !== undefined);
    const postList = players.filter(p => p.postTestScore !== null && p.postTestScore !== undefined);
    const avgPre = preList.length ? (preList.reduce((s, p) => s + p.preTestScore, 0) / preList.length).toFixed(1) : "-";
    const avgPost = postList.length ? (postList.reduce((s, p) => s + p.postTestScore, 0) / postList.length).toFixed(1) : "-";

    container.innerHTML = `
      <div style="margin-bottom:18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="font-size:24px;">👩‍🏫 โหมดครูผู้สอน (Teacher Dashboard)</h2>
          <p style="color:var(--text-muted); font-size:14px;">ติดตามความก้าวหน้าทั้ง 13 บทเรียน และส่งออกคะแนนเป็นไฟล์ Excel (CSV)</p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-success btn-sm" id="btn-export-csv">📥 ส่งออกรายงาน CSV (Excel)</button>
          <button class="btn btn-outline btn-sm" id="btn-change-pass">🔑 เปลี่ยนรหัสผ่านครู</button>
          <button class="btn btn-primary btn-sm" onclick="App.exitTeacherMode()">← กลับสู่เกม</button>
        </div>
      </div>

      <div class="dash-stats-strip">
        <div class="stat-tile">
          <div class="stat-icon" style="background:#eef2ff;">👥</div>
          <div><div class="stat-val">${totalStudents}</div><div class="stat-lbl">นักศึกษาที่บันทึกในเครื่องนี้</div></div>
        </div>
        <div class="stat-tile">
          <div class="stat-icon" style="background:#ecfdf5;">⚡</div>
          <div><div class="stat-val">${avgXp} XP</div><div class="stat-lbl">คะแนน XP เฉลี่ย</div></div>
        </div>
        <div class="stat-tile">
          <div class="stat-icon" style="background:#fffbeb;">📝</div>
          <div><div class="stat-val">${avgPre} / 13</div><div class="stat-lbl">ค่าเฉลี่ย Pre-Test</div></div>
        </div>
        <div class="stat-tile">
          <div class="stat-icon" style="background:#eff6ff;">📈</div>
          <div><div class="stat-val">${avgPost} / 13</div><div class="stat-lbl">ค่าเฉลี่ย Post-Test</div></div>
        </div>
      </div>

      <div class="card" style="margin-bottom:22px;">
        <h3 style="margin-bottom:12px;">📊 ตารางสรุปคะแนนนักศึกษารายบุคคล</h3>
        ${players.length === 0 ? `
          <p style="color:var(--text-muted); padding:20px; text-align:center;">ยังไม่มีข้อมูลนักศึกษาในเครื่องนี้</p>
        ` : `
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                <tr>
                  <th>รหัส</th>
                  <th>ชื่อ-สกุล</th>
                  <th>ชั้น/แผนก</th>
                  <th>ตำแหน่งงาน</th>
                  <th>XP</th>
                  <th>เหรียญตรา</th>
                  <th>Pre-Test</th>
                  <th>Post-Test</th>
                  <th>ผ่านแล้ว (/13 บท)</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                ${players.map(p => {
                  const rank = App.getRank(p.xp);
                  const doneCnt = App.countCompletedUnits(p);
                  return `
                    <tr>
                      <td><strong>${p.studentId}</strong></td>
                      <td>${p.name}</td>
                      <td>${p.classRoom} (${p.department})</td>
                      <td>${rank.icon} ${rank.title}</td>
                      <td><strong>${p.xp}</strong></td>
                      <td>${(p.badges || []).length}/10</td>
                      <td>${p.preTestScore !== null && p.preTestScore !== undefined ? p.preTestScore + "/13" : "-"}</td>
                      <td>${p.postTestScore !== null && p.postTestScore !== undefined ? p.postTestScore + "/13" : "-"}</td>
                      <td><span class="mini-pill ${doneCnt === 13 ? "ok" : ""}">${doneCnt} / 13 บท</span></td>
                      <td>
                        <button class="btn btn-danger btn-sm btn-del-player" data-id="${p.id}" style="padding:4px 9px; font-size:12px;">ลบ</button>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        `}
      </div>

      <div class="card" style="background:var(--surface-soft);">
        <h3 style="margin-bottom:10px;">📘 เกณฑ์แนะนำการแปลงคะแนนเกมมิฟิเคชันเป็นคะแนนเก็บ ปวช. (40 คะแนน)</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(230px, 1fr)); gap:12px; font-size:14px;">
          <div class="card" style="padding:14px;">
            <strong>1. มินิเกมปฏิบัติจำลอง (20 คะแนน)</strong>
            <p style="color:var(--text-muted); margin-top:4px;">ผ่านมินิเกมครบ 13 บทเรียน (บทละ ~1.5 คะแนน) ฝึกปฏิบัติก่อนจับเครื่องจริงในห้องแล็บ</p>
          </div>
          <div class="card" style="padding:14px;">
            <strong>2. แบบทดสอบท้ายบท 13 บท (15 คะแนน)</strong>
            <p style="color:var(--text-muted); margin-top:4px;">คิดสัดส่วนจากคะแนนรวม 52 ข้อ (บทละ 4 ข้อ) ดึงข้อมูลได้ทันทีจากไฟล์ CSV</p>
          </div>
          <div class="card" style="padding:14px;">
            <strong>3. Post-Test & เหรียญตรา (5 คะแนน)</strong>
            <p style="color:var(--text-muted); margin-top:4px;">ประเมินพัฒนาการคะแนนหลังเรียนเทียบก่อนเรียน และการเลื่อนระดับตำแหน่งงาน</p>
          </div>
        </div>
      </div>
    `;

    container.querySelector("#btn-export-csv").onclick = () => {
      SoundFX.click();
      if (players.length === 0) {
        App.showToast("ยังไม่มีข้อมูลนักศึกษาสำหรับส่งออก", "");
        return;
      }
      exportCSV(players);
    };

    container.querySelector("#btn-change-pass").onclick = () => {
      const np = prompt("กรอกรหัสผ่านโหมดครูผู้สอนใหม่ (อย่างน้อย 4 ตัวอักษร):");
      if (np && np.trim().length >= 4) {
        setPassword(np.trim());
        App.showToast("🔑 เปลี่ยนรหัสผ่านโหมดครูผู้สอนเรียบร้อยแล้ว", "xp");
      } else if (np !== null) {
        alert("กรุณากรอกรหัสผ่านอย่างน้อย 4 ตัวอักษรครับ");
      }
    };

    container.querySelectorAll(".btn-del-player").forEach(btn => {
      btn.onclick = () => {
        if (confirm("ยืนยันการลบข้อมูลนักศึกษาคนนี้ออกจากเครื่อง?")) {
          App.deletePlayer(btn.dataset.id);
          render(container);
        }
      };
    });
  }

  return { getPassword, render };
})();
