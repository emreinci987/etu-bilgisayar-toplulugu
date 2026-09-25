import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// vitest globals kapalı olduğu için RTL otomatik cleanup kaydedemiyor; elle bağla
afterEach(() => {
  cleanup();
});
