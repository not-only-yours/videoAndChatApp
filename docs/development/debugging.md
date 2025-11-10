# 🐞 Debugging Guide

> Comprehensive debugging strategies and tools for troubleshooting issues in the Video and Chat Application during development and production.

## 🎯 Debugging Philosophy

Effective debugging is a systematic approach to identifying, isolating, and resolving issues. Our debugging strategy emphasizes:

- **Systematic Investigation**: Follow a structured approach
- **Logging and Monitoring**: Comprehensive observability
- **Reproducible Steps**: Document how to recreate issues
- **Root Cause Analysis**: Address underlying problems, not just symptoms

## 🔍 Debugging Tools

### Browser Developer Tools

#### Console Debugging
```javascript
// Structured logging
const logger = {
  debug: (message, data) => console.debug('🐛 DEBUG:', message, data),
  info: (message, data) => console.info('ℹ️ INFO:', message, data),
  warn: (message, data) => console.warn('⚠️ WARN:', message, data),
  error: (message, data) => console.error('❌ ERROR:', message, data),
};

// Usage in components
const ChatRoom = ({ roomId }) => {
  logger.info('ChatRoom component mounted', { roomId });
  
  useEffect(() => {
    logger.debug('Loading messages for room', { roomId });
    
    loadMessages(roomId)
      .then(messages => {
        logger.info('Messages loaded successfully', { 
          roomId, 
          count: messages.length 
        });
      })
      .catch(error => {
        logger.error('Failed to load messages', { 
          roomId, 
          error: error.message,
          stack: error.stack 
        });
      });
  }, [roomId]);
};
```

#### Network Debugging
```javascript
// API call debugging wrapper
const debugApiCall = async (url, options = {}) => {
  const startTime = performance.now();
  
  logger.debug('API Request started', {
    url,
    method: options.method || 'GET',
    headers: options.headers,
    timestamp: new Date().toISOString(),
  });
  
  try {
    const response = await fetch(url, options);
    const endTime = performance.now();
    
    logger.info('API Response received', {
      url,
      status: response.status,
      statusText: response.statusText,
      duration: `${(endTime - startTime).toFixed(2)}ms`,
      headers: Object.fromEntries(response.headers.entries()),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    const endTime = performance.now();
    
    logger.error('API Request failed', {
      url,
      error: error.message,
      duration: `${(endTime - startTime).toFixed(2)}ms`,
    });
    
    throw error;
  }
};
```

### React Developer Tools

#### Component Debugging
```javascript
// Debug component props and state
const ChatMessage = ({ message, onReply }) => {
  // Debug hook for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      logger.debug('ChatMessage render', {
        messageId: message?.id,
        messageLength: message?.text?.length,
        hasReplyHandler: !!onReply,
      });
    }
  });

  return (
    <div className="chat-message">
      {/* Component JSX */}
    </div>
  );
};

// Custom debug hook
const useDebugValue = (value, format) => {
  if (process.env.NODE_ENV === 'development') {
    React.useDebugValue(value, format);
  }
};

// Usage in custom hooks
const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  
  // Debug hook state
  useDebugValue(
    { roomId, messageCount: messages.length },
    ({ roomId, messageCount }) => `Room ${roomId}: ${messageCount} messages`
  );
  
  return { messages, sendMessage };
};
```

### Redux DevTools (if using Redux)
```javascript
// Store configuration with debugging
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(
      // Add logging middleware in development
      process.env.NODE_ENV === 'development' ? logger : []
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

// Action debugging
const debugAction = (action) => {
  logger.debug('Redux Action Dispatched', {
    type: action.type,
    payload: action.payload,
    timestamp: new Date().toISOString(),
  });
};
```

## 🐛 Common Issues and Solutions

### React Component Issues

#### Issue: Component Not Re-rendering
```javascript
// Problem: Component not updating when data changes
const ChatMessage = ({ message }) => {
  // ❌ Object comparison doesn't trigger re-render
  useEffect(() => {
    updateMessage(message);
  }, [message]); // Shallow comparison
  
  return <div>{message.text}</div>;
};

// Solution: Proper dependency management
const ChatMessage = ({ message }) => {
  // ✅ Use specific properties or custom comparison
  useEffect(() => {
    updateMessage(message);
  }, [message.id, message.text, message.timestamp]);
  
  // Or use useMemo for complex objects
  const messageHash = useMemo(() => {
    return JSON.stringify(message);
  }, [message]);
  
  useEffect(() => {
    updateMessage(message);
  }, [messageHash]);
};
```

