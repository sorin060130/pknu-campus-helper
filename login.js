import { auth } from "./firebase.js";
import { onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const form = document.querySelector("#login-form");
const message = document.querySelector("#login-message");
onAuthStateChanged(auth, (user) => { if (user) location.href = "./admin.html"; });
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true; button.textContent = "正在登录...";
  try {
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    message.textContent = error.code === "auth/invalid-credential" ? "邮箱或密码不正确。" : `登录失败：${error.message}`;
    message.className = "form-message error";
    button.disabled = false; button.textContent = "登录";
  }
});
