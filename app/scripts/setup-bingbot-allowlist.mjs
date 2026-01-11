#!/usr/bin/env node

/**
 * Cloudflare Bingbot IP Allowlist Setup Script
 * 
 * This script creates a Cloudflare firewall rule that explicitly allows
 * traffic from official Bingbot IP ranges.
 * 
 * Usage:
 *   1. Ensure CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID are set in .env
 *   2. Run: npm run cloudflare:setup:bingbot
 * 
 * Or manually:
 *   node app/scripts/setup-bingbot-allowlist.mjs
 */

import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const ZONE_ID = process.env.CLOUDFLARE_ZONE_ID;

// Load Bingbot IP ranges
const bingbotDataPath = join(__dirname, 'bingbot-ip-ranges.json');
const bingbotData = JSON.parse(readFileSync(bingbotDataPath, 'utf-8'));

// Helper functions
function log(message, type = 'info') {
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warn' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} ${message}`);
}

async function apiRequest(endpoint, method = 'GET', body = null) {
    const url = `${CLOUDFLARE_API_BASE}${endpoint}`;
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
        },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (!response.ok) {
            const errorMessages = data.errors?.map(err =>
                `${err.message} (code: ${err.code || 'unknown'})`
            ).join(', ') || `HTTP ${response.status} ${response.statusText}`;

            throw new Error(errorMessages);
        }

        return data;
    } catch (error) {
        log(`API request failed: ${error.message}`, 'error');
        throw error;
    }
}

async function getExistingRules() {
    try {
        const response = await apiRequest(`/zones/${ZONE_ID}/firewall/rules`);
        return response.result || [];
    } catch (error) {
        log(`Failed to fetch existing rules: ${error.message}`, 'error');
        return [];
    }
}

async function deleteRule(ruleId) {
    try {
        await apiRequest(`/zones/${ZONE_ID}/firewall/rules/${ruleId}`, 'DELETE');
        return true;
    } catch (error) {
        log(`Failed to delete rule: ${error.message}`, 'error');
        return false;
    }
}

function buildBingbotIPCondition() {
    // Extract just the IP prefixes
    const ipRanges = bingbotData.prefixes.map(p => p.ipv4Prefix);

    // Cloudflare has a limit on expression length, so we'll batch IPs
    // Maximum expression length is around 4096 characters
    // Each IP range is ~20 chars, so we can fit many in one rule

    // Build the condition: (ip.src in {ip1 ip2 ip3 ...})
    // Cloudflare syntax: space-separated IPs WITHOUT quotes
    const ipList = ipRanges.join(' ');
    const condition = `(ip.src in {${ipList}})`;

    log(`Built condition with ${ipRanges.length} IP ranges`, 'info');
    log(`Condition length: ${condition.length} characters`, 'info');

    if (condition.length > 4000) {
        log(`⚠️  Condition might be too long for Cloudflare API`, 'warn');
        log(`   Consider creating multiple rules if this fails`, 'warn');
    }

    return condition;
}

async function createBingbotAllowRule() {
    const condition = buildBingbotIPCondition();

    const rule = {
        action: 'allow',
        priority: 1, // Highest priority to ensure Bingbot is always allowed
        paused: false,
        description: 'Allow Official Bingbot IP Ranges',
        filter: {
            expression: condition,
            paused: false,
        },
    };

    try {
        const response = await apiRequest(
            `/zones/${ZONE_ID}/firewall/rules`,
            'POST',
            [rule]
        );

        if (response.success) {
            const result = Array.isArray(response.result) ? response.result[0] : response.result;
            log(`✅ Created Bingbot allowlist rule (ID: ${result.id})`, 'success');
            return result;
        }

        throw new Error(`API returned success: false`);
    } catch (error) {
        // If expression is too long, try alternative approach
        if (error.message.includes('too long') || error.message.includes('4096')) {
            log(`Expression too long. Trying alternative approach...`, 'warn');
            return await createBingbotAllowRuleAlternative();
        }

        log(`Failed to create Bingbot allowlist rule: ${error.message}`, 'error');
        throw error;
    }
}

async function createBingbotAllowRuleAlternative() {
    // Alternative: Use user-agent based rule combined with cf.client.bot
    // This is less precise but works within Cloudflare limits

    const rule = {
        action: 'allow',
        priority: 1,
        paused: false,
        description: 'Allow Bingbot (User-Agent Based)',
        filter: {
            expression: '(http.user_agent contains "bingbot" or http.user_agent contains "BingPreview" or http.user_agent contains "msnbot")',
            paused: false,
        },
    };

    const response = await apiRequest(
        `/zones/${ZONE_ID}/firewall/rules`,
        'POST',
        [rule]
    );

    if (response.success) {
        const result = Array.isArray(response.result) ? response.result[0] : response.result;
        log(`✅ Created Bingbot allowlist rule (User-Agent based)`, 'success');
        log(`⚠️  Note: Using user-agent detection as IP list was too large`, 'warn');
        return result;
    }
}

