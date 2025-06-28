// Authentication Module
const APP_CONFIG = {
    auth: {
      storageKey: 'isAuthenticated',
      popupKey: 'hasSeenPopup'
    }
  };
  
  class AuthManager {
    constructor() {
      this.isAuthenticated = false;
      this.authMode = 'login';
      this.init();
    }
  
    init() {
      this.checkAuthStatus();
      this.initializePopup();
      this.bindEvents();
    }
  
    checkAuthStatus() {
      const authData = localStorage.getItem(APP_CONFIG.auth.storageKey);
      this.isAuthenticated = authData ? JSON.parse(authData) : false;
    }
  
    initializePopup() {
      const hasSeenPopup = localStorage.getItem(APP_CONFIG.auth.popupKey);
      if (!hasSeenPopup && !this.isAuthenticated) {
        this.showInitialAuthPopup();
      } else {
        this.closeAuthPopup();
      }
    }
  
    bindEvents() {
      // Close modals on escape key
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.closeAuthModal();
          this.closeAuthPopup();
        }
      });
  
      // Close modal when clicking outside
      document.addEventListener('click', (event) => {
        const modal = document.getElementById('authModal');
        if (modal && event.target === modal) {
          this.closeAuthModal();
        }
      });
    }
  
    showInitialAuthPopup() {
      const popup = document.getElementById('authPopup');
      if (popup) {
        popup.classList.remove('hidden');
      }
    }
  
    closeAuthPopup() {
      const popup = document.getElementById('authPopup');
      if (popup) {
        popup.classList.add('hidden');
        localStorage.setItem(APP_CONFIG.auth.popupKey, 'true');
      }
    }
  
    showAuthModal(mode = 'login') {
      this.authMode = mode;
      const modal = document.getElementById('authModal');
      if (modal) {
        modal.classList.remove('hidden');
        this.closeAuthPopup();
        this.updateModalContent();
      }
    }
  
    closeAuthModal() {
      const modal = document.getElementById('authModal');
      if (modal) {
        modal.classList.add('hidden');
      }
    }
  
    updateModalContent() {
      const elements = {
        title: document.getElementById('authTitle'),
        subtitle: document.getElementById('authSubtitle'),
        nameField: document.getElementById('nameField'),
        confirmPasswordField: document.getElementById('confirmPasswordField'),
        submitBtn: document.getElementById('authSubmit'),
        switchBtn: document.getElementById('authSwitchBtn')
      };
  
      if (this.authMode === 'signup') {
        elements.title.textContent = 'Create Account';
        elements.subtitle.textContent = 'Join ByteX-HydroHero to get started';
        elements.nameField.classList.remove('hidden');
        elements.confirmPasswordField.classList.remove('hidden');
        elements.submitBtn.textContent = 'Create Account';
        elements.switchBtn.textContent = 'Already have an account? Sign in';
      } else {
        elements.title.textContent = 'Welcome Back';
        elements.subtitle.textContent = 'Sign in to access plant analysis features';
        elements.nameField.classList.add('hidden');
        elements.confirmPasswordField.classList.add('hidden');
        elements.submitBtn.textContent = 'Sign In';
        elements.switchBtn.textContent = "Don't have an account? Sign up";
      }
    }
  
    switchAuthMode() {
      const newMode = this.authMode === 'login' ? 'signup' : 'login';
      this.showAuthModal(newMode);
    }
  
    async handleAuth(event) {
      event.preventDefault();
      const submitBtn = document.getElementById('authSubmit');
      const originalText = submitBtn.textContent;
  
      // Show loading state
      submitBtn.innerHTML = `<span class="spinner"></span> ${this.authMode === 'login' ? 'Signing In...' : 'Creating Account...'}`;
      submitBtn.disabled = true;
  
      try {
        // Simulate API call
        await this.simulateAuthRequest();
        
        this.isAuthenticated = true;
        localStorage.setItem(APP_CONFIG.auth.storageKey, 'true');
        this.closeAuthModal();
        
        if (window.notificationManager) {
          window.notificationManager.show('Authentication successful!', 'success');
        }
      } catch (error) {
        if (window.notificationManager) {
          window.notificationManager.show('Authentication failed. Please try again.', 'error');
        }
      } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    }
  
    simulateAuthRequest() {
      return new Promise((resolve) => {
        setTimeout(resolve, 1500);
      });
    }
  
    togglePassword() {
      const passwordInput = document.querySelector('input[name="password"]');
      const toggleBtn = document.querySelector('.password-toggle');
  
      if (passwordInput && toggleBtn) {
        if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          toggleBtn.textContent = '🙈';
        } else {
          passwordInput.type = 'password';
          toggleBtn.textContent = '👁️';
        }
      }
    }
  }
  
  // Global auth functions
  function showAuthModal(mode) {
    window.authManager.showAuthModal(mode);
  }
  
  function closeAuthModal() {
    window.authManager.closeAuthModal();
  }
  
  function closeAuthPopup() {
    window.authManager.closeAuthPopup();
  }
  
  function switchAuthMode() {
    window.authManager.switchAuthMode();
  }
  
  function handleAuth(event) {
    window.authManager.handleAuth(event);
  }
  
  function togglePassword() {
    window.authManager.togglePassword();
  }
  
  // Initialize auth manager
  document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
  });
  