#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Arduino-integrated development server...');

// Start Arduino bridge server
const bridgeProcess = spawn('node', ['arduino-bridge-server.cjs'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Wait a moment for bridge to start
setTimeout(() => {
  // Start main web application
  const webProcess = spawn('npm', ['run', 'dev:web'], {
    stdio: 'inherit',
    cwd: __dirname,
    shell: true
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    bridgeProcess.kill();
    webProcess.kill();
    process.exit(0);
  });

  bridgeProcess.on('exit', () => {
    console.log('Arduino bridge server stopped');
    webProcess.kill();
    process.exit(1);
  });

  webProcess.on('exit', () => {
    console.log('Web server stopped');
    bridgeProcess.kill();
    process.exit(1);
  });
}, 1000);