let activities =
JSON.parse(localStorage.getItem("activities"))
|| DEFAULT_ACTIVITIES;

let adminMode = false;

/* =====================
   PERSISTENCIA
===================== */

function save(){
localStorage.setItem("activities", JSON.stringify(activities));
}

/* =====================
   UTILIDADES
===================== */

function openGrimoire(){

document.getElementById("cover").remove();

document.getElementById("app")
.classList.remove("hidden");

renderActivities();

}

/* =====================
   RENDER ACTIVIDADES
===================== */

function renderActivities(){

const grid = document.getElementById("grid");
grid.innerHTML = "";

activities.forEach(activity => {

const card = document.createElement("div");
card.className = "activity-card";

if(activity.locked){
card.classList.add("locked");
} else if(!adminMode){
card.style.cursor = "pointer";
card.addEventListener("click", () => openActivity(activity.id));
}

let adminControls = "";

if(adminMode){

adminControls = `
<div class="admin-controls">

<button title="Editar" onclick="editActivity('${activity.id}')">✏</button>

<button title="Eliminar" onclick="deleteActivity('${activity.id}')">🗑</button>

<button title="${activity.locked ? 'Desbloquear' : 'Bloquear'}" onclick="toggleLock('${activity.id}')">
${activity.locked ? "🔓" : "🔒"}
</button>

</div>
`;

}

if(activity.locked && !adminMode){

card.innerHTML = `
<img src="https://images.pexels.com/photos/5425653/pexels-photo-5425653.jpeg" alt="Carta sellada">
`;

} else {

card.innerHTML = `

${adminControls}

<img src="${activity.image}" alt="${activity.title}">

<div class="overlay">

<h2 class="text-xl text-amber-400 font-[Cinzel]">
${activity.title}
</h2>

<p class="text-sm text-neutral-300 mt-2">
${activity.description}
</p>

<p class="text-xs text-neutral-400 mt-1">
📍 ${activity.location}
</p>

${
!adminMode
? `<p class="text-xs text-amber-400 mt-2">Toca para abrir ✦</p>`
: ""
}

</div>
`;

}

grid.appendChild(card);

});

}

/* =====================
   MODAL DETALLE
===================== */

function openActivity(id){

const activity = activities.find(a => a.id === id);
if(!activity || activity.locked) return;

document.getElementById("modalImg").src = activity.image;
document.getElementById("modalTitle").textContent = activity.title;
document.getElementById("modalDesc").textContent = activity.description;
document.getElementById("modalLocation").textContent = "📍 " + activity.location;

const btn = document.getElementById("modalDownloadBtn");
btn.onclick = () => downloadVoucher(id);

document.getElementById("activityModal").classList.remove("hidden");
document.body.style.overflow = "hidden";

}

function closeActivityModal(event){

if(event && event.target !== document.getElementById("activityModal")
&& !event.target.classList.contains("modal-close")) return;

document.getElementById("activityModal").classList.add("hidden");
document.body.style.overflow = "";

}

/* =====================
   ADMIN CONTROLS
===================== */

function editActivity(id){

const activity = activities.find(a => a.id === id);

document.getElementById("adminFormTitle").textContent = "Editar actividad";
document.getElementById("editingId").value = id;
document.getElementById("formTitle").value = activity.title;
document.getElementById("formDesc").value = activity.description;
document.getElementById("formLocation").value = activity.location;
document.getElementById("formImage").value = activity.image;
document.getElementById("formLocked").checked = activity.locked;

document.getElementById("adminFormModal").classList.remove("hidden");
document.body.style.overflow = "hidden";

}

function deleteActivity(id){

if(!confirm("¿Eliminar esta actividad?")) return;

activities = activities.filter(a => a.id !== id);

save();
renderActivities();

}

function toggleLock(id){

const activity = activities.find(a => a.id === id);
activity.locked = !activity.locked;

save();
renderActivities();

}