#### Issue: Memory Leaks
```javascript
// Problem: Subscriptions not cleaned up
const ChatRoom = ({ roomId }) => {
  useEffect(() => {
    // ❌ Missing cleanup
    const subscription = chatService.subscribe(roomId, handleMessage);
  }, [roomId]);
};

// Solution: Proper cleanup
const ChatRoom = ({ roomId }) => {
  useEffect(() => {
    let isActive = true;
    
    const subscription = chatService.subscribe(roomId, (message) => {
      if (isActive) {
        handleMessage(message);
      }
    });
    
    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, [roomId]);
};
```

#### Issue: Infinite Re-renders
```javascript
// Problem: Object created in render
const ChatContainer = ({ users }) => {
  // ❌ New object on every render
  const userSettings = { users, sortBy: 'name' };
  
  useEffect(() => {
    processUsers(userSettings);
  }, [userSettings]); // Triggers on every render
};

// Solution: Stable references
const ChatContainer = ({ users }) => {
  // ✅ Memoized object
  const userSettings = useMemo(() => {
    return { users, sortBy: 'name' };
  }, [users]);
  
  useEffect(() => {
    processUsers(userSettings);
  }, [userSettings]);
};
```

### Firebase/Firestore Issues

#### Issue: Firestore Permission Denied
```javascript
// Debug Firestore rules
const debugFirestoreAccess = async (path, operation) => {
  try {
    logger.debug('Firestore operation attempted', {
      path,
      operation,
      user: auth.currentUser?.uid,
      timestamp: new Date().toISOString(),
    });
    
    const result = await operation();
    
    logger.info('Firestore operation successful', {
      path,
      result: result?.id || 'success',
    });
    
    return result;
  } catch (error) {
    logger.error('Firestore operation failed', {
      path,
      error: error.message,
      code: error.code,
      user: auth.currentUser?.uid,
    });
    
    throw error;
  }
};

// Usage
const sendMessage = async (roomId, text) => {
  return debugFirestoreAccess(
    `rooms/${roomId}/messages`,
    () => db.collection('rooms').doc(roomId).collection('messages').add({
      text,
      author: auth.currentUser.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
  );
};
```

#### Issue: Real-time Updates Not Working
```javascript
// Debug real-time listeners
const useFirestoreCollection = (path, query) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    logger.debug('Setting up Firestore listener', { path, query });
    
    let ref = db.collection(path);
    
    if (query) {
      Object.entries(query).forEach(([field, value]) => {
        ref = ref.where(field, '==', value);
      });
    }
    
    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        logger.info('Firestore snapshot received', {
          path,
          docCount: snapshot.docs.length,
          changes: snapshot.docChanges().length,
        });
        
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setData(docs);
        setLoading(false);
        setError(null);
      },
      (error) => {
        logger.error('Firestore listener error', {
          path,
          error: error.message,
          code: error.code,
        });
        
        setError(error);
        setLoading(false);
      }
    );
    
    return () => {
      logger.debug('Cleaning up Firestore listener', { path });
      unsubscribe();
    };
  }, [path, JSON.stringify(query)]);
  
  return { data, loading, error };
};
```

### Twilio Video Issues

#### Issue: Video Call Connection Problems
```javascript
// Debug Twilio connection
const debugTwilioConnection = async (roomName, token) => {
  logger.debug('Connecting to Twilio room', {
    roomName,
    tokenLength: token?.length,
    timestamp: new Date().toISOString(),
  });
  
  try {
    const room = await Video.connect(token, {
      name: roomName,
      audio: true,
      video: { width: 640, height: 480 },
    });
    
    logger.info('Twilio connection successful', {
      roomName,
      roomSid: room.sid,
      participantCount: room.participants.size,
      localParticipant: room.localParticipant.identity,
    });
    
    // Debug room events
    room.on('participantConnected', (participant) => {
      logger.info('Participant connected', {
        roomName,
        participantId: participant.identity,
        participantSid: participant.sid,
      });
    });
    
    room.on('participantDisconnected', (participant) => {
      logger.info('Participant disconnected', {
        roomName,
        participantId: participant.identity,
        reason: 'Participant left',
      });
    });
    
    room.on('disconnected', (room, error) => {
      if (error) {
        logger.error('Twilio room disconnected with error', {
          roomName,
          error: error.message,
          code: error.code,
        });
      } else {
        logger.info('Twilio room disconnected normally', { roomName });
      }
    });
    
    return room;
    
  } catch (error) {
    logger.error('Twilio connection failed', {
      roomName,
      error: error.message,
      code: error.code,
    });
    
    throw error;
  }
};
```

## 🐳 Docker Compose Testing

### Local Testing Environment
```bash
# Start complete testing environment
docker-compose -f docker-compose.test.yml up --build

# Run specific test services
docker-compose -f docker-compose.test.yml up test-runner
docker-compose -f docker-compose.test.yml up cypress
docker-compose -f docker-compose.test.yml up lighthouse
```

