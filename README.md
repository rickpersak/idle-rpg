# Idle RPG

A realistic skill-based idle game inspired by Melvor Idle and Old School RuneScape. Focus on leveling professions, crafting better tools, and progressing through various skills without any magical elements.

## 🎮 Current Features

### Core Gameplay
- **Skill-Based Progression**: Level up various professions to unlock better tools and methods
- **Tool Upgrades**: Progress from basic to advanced tools for better efficiency
- **Resource Gathering**: Collect materials through different professions
- **Real-time Updates**: Smooth 100ms tick rate for responsive gameplay
- **Big Number Support**: Uses `break_infinity.js` for handling large numbers without precision loss

### Current Professions
- **Mining**: Extract ores and gems from rocks (10 gold base cost, 1 ore/sec)
- **Woodcutting**: Chop trees for logs and wood (100 gold base cost, 8 logs/sec)
- **Fishing**: Catch fish for food and materials (1,200 gold base cost, 50 fish/sec)
- **Farming**: Grow crops and raise animals (15,000 gold base cost, 250 crops/sec)

### Technical Features
- **Cloud Save**: Automatic save to Firebase every 10 seconds
- **Anonymous Authentication**: No registration required
- **Responsive UI**: Clean, modern interface with proper formatting
- **TypeScript**: Full type safety throughout the codebase
- **Modular Components**: Separated UI components for maintainability

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd idle-rpg
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Copy your Firebase config to `src/firebase.ts`

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view the game

## 🏗️ Project Structure

```
src/
├── App.tsx                 # Main game component with state management
├── firebase.ts            # Firebase configuration
├── index.css              # Global styles
└── components/
    ├── ResourceDisplay.tsx # Gold display component
    └── Generator.tsx       # Individual generator component
```

## 🎯 Game Mechanics

### Skill Progression
- Each profession has its own level (0-99)
- Higher levels unlock better tools and methods
- Experience is gained through resource gathering

### Tool Upgrades
Tool costs increase by 15% per level: `baseCost * (1.15^level)`
- **Bronze Tools**: Basic efficiency, low cost
- **Iron Tools**: Improved efficiency, moderate cost  
- **Steel Tools**: Good efficiency, higher cost
- **Mithril Tools**: High efficiency, expensive
- **Adamant Tools**: Very high efficiency, very expensive
- **Rune Tools**: Maximum efficiency, extremely expensive

### Resource Production
Each profession produces resources based on tool level and skill level: `baseProduction * toolMultiplier * skillMultiplier`

### Save System
- Game state is automatically saved every 10 seconds
- Uses Firebase Firestore for cloud persistence
- Supports anonymous user authentication

## 🔮 Future Expansion Ideas

### Core Skill Expansions

#### 1. **Additional Professions**
- **Smithing**: Craft tools, weapons, and armor from ores
- **Cooking**: Prepare food from raw ingredients for health benefits
- **Crafting**: Create jewelry, leather goods, and other items
- **Construction**: Build and upgrade your home base
- **Herblore**: Create potions and medicines from herbs
- **Fletching**: Craft bows, arrows, and crossbows

#### 2. **Combat Skills**
- **Attack**: Melee combat proficiency
- **Strength**: Physical damage output
- **Defence**: Damage reduction and armor proficiency
- **Ranged**: Bow and crossbow combat
- **Prayer**: Spiritual abilities and protection
- **Hitpoints**: Health and survivability

#### 3. **Resource Processing**
- **Refining**: Convert raw materials into processed goods
- **Tool Crafting**: Create better tools from gathered materials
- **Equipment Upgrades**: Improve existing gear with materials
- **Resource Trading**: Exchange surplus materials for needed ones

### Skill Progression & Mastery

#### 4. **Mastery System**
- **Skill Mastery**: Unlock special abilities at high levels
- **Tool Mastery**: Reduce tool degradation and improve efficiency
- **Resource Mastery**: Chance for bonus resources and rare drops
- **Achievement System**: Milestone rewards for skill progression

#### 5. **Advanced Mechanics**
- **Tool Degradation**: Tools wear out and need repair/replacement
- **Resource Depletion**: Areas can be exhausted and need time to replenish
- **Weather Effects**: Environmental factors affecting gathering rates
- **Time-Based Events**: Seasonal resources and special gathering opportunities

