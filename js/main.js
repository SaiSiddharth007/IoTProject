// Configuration variables
const APP_CONFIG = {
    version: '1.0.0',
    name: 'HydroHero',
    notifications: {
      duration: 3000
    }
  };
  
  const FEATURES = {
    notifications: true
  };
  
  // Main Application Module
  class HydroHeroApp {
    constructor() {
      this.version = APP_CONFIG.version;
      this.init();
    }
  
    init() {
      this.initializeNotifications();
      this.bindGlobalEvents();
      this.initializeServiceWorker();
      this.handleErrors();
    }
  
    initializeNotifications() {
      window.notificationManager = new NotificationManager();
    }
  
    bindGlobalEvents() {
      // Window resize handler
      const handleResize = this.debounce(() => {
        if (window.innerWidth >= 768 && window.navigationManager?.mobileMenuOpen) {
          window.navigationManager.toggleMobileMenu();
        }
      }, 250);
  
      window.addEventListener('resize', handleResize);
  
      // Page visibility change
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
          // Page became visible, refresh data if needed
          this.handlePageVisible();
        }
      });
  
      // Online/offline status
      window.addEventListener('online', () => {
        if (window.notificationManager) {
          window.notificationManager.show('Connection restored', 'success');
        }
      });
  
      window.addEventListener('offline', () => {
        if (window.notificationManager) {
          window.notificationManager.show('Connection lost', 'warning');
        }
      });
    }
  
    handlePageVisible() {
      // Refresh dashboard if it's the current tab
      if (window.navigationManager?.getCurrentTab() === 'dashboard') {
        window.dashboardManager?.refreshDashboard();
      }
    }
  
    initializeServiceWorker() {
      if ('serviceWorker' in navigator && FEATURES.notifications) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(registration => {
              console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
              console.log('SW registration failed: ', registrationError);
            });
        });
      }
    }
  
    handleErrors() {
      // Global error handling
      window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        if (window.notificationManager) {
          window.notificationManager.show('An error occurred. Please try again.', 'error');
        }
      });
  
      // Unhandled promise rejection
      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        if (window.notificationManager) {
          window.notificationManager.show('An error occurred. Please try again.', 'error');
        }
      });
    }
  
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  
    trackEvent(eventName, properties = {}) {
      console.log('Event tracked:', eventName, properties);
      // Implement actual analytics tracking here
    }
  }
  
  // Notification Manager
  class NotificationManager {
    constructor() {
      this.notifications = [];
    }
  
    show(message, type = 'info') {
      const notification = this.createNotification(message, type);
      document.body.appendChild(notification);
      this.notifications.push(notification);
  
      // Animate in
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 100);
  
      // Remove after delay
      setTimeout(() => {
        this.remove(notification);
      }, APP_CONFIG.notifications.duration);
    }
  
    createNotification(message, type) {
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.textContent = message;
  
      Object.assign(notification.style, {
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
      });
  
      // Set background color based on type
      const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
      };
  
      notification.style.backgroundColor = colors[type] || colors.info;
  
      return notification;
    }
  
    remove(notification) {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
        this.notifications = this.notifications.filter(n => n !== notification);
      }, 300);
    }
  
    clear() {
      this.notifications.forEach(notification => this.remove(notification));
    }
  }
  
  // Utility Functions
  function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }
  
  function formatTime(date) {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
  
  // Initialize the application
  document.addEventListener('DOMContentLoaded', () => {
    window.hydroHeroApp = new HydroHeroApp();
    console.log(`${APP_CONFIG.name} v${APP_CONFIG.version} initialized`);
  });
  