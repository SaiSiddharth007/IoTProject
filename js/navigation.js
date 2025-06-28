// Navigation Module
const APP_CONFIG = {
    navigation: {
      defaultTab: 'tab1',
      tabs: ['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6']
    }
  };
  
  class NavigationManager {
    constructor() {
      this.currentTab = APP_CONFIG.navigation.defaultTab;
      this.mobileMenuOpen = false;
      this.init();
    }
  
    init() {
      this.showTab(this.currentTab);
      this.bindEvents();
    }
  
    bindEvents() {
      // Mobile menu events
      document.addEventListener('click', (event) => {
        const sidebar = document.getElementById('sidebar');
        const menuBtn = document.querySelector('.mobile-menu-btn');
  
        if (this.mobileMenuOpen && sidebar && 
            !sidebar.contains(event.target) && 
            !menuBtn.contains(event.target)) {
          this.toggleMobileMenu();
        }
      });
  
      // Keyboard navigation
      document.addEventListener('keydown', (event) => {
        if (event.key >= '1' && event.key <= '6') {
          const tabIndex = parseInt(event.key) - 1;
          if (APP_CONFIG.navigation.tabs[tabIndex]) {
            this.showTab(APP_CONFIG.navigation.tabs[tabIndex]);
          }
        }
      });
  
      // Touch gestures for mobile
      this.initTouchGestures();
    }
  
    showTab(tabName) {
      // Hide all tab contents
      const tabContents = document.querySelectorAll('.tab-content');
      tabContents.forEach(tab => tab.classList.remove('active'));
  
      // Show selected tab
      const selectedTab = document.getElementById(tabName);
      if (selectedTab) {
        selectedTab.classList.add('active');
      }
  
      // Update navigation
      const navItems = document.querySelectorAll('.nav-item');
      navItems.forEach(item => item.classList.remove('active'));
  
      const activeNavItem = document.querySelector(`[onclick="showTab('${tabName}')"]`);
      if (activeNavItem) {
        activeNavItem.classList.add('active');
      }
  
      this.currentTab = tabName;
  
      // Close mobile menu if open
      if (this.mobileMenuOpen) {
        this.toggleMobileMenu();
      }
  
      // Dispatch navigation event
      this.dispatchNavigationChange(tabName);
    }
  
    toggleMobileMenu() {
      const sidebar = document.getElementById('sidebar');
      const hamburger = document.querySelector('.hamburger');
  
      if (sidebar) {
        this.mobileMenuOpen = !this.mobileMenuOpen;
        sidebar.classList.toggle('open', this.mobileMenuOpen);
  
        // Animate hamburger
        if (hamburger) {
          if (this.mobileMenuOpen) {
            hamburger.style.transform = 'rotate(45deg)';
            hamburger.style.background = 'transparent';
          } else {
            hamburger.style.transform = 'rotate(0deg)';
            hamburger.style.background = 'var(--text-primary)';
          }
        }
      }
    }
  
    initTouchGestures() {
      let touchStartX = 0;
      let touchStartY = 0;
  
      document.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
      });
  
      document.addEventListener('touchend', (event) => {
        if (!touchStartX || !touchStartY) return;
  
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
  
        // Swipe right to open sidebar on mobile
        if (deltaX > 50 && Math.abs(deltaY) < 100 && window.innerWidth < 768) {
          if (!this.mobileMenuOpen) {
            this.toggleMobileMenu();
          }
        }
  
        // Swipe left to close sidebar on mobile
        if (deltaX < -50 && Math.abs(deltaY) < 100 && window.innerWidth < 768) {
          if (this.mobileMenuOpen) {
            this.toggleMobileMenu();
          }
        }
  
        touchStartX = 0;
        touchStartY = 0;
      });
    }
  
    dispatchNavigationChange(tabName) {
      const event = new CustomEvent('navigationChanged', {
        detail: { tab: tabName }
      });
      document.dispatchEvent(event);
    }
  
    getCurrentTab() {
      return this.currentTab;
    }
  }
  
  // Global navigation functions
  function showTab(tabName) {
    window.navigationManager.showTab(tabName);
  }
  
  function toggleMobileMenu() {
    window.navigationManager.toggleMobileMenu();
  }
  
  // Initialize navigation manager
  document.addEventListener('DOMContentLoaded', () => {
    window.navigationManager = new NavigationManager();
  });
  