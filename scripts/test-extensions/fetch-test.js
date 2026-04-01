#!/usr/bin/env node

/**
 * Script to install and fetch external Qwen extensions
 * Tests extension installation capabilities
 */

import { execSync } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

class ExtensionInstaller {
  constructor() {
    this.logFile = path.join(__dirname, 'install.log')
  }

  async log(message) {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] ${message}\n`
    console.log(message)
    try {
      await fs.appendFile(this.logFile, logMessage)
    } catch (error) {
      // Ignore log errors
    }
  }

  async clean() {
    try {
      await fs.unlink(this.logFile)
    } catch (error) {
      // File doesn't exist, ignore
    }
  }

  async checkExistingExtensions() {
    const extensions = [
      '@agentclientprotocol/sdk',
      '@qwen-code/qwen-code-core',
      '@qwen-code/web-templates',
      'uipro-cli'
    ]

    for (const ext of extensions) {
      try {
        const version = this.getPackageVersion(ext)
        console.log(`✅ ${ext}: ${version}`)
      } catch (error) {
        console.log(`❌ ${ext}: Not found`)
      }
    }
  }

import { execSync } from 'child_process'
import fs from 'fs/promises'
import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
      throw new Error('Package not found')
    }
  }

  async installExtension(extensionUrl) {
    console.log(`📥 Installing extension from: ${extensionUrl}`)

    try {
      execSync(`npm install ${extensionUrl}`, {
        cwd: path.join(__dirname, '..', '..'),  // Go up to project root
        stdio: 'inherit'
      })
      console.log('✅ Extension installed successfully')
      return true
    } catch (error) {
      console.log(`❌ Failed to install extension: ${error.message}`)
      return false
    }
  }

  async testUiproCli() {
    try {
      const output = execSync('uipro --version', {
        encoding: 'utf8'
      }).trim()

      console.log(`✅ uipro-cli available: ${output}`)
      return true
    } catch (error) {
      console.log(`❌ uipro-cli not available: ${error.message}`)
      return false
    }
  }

  async installConductorExtension() {
    const result = await this.installExtension('https://github.com/gemini-cli-extensions/conductor')

    if (result) {
      try {
        execSync('conductor --help', {
          encoding: 'utf8',
          cwd: path.join(__dirname, '..', '..')
        })
        console.log('✅ Conductor extension working')
      } catch (error) {
        console.log(`⚠️  Conductor extension installed but help failed: ${error.message}`)
      }
    }

    return result
  }

  async installFromNpm(name) {
    try {
      execSync(`npm install ${name}`, {
        cwd: path.join(__dirname, '..', '..'),
        stdio: 'inherit'
      })
      console.log(`✅ ${name} installed successfully`)
      return true
    } catch (error) {
      console.log(`❌ Failed to install ${name}: ${error.message}`)
      return false
    }
  }

  async runInstallTests() {
    console.log('🚀 Starting extension installation tests...\n')

    await this.checkExistingExtensions()

    // Test installing conductor extension
    await this.installConductorExtension()

    // Test installing popular Qwen extensions
    const extensionsToTest = [
      '@qwen-code/qwen-code-terminal',
      '@qwen-code/qwen-code-assistant'
    ]

    for (const ext of extensionsToTest) {
      await this.installFromNpm(ext)
    }

    // Test uipro-cli
    await this.testUiproCli()

    console.log('\n✅ Installation tests completed')
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const installer = new ExtensionInstaller()
  installer.clean().then(() => installer.runInstallTests())
}

export { ExtensionInstaller }