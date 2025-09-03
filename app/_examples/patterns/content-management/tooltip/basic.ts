export const basicTooltipExample = `
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 2rem;
    background: #f9fafb;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }

  .container {
    width: 100%;
    max-width: 800px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #111827;
  }

  .demo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .demo-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .demo-section h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Tooltip Trigger Styles */
  .tooltip-trigger {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .tooltip-trigger:hover {
    background: #2563eb;
    transform: translateY(-1px);
  }

  .tooltip-trigger:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .icon-button {
    width: 32px;
    height: 32px;
    padding: 0;
    background: transparent;
    border: 1px solid #d1d5db;
    color: #6b7280;
  }

  .icon-button:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
    transform: none;
  }

  /* Tooltip Styles */
  .tooltip {
    position: absolute;
    background: #1f2937;
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.875rem;
    line-height: 1.4;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transform: scale(0.95);
    transition: opacity 0.2s ease-out, transform 0.2s ease-out;
    z-index: 9999;
    max-width: 200px;
  }

  .tooltip.visible {
    opacity: 1;
    transform: scale(1);
  }

  /* Multiline tooltip */
  .tooltip.multiline {
    white-space: normal;
  }

  /* Tooltip Positions */
  .tooltip.top {
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.95);
  }

  .tooltip.top.visible {
    transform: translateX(-50%) scale(1);
  }

  .tooltip.bottom {
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) scale(0.95);
  }

  .tooltip.bottom.visible {
    transform: translateX(-50%) scale(1);
  }

  .tooltip.left {
    left: auto;
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) scale(0.95);
  }

  .tooltip.left.visible {
    transform: translateY(-50%) scale(1);
  }

  .tooltip.right {
    left: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%) scale(0.95);
  }

  .tooltip.right.visible {
    transform: translateY(-50%) scale(1);
  }

  /* Tooltip Arrow */
  .tooltip::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border: 4px solid transparent;
  }

  .tooltip.top::after {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: #1f2937;
  }

  .tooltip.bottom::after {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-bottom-color: #1f2937;
  }

  .tooltip.left::after {
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-left-color: #1f2937;
  }

  .tooltip.right::after {
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-right-color: #1f2937;
  }

  /* Form Example */
  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .form-input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    transition: border-color 0.2s;
  }

  .form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .help-icon {
    width: 16px;
    height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #e5e7eb;
    color: #6b7280;
    border-radius: 50%;
    cursor: help;
    font-size: 0.75rem;
    position: relative;
  }

  /* Rich Tooltip */
  .rich-tooltip {
    max-width: 300px;
    padding: 1rem;
    white-space: normal;
  }

  .rich-tooltip h4 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  .rich-tooltip p {
    margin-bottom: 0.5rem;
    opacity: 0.9;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .rich-tooltip code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.125rem 0.25rem;
    border-radius: 3px;
    font-size: 0.75rem;
  }

  /* Demo Info */
  .info-box {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 6px;
    padding: 1rem;
    margin-top: 2rem;
  }

  .info-box h3 {
    color: #1e40af;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .info-box p {
    color: #3730a3;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  /* Accessibility */
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

  @media (max-width: 640px) {
    .demo-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<div class="container">
  <h2>Tooltip Examples</h2>

  <div class="demo-grid">
    <!-- Basic Positions -->
    <div class="demo-section">
      <h3>Positions</h3>
      <button class="tooltip-trigger" data-tooltip="Top tooltip" data-position="top">
        Hover Top
      </button>
      <button class="tooltip-trigger" data-tooltip="Bottom tooltip" data-position="bottom">
        Hover Bottom
      </button>
      <button class="tooltip-trigger" data-tooltip="Left tooltip" data-position="left">
        Hover Left
      </button>
      <button class="tooltip-trigger" data-tooltip="Right tooltip" data-position="right">
        Hover Right
      </button>
    </div>

    <!-- Icon Buttons -->
    <div class="demo-section">
      <h3>Icon Buttons</h3>
      <button class="tooltip-trigger icon-button" data-tooltip="Settings" data-position="top">
        ⚙️
      </button>
      <button class="tooltip-trigger icon-button" data-tooltip="Delete item" data-position="top">
        🗑️
      </button>
      <button class="tooltip-trigger icon-button" data-tooltip="Share" data-position="top">
        📤
      </button>
      <button class="tooltip-trigger icon-button" data-tooltip="Download" data-position="top">
        📥
      </button>
    </div>
  </div>

  <!-- Form with Help Tooltips -->
  <div class="form-group">
    <label class="form-label">
      Email Address
      <span class="help-icon tooltip-trigger" data-tooltip="We'll never share your email with anyone else" data-position="right">?</span>
    </label>
    <input type="email" class="form-input" placeholder="user@example.com" />
  </div>

  <div class="form-group">
    <label class="form-label">
      Password
      <span class="help-icon tooltip-trigger" data-tooltip="Must be at least 8 characters with one uppercase letter, one lowercase letter, and one number" data-position="right" data-multiline="true">?</span>
    </label>
    <input type="password" class="form-input" placeholder="Enter password" />
  </div>

  <!-- Rich Tooltip Example -->
  <div class="demo-section">
    <h3>Rich Content</h3>
    <button class="tooltip-trigger" data-rich="true" data-position="bottom">
      Advanced Tooltip
    </button>
  </div>

  <!-- Keyboard Support -->
  <div class="demo-section">
    <h3>Keyboard Navigation</h3>
    <button class="tooltip-trigger" data-tooltip="Tab to focus, Escape to dismiss" data-position="top">
      Tab to Focus
    </button>
  </div>

  <div class="info-box">
    <h3>Features Demonstrated</h3>
    <p>
      • Multiple positioning options (top, bottom, left, right)<br>
      • Automatic viewport boundary detection<br>
      • Keyboard support (Tab to focus, Escape to dismiss)<br>
      • Hover delay to prevent accidental triggers<br>
      • ARIA attributes for accessibility<br>
      • Both simple and rich tooltip content
    </p>
  </div>
</div>

<script>
  // Tooltip implementation
  class TooltipManager {
    constructor() {
      this.activeTooltip = null;
      this.showTimeout = null;
      this.hideTimeout = null;
      this.SHOW_DELAY = 500; // Delay before showing tooltip
      this.HIDE_DELAY = 100; // Small delay before hiding
      this.init();
    }

    init() {
      // Find all tooltip triggers
      const triggers = document.querySelectorAll('[data-tooltip], [data-rich]');
      
      triggers.forEach(trigger => {
        // Create tooltip element
        const tooltip = this.createTooltip(trigger);
        trigger.tooltipElement = tooltip;

        // Mouse events
        trigger.addEventListener('mouseenter', (e) => this.handleMouseEnter(e));
        trigger.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));

        // Keyboard events
        trigger.addEventListener('focus', (e) => this.handleFocus(e));
        trigger.addEventListener('blur', (e) => this.handleBlur(e));

        // ARIA attributes
        const tooltipId = 'tooltip-' + Math.random().toString(36).substr(2, 9);
        tooltip.id = tooltipId;
        trigger.setAttribute('aria-describedby', tooltipId);
      });

      // Global keyboard listener for Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.activeTooltip) {
          this.hideTooltip();
        }
      });
    }

    createTooltip(trigger) {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.setAttribute('role', 'tooltip');
      
      if (trigger.dataset.rich) {
        // Rich tooltip content
        tooltip.classList.add('rich-tooltip');
        tooltip.innerHTML = \`
          <h4>Advanced Tooltip</h4>
          <p>This is a rich tooltip with formatted content.</p>
          <p>You can include <code>code snippets</code>, multiple paragraphs, and more detailed information.</p>
        \`;
      } else {
        // Simple tooltip content
        tooltip.textContent = trigger.dataset.tooltip;
        if (trigger.dataset.multiline) {
          tooltip.classList.add('multiline');
        }
      }

      // Add position class
      const position = trigger.dataset.position || 'top';
      tooltip.classList.add(position);

      // Append to trigger's parent for relative positioning
      trigger.style.position = 'relative';
      trigger.appendChild(tooltip);

      return tooltip;
    }

    handleMouseEnter(e) {
      const trigger = e.currentTarget;
      clearTimeout(this.hideTimeout);
      
      this.showTimeout = setTimeout(() => {
        this.showTooltip(trigger);
      }, this.SHOW_DELAY);
    }

    handleMouseLeave(e) {
      clearTimeout(this.showTimeout);
      
      this.hideTimeout = setTimeout(() => {
        this.hideTooltip();
      }, this.HIDE_DELAY);
    }

    handleFocus(e) {
      const trigger = e.currentTarget;
      this.showTooltip(trigger);
    }

    handleBlur(e) {
      this.hideTooltip();
    }

    showTooltip(trigger) {
      // Hide any active tooltip
      if (this.activeTooltip && this.activeTooltip !== trigger.tooltipElement) {
        this.activeTooltip.classList.remove('visible');
      }

      const tooltip = trigger.tooltipElement;
      
      // Check viewport boundaries and adjust position if needed
      setTimeout(() => {
        this.adjustPosition(trigger, tooltip);
      }, 10);

      // Show tooltip
      tooltip.classList.add('visible');
      this.activeTooltip = tooltip;

      // Announce to screen readers
      tooltip.setAttribute('aria-hidden', 'false');
    }

    hideTooltip() {
      if (this.activeTooltip) {
        this.activeTooltip.classList.remove('visible');
        this.activeTooltip.setAttribute('aria-hidden', 'true');
        this.activeTooltip = null;
      }
    }

    adjustPosition(trigger, tooltip) {
      const rect = tooltip.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const position = trigger.dataset.position || 'top';
      
      // Check if tooltip goes outside viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Adjust horizontal position if needed
      if (rect.left < 0) {
        tooltip.style.left = '0';
        tooltip.style.transform = 'translateX(0)';
      } else if (rect.right > viewportWidth) {
        tooltip.style.right = '0';
        tooltip.style.left = 'auto';
        tooltip.style.transform = 'translateX(0)';
      }

      // Adjust vertical position if needed
      if (position === 'top' && rect.top < 0) {
        // Switch to bottom
        tooltip.classList.remove('top');
        tooltip.classList.add('bottom');
      } else if (position === 'bottom' && rect.bottom > viewportHeight) {
        // Switch to top
        tooltip.classList.remove('bottom');
        tooltip.classList.add('top');
      }
    }
  }

  // Initialize tooltips
  document.addEventListener('DOMContentLoaded', () => {
    new TooltipManager();
  });
</script>
`;
