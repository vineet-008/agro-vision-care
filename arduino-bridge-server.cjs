const express = require('express');
const { SerialPort } = require('serialport');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Auto-detect Arduino port (prioritize COM6, then scan others)
const PREFERRED_PORTS = ['COM6', 'COM5', 'COM4', 'COM3', 'COM7', 'COM8'];
const BAUD_RATE = 9600;
let ARDUINO_PORT = null;

let serialPort;
let isConnected = false;

// Auto-detect Arduino port function
async function detectArduinoPort() {
  try {
    const ports = await SerialPort.list();
    console.log('🔍 Available serial ports:', ports.map(p => p.path));
    
    // First try preferred ports in order
    for (const preferredPort of PREFERRED_PORTS) {
      const found = ports.find(p => p.path === preferredPort);
      if (found) {
        console.log(`🎯 Found preferred port: ${preferredPort}`);
        return preferredPort;
      }
    }
    
    // If no preferred port found, try any available port
    for (const port of ports) {
      if (port.path && (port.path.includes('COM') || port.path.includes('tty'))) {
        console.log(`🔍 Trying port: ${port.path}`);
        return port.path;
      }
    }
    
    throw new Error('No suitable Arduino port found');
  } catch (error) {
    console.error('❌ Port detection failed:', error.message);
    return null;
  }
}

// Initialize serial connection with auto-detection
async function initializeSerial() {
  if (!ARDUINO_PORT) {
    ARDUINO_PORT = await detectArduinoPort();
    if (!ARDUINO_PORT) {
      console.error('❌ Cannot proceed without Arduino port');
      return;
    }
  }
  
  try {
    serialPort = new SerialPort({
      path: ARDUINO_PORT,
      baudRate: BAUD_RATE,
    });

    serialPort.on('open', () => {
      console.log(`✅ Connected to Arduino on ${ARDUINO_PORT}`);
      isConnected = true;
    });

    serialPort.on('error', (err) => {
      console.error('❌ Serial port error:', err.message);
      isConnected = false;
      // Retry connection after 5 seconds
      setTimeout(() => {
        console.log('🔄 Retrying Arduino connection...');
        initializeSerial();
      }, 5000);
    });

    serialPort.on('close', () => {
      console.log('🔌 Serial connection closed');
      isConnected = false;
    });

  } catch (error) {
    console.error('❌ Failed to initialize serial port:', error.message);
    // Retry with different port after 3 seconds
    setTimeout(async () => {
      ARDUINO_PORT = await detectArduinoPort();
      if (ARDUINO_PORT) initializeSerial();
    }, 3000);
  }
}

// Send command to Arduino (append newline and drain)
function sendArduinoCommand(command) {
  return new Promise((resolve, reject) => {
    if (!isConnected || !serialPort) {
      reject(new Error('Arduino not connected'));
      return;
    }

    const line = `${command}\n`; // newline terminated for most sketches
    serialPort.write(line, (err) => {
      if (err) {
        reject(err);
        return;
      }
      serialPort.drain((drainErr) => {
        if (drainErr) {
          reject(drainErr);
        } else {
          console.log(`📤 Sent command: ${JSON.stringify(line.trim())}`);
          resolve();
        }
      });
    });
  });
}

// Map high-level action to default command set if commands not specified
function mapActionToCommands(action) {
  if (action === 'start') return ['1']; // Start treatment sequence: Valve ON 5s, then Pump ON continuously
  if (action === 'stop') return ['0'];  // Turn both pump and valve OFF
  return [];
}

// API endpoint to receive commands from web app
app.post('/arduino-command', async (req, res) => {
  try {
    const { commands: incomingCommands, action } = req.body;

    // Prefer explicit commands, otherwise build from action
    const commands = Array.isArray(incomingCommands) && incomingCommands.length > 0
      ? incomingCommands
      : mapActionToCommands(action);

    if (!commands || commands.length === 0) {
      return res.status(400).json({ error: 'Commands array or valid action (start/stop) required' });
    }

    console.log(`🎯 Received ${action || 'custom'} command set:`, commands);

    // Send each command to Arduino with longer delay for reliable relay switching
    for (const command of commands) {
      await sendArduinoCommand(command);
      await new Promise(resolve => setTimeout(resolve, 200)); // Increased delay
    }

    res.json({ 
      success: true, 
      message: `${action || 'custom'} commands sent successfully`,
      commands: commands
    });

  } catch (error) {
    console.error('❌ Error sending commands:', error);
    res.status(500).json({ 
      error: 'Failed to send commands to Arduino',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/status', (req, res) => {
  res.json({
    connected: isConnected,
    port: ARDUINO_PORT,
    baudRate: BAUD_RATE
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Arduino Bridge Server running on http://localhost:${PORT}`);
  console.log(`📡 Connecting to Arduino on ${ARDUINO_PORT}...`);
  initializeSerial();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down bridge server...');
  if (serialPort && serialPort.isOpen) {
    serialPort.close();
  }
  process.exit(0);
});