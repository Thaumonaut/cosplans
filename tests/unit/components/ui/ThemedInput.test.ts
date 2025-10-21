import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ThemedInput from '$lib/components/ui/ThemedInput.svelte';

describe('ThemedInput', () => {
  it('renders with required props', () => {
    const { container } = render(ThemedInput, {
      props: {
        type: 'text',
        name: 'testInput'
      }
    });
    
    const input = container.querySelector('input');
    expect(input).toBeTruthy();
    expect(input?.type).toBe('text');
    expect(input?.name).toBe('testInput');
  });

  it('applies theme variables for background', () => {
    const { container } = render(ThemedInput, {
      props: { type: 'text', name: 'test' }
    });
    
    const input = container.querySelector('input');
    expect(input?.getAttribute('style')).toContain('--theme-sidebar-bg');
  });

  it('applies theme variables for text color', () => {
    const { container } = render(ThemedInput, {
      props: { type: 'text', name: 'test' }
    });
    
    const input = container.querySelector('input');
    expect(input?.getAttribute('style')).toContain('--theme-foreground');
  });

  it('applies theme variables for border', () => {
    const { container } = render(ThemedInput, {
      props: { type: 'text', name: 'test' }
    });
    
    const input = container.querySelector('input');
    expect(input?.getAttribute('style')).toContain('--theme-sidebar-border');
  });

  it('renders with placeholder', () => {
    const { container } = render(ThemedInput, {
      props: {
        type: 'text',
        name: 'test',
        placeholder: 'Enter text'
      }
    });
    
    const input = container.querySelector('input');
    expect(input?.placeholder).toBe('Enter text');
  });

  it('renders as required when specified', () => {
    const { container } = render(ThemedInput, {
      props: {
        type: 'text',
        name: 'test',
        required: true
      }
    });
    
    const input = container.querySelector('input');
    expect(input?.required).toBe(true);
  });

  it('renders as readonly when specified', () => {
    const { container } = render(ThemedInput, {
      props: {
        type: 'text',
        name: 'test',
        readonly: true
      }
    });
    
    const input = container.querySelector('input');
    expect(input?.readOnly).toBe(true);
  });

  it('renders as disabled when specified', () => {
    const { container } = render(ThemedInput, {
      props: {
        type: 'text',
        name: 'test',
        disabled: true
      }
    });
    
    const input = container.querySelector('input');
    expect(input?.disabled).toBe(true);
  });

  it('respects maxlength attribute', () => {
    const { container } = render(ThemedInput, {
      props: {
        type: 'text',
        name: 'test',
        maxlength: 100
      }
    });
    
    const input = container.querySelector('input');
    expect(input?.maxLength).toBe(100);
  });

  it('supports different input types', () => {
    const types = ['text', 'email', 'password', 'number', 'tel', 'url'];
    
    types.forEach(type => {
      const { container } = render(ThemedInput, {
        props: { type, name: 'test' }
      });
      
      const input = container.querySelector('input');
      expect(input?.type).toBe(type);
    });
  });

  it('binds value correctly', async () => {
    const { container } = render(ThemedInput, {
      props: {
        type: 'text',
        name: 'test',
        value: 'initial value'
      }
    });
    
    const input = container.querySelector('input') as HTMLInputElement;
    expect(input?.value).toBe('initial value');
  });

  it('has proper styling classes', () => {
    const { container } = render(ThemedInput, {
      props: { type: 'text', name: 'test' }
    });
    
    const input = container.querySelector('input');
    expect(input?.className).toContain('w-full');
    expect(input?.className).toContain('px-3');
    expect(input?.className).toContain('py-2');
    expect(input?.className).toContain('border');
    expect(input?.className).toContain('rounded-lg');
  });
});
