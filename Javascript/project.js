document.addEventListener("DOMContentLoaded", () => {

  /* ==================================================
     SIDE MENU
  ================================================== */

  const sideMenu = document.getElementById("sideMenu");
  const hamburger = document.querySelector(".hamburger");
  const menuLinks = document.querySelectorAll("#sideMenu a");

  if (sideMenu && hamburger) {
    let ignoreNextClick = false;

    function toggleMenu() {
      sideMenu.classList.toggle("open");
      hamburger.classList.toggle("active");
      hamburger.textContent = hamburger.classList.contains("active") ? "✖" : "☰";

      ignoreNextClick = true;
      setTimeout(() => ignoreNextClick = false, 50);
    }

    // Expose for inline HTML onclick
    window.toggleMenu = toggleMenu;

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (ignoreNextClick) return;
      if (!sideMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
      }
    });

    // Close when clicking menu links
    menuLinks.forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    function closeMenu() {
      sideMenu.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.textContent = "☰";
    }
  }

  /* ==================================================
     FEATURED PROJECTS CAROUSEL
  ================================================== */

  const track = document.querySelector(".carousel-track");
  const dotsContainer = document.querySelector(".carousel-dots");

  if (track && dotsContainer) {
    const slides = Array.from(track.children);
    let currentIndex = 0;
    let interval;

    // Create dots
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      if (index === 0) dot.classList.add("active");
      dotsContainer.appendChild(dot);

      dot.addEventListener("click", () => {
        goToSlide(index);
        resetInterval();
      });
    });

    const dots = Array.from(dotsContainer.children);

    function goToSlide(index) {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(dot => dot.classList.remove("active"));
      dots[index].classList.add("active");
      currentIndex = index;
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      goToSlide(currentIndex);
    }

    function startAutoSlide() {
      interval = setInterval(nextSlide, 4000);
    }

    function resetInterval() {
      clearInterval(interval);
      startAutoSlide();
    }

    // Pause on hover
    track.addEventListener("mouseenter", () => clearInterval(interval));
    track.addEventListener("mouseleave", startAutoSlide);

    startAutoSlide();
  }

  /* ==================================================
     SCROLL ANIMATIONS
  ================================================== */

  const animatedItems = document.querySelectorAll(".card, .featured-card");

  if (animatedItems.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    animatedItems.forEach(item => observer.observe(item));
  }

});
