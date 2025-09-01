export const basicBackToTopExample = `
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    font-family: system-ui, -apple-system, sans-serif;
    background: linear-gradient(to bottom, #f0f9ff, #e0f2fe);
    min-height: 200vh; /* Ensure scrollable content */
  }
  
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  header {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    position: sticky;
    top: 1rem;
    z-index: 10;
  }
  
  h1 {
    color: #0f172a;
    margin-bottom: 0.5rem;
  }
  
  .subtitle {
    color: #64748b;
  }
  
  .content-section {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }
  
  .content-section h2 {
    color: #1e293b;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e2e8f0;
  }
  
  .content-section p {
    color: #475569;
    line-height: 1.7;
    margin-bottom: 1rem;
  }
  
  .content-section:last-child {
    margin-bottom: 4rem;
  }
  
  /* Back to Top Button */
  .back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 3rem;
    height: 3rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    z-index: 100;
  }
  
  .back-to-top.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
  
  .back-to-top:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  .back-to-top:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  
  .back-to-top:active {
    transform: translateY(0);
  }
  
  /* Arrow icon */
  .back-to-top::before {
    content: '↑';
    font-weight: bold;
  }
  
  /* Scroll progress indicator */
  .scroll-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: #e2e8f0;
    z-index: 1000;
  }
  
  .scroll-progress-bar {
    height: 100%;
    background: linear-gradient(to right, #3b82f6, #8b5cf6);
    width: 0%;
    transition: width 0.1s ease-out;
  }
  
  /* Demo scroll indicator */
  .scroll-indicator {
    position: fixed;
    bottom: 2rem;
    left: 2rem;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    z-index: 100;
  }
  
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    
    .back-to-top {
      transition: opacity 0.2s ease;
    }
  }
  
  @media (max-width: 640px) {
    .back-to-top {
      bottom: 1rem;
      right: 1rem;
      width: 2.5rem;
      height: 2.5rem;
      font-size: 1.25rem;
    }
    
    .scroll-indicator {
      display: none;
    }
  }
</style>

<div class="scroll-progress">
  <div class="scroll-progress-bar" id="progressBar"></div>
</div>

<div class="container">
  <header>
    <h1>Back to Top Demo</h1>
    <p class="subtitle">Scroll down to see the button appear</p>
  </header>
  
  <section class="content-section">
    <h2>Introduction</h2>
    <p>This is a demonstration of the Back to Top pattern. As you scroll down this page, you'll notice a button appears in the bottom-right corner after you've scrolled past a certain threshold.</p>
    <p>The button provides a quick way to return to the top of the page without manually scrolling. This is especially useful on long pages with extensive content.</p>
  </section>
  
  <section class="content-section">
    <h2>Features</h2>
    <p>This implementation includes several key features:</p>
    <p><strong>Smooth Scrolling:</strong> The page scrolls smoothly to the top when the button is clicked, providing a pleasant user experience.</p>
    <p><strong>Progressive Appearance:</strong> The button only appears after scrolling down a significant distance (300px in this demo), avoiding clutter when it's not needed.</p>
    <p><strong>Keyboard Support:</strong> The button is fully keyboard accessible and can be activated with Enter or Space keys.</p>
    <p><strong>Visual Feedback:</strong> Hover and active states provide clear feedback to users.</p>
  </section>
  
  <section class="content-section">
    <h2>Accessibility</h2>
    <p>The Back to Top button follows accessibility best practices:</p>
    <p>It includes proper ARIA labels for screen readers, ensuring all users understand its purpose.</p>
    <p>The button is keyboard focusable and shows a clear focus indicator when navigated to via keyboard.</p>
    <p>For users who prefer reduced motion, the smooth scrolling is automatically disabled, respecting their system preferences.</p>
  </section>
  
  <section class="content-section">
    <h2>Performance</h2>
    <p>This implementation is optimized for performance:</p>
    <p>The scroll event is throttled to prevent excessive calculations during scrolling.</p>
    <p>CSS transitions are used for the button's appearance animation, leveraging GPU acceleration.</p>
    <p>The button is hidden using both opacity and visibility properties to ensure it doesn't interfere with other page elements when not visible.</p>
  </section>
  
  <section class="content-section">
    <h2>Mobile Considerations</h2>
    <p>On mobile devices, the button is positioned to be easily reachable with the thumb.</p>
    <p>The touch target size meets accessibility guidelines (minimum 44x44 pixels).</p>
    <p>The button size is slightly reduced on smaller screens to avoid taking up too much space.</p>
  </section>
  
  <section class="content-section">
    <h2>Try It Out!</h2>
    <p>Keep scrolling to see the Back to Top button in action. Notice how it fades in smoothly once you've scrolled past the threshold.</p>
    <p>Click or tap the button to instantly return to the top of the page. The smooth scrolling animation makes the transition pleasant and helps maintain context.</p>
    <p>Try using your keyboard: Tab to focus the button and press Enter or Space to activate it.</p>
  </section>
</div>

<button 
  type="button" 
  class="back-to-top" 
  id="backToTop"
  aria-label="Back to top"
  title="Back to top"
></button>

<div class="scroll-indicator" id="scrollIndicator">
  Scroll: <span id="scrollPercent">0</span>%
</div>

<script>
  // Configuration
  const SCROLL_THRESHOLD = 300; // Show button after scrolling 300px
  const THROTTLE_DELAY = 100; // Throttle scroll events
  
  // Throttle function to limit scroll event frequency
  function throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }
  
  // Update button visibility and progress bar
  function updateScrollIndicators() {
    const backToTopBtn = document.getElementById('backToTop');
    const progressBar = document.getElementById('progressBar');
    const scrollPercent = document.getElementById('scrollPercent');
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / documentHeight) * 100;
    
    // Update progress bar
    progressBar.style.width = scrollPercentage + '%';
    
    // Update scroll percentage display
    scrollPercent.textContent = Math.round(scrollPercentage);
    
    // Show/hide back to top button
    if (scrollTop > SCROLL_THRESHOLD) {
      backToTopBtn.classList.add('visible');
      backToTopBtn.setAttribute('aria-hidden', 'false');
    } else {
      backToTopBtn.classList.remove('visible');
      backToTopBtn.setAttribute('aria-hidden', 'true');
    }
  }
  
  // Scroll to top function
  function scrollToTop() {
    // For browsers that don't support smooth scrolling
    if (!CSS.supports('scroll-behavior', 'smooth')) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    
    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = 'Scrolled to top of page';
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }
  
  // Initialize after a brief delay
  setTimeout(() => {
    const backToTopBtn = document.getElementById('backToTop');
    
    // Event listeners
    const throttledScrollHandler = throttle(updateScrollIndicators, THROTTLE_DELAY);
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    // Button click handler
    backToTopBtn.addEventListener('click', scrollToTop);
    
    // Keyboard support
    backToTopBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        scrollToTop();
      }
    });
    
    // Initialize on load
    updateScrollIndicators();
  }, 100);
</script>
`;
