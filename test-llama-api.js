// Test script for Llama API integration
// Run this with: node test-llama-api.js

const fs = require('fs');
const path = require('path');

// Function to test Llama API
async function testLlamaAPI(apiKey) {
  const testPayload = {
    model: 'Llama-4-Scout-17B-16E-Instruct-FP8',
    messages: [
      { role: 'user', content: 'Hello! Can you tell me a short joke?' }
    ],
    max_tokens: 100,
    temperature: 0.7,
    stream: false,
  };

  try {
    console.log('Testing Llama API...');
    console.log('Model:', testPayload.model);
    console.log('API Key:', apiKey.substring(0, 10) + '...');
    
    const response = await fetch('https://api.llama.com/compat/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(testPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API call successful!');
    console.log('Response:', data.choices?.[0]?.message?.content || 'No content');
    return true;
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Llama API Test Script');
  console.log('========================');
  
  // Check if API key is provided as command line argument
  const apiKey = process.argv[2];
  
  if (!apiKey) {
    console.log('Usage: node test-llama-api.js <your-llama-api-key>');
    console.log('');
    console.log('To get your API key:');
    console.log('1. Visit: https://llama.developer.meta.com');
    console.log('2. Sign up and join the waitlist');
    console.log('3. Generate an API key from your dashboard');
    console.log('');
    console.log('Example: node test-llama-api.js llama_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    process.exit(1);
  }

  if (!apiKey.startsWith('llama_')) {
    console.log('⚠️  Warning: API key should start with "llama_"');
    console.log('   Make sure you\'re using the correct format from the Llama developer portal');
  }

  const success = await testLlamaAPI(apiKey);
  
  if (success) {
    console.log('');
    console.log('🎉 Your Llama API key is working!');
    console.log('   You can now use it in the ASU AI Portal application.');
    console.log('');
    console.log('   To add it to the app:');
    console.log('   1. Open http://localhost:3000');
    console.log('   2. Go to Settings → Provider Keys');
    console.log('   3. Paste your API key in the "Meta Llama API Key" field');
    console.log('   4. Save and test with a Meta model project');
  } else {
    console.log('');
    console.log('💡 Troubleshooting tips:');
    console.log('   - Verify your API key is correct');
    console.log('   - Check if you have access to the Llama API (may require waitlist approval)');
    console.log('   - Ensure your account has sufficient credits/quota');
    console.log('   - Check the Llama developer portal for any service status updates');
  }
}

// Run the test
main().catch(console.error);
