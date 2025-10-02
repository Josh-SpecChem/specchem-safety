import { describe, it, expect } from 'vitest'
import React from 'react'

describe('Testing Infrastructure Setup', () => {
  it('should have basic test functionality working', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have environment variables set', () => {
    expect(process.env.NODE_ENV).toBe('test')
  })

  it('should have React available', () => {
    expect(typeof React).toBe('object')
  })
})
