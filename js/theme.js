// Theme Management Module
const APP_CONFIG = {
    theme: {
      storageKey: 'userTheme',
      default: 'dark'
    }
  };
  
  class ThemeManager {
    constructor() {
      this.currentTheme = 'dark';
      this.init();
    }
  
    init() {
      const savedTheme = localStorage.getItem(APP_CONFIG.theme.storageKey) || APP_CONFIG.theme.default;
      this.setTheme(savedTheme);
      this.bindEvents();
    }
  
    bindEvents() {
      // Keyboard shortcut for theme toggle (Ctrl/Cmd + K)
      document.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
          event.preventDefault();
          this.toggleTheme();
        }
      });
  
      // Listen for system theme changes
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
          if (!localStorage.getItem(APP_CONFIG.theme.storageKey)) {
            this.setTheme(e.matches ? 'dark' : 'light');
          }
        });
      }
    }
  
    toggleTheme() {
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
    }
  
    setTheme(theme) {
      this.currentTheme = theme;
      document.body.className = theme === 'dark' ? 'dark-theme' : '';
      localStorage.setItem(APP_CONFIG.theme.storageKey, theme);
      this.updateThemeIcon();
      this.dispatchThemeChange();
    }
  
    updateThemeIcon() {
      const themeIcon = document.querySelector('.theme-icon');
      if (themeIcon) {
        themeIcon.textContent = this.currentTheme === 'dark' ? '🌙' : '☀️';
      }
    }
  
    dispatchThemeChange() {
      const event = new CustomEvent('themeChanged', {
        detail: { theme: this.currentTheme }
      });
      document.dispatchEvent(event);
    }
  
    getTheme() {
      return this.currentTheme;
    }
  }
  
  // Global theme functions for backward compatibility
  function toggleTheme() {
    window.themeManager.toggleTheme();
  }
  
  function setTheme(theme) {
    window.themeManager.setTheme(theme);
  }
  
  // Initialize theme manager
  document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
  });
  