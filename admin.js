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
      welcome.textContent = `로그인 계정: ${profile.data().name || user.email}`;
    } else {
      access.innerHTML = "<h3>관리자 권한이 없습니다</h3><p>현재 계정으로는 공지사항을 등록할 수 없습니다. 플랫폼 관리자에게 권한을 요청해 주세요.</p>";
      welcome.textContent = "관리자 권한을 확인할 수 없습니다";
    }
  } catch (error) {
    access.innerHTML = `<h3>권한 확인에 실패했습니다</h3><p>${error.message}</p>`;
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector('[type="submit"]');
  const message = document.querySelector("#publish-message");
  button.disabled = true; button.textContent = "등록 중...";
  try {
    await addDoc(collection(db, "notices"), { title: form.title.value.trim(), category: form.category.value, department: form.department.value.trim(), content: form.content.value.trim(), pinned: form.pinned.checked, authorId: auth.currentUser.uid, createdAt: serverTimestamp() });
    form.reset(); form.department.value = "복지온 사회복지서비스센터";
    message.textContent = "공지사항이 등록되었습니다."; message.className = "form-message success";
  } catch (error) {
    message.textContent = `공지사항 등록에 실패했습니다: ${error.message}`; message.className = "form-message error";
  } finally {
    button.disabled = false; button.innerHTML = "공지 등록 <span>→</span>";
  }
});
