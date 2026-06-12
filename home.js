import { db } from "./firebase.js";
import { collection, limit, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const container = document.querySelector("#home-notices");
const formatDate = (value) => value?.toDate ? value.toDate().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }) : "刚刚";

onSnapshot(query(collection(db, "notices"), orderBy("createdAt", "desc"), limit(3)), (snapshot) => {
  if (snapshot.empty) {
    container.innerHTML = '<p class="empty-state">暂无公告，最新信息将在这里显示。</p>';
    return;
  }
  container.innerHTML = snapshot.docs.map((item) => {
    const notice = item.data();
    const content = notice.content || "";
    return `<a class="notice-row" href="./notices.html"><span class="notice-date">${formatDate(notice.createdAt)}</span><div><span class="tag blue-tag">${escapeHtml(notice.category || "服务通知")}</span><h3>${escapeHtml(notice.title)}</h3><p>${escapeHtml(content).slice(0, 90)}${content.length > 90 ? "..." : ""}</p></div><span class="notice-arrow">→</span></a>`;
  }).join("");
}, () => container.innerHTML = '<p class="empty-state">请先在 firebase-config.js 中完成 Firebase 配置。</p>');

function escapeHtml(text = "") {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
