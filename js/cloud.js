/**
 * OfficeQuest 13 — Firebase Cloud Auth & Firestore Sync
 * ระบบล็อกอินด้วยรหัสนักศึกษา + รหัสผ่าน และซิงก์ข้อมูลความก้าวหน้าขึ้น Cloud Firestore
 */

window.CloudSync = (() => {
  const FIREBASE_CONFIG = {
    projectId: "officequest-13-cloud",
    appId: "1:264058413222:web:50f85be85177cc97019467",
    storageBucket: "officequest-13-cloud.firebasestorage.app",
    apiKey: "AIzaSyCZvzfKxVHcbiWOE1rpKemz2GAEcs8-JHg",
    authDomain: "officequest-13-cloud.firebaseapp.com",
    messagingSenderId: "264058413222"
  };

  let app = null;
  let auth = null;
  let db = null;
  let ready = false;
  let syncStatus = "offline"; // 'synced' | 'syncing' | 'offline' | 'error'

  function init() {
    if (ready) return true;
    try {
      if (typeof firebase === "undefined" || !firebase.initializeApp) {
        syncStatus = "offline";
        return false;
      }
      app = firebase.apps && firebase.apps.length > 0
        ? firebase.apps[0]
        : firebase.initializeApp(FIREBASE_CONFIG);
      auth = firebase.auth();
      db = firebase.firestore();
      ready = true;
      syncStatus = "synced";
      return true;
    } catch (err) {
      console.warn("[CloudSync] Init failed, falling back to local mode:", err);
      syncStatus = "offline";
      return false;
    }
  }

  function isAvailable() {
    return init();
  }

  function getStatus() {
    return syncStatus;
  }

  function updateStatusBadge(status, label) {
    syncStatus = status;
    const el = document.getElementById("cloud-sync-badge");
    if (!el) return;
    el.className = `cloud-sync-badge ${status}`;
    el.textContent = label || (
      status === "synced" ? "☁️ ซิงก์ Cloud แล้ว" :
      status === "syncing" ? "⏳ กำลังบันทึก Cloud..." :
      status === "error" ? "⚠️ ซิงก์ไม่สำเร็จ (บันทึกในเครื่อง)" :
      "📴 โหมดออฟไลน์"
    );
  }

  function normalizeStudentId(raw) {
    return String(raw || "").trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
  }

  function studentIdToEmail(studentId) {
    const clean = normalizeStudentId(studentId);
    if (clean.length < 3) return null;
    return `${clean}@officequest13.app`;
  }

  function mapAuthError(err) {
    const code = err?.code || "";
    if (code === "auth/email-already-in-use") {
      return "รหัสนักศึกษานี้ลงทะเบียนไว้แล้ว กรุณาสลับไปที่แท็บ 'เข้าสู่ระบบ'";
    }
    if (code === "auth/weak-password") {
      return "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร";
    }
    if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
      return "รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง";
    }
    if (code === "auth/too-many-requests") {
      return "ลองเข้าสู่ระบบผิดหลายครั้งเกินไป กรุณารอสักครู่แล้วลองใหม่";
    }
    if (code === "auth/network-request-failed") {
      return "ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้ กรุณาตรวจสอบการเชื่อมต่อ";
    }
    if (code === "auth/operation-not-allowed") {
      return "ระบบ Cloud Auth ยังไม่เปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ";
    }
    return err?.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ Cloud";
  }

  function buildFirestoreDoc(player, uid) {
    const now = Date.now();
    const arcade = player.arcade || {};
    const clampInt = (v, min, max) => {
      const n = Math.floor(Number(v) || 0);
      return Math.max(min, Math.min(max, n));
    };
    const scoreOrNull = (v) => (v === null || v === undefined ? null : clampInt(v, 0, 13));

    return {
      uid: String(uid),
      studentId: String(player.studentId || "").trim().slice(0, 30) || "unknown",
      name: String(player.name || "").trim().slice(0, 100) || "นักศึกษา",
      classRoom: String(player.classRoom || "ปวช.1").trim().slice(0, 40) || "ปวช.1",
      department: String(player.department || "").trim().slice(0, 80),
      avatarId: String(player.avatarId || "av1").slice(0, 20),
      xp: clampInt(player.xp, 0, 100000),
      badges: Array.isArray(player.badges) ? player.badges.slice(0, 30).map(String) : [],
      preTestScore: scoreOrNull(player.preTestScore),
      postTestScore: scoreOrNull(player.postTestScore),
      units: player.units && typeof player.units === "object" ? player.units : {},
      arcade: {
        bestScore: clampInt(arcade.bestScore, 0, 1000000),
        bestCombo: clampInt(arcade.bestCombo, 0, 1000),
        plays: clampInt(arcade.plays, 0, 100000),
        lastScore: clampInt(arcade.lastScore, 0, 1000000)
      },
      createdAt: typeof player.createdAt === "number" && player.createdAt >= 0 ? Math.floor(player.createdAt) : now,
      updatedAt: now
    };
  }

  async function registerStudent({ studentId, password, name, classRoom, department, avatarId }) {
    if (!init()) return { ok: false, error: "ไม่สามารถเชื่อมต่อระบบ Cloud ได้" };
    const email = studentIdToEmail(studentId);
    if (!email) return { ok: false, error: "รหัสนักศึกษาต้องเป็นตัวเลขหรือตัวอักษรภาษาอังกฤษอย่างน้อย 3 ตัว" };
    if (!password || password.length < 6) return { ok: false, error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" };

    try {
      updateStatusBadge("syncing");
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      const uid = cred.user.uid;
      const docData = buildFirestoreDoc({
        studentId,
        name,
        classRoom,
        department,
        avatarId,
        xp: 0,
        badges: [],
        preTestScore: null,
        postTestScore: null,
        units: {},
        arcade: { bestScore: 0, bestCombo: 0, plays: 0, lastScore: 0 },
        createdAt: Date.now()
      }, uid);

      await db.collection("players").doc(uid).set(docData);
      updateStatusBadge("synced");
      return { ok: true, player: { ...docData, id: uid } };
    } catch (err) {
      updateStatusBadge("error");
      return { ok: false, error: mapAuthError(err) };
    }
  }

  async function loginStudent(studentId, password) {
    if (!init()) return { ok: false, error: "ไม่สามารถเชื่อมต่อระบบ Cloud ได้" };
    const email = studentIdToEmail(studentId);
    if (!email) return { ok: false, error: "กรุณากรอกรหัสนักศึกษาให้ถูกต้อง" };
    if (!password) return { ok: false, error: "กรุณากรอกรหัสผ่าน" };

    try {
      updateStatusBadge("syncing");
      const cred = await auth.signInWithEmailAndPassword(email, password);
      const uid = cred.user.uid;
      const snap = await db.collection("players").doc(uid).get();
      if (!snap.exists) {
        updateStatusBadge("error");
        return { ok: false, error: "ไม่พบข้อมูลโปรไฟล์ในฐานข้อมูล Cloud" };
      }
      const data = snap.data();
      updateStatusBadge("synced");
      return { ok: true, player: { ...data, id: uid } };
    } catch (err) {
      updateStatusBadge("error");
      return { ok: false, error: mapAuthError(err) };
    }
  }

  async function savePlayer(player) {
    if (!init() || !auth.currentUser || auth.currentUser.isAnonymous) return false;
    const uid = auth.currentUser.uid;
    if (!player || (player.uid && player.uid !== uid && player.id !== uid)) return false;

    try {
      updateStatusBadge("syncing");
      const docData = buildFirestoreDoc(player, uid);
      await db.collection("players").doc(uid).set(docData, { merge: true });
      updateStatusBadge("synced");
      return true;
    } catch (err) {
      console.warn("[CloudSync] Save failed:", err);
      updateStatusBadge("error");
      return false;
    }
  }

  async function fetchCurrentPlayer() {
    if (!init() || !auth.currentUser || auth.currentUser.isAnonymous) return null;
    try {
      const uid = auth.currentUser.uid;
      const snap = await db.collection("players").doc(uid).get();
      if (!snap.exists) return null;
      return { ...snap.data(), id: uid };
    } catch (err) {
      console.warn("[CloudSync] Fetch current player failed:", err);
      return null;
    }
  }

  async function fetchAllPlayers() {
    if (!init()) return null;
    try {
      if (!auth.currentUser) {
        await auth.signInAnonymously();
      }
      const snap = await db.collection("players").get();
      const list = [];
      snap.forEach(doc => {
        const d = doc.data();
        list.push({ ...d, id: doc.id });
      });
      return list;
    } catch (err) {
      console.warn("[CloudSync] Fetch all players failed:", err);
      return null;
    }
  }

  async function logout() {
    if (!init()) return;
    try {
      await auth.signOut();
    } catch (err) {
      console.warn("[CloudSync] Sign out error:", err);
    }
  }

  function onAuthStateReady(cb) {
    if (!init()) {
      cb(null);
      return;
    }
    let fired = false;
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (fired) return;
      fired = true;
      unsub();
      if (user && !user.isAnonymous) {
        const player = await fetchCurrentPlayer();
        cb(player);
      } else {
        cb(null);
      }
    });
  }

  async function fetchCourseSettings() {
    if (!init()) return null;
    try {
      if (!auth.currentUser) {
        await auth.signInAnonymously();
      }
      const snap = await db.collection("settings").doc("course").get();
      if (!snap.exists) return null;
      return snap.data();
    } catch (err) {
      console.warn("[CloudSync] Fetch course settings failed:", err);
      return null;
    }
  }

  async function saveCourseSettings(settings) {
    if (!init()) return false;
    try {
      if (!auth.currentUser) {
        await auth.signInAnonymously();
      }
      const lockedUnits = Array.isArray(settings.lockedUnits)
        ? settings.lockedUnits.map(n => Math.floor(Number(n))).filter(n => n >= 1 && n <= 13).slice(0, 13)
        : [];
      const payload = {
        lockedUnits,
        lockArcade: !!settings.lockArcade,
        lockPostTest: !!settings.lockPostTest,
        updatedAt: Date.now()
      };
      await db.collection("settings").doc("course").set(payload, { merge: true });
      return true;
    } catch (err) {
      console.warn("[CloudSync] Save course settings failed:", err);
      return false;
    }
  }

  let unsubCourse = null;
  async function subscribeCourseSettings(cb) {
    if (!init()) return;
    try {
      if (!auth.currentUser) {
        await auth.signInAnonymously();
      }
      if (unsubCourse) unsubCourse();
      unsubCourse = db.collection("settings").doc("course").onSnapshot(
        (snap) => {
          if (snap.exists) cb(snap.data());
        },
        (err) => console.warn("[CloudSync] Course settings listener error:", err)
      );
    } catch (err) {
      console.warn("[CloudSync] Subscribe course settings failed:", err);
    }
  }

  return {
    init,
    isAvailable,
    getStatus,
    registerStudent,
    loginStudent,
    savePlayer,
    fetchCurrentPlayer,
    fetchAllPlayers,
    fetchCourseSettings,
    saveCourseSettings,
    subscribeCourseSettings,
    logout,
    onAuthStateReady
  };
})();
