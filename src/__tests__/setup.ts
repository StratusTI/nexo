import { afterAll, afterEach, beforeAll, vi } from 'vitest'

beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret-key-for-vitest-only'
})

afterEach(() => {
  vi.clearAllMocks()
})

afterAll(() => {
})
