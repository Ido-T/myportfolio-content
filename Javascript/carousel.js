document.addEventListener("DOMContentLoaded", () => {
  const carouselImg = document.getElementById("carousel-img");

  if (!carouselImg) return;

  const images = [
    "images/profile1.jpg",
    "images/profile2.jpg",
    "images/profile3.jpg"
  ];

  // Preload
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });

  let index = 0;
  carouselImg.src = images[0];
  carouselImg.style.transition = "opacity 0.6s ease-in-out";

  setInterval(() => {
    index = (index + 1) % images.length;
    carouselImg.style.opacity = 0;

    setTimeout(() => {
      carouselImg.src = images[index];
      carouselImg.style.opacity = 1;
    }, 500);
  }, 3000);
});