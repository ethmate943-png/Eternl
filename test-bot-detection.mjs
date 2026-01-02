#!/usr/bin/env node

/**
 * Test script for bot detection
 * Tests the /api/verify-bot endpoint with different user agents
 */

import fetch from 'node-fetch';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

const testCases = [
  {
    name: 'Googlebot',
    userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    expectedBot: true,
  },
  {
    name: 'Googlebot Mobile',
    userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    expectedBot: true,
  },
  {
    name: 'Bingbot',
    userAgent: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    expectedBot: true,
  },
  {
    name: 'Regular Chrome Browser',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    expectedBot: false,
  },
  {
    name: 'Regular Firefox Browser',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    expectedBot: false,
  },
];

async function testBotDetection() {
  console.log('🧪 Testing Bot Detection API\n');
  console.log(`Testing URL: ${BASE_URL}/api/verify-bot\n`);
  console.log('='.repeat(60));

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      const response = await fetch(`${BASE_URL}/api/verify-bot`, {
        headers: {
          'User-Agent': testCase.userAgent,
        },
      });

      const data = await response.json();
      const isBot = data.isBot === true;
      const testPassed = isBot === testCase.expectedBot;

      if (testPassed) {
        passed++;
        console.log(`✅ ${testCase.name}`);
        console.log(`   Expected: ${testCase.expectedBot ? 'Bot' : 'Not Bot'}`);
        console.log(`   Got: ${isBot ? 'Bot' : 'Not Bot'}`);
        console.log(`   Details: ${JSON.stringify(data, null, 2).split('\n').join('\n   ')}`);
      } else {
        failed++;
        console.log(`❌ ${testCase.name}`);
        console.log(`   Expected: ${testCase.expectedBot ? 'Bot' : 'Not Bot'}`);
        console.log(`   Got: ${isBot ? 'Bot' : 'Not Bot'}`);
        console.log(`   Details: ${JSON.stringify(data, null, 2).split('\n').join('\n   ')}`);
      }
      console.log('');
    } catch (error) {
      failed++;
      console.log(`❌ ${testCase.name}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }

  console.log('='.repeat(60));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

  if (failed === 0) {
    console.log('✅ All tests passed!');
  } else {
    console.log('❌ Some tests failed. Check the output above.');
    process.exit(1);
  }
}

testBotDetection().catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});

