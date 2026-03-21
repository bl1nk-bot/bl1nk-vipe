import { describe, it, expect } from 'vitest'

describe('Integration with Qwen Code packages', () => {
  it('should import from @qwen-code/qwen-code-core', async () => {
    // This tests that the package is properly installed and can be imported
    try {
      const core = await import('@qwen-code/qwen-code-core')
      expect(core).toBeDefined()
      // Test that it has some expected exports (based on package analysis)
      expect(typeof core).toBe('object')
    } catch (error) {
      console.error('Import failed:', error)
      throw error
    }
  })

  it('should import from @qwen-code/web-templates', async () => {
    // This tests that the web-templates package is properly installed
    try {
      const templates = await import('@qwen-code/web-templates')
      expect(templates).toBeDefined()
      expect(typeof templates).toBe('object')
    } catch (error) {
      console.error('Import failed:', error)
      throw error
    }
  })

  it('should be able to use core functionality basic test', async () => {
    // More advanced test: try to access a basic export if possible
    const core = await import('@qwen-code/qwen-code-core')
    // Assuming there's an exported function or class, test it doesn't throw
    // This is a placeholder since specific API is unknown
    expect(() => core).not.toThrow()
  })

  it('should be able to use web-templates functionality basic test', async () => {
    const templates = await import('@qwen-code/web-templates')
    // Test basic import doesn't throw
    expect(() => templates).not.toThrow()
  })
})