#!/usr/bin/env node

const { spawn } = require('child_process');

console.log('Starting Sprinkler System');
console.log('Connecting to Arduino on COM6');

// Start Arduino bridge server
const bridgeProcess = spawn('node', ['arduino-bridge-server.cjs'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Wait a moment for bridge to start
setTimeout(() => {
  console.log('Starting web application');
  
  // Start web application
  const webProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    cwd: __dirname,
    shell: true
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n Shutting down Sprinkler System');
    bridgeProcess.kill();
    webProcess.kill();
    process.exit(0);
  });

  bridgeProcess.on('exit', () => {
    console.log('Arduino bridge stopped');
    webProcess.kill();
    process.exit(1);
  });

  webProcess.on('exit', () => {
    console.log('Web application stopped');
    bridgeProcess.kill();
    process.exit(1);
  });
}, 1000);
