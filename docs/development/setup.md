# 🔧 Development Setup

> Complete guide to setting up your local development environment for the Video and Chat Application.

## 🎯 Prerequisites

### System Requirements
- **Operating System**: macOS, Linux, or Windows (with WSL2)
- **Memory**: Minimum 8GB RAM (16GB recommended)
- **Storage**: At least 5GB free space
- **Network**: Stable internet connection for package downloads

### Required Software

| Software | Version | Installation | Purpose |
|----------|---------|-------------|---------|
| **Node.js** | 16+ | [Download](https://nodejs.org/) | JavaScript runtime |
| **npm** | 8+ | Included with Node.js | Package manager |
| **Git** | 2.30+ | [Download](https://git-scm.com/) | Version control |
| **VS Code** | Latest | [Download](https://code.visualstudio.com/) | Recommended IDE |

### Optional Tools
| Tool | Purpose | Installation |
|------|---------|-------------|
| **Docker** | Container development | [Docker Desktop](https://www.docker.com/products/docker-desktop) |
| **AWS CLI** | Infrastructure management | [AWS CLI v2](https://aws.amazon.com/cli/) |
| **Terraform** | Infrastructure as code | [Terraform](https://www.terraform.io/downloads.html) |

## 🚀 Quick Start

### 1. Clone Repository
```bash
# Clone the main repository
git clone https://github.com/your-username/videoAndChatApp.git
cd videoAndChatApp
```

### 2. Frontend Setup
```bash
# Navigate to the React application
cd chatandvideo

# Install dependencies
npm install

# Create environment configuration
cp .env.example .env.local
```

### 3. Configure Environment Variables
Edit `.env.local` with your configuration:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id

# Twilio Configuration  
REACT_APP_TWILIO_ACCOUNT_SID=your_twilio_account_sid
REACT_APP_TWILIO_API_KEY=your_twilio_api_key

# Application Configuration
REACT_APP_APP_URL=http://localhost:3000
```

### 4. Start Development Server
```bash
# Start the development server
npm start

# Application will be available at http://localhost:3000
```

## 🔧 Detailed Setup

### Node.js Version Management
For consistent Node.js versions across the team:

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install and use Node.js 18
nvm install 18
nvm use 18
nvm alias default 18
```

### IDE Configuration

#### VS Code Extensions
Install these recommended extensions:

```bash
# Essential extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint

# React-specific extensions
code --install-extension ms-vscode.vscode-react-hooks
code --install-extension burkeholland.simple-react-snippets

# Infrastructure extensions  
code --install-extension hashicorp.terraform
code --install-extension ms-azuretools.vscode-docker
```

#### VS Code Settings
Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.exclude": {
    "**/node_modules": true,
    "**/build": true
  }
}
```

### Git Configuration

#### Global Git Setup
```bash
# Configure Git with your details
git config --global user.name "Your Name"
git config --global user.email "your.email@company.com"

# Set up useful aliases
git config --global alias.co checkout
git config --global alias.br branch  
git config --global alias.ci commit
git config --global alias.st status
```

#### Pre-commit Hooks
```bash
# Install pre-commit hooks for code quality
npm install -g husky lint-staged

# Initialize in project
npx husky install
```

## 🛠️ Development Tools

### Package Management
```bash
# Install dependencies
npm install

# Add new dependency
npm install package-name

# Add development dependency
npm install -D package-name

# Update dependencies
npm update

# Audit for vulnerabilities
npm audit
```

### Code Quality Tools

#### ESLint Configuration
The project uses ESLint for code linting:

```bash
# Run linting
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

#### Prettier Configuration
Code formatting with Prettier:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Testing Setup

#### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

#### Test Configuration
Tests are configured with Jest and React Testing Library:

```javascript
// Example test structure
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project
3. Enable Authentication and Realtime Database

### 2. Configure Authentication
```javascript
// Enable Google Sign-in in Firebase Console
// Authentication → Sign-in method → Google → Enable
```

### 3. Database Rules
Set up Realtime Database rules:

```json
{
  "rules": {
    "rooms": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

## 📹 Twilio Setup

### 1. Create Twilio Account
1. Sign up at [Twilio Console](https://www.twilio.com/console)
2. Create new project
3. Get Account SID and API Key

### 2. Twilio Configuration
```javascript
// Add to your environment variables
REACT_APP_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxx
REACT_APP_TWILIO_API_KEY=SKxxxxxxxxxxxxxx
REACT_APP_TWILIO_API_SECRET=your_api_secret
```

## 🐳 Docker Development (Optional)

### Development Container
```dockerfile
# Dockerfile.dev
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose
```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

### Running with Docker
```bash
# Build and run
docker-compose -f docker-compose.dev.yml up --build

# Run in background
docker-compose -f docker-compose.dev.yml up -d
```

## 🔧 Troubleshooting

### Common Issues

#### Node Version Conflicts
```bash
# Check Node version
node --version

# If version is wrong, use nvm
nvm use 18
```

#### Package Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or use different port
PORT=3001 npm start
```

#### Environment Variables Not Loading
```bash
# Ensure .env.local exists and has correct format
# Variables must start with REACT_APP_
# No spaces around = sign
REACT_APP_API_URL=http://localhost:3000
```

### Performance Issues

#### Slow Development Server
```bash
# Disable source maps in development
GENERATE_SOURCEMAP=false npm start

# Use faster refresh
FAST_REFRESH=true npm start
```

#### Memory Issues
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max_old_space_size=4096 npm start
```

## 📝 Development Workflow

### Daily Development
1. **Pull latest changes**: `git pull origin main`
2. **Install new dependencies**: `npm install`
3. **Start development server**: `npm start`
4. **Run tests**: `npm test`
5. **Make changes and commit**: `git add . && git commit -m "feat: add new feature"`
6. **Push changes**: `git push origin feature-branch`

### Code Review Process
1. Create feature branch from `main`
2. Make changes and commit
3. Push branch and create pull request
4. Address review comments
5. Merge after approval

## 🎯 Next Steps

After completing the setup:

1. **Explore the codebase**: Start with `src/App.js`
2. **Read component documentation**: Check individual component READMEs
3. **Run the test suite**: Ensure everything works
4. **Make a small change**: Try modifying a component
5. **Join the team**: Connect with other developers

## 📞 Getting Help

- 💬 **Team Chat**: #development-help
- 📧 **Email**: dev-team@videochatapp.com  
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/videoAndChatApp/issues)
- 📚 **Documentation**: [Project Docs](../README.md)

---

<div align="center">

**🎉 You're all set!** Happy coding and welcome to the team!

</div>
