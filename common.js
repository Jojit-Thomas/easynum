function closeAlert() {
  document.getElementById("alert").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => closeAlert(), 1000 * 5);
});
