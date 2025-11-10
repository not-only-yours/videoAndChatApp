# 🧪 Testing Guide

> Comprehensive testing strategy for the Video and Chat Application, covering unit tests, integration tests, and end-to-end testing.

## 🎯 Testing Strategy

Our testing approach follows the testing pyramid principle with emphasis on fast feedback and comprehensive coverage across all application layers.

## 🏗️ Testing Pyramid

```
                    E2E Tests
                   /         \
                  /           \
              Integration Tests
             /                 \
            /                   \
           ----  Unit Tests  ----
```

### Testing Levels

| Level | Purpose | Tools | Coverage Target |
|-------|---------|-------|----------------|
| **Unit** | Component/function testing | Jest, RTL | 80%+ |
| **Integration** | Component interaction | Jest, MSW | 70%+ |
| **E2E** | Complete user workflows | Cypress | Key paths |

## 🔧 Test Setup

### Development Dependencies
```json
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "jest": "^29.5.0",
    "cypress": "^12.17.0",
    "msw": "^1.2.1"
  }
}
```

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Test Setup File
```javascript
// src/setupTests.js
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Mock Firebase
jest.mock('./firebase', () => ({
  db: {},
  auth: {
    currentUser: null,
  },
}));

// Mock Twilio
jest.mock('twilio-video', () => ({
  connect: jest.fn(),
  createLocalTracks: jest.fn(),
}));

// Start MSW server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## 🧪 Unit Testing

### Component Testing
```javascript
// ChatMessage.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatMessage from './ChatMessage';

describe('ChatMessage', () => {
  const mockMessage = {
    id: '1',
    text: 'Hello World',
    author: 'John Doe',
    timestamp: '2025-11-10T10:00:00Z',
  };

  it('renders message content correctly', () => {
    render(<ChatMessage message={mockMessage} />);
    
    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('formats timestamp correctly', () => {
    render(<ChatMessage message={mockMessage} />);
    
    const timestamp = screen.getByText(/10:00/);
    expect(timestamp).toBeInTheDocument();
  });

  it('handles long messages with truncation', () => {
    const longMessage = {
      ...mockMessage,
      text: 'A'.repeat(1000),
    };
    
    render(<ChatMessage message={longMessage} />);
    
    expect(screen.getByText(/A{1,}/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show more/i })).toBeInTheDocument();
  });
});
```

### Custom Hook Testing
```javascript
// useChat.test.js
import { renderHook, act } from '@testing-library/react';
import useChat from './useChat';

describe('useChat', () => {
  it('should initialize with empty messages', () => {
    const { result } = renderHook(() => useChat('room1'));
    
    expect(result.current.messages).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('should send message successfully', async () => {
    const { result } = renderHook(() => useChat('room1'));
    
    await act(async () => {
      await result.current.sendMessage('Hello World');
    });
    
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].text).toBe('Hello World');
  });
});
```

### Service Testing
```javascript
// chatService.test.js
import { sendMessage, getMessages } from './chatService';
import { db } from '../firebase';

jest.mock('../firebase', () => ({
  db: {
    collection: jest.fn(() => ({
      add: jest.fn(),
      where: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          get: jest.fn(),
        })),
      })),
    })),
  },
}));

describe('ChatService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should save message to Firebase', async () => {
      const mockAdd = jest.fn().mockResolvedValue({ id: '123' });
      db.collection().add = mockAdd;

      const message = {
        text: 'Hello',
        roomId: 'room1',
        author: 'John',
      };

      await sendMessage(message);

      expect(mockAdd).toHaveBeenCalledWith({
        ...message,
        timestamp: expect.any(Date),
      });
    });
  });
});
```

## 🔗 Integration Testing

### Component Integration
```javascript
// ChatRoom.integration.test.js
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatRoom from './ChatRoom';
import { AuthProvider } from '../contexts/AuthContext';

const renderChatRoom = (roomId = 'test-room') => {
  return render(
    <AuthProvider>
      <ChatRoom roomId={roomId} />
    </AuthProvider>
  );
};

describe('ChatRoom Integration', () => {
  it('should load and display messages', async () => {
    renderChatRoom();
    
    await waitFor(() => {
      expect(screen.getByText('Welcome to the chat!')).toBeInTheDocument();
    });
  });

  it('should send message and update UI', async () => {
    const user = userEvent.setup();
    renderChatRoom();
    
    const input = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    await user.type(input, 'Hello everyone!');
    await user.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('Hello everyone!')).toBeInTheDocument();
    });
  });
});
```

### API Integration with MSW
```javascript
// mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/rooms/:roomId/messages', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '1',
          text: 'Welcome to the chat!',
          author: 'System',
          timestamp: '2025-11-10T10:00:00Z',
        },
      ])
    );
  }),

  rest.post('/api/rooms/:roomId/messages', (req, res, ctx) => {
    return res(
      ctx.json({
        id: '2',
        ...req.body,
        timestamp: new Date().toISOString(),
      })
    );
  }),
];

// mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

## 🌐 End-to-End Testing

### Cypress Configuration
```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    
    setupNodeEvents(on, config) {
      // Implement node event listeners here
    },
  },
  
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
});
```

