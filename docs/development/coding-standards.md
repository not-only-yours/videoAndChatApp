# 🎨 Coding Standards

> Comprehensive coding standards and best practices for the Video and Chat Application to ensure consistent, maintainable, and high-quality code.

## 🎯 Code Philosophy

Our coding standards are built around these core principles:
- **Clarity over Cleverness**: Code should be easy to read and understand
- **Consistency**: Uniform coding style across the entire codebase
- **Maintainability**: Code should be easy to modify and extend
- **Performance**: Efficient code that scales with user growth
- **Security**: Secure coding practices throughout

## 📋 General Guidelines

### Code Structure
```javascript
// File organization example
src/
├── components/           // Reusable UI components
│   ├── common/          // Shared components
│   ├── chat/            // Chat-specific components
│   └── video/           // Video-specific components
├── hooks/               // Custom React hooks
├── services/            // API and external services
├── utils/               // Pure utility functions
├── contexts/            // React contexts
├── styles/              // Global styles
└── __tests__/           // Test files
```

### Naming Conventions

#### Files and Directories
```bash
# Components: PascalCase
ChatMessage.js
VideoCall.js
UserProfile.js

# Hooks: camelCase with 'use' prefix
useChat.js
useAuth.js
useVideoCall.js

# Utilities: camelCase
formatDate.js
validateEmail.js
apiClient.js

# Constants: SCREAMING_SNAKE_CASE
API_ENDPOINTS.js
ERROR_MESSAGES.js
CONFIG.js

# Directories: kebab-case
chat-components/
user-management/
video-calling/
```

#### Variables and Functions
```javascript
// Variables: camelCase, descriptive names
const currentUser = getCurrentUser();
const messageHistory = [];
const isVideoCallActive = false;

// Functions: camelCase, verb-noun pattern
const sendMessage = (text) => { /* */ };
const validateUserInput = (input) => { /* */ };
const formatTimestamp = (date) => { /* */ };

// Constants: SCREAMING_SNAKE_CASE
const MAX_MESSAGE_LENGTH = 1000;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_ROOM_SETTINGS = { /* */ };

// Boolean variables: is/has/can/should prefix
const isAuthenticated = true;
const hasPermission = false;
const canSendMessage = true;
const shouldShowNotification = false;
```

## ⚛️ React Standards

### Component Structure
```javascript
// Functional component template
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ChatMessage.css';

/**
 * Displays a single chat message with author and timestamp
 * @param {Object} props - Component props
 * @param {Object} props.message - Message object
 * @param {Function} props.onReply - Callback for message replies
 */
const ChatMessage = ({ message, onReply, className }) => {
  // Hooks at the top
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Effects after state
  useEffect(() => {
    // Side effects here
  }, [message.id]);

  // Event handlers
  const handleReply = () => {
    if (replyText.trim()) {
      onReply(message.id, replyText);
      setReplyText('');
    }
  };

  const handleToggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  // Early returns for conditional rendering
  if (!message) {
    return null;
  }

  // Main render
  return (
    <div className={`chat-message ${className || ''}`}>
      <div className="chat-message__header">
        <span className="chat-message__author">
          {message.author}
        </span>
        <time className="chat-message__timestamp">
          {formatTimestamp(message.timestamp)}
        </time>
      </div>
      
      <div className="chat-message__content">
        {isExpanded ? message.text : truncateText(message.text, 100)}
        {message.text.length > 100 && (
          <button 
            onClick={handleToggleExpand}
            className="chat-message__expand"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      
      {onReply && (
        <div className="chat-message__reply">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply to this message..."
            className="chat-message__reply-input"
          />
          <button onClick={handleReply}>Reply</button>
        </div>
      )}
    </div>
  );
};

// PropTypes for type checking
ChatMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
  onReply: PropTypes.func,
  className: PropTypes.string,
};

// Default props
ChatMessage.defaultProps = {
  onReply: null,
  className: '',
};

export default ChatMessage;
```

