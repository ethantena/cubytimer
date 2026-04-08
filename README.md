# CubyTimer - Modern Speedcubing Timer

A comprehensive, modern speedcubing timer application built with Next.js, TypeScript, and Tailwind CSS. Features advanced statistics, multiple WCA events, smart cube connectivity, and Stackmat timer support.

## 🚀 Features

### Core Timer Features
- **Modern Interface**: Clean, responsive design with JetBrains Mono font
- **Multiple WCA Events**: Support for 3x3, 2x2, 4x4, 5x5, OH, BLD, and more
- **Advanced Scramble Generator**: Event-specific scramble generation
- **Inspection Timer**: Configurable inspection time (0-30 seconds)
- **Penalty System**: DNF and +2 penalty support
- **Keyboard Controls**: Space bar for timer control

### Statistics & Analytics
- **Comprehensive Stats**: AO5, AO12, AO50, AO100 calculations
- **Interactive Charts**: Time progression and distribution graphs
- **Session Tracking**: Solve count, success rate, improvement metrics
- **Export/Import**: Backup and restore your solve data

### Customization
- **Multiple Themes**: Dark, Light, Blue, Green, Purple themes
- **Font Options**: JetBrains Mono, Inter, System Mono
- **Configurable Settings**: Inspection time, display preferences

### Advanced Features
- **WCA Integration**: Connect your WCA account
- **Smart Cube Support**: Bluetooth connectivity for smart cubes
- **Stackmat Timer**: Microphone input for Stackmat timer integration
- **Admin Panel**: Password-protected admin interface
- **Data Persistence**: Local storage for all settings and solves

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: Bun.js
- **State Management**: Zustand with persistence
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cubytimer.com.git
cd cubytimer.com
```

2. Install dependencies with Bun:
```bash
bun install
```

3. Run the development server:
```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
instead of installing visit https://cubytimer.com

## 🎯 Usage

### Basic Timer Operation
1. Select your event from the dropdown
2. Press and hold space bar to start inspection
3. Release space bar to start the timer
4. Press space bar again to stop and save the solve

### Statistics
- Navigate to the Statistics page to view detailed analytics
- Filter by event to see event-specific stats
- View time progression charts and distribution graphs

### Settings
- Customize themes, fonts, and timer preferences
- Connect your WCA account
- Configure inspection time and other options

### Admin Panel
- Access at `/admin` with password: `admin123`
- Manage internal settings
- Export/import data
- View system statistics

## 🎨 Themes

The application includes 5 built-in themes:
- **Dark**: Default dark theme with blue accents
- **Light**: Clean light theme
- **Blue**: Blue-themed dark interface
- **Green**: Green-themed dark interface  
- **Purple**: Purple-themed dark interface

## 📊 Supported Events

- 3x3x3
- 2x2x2
- 4x4x4
- 5x5x5
- 6x6x6
- 7x7x7
- 3x3x3 One-Handed
- 3x3x3 Blindfolded
- F2L
- Last Layer
- PLL
- OLL
- Pyraminx
- Megaminx
- Skewb
- Square-1

## 🔧 Configuration

### Browser Compatibility
- **Bluetooth**: Requires Web Bluetooth API (Chrome, Edge, Opera)
- **Microphone**: Requires Web Audio API (all modern browsers)
- **Local Storage**: Required for data persistence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by CubeDesk and csTimer
- WCA for event standards and scramble algorithms

## 🐛 Bug Reports

Please report bugs through the GitHub Issues page with:
- Description of the issue
- Steps to reproduce
- Browser and device information
- Screenshots if applicable

## 📧 Contact

For questions or suggestions:
- Create an issue on GitHub
- Contact through the project website

---

** Happy Cubing! **
