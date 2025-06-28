// Water Control Module
class WaterController {
    constructor() {
      this.selectedPlants = new Set()
      this.waterAmount = 300
      this.wateringMode = "gentle"
      this.isWatering = false
      this.wateringProgress = 0
      this.init()
    }
  
    init() {
      this.bindEvents()
      this.updateSummary()
    }
  
    bindEvents() {
      // Plant selection events
      document.addEventListener("change", (event) => {
        if (
          event.target.type === "checkbox" &&
          event.target.id !== "scheduleRepeat" &&
          event.target.id !== "weatherCheck"
        ) {
          this.handlePlantSelection(event)
        }
      })
  
      // Mode selection events
      document.addEventListener("change", (event) => {
        if (event.target.name === "mode") {
          this.wateringMode = event.target.value
          this.updateSummary()
        }
      })
    }
  
    handlePlantSelection(event) {
      const plantId = event.target.id
      const plantCard = event.target.closest(".water-plant-card")
  
      if (event.target.checked) {
        this.selectedPlants.add(plantId)
        plantCard.classList.add("selected")
      } else {
        this.selectedPlants.delete(plantId)
        plantCard.classList.remove("selected")
      }
  
      this.updateSummary()
      this.updateStartButton()
    }
  
    togglePlant(plantId) {
      const checkbox = document.getElementById(plantId)
      if (checkbox) {
        checkbox.checked = !checkbox.checked
        checkbox.dispatchEvent(new Event("change"))
      }
    }
  
    setAmount(amount) {
      this.waterAmount = amount
      document.getElementById("customAmount").value = amount
  
      // Update preset button states
      document.querySelectorAll(".preset-btn").forEach((btn) => {
        btn.classList.remove("active")
      })
  
      event.target.classList.add("active")
      this.updateSummary()
    }
  
    updateAmount() {
      const customAmount = document.getElementById("customAmount").value
      this.waterAmount = Number.parseInt(customAmount) || 300
  
      // Remove active state from preset buttons
      document.querySelectorAll(".preset-btn").forEach((btn) => {
        btn.classList.remove("active")
      })
  
      this.updateSummary()
    }
  
    updateSummary() {
      const summaryElement = document.getElementById("wateringSummary")
  
      if (this.selectedPlants.size === 0) {
        summaryElement.innerHTML = "<p>Select plants to see watering summary</p>"
        return
      }
  
      const plantData = {
        tomato: { name: "Tomato Plant", recommended: 200 },
        basil: { name: "Basil Herb", recommended: 150 },
        rose: { name: "Rose Bush", recommended: 300 },
      }
  
      let summaryHTML = ""
      let totalAmount = 0
  
      this.selectedPlants.forEach((plantId) => {
        const plant = plantData[plantId]
        if (plant) {
          summaryHTML += `
            <div class="summary-item">
              <span>${plant.name}</span>
              <span>${this.waterAmount}ml</span>
            </div>
          `
          totalAmount += this.waterAmount
        }
      })
  
      summaryHTML += `
        <div class="summary-item summary-total">
          <span>Total Water</span>
          <span>${totalAmount}ml</span>
        </div>
        <div class="summary-item">
          <span>Mode</span>
          <span>${this.wateringMode.charAt(0).toUpperCase() + this.wateringMode.slice(1)}</span>
        </div>
      `
  
      summaryElement.innerHTML = summaryHTML
    }
  
    updateStartButton() {
      const startBtn = document.getElementById("startWateringBtn")
      startBtn.disabled = this.selectedPlants.size === 0
    }
  
    async startWatering() {
      if (this.selectedPlants.size === 0 || this.isWatering) {
        return
      }
  
      this.isWatering = true
      this.showWateringModal()
  
      try {
        await this.executeWatering()
        this.showNotification("Watering completed successfully!", "success")
      } catch (error) {
        this.showNotification("Watering failed. Please try again.", "error")
      } finally {
        this.isWatering = false
        this.hideWateringModal()
      }
    }
  