### World & Exploration

#### 6. **World Areas**
- **Different Biomes**: Forest, Mountains, Desert, Swamp with unique resources
- **Resource Nodes**: Specific locations for different materials
- **Travel System**: Unlock new areas as you progress
- **Local Events**: Area-specific gathering opportunities

#### 7. **Economy & Trading**
- **NPC Merchants**: Buy and sell resources with AI traders
- **Player Trading**: Exchange resources with other players
- **Market Fluctuations**: Dynamic pricing based on supply/demand
- **Contracts**: Long-term resource supply agreements

### Quality of Life & UI

#### 8. **Enhanced UI/UX**

##### **Dashboard Interface Design**
A comprehensive dashboard that provides a centralized view of all player skills and professions with an intuitive, visually appealing layout.

**Layout Structure:**
- **Left Sidebar Navigation**: Fixed sidebar containing all available skills/professions
- **Main Content Area**: Dynamic content panel showing detailed skill information
- **Top Header Bar**: Player stats, gold display, and quick actions
- **Bottom Status Bar**: Current activity indicators and notifications

**Sidebar Design Elements:**
- **Skill Icons**: Custom SVG icons for each profession (pickaxe for Mining, axe for Woodcutting, fishing rod for Fishing, etc.)
- **Level Indicators**: Circular progress rings showing current level and experience progress
- **Color-Coded Categories**: 
  - Gathering Skills: Earth tones (browns, greens)
  - Crafting Skills: Warm tones (oranges, reds)
  - Combat Skills: Cool tones (blues, purples)
- **Hover Effects**: Smooth transitions and tooltips on skill hover
- **Active State**: Highlighted border and background for currently selected skill

