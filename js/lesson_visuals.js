/**
 * OfficeQuest 13 — Classroom Visual Infographics & Diagrams (Chapters 1–13)
 * แผนภาพและภาพประกอบสื่อการสอนความคมชัดสูง (SVG) ครบทั้ง 13 บทเรียน
 */

window.GAME_DATA = window.GAME_DATA || {};
window.GAME_DATA.lessonVisuals = {
  1: {
    caption: "แผนภาพสรุป 3 กลุ่มเครื่องใช้สำนักงาน และหลักเกณฑ์การพิจารณาเลือกซื้อ",
    svg: `<svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" class="lesson-svg">
      <rect width="760" height="220" rx="16" fill="#0f172a"/>
      <text x="380" y="34" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">3 กลุ่มหลักของเครื่องใช้สำนักงานยุคดิจิทัล</text>
      <g transform="translate(24,52)">
        <rect width="222" height="142" rx="14" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
        <text x="111" y="42" text-anchor="middle" font-size="30">🖨️</text>
        <text x="111" y="72" text-anchor="middle" fill="#c7d2fe" font-size="15" font-weight="700">1. งานผลิตเอกสาร &amp; สำเนา</text>
        <text x="111" y="96" text-anchor="middle" fill="#cbd5e1" font-size="12">เครื่องถ่ายเอกสาร • อัดสำเนา</text>
        <text x="111" y="116" text-anchor="middle" fill="#cbd5e1" font-size="12">เครื่องพิมพ์ • เข้าเล่ม • ทำลายเอกสาร</text>
      </g>
      <g transform="translate(269,52)">
        <rect width="222" height="142" rx="14" fill="#422006" stroke="#f59e0b" stroke-width="2"/>
        <text x="111" y="42" text-anchor="middle" font-size="30">🧮</text>
        <text x="111" y="72" text-anchor="middle" fill="#fde68a" font-size="15" font-weight="700">2. งานคำนวณ &amp; การเงิน</text>
        <text x="111" y="96" text-anchor="middle" fill="#cbd5e1" font-size="12">เครื่องคำนวณเลข 10-Key</text>
        <text x="111" y="116" text-anchor="middle" fill="#cbd5e1" font-size="12">เครื่องบันทึกเงินสด (POS) • นับธนบัตร</text>
      </g>
      <g transform="translate(514,52)">
        <rect width="222" height="142" rx="14" fill="#082f49" stroke="#38bdf8" stroke-width="2"/>
        <text x="111" y="42" text-anchor="middle" font-size="30">📡</text>
        <text x="111" y="72" text-anchor="middle" fill="#bae6fd" font-size="15" font-weight="700">3. งานสื่อสาร &amp; ข้อมูล</text>
        <text x="111" y="96" text-anchor="middle" fill="#cbd5e1" font-size="12">คอมพิวเตอร์ • โทรศัพท์ IP</text>
        <text x="111" y="116" text-anchor="middle" fill="#cbd5e1" font-size="12">เครื่องโทรสาร • เครือข่าย &amp; Cloud</text>
      </g>
    </svg>`
  },

  2: {
    caption: "ภาพเปรียบเทียบความแตกต่างระหว่าง 'วัสดุสำนักงาน' กับ 'ครุภัณฑ์สำนักงาน'",
    svg: `<svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" class="lesson-svg">
      <rect width="760" height="220" rx="16" fill="#0f172a"/>
      <text x="380" y="34" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">เปรียบเทียบ วัสดุสำนักงาน (Supplies) vs ครุภัณฑ์สำนักงาน (Equipment)</text>
      <g transform="translate(24,52)">
        <rect width="340" height="144" rx="14" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
        <text x="20" y="36" fill="#a7f3d0" font-size="16" font-weight="700">📎 วัสดุสำนักงาน (ใช้แล้วหมดไป)</text>
        <text x="20" y="64" fill="#e2e8f0" font-size="13">• อายุการใช้งานสั้น (ปกติไม่เกิน 1 ปี)</text>
        <text x="20" y="88" fill="#e2e8f0" font-size="13">• ใช้แล้วหมดไป แปรสภาพ หรือแตกหักง่าย</text>
        <text x="20" y="112" fill="#e2e8f0" font-size="13">• ตัวอย่าง: กระดาษ A4, ปากกา, หมึก, ลวดเย็บ</text>
        <text x="20" y="132" fill="#6ee7b7" font-size="12" font-weight="700">บัญชี: บันทึกเป็นค่าใช้จ่ายทันที</text>
      </g>
      <text x="380" y="132" text-anchor="middle" fill="#fbbf24" font-size="20" font-weight="800">VS</text>
      <g transform="translate(396,52)">
        <rect width="340" height="144" rx="14" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
        <text x="20" y="36" fill="#c7d2fe" font-size="16" font-weight="700">🖥️ ครุภัณฑ์สำนักงาน (คงทนถาวร)</text>
        <text x="20" y="64" fill="#e2e8f0" font-size="13">• อายุการใช้งานยาวนานกว่า 1 ปี</text>
        <text x="20" y="88" fill="#e2e8f0" font-size="13">• ชำรุดซ่อมแซมได้ ต้องติด 'หมายเลขครุภัณฑ์'</text>
        <text x="20" y="112" fill="#e2e8f0" font-size="13">• ตัวอย่าง: คอมพิวเตอร์, โต๊ะ, เครื่องถ่ายเอกสาร</text>
        <text x="20" y="132" fill="#a5b4fc" font-size="12" font-weight="700">บัญชี: สินทรัพย์ถาวร + คิดค่าเสื่อมราคา</text>
      </g>
    </svg>`
  },

  3: {
    caption: "แผนผังแป้นเหย้า (Home Row) ระบบเกษมณี — รากฐานการพิมพ์สัมผัส",
    svg: `<svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" class="lesson-svg">
      <rect width="760" height="220" rx="16" fill="#0f172a"/>
      <text x="380" y="34" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">ผังแป้นเหย้าภาษาไทย (ระบบเกษมณี) — วางนิ้วไม่ต้องมองแป้น</text>
      <text x="190" y="62" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="700">✋ มือซ้าย (ฟ - ห - ก - ด)</text>
      <text x="570" y="62" text-anchor="middle" fill="#f472b6" font-size="13" font-weight="700">🤚 มือขวา (่ - า - ส - ว)</text>
      <!-- Left Hand Keys -->
      <g transform="translate(38,76)">
        <rect x="0"   y="0" width="68" height="68" rx="12" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2"/><text x="34" y="38" text-anchor="middle" fill="#fff" font-size="24" font-weight="700">ฟ</text><text x="34" y="58" text-anchor="middle" fill="#bae6fd" font-size="11">ก้อยซ้าย</text>
        <rect x="78"  y="0" width="68" height="68" rx="12" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2"/><text x="112" y="38" text-anchor="middle" fill="#fff" font-size="24" font-weight="700">ห</text><text x="112" y="58" text-anchor="middle" fill="#bae6fd" font-size="11">นางซ้าย</text>
        <rect x="156" y="0" width="68" height="68" rx="12" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2"/><text x="190" y="38" text-anchor="middle" fill="#fff" font-size="24" font-weight="700">ก</text><text x="190" y="58" text-anchor="middle" fill="#bae6fd" font-size="11">กลางซ้าย</text>
        <rect x="234" y="0" width="68" height="68" rx="12" fill="#0284c7" stroke="#fbbf24" stroke-width="2.5"/><text x="268" y="36" text-anchor="middle" fill="#fff" font-size="24" font-weight="700">ด</text><rect x="256" y="45" width="24" height="3" rx="1.5" fill="#fbbf24"/><text x="268" y="60" text-anchor="middle" fill="#fef08a" font-size="10">ชี้ซ้าย(นูน)</text>
      </g>
      <!-- Center Gap Keys -->
      <g transform="translate(350,86)">
        <rect x="0" y="0" width="26" height="48" rx="6" fill="#1e293b" stroke="#475569"/><text x="13" y="29" text-anchor="middle" fill="#94a3b8" font-size="14">เ</text>
        <rect x="32" y="0" width="26" height="48" rx="6" fill="#1e293b" stroke="#475569"/><text x="45" y="29" text-anchor="middle" fill="#94a3b8" font-size="14">้</text>
      </g>
      <!-- Right Hand Keys -->
      <g transform="translate(420,76)">
        <rect x="0"   y="0" width="68" height="68" rx="12" fill="#be185d" stroke="#fbbf24" stroke-width="2.5"/><text x="34" y="36" text-anchor="middle" fill="#fff" font-size="24" font-weight="700">่</text><rect x="22" y="45" width="24" height="3" rx="1.5" fill="#fbbf24"/><text x="34" y="60" text-anchor="middle" fill="#fef08a" font-size="10">ชี้ขวา(นูน)</text>
        <rect x="78"  y="0" width="68" height="68" rx="12" fill="#831843" stroke="#f472b6" stroke-width="2"/><text x="112" y="38" text-anchor="middle" fill="#fff" font-size="24" font-weight="700">า</text><text x="112" y="58" text-anchor="middle" fill="#fbcfe8" font-size="11">กลางขวา</text>
        <rect x="156" y="0" width="68" height="68" rx="12" fill="#831843" stroke="#f472b6" stroke-width="2"/><text x="190" y="38" text-anchor="middle" fill="#fff" font-size="24" font-weight="700">ส</text><text x="190" y="58" text-anchor="middle" fill="#fbcfe8" font-size="11">นางขวา</text>
        <rect x="234" y="0" width="68" height="68" rx="12" fill="#831843" stroke="#f472b6" stroke-width="2"/><text x="268" y="38" text-anchor="middle" fill="#fff" font-size="24" font-weight="700">ว</text><text x="268" y="58" text-anchor="middle" fill="#fbcfe8" font-size="11">ก้อยขวา</text>
      </g>
      <rect x="220" y="162" width="320" height="34" rx="10" fill="#1e293b" stroke="#64748b"/>
      <text x="380" y="184" text-anchor="middle" fill="#cbd5e1" font-size="13">👍 Spacebar (ใช้นิ้วหัวแม่มือขวาเคาะเว้นวรรค)</text>
    </svg>`
  },

  4: {
    caption: "แผนภาพเลือกเครื่องผลิตสำเนาให้คุ้มต้นทุนตามปริมาณงานจริง",
    svg: `<svg viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" class="lesson-svg">
      <rect width="760" height="210" rx="16" fill="#0f172a"/>
      <text x="380" y="34" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">เลือกเครื่องผลิตสำเนาตามปริมาณแผ่นเพื่อให้ต้นทุนคุ้มค่าที่สุด</text>
      <g transform="translate(26,56)">
        <rect width="218" height="128" rx="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="109" y="32" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="700">1 – 50 แผ่น</text>
        <text x="109" y="64" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">🖨️ เครื่องถ่ายเอกสาร</text>
        <text x="109" y="90" text-anchor="middle" fill="#cbd5e1" font-size="12">ไม่ต้องเสียค่าแผ่นไข (Master)</text>
        <text x="109" y="109" text-anchor="middle" fill="#cbd5e1" font-size="12">สะดวก รวดเร็ว สำหรับงานน้อย</text>
      </g>
      <text x="258" y="124" text-anchor="middle" fill="#94a3b8" font-size="22">➔</text>
      <g transform="translate(272,56)">
        <rect width="218" height="128" rx="14" fill="#1e1b4b" stroke="#818cf8" stroke-width="2.5"/>
        <text x="109" y="32" text-anchor="middle" fill="#a5b4fc" font-size="14" font-weight="700">50 – 5,000 แผ่น</text>
        <text x="109" y="64" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">📄 อัดสำเนาดิจิทัล</text>
        <text x="109" y="90" text-anchor="middle" fill="#cbd5e1" font-size="12">เร็ว 60–130 แผ่น/นาที</text>
        <text x="109" y="109" text-anchor="middle" fill="#a7f3d0" font-size="12" font-weight="700">ประหยัดหมึกมาก (เหมาะพิมพ์ข้อสอบ)</text>
      </g>
      <text x="504" y="124" text-anchor="middle" fill="#94a3b8" font-size="22">➔</text>
      <g transform="translate(518,56)">
        <rect width="218" height="128" rx="14" fill="#422006" stroke="#fbbf24" stroke-width="2"/>
        <text x="109" y="32" text-anchor="middle" fill="#fde68a" font-size="14" font-weight="700">5,000+ แผ่นขึ้นไป</text>
        <text x="109" y="64" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">🏭 พิมพ์ออฟเซต</text>
        <text x="109" y="90" text-anchor="middle" fill="#cbd5e1" font-size="12">คมชัดระดับโรงพิมพ์ พิมพ์ 4 สี</text>
        <text x="109" y="109" text-anchor="middle" fill="#cbd5e1" font-size="12">เหมาะพิมพ์หนังสือ / โบรชัวร์จำนวนมาก</text>
      </g>
    </svg>`
  },

  5: {
    caption: "ผังการวางนิ้ว 10-Key Touch Method และหน้าที่ปุ่มฟังก์ชันสำคัญ",
    svg: `<svg viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" class="lesson-svg">
      <rect width="760" height="230" rx="16" fill="#0f172a"/>
      <text x="380" y="30" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">การวางนิ้ว 10-Key (Touch Method) และปุ่มฟังก์ชันงานบัญชี</text>
      <!-- Keypad -->
      <g transform="translate(46,48)">
        <rect x="0"   y="0"   width="56" height="36" rx="8" fill="#0284c7"/><text x="28"  y="24" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">7</text>
        <rect x="64"  y="0"   width="56" height="36" rx="8" fill="#7c3aed"/><text x="92"  y="24" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">8</text>
        <rect x="128" y="0"   width="56" height="36" rx="8" fill="#059669"/><text x="156" y="24" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">9</text>
        <rect x="192" y="0"   width="56" height="36" rx="8" fill="#d97706"/><text x="220" y="24" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">÷</text>

        <rect x="0"   y="44"  width="56" height="36" rx="8" fill="#0284c7" stroke="#bae6fd" stroke-width="2"/><text x="28"  y="68" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">4</text>
        <rect x="64"  y="44"  width="56" height="36" rx="8" fill="#7c3aed" stroke="#fbbf24" stroke-width="2.5"/><text x="92"  y="65" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">5</text><circle cx="92" cy="73" r="2.5" fill="#fbbf24"/>
        <rect x="128" y="44"  width="56" height="36" rx="8" fill="#059669" stroke="#a7f3d0" stroke-width="2"/><text x="156" y="68" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">6</text>
        <rect x="192" y="44"  width="56" height="36" rx="8" fill="#d97706"/><text x="220" y="68" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">+</text>

        <rect x="0"   y="88"  width="56" height="36" rx="8" fill="#0284c7"/><text x="28"  y="112" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">1</text>
        <rect x="64"  y="88"  width="56" height="36" rx="8" fill="#7c3aed"/><text x="92"  y="112" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">2</text>
        <rect x="128" y="88"  width="56" height="36" rx="8" fill="#059669"/><text x="156" y="112" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">3</text>
        <rect x="192" y="88"  width="56" height="80" rx="8" fill="#e11d48"/><text x="220" y="134" text-anchor="middle" fill="#fff" font-size="18" font-weight="700">=</text>

        <rect x="0"   y="132" width="120" height="36" rx="8" fill="#475569"/><text x="60" y="156" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">0 (นิ้วโป้ง)</text>
        <rect x="128" y="132" width="56" height="36" rx="8" fill="#059669"/><text x="156" y="156" text-anchor="middle" fill="#fff" font-size="18" font-weight="700">.</text>
      </g>
      <!-- Legend -->
      <g transform="translate(332,52)">
        <rect width="390" height="162" rx="14" fill="#1e293b" stroke="#334155"/>
        <text x="18" y="28" fill="#fbbf24" font-size="14" font-weight="700">🎯 แป้นเหย้า (4-5-6) แยกสีตามนิ้วมือขวา:</text>
        <text x="18" y="52" fill="#7dd3fc" font-size="13">● สีฟ้า (1-4-7): นิ้วชี้   ● สีม่วง (2-5-8): นิ้วกลาง (มีปุ่มนูนที่ 5)</text>
        <text x="18" y="74" fill="#6ee7b7" font-size="13">● สีเขียว (3-6-9): นิ้วนาง   ● สีส้ม/แดง (+ / =): นิ้วก้อย</text>
        <line x1="18" y1="88" x2="372" y2="88" stroke="#334155"/>
        <text x="18" y="110" fill="#f8fafc" font-size="13"><tspan fill="#fbbf24" font-weight="700">CE:</tspan> ลบเฉพาะเลขที่เพิ่งกดผิด   <tspan fill="#fb7185" font-weight="700">AC:</tspan> ล้างทั้งหมดเป็น 0</text>
        <text x="18" y="132" fill="#f8fafc" font-size="13"><tspan fill="#34d399" font-weight="700">GT:</tspan> รวมยอดทั้งหมดที่กด '='   <tspan fill="#a5b4fc" font-weight="700">M+/MR:</tspan> บวก/เรียกความจำ</text>
        <text x="18" y="152" fill="#f8fafc" font-size="13"><tspan fill="#38bdf8" font-weight="700">MU:</tspan> คำนวณราคาขายและกำไร (Mark Up)</text>
      </g>
    </svg>`
  },

  6: {
    caption: "แผนภาพอัตราย่อ-ขยายมาตรฐานของเครื่องถ่ายเอกสารดิจิทัล (A3 ↔ A4 ↔ A5)",
    svg: `<svg viewBox="0 0 760 210" xmlns="http://www.w3.org/2000/svg" class="lesson-svg">
      <rect width="760" height="210" rx="16" fill="#0f172a"/>
      <text x="380" y="34" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">อัตราย่อ-ขยายมาตรฐาน (Zoom Ratio) บนแผงเครื่องถ่ายเอกสาร</text>
      <!-- A5 -->
      <rect x="64" y="102" width="70" height="84" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
      <text x="99" y="148" text-anchor="middle" fill="#f8fafc" font-size="18" font-weight="700">A5</text>
      <!-- Arrow A5 <-> A4 -->
      <text x="202" y="108" text-anchor="middle" fill="#34d399" font-size="13" font-weight="700">ขยาย 141% ➔</text>
      <text x="202" y="168" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="700">← ย่อ 71%</text>
      <!-- A4 -->
      <rect x="272" y="76" width="94" height="110" rx="8" fill="#312e81" stroke="#818cf8" stroke-width="2.5"/>
      <text x="319" y="128" text-anchor="middle" fill="#fff" font-size="22" font-weight="800">A4</text>
      <text x="319" y="152" text-anchor="middle" fill="#c7d2fe" font-size="12">100% (มาตรฐาน)</text>
      <!-- Arrow A4 <-> A3 -->
      <text x="438" y="108" text-anchor="middle" fill="#34d399" font-size="13" font-weight="700">ขยาย 141% ➔</text>
      <text x="438" y="168" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="700">← ย่อ 71%</text>
      <!-- A3 -->
      <rect x="510" y="54" width="128" height="132" rx="8" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2.5"/>
      <text x="574" y="122" text-anchor="middle" fill="#fff" font-size="26" font-weight="800">A3</text>
      <text x="574" y="146" text-anchor="middle" fill="#bae6fd" font-size="12">ใหญ่เป็น 2 เท่าของ A4</text>
      <!-- Extra pills -->
      <text x="698" y="96" text-anchor="middle" fill="#cbd5e1" font-size="12">📑 Duplex</text>
      <text x="698" y="114" text-anchor="middle" fill="#94a3b8" font-size="11">หน้า-หลัง</text>
      <text x="698" y="146" text-anchor="middle" fill="#cbd5e1" font-size="12">🗂️ Collate</text>
      <text x="698" y="164" text-anchor="middle" fill="#94a3b8" font-size="11">เรียงเป็นชุด</text>
    </svg>`
  },

  7: {
    caption: "โครงสร้างรหัสแท่งมาตรฐานสากล EAN-13 (ประเทศไทยขึ้นต้นด้วย 885)",
    svg: `<svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" class="lesson-svg">
      <rect width="760" height="220" rx="16" fill="#0f172a"/>
      <text x="380" y="32" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">โครงสร้างรหัสแท่งสินค้ามาตรฐาน EAN-13</text>
      <!-- Barcode white card -->
      <rect x="190" y="48" width="380" height="94" rx="12" fill="#ffffff"/>
      <g transform="translate(226,60)" fill="#0f172a">
        <rect x="0" width="4" height="58"/><rect x="8" width="2" height="58"/><rect x="14" width="6" height="50"/><rect x="24" width="3" height="50"/>
        <rect x="32" width="5" height="50"/><rect x="42" width="2" height="50"/><rect x="50" width="7" height="50"/><rect x="62" width="3" height="50"/>
        <rect x="70" width="4" height="50"/><rect x="80" width="6" height="50"/><rect x="92" width="2" height="50"/><rect x="100" width="5" height="50"/>
        <rect x="110" width="3" height="50"/><rect x="120" width="6" height="50"/><rect x="132" width="2" height="50"/><rect x="140" width="4" height="58"/>
        <rect x="148" width="4" height="58"/><rect x="158" width="6" height="50"/><rect x="170" width="3" height="50"/><rect x="178" width="5" height="50"/>
        <rect x="188" width="2" height="50"/><rect x="196" width="7" height="50"/><rect x="208" width="4" height="50"/><rect x="218" width="3" height="50"/>
        <rect x="228" width="6" height="50"/><rect x="240" width="2" height="50"/><rect x="248" width="5" height="50"/><rect x="258" width="4" height="50"/>
        <rect x="268" width="6" height="50"/><rect x="280" width="3" height="50"/><rect x="290" width="2" height="58"/><rect x="298" width="4" height="58"/>
      </g>
      <text x="262" y="134" text-anchor="middle" fill="#e11d48" font-size="18" font-weight="800">8 8 5</text>
      <text x="348" y="134" text-anchor="middle" fill="#2563eb" font-size="18" font-weight="800">1 2 3 4</text>
      <text x="448" y="134" text-anchor="middle" fill="#059669" font-size="18" font-weight="800">5 6 7 8 9</text>
      <text x="526" y="134" text-anchor="middle" fill="#d97706" font-size="18" font-weight="800">0</text>
      <!-- Labels -->
      <rect x="52"  y="156" width="154" height="44" rx="10" fill="#881337"/><text x="129" y="175" text-anchor="middle" fill="#fecdd3" font-size="12" font-weight="700">หลักที่ 1–3 (885)</text><text x="129" y="192" text-anchor="middle" fill="#fff" font-size="11">รหัสประเทศไทย</text>
      <rect x="218" y="156" width="154" height="44" rx="10" fill="#1e3a8a"/><text x="295" y="175" text-anchor="middle" fill="#bfdbfe" font-size="12" font-weight="700">หลักที่ 4–7</text><text x="295" y="192" text-anchor="middle" fill="#fff" font-size="11">รหัสบริษัทผู้ผลิต</text>
      <rect x="384" y="156" width="154" height="44" rx="10" fill="#065f46"/><text x="461" y="175" text-anchor="middle" fill="#a7f3d0" font-size="12" font-weight="700">หลักที่ 8–12</text><text x="461" y="192" text-anchor="middle" fill="#fff" font-size="11">รหัสประจำสินค้า</text>
      <rect x="550" y="156" width="158" height="44" rx="10" fill="#78350f"/><text x="629" y="175" text-anchor="middle" fill="#fde68a" font-size="12" font-weight="700">หลักที่ 13</text><text x="629" y="192" text-anchor="middle" fill="#fff" font-size="11">เลขตรวจสอบ (Check Digit)</text>
    </svg>`
  },

  8: {
    caption: "แผนภาพวงจรการทำงานของคอมพิวเตอร์ (IPO) พร้อม UPS สำรองไฟและ Cloud Storage",
    svg: `<svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" class="lesson-svg">
      <rect width="760" height="220" rx="16" fill="#0f172a"/>
      <text x="380" y="32" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">วงจรการทำงานของคอมพิวเตอร์ (IPO Cycle) ในสำนักงานดิจิทัล</text>
      <g transform="translate(26,56)">
        <rect width="152" height="94" rx="12" fill="#0c4a6e" stroke="#38bdf8" stroke-width="2"/>
        <text x="76" y="34" text-anchor="middle" font-size="24">⌨️</text>
        <text x="76" y="58" text-anchor="middle" fill="#fff" font-size="14" font-weight="700">1. Input (รับเข้า)</text>
        <text x="76" y="78" text-anchor="middle" fill="#bae6fd" font-size="11">คีย์บอร์ด เมาส์ สแกนเนอร์</text>
      </g>
      <text x="194" y="108" text-anchor="middle" fill="#94a3b8" font-size="20">➔</text>
      <g transform="translate(210,56)">
        <rect width="164" height="94" rx="12" fill="#312e81" stroke="#818cf8" stroke-width="2.5"/>
        <text x="82" y="34" text-anchor="middle" font-size="24">🧠</text>
        <text x="82" y="58" text-anchor="middle" fill="#fff" font-size="14" font-weight="700">2. Process (ประมวลผล)</text>
        <text x="82" y="78" text-anchor="middle" fill="#c7d2fe" font-size="11">CPU + RAM (ความจำชั่วคราว)</text>
      </g>
      <text x="390" y="108" text-anchor="middle" fill="#94a3b8" font-size="20">➔</text>
      <g transform="translate(406,56)">
        <rect width="152" height="94" rx="12" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
        <text x="76" y="34" text-anchor="middle" font-size="24">🖥️</text>
        <text x="76" y="58" text-anchor="middle" fill="#fff" font-size="14" font-weight="700">3. Output (แสดงผล)</text>
        <text x="76" y="78" text-anchor="middle" fill="#a7f3d0" font-size="11">จอภาพ เครื่องพิมพ์ ลำโพง</text>
      </g>
      <text x="574" y="108" text-anchor="middle" fill="#94a3b8" font-size="20">➔</text>
      <g transform="translate(590,56)">
        <rect width="146" height="94" rx="12" fill="#4c1d95" stroke="#c084fc" stroke-width="2"/>
        <text x="73" y="34" text-anchor="middle" font-size="24">☁️</text>
        <text x="73" y="58" text-anchor="middle" fill="#fff" font-size="14" font-weight="700">4. Storage (จัดเก็บ)</text>
        <text x="73" y="78" text-anchor="middle" fill="#e9d5ff" font-size="11">SSD / HDD / Cloud</text>
      </g>
      <rect x="86" y="166" width="588" height="36" rx="10" fill="#1e293b" stroke="#f59e0b"/>
      <text x="380" y="189" text-anchor="middle" fill="#fde68a" font-size="13" font-weight="700">🔋 UPS สำรองไฟป้องกันข้อมูลหายเมื่อไฟดับ  •  👀 พักสายตาด้วยกฎ 20-20-20</text>
    </svg>`
  },

  9: {
    caption: "ขั้นตอนมาตรฐานการรับโทรศัพท์สำนักงานอย่างมืออาชีพ (กฎ 3 กริ่ง)",
    svg: `<svg viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg" class="lesson-svg">
      <rect width="760" height="200" rx="16" fill="#0f172a"/>
      <text x="380" y="34" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">4 ขั้นตอนทองของการรับโทรศัพท์สำนักงาน</text>
      <g transform="translate(24,54)">
        <rect width="164" height="118" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="82" y="34" text-anchor="middle" font-size="26">🔔</text>
        <text x="82" y="60" text-anchor="middle" fill="#38bdf8" font-size="14" font-weight="700">1. กฎ 3 กริ่ง</text>
        <text x="82" y="82" text-anchor="middle" fill="#cbd5e1" font-size="12">รับสายไม่เกิน 3 กริ่ง</text>
        <text x="82" y="100" text-anchor="middle" fill="#cbd5e1" font-size="12">เตรียมปากกา-กระดาษ</text>
      </g>
      <g transform="translate(206,54)">
        <rect width="164" height="118" rx="12" fill="#1e293b" stroke="#818cf8" stroke-width="2"/>
        <text x="82" y="34" text-anchor="middle" font-size="26">😊</text>
        <text x="82" y="60" text-anchor="middle" fill="#a5b4fc" font-size="14" font-weight="700">2. ทักทาย 3 ส่วน</text>
        <text x="82" y="82" text-anchor="middle" fill="#cbd5e1" font-size="12">สวัสดี + ชื่อหน่วยงาน</text>
        <text x="82" y="100" text-anchor="middle" fill="#cbd5e1" font-size="12">+ ชื่อผู้รับสาย</text>
      </g>
      <g transform="translate(388,54)">
        <rect width="164" height="118" rx="12" fill="#1e293b" stroke="#fbbf24" stroke-width="2"/>
        <text x="82" y="34" text-anchor="middle" font-size="26">📝</text>
        <text x="82" y="60" text-anchor="middle" fill="#fde68a" font-size="14" font-weight="700">3. โอน/รับฝาก</text>
        <text x="82" y="82" text-anchor="middle" fill="#cbd5e1" font-size="12">แจ้งก่อนโอนสายเสมอ</text>
        <text x="82" y="100" text-anchor="middle" fill="#cbd5e1" font-size="12">จดชื่อ-เบอร์-ใจความ</text>
      </g>
      <g transform="translate(570,54)">
        <rect width="164" height="118" rx="12" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
        <text x="82" y="34" text-anchor="middle" font-size="26">🙏</text>
        <text x="82" y="60" text-anchor="middle" fill="#6ee7b7" font-size="14" font-weight="700">4. ขอบคุณและวางสาย</text>
        <text x="82" y="82" text-anchor="middle" fill="#cbd5e1" font-size="12">ทวนข้อความสำคัญ</text>
        <text x="82" y="100" text-anchor="middle" fill="#cbd5e1" font-size="12">รอผู้โทรวางสายก่อน</text>
      </g>
    </svg>`
  },

  10: {
    caption: "ขั้นตอนปฏิบัติการส่งเอกสารผ่านเครื่องโทรสาร (Fax) ไม่ให้ผิดพลาด",
    svg: `<svg viewBox="0 0 760 200" xmlns="http://www.w3.org/2000/svg" class="lesson-svg">
      <rect width="760" height="200" rx="16" fill="#0f172a"/>
      <text x="380" y="34" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">4 ขั้นตอนส่งโทรสาร (Fax) ให้สำเร็จในครั้งเดียว</text>
      <g transform="translate(24,54)">
        <rect width="164" height="118" rx="12" fill="#1e293b" stroke="#fb7185" stroke-width="2"/>
        <text x="82" y="34" text-anchor="middle" font-size="26">📎</text>
        <text x="82" y="60" text-anchor="middle" fill="#fecdd3" font-size="14" font-weight="700">1. แกะลวดเย็บ</text>
        <text x="82" y="82" text-anchor="middle" fill="#cbd5e1" font-size="12">เอาคลิป/ลวดออกหมด</text>
        <text x="82" y="100" text-anchor="middle" fill="#cbd5e1" font-size="12">+ แนบใบปะหน้า Fax</text>
      </g>
      <g transform="translate(206,54)">
        <rect width="164" height="118" rx="12" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="82" y="34" text-anchor="middle" font-size="26">📄</text>
        <text x="82" y="60" text-anchor="middle" fill="#bae6fd" font-size="14" font-weight="700">2. วางถูกด้าน</text>
        <text x="82" y="82" text-anchor="middle" fill="#cbd5e1" font-size="12">ดูสัญลักษณ์ถาดป้อน</text>
        <text x="82" y="100" text-anchor="middle" fill="#cbd5e1" font-size="12">(ส่วนใหญ่คว่ำหน้าลง)</text>
      </g>
      <g transform="translate(388,54)">
        <rect width="164" height="118" rx="12" fill="#1e293b" stroke="#818cf8" stroke-width="2"/>
        <text x="82" y="34" text-anchor="middle" font-size="26">📠</text>
        <text x="82" y="60" text-anchor="middle" fill="#c7d2fe" font-size="14" font-weight="700">3. กดเบอร์ &amp; ส่ง</text>
        <text x="82" y="82" text-anchor="middle" fill="#cbd5e1" font-size="12">เลือก Standard / Fine</text>
        <text x="82" y="100" text-anchor="middle" fill="#cbd5e1" font-size="12">แล้วกดปุ่ม Start/Send</text>
      </g>
      <g transform="translate(570,54)">
        <rect width="164" height="118" rx="12" fill="#1e293b" stroke="#34d399" stroke-width="2"/>
        <text x="82" y="34" text-anchor="middle" font-size="26">✅</text>
        <text x="82" y="60" text-anchor="middle" fill="#a7f3d0" font-size="14" font-weight="700">4. ตรวจผล OK</text>
        <text x="82" y="82" text-anchor="middle" fill="#cbd5e1" font-size="12">เช็กสลิปรายงานผล</text>
        <text x="82" y="100" text-anchor="middle" fill="#cbd5e1" font-size="12">ยืนยันส่งครบทุกหน้า</text>
      </g>
    </svg>`
  },

  11: {
    caption: "สัดส่วนกระดาษมาตรฐาน ISO (A3 / A4 / A5) และระดับความปลอดภัยเครื่องทำลายเอกสาร",
    svg: `<svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" class="lesson-svg">
      <rect width="760" height="220" rx="16" fill="#0f172a"/>
      <text x="380" y="32" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">ขนาดกระดาษมาตรฐาน ISO ซีรีส์ A และความปลอดภัยในการทำลายเอกสาร</text>
      <!-- ISO A Paper Nested Box -->
      <g transform="translate(46,50)">
        <rect x="0" y="0" width="260" height="148" rx="8" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
        <text x="65" y="76" text-anchor="middle" fill="#bfdbfe" font-size="20" font-weight="800">A4</text>
        <text x="65" y="96" text-anchor="middle" fill="#e2e8f0" font-size="11">210 × 297 มม.</text>
        <line x1="130" y1="0" x2="130" y2="148" stroke="#60a5fa" stroke-dasharray="4 4"/>
        <rect x="130" y="0" width="130" height="74" fill="#312e81" stroke="#818cf8"/>
        <text x="195" y="38" text-anchor="middle" fill="#c7d2fe" font-size="16" font-weight="700">A5</text>
        <text x="195" y="56" text-anchor="middle" fill="#cbd5e1" font-size="10">148 × 210 มม.</text>
        <rect x="130" y="74" width="65" height="74" fill="#065f46" stroke="#34d399"/>
        <text x="162" y="116" text-anchor="middle" fill="#a7f3d0" font-size="13" font-weight="700">A6</text>
        <text x="130" y="164" text-anchor="middle" fill="#94a3b8" font-size="11">กรอบใหญ่ทั้งหมด = A3 (297 × 420 มม.)</text>
      </g>
      <!-- Shredder Comparison -->
      <g transform="translate(344,50)">
        <rect width="380" height="68" rx="12" fill="#1e293b" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="18" y="28" fill="#fde68a" font-size="14" font-weight="700">✂️ Strip-Cut (ตัดเส้นตรงยาว)</text>
        <text x="18" y="50" fill="#cbd5e1" font-size="12">ความปลอดภัยระดับพื้นฐาน เหมาะกับเอกสารทั่วไปที่ไม่เป็นความลับ</text>
        <rect y="80" width="380" height="68" rx="12" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
        <text x="18" y="108" fill="#a7f3d0" font-size="14" font-weight="700">🛡️ Cross-Cut / Micro-Cut (ตัดละเอียดเป็นชิ้นเล็ก)</text>
        <text x="18" y="130" fill="#e2e8f0" font-size="12">ปลอดภัยสูงสุด! ป้องกันข้อมูลส่วนบุคคล (PDPA) และเอกสารการเงิน</text>
      </g>
    </svg>`
  },

  12: {
    caption: "ตัวอย่างการตั้งระยะขอบกระดาษ (Margins) เผื่อสันเข้าเล่ม และฟอนต์มาตรฐานราชการไทย",
    svg: `<svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" class="lesson-svg">
      <rect width="760" height="220" rx="16" fill="#0f172a"/>
      <text x="380" y="32" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">มาตรฐานการจัดหน้ากระดาษเผื่อเข้าเล่ม (Margins) และการเลือกวิธีเข้าเล่ม</text>
      <!-- Page Diagram -->
      <g transform="translate(64,48)">
        <rect width="170" height="152" rx="6" fill="#ffffff"/>
        <!-- Binding Left Margin -->
        <rect x="0" y="0" width="42" height="152" fill="#fde68a" opacity="0.7"/>
        <rect x="42" y="22" width="106" height="108" fill="#e0e7ff" stroke="#4f46e5" stroke-dasharray="3 3"/>
        <text x="21" y="80" text-anchor="middle" fill="#92400e" font-size="11" font-weight="700">1.5"</text>
        <text x="95" y="15" text-anchor="middle" fill="#334155" font-size="10" font-weight="700">บน 1"</text>
        <text x="95" y="144" text-anchor="middle" fill="#334155" font-size="10" font-weight="700">ล่าง 1"</text>
        <text x="159" y="80" text-anchor="middle" fill="#334155" font-size="10" font-weight="700">1"</text>
        <text x="95" y="68" text-anchor="middle" fill="#1e1b4b" font-size="12" font-weight="700">พื้นที่เนื้อหา</text>
        <text x="95" y="86" text-anchor="middle" fill="#4338ca" font-size="10">TH Sarabun 16 pt</text>
        <text x="95" y="102" text-anchor="middle" fill="#4338ca" font-size="10">Thai Distributed</text>
      </g>
      <!-- Binding Types -->
      <g transform="translate(274,48)">
        <rect width="434" height="44" rx="10" fill="#1e293b" stroke="#38bdf8"/>
        <text x="16" y="27" fill="#bae6fd" font-size="13" font-weight="700">🌀 สันห่วงพลาสติก/ขดลวด: <tspan fill="#e2e8f0" font-weight="400">เปิดกาง 360° เปลี่ยนหน้าเพิ่ม-ลดได้ง่าย</tspan></text>
        <rect y="54" width="434" height="44" rx="10" fill="#1e293b" stroke="#818cf8"/>
        <text x="16" y="81" fill="#c7d2fe" font-size="13" font-weight="700">📘 สันกาวร้อน (ไสกาว): <tspan fill="#e2e8f0" font-weight="400">เรียบหรูเหมือนหนังสือ เหมาะกับรายงาน/โปรเจกต์จบ</tspan></text>
        <rect y="108" width="434" height="44" rx="10" fill="#1e293b" stroke="#34d399"/>
        <text x="16" y="135" fill="#a7f3d0" font-size="13" font-weight="700">🛡️ เคลือบเอกสาร (Laminator): <tspan fill="#e2e8f0" font-weight="400">กันน้ำ/รอยขีดข่วน เหมาะบัตรและเกียรติบัตร</tspan></text>
      </g>
    </svg>`
  },

  13: {
    caption: "เปรียบเทียบช่องผู้รับอีเมล To / CC / BCC และคำสั่งสืบค้นข้อมูลขั้นสูง",
    svg: `<svg viewBox="0 0 760 220" xmlns="http://www.w3.org/2000/svg" class="lesson-svg">
      <rect width="760" height="220" rx="16" fill="#0f172a"/>
      <text x="380" y="32" text-anchor="middle" fill="#e2e8f0" font-size="16" font-weight="700">การใช้อีเมลสำนักงาน (To / CC / BCC) และ Search Operators</text>
      <!-- Email Box -->
      <g transform="translate(26,50)">
        <rect width="346" height="148" rx="14" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
        <text x="18" y="28" fill="#38bdf8" font-size="14" font-weight="700">📧 ความต่างของ To / CC / BCC</text>
        <text x="18" y="56" fill="#f8fafc" font-size="13"><tspan fill="#38bdf8" font-weight="700">To (ถึง):</tspan> ผู้รับหลักที่ต้องดำเนินการ/ตอบกลับ</text>
        <text x="18" y="84" fill="#f8fafc" font-size="13"><tspan fill="#fbbf24" font-weight="700">CC (สำเนาถึง):</tspan> ผู้ร่วมรับทราบ (เห็นอีเมลกันทุกคน)</text>
        <text x="18" y="112" fill="#f8fafc" font-size="13"><tspan fill="#34d399" font-weight="700">BCC (สำเนาลับ):</tspan> ซ่อนรายชื่อไม่ให้เห็นกัน (ส่งลูกค้าจำนวนมาก)</text>
        <text x="18" y="136" fill="#94a3b8" font-size="11">💡 ส่งประกาศถึงลูกค้าหลายคนต้องใส่ใน BCC เสมอ!</text>
      </g>
      <!-- Search Box -->
      <g transform="translate(388,50)">
        <rect width="346" height="148" rx="14" fill="#1e1b4b" stroke="#818cf8" stroke-width="2"/>
        <text x="18" y="28" fill="#c7d2fe" font-size="14" font-weight="700">🔍 สูตรคำค้น Search Engine ขั้นเทพ</text>
        <text x="18" y="56" fill="#f8fafc" font-size="13"><tspan fill="#fbbf24" font-weight="700">"วลีตรงตัว"</tspan> — ค้นหาคำที่ตรงกันเป๊ะทุกคำ</text>
        <text x="18" y="84" fill="#f8fafc" font-size="13"><tspan fill="#34d399" font-weight="700">filetype:pdf</tspan> — ค้นหาเฉพาะไฟล์เอกสาร PDF</text>
        <text x="18" y="112" fill="#f8fafc" font-size="13"><tspan fill="#fb7185" font-weight="700">-คำที่ไม่เอา</tspan> — ตัดผลลัพธ์ที่ไม่ต้องการออก</text>
        <text x="18" y="136" fill="#f8fafc" font-size="13"><tspan fill="#38bdf8" font-weight="700">site:ac.th</tspan> — ค้นเฉพาะเว็บสถานศึกษา/หน่วยงาน</text>
      </g>
    </svg>`
  }
};
