// Dashboard Module
const APP_CONFIG = {
    plants: {
      tomato: { name: 'Tomato Plant' },
      basil: { name: 'Basil Herb' },
      rose: { name: 'Rose Bush' }
    }
  };
  
  class DashboardManager {
    constructor() {
      this.plants = APP_CONFIG.plants;
      this.init();
    }
  
    init() {
      this.bindEvents();
      this.initializeInteractions();
    }
  
    bindEvents() {
      // Listen for navigation changes
      document.addEventListener('navigationChanged', (event) => {
        if (event.detail.tab === 'dashboard') {
          this.refreshDashboard();
        }
      });
    }
  
    initializeInteractions() {
      this.initializeProgressBars();
      this.bindPlantActions();
    }
  
    initializeProgressBars() {
      const progressBars = document.querySelectorAll('.progress-fill');
      progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = width;
        }, 500);
      });
    }
  
    bindPlantActions() {
      // Water plant buttons
      document.addEventListener('click', (event) => {
        if (event.target.textContent.includes('Water Now')) {
          const plantCard = event.target.closest('.plant-card');
          if (plantCard) {
            const plantName = plantCard.querySelector('h3').textContent;
            this.waterPlant(plantName);
          }
        }
      });
    }
  
    waterPlant(plantName) {
      if (window.notificationManager) {
        window.notificationManager.show(`Watering ${plantName}...`, 'info');
      }
  
      // Simulate watering process
      setTimeout(() => {
        if (window.notificationManager) {
          window.notificationManager.show(`${plantName} has been watered successfully!`, 'success');
        }
        this.updatePlantStatus(plantName, 'watered');
      }, 2000);
    }
  
    updatePlantStatus(plantName, status) {
      const plantCards = document.querySelectorAll('.plant-card');
      plantCards.forEach(card => {
        const nameElement = card.querySelector('h3');
        if (nameElement && nameElement.textContent === plantName) {
          const statusBadge = card.querySelector('.status-badge');
          const waterLevel = card.querySelector('.water-level');
  
          if (status === 'watered') {
            statusBadge.textContent = 'Healthy';
            statusBadge.className = 'status-badge status-healthy';
            waterLevel.textContent = '💧 High';
            waterLevel.className = 'water-level water-high';
          }
        }
      });
    }
  
    refreshData() {
      if (window.notificationManager) {
        window.notificationManager.show('Refreshing data...', 'info');
      }
  
      // Simulate data refresh
      setTimeout(() => {
        if (window.notificationManager) {
          window.notificationManager.show('Data refreshed successfully!', 'success');
        }
        this.updateDashboardStats();
      }, 1500);
    }
  
    updateDashboardStats() {
      const statValues = document.querySelectorAll('.stat-value');
      statValues.forEach(stat => {
        const currentValue = parseInt(stat.textContent);
        const newValue = currentValue + Math.floor(Math.random() * 3) - 1;
        stat.textContent = Math.max(0, newValue);
      });
    }
  
    refreshDashboard() {
      // Refresh dashboard content when tab becomes active
      this.initializeProgressBars();
    }
  
    exportData() {
      const data = {
        plants: Object.keys(this.plants).map(key => this.plants[key].name),
        schedules: [
          { time: '07:00', plant: 'Tomato Plant', amount: '200ml' },
          { time: '08:30', plant: 'Basil Herb', amount: '150ml' },
          { time: '19:00', plant: 'Rose Bush', amount: '300ml' }
        ],
        settings: {
          temperatureUnit: 'fahrenheit',
          notifications: true
        }
      };
  
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = 'hydrohero-data.json';
      link.click();
  
      URL.revokeObjectURL(url);
      
      if (window.notificationManager) {
        window.notificationManager.show('Data exported successfully!', 'success');
      }
    }
  }
  
  // Global dashboard functions
  function waterPlant(plantName) {
    window.dashboardManager.waterPlant(plantName);
  }
  
  function refreshData() {
    window.dashboardManager.refreshData();
  }
  
  function exportData() {
    window.dashboardManager.exportData();
  }
  
  // Initialize dashboard manager
  document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
  });
  