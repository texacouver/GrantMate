# Grant Proposal Generator

A professional web application for generating comprehensive grant proposals with AI-powered assistance and customizable templates. Built with React, Express.js, and modern UI components to streamline the grant writing process for nonprofit organizations and researchers.

![Grant Proposal Generator](https://img.shields.io/badge/Built%20with-React-blue) ![Express.js](https://img.shields.io/badge/Backend-Express.js-green) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue) ![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-06B6D4)

## Features

### 🎯 Core Functionality
- **Smart Form System**: Comprehensive form with real-time validation and character counting
- **Template Library**: 8 professional grant templates covering major categories
- **AI Integration**: Optional OpenAI integration for enhanced proposal generation
- **Proposal Preview**: Live preview with formatting and export capabilities
- **Data Persistence**: In-memory storage with planned database integration

### 🎨 User Experience
- **Modern Design**: Apple-inspired interface with frosted glass effects
- **Micro-interactions**: Subtle animations and hover effects for professional feel
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Built with screen readers and keyboard navigation in mind

### 📋 Grant Templates
- Medical Research Grant
- Education Program Grant
- Community Development Grant
- Environmental Conservation Grant
- Arts & Culture Grant
- Technology Innovation Grant
- Small Business Development Grant
- Workforce Development Grant

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching
- **Wouter** for routing
- **Framer Motion** for animations

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **PostgreSQL** for data persistence
- **OpenAI API** integration (optional)
- **WebSocket** support for real-time collaboration

### Development Tools
- **Vite** for build tooling
- **ESBuild** for production bundling
- **Drizzle Kit** for database migrations
- **TypeScript** for type safety

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/grant-proposal-generator.git
   cd grant-proposal-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here (optional)
   DATABASE_URL=your_database_url_here (optional)
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000`

## Usage

### Creating a Grant Proposal

1. **Start with a Template** (Optional)
   - Click "Use Template" to browse available templates
   - Select a template that matches your grant type
   - The form will populate with relevant content

2. **Fill Out the Form**
   - Enter your organization details
   - Describe your project and target population
   - Specify funding amount and timeline
   - Add goals and objectives

3. **Generate Proposal**
   - Click "Generate Proposal" to create your document
   - Review the generated content
   - Use the preview, copy, or download options

### Template System

The application includes professionally crafted templates for different grant types:

- **Medical Research**: Clinical trials, research studies, health initiatives
- **Education**: Academic programs, educational technology, student support
- **Community Development**: Housing, social services, community programs
- **Environmental**: Conservation projects, sustainability initiatives
- **Arts & Culture**: Creative programs, cultural preservation, arts education
- **Technology**: Innovation projects, digital transformation, tech education
- **Small Business**: Entrepreneurship, business development, economic growth
- **Workforce Development**: Job training, career development, skills programs

## API Endpoints

### Grant Proposals
- `POST /api/grant-proposals` - Create new proposal
- `GET /api/grant-proposals/:id` - Get proposal by ID
- `PUT /api/grant-proposals/:id` - Update proposal
- `DELETE /api/grant-proposals/:id` - Delete proposal
- `POST /api/grant-proposals/:id/generate` - Generate proposal content

### Templates
- `GET /api/templates` - List available templates
- `GET /api/templates/:id` - Get template details

## Configuration

### Database Setup (Optional)

The application can run with in-memory storage or PostgreSQL:

1. **PostgreSQL Setup**
   ```bash
   # Create database
   createdb grant_proposals
   
   # Run migrations
   npm run db:push
   ```

2. **Environment Configuration**
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/grant_proposals
   ```

### OpenAI Integration (Optional)

For AI-powered proposal generation:

1. **Get OpenAI API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create an account and generate an API key
   - Ensure you have sufficient credits

2. **Configure Environment**
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

## Development

### Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utilities
├── server/                 # Express backend
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data layer
│   └── services/           # External services
├── shared/                 # Shared types and schemas
└── components.json         # shadcn/ui config
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run type-check   # Run TypeScript checks
npm run db:push      # Push database schema
npm run db:studio    # Open database studio
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits for git history

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use semantic commit messages
- Write tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:
1. Check the documentation above
2. Search existing issues on GitHub
3. Create a new issue with detailed information

## Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced AI proposal customization
- [ ] PDF export with professional formatting
- [ ] Multi-language support
- [ ] Grant submission tracking
- [ ] Template sharing community

## Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- Powered by [OpenAI](https://openai.com/) for intelligent content generation
- Styled with [Tailwind CSS](https://tailwindcss.com/) for modern design
- Icons by [Lucide React](https://lucide.dev/)

---

**Made with ❤️ for the nonprofit and research community**