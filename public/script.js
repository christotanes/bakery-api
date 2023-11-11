console.log("Hello World!");
let slideIndex = 0;
showSlides();

function showSlides() {
  let slides = document.querySelectorAll(".featuredProducts");
  
  // Hide all featuredProducts
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  
  // Show the next 3 featuredProducts
  for (let i = slideIndex; i < slideIndex + 3; i++) {
    if (i < slides.length) {
      slides[i].style.display = "flex";
    }
  }
  
  slideIndex += 3;
  
  // Reset slideIndex if it exceeds the number of slides
  if (slideIndex >= slides.length) {
    slideIndex = 0;
  }
  
  setTimeout(showSlides, 10000); // Change image every 10 seconds
}

