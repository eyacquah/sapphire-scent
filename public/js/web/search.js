export function handleSearchForm(e) {
  e.preventDefault();

  const searchInput = document.querySelector(".searchInput").value;

  window.location.href = `/search?product=${searchInput}`;
  searchInput.value = "";
}
