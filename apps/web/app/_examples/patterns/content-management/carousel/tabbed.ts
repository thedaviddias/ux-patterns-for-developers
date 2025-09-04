export const tabbedCarouselExample = `
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f8fafc;
    line-height: 1.6;
  }

  /* Carousel Container */
  section[aria-roledescription="carousel"] {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
  }

  /* Screen reader only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* See All Link */
  .carousel-see-all {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .carousel-see-all:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: translateY(-1px);
  }

  .carousel-see-all:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Controls Group */
  div[role="group"][aria-label="Carousel controls"] {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    padding: 0.75rem 1rem;
    border-radius: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  /* Control Buttons */
  .carousel-pause,
  .carousel-prev,
  .carousel-next {
    background: #3b82f6;
    color: white;
    border: none;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    transition: all 0.2s;
  }

  .carousel-pause:hover,
  .carousel-prev:hover,
  .carousel-next:hover {
    background: #2563eb;
    transform: scale(1.05);
  }

  .carousel-pause:focus-visible,
  .carousel-prev:focus-visible,
  .carousel-next:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .carousel-pause[aria-pressed="true"] {
    background: #10b981;
  }

  /* Pagination */
  .carousel-pagination {
    display: flex;
    gap: 0.5rem;
  }

  .carousel-pagination button {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: all 0.2s;
  }

  .carousel-pagination button[aria-selected="true"] {
    background: #3b82f6;
    transform: scale(1.2);
  }

  .carousel-pagination button:hover {
    background: rgba(0, 0, 0, 0.5);
  }

  .carousel-pagination button:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Carousel Content */
  .carousel-content {
    position: relative;
    height: 400px;
    overflow: hidden;
  }

  .carousel-content div[role="tabpanel"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    visibility: hidden;
    transform: translateX(100%);
    transition: all 0.5s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .carousel-content div[role="tabpanel"][aria-hidden="false"] {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }

  .carousel-content img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: 0.5rem;
    margin: 0 1rem;
  }

  .carousel-caption {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    right: 2rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: white;
    padding: 2rem 1rem 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    text-align: center;
  }

  /* Touch indicators for mobile */
  @media (max-width: 768px) {
    div[role="group"][aria-label="Carousel controls"] {
      padding: 0.5rem;
      gap: 0.5rem;
    }

    .carousel-pause,
    .carousel-prev,
    .carousel-next {
      width: 2rem;
      height: 2rem;
      font-size: 0.875rem;
    }

    .carousel-caption {
      bottom: 1rem;
      left: 1rem;
      right: 1rem;
      padding: 1rem 0.5rem 0.5rem;
      font-size: 0.875rem;
    }
  }

  /* Demo placeholder images */
  .demo-slide {
    width: 100%;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .demo-slide-1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
  .demo-slide-2 { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
  .demo-slide-3 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
</style>

<!-- Carousel -->
<section aria-roledescription="carousel" aria-label="Featured content">
  <!-- Visually hidden heading for screen readers -->
  <h2 class="sr-only">Featured Content Carousel</h2>

  <!-- See All link with descriptive label -->
  <a
    href="#"
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
      <span aria-hidden="true">‹</span>
    </button>
    <button type="button" class="carousel-next" aria-label="Next slide">
      <span aria-hidden="true">›</span>
    </button>

    <!-- Pagination with proper ARIA roles -->
    <div class="carousel-pagination" role="tablist" aria-label="Slide controls">
      <button
        type="button"
        id="tab1"
        role="tab"
        aria-selected="true"
        aria-controls="slide1"
        data-slide="0"
      >
        <span class="sr-only">Slide 1</span>
      </button>
      <button
        type="button"
        id="tab2"
        role="tab"
        aria-selected="false"
        aria-controls="slide2"
        data-slide="1"
      >
        <span class="sr-only">Slide 2</span>
      </button>
      <button
        type="button"
        id="tab3"
        role="tab"
        aria-selected="false"
        aria-controls="slide3"
        data-slide="2"
      >
        <span class="sr-only">Slide 3</span>
      </button>
    </div>
  </div>

  <!-- Slides -->
  <div class="carousel-content">
    <div id="slide1" role="tabpanel" aria-labelledby="tab1" aria-hidden="false">
      <div class="demo-slide demo-slide-1">Slide 1</div>
      <div class="carousel-caption">Beautiful mountain landscape with crystal clear lakes</div>
    </div>
    <div id="slide2" role="tabpanel" aria-labelledby="tab2" aria-hidden="true">
      <div class="demo-slide demo-slide-2">Slide 2</div>
      <div class="carousel-caption">Stunning sunset over the ocean waves</div>
    </div>
    <div id="slide3" role="tabpanel" aria-labelledby="tab3" aria-hidden="true">
      <div class="demo-slide demo-slide-3">Slide 3</div>
      <div class="carousel-caption">Peaceful forest path through ancient trees</div>
    </div>
  </div>
</section>

<script>
  // Carousel functionality
  class Carousel {
    constructor() {
      this.currentSlide = 0;
      this.totalSlides = 3;
      this.isPlaying = true;
      this.autoPlayInterval = null;
      this.init();
    }

    init() {
      // Start auto-play
      this.startAutoPlay();

      // Event listeners
      document.querySelector('.carousel-pause').addEventListener('click', () => {
        this.toggleAutoPlay();
      });

      document.querySelector('.carousel-prev').addEventListener('click', () => {
        this.previousSlide();
      });

      document.querySelector('.carousel-next').addEventListener('click', () => {
        this.nextSlide();
      });

      // Pagination buttons
      document.querySelectorAll('.carousel-pagination button').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const slideIndex = parseInt(e.target.getAttribute('data-slide'));
          this.goToSlide(slideIndex);
        });
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.target.closest('[aria-roledescription="carousel"]')) {
          switch(e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              this.previousSlide();
              break;
            case 'ArrowRight':
              e.preventDefault();
              this.nextSlide();
              break;
            case ' ':
              e.preventDefault();
              this.toggleAutoPlay();
              break;
          }
        }
      });

      // Pause on hover
      const carousel = document.querySelector('[aria-roledescription="carousel"]');
      carousel.addEventListener('mouseenter', () => {
        if (this.isPlaying) {
          this.pauseAutoPlay();
        }
      });

      carousel.addEventListener('mouseleave', () => {
        if (this.isPlaying) {
          this.startAutoPlay();
        }
      });

      // Touch support
      this.initTouchSupport();
    }

    goToSlide(index) {
      // Hide current slide
      const currentSlideEl = document.getElementById(\`slide\${this.currentSlide + 1}\`);
      const currentTabEl = document.getElementById(\`tab\${this.currentSlide + 1}\`);
      
      currentSlideEl.setAttribute('aria-hidden', 'true');
      currentTabEl.setAttribute('aria-selected', 'false');

      // Show new slide
      this.currentSlide = index;
      const newSlideEl = document.getElementById(\`slide\${this.currentSlide + 1}\`);
      const newTabEl = document.getElementById(\`tab\${this.currentSlide + 1}\`);
      
      newSlideEl.setAttribute('aria-hidden', 'false');
      newTabEl.setAttribute('aria-selected', 'true');

      // Announce to screen readers
      this.announceSlideChange();
    }

    nextSlide() {
      const nextIndex = (this.currentSlide + 1) % this.totalSlides;
      this.goToSlide(nextIndex);
    }

    previousSlide() {
      const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
      this.goToSlide(prevIndex);
    }

    startAutoPlay() {
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, 4000); // 4 second intervals
    }

    pauseAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    }

    toggleAutoPlay() {
      const pauseBtn = document.querySelector('.carousel-pause');
      
      if (this.isPlaying) {
        this.isPlaying = false;
        this.pauseAutoPlay();
        pauseBtn.setAttribute('aria-pressed', 'true');
        pauseBtn.innerHTML = '<span aria-hidden="true">▶</span>';
        pauseBtn.setAttribute('aria-label', 'Resume auto-rotation');
      } else {
        this.isPlaying = true;
        this.startAutoPlay();
        pauseBtn.setAttribute('aria-pressed', 'false');
        pauseBtn.innerHTML = '<span aria-hidden="true">⏸</span>';
        pauseBtn.setAttribute('aria-label', 'Pause auto-rotation');
      }
    }

    announceSlideChange() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = \`Slide \${this.currentSlide + 1} of \${this.totalSlides}\`;
      
      document.body.appendChild(announcement);
      setTimeout(() => announcement.remove(), 1000);
    }

    initTouchSupport() {
      const carousel = document.querySelector('.carousel-content');
      let startX = 0;
      let endX = 0;

      carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
      }, { passive: true });

      carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        this.handleSwipe();
      }, { passive: true });

      const handleSwipe = () => {
        const threshold = 50; // minimum swipe distance
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
          if (diff > 0) {
            this.nextSlide(); // swipe left
          } else {
            this.previousSlide(); // swipe right
          }
        }
      };

      this.handleSwipe = handleSwipe;
    }
  }

  // Initialize carousel when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Carousel());
  } else {
    new Carousel();
  }
</script>
`;
