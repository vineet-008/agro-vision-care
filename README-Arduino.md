# Arduino Integration Setup

## Quick Start

1. **Upload Arduino Code:**
   - Upload `sprinkler-control.ino` to your Arduino board
   - Connect pump relay to pin 8, valve relay to pin 7
   - Connect Arduino to COM6 (or it will auto-detect)

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start Everything:**
   ```bash
   npm start
   ```
   OR
   ```bash
   npm run dev
   ```

This will automatically start both:
- Arduino bridge server (localhost:3001) 
- Web application (localhost:5173)

## What Happens

- Bridge server auto-detects your Arduino (prioritizes COM6)
- Web app shows "Arduino Connected" status when ready
- All spray/treatment buttons will control real hardware
- No manual setup needed - everything runs together!

## Troubleshooting

- Make sure Arduino is powered and connected
- Check that `sprinkler-control.ino` is uploaded to your board
- Bridge server will retry connection automatically

## Files Created

- `arduino-bridge-server.js` - Bridge between web app and Arduino
- `sprinkler-control.ino` - Arduino code for relay control
- Updated `package.json` - Integrated npm scripts