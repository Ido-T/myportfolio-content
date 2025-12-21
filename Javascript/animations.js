document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll("#sideMenu ul li");

  menuItems.forEach((item, i) => {
    item.style.opacity = 0;
    item.style.transform = "translateX(20px)";
    item.style.transition = `opacity 0.3s ease ${i * 0.1}s, transform 0.3s ease ${i * 0.1}s`;
  });

  const sideMenu = document.getElementById("sideMenu");

  const observer = new MutationObserver(() => {
    if (sideMenu.classList.contains("open")) {
      menuItems.forEach(item => {
        item.style.opacity = 1;
        item.style.transform = "translateX(0)";
      });
    } else {
      menuItems.forEach(item => {
        item.style.opacity = 0;
        item.style.transform = "translateX(20px)";
      });
    }
  });

  observer.observe(sideMenu, { attributes: true });
});