    async executeWatering() {
      const plants = Array.from(this.selectedPlants)
      const totalSteps = plants.length * 100
      let currentStep = 0
  
      for (const plantId of plants) {
        const plantData = {
          tomato: "Tomato Plant",
          basil: "Basil Herb",
          rose: "Rose Bush",
        }
  
        const plantName = plantData[plantId]
        this.updateProgress((currentStep / totalSteps) * 100, `Watering ${plantName}`, "Dispensing water...")
  
        // Simulate watering process
        for (let i = 0; i < 100; i++) {
          if (!this.isWatering) {
            throw new Error("Watering stopped by user")
          }
  
          await new Promise((resolve) => setTimeout(resolve, 50))
          currentStep++
          this.updateProgress((currentStep / totalSteps) * 100, `Watering ${plantName}`, `${i + 1}% complete`)
        }
      }
    }
  
    updateProgress(percent, plant, status) {
      document.getElementById("progressPercent").textContent = `${Math.round(percent)}%`
      document.getElementById("currentPlant").textContent = plant
      document.getElementById("progressStatus").textContent = status
  
      // Update progress ring
      const circle = document.querySelector(".progress-ring-circle")
      const circumference = 2 * Math.PI * 52
      const offset = circumference - (percent / 100) * circumference
      circle.style.strokeDashoffset = offset
    }
  
    showWateringModal() {
      const modal = document.getElementById("wateringModal")
      modal.classList.remove("hidden")
      this.updateProgress(0, "Starting watering...", "Preparing system...")
    }
  
    hideWateringModal() {
      const modal = document.getElementById("wateringModal")
      modal.classList.add("hidden")
    }
  
    pauseWatering() {
      if (this.isWatering) {
        this.isWatering = false
        this.showNotification("Watering paused", "info")
      }
    }
  
    stopWatering() {
      this.isWatering = false
      this.hideWateringModal()
      this.showNotification("Watering stopped", "warning")
    }
  
    testSystem() {
      this.showNotification("Running system test...", "info")
  
      setTimeout(() => {
        this.showNotification("System test completed. All components working normally.", "success")
      }, 2000)
    }
  
    emergencyStop() {
      this.isWatering = false
      this.hideWateringModal()
      this.showNotification("Emergency stop activated!", "error")
    }
  
    showNotification(message, type = "info") {
      // Create notification element
      const notification = document.createElement("div")
      notification.className = `notification notification-${type}`
      notification.textContent = message
  
      Object.assign(notification.style, {
        position: "fixed",
        top: "1rem",
        right: "1rem",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        color: "white",
        fontWeight: "500",
        zIndex: "1000",
        transform: "translateX(100%)",
        transition: "transform 0.3s ease",
        maxWidth: "300px",
      })
  
      // Set background color based on type
      const colors = {
        success: "#10b981",
        error: "#ef4444",
        warning: "#f59e0b",
        info: "#3b82f6",
      }
  
      notification.style.backgroundColor = colors[type] || colors.info
  
      document.body.appendChild(notification)
  
      // Animate in
      setTimeout(() => {
        notification.style.transform = "translateX(0)"
      }, 100)
  
      // Remove after delay
      setTimeout(() => {
        notification.style.transform = "translateX(100%)"
        setTimeout(() => {
          if (notification.parentNode) {
            document.body.removeChild(notification)
          }
        }, 300)
      }, 3000)
    }
  }
  
  // Global functions for HTML onclick handlers
  function togglePlant(plantId) {
    window.waterController.togglePlant(plantId)
  }
  
  function setAmount(amount) {
    window.waterController.setAmount(amount)
  }
  
  function updateAmount() {
    window.waterController.updateAmount()
  }
  
  function startWatering() {
    window.waterController.startWatering()
  }
  
  function pauseWatering() {
    window.waterController.pauseWatering()
  }
  
  function stopWatering() {
    window.waterController.stopWatering()
  }
  
  function testSystem() {
    window.waterController.testSystem()
  }
  
  function emergencyStop() {
    window.waterController.emergencyStop()
  }
  
  // Initialize water controller when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    window.waterController = new WaterController()
  })
  