// Application Configuration
const APP_CONFIG = {
    name: 'ByteX-HydroHero',
    version: '1.0.0',
    theme: {
      default: 'dark',
      storageKey: 'hydrohero-theme'
    },
    auth: {
      storageKey: 'hydrohero-auth',
      popupKey: 'hydrohero-popup-seen'
    },
    navigation: {
      defaultTab: 'dashboard',
      tabs: ['dashboard', 'schedule', 'analytics', 'settings', 'team', 'about']
    },
    plants: {
      tomato: { 
        name: 'Tomato Plant', 
        recommended: 200, 
        image: 'assets/images/tomato-plant.png' 
      },
      basil: { 
        name: 'Basil Herb', 
        recommended: 150, 
        image: 'assets/images/basil-herb.png' 
      },
      rose: { 
        name: 'Rose Bush', 
        recommended: 300, 
        image: 'assets/images/rose-bush.png' 
      }
    },
    notifications: {
      duration: 3000,
      position: 'top-right'
    },
    api: {
      baseUrl: '/api',
      timeout: 5000
    }
  };
  
  // Feature Flags
  const FEATURES = {
    camera: true,
    wateringSystem: true,
    analytics: true,
    weatherIntegration: false,
    notifications: true
  };
  
  // Default Settings
  const DEFAULT_SETTINGS = {
    temperatureUnit: 'fahrenheit',
    notifications: {
      lowWater: true,
      wateringComplete: true,
      systemUpdates: false
    },
    watering: {
      defaultAmount: 300,
      defaultMode: 'gentle'
    }
  };
  
  // Export configuration for use in other modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APP_CONFIG, FEATURES, DEFAULT_SETTINGS };
  }
  