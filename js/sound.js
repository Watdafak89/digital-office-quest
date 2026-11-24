// OfficeQuest Web Audio Synthesizer (ทำงานได้ 100% แบบ Offline ไม่ต้องโหลดไฟล์ MP3)

window.SoundFX = (function () {
  let ctx = null;
  let muted = false;

  function ensureCtx() {
    if (muted) return null;
    if (!ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      ctx = new AudioContext();
    }
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function playTone(freq, duration, type = "sine", vol = 0.12, delay = 0) {
    const c = ensureCtx();
    if (!c) return;
    const now = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(vol, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  return {
    isMuted: () => muted,
    setMuted: (val) => { muted = !!val; },
    toggle: () => { muted = !muted; return muted; },

    click() {
      playTone(580, 0.06, "triangle", 0.08);
    },
    correct() {
      playTone(523.25, 0.12, "sine", 0.14, 0);
      playTone(659.25, 0.12, "sine", 0.14, 0.09);
      playTone(783.99, 0.22, "triangle", 0.15, 0.18);
    },
    wrong() {
      playTone(240, 0.15, "sawtooth", 0.09, 0);
      playTone(185, 0.22, "sawtooth", 0.09, 0.12);
    },
    scanBeep() {
      // เสียงติ๊ดเครื่องสแกนบาร์โค้ด POS!
      playTone(2400, 0.09, "square", 0.07, 0);
    },
    calcKey() {
      playTone(880, 0.04, "sine", 0.06, 0);
    },
    levelUp() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => playTone(n, 0.22, "triangle", 0.15, i * 0.11));
    },
    badge() {
      playTone(659.25, 0.12, "sine", 0.14, 0);
      playTone(880, 0.14, "sine", 0.14, 0.1);
      playTone(1174.66, 0.28, "triangle", 0.15, 0.2);
    },
    victory() {
      const melody = [523.25, 587.33, 659.25, 783.99, 1046.5];
      melody.forEach((n, i) => playTone(n, 0.24, "triangle", 0.14, i * 0.09));
    }
  };
})();