**Visual Design System:**
- **Color Palette**: 
  - Primary: Deep forest green (#2D5016) for nature/gathering theme
  - Secondary: Warm gold (#D4AF37) for currency and achievements
  - Accent: Rust orange (#B7410E) for crafting and tools
  - Background: Soft cream (#F5F5DC) for readability
  - Text: Charcoal (#2F2F2F) for high contrast
- **Typography**: 
  - Headers: Bold, modern sans-serif (Inter or Roboto)
  - Body: Clean, readable sans-serif with good line spacing
  - Numbers: Monospace font for consistent alignment
- **Iconography**: 
  - Custom SVG icons with consistent 24px size
  - Outline style with 2px stroke weight
  - Subtle gradients for depth and visual interest

**Interactive Elements:**
- **Skill Cards**: Expandable cards showing detailed progression
- **Progress Bars**: Animated progress indicators for experience gain
- **Tooltips**: Contextual information on hover
- **Quick Actions**: One-click access to common tasks
- **Responsive Design**: Adapts seamlessly to different screen sizes

**Skill Page Navigation:**
- **Persistent Sidebar**: Left sidebar remains visible when viewing individual skill pages
- **Skill Page Activation**: Clicking on a skill icon opens that skill's dedicated page
- **Seamless Navigation**: Users can switch between different skill pages without losing context
- **Visual Feedback**: Active skill page is highlighted in the sidebar for clear orientation

**Skill Page Layout:**
- **Grid Display**: Items arranged in a maximum 4-column grid for optimal readability
- **Vertical Scrolling**: Infinite vertical scroll with smooth scrollbar for extensive item lists
- **Item Cards**: Each item displayed in an organized card format with clear visual hierarchy
- **Progressive Disclosure**: Current accessible items prominently displayed, future items shown with visual indicators

**Item Information Display:**
- **Required Level**: Clear indication of player skill level needed for each item
- **Tool Requirements**: Specific tool tier requirements (e.g., "Steel Pickaxe Required")
- **Accessibility Status**: Visual indicators showing:
  - ✅ Currently accessible (green checkmark)
  - ⏳ Level requirement met, tool upgrade needed (yellow warning)
  - 🔒 Not yet accessible (gray lock icon)
- **Item Details**: Comprehensive information including:
  - Item name and description
  - Experience gained per action
  - Resource yield rates
  - Unlock prerequisites

**User Experience Features:**
- **Quick Assessment**: Users can instantly see what they can work on vs. future goals
- **Progress Tracking**: Visual progress indicators for items currently being worked on
- **Filtering Options**: Sort by accessibility, level requirement, or item type
- **Search Functionality**: Quick search within skill pages for specific items
- **Contextual Help**: Tooltips explaining requirements and benefits

**Skill Training System:**
A comprehensive training system that provides real-time visual feedback for skill progression with automatic inventory management.

**Training Mechanics:**
- **Progress Bar Visualization**: Continuous progress bar that fills over time during skill training
- **Automatic Completion**: Upon reaching 100% completion, items are automatically added to player inventory
- **Seamless Reset**: Training process automatically resets for the next training session
- **Real-time Updates**: Progress bar updates smoothly without interruption

**Difficulty Scaling System:**
- **Tiered Difficulty Levels**: Each item type has a specific difficulty that affects training duration
- **Time Scaling Examples**:
  - Basic items (Copper Ore): ~3.4 seconds training time
  - Intermediate items (Iron Ore): ~5.5 seconds training time
  - Advanced items (Gold Ore): ~9.5 seconds training time
  - Expert items (Mithril Ore): ~15.0 seconds training time
- **Scalable Framework**: System designed to accommodate future item types and training durations

**Progress Display Features:**
- **Time Remaining Counter**: Dynamic countdown showing estimated seconds until completion
- **Real-time Updates**: Time remaining updates continuously as training progresses
- **Visual Progress**: Smooth animation showing training advancement
- **Completion Indicators**: Clear visual feedback when training is complete

**Interactive Tooltips:**
- **Hover Activation**: Tooltips appear when hovering over progress bars
- **Item Preview**: Shows potential inventory items that will be gained upon completion
- **Quantity Information**: Displays expected item quantities and rarity
- **Training Details**: Additional information about experience gained and skill requirements

**System Requirements:**
- **Scalable Architecture**: Framework supports easy addition of new item types and training durations
- **Intuitive Interface**: User-friendly design that enhances gameplay experience
- **Performance Optimization**: Smooth animations and real-time updates without lag
- **Visual Appeal**: Engaging progress indicators that maintain player interest

**Additional UI Features:**
- **Inventory Management**: Organize and manage collected resources
- **Tool Durability Display**: Show tool condition and repair needs
- **Mobile Optimization**: Touch-friendly interface for mobile play
- **Offline Progress**: Continue gathering while away

#### 9. **Advanced Features**
- **Statistics Dashboard**: Detailed skill progress and resource tracking
- **Auto-Upgrade Options**: Automatically purchase better tools when affordable
- **Save Slots**: Multiple characters for different playstyles
- **Export/Import**: Backup and share character saves

### Technical Improvements

#### 10. **Performance & Scalability**
- **Web Workers**: Move heavy calculations off the main thread
- **Virtual Scrolling**: Handle thousands of items efficiently
- **Caching**: Optimize Firebase reads and writes
- **Progressive Web App**: Install as a native app

#### 11. **Analytics & Monitoring**
- **Player Analytics**: Track engagement and progression
- **Performance Monitoring**: Monitor game performance
- **A/B Testing**: Test different game mechanics
- **Error Tracking**: Monitor and fix bugs proactively

## 🛠️ Development Roadmap

### Phase 1: Core Skill Expansion (Weeks 1-4)
- [ ] Add Smithing profession
- [ ] Implement tool crafting system
- [ ] Create skill level progression
- [ ] Add resource inventory management

### Phase 2: Combat & Equipment (Weeks 5-8)
- [ ] Basic combat skills (Attack, Strength, Defence)
- [ ] Equipment system with stats
- [ ] Tool degradation mechanics
- [ ] Resource processing (cooking, crafting)

### Phase 3: World & Exploration (Weeks 9-12)
- [ ] Multiple world areas/biomes
- [ ] Resource node system
- [ ] NPC merchants and trading
- [ ] Achievement system

### Phase 4: Polish & Optimization (Weeks 13-16)
- [ ] Mobile optimization
- [ ] Performance improvements
- [ ] Advanced UI features
- [ ] PWA features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [break_infinity.js](https://github.com/Patashu/break_infinity.js) for big number handling
- [Firebase](https://firebase.google.com/) for backend services
- [React](https://reactjs.org/) for the UI framework
- [TypeScript](https://www.typescriptlang.org/) for type safety

## 📞 Support

If you have any questions or suggestions, please open an issue on GitHub or contact the development team.

---

**Happy Idling!** 🎮✨