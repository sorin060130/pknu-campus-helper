import { db } from "./firebase.js";
import { collection, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const list = document.querySelector("#notice-list");
const search = document.querySelector("#notice-search");
const count = document.querySelector("#notice-count");
let notices = [];
const formatDate = (value) => value?.toDate ? value.toDate().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" }) : "刚刚";
const escapeHtml = (text = "") => { const div = document.createElement("div"); div.textContent = text; return div.innerHTML; };

function render() {
  const keyword = search.value.trim().toLowerCase();
  const filtered = notices.filter((notice) => `${notice.title} ${notice.content} ${notice.category}`.toLowerCase().includes(keyword));
  count.textContent = `共 ${filtered.length} 条公告`;
  list.innerHTML = filtered.length ? filtered.map((notice) => `<article class="notice-row ${notice.pinned ? "pinned" : ""}"><span class="notice-date">${formatDate(notice.createdAt)}</span><div>${notice.pinned ? '<span class="tag coral-tag">置顶</span>' : ""}<span class="tag blue-tag">${escapeHtml(notice.category || "服务通知")}</span><h3>${escapeHtml(notice.title)}</h3><p>${escapeHtml(notice.content)}</p><small>${escapeHtml(notice.department || "福邻社会福祉服务中心")}</small></div></article>`).join("") : '<p class="empty-state">暂无匹配的公告。</p>';
}

search.addEventListener("input", render);
onSnapshot(query(collection(db, "notices"), orderBy("createdAt", "desc")), (snapshot) => {
  notices = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).sort((a, b) => Number(b.pinned) - Number(a.pinned));
  render();
}, () => list.innerHTML = '<p class="empty-state">公告载入失败，请检查 Firebase 配置与 Firestore 规则。</p>');
