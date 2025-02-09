export const groupedCarouselExample = `
<!-- Carousel -->
<section aria-roledescription="carousel" aria-label="Grouped content carousel">
  <!-- Visually hidden heading for screen readers -->
  <h2 class="sr-only">Grouped Content Carousel</h2>

  <!-- See All link with descriptive label -->
  <a
    href="/all-products"
    class="carousel-see-all"
    aria-label="View all featured groups"
  >
    See All Products
  </a>

  <!-- Controls Group -->
  <div role="group" aria-label="Carousel controls">
    <!-- Pause/Play button -->
    <button
      type="button"
      class="carousel-pause"
      aria-label="Pause auto-rotation"
      aria-pressed="false"
    >
      <span aria-hidden="true">⏸</span>
    </button>
    <!-- Navigation controls -->
    <button type="button" class="carousel-prev" aria-label="Previous group">
      <span aria-hidden="true">&lt;</span>
    </button>
    <button type="button" class="carousel-next" aria-label="Next group">
      <span aria-hidden="true">&gt;</span>
    </button>

    <!-- Pagination with proper ARIA roles -->
    <div class="carousel-pagination" role="group" aria-label="Group controls">
      <button
        type="button"
        aria-label="Show group 1 of 3"
        aria-current="true"
        aria-controls="group1"
      >
        <span class="sr-only">Group 1</span>
      </button>
      <button
        type="button"
        aria-label="Show group 2 of 3"
        aria-controls="group2"
      >
        <span class="sr-only">Group 2</span>
      </button>
      <!-- More pagination buttons... -->
    </div>
  </div>

  <!-- Grouped Slides -->
  <ul
    class="carousel-content"
    role="list"
    aria-live="polite"
    aria-atomic="true"
  >
    <li id="group1" role="group" aria-label="1 of 3">
      <div class="carousel-group">
        <img src="image1.jpg" alt="Description of image 1" />
        <img src="image2.jpg" alt="Description of image 2" />
        <img src="image3.jpg" alt="Description of image 3" />
      </div>
      <div class="carousel-caption">Caption for group 1</div>
    </li>
    <li id="group2" role="group" aria-label="2 of 3">
      <div class="carousel-group">
        <img src="image4.jpg" alt="Description of image 4" />
        <img src="image5.jpg" alt="Description of image 5" />
        <img src="image6.jpg" alt="Description of image 6" />
      </div>
      <div class="carousel-caption">Caption for group 2</div>
    </li>
    <li id="group3" role="group" aria-label="3 of 3">
      <div class="carousel-group">
        <img src="image7.jpg" alt="Description of image 7" />
        <img src="image8.jpg" alt="Description of image 8" />
        <img src="image9.jpg" alt="Description of image 9" />
      </div>
      <div class="carousel-caption">Caption for group 3</div>
    </li>
    <!-- More groups... -->
  </ul>
</section>
`;
