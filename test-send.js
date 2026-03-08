#!/usr/bin/env node
/**
 * Quick test for the send-letter API.
 * Run: node test-send.js
 * Requires: RESEND_API_KEY in .env.local (or export it)
 * Start the API first: npx vercel dev (or deploy to Vercel)
 */

const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  });
}

const API_BASE = process.env.API_BASE || 'http://localhost:3000';

async function test() {
  console.log('Testing send-letter API at', `${API_BASE}/api/send-letter`);
  const res = await fetch(`${API_BASE}/api/send-letter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to_email: 'test@example.com',
      to_name: 'Test',
      from_name: 'Sender',
      subject: 'Test letter',
      message: 'Hello from Send in Bloom test.',
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok) {
    console.log('✓ Success:', data);
  } else {
    console.log('✗ Error:', res.status, data.error || data);
  }
}

test().catch(e => console.error('Request failed:', e.message));