function deactivateAdmin(){

adminMode = false;
document.body.classList.remove("admin-active");
document.getElementById("adminPanel").classList.add("hidden");
renderActivities();

}

/* =====================
   CREAR / EDITAR
===================== */

function showAddActivity(){

document.getElementById("adminFormTitle").textContent = "Nueva actividad";
document.getElementById("editingId").value = "";
document.getElementById("formTitle").value = "";
document.getElementById("formDesc").value = "";
document.getElementById("formLocation").value = "";
document.getElementById("formImage").value = "";
document.getElementById("formLocked").checked = true;

document.getElementById("adminFormModal").classList.remove("hidden");
document.body.style.overflow = "hidden";

}

function submitActivityForm(){

const id = document.getElementById("editingId").value;
const title = document.getElementById("formTitle").value.trim();
const description = document.getElementById("formDesc").value.trim();
const location = document.getElementById("formLocation").value.trim();
const image = document.getElementById("formImage").value.trim();
const locked = document.getElementById("formLocked").checked;

if(!title || !image){
alert("El título y la imagen son obligatorios.");
return;
}

if(id){
const activity = activities.find(a => a.id === id);
activity.title = title;
activity.description = description;
activity.location = location;
activity.image = image;
activity.locked = locked;

} else {

activities.push({
id: crypto.randomUUID(),
title,
description,
location,
image,
locked
});

}

save();
closeAdminForm();
renderActivities();

}

function closeAdminForm(event){

if(event && event.target !== document.getElementById("adminFormModal")
&& !event.target.classList.contains("btn-cancel")) return;

document.getElementById("adminFormModal").classList.add("hidden");
document.body.style.overflow = "";

}

/* =====================
   VALE PERGAMINO
===================== */

function downloadVoucher(id){

const activity = activities.find(a => a.id === id);

const voucherCanvas = document.createElement("canvas");
voucherCanvas.width = 900;
voucherCanvas.height = 1400;

const vctx = voucherCanvas.getContext("2d");

/* fondo oscuro fantasy */

const bgGradient = vctx.createLinearGradient(0,0,0,1400);

bgGradient.addColorStop(0,"#16110a");
bgGradient.addColorStop(.5,"#24180c");
bgGradient.addColorStop(1,"#120c07");

vctx.fillStyle = bgGradient;
vctx.fillRect(0,0,900,1400);

/* partículas */

for(let i=0;i<4000;i++){

vctx.fillStyle = "rgba(251,191,36,.04)";

vctx.fillRect(
Math.random()*900,
Math.random()*1400,
1,
1
);

}

/* panel pergamino */

const parchmentGradient = vctx.createLinearGradient(0,0,0,1100);

parchmentGradient.addColorStop(0,"#efe2b8");
parchmentGradient.addColorStop(.5,"#e3d1a2");
parchmentGradient.addColorStop(1,"#d7c08b");

vctx.fillStyle = parchmentGradient;

vctx.fillRect(80,80,740,1240);

/* textura */

for(let i=0;i<10000;i++){

vctx.fillStyle = "rgba(0,0,0,.02)";

vctx.fillRect(
80 + Math.random()*740,
80 + Math.random()*1240,
1,
1
);

}

/* bordes */

vctx.strokeStyle = "#6b4f2a";
vctx.lineWidth = 8;
vctx.strokeRect(80,80,740,1240);

vctx.strokeStyle = "#b08b4f";
vctx.lineWidth = 2;
vctx.strokeRect(100,100,700,1200);

/* títulos */

vctx.textAlign = "center";
vctx.fillStyle = "#3b2a17";

vctx.font = "48px Cinzel";
vctx.fillText("Las Crónicas del Año 40",450,170);

vctx.font = "26px Cinzel";
vctx.fillText("Vale de experiencia",450,230);

/* línea */

vctx.beginPath();
vctx.moveTo(260,280);
vctx.lineTo(640,280);
vctx.strokeStyle = "#b08b4f";
vctx.lineWidth = 2;
vctx.stroke();

/* imagen actividad */

const activityImg = new Image();
activityImg.crossOrigin = "anonymous";
activityImg.src = activity.image;

activityImg.onload = () => {

vctx.fillStyle = "#2b1d0f";
vctx.fillRect(180,330,540,300);

vctx.drawImage(activityImg,195,345,510,270);

/* título actividad */

vctx.fillStyle = "#3b2a17";
vctx.font = "38px Cinzel";
vctx.fillText(activity.title,450,730);

/* descripción */

vctx.font = "24px serif";
wrapText(vctx,activity.description,450,810,560,38);

/* info */

vctx.font = "22px serif";
vctx.fillText("Portadora del vale",450,1010);

vctx.font = "36px Cinzel";
vctx.fillText("Vanessa",450,1070);

vctx.font = "22px serif";
vctx.fillText(activity.location,450,1140);

/* sello */

const seal = new Image();
seal.src = "cronicas.png";

seal.onload = () => {

vctx.save();

vctx.globalAlpha = .95;
vctx.globalCompositeOperation = "multiply";

vctx.drawImage(seal,310,1120,280,280);

vctx.restore();

/* descarga */

const link = document.createElement("a");

link.download = "vale_" + activity.title + ".png";
link.href = voucherCanvas.toDataURL("image/png");
link.click();

};

};

}

