/**
 * Focus trap utility for managing keyboard focus within a container element.
 * Prevents tab navigation from escaping the container, useful for modals and mobile overlays.
 */

const FOCUSABLE_ELEMENTS =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Get all focusable elements within a container
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)).filter(
    (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
  );
}

/**
 * Create a focus trap within a container element
 * @param container - The container element to trap focus within
 * @returns Cleanup function to remove the trap
 */
export function createFocusTrap(container: HTMLElement): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Tab") return;

    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    // Shift + Tab: Focus last element if currently on first
    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    // Tab: Focus first element if currently on last
    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
      return;
    }
  };

  // Add event listener
  document.addEventListener("keydown", handleKeyDown);

  // Focus first focusable element
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }

  // Return cleanup function
  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}

/**
 * Svelte action to trap focus within an element
 * Usage: <div use:focusTrap={isActive}>
 */
export function focusTrap(node: HTMLElement, isActive: boolean = true) {
  let cleanup: (() => void) | null = null;

  function setup() {
    if (isActive && !cleanup) {
      cleanup = createFocusTrap(node);
    }
  }

  function teardown() {
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
  }

  setup();

  return {
    update(newIsActive: boolean) {
      isActive = newIsActive;
      if (isActive) {
        setup();
      } else {
        teardown();
      }
    },
    destroy() {
      teardown();
    },
  };
}
