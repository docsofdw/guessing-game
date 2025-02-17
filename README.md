# 🏈 YDKB (You Don't Know Ball)

Test your knowledge of NFL players' college careers in this daily guessing game, inspired by Immaculate Grid.

![Game Preview](/public/api/placeholder/800/400)

## 🎯 Game Features

- **Three Difficulty Levels**
  - 🟢 Easy: Current NFL stars from well-known universities
  - 🟡 Hard: Lesser-known players or smaller colleges
  - 🔴 Hall of Fame: NFL legends challenge

- **Daily Challenges**: New players to guess every day
- **Educational Content**: Learn about players' college careers
- **Archive Mode**: Access and play past daily challenges

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/docsofdw/YDKB.git

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🛠️ Built With

- [Next.js 14](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
- [Zustand](https://zustand-demo.pmnd.rs/) - State Management
- [TypeScript](https://www.typescriptlang.org/) - Type Safety

## 📁 Project Structure

```
├── app/                # Next.js pages/routing
├── src/
│   ├── components/    # React components
│   │   ├── common/   # Reusable UI components
│   │   └── features/ # Feature-specific components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── types/        # TypeScript definitions
│   └── styles/       # Global styles
└── docs/             # Documentation
```

## 📖 Documentation

- [Architecture Overview](./docs/architecture/README.md)
- [Development Guide](./docs/development/README.md)
- [Component Documentation](./docs/components/README.md)
- [API Documentation](./docs/api/README.md)

## 🧪 Running Tests

```bash
npm run test
npm run test:e2e
npm run test:coverage
```

## 🤝 Contributing

We love your input! See our [Contributing Guide](./CONTRIBUTING.md) for ways to get started.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- Inspired by [Immaculate Grid](https://www.immaculategrid.com/football)
- NFL data sourced from public records