### Container Debugging
```bash
# Debug inside running container
docker-compose -f docker-compose.test.yml exec app sh

# View container logs
docker-compose -f docker-compose.test.yml logs -f app

# Debug specific test failures
docker-compose -f docker-compose.test.yml run --rm test-runner npm test -- --verbose

# Interactive Cypress debugging
docker-compose -f docker-compose.test.yml run --rm cypress cypress open
```

### Firebase Emulator Debugging
```javascript
// Connect to Firebase emulators in Docker
const firebase = require('firebase/app');

// Use Docker container networking
const firebaseConfig = {
  apiKey: 'demo-key',
  authDomain: 'demo-videochat.firebaseapp.com',
  projectId: 'demo-videochat',
  databaseURL: 'http://firebase:9199',  // Docker service name
  functionsEmulator: 'http://firebase:5001',
};

// Enable emulator connections
if (process.env.NODE_ENV === 'development') {
  firebase.auth().useEmulator('http://firebase:9099');
  firebase.firestore().useEmulator('firebase', 8080);
}
```

### Performance Debugging in Containers
```bash
# Monitor container resource usage
docker stats

# Run performance tests
docker-compose -f docker-compose.test.yml run lighthouse

# Profile memory usage in container
docker-compose -f docker-compose.test.yml exec app node --inspect=0.0.0.0:9229 src/index.js
```

### Test Environment Isolation
```javascript
// Test environment detection
const isDockerTest = process.env.DOCKER_TEST === 'true';
const isCI = process.env.CI === 'true';

if (isDockerTest) {
  // Use container-specific configurations
  global.testTimeout = 30000; // Longer timeout for containers
  
  // Use container networking
  const API_BASE_URL = 'http://mock-api:3001';
}
```

## 🔧 Performance Debugging

### React Performance Issues

#### Profiling Components
```javascript
// Performance monitoring
const withPerformanceMonitoring = (Component) => {
  return function MonitoredComponent(props) {
    const renderStart = useRef();
    const [renderTime, setRenderTime] = useState(0);
    
    // Measure render time
    renderStart.current = performance.now();
    
    useLayoutEffect(() => {
      const renderEnd = performance.now();
      const duration = renderEnd - renderStart.current;
      setRenderTime(duration);
      
      if (duration > 16.67) { // 60fps = 16.67ms per frame
        logger.warn('Slow render detected', {
          component: Component.name,
          duration: `${duration.toFixed(2)}ms`,
          props: Object.keys(props),
        });
      }
    });
    
    return (
      <>
        <Component {...props} />
        {process.env.NODE_ENV === 'development' && (
          <div style={{ fontSize: '10px', color: 'gray' }}>
            Render: {renderTime.toFixed(2)}ms
          </div>
        )}
      </>
    );
  };
};

// Usage
const MonitoredChatMessage = withPerformanceMonitoring(ChatMessage);
```

#### Bundle Analysis
```javascript
// Webpack Bundle Analyzer (already configured in Create React App)
// Run: npm run build && npx webpack-bundle-analyzer build/static/js/*.js

// Dynamic import analysis
const analyzeImport = (componentName) => {
  logger.debug('Dynamic import started', { component: componentName });
  
  return import(/* webpackChunkName: "[request]" */ `./components/${componentName}`)
    .then(module => {
      logger.info('Dynamic import completed', { 
        component: componentName,
        exports: Object.keys(module),
      });
      return module;
    })
    .catch(error => {
      logger.error('Dynamic import failed', {
        component: componentName,
        error: error.message,
      });
      throw error;
    });
};
```