### E2E Test Examples
```javascript
// cypress/e2e/chat-functionality.cy.js
describe('Chat Functionality', () => {
  beforeEach(() => {
    // Mock authentication
    cy.window().then((win) => {
      win.localStorage.setItem('auth-token', 'mock-token');
    });
    
    cy.visit('/');
  });

  it('should create and join a chat room', () => {
    cy.get('[data-testid="create-room-button"]').click();
    cy.get('[data-testid="room-name-input"]').type('Test Room');
    cy.get('[data-testid="create-button"]').click();
    
    cy.url().should('include', '/room/');
    cy.contains('Test Room').should('be.visible');
  });

  it('should send and receive messages', () => {
    cy.visit('/room/test-room');
    
    const message = 'Hello from Cypress!';
    cy.get('[data-testid="message-input"]').type(message);
    cy.get('[data-testid="send-button"]').click();
    
    cy.contains(message).should('be.visible');
    cy.get('[data-testid="message-input"]').should('have.value', '');
  });

  it('should start a video call', () => {
    cy.visit('/room/test-room');
    
    cy.get('[data-testid="start-video-button"]').click();
    cy.get('[data-testid="video-container"]').should('be.visible');
    cy.get('[data-testid="local-video"]').should('exist');
  });
});
```

### Visual Testing
```javascript
// cypress/e2e/visual-regression.cy.js
describe('Visual Regression Tests', () => {
  it('should match chat room design', () => {
    cy.visit('/room/test-room');
    cy.get('[data-testid="chat-container"]').should('be.visible');
    
    // Visual comparison
    cy.matchImageSnapshot('chat-room');
  });

  it('should match mobile layout', () => {
    cy.viewport(375, 667);
    cy.visit('/');
    
    cy.matchImageSnapshot('mobile-home');
  });
});
```

## 🚀 Performance Testing

### Lighthouse CI
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm start',
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

### Load Testing with Artillery
```yaml
# load-test.yml
config:
  target: 'https://api.videochat.com'
  phases:
    - duration: 60
      arrivalRate: 10
  variables:
    roomId: 'test-room'
    
scenarios:
  - name: 'Send messages'
    flow:
      - post:
          url: '/api/rooms/{{ roomId }}/messages'
          headers:
            Authorization: 'Bearer {{ $randomString() }}'
          json:
            text: 'Load test message {{ $randomString() }}'
```

## 🔧 Test Utilities

### Test Helpers
```javascript
// test-utils.js
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

export const renderWithProviders = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export const createMockUser = (overrides = {}) => ({
  id: '123',
  displayName: 'Test User',
  email: 'test@example.com',
  photoURL: 'https://example.com/photo.jpg',
  ...overrides,
});

export const createMockMessage = (overrides = {}) => ({
  id: '456',
  text: 'Test message',
  author: 'Test User',
  timestamp: '2025-11-10T10:00:00Z',
  ...overrides,
});
```

### Custom Matchers
```javascript
// custom-matchers.js
expect.extend({
  toBeWithinTimeRange(received, start, end) {
    const receivedTime = new Date(received).getTime();
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    
    const pass = receivedTime >= startTime && receivedTime <= endTime;
    
    return {
      message: () =>
        `expected ${received} to be within ${start} and ${end}`,
      pass,
    };
  },
});
```

## 📊 Test Coverage

### Coverage Configuration
```javascript
// Package.json coverage scripts
{
  "scripts": {
    "test:coverage": "jest --coverage --watchAll=false",
    "test:coverage:ci": "jest --coverage --ci --watchAll=false --passWithNoTests",
    "coverage:open": "open coverage/lcov-report/index.html"
  }
}
```

### Coverage Reporting
```javascript
// jest.config.js - Coverage settings
module.exports = {
  // ...existing config
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
    '!src/**/*.stories.js',
    '!src/**/*.test.js',
  ],
  coverageReporters: ['text', 'lcov', 'html', 'clover'],
  coverageDirectory: 'coverage',
};
```

## 🤖 CI/CD Testing

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build app
        run: npm run build
      
      - name: Run Cypress
        uses: cypress-io/github-action@v5
        with:
          start: npm start
          wait-on: 'http://localhost:3000'
```

## 📝 Testing Best Practices

### Unit Testing
- **Arrange, Act, Assert**: Clear test structure
- **Single Responsibility**: Test one thing at a time
- **Descriptive Names**: Clear test descriptions
- **Mock External Dependencies**: Isolate unit under test

### Integration Testing  
- **Test User Journeys**: Focus on real user flows
- **Mock External Services**: Use MSW for API mocking
- **Test Error Scenarios**: Handle failure cases
- **Performance Aware**: Monitor test execution time

### E2E Testing
- **Critical Path Coverage**: Test most important user flows
- **Data Independence**: Tests should not depend on each other
- **Stable Selectors**: Use data-testid attributes
- **Environment Consistency**: Same environment as production

## 🔍 Debugging Tests

### Jest Debugging
```bash
# Debug specific test
npm test -- --no-coverage ChatMessage.test.js

# Run tests in watch mode
npm test -- --watch

# Update snapshots
npm test -- --updateSnapshot
```

### Cypress Debugging
```bash
# Open Cypress Test Runner
npx cypress open

# Run specific test
npx cypress run --spec "cypress/e2e/chat-functionality.cy.js"

# Debug mode
npx cypress run --headed --no-exit
```

## 📚 Testing Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [MSW Documentation](https://mswjs.io/docs/)

### Testing Patterns
- [Kent C. Dodds Testing Blog](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Trophy](https://testingjavascript.com/)
- [React Testing Examples](https://github.com/testing-library/react-testing-library/tree/main/src/__tests__)

---

<div align="center">

**🧪 Test early, test often** - Good tests lead to confident deployments

</div>
