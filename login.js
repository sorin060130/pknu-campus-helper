import { auth } from "./firebase.js";
import { onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const form = document.querySelector("#login-form");
const message = document.querySelector("#login-message");
onAuthStateChanged(auth, (user) => { if (user) location.href = "./admin.html"; });
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true; button.textContent = "로그인 중...";
  try {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    message.textContent = error.code === "auth/invalid-credential" ? "이메일 또는 비밀번호가 올바르지 않습니다." : `로그인에 실패했습니다: ${error.message}`;
    message.className = "form-message error";
    button.disabled = false; button.textContent = "로그인";
  }
});
