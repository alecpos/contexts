const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.resolve(__dirname, '.env');
const envConfig = fs.readFileSync(envPath, 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {});

// Set environment variables
Object.entries(envConfig).forEach(([key, value]) => {
  process.env[key] = value;
});

if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}
