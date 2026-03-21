#!/usr/bin/env node

/**
 * Test script for Qwen extensions functionality
 * This script verifies extension availability and functionality
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const extensions = [
  {
    name: 'agentclientprotocol/sdk',
    packageName: '@agentclientprotocol/sdk',
    testFile: path.join(__dirname, '../node_modules/@agentclientprotocol/sdk/package.json')
  },
  {
    name: 'qwen-code-core',
    packageName: '@qwen-code/qwen-code-core',
    testFile: path.join(__dirname, '../node_modules/@qwen-code/qwen-code-core/package.json')
  },
  {
    name: 'web-templates',
    packageName: '@qwen-code/web-templates',
    testFile: path.join(__dirname, '../node_modules/@qwen-code/web-templates/package.json')
  }
]

class ExtensionTester {
  constructor() {
    this.results = []
  }

  async testPackage(packageConfig) {
    const result = {
      name: packageConfig.name,
      packageName: packageConfig.packageName,
      status: 'unknown',
      version: null,
      error: null,
      capabilities: []
    }

    try {
      // Check if package exists
      await fs.access(packageConfig.testFile)

      // Read package.json
      const packageJson = await fs.readFile(packageConfig.testFile, 'utf8')
      const pkg = JSON.parse(packageJson)

      result.status = 'available'
      result.version = pkg.version
      result.capabilities = Object.keys(pkg.capabilities || {})

      console.log(`✅ ${packageConfig.name}: Version ${result.version}`)

    } catch (error) {
      if (error.code === 'ENOENT') {
        result.status = 'not-installed'
        result.error = 'Package directory not found'
        console.log(`❌ ${packageConfig.name}: Not installed`)
      } else {
        result.status = 'error'
        result.error = error.message
        console.log(`⚠️  ${packageConfig.name}: ${error.message}`)
      }
    }

    this.results.push(result)
  }

  async testAgentProtocol() {
    console.log('\n🧪 Testing Agent Client Protocol...')

    try {
      // Dynamic import to test module resolution
      const { ACPClient } = await import('@agentclientprotocol/sdk')

      // Test basic instantiation
      const client = new ACPClient({
        name: 'test-agent',
        version: '0.1.0'
      })

      console.log('✅ ACP Client instantiated successfully')
      return true

    } catch (error) {
      console.log(`❌ ACP Client failed: ${error.message}`)
      return false
    }
  }

  async testQwenPackages() {
    console.log('\n🧪 Testing Qwen packages...')

    const tests = [
      { pkg: '@qwen-code/qwen-code-core', import: 'QwenAgent' },
      { pkg: '@qwen-code/web-templates', import: 'WebTemplates' }
    ]

    for (const test of tests) {
      try {
        // Try to resolve the module (without importing)
        await import(test.pkg)
        console.log(`✅ ${test.pkg}: Resolved successfully`)
      } catch (error) {
        if (error.code === 'ERR_MODULE_NOT_FOUND') {
          console.log(`❌ ${test.pkg}: Module not found - dist files missing`)
        } else {
          console.log(`⚠️  ${test.pkg}: ${error.message}`)
        }
      }
    }
  }

  async runTests() {
    console.log('🚀 Testing Qwen Extensions Integration\n')

    // Test package availability
    console.log('📦 Checking package installations...')
    for (const ext of extensions) {
      await this.testPackage(ext)
    }

    // Test specific functionality
    await this.testAgentProtocol()
    await this.testQwenPackages()

    // Generate summary
    this.generateSummary()
  }

  generateSummary() {
    console.log('\n📊 Test Summary:')
    console.log('=' .repeat(50))

    const byStatus = this.results.reduce((acc, result) => {
      acc[result.status] = (acc[result.status] || 0) + 1
      return acc
    }, {})

    console.log(`Available packages: ${byStatus.available || 0}`)
    console.log(`Missing packages: ${byStatus['not-installed'] || 0}`)
    console.log(`Error packages: ${byStatus.error || 0}`)

    console.log('\nDetail results:')
    this.results.forEach(result => {
      console.log(`  ${result.packageName}: ${result.status} ${result.version ? `v${result.version}` : ''}`)
    })

    // Recommendations
    console.log('\n💡 Recommendations:')
    if (byStatus['not-installed'] > 0) {
      console.log('- Run `npm install` to install missing packages')
    }
    if (byStatus.error > 0) {
      console.log('- Check package.json for version conflicts')
    }
    console.log('- Build Qwen packages from source if needed')
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new ExtensionTester()
  tester.runTests().catch(console.error)
}

export { ExtensionTester }