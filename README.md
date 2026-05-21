# Self-Profile
> A pixel-art, RPG-style portfolio that transforms job hunting into an epic quest.

## 🛠️ Built With
- **HTML** — Semantic structure
- **CSS** — Grid layouts, CSS variables, and pixel aesthetics
- **JavaScript** — Game logic, sound effects, and state management
- **Font Awesome** — Icons and symbols
- **Google Fonts** — Press Start 2P, VT323, Pixelify Sans

## 🎮 Game Features
- **Three main screens**: Start Menu, Main Menu (RPG Interface), and Quest Log
- **Interactive character status** with dynamic HP/MP bars that increase with STR/INT
- **Stat-based character growth**: Allocate stat points (SP) to STR, AGI, INT, or LUK
- **Sound effects**: Click, hover, level-up, and magic tones (no bg music)
- **CRT filter** for authentic retro gaming feel
- **Full i18n support**: English (en) and Vietnamese (vi)
- **Easter Egg**: Gemini's Blessing relic unlocks at LUK ≥ 65
- **Tavern Message Board** — Submit messages that appear in the log

## 📂 Folder Structure
```
Self-Profile/
├── public/
│   ├── assets/
│   │   ├── background.png       # Background image
│   │   ├── avatar.png           # Character avatar
│   │   ├── quest1.png           # Quest 1 preview
│   │   ├── quest2.png           # Quest 2 preview
│   │   ├── quest3.png           # Quest 3 preview
│   │   ├── tavern.jpg           # Tavern background
│   │   ├── skill1.jpg           # Skill 1 (Frontend)
│   │   ├── skill2.jpg           # Skill 2 (Backend)
│   │   ├── skill3.jpg           # Skill 3 (Mobile)
│   │   ├── skill4.jpg           # Skill 4 (Database)
│   │   └── skill5.jpg           # Skill 5 (Cloud)
│   └── sounds/
│       ├── click.wav            # UI click
│       ├── hover.wav            # Hover sound
│       ├── levelup.wav          # Level up
│       ├── magic.wav            # Magic/menu sound
│       └── error.wav            # Error/incorrect
├── index.html                   # Main portfolio page
├── styles.css                   # RPG-style UI and animations
├── script.js                    # Game logic and state management
└── README.md                    # Project documentation
```

## 🚀 Usage
1. Clone or download the repository:
   ```bash
   git clone <repo-url>
   cd Self-Profile
   ```

2. Open `index.html` in your browser:
   ```bash
   open index.html
   ```

3. Explore the features:
   - Click **▶ PRESS START** to begin
   - Use the **Main Menu** to navigate through sections
   - Allocate **stat points** using the **+** buttons
   - Toggle **sound**, **language**, or **CRT filter** with the top-right buttons
   - Visit the **Tavern** to leave a message for the developer

## 🔑 Developer Tools
- **F12** — Open browser DevTools
- **Q** — Toggle CRT filter
- **L** — Switch language (EN/VI)
- **M** — Toggle sound effects
- **R** — Reset stats
- **T** — Open Tavern (message board)

## 🎨 Customization
### Add New Quests
1. Create a new image in `public/assets/` (e.g., `quest4.png`)
2. Add the quest to `index.html` with a unique `data-quest-id`
3. Update `script.js` with the new quest details in `i18n` dictionary

### Modify Stats
- Change initial values in `state.stats` or `INITIAL_STATS` constant
- Adjust stat growth formulas in `increaseStat` function

### Change Audio
1. Replace sound files in `public/sounds/`
2. Ensure file names match those in `playClickSound`, `playHoverSound`, etc.

## 📱 Responsive Design
- Works on desktop, tablet, and mobile devices
- Touch-friendly controls with large tap targets
- Portrait-optimized for mobile screens

## 📝 Tech Stack Details
- **CSS Grid** used for main layout ($`command-panel`, $`status-panel`)
- **CSS Variables** define the color palette for easy theming
- **JavaScript** manages game state, event listeners, and dynamic DOM updates
- **Custom Audio API** creates retro sound effects without external libraries
- **Semantic HTML** ensures accessibility and SEO-friendly structure

## 📄 License
This project is for personal portfolio use. All assets and code are original unless otherwise noted.

## 🤝 Contributing
Feel free to fork this project, experiment with the features, and adapt it for your own portfolio. No attribution required — just have fun creating your own interactive resume!