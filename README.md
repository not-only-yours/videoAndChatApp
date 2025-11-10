# 🎥 Video and Chat Application

> A modern real-time communication platform combining video conferencing and chat functionality with Firebase authentication and Twilio integration.

[![Deploy Status](https://img.shields.io/badge/deploy-success-brightgreen)](https://chatpart-18f0f.web.app/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.x-orange)](https://firebase.google.com/)

## ✨ Features

### Core Functionality
- 🔐 **Google Authentication** - Secure login with Google OAuth
- 💬 **Real-time Chat** - Create and join chat rooms for various topics
- 📹 **Video Conferencing** - High-quality video calls using Twilio
- 🏠 **Room Management** - Create, join, and manage chat rooms
- 👥 **Multi-user Support** - Connect with multiple users simultaneously

### Planned Features
- 🎭 **Video Filters** - Interactive masks and stickers for video calls
- 📱 **Mobile Optimization** - Enhanced mobile experience
- 🔊 **Audio-only Mode** - Voice-only communication option
- 📊 **Analytics Dashboard** - Usage statistics and insights

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Twilio account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/videoAndChatApp.git
   cd videoAndChatApp
   ```

2. **Install dependencies**
   ```bash
   cd chatandvideo
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Firebase and Twilio credentials
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | Frontend framework | 18.2+ |
| **Firebase** | Authentication & Database | 9.x |
| **Twilio** | Video communication | Latest |
| **Material-UI** | UI components | 5.x |
| **React Router** | Navigation | 6.x |

## 📁 Project Structure

```
videoAndChatApp/
├── 📱 chatandvideo/          # React application
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── services/         # Firebase & API services
│   │   └── styles/          # CSS and styling
│   └── public/              # Static assets
├── 🏗️ terragrunt/           # Infrastructure as code
│   ├── modules/             # Terraform modules
│   └── environments/       # Environment configurations
├── 📚 docs/                 # Project documentation
└── 🐳 Dockerfile           # Container configuration
```

## 🌐 Deployment

### Live Application
- **Production**: [https://chatpart-18f0f.web.app/](https://chatpart-18f0f.web.app/)
- **Status**: ✅ Active

### Infrastructure
The application is deployed using:
- **Frontend**: Firebase Hosting
- **Backend**: AWS ECS with Fargate
- **Infrastructure**: Terraform with Terragrunt
- **CI/CD**: GitHub Actions

## 📖 Documentation

Our comprehensive documentation is organized for easy navigation:

### 🎯 Getting Started
- **[Project Overview](docs/overview.md)** - Mission, vision, and key features
- **[Development Setup](docs/development/setup.md)** - Complete development environment guide
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project

### 🏗️ Architecture & Design  
- **[High-Level Architecture](docs/architecture/high-level.md)** - System architecture overview
- **[Security Architecture](docs/architecture/security.md)** - Comprehensive security implementation
- **[Component Documentation](docs/architecture/components.md)** - Detailed component guides
- **[Data Flow Diagrams](docs/architecture/data-flow.md)** - How data moves through the system

### 🚀 Deployment & Operations
- **[Infrastructure Guide](terragrunt/README.md)** - Complete infrastructure documentation
- **[Environment Setup](docs/deployment/environments.md)** - Deployment guide and procedures
- **[CI/CD Pipeline](docs/deployment/ci-cd.md)** - Continuous integration and deployment
- **[Monitoring Guide](docs/deployment/monitoring.md)** - Observability and alerting

### 🔧 Development Resources
- **[Coding Standards](docs/development/coding-standards.md)** - Code quality guidelines
- **[Testing Guide](docs/development/testing.md)** - Comprehensive testing strategies
- **[Docker Testing Setup](docs/development/docker-testing.md)** - Containerized testing environment
- **[Debugging Guide](docs/development/debugging.md)** - Troubleshooting and debugging techniques
- **[API Documentation](docs/api/)** - Backend API reference (coming soon)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase team for the excellent real-time database
- Twilio for robust video communication APIs
- Material-UI for beautiful React components
- The React community for continuous innovation

## 📞 Support

- 🐛 [Report Issues](https://github.com/your-username/videoAndChatApp/issues)
- 💬 [Discussions](https://github.com/your-username/videoAndChatApp/discussions)
- 📧 Email: support@videochatapp.com

---

<div align="center">

**[⭐ Star this repo](https://github.com/your-username/videoAndChatApp)** • **[🐛 Report Bug](https://github.com/your-username/videoAndChatApp/issues)** • **[✨ Request Feature](https://github.com/your-username/videoAndChatApp/issues)**

Made with ❤️ by [Your Team](https://github.com/your-username)

</div>
