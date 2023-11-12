console.log("Hello World!");
let currentIndex = 0; // Start with the first item

document.addEventListener('DOMContentLoaded', function updateSlideshow() {
    const totalItems = document.querySelectorAll('.featuredProducts').length;
        const slideItems = document.querySelectorAll('.featuredProducts');
        console.log(slideItems)
        // Reset classes
        slideItems.forEach(item => {
            item.classList.remove('fade-out-left', 'move-left', 'fade-in-right');
            item.style.display = 'none'; // Hide all items
        });
    
        // Calculate next indices
        let nextIndices = [
            currentIndex % totalItems,
            (currentIndex + 1) % totalItems,
            (currentIndex + 2) % totalItems
        ];
    
        console.log(nextIndices);
        // Update classes and display for next items
        nextIndices.forEach((index, arrayIndex) => {
            const item = slideItems[index];
            item.style.display = 'block'; // Show the item
    
            if (arrayIndex === 0) {
                item.classList.add('fade-out-left');
            }
            if (arrayIndex === 1) {
                item.classList.add('move-left');
            }
            if (arrayIndex === 2) {
                item.classList.add('fade-in-right');
            }
        });
    
        currentIndex++; // Move to the next item
        updateSlideshow(); // Initialize the slideshow
setInterval(updateSlideshow, 5000); // Update every 5 seconds
});


