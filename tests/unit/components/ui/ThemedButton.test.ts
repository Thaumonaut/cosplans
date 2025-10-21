import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ThemedButton from '$lib/components/ui/ThemedButton.svelte';

describe('ThemedButton', () => {
  it('renders with default type button', () => {
    const { container } = render(ThemedButton);
    
    const button = container.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.type).toBe('button');
  });

  it('renders with custom type', () => {
    const { container } = render(ThemedButton, {
      props: { type: 'submit' }
    });
    
    const button = container.querySelector('button');
    expect(button?.type).toBe('submit');
  });

  it('renders primary variant with correct styles', () => {
    const { container } = render(ThemedButton, {
      props: { variant: 'primary' }
    });
    
    const button = container.querySelector('button');
    expect(button?.getAttribute('style')).toContain('--theme-sidebar-accent');
  });

  it('renders secondary variant with correct styles', () => {
    const { container } = render(ThemedButton, {
      props: { variant: 'secondary' }
    });
    
    const button = container.querySelector('button');
    expect(button?.getAttribute('style')).toContain('--theme-sidebar-border');
  });

  it('renders danger variant with correct styles', () => {
    const { container } = render(ThemedButton, {
      props: { variant: 'danger' }
    });
    
    const button = container.querySelector('button');
    expect(button?.getAttribute('style')).toContain('--theme-error');
  });

  it('renders warning variant with correct styles', () => {
    const { container } = render(ThemedButton, {
      props: { variant: 'warning' }
    });
    
    const button = container.querySelector('button');
    expect(button?.getAttribute('style')).toContain('--theme-warning');
  });

  it('renders as disabled when specified', () => {
    const { container } = render(ThemedButton, {
      props: { disabled: true }
    });
    
    const button = container.querySelector('button');
    expect(button?.disabled).toBe(true);
  });

  it('applies disabled styles when disabled', () => {
    const { container } = render(ThemedButton, {
      props: { disabled: true }
    });
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('opacity-50');
    expect(button?.className).toContain('cursor-not-allowed');
  });

  it('renders full width when specified', () => {
    const { container } = render(ThemedButton, {
      props: { fullWidth: true }
    });
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('w-full');
  });

  it('does not render full width by default', () => {
    const { container } = render(ThemedButton);
    
    const button = container.querySelector('button');
    expect(button?.className).not.toContain('w-full');
  });

  it('has proper base styling classes', () => {
    const { container } = render(ThemedButton);
    
    const button = container.querySelector('button');
    expect(button?.className).toContain('px-4');
    expect(button?.className).toContain('py-2');
    expect(button?.className).toContain('rounded-lg');
    expect(button?.className).toContain('font-medium');
  });

  it('supports all button types', () => {
    const types: Array<'button' | 'submit' | 'reset'> = ['button', 'submit', 'reset'];
    
    types.forEach(type => {
      const { container } = render(ThemedButton, {
        props: { type }
      });
      
      const button = container.querySelector('button');
      expect(button?.type).toBe(type);
    });
  });

  it('supports all variant types', () => {
    const variants: Array<'primary' | 'secondary' | 'danger' | 'warning'> = [
      'primary',
      'secondary',
      'danger',
      'warning'
    ];
    
    variants.forEach(variant => {
      const { container } = render(ThemedButton, {
        props: { variant }
      });
      
      const button = container.querySelector('button');
      expect(button).toBeTruthy();
    });
  });
});
