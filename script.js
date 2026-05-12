let activities =
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
const title 
