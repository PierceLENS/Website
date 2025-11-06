document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carousel-track');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    
    // Get all slides
    const slides = Array.from(track.children);
    const slideCount = slides.length;
    let currentIndex = 0; // Starts at the first slide (index 0)

    // Function to move the carousel using CSS Transform
    const moveToSlide = (index) => {
        // Handle looping
        if (index < 0) {
            index = slideCount - 1; // Wrap to the last slide
        } else if (index >= slideCount) {
            index = 0; // Wrap to the first slide
        }
        
        currentIndex = index;
        
        // Calculate the percentage to move the track
        // Slide 0: 0%
        // Slide 1: -33.3333%
        // Slide 2: -66.6666%
        const translateValue = -currentIndex * (100 / slideCount);

        // Apply movement using translateX. CSS handles the smooth transition.
        track.style.transform = `translateX(${translateValue}%)`;

        // Update button states (optional, useful if we decide not to loop)
        // updateNavButtons(); 
    };
    
    // Initial call to set the track position (should be 0%)
    moveToSlide(0);

    // Event Listeners
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // Move to the next index
            moveToSlide(currentIndex + 1);
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            // Move to the previous index
            moveToSlide(currentIndex - 1);
        });
    }
});