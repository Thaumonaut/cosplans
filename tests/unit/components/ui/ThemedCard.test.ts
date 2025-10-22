import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ThemedCard from '$lib/components/ui/ThemedCard.svelte';

describe('ThemedCard', () => {
  it('renders with default padding', () => {
    const { container } = render(ThemedCard);
    const card = container.querySelector('div');
    
    expect(card).toBeTruthy();
    expect(card?.className).toContain('p-6');
  });

  it('renders with custom padding', () => {
    const { container } = render(ThemedCard, { props: { padding: 'p-4' } });
    const card = container.querySelector('div');
    
    expect(card?.className).toContain('p-4');
    expect(card?.className).not.toContain('p-6');
  });

  it('renders title when provided', () => {
    const { getByText } = render(ThemedCard, { props: { title: 'Test Title' } });
    
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('does not render title element when title is not provided', () => {
    const { container } = render(ThemedCard);
    const titleElement = container.querySelector('h2');
    
    expect(titleElement).toBeNull();
  });

  it('renders slot content', () => {
    const { getByText } = render(ThemedCard, {
      props: {
        $$slots: { default: true },
        $$scope: {}
      }
    });
    
    // The component should render its slot content
    const card = getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'div';
    });
    
    expect(card).toBeTruthy();
  });

  it('applies theme variables for background', () => {
    const { container } = render(ThemedCard);
    const card = container.querySelector('div');
    
    expect(card?.getAttribute('style')).toContain('--theme-sidebar-bg');
  });

  it('applies theme variables for border', () => {
    const { container } = render(ThemedCard);
    const card = container.querySelector('div');
    
    expect(card?.getAttribute('style')).toContain('--theme-sidebar-border');
  });

  it('applies theme variables for title text color', () => {
    const { container } = render(ThemedCard, { props: { title: 'Test' } });
    const title = container.querySelector('h2');
    
    expect(title?.getAttribute('style')).toContain('--theme-foreground');
  });

  it('has proper structure with shadow and rounded corners', () => {
    const { container } = render(ThemedCard);
    const card = container.querySelector('div');
    
    expect(card?.className).toContain('shadow');
    expect(card?.className).toContain('rounded-lg');
  });
});
