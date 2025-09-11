# Arduino Hardware Setup Instructions

## Quick Setup

1. **Install Node.js** on your computer if not already installed

2. **Setup Bridge Server:**
   ```bash
   # Create a new folder for the bridge server
   mkdir arduino-bridge
   cd arduino-bridge
   
   # Copy the files from your project:
   # - arduino-bridge-server.js
   # - bridge-package.json (rename to package.json)
   
   # Install dependencies
   npm install
   ```

3. **Update Arduino Port:**
   - Open `arduino-bridge-server.js`
   - Change `ARDUINO_PORT = 'COM6'` to your actual Arduino port
   - Find your port in Arduino IDE: Tools > Port

4. **Upload Arduino Code:**
   - Open `sprinkler-control.ino` in Arduino IDE
   - Upload the sketch to your Arduino board
   - Ensure solenoid relay connected to pin 7, pump relay to pin 8
   - Verify serial monitor shows "Arduino Ready" at 9600 baud

5. **Run Bridge Server:**
   ```bash
   npm start
   ```

6. **Test in Web App:**
   - Go to your dashboard
   - Click "Start Spray" on Smart Sprayer Unit 1
   - Arduino should activate pump and solenoid
   - Click "Stop Spray" to deactivate

## Hardware Connections
- **Solenoid Relay:** Arduino Pin 7
- **Pump Relay:** Arduino Pin 8  
- **Power:** Connect relays to appropriate power supply
- **USB:** Arduino connected to computer running bridge server

## Troubleshooting
- If bridge server fails to connect, check Arduino port in Device Manager
- Ensure Arduino sketch is uploaded and serial monitor shows 9600 baud
- Bridge server must run on same computer as Arduino
- Web app will work in simulation mode if bridge server is offline

## Commands Sent
- **Start Spray:** Sends 'P' (pump on) then 'S' (solenoid on)
- **Stop Spray:** Sends 'P' (pump off) then 'S' (solenoid off)