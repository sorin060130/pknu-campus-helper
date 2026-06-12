const filters = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".policy-card");
const search = document.querySelector("#policy-search");
const empty = document.querySelector("#policy-empty");
let category = "all";

function renderPolicies() {
  const keyword = search.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach((card) => {
    const matchesCategory = category === "all" || card.dataset.category.includes(category);
    const matchesKeyword = card.textContent.toLowerCase().includes(keyword);
    card.classList.toggle("hidden", !(matchesCategory && matchesKeyword));
    if (matchesCategory && matchesKeyword) visible++;
  });
  empty.classList.toggle("hidden", visible > 0);
}
filters.forEach((button) => button.addEventListener("click", () => {
  filters.forEach((item) => item.classList.remove("active"));
  button.classList.add("active"); category = button.dataset.filter; renderPolicies();
}));
search.addEventListener("input", renderPolicies);
