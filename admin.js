import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const form = document.querySelector("#notice-form");
const access = document.querySelector("#access-message");
const welcome = document.querySelector("#admin-welcome");
document.querySelector(".nav-logout").addEventListener("click", async () => { await signOut(auth); location.href = "./login.html"; });

onAuthStateChanged(auth, async (user) => {
  if (!user) { location.href = "./login.html"; return; }
  try {
    const profile = await getDoc(doc(db, "users", user.uid));
    if (profile.exists() && profile.data().role === "admin") {
      access.classList.add("hidden"); form.classList.remove("hidden");
      welcome.textContent = `已登录：${profile.data().name || user.email}`;
    } else {
      access.innerHTML = "<h3>没有管理员权限</h3><p>当前账户不能发布公告，请联系平台管理员授权。</p>";
      welcome.textContent = "权限验证未通过";
    }
  } catch (error) {
    access.innerHTML = `<h3>无法验证权限</h3><p>${error.message}</p>`;
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector('[type="submit"]');
  const message = document.querySelector("#publish-message");
  button.disabled = true; button.textContent = "正在发布...";
  try {
    await addDoc(collection(db, "notices"), { title: form.title.value.trim(), category: form.category.value, department: form.department.value.trim(), content: form.content.value.trim(), pinned: form.pinned.checked, authorId: auth.currentUser.uid, createdAt: serverTimestamp() });
    form.reset(); form.department.value = "福邻社会福祉服务中心";
    message.textContent = "公告已成功发布。"; message.className = "form-message success";
  } catch (error) {
    message.textContent = `发布失败：${error.message}`; message.className = "form-message error";
  } finally {
    button.disabled = false; button.innerHTML = "立即发布 <span>→</span>";
  }
});
