import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as React from 'react'
import { CodeSection } from '../code-section'

// Mock the pre element with different heights
const createMockPreElement = (scrollHeight: number) => {
  const mockPre = document.createElement('pre')
  Object.defineProperty(mockPre, 'scrollHeight', {
    value: scrollHeight,
    writable: true
  })
  return mockPre
}

describe('CodeSection', () => {
  beforeEach(() => {
    // Reset any mocks
    vi.clearAllMocks()
  })

  it('should render children correctly', () => {
    render(
      <CodeSection>
        <pre>
          <code>console.log('test')</code>
        </pre>
      </CodeSection>
    )

    expect(screen.getByText("console.log('test')")).toBeInTheDocument()
  })

  it('should NOT show expand button for short content', async () => {
    // Mock querySelector to return a short pre element
    const mockQuerySelector = vi.fn()
    mockQuerySelector.mockReturnValue(createMockPreElement(200)) // Short content

    const mockRef = { current: { querySelector: mockQuerySelector } }
    vi.spyOn(React, 'useRef').mockReturnValue(mockRef)

    render(
      <CodeSection>
        <pre style={{ height: '200px' }}>
          <code>Short code</code>
        </pre>
      </CodeSection>
    )

    // Wait for useEffect to run
    await waitFor(() => {
      expect(mockQuerySelector).toHaveBeenCalledWith('pre')
    })

    // Should NOT show expand button
    expect(screen.queryByText('Expand')).not.toBeInTheDocument()
  })

  it('should show expand button for tall content', async () => {
    render(
      <CodeSection>
        <pre style={{ height: '500px' }}>
          <code>
            {Array.from({ length: 20 }, (_, i) => `Line ${i + 1}\n`).join('')}
          </code>
        </pre>
      </CodeSection>
    )

    // Wait for height detection
    await waitFor(() => {
      const expandButton = screen.queryByText('Expand')
      expect(expandButton).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('should toggle between Expand and Collapse states', async () => {
    render(
      <CodeSection>
        <pre style={{ height: '500px' }}>
          <code>Very tall content that should trigger expand</code>
        </pre>
      </CodeSection>
    )

    // Wait for expand button to appear
    await waitFor(() => {
      expect(screen.getByText('Expand')).toBeInTheDocument()
    })

    const expandButton = screen.getByText('Expand')

    // Click to expand
    fireEvent.click(expandButton)

    // Should now show Collapse
    expect(screen.getByText('Collapse')).toBeInTheDocument()
    expect(screen.queryByText('Expand')).not.toBeInTheDocument()

    // Click to collapse
    fireEvent.click(screen.getByText('Collapse'))

    // Should show Expand again
    expect(screen.getByText('Expand')).toBeInTheDocument()
  })

  it('should show gradient overlay when collapsed and content is tall', async () => {
    const { container } = render(
      <CodeSection>
        <pre style={{ height: '500px' }}>
          <code>Tall content</code>
        </pre>
      </CodeSection>
    )

    // Wait for height detection
    await waitFor(() => {
      expect(screen.getByText('Expand')).toBeInTheDocument()
    })

    // Should show gradient overlay
    const gradient = container.querySelector('.bg-gradient-to-t')
    expect(gradient).toBeInTheDocument()
  })

  it('should hide gradient overlay when expanded', async () => {
    const { container } = render(
      <CodeSection>
        <pre style={{ height: '500px' }}>
          <code>Tall content</code>
        </pre>
      </CodeSection>
    )

    // Wait for expand button
    await waitFor(() => {
      expect(screen.getByText('Expand')).toBeInTheDocument()
    })

    // Click expand
    fireEvent.click(screen.getByText('Expand'))

    // Gradient should be hidden
    const gradient = container.querySelector('.bg-gradient-to-t')
    expect(gradient).not.toBeInTheDocument()
  })

  it('should apply correct CSS classes for collapsed state', () => {
    const { container } = render(
      <CodeSection>
        <pre><code>Test</code></pre>
      </CodeSection>
    )

    const codeContainer = container.querySelector('[class*="max-h-"]')
    expect(codeContainer).toHaveClass('max-h-[350px]')
    expect(codeContainer).toHaveClass('overflow-hidden')
  })

  it('should apply correct CSS classes for expanded state', async () => {
    const { container } = render(
      <CodeSection>
        <pre style={{ height: '500px' }}>
          <code>Tall content</code>
        </pre>
      </CodeSection>
    )

    // Wait for expand button and click it
    await waitFor(() => {
      expect(screen.getByText('Expand')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Expand'))

    const codeContainer = container.querySelector('[class*="max-h-"]')
    expect(codeContainer).toHaveClass('max-h-none')
  })
})
