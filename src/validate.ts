#!/usr/bin/env tsx

import { getAllMicroservices } from './config.js';

function validateConfiguration() {
    console.log('🔍 Validating Valar API MCP Configuration...\n');

    const microservices = getAllMicroservices();

    if (microservices.length === 0) {
        console.error('❌ No microservices configured!');
        return false;
    }

    console.log(`✅ Found ${microservices.length} configured microservices:\n`);

    let allValid = true;

    for (const ms of microservices) {
        console.log(`📡 ${ms.name}`);
        console.log(`   Base URL: ${ms.baseUrl}`);
        console.log(`   OAuth URL: ${ms.oauthUrl}`);
        console.log(`   Docs Path: ${ms.docsPath}`);
        if (ms.description) {
            console.log(`   Description: ${ms.description}`);
        }

        // Basic URL validation
        try {
            new URL(ms.baseUrl);
            new URL(ms.oauthUrl);
            console.log(`   ✅ URLs are valid`);
        } catch (error) {
            console.log(`   ❌ Invalid URL format`);
            allValid = false;
        }

        console.log();
    }

    // Check environment variables (optional for validation, will be provided by MCP client)
    console.log('🔐 Checking Credentials Configuration:');

    const username = process.env.VALAR_USERNAME;
    const password = process.env.VALAR_PASSWORD;

    if (username && password) {
        console.log(`   ✅ Credentials available via environment (VALAR_USERNAME: ${username.substring(0, 3)}***)`);
        console.log(`   ℹ️  Note: In production, credentials should be provided via MCP client configuration`);
    } else {
        console.log(`   ℹ️  No environment credentials set (this is expected)`);
        console.log(`   📝 Credentials will be provided via MCP client configuration`);
        console.log(`   📝 Example: Set VALAR_USERNAME and VALAR_PASSWORD in your MCP client config`);
    }

    console.log();

    if (allValid) {
        console.log('🎉 Configuration validation passed! MCP is ready to use.');
        console.log('💡 Remember to provide VALAR_USERNAME and VALAR_PASSWORD via your MCP client configuration.');
    } else {
        console.log('⚠️  Configuration validation failed. Please fix the issues above.');
    }

    return allValid;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    validateConfiguration();
} 