### Hooks Standards
```javascript
// Custom hook example
import { useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/chatService';

/**
 * Custom hook for managing chat functionality
 * @param {string} roomId - Chat room identifier
 * @returns {Object} Chat state and actions
 */
const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized functions to prevent unnecessary re-renders
  const sendMessage = useCallback(async (text) => {
    try {
      const newMessage = await chatService.sendMessage(roomId, text);
      setMessages(prev => [...prev, newMessage]);
    } catch (err) {
      setError(err.message);
    }
  }, [roomId]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Effect for loading messages
  useEffect(() => {
    let isCancelled = false;

    const loadMessages = async () => {
      try {
        setLoading(true);
        const roomMessages = await chatService.getMessages(roomId);
        
        if (!isCancelled) {
          setMessages(roomMessages);
          setError(null);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadMessages();

    return () => {
      isCancelled = true;
    };
  }, [roomId]);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearError,
  };
};

export default useChat;
```

### Context Patterns
```javascript
// Context creation and provider
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };

    default:
      return state;
  }
};

// Context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const user = await authService.login(credentials);
      dispatch({ type: AUTH_ACTIONS.LOGIN_SUCCESS, payload: user });
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGIN_FAILURE, payload: error.message });
    }
  };

  const logout = async () => {
    await authService.logout();
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const value = {
    ...state,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
```

## 🎨 CSS Standards

### CSS Architecture
```css
/* BEM methodology */
.chat-message {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--surface-color);
}

.chat-message__header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.chat-message__author {
  font-weight: 600;
  color: var(--primary-color);
}

.chat-message__timestamp {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.chat-message__content {
  line-height: 1.5;
  color: var(--text-primary);
}

.chat-message--highlighted {
  border-left: 4px solid var(--accent-color);
  background-color: var(--surface-highlighted);
}

.chat-message--system {
  font-style: italic;
  opacity: 0.8;
}
```

### CSS Custom Properties
```css
/* Design tokens */
:root {
  /* Colors */
  --primary-color: #1976d2;
  --secondary-color: #dc004e;
  --accent-color: #ff6b6b;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --error-color: #f44336;
  
  /* Text colors */
  --text-primary: #212121;
  --text-secondary: #757575;
  --text-disabled: #bdbdbd;
  
  /* Surface colors */
  --surface-color: #ffffff;
  --surface-variant: #f5f5f5;
  --surface-highlighted: #e3f2fd;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-family-primary: 'Roboto', sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
}
```

### Responsive Design
```css
/* Mobile-first approach */
.chat-container {
  padding: var(--spacing-sm);
}

/* Tablet */
@media (min-width: 768px) {
  .chat-container {
    padding: var(--spacing-md);
    max-width: 600px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .chat-container {
    padding: var(--spacing-lg);
    max-width: 800px;
  }
}

/* Large desktop */
@media (min-width: 1440px) {
  .chat-container {
    max-width: 1200px;
  }
}
```

## 🛠️ JavaScript Standards

### Variable Declarations
```javascript
// Use const by default
const API_ENDPOINT = 'https://api.example.com';
const userPreferences = getUserPreferences();

// Use let when reassignment is needed
let messageCount = 0;
let currentRoom = null;

// Avoid var entirely
// ❌ var userName = 'John';
// ✅ const userName = 'John';
```

### Function Declarations
```javascript
// Arrow functions for callbacks and short functions
const messages = data.map(item => ({
  id: item.id,
  text: item.content,
  timestamp: item.created_at,
}));

// Named functions for main functionality
function validateMessage(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Message text is required and must be a string');
  }
  
  if (text.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message exceeds maximum length of ${MAX_MESSAGE_LENGTH}`);
  }
  
  return text.trim();
}

// Async/await over promises
const fetchUserData = async (userId) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
};
```

### Error Handling
```javascript
// Specific error types
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'NetworkError';
    this.status = status;
  }
}

