export const groupedCarouselExample = `
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

  .carousel-pagination button[aria-current="true"] {
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

  /* Carousel Content for Grouped Items */
  .carousel-content {
    position: relative;
    height: 400px;
    overflow: hidden;
    list-style: none;
    padding: 0;
  }

  .carousel-content li[role="group"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    visibility: hidden;
    transform: translateX(100%);
    transition: all 0.5s ease;
  }

  .carousel-content li[role="group"].active {
    opacity: 1;
    visibility: visible;
    transform: translateX(0);
  }

  /* Group Layout */
  .carousel-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    padding: 2rem;
    height: 350px;
  }

  .carousel-group img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.5rem;
    transition: transform 0.3s ease;
  }

  .carousel-group img:hover {
    transform: scale(1.05);
  }

  /* Caption for Groups */
  .carousel-caption {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    color: white;
    padding: 2rem 1rem 1rem;
    text-align: center;
    font-weight: 500;
  }

  /* Demo placeholder items */
  .demo-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    border-radius: 0.5rem;
  }

  .demo-item-1 { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
  .demo-item-2 { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
  .demo-item-3 { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
  .demo-item-4 { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
  .demo-item-5 { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
  .demo-item-6 { background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); }
  .demo-item-7 { background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); }
  .demo-item-8 { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
  .demo-item-9 { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); }

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

    .carousel-group {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
      padding: 1rem;
    }

    .carousel-caption {
      padding: 1rem 0.5rem 0.5rem;
      font-size: 0.875rem;
    }
  }

  /* For very small screens, show one item per group */
  @media (max-width: 480px) {
    .carousel-group {
      grid-template-columns: 1fr;
    }
  }
</style>

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
    <li id="group1" role="group" aria-label="1 of 3" class="active">
      <div class="carousel-group">
        <div class="demo-item demo-item-1">Item 1</div>
        <div class="demo-item demo-item-2">Item 2</div>
        <div class="demo-item demo-item-3">Item 3</div>
      </div>
      <div class="carousel-caption">Featured Products Collection - Group 1</div>
    </li>
    <li id="group2" role="group" aria-label="2 of 3">
      <div class="carousel-group">
        <div class="demo-item demo-item-4">Item 4</div>
        <div class="demo-item demo-item-5">Item 5</div>
        <div class="demo-item demo-item-6">Item 6</div>
      </div>
      <div class="carousel-caption">Best Sellers Collection - Group 2</div>
    </li>
    <li id="group3" role="group" aria-label="3 of 3">
      <div class="carousel-group">
        <div class="demo-item demo-item-7">Item 7</div>
        <div class="demo-item demo-item-8">Item 8</div>
        <div class="demo-item demo-item-9">Item 9</div>
      </div>
      <div class="carousel-caption">New Arrivals Collection - Group 3</div>
    </li>
  </ul>
</section>

<script>
  // Grouped Carousel functionality
  class GroupedCarousel {
    constructor() {
      this.currentGroup = 0;
      this.totalGroups = 3;
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
        this.previousGroup();
      });

      document.querySelector('.carousel-next').addEventListener('click', () => {
        this.nextGroup();
      });

      // Pagination buttons
      document.querySelectorAll('.carousel-pagination button').forEach((btn, index) => {
        btn.addEventListener('click', () => {
          this.goToGroup(index);
        });
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.target.closest('[aria-roledescription="carousel"]')) {
          switch(e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              this.previousGroup();
              break;
            case 'ArrowRight':
              e.preventDefault();
              this.nextGroup();
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

    goToGroup(index) {
      // Remove active class from current group
      const groups = document.querySelectorAll('.carousel-content li[role="group"]');
      const buttons = document.querySelectorAll('.carousel-pagination button');
      
      groups[this.currentGroup].classList.remove('active');
      buttons[this.currentGroup].setAttribute('aria-current', 'false');

      // Add active class to new group
      this.currentGroup = index;
      groups[this.currentGroup].classList.add('active');
      buttons[this.currentGroup].setAttribute('aria-current', 'true');

      // Announce to screen readers
      this.announceGroupChange();
    }

    nextGroup() {
      const nextIndex = (this.currentGroup + 1) % this.totalGroups;
      this.goToGroup(nextIndex);
    }

    previousGroup() {
      const prevIndex = (this.currentGroup - 1 + this.totalGroups) % this.totalGroups;
      this.goToGroup(prevIndex);
    }

    startAutoPlay() {
      this.autoPlayInterval = setInterval(() => {
        this.nextGroup();
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

    announceGroupChange() {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = \`Group \${this.currentGroup + 1} of \${this.totalGroups}\`;
      
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
            this.nextGroup(); // swipe left
          } else {
            this.previousGroup(); // swipe right
          }
        }
      };

      this.handleSwipe = handleSwipe;
    }
  }

  // Initialize carousel when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new GroupedCarousel());
  } else {
    new GroupedCarousel();
  }
</script>
`;
