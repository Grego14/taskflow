import { cleanup } from '@testing-library/preact'
import { afterEach, vi } from 'vitest'

afterEach(() => { cleanup(); vi.clearAllMocks() })

vi.mock('@services/audio', () => ({ playSound: vi.fn(), stopSound: vi.fn() }))

vi.mock('react-router-dom', () => ({
  useParams: () => ({}),
  useNavigate: () => ({}),
  useLocation: () => ({}) 
}))

// Mock GSAP globally
vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(() => ({ context: null, contextSafe: vi.fn() }))
}))

// Mock i18next globally with a generic translator
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useTranslation: () => ({
      t: (key) => key.split('.').pop(),
      // we are using the english translations so we pass 'en'
      i18n: { language: 'en', changeLanguage: vi.fn() } 
    })
  }
})

// needed to tests the tasks
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = {
    randomUUID: () => `test-uuid-${Math.random()}`
  }
}
