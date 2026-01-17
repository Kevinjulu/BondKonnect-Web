import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Clean up after each test
afterEach(() => {
  cleanup()
})

// Mock window.print
Object.defineProperty(window, 'print', {
  value: vi.fn(),
  writable: true,
})

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

// Mock PointerEvent
class PointerEvent extends MouseEvent {
  constructor(type: string, params: any) {
    super(type, params);
  }
}
window.PointerEvent = PointerEvent as any;

// Fix for jsdom/react-dom issues with getSelection
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'getSelection', {
    value: () => ({
      removeAllRanges: vi.fn(),
      addRange: vi.fn(),
      type: 'None',
      anchorNode: null,
      focusNode: null,
      toString: () => '',
    }),
    writable: true,
  })
}