function wrapText(ctx,text,x,y,maxWidth,lineHeight){

const words = text.split(" ");
let line = "";

for(let n = 0; n < words.length; n++){

const testLine = line + words[n] + " ";
const metrics = ctx.measureText(testLine);

if(metrics.width > maxWidth && n > 0){
ctx.fillText(line,x,y);
line = words[n] + " ";
y += lineHeight;
} else {
line = testLine;
}

}

ctx.fillText(line,x,y);

}

/* =====================
   ADMIN MODE
===================== */

document.addEventListener("keydown", e => {

if(e.ctrlKey && e.altKey && e.key.toLowerCase() === "a"){

const pass = prompt("Contraseña admin");

if(pass === "vane40"){

adminMode = true;

document.body.classList.add("admin-active");

document.getElementById("adminPanel")
.classList.remove("hidden");

renderActivities();

}

}

});

/* =====================
   INIT
===================== */

renderActivities();

/* =====================
   PARTÍCULAS
===================== */

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
const PARTICLE_COUNT = 60;

function resizeCanvas(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createParticles(){

particles = [];

for(let i = 0; i < PARTICLE_COUNT; i++){

particles.push({
x: Math.random() * canvas.width,
y: Math.random() * canvas.height,
size: Math.random() * 2 + 1,
speedY: Math.random() * 0.4 + 0.1,
speedX: Math.random() * 0.2 - 0.1,
opacity: Math.random() * 0.5 + 0.3
});

}

}

createParticles();

function drawParticles(){

ctx.clearRect(0,0,canvas.width,canvas.height);

particles.forEach(p => {

ctx.beginPath();
ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
ctx.fillStyle = `rgba(251,191,36,${p.opacity})`;
ctx.fill();

p.y -= p.speedY;
p.x += p.speedX;

if(p.y < -10){
p.y = canvas.height + 10;
p.x = Math.random() * canvas.width;
}

});

requestAnimationFrame(drawParticles);

}

drawParticles();
```

---

# IMPORTANTE

Tu imagen `cronicas.png` debe ser:

```plaintext
/project
   ├── index.html
   ├── styles.css
   ├── script.js
   ├── cronicas.png
```

Y ahora:

* el sello ya no tendrá el cuadrado beige
* las cards usarán el sello integrado
* el voucher tendrá la nueva estética oscura fantasy
* el sello del voucher se fundirá con el pergamino
* todo tendrá coherencia visual
