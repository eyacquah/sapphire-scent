export async function handleSearchForm(e) {
  e.preventDefault();

  const searchInput = document.querySelector(".searchInput").value;

  window.location.href = `http://127.0.0.1:8000/search?product=${searchInput}`;
  searchInput.value = "";
}
