import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Carousel, CarouselSlide, type CarouselProps } from './Carousel';

const renderCarousel = (props: Partial<CarouselProps> = {}) =>
  render(
    <Carousel aria-label="Featured" {...props}>
      <CarouselSlide>Slide A</CarouselSlide>
      <CarouselSlide>Slide B</CarouselSlide>
      <CarouselSlide>
        Slide C <a href="#c">Link C</a>
      </CarouselSlide>
    </Carousel>,
  );

afterEach(() => vi.useRealTimers());

describe('Carousel', () => {
  it('renders the WAI-ARIA carousel structure', () => {
    renderCarousel();
    const region = screen.getByRole('region', { name: 'Featured' });
    expect(region).toHaveAttribute('aria-roledescription', 'carousel');
    const slide = screen.getByRole('tabpanel', { name: '1 of 3' });
    expect(slide).toHaveAttribute('aria-roledescription', 'slide');
    expect(screen.getAllByRole('tabpanel', { hidden: true })).toHaveLength(3);
    const tabs = screen.getAllByRole('tab');
    expect(screen.getByRole('tablist', { name: 'Slides' })).toBeInTheDocument();
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0]).toHaveAttribute('aria-controls', slide.id);
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument();
    expect(screen.getByText('Slide A').closest('[aria-live]')).toHaveAttribute('aria-live', 'polite');
  });

  it('hides inactive slides from assistive tech and the tab order', () => {
    renderCarousel();
    const c = screen.getByText(/Slide C/).closest('[role="tabpanel"]')!;
    expect(c).toHaveAttribute('aria-hidden', 'true');
    expect(c).toHaveAttribute('inert');
  });

  it('moves with previous/next buttons and wraps when looping', async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    renderCarousel({ onIndexChange });
    await user.click(screen.getByRole('button', { name: 'Previous slide' }));
    expect(onIndexChange).toHaveBeenLastCalledWith(2);
    expect(screen.getAllByRole('tab')[2]).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(onIndexChange).toHaveBeenLastCalledWith(0);
  });

  it('disables the ends without loop', () => {
    renderCarousel({ loop: false });
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeEnabled();
  });

  it('picks slides from the dot tablist with click and arrow keys', async () => {
    const user = userEvent.setup();
    renderCarousel();
    const tabs = screen.getAllByRole('tab');
    await user.click(tabs[1]);
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: '2 of 3' })).toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(tabs[2]).toHaveFocus();
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{ArrowRight}');
    expect(tabs[0]).toHaveFocus();
    await user.keyboard('{End}');
    expect(tabs[2]).toHaveFocus();
    await user.keyboard('{Home}');
    expect(tabs[0]).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    expect(tabs.filter((t) => t.tabIndex === 0)).toEqual([tabs[2]]);
  });

  it('auto-rotates, pauses on hover and stops from the rotation control', () => {
    vi.useFakeTimers();
    renderCarousel({ autoPlay: true, interval: 1000 });
    const tabs = screen.getAllByRole('tab');
    expect(screen.getByText('Slide A').closest('[aria-live]')).toHaveAttribute('aria-live', 'off');
    act(() => vi.advanceTimersByTime(1000));
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    const region = screen.getByRole('region');
    fireEvent.mouseEnter(region);
    act(() => vi.advanceTimersByTime(3000));
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    fireEvent.mouseLeave(region);
    act(() => vi.advanceTimersByTime(1000));
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');

    const stop = screen.getByRole('button', { name: 'Stop automatic slide show' });
    fireEvent.click(stop);
    expect(screen.getByRole('button', { name: 'Start automatic slide show' })).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(5000));
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('pauses while keyboard focus is inside', () => {
    vi.useFakeTimers();
    renderCarousel({ autoPlay: true, interval: 1000 });
    const tabs = screen.getAllByRole('tab');
    act(() => tabs[0].focus());
    act(() => vi.advanceTimersByTime(3000));
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    act(() => tabs[0].blur());
    act(() => vi.advanceTimersByTime(1000));
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('does not auto-rotate when the user prefers reduced motion', () => {
    vi.useFakeTimers();
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
    try {
      renderCarousel({ autoPlay: true, interval: 1000 });
      expect(screen.getByRole('button', { name: 'Start automatic slide show' })).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(3000));
      expect(screen.getAllByRole('tab')[0]).toHaveAttribute('aria-selected', 'true');
    } finally {
      window.matchMedia = original;
    }
  });

  it('works controlled', async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    renderCarousel({ index: 1, onIndexChange });
    await user.click(screen.getByRole('button', { name: 'Next slide' }));
    expect(onIndexChange).toHaveBeenCalledWith(2);
    expect(screen.getAllByRole('tab')[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('applies variant and size, custom slide labels, and forwards refs', () => {
    const ref = createRef<HTMLElement>();
    const slideRef = createRef<HTMLDivElement>();
    render(
      <Carousel ref={ref} aria-label="Gallery" variant="framed" size="sm" slideLabel={(i) => `Photo ${i + 1}`}>
        <CarouselSlide ref={slideRef}>One</CarouselSlide>
        <CarouselSlide>Two</CarouselSlide>
      </Carousel>,
    );
    expect(ref.current).toHaveClass('ds-carousel', 'ds-carousel--framed', 'ds-carousel--sm');
    expect(slideRef.current).toBe(screen.getByRole('tabpanel', { name: 'Photo 1' }));
  });
});
