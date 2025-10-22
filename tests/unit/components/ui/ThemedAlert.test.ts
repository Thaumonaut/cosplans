import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ThemedAlert from '$lib/components/ui/ThemedAlert.svelte';

describe('ThemedAlert', () => {
  it('renders with success type', () => {
    const { container } = render(ThemedAlert, {
      props: { type: 'success' }
    });
    
    const alert = container.querySelector('div');
    expect(alert).toBeTruthy();
    expect(alert?.getAttribute('style')).toContain('--theme-success');
  });

  it('renders with error type', () => {
    const { container } = render(ThemedAlert, {
      props: { type: 'error' }
    });
    
    const alert = container.querySelector('div');
    expect(alert?.getAttribute('style')).toContain('--theme-error');
  });

  it('renders with warning type', () => {
    const { container } = render(ThemedAlert, {
      props: { type: 'warning' }
    });
    
    const alert = container.querySelector('div');
    expect(alert?.getAttribute('style')).toContain('--theme-warning');
  });

  it('renders with info type', () => {
    const { container } = render(ThemedAlert, {
      props: { type: 'info' }
    });
    
    const alert = container.querySelector('div');
    expect(alert?.getAttribute('style')).toContain('--theme-info');
  });

  it('renders slot content', () => {
    const { getByText } = render(ThemedAlert, {
      props: {
        type: 'success',
        $$slots: { default: true },
        $$scope: {}
      }
    });
    
    const alert = getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'div';
    });
    
    expect(alert).toBeTruthy();
  });

  it('has proper styling classes', () => {
    const { container } = render(ThemedAlert, {
      props: { type: 'success' }
    });
    
    const alert = container.querySelector('div');
    expect(alert?.className).toContain('mb-4');
    expect(alert?.className).toContain('p-4');
    expect(alert?.className).toContain('rounded-lg');
  });

  it('renders with white text color', () => {
    const { container } = render(ThemedAlert, {
      props: { type: 'success' }
    });
    
    const alert = container.querySelector('div');
    expect(alert?.getAttribute('style')).toContain('color: white');
  });

  it('supports all alert types', () => {
    const types: Array<'success' | 'error' | 'warning' | 'info'> = [
      'success',
      'error',
      'warning',
      'info'
    ];
    
    types.forEach(type => {
      const { container } = render(ThemedAlert, {
        props: { type }
      });
      
      const alert = container.querySelector('div');
      expect(alert).toBeTruthy();
    });
  });
});
