import { db } from "./firebase.js";
import { collection, limit, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const container = document.querySelector("#home-notices");
const formatDate = (value) => value?.toDate ? value.toDate().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) : "방금 전";
const sampleNotices = [
  { title: "여름철 취약계층 냉방비 지원 신청 안내", category: "서비스 안내", content: "폭염에 대비하여 에너지 취약계층을 대상으로 냉방비 지원 신청을 받습니다.", dateLabel: "2026년 6월 12일" },
  { title: "노인맞춤돌봄서비스 이용자 모집", category: "서비스 안내", content: "일상생활에 도움이 필요한 어르신에게 맞춤형 돌봄 서비스를 제공합니다.", dateLabel: "2026년 6월 10일" },
  { title: "아동수당 신청 일정 안내", category: "정책 변경", content: "온라인 복지로 또는 주소지 행정복지센터에서 신청할 수 있습니다.", dateLabel: "2026년 6월 5일" }
];

onSnapshot(query(collection(db, "notices"), orderBy("createdAt", "desc"), limit(3)), (snapshot) => {
  const notices = snapshot.empty ? sampleNotices : snapshot.docs.map((item) => item.data());
  container.innerHTML = notices.map((notice) => {
    const content = notice.content || "";
    return `<a class="notice-row" href="./notices.html"><span class="notice-date">${notice.dateLabel || formatDate(notice.createdAt)}</span><div><span class="tag blue-tag">${escapeHtml(notice.category || "서비스 안내")}</span><h3>${escapeHtml(notice.title)}</h3><p>${escapeHtml(content).slice(0, 90)}${content.length > 90 ? "..." : ""}</p></div><span class="notice-arrow">→</span></a>`;
  }).join("");
}, () => container.innerHTML = '<p class="empty-state">firebase-config.js에서 Firebase 설정을 먼저 완료해 주세요.</p>');

function escapeHtml(text = "") {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
