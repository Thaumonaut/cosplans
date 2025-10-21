import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ThemedTextarea from '$lib/components/ui/ThemedTextarea.svelte';

describe('ThemedTextarea', () => {
  it('renders with required props', () => {
    const { container } = render(ThemedTextarea, {
      props: { name: 'testTextarea' }
    });
    
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeTruthy();
    expect(textarea?.name).toBe('testTextarea');
  });

  it('applies theme variables for background', () => {
    const { container } = render(ThemedTextarea, {
      props: { name: 'test' }
    });
    
    const textarea = container.querySelector('textarea');
    expect(textarea?.getAttribute('style')).toContain('--theme-sidebar-bg');
  });

  it('applies theme variables for text color', () => {
    const { container } = render(ThemedTextarea, {
      props: { name: 'test' }
    });
    
    const textarea = container.querySelector('textarea');
    expect(textarea?.getAttribute('style')).toContain('--theme-foreground');
  });

  it('applies theme variables for border', () => {
    const { container } = render(ThemedTextarea, {
      props: { name: 'test' }
    });
    
    const textarea = container.querySelector('textarea');
    expect(textarea?.getAttribute('style')).toContain('--theme-sidebar-border');
  });

  it('renders with placeholder', () => {
    const { container } = render(ThemedTextarea, {
      props: {
        name: 'test',
        placeholder: 'Enter description'
      }
    });
    
    const textarea = container.querySelector('textarea');
    expect(textarea?.placeholder).toBe('Enter description');
  });

  it('renders with custom rows', () => {
    const { container } = render(ThemedTextarea, {
      props: {
        name: 'test',
        rows: 5
      }
    });
    
    const textarea = container.querySelector('textarea');
    expect(textarea?.rows).toBe(5);
  });

  it('uses default rows of 4 when not specified', () => {
    const { container } = render(ThemedTextarea, {
      props: { name: 'test' }
    });
    
    const textarea = container.querySelector('textarea');
    expect(textarea?.rows).toBe(4);
  });

  it('renders as required when specified', () => {
    const { container } = render(ThemedTextarea, {
      props: {
        name: 'test',
        required: true
      }
    });
    
    const textarea = container.querySelector('textarea');
    expect(textarea?.required).toBe(true);
  });

  it('renders as readonly when specified', () => {
    const { container } = render(ThemedTextarea, {
      props: {
        name: 'test',
        readonly: true
      }
    });
    
    const textarea = container.querySelector('textarea');
    expect(textarea?.readOnly).toBe(true);
  });

  it('renders as disabled when specified', () => {
    const { container } = render(ThemedTextarea, {
      props: {
        name: 'test',
        disabled: true
      }
    });
    
    const textarea = container.querySelector('textarea');
    expect(textarea?.disabled).toBe(true);
  });

  it('respects maxlength attribute', () => {
    const { container } = render(ThemedTextarea, {
      props: {
        name: 'test',
        maxlength: 500
      }
    });
    
    const textarea = container.querySelector('textarea');
    expect(textarea?.maxLength).toBe(500);
  });

  it('binds value correctly', () => {
    const { container } = render(ThemedTextarea, {
      props: {
        name: 'test',
        value: 'initial text'
      }
    });
    
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea?.value).toBe('initial text');
  });

  it('has proper styling classes', () => {
    const { container } = render(ThemedTextarea, {
      props: { name: 'test' }
    });
    
    const textarea = container.querySelector('textarea');
    expect(textarea?.className).toContain('w-full');
    expect(textarea?.className).toContain('px-3');
    expect(textarea?.className).toContain('py-2');
    expect(textarea?.className).toContain('border');
    expect(textarea?.className).toContain('rounded-lg');
  });
});