async function verifyZone() {
    try {
        const response = await apiRequest(`/zones/${ZONE_ID}`);
        if (response.success) {
            log(`Zone verified: ${response.result.name}`, 'success');
            return true;
        }
    } catch (error) {
        log(`Zone verification failed: ${error.message}`, 'error');
        return false;
    }
}

// Main setup function
async function setupBingbotAllowlist() {
    log('🤖 Setting up Bingbot IP allowlist on Cloudflare...\n');

    // Validate environment variables
    if (!API_TOKEN || API_TOKEN.trim() === '') {
        log('CLOUDFLARE_API_TOKEN environment variable is required', 'error');
        log('Get your API token from: https://dash.cloudflare.com/profile/api-tokens', 'info');
        process.exit(1);
    }

    if (!ZONE_ID || ZONE_ID.trim() === '') {
        log('CLOUDFLARE_ZONE_ID environment variable is required', 'error');
        log('Find your Zone ID in Cloudflare dashboard → Overview → API', 'info');
        process.exit(1);
    }

    // Verify zone access
    const zoneValid = await verifyZone();
    if (!zoneValid) {
        log('Cannot access zone. Please check your credentials.', 'error');
        process.exit(1);
    }

    // Check for existing Bingbot allowlist rule
    log('\nChecking for existing Bingbot allowlist rules...');
    const existingRules = await getExistingRules();
    const existingBingbotRule = existingRules.find(r =>
        r.description && r.description.includes('Bingbot')
    );

    if (existingBingbotRule) {
        log(`Found existing Bingbot rule: "${existingBingbotRule.description}"`, 'warn');
        log(`Rule ID: ${existingBingbotRule.id}`, 'info');

        // Ask if we should update it
        log('\nDeleting old rule and creating new one with updated IP ranges...', 'info');
        const deleted = await deleteRule(existingBingbotRule.id);

        if (!deleted) {
            log('Failed to delete old rule. Please delete it manually and run this script again.', 'error');
            process.exit(1);
        }

        log('Old rule deleted successfully', 'success');
    }

    // Create new Bingbot allowlist rule
    log('\nCreating Bingbot allowlist rule...');
    log(`Loaded ${bingbotData.prefixes.length} Bingbot IP ranges from official Microsoft list`, 'info');

    try {
        await createBingbotAllowRule();
    } catch (error) {
        log('\n❌ Failed to create Bingbot allowlist rule', 'error');
        log('You can create this rule manually in Cloudflare Dashboard:', 'info');
        log('1. Go to Security → WAF → Firewall rules', 'info');
        log('2. Create a new rule with:', 'info');
        log('   - Name: Allow Official Bingbot IP Ranges', 'info');
        log('   - Priority: 1 (highest)', 'info');
        log('   - Action: Allow', 'info');
        log('   - Expression: See bingbot-ip-ranges.json for IP list', 'info');
        process.exit(1);
    }

    // Summary
    log('\n' + '='.repeat(60));
    log('✅ Bingbot allowlist setup complete!', 'success');
    log('='.repeat(60));

    log('\n📋 What was configured:');
    log(`   • Created firewall rule to allow ${bingbotData.prefixes.length} official Bingbot IP ranges`);
    log('   • Set rule priority to 1 (highest) to ensure Bingbot is never blocked');
    log('   • Using official Microsoft Bingbot IP ranges');

    log('\n📝 Next steps:');
    log('1. Go to Cloudflare Dashboard → Security → WAF → Firewall rules');
    log('2. Verify the "Allow Official Bingbot IP Ranges" rule is at the top');
    log('3. Ensure this rule has higher priority than any blocking rules');
    log('4. Monitor Security → Events to see allowed Bingbot traffic');

    log('\n💡 Important notes:');
    log('✅ This rule uses official Microsoft Bingbot IP ranges');
    log('✅ Bingbot will now be allowed even if other rules would block it');
    log('✅ Keep bingbot-ip-ranges.json updated with latest Microsoft IPs');
    log('✅ Re-run this script whenever Microsoft updates their IP ranges\n');
}

// Run setup
setupBingbotAllowlist().catch(error => {
    log(`Setup failed: ${error.message}`, 'error');
    process.exit(1);
});
