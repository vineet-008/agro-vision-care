const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Auto-start bridge server for local development
function startBridgeServer() {
  const bridgeServerPath = path.join(__dirname, 'arduino-bridge-server.cjs');
  
  if (!fs.existsSync(bridgeServerPath)) {
    console.log('❌ Bridge server not found, skipping Arduino connection');
    return;
  }

  console.log('🚀 Auto-starting Arduino bridge server...');
  
  const bridgeProcess = spawn('node', [bridgeServerPath], {
    stdio: 'inherit',
    cwd: __dirname
  });

  bridgeProcess.on('error', (error) => {
    console.error('❌ Failed to start bridge server:', error.message);
  });

  bridgeProcess.on('close', (code) => {
    if (code !== 0) {
      console.log(`🔄 Bridge server exited with code ${code}, restarting...`);
      setTimeout(startBridgeServer, 3000);
    }
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down bridge server...');
    bridgeProcess.kill();
    process.exit(0);
  });

  return bridgeProcess;
}

// Check if we're in development mode and start bridge
if (process.env.NODE_ENV !== 'production') {
  startBridgeServer();
}

module.exports = { startBridgeServer };