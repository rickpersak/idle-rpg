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
- **Skill Trees**: Visual progression paths for each profession
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