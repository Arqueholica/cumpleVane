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
document.getElementById("cover").style.display = "none";
document.getElementById("app").classList.remove("hidden");
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
<div class="sealed-label">
<p class="sealed-icon">✧</p>
<p class="sealed-text">Sellado</p>
</div>
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
   MODAL DETALLE (usuario)
===================== */

function openActivity(id){

const activity = activities.find(a => a.id === id);
if(!activity || activity.locked) return;

document.getElementById("modalImg").src = activity.image;
document.getElementById("modalImg").alt = activity.title;
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
   CREAR / EDITAR (modal)
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
/* edición */
const activity = activities.find(a => a.id === id);
activity.title = title;
activity.description = description;
activity.location = location;
activity.image = image;
activity.locked = locked;
} else {
/* nueva */
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

const canvas = document.createElement("canvas");
canvas.width = 800;
canvas.height = 1200;

const ctx = canvas.getContext("2d");

/* fondo pergamino */

const gradient = ctx.createLinearGradient(0, 0, 0, 1200);

gradient.addColorStop(0, "#f8f1d4");
gradient.addColorStop(.5, "#efe2b8");
gradient.addColorStop(1, "#e5d6a5");

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 800, 1200);

/* textura */

for(let i = 0; i < 5000; i++){
ctx.fillStyle = "rgba(0,0,0,.03)";
ctx.fillRect(Math.random() * 800, Math.random() * 1200, 1, 1);
}

/* borde */

ctx.strokeStyle = "#6b4f2a";
ctx.lineWidth = 8;
ctx.strokeRect(30, 30, 740, 1140);

/* texto */

ctx.textAlign = "center";
ctx.fillStyle = "#3b2a17";

ctx.font = "42px Cinzel";
ctx.fillText("Las Crónicas del Año 40", 400, 140);

ctx.font = "28px Cinzel";
ctx.fillText("Vale de experiencia", 400, 210);

ctx.font = "34px Cinzel";
ctx.fillText(activity.title, 400, 380);

ctx.font = "22px serif";
wrapText(ctx, activity.description, 400, 470, 520, 32);

ctx.font = "20px serif";
ctx.fillText("Portadora del vale:", 400, 650);

ctx.font = "28px Cinzel";
ctx.fillText("Vanessa", 400, 700);

ctx.font = "20px serif";
ctx.fillText("Ubicación: " + activity.location, 400, 820);

ctx.font = "24px Cinzel";
ctx.fillText("✧ Sello del Grimorio ✧", 400, 1000);

const link = document.createElement("a");
link.download = "vale_" + activity.title + ".png";
link.href = canvas.toDataURL();
link.click();

}

function wrapText(ctx, text, x, y, maxWidth, lineHeight){

const words = text.split(" ");
let line = "";

for(let n = 0; n < words.length; n++){

const testLine = line + words[n] + " ";
const metrics = ctx.measureText(testLine);

if(metrics.width > maxWidth && n > 0){
ctx.fillText(line, x, y);
line = words[n] + " ";
y += lineHeight;
} else {
line = testLine;
}

}

ctx.fillText(line, x, y);

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
   PARTÍCULAS MÁGICAS
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

ctx.clearRect(0, 0, canvas.width, canvas.height);

particles.forEach(p => {

ctx.beginPath();
ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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