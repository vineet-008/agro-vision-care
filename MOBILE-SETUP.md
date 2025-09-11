# Mobile App Setup Instructions

Your AgroVision Care app is now ready for mobile deployment with USB Arduino support!

## 🚀 Quick Start (Development)

The app automatically detects if it's running on mobile and shows appropriate Arduino connection options.

## 📱 Install on Physical Device

To run on your actual phone with USB Arduino control:

### 1. Export to GitHub
- Click "Export to GitHub" button in the Lovable interface
- Git pull the project to your local machine

### 2. Install Dependencies
```bash
npm install
```

### 3. Add Mobile Platforms
```bash
# For Android
npx cap add android

# For iOS (Mac with Xcode required)
npx cap add ios
```

### 4. Update Native Dependencies
```bash
# For Android
npx cap update android

# For iOS
npx cap update ios
```

### 5. Build and Sync
```bash
npm run build
npx cap sync
```

### 6. Run on Device
```bash
# For Android
npx cap run android

# For iOS (Mac only)
npx cap run ios
```

## 🔌 USB Arduino Connection

### Hardware Requirements:
- **Android**: USB OTG cable + Arduino
- **iOS**: Lightning to USB adapter + Arduino (limited support)

### Features:
- ✅ Direct USB communication with Arduino
- ✅ Automatic fallback to cloud functions
- ✅ Real-time sprinkler control
- ✅ Mobile-optimized interface

### Connection Status:
- The app shows different Arduino status based on platform
- Mobile devices display USB connection options
- Web browsers show standard network connectivity

## 🛠️ Arduino Compatibility

The mobile app sends these commands via USB:
- **Start Treatment**: `P1,S1` (Pump ON, Sprinkler ON)  
- **Stop Treatment**: `P0,S0` (Pump OFF, Sprinkler OFF)

Your Arduino should be programmed to respond to these serial commands.

## 📖 Learn More

For detailed mobile development guidance, read our blog post: https://lovable.dev/blogs/TODO

## 🔧 Troubleshooting

**USB not detected?**
- Ensure USB OTG support on Android
- Check Arduino serial port settings (9600 baud)
- Verify USB cable supports data transfer

**App not installing?**
- Enable Developer Options on Android
- Allow installation from unknown sources
- For iOS, ensure proper code signing