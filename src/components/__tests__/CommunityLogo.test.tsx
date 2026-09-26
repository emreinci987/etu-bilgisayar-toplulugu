import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import CommunityLogo from '../CommunityLogo';

function renderLogo() {
  const { container } = render(<CommunityLogo slug="ai" shortName="AI" color="#000" size={56} />);
  return container;
}

describe('CommunityLogo', () => {
  it('önce /logolar/<slug>.png dener', () => {
    const img = renderLogo().querySelector('img')!;
    expect(img).toHaveAttribute('src', '/logolar/ai.png');
    expect(img).toHaveAttribute('width', '56');
  });

  it('png yüklenemezse svg’ye, o da yüklenemezse monogram placeholder’a düşer', () => {
    const container = renderLogo();

    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toHaveAttribute('src', '/logolar/ai.svg');

    fireEvent.error(container.querySelector('img')!);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByText('AI')).toBeInTheDocument();
  });
});
