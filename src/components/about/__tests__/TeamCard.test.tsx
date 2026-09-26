import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamCard from '../TeamCard';

const member = { role: 'Başkan' as const, name: 'Ada Lovelace', title: '' };

describe('TeamCard fotoğraf büyütme', () => {
  it('fotoğrafa tıklayınca büyük hâli açılır, Esc ile kapanır', async () => {
    const user = userEvent.setup();
    render(<TeamCard slug="ai" color="#000" member={member} communityName="AI Topluluğu" />);

    await user.click(screen.getByRole('button', { name: 'Ada Lovelace fotoğrafını büyüt' }));
    const dialog = screen.getByRole('dialog', { name: 'Ada Lovelace' });
    expect(dialog).toHaveTextContent('Başkan · AI Topluluğu');
    expect(dialog.querySelector('img')).toHaveAttribute('src', '/ekip/ai-baskan.jpg');

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('kapat butonu pencereyi kapatır', async () => {
    const user = userEvent.setup();
    render(<TeamCard slug="ai" color="#000" member={member} />);

    await user.click(screen.getByRole('button', { name: /fotoğrafını büyüt/ }));
    await user.click(screen.getByRole('button', { name: 'Kapat' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('fotoğraf yüklenemezse büyütme butonu yerine baş harf avatarı gösterilir', () => {
    render(<TeamCard slug="ai" color="#000" member={member} />);
    fireEvent.error(screen.getByRole('img', { name: 'Ada Lovelace' }));
    expect(screen.queryByRole('button', { name: /fotoğrafını büyüt/ })).not.toBeInTheDocument();
    expect(screen.getByText('AL')).toBeInTheDocument();
  });
});
