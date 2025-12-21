document.addEventListener("DOMContentLoaded", () => {
  const sideMenu = document.getElementById("sideMenu");
  const hamburger = document.querySelector(".hamburger");
  const menuLinks = document.querySelectorAll("#sideMenu a");

  if (!sideMenu || !hamburger) return;

  let ignoreNextDocClick = false;

  function toggleMenuInternal() {
    sideMenu.classList.toggle("open");
    document.body.classList.toggle("menu-open");

    // Hamburger animation
    hamburger.classList.toggle("active");
    hamburger.textContent = hamburger.classList.contains("active") ? "✖" : "☰";

    ignoreNextDocClick = true;
    setTimeout(() => { ignoreNextDocClick = false; }, 50);
  }

  // Expose for onclick="toggleMenu()"
  window.toggleMenu = toggleMenuInternal;

  // Close when clicking outside
  document.addEventListener("click", (event) => {
    if (ignoreNextDocClick) return;

    const insideMenu = sideMenu.contains(event.target);
    const onHamburger = hamburger.contains(event.target);
    if (insideMenu || onHamburger) return;

    sideMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
    hamburger.classList.remove("active");
    hamburger.textContent = "☰";
  });

  // Close when clicking a link
  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
      sideMenu.classList.remove("open");
      document.body.classList.remove("menu-open");
      hamburger.classList.remove("active");
      hamburger.textContent = "☰";
    });
  });
});