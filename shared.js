import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const menu = document.querySelector(".menu-button");
const nav = document.querySelector(".nav");
menu?.addEventListener("click", () => nav.classList.toggle("open"));

document.querySelectorAll(".nav-logout").forEach((button) => {
  button.addEventListener("click", async () => {
    await signOut(auth);
    location.href = "./index.html";
  });
});

onAuthStateChanged(auth, async (user) => {
  document.querySelectorAll(".nav-login").forEach((el) => el.classList.toggle("hidden", !!user));
  document.querySelectorAll(".nav-logout").forEach((el) => el.classList.toggle("hidden", !user));
  if (!user) return;
  try {
    const profile = await getDoc(doc(db, "users", user.uid));
    if (profile.exists() && profile.data().role === "admin") {
      document.querySelectorAll(".admin-link").forEach((el) => el.classList.remove("hidden"));
    }
  } catch (error) {
    console.warn("无法读取用户角色", error);
  }
});