// Comprehensive error handling
const sendMessage = async (roomId, text) => {
  try {
    // Validate input
    if (!roomId) {
      throw new ValidationError('Room ID is required', 'roomId');
    }
    
    const validatedText = validateMessage(text);
    
    // API call
    const response = await fetch(`/api/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: validatedText }),
    });
    
    if (!response.ok) {
      throw new NetworkError(
        'Failed to send message',
        response.status
      );
    }
    
    return await response.json();
    
  } catch (error) {
    // Log error for debugging
    console.error('Error sending message:', {
      roomId,
      error: error.message,
      stack: error.stack,
    });
    
    // Re-throw for caller to handle
    throw error;
  }
};
```

## 📚 Documentation Standards

### JSDoc Comments
```javascript
/**
 * Manages real-time chat functionality for a specific room
 * @class ChatManager
 * @example
 * const chat = new ChatManager('room-123');
 * await chat.connect();
 * chat.sendMessage('Hello world!');
 */
class ChatManager {
  /**
   * Creates a new ChatManager instance
   * @param {string} roomId - The unique identifier for the chat room
   * @param {Object} [options={}] - Configuration options
   * @param {boolean} [options.autoConnect=true] - Whether to connect automatically
   * @param {number} [options.reconnectAttempts=3] - Number of reconnection attempts
   * @throws {ValidationError} When roomId is invalid
   */
  constructor(roomId, options = {}) {
    // Implementation
  }

  /**
   * Sends a message to the chat room
   * @param {string} text - The message content
   * @param {Object} [metadata={}] - Additional message metadata
   * @returns {Promise<Object>} The sent message object
   * @throws {NetworkError} When sending fails
   * @throws {ValidationError} When message is invalid
   * @example
   * const message = await chat.sendMessage('Hello!', { priority: 'high' });
   * console.log('Message sent:', message.id);
   */
  async sendMessage(text, metadata = {}) {
    // Implementation
  }
}
```

### README Documentation
```markdown
# Component Name

Brief description of what the component does.

## Usage

```javascript
import ComponentName from './ComponentName';

const MyComponent = () => {
  return (
    <ComponentName
      prop1="value1"
      prop2={true}
      onAction={handleAction}
    />
  );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| prop1 | string | - | Required prop description |
| prop2 | boolean | false | Optional prop description |
| onAction | function | - | Callback function description |

## Examples

### Basic Usage
```javascript
<ComponentName prop1="basic example" />
```

### Advanced Usage
```javascript
<ComponentName 
  prop1="advanced"
  prop2={true}
  onAction={(data) => console.log(data)}
/>
```
```

## 🔧 Code Quality Tools

### ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['react', 'react-hooks'],
  rules: {
    // React rules
    'react/prop-types': 'error',
    'react/no-unused-prop-types': 'error',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    
    // General rules
    'no-console': 'warn',
    'no-debugger': 'error',
    'no-unused-vars': 'error',
    'prefer-const': 'error',
    
    // Style rules
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
  },
};
```

### Prettier Configuration
```javascript
// .prettierrc.js
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',
};
```

## 🚀 Performance Standards

### Component Optimization
```javascript
import React, { memo, useMemo, useCallback } from 'react';

// Memoize expensive components
const ChatMessage = memo(({ message, onReply }) => {
  // Memoize expensive calculations
  const formattedTimestamp = useMemo(() => {
    return formatTimestamp(message.timestamp);
  }, [message.timestamp]);

  // Memoize callback functions
  const handleReply = useCallback(() => {
    onReply(message.id);
  }, [message.id, onReply]);

  return (
    <div className="chat-message">
      <span>{message.text}</span>
      <time>{formattedTimestamp}</time>
      <button onClick={handleReply}>Reply</button>
    </div>
  );
});

// Display name for debugging
ChatMessage.displayName = 'ChatMessage';
```

### Bundle Optimization
```javascript
// Lazy loading for code splitting
import { lazy, Suspense } from 'react';

const VideoCall = lazy(() => import('./VideoCall'));
const ChatRoom = lazy(() => import('./ChatRoom'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Router>
      <Routes>
        <Route path="/video" element={<VideoCall />} />
        <Route path="/chat" element={<ChatRoom />} />
      </Routes>
    </Router>
  </Suspense>
);
```

## 📋 Code Review Checklist

### Before Submitting
- [ ] Code follows established patterns
- [ ] No console.log statements in production code
- [ ] PropTypes defined for React components
- [ ] Error handling implemented
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Tests written and passing
- [ ] Documentation updated

### Review Focus Areas
- [ ] **Functionality**: Does the code work as expected?
- [ ] **Readability**: Is the code easy to understand?
- [ ] **Maintainability**: Can the code be easily modified?
- [ ] **Performance**: Are there any performance concerns?
- [ ] **Security**: Are there any security vulnerabilities?
- [ ] **Testing**: Is the code adequately tested?

---

<div align="center">

**🎨 Clean code is not written by following a set of rules. Clean code is written by programmers who care.**

</div>
