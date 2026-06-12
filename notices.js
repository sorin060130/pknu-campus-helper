import { db } from "./firebase.js";
import { collection, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const list = document.querySelector("#notice-list");
const search = document.querySelector("#notice-search");
const count = document.querySelector("#notice-count");
let notices = [];
const sampleNotices = [
  { title: "여름철 취약계층 냉방비 지원 신청 안내", category: "서비스 안내", department: "복지온 사회복지서비스센터", content: "폭염에 대비하여 에너지 취약계층을 대상으로 냉방비 지원 신청을 받습니다. 신청 대상과 준비 서류를 확인한 후 가까운 행정복지센터에서 신청해 주세요.", pinned: true, dateLabel: "2026년 6월 12일" },
  { title: "노인맞춤돌봄서비스 이용자 모집", category: "서비스 안내", department: "어르신복지팀", content: "일상생활에 도움이 필요한 어르신을 대상으로 안전 확인, 외출 동행과 생활교육 등 맞춤형 돌봄 서비스를 제공합니다.", pinned: false, dateLabel: "2026년 6월 10일" },
  { title: "아동수당 신청 일정 안내", category: "정책 변경", department: "가족복지팀", content: "아동수당 신규 신청 대상자는 온라인 복지로 또는 주소지 행정복지센터를 통해 신청할 수 있습니다.", pinned: false, dateLabel: "2026년 6월 5일" }
];
const formatDate = (value) => value?.toDate ? value.toDate().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" }) : "방금 전";
const escapeHtml = (text = "") => { const div = document.createElement("div"); div.textContent = text; return div.innerHTML; };

function render() {
  const keyword = search.value.trim().toLowerCase();
  const filtered = notices.filter((notice) => `${notice.title} ${notice.content} ${notice.category}`.toLowerCase().includes(keyword));
  count.textContent = `총 ${filtered.length}건`;
  list.innerHTML = filtered.length ? filtered.map((notice) => `<article class="notice-row ${notice.pinned ? "pinned" : ""}"><span class="notice-date">${notice.dateLabel || formatDate(notice.createdAt)}</span><div>${notice.pinned ? '<span class="tag coral-tag">상단 고정</span>' : ""}<span class="tag blue-tag">${escapeHtml(notice.category || "서비스 안내")}</span><h3>${escapeHtml(notice.title)}</h3><p>${escapeHtml(notice.content)}</p><small>${escapeHtml(notice.department || "복지온 사회복지서비스센터")}</small></div></article>`).join("") : '<p class="empty-state">검색 조건에 맞는 공지사항이 없습니다.</p>';
}

search.addEventListener("input", render);
onSnapshot(query(collection(db, "notices"), orderBy("createdAt", "desc")), (snapshot) => {
  notices = snapshot.empty ? sampleNotices : snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).sort((a, b) => Number(b.pinned) - Number(a.pinned));
  render();
}, () => list.innerHTML = '<p class="empty-state">공지사항을 불러오지 못했습니다. Firebase 설정과 Firestore 규칙을 확인해 주세요.</p>');
