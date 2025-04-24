# Day/Night Toggle Switch

A beautiful, animated toggle switch that transitions between day and night modes. Features smooth animations, SVG icons, and a responsive design.

![Day/Night Toggle Demo](docs/demo.gif)

## Features

- 🌓 Smooth transition between day and night modes
- 🎨 Custom SVG icons for sun and moon
- 💾 Persists user preference using localStorage
- 📱 Fully responsive design
- ♿ Accessibility-friendly with proper ARIA labels
- 🎯 Zero external dependencies

## Live Demo

[View Live Demo](https://your-deployment-url.vercel.app)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/day-night-toggle.git
cd day-night-toggle
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:1234](http://localhost:1234) in your browser

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This project is configured for easy deployment to Vercel. To deploy:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Click "Deploy"

Or using Vercel CLI:

```bash
npm install -g vercel
vercel
```

## Project Structure

```
├── src/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # Styles including animations
│   └── script.js       # Toggle functionality
├── package.json        # Project dependencies and scripts
├── vercel.json        # Vercel deployment configuration
└── README.md          # Project documentation
```

## Development

- The toggle state is managed in `script.js`
- Animations and styling are handled in `styles.css`
- SVG icons are embedded directly in the HTML

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspiration from modern UI/UX trends
- SVG icons custom-designed for smooth animations 