### Memory Debugging
```javascript
// Memory usage monitoring
const useMemoryMonitoring = () => {
  useEffect(() => {
    if (!performance.memory) {
      logger.warn('Performance memory API not available');
      return;
    }
    
    const logMemoryUsage = () => {
      const memory = performance.memory;
      const usage = {
        used: `${Math.round(memory.usedJSHeapSize / 1048576)}MB`,
        total: `${Math.round(memory.totalJSHeapSize / 1048576)}MB`,
        limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`,
      };
      
      logger.debug('Memory usage', usage);
      
      // Warn if memory usage is high
      if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.8) {
        logger.warn('High memory usage detected', usage);
      }
    };
    
    const interval = setInterval(logMemoryUsage, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
};
```

## 🌐 Network Debugging

### API Call Debugging
```javascript
// Request/Response interceptor
const apiDebugger = {
  request: (config) => {
    logger.debug('API Request', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
      timestamp: new Date().toISOString(),
    });
    return config;
  },
  
  response: (response) => {
    logger.info('API Response', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      duration: response.config.metadata?.duration,
    });
    return response;
  },
  
  error: (error) => {
    logger.error('API Error', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
};

// Apply to axios instance
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

apiClient.interceptors.request.use(apiDebugger.request);
apiClient.interceptors.response.use(apiDebugger.response, apiDebugger.error);
```

### WebSocket Debugging
```javascript
// WebSocket connection debugging
class DebugWebSocket extends WebSocket {
  constructor(url, protocols) {
    super(url, protocols);
    
    this.addEventListener('open', (event) => {
      logger.info('WebSocket connected', {
        url,
        protocols,
        readyState: this.readyState,
      });
    });
    
    this.addEventListener('message', (event) => {
      logger.debug('WebSocket message received', {
        data: event.data,
        timestamp: new Date().toISOString(),
      });
    });
    
    this.addEventListener('error', (event) => {
      logger.error('WebSocket error', {
        url,
        error: event,
      });
    });
    
    this.addEventListener('close', (event) => {
      logger.info('WebSocket closed', {
        url,
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
    });
  }
  
  send(data) {
    logger.debug('WebSocket message sent', {
      data,
      timestamp: new Date().toISOString(),
    });
    super.send(data);
  }
}
```

## 🔍 Production Debugging

### Error Boundary
```javascript
// Enhanced error boundary with logging
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    logger.error('React Error Boundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });
    
    // Send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
    
    this.setState({
      error,
      errorInfo,
    });
  }
  
  reportError = async (error, errorInfo) => {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (reportingError) {
      logger.error('Failed to report error', reportingError);
    }
  };
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong!</h2>
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>Error Details</summary>
              <pre>{this.state.error && this.state.error.toString()}</pre>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### Global Error Handling
```javascript
// Global error handlers
window.addEventListener('error', (event) => {
  logger.error('Global JavaScript error', {
    message: event.message,
    filename: event.filename,
    line: event.lineno,
    column: event.colno,
    error: event.error?.stack,
    timestamp: new Date().toISOString(),
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled Promise rejection', {
    reason: event.reason,
    promise: event.promise,
    timestamp: new Date().toISOString(),
  });
});
```

## 🛠️ Debugging Workflow

### Systematic Debugging Process

1. **Reproduce the Issue**
   ```javascript
   // Document reproduction steps
   const bugReport = {
     title: 'Chat messages not displaying',
     steps: [
       '1. Login with Google account',
       '2. Join room "test-room"',
       '3. Send a message',
       '4. Message does not appear in chat',
     ],
     expected: 'Message should appear immediately',
     actual: 'Message does not display',
     environment: {
       browser: 'Chrome 119',
       os: 'macOS 14',
       url: 'https://videochat.com/room/test-room',
     },
   };
   ```

2. **Isolate the Problem**
   ```javascript
   // Add debugging points
   const sendMessage = async (text) => {
     logger.debug('Step 1: Validating message', { text });
     
     const validatedText = validateMessage(text);
     logger.debug('Step 2: Message validated', { validatedText });
     
     try {
       logger.debug('Step 3: Sending to API');
       const response = await api.sendMessage(roomId, validatedText);
       logger.debug('Step 4: API response received', { response });
       
       logger.debug('Step 5: Updating local state');
       setMessages(prev => [...prev, response.message]);
       logger.debug('Step 6: State updated successfully');
       
     } catch (error) {
       logger.error('Error in sendMessage', { error, step: 'API call' });
       throw error;
     }
   };
   ```

3. **Verify the Fix**
   ```javascript
   // Test the fix
   const testMessageSending = async () => {
     const testMessage = 'Test message for debugging';
     
     logger.info('Testing message sending fix');
     
     try {
       await sendMessage(testMessage);
       logger.info('✅ Message sending test passed');
     } catch (error) {
       logger.error('❌ Message sending test failed', { error });
     }
   };
   ```

## 📚 Debugging Resources

### Useful Browser Extensions
- **React Developer Tools**: Component inspection and profiling
- **Redux DevTools**: State management debugging
- **Lighthouse**: Performance and accessibility auditing
- **Web Vitals**: Core web vitals monitoring

### External Debugging Tools
- **Sentry**: Error tracking and performance monitoring
- **LogRocket**: Session replay and debugging
- **Chrome DevTools Protocol**: Advanced debugging
- **React Query DevTools**: API call debugging

### Documentation and Guides
- [React Debugging Guide](https://react.dev/learn/react-developer-tools)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [Firefox Developer Tools](https://developer.mozilla.org/en-US/docs/Tools)
- [Performance Debugging](https://web.dev/debug-performance-in-the-field/)

---

<div align="center">

**🐞 Debugging is like being the detective in a crime movie where you are also the murderer** - But with good tools and strategies, you'll solve the case!

</div>
