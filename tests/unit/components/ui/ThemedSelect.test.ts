import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ThemedSelect from '$lib/components/ui/ThemedSelect.svelte';

describe('ThemedSelect', () => {
  it('renders with required props', () => {
    const { container } = render(ThemedSelect, {
      props: { name: 'testSelect' }
    });
    
    const select = container.querySelector('select');
    expect(select).toBeTruthy();
    expect(select?.name).toBe('testSelect');
  });

  it('applies theme variables for background', () => {
    const { container } = render(ThemedSelect, {
      props: { name: 'test' }
    });
    
    const select = container.querySelector('select');
    expect(select?.getAttribute('style')).toContain('--theme-sidebar-bg');
  });

  it('applies theme variables for text color', () => {
    const { container } = render(ThemedSelect, {
      props: { name: 'test' }
    });
    
    const select = container.querySelector('select');
    expect(select?.getAttribute('style')).toContain('--theme-foreground');
  });

  it('applies theme variables for border', () => {
    const { container } = render(ThemedSelect, {
      props: { name: 'test' }
    });
    
    const select = container.querySelector('select');
    expect(select?.getAttribute('style')).toContain('--theme-sidebar-border');
  });

  it('renders as required when specified', () => {
    const { container } = render(ThemedSelect, {
      props: {
        name: 'test',
        required: true
      }
    });
    
    const select = container.querySelector('select');
    expect(select?.required).toBe(true);
  });

  it('renders as disabled when specified', () => {
    const { container } = render(ThemedSelect, {
      props: {
        name: 'test',
        disabled: true
      }
    });
    
    const select = container.querySelector('select');
    expect(select?.disabled).toBe(true);
  });

  it('binds value correctly', () => {
    const { container } = render(ThemedSelect, {
      props: {
        name: 'test',
        value: 'option1'
      }
    });
    
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select?.value).toBe('option1');
  });

  it('has proper styling classes', () => {
    const { container } = render(ThemedSelect, {
      props: { name: 'test' }
    });
    
    const select = container.querySelector('select');
    expect(select?.className).toContain('px-3');
    expect(select?.className).toContain('py-2');
    expect(select?.className).toContain('border');
    expect(select?.className).toContain('rounded-lg');
  });

  it('renders slot content for options', () => {
    const { container } = render(ThemedSelect, {
      props: {
        name: 'test',
        $$slots: { default: true },
        $$scope: {}
      }
    });
    
    const select = container.querySelector('select');
    expect(select).toBeTruthy();
  });
});
