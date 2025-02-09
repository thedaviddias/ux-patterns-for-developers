export const tabbedCarouselExample = `
<!-- Carousel -->
<section aria-roledescription="carousel" aria-label="Featured content">
  <!-- Visually hidden heading for screen readers -->
  <h2 class="sr-only">Featured Content Carousel</h2>

  <!-- See All link with descriptive label -->
  <a
    href="/all-products"
    class="carousel-see-all"
    aria-label="View all featured products"
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
    <button type="button" class="carousel-prev" aria-label="Previous slide">
      <span aria-hidden="true">&lt;</span>
    </button>
    <button type="button" class="carousel-next" aria-label="Next slide">
      <span aria-hidden="true">&gt;</span>
    </button>

    <!-- Pagination with proper ARIA roles -->
    <div class="carousel-pagination" role="tablist" aria-label="Slide controls">
      <button
        type="button"
        id="tab1"
        role="tab"
        aria-selected="true"
        aria-controls="slide1"
      >
        <span class="sr-only">Slide 1</span>
      </button>
      <button
        type="button"
        id="tab2"
        role="tab"
        aria-selected="false"
        aria-controls="slide2"
      >
        <span class="sr-only">Slide 2</span>
      </button>
      <!-- More pagination buttons... -->
    </div>
  </div>

  <!-- Slides -->
  <div class="carousel-content">
    <div id="slide1" role="tabpanel" aria-labelledby="tab1" aria-hidden="false">
      <img src="slide1.jpg" alt="Describe what you see in the picture 1" />
      <div class="carousel-caption">Caption for slide 1</div>
    </div>
    <div id="slide2" role="tabpanel" aria-labelledby="tab2" aria-hidden="true">
      <img src="slide2.jpg" alt="Describe what you see in the picture 2" />
      <div class="carousel-caption">Caption for slide 2</div>
    </div>
    <div id="slide3" role="tabpanel" aria-labelledby="tab3" aria-hidden="true">
      <img src="slide3.jpg" alt="Describe what you see in the picture 3" />
      <div class="carousel-caption">Caption for slide 3</div>
    </div>
  </div>
</section>
`
