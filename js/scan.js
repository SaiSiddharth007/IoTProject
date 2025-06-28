// Plant Scanner Module
class PlantScanner {
    constructor() {
      this.currentStream = null
      this.facingMode = "environment"
      this.isAnalyzing = false
      this.init()
    }
  
    init() {
      this.bindEvents()
      this.initializeElements()
    }
  
    bindEvents() {
      // File input change
      const fileInput = document.getElementById("fileInput")
      if (fileInput) {
        fileInput.addEventListener("change", (event) => this.handleFileUpload(event))
      }
    }
  
    initializeElements() {
      const captureBtn = document.getElementById("captureBtn")
      if (captureBtn) {
        captureBtn.disabled = true
      }
    }
  
    async startCamera() {
      const video = document.getElementById("video")
      const placeholder = document.getElementById("cameraView")
      const captureBtn = document.getElementById("captureBtn")
  
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: this.facingMode },
        })
  
        this.currentStream = stream
        video.srcObject = stream
        video.classList.remove("hidden")
        placeholder.classList.add("hidden")
        captureBtn.disabled = false
  
        this.showNotification("Camera started successfully", "success")
      } catch (err) {
        console.error("Error accessing camera:", err)
        this.showNotification("Unable to access camera. Please check permissions.", "error")
      }
    }
  
    switchCamera() {
      if (this.currentStream) {
        this.currentStream.getTracks().forEach((track) => track.stop())
      }
  
      this.facingMode = this.facingMode === "user" ? "environment" : "user"
      this.startCamera()
    }
  
    captureImage() {
      const video = document.getElementById("video")
      const canvas = document.getElementById("canvas")
      const ctx = canvas.getContext("2d")
  
      if (!video.videoWidth || !video.videoHeight) {
        this.showNotification("Camera not ready. Please try again.", "warning")
        return
      }
  
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.drawImage(video, 0, 0)
  
      const imageData = canvas.toDataURL("image/jpeg")
      this.analyzeImage(imageData)
    }
  
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (!file.type.startsWith("image/")) {
          this.showNotification("Please select a valid image file.", "error")
          return
        }
  
        const reader = new FileReader()
        reader.onload = (e) => {
          this.analyzeImage(e.target.result)
        }
        reader.readAsDataURL(file)
      }
    }
  
    async analyzeImage(imageData) {
      if (this.isAnalyzing) {
        this.showNotification("Analysis already in progress...", "warning")
        return
      }
  
      this.isAnalyzing = true
      const analysisPlaceholder = document.getElementById("analysisResults")
      const analysisContent = document.getElementById("analysisContent")
      const capturedImage = document.getElementById("capturedImage")
  
      // Show loading state
      analysisPlaceholder.innerHTML = `
        <div class="analysis-loading">
          <div class="spinner"></div>
          <p>Analyzing image...</p>
        </div>
      `
  
      // Set the captured image
      capturedImage.src = imageData
  
      try {
        // Simulate AI analysis
        const results = await this.simulateAIAnalysis()
  
        // Hide placeholder and show results
        analysisPlaceholder.classList.add("hidden")
        analysisContent.classList.remove("hidden")
  
        // Update UI with results
        this.displayResults(results)
  
        this.showNotification("Analysis complete!", "success")
      } catch (error) {
        console.error("Analysis failed:", error)
        this.showNotification("Analysis failed. Please try again.", "error")
  
        // Reset UI
        analysisPlaceholder.classList.remove("hidden")
        analysisContent.classList.add("hidden")
        analysisPlaceholder.innerHTML = `
          <div class="analysis-icon">🔍</div>
          <p>Capture or upload an image to start analysis</p>
        `
      } finally {
        this.isAnalyzing = false
      }
    }
  
    async simulateAIAnalysis() {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 3000))
  
      // Mock plant data
      const plants = [
        {
          name: "Tomato Plant",
          scientific: "Solanum lycopersicum",
          confidence: 95,
          waterStatus: "Needs Water",
          health: "Good",
          leafCondition: "Healthy",
        },
        {
          name: "Basil Herb",
          scientific: "Ocimum basilicum",
          confidence: 92,
          waterStatus: "Well Watered",
          health: "Excellent",
          leafCondition: "Vibrant",
        },
        {
          name: "Rose Bush",
          scientific: "Rosa rubiginosa",
          confidence: 88,
          waterStatus: "Slightly Dry",
          health: "Fair",
          leafCondition: "Good",
        },
      ]
  
      // Return random plant data
      return plants[Math.floor(Math.random() * plants.length)]
    }
  
    displayResults(results) {
      // Update plant identification
      document.getElementById("plantName").textContent = results.name
      document.getElementById("plantScientificName").textContent = results.scientific
      document.getElementById("confidenceScore").textContent = `${results.confidence}%`
  
      // Update health metrics
      document.getElementById("waterStatus").textContent = results.waterStatus
      document.getElementById("overallHealth").textContent = results.health
      document.getElementById("leafCondition").textContent = results.leafCondition
  
      // Generate recommendations based on results
      this.generateRecommendations(results)
    }
  
    generateRecommendations(results) {
      const recommendationList = document.getElementById("recommendationList")
      const recommendations = []
  
      // Water recommendation
      if (results.waterStatus.includes("Needs") || results.waterStatus.includes("Dry")) {
        recommendations.push({
          icon: "💧",
          title: "Watering",
          description: "Water immediately with 200ml. Next watering in 2-3 days.",
        })
      } else if (results.waterStatus.includes("Well")) {
        recommendations.push({
          icon: "💧",
          title: "Watering",
          description: "Plant is well hydrated. Next watering in 4-5 days.",
        })
      }
  
      // Light recommendation
      recommendations.push({
        icon: "☀️",
        title: "Light Exposure",
        description: "Ensure 6-8 hours of indirect sunlight daily.",
      })
  
      // Health-based recommendations
      if (results.health === "Fair" || results.health === "Poor") {
        recommendations.push({
          icon: "🌱",
          title: "Plant Care",
          description: "Monitor closely and consider fertilizing to improve health.",
        })
      }
  
      // Update recommendations HTML
      recommendationList.innerHTML = recommendations
        .map(
          (rec) => `
        <div class="recommendation-item">
          <div class="recommendation-icon">${rec.icon}</div>
          <div class="recommendation-text">
            <h5>${rec.title}</h5>
            <p>${rec.description}</p>
          </div>
        </div>
      `,
        )
        .join("")
    }
  
    waterNow() {
      this.showNotification("Watering system activated!", "success")
      setTimeout(() => {
        this.showNotification("Plant watered successfully!", "success")
      }, 2000)
    }
  
    addToGarden() {
      const plantName = document.getElementById("plantName").textContent
      if (plantName && plantName !== "Plant Name") {
        this.showNotification(`${plantName} added to your garden!`, "success")
      } else {
        this.showNotification("Please analyze a plant first.", "warning")
      }
    }
  
    saveAnalysis() {
      const plantName = document.getElementById("plantName").textContent
      if (plantName && plantName !== "Plant Name") {
        this.showNotification("Analysis saved to history!", "success")
      } else {
        this.showNotification("No analysis to save.", "warning")
      }
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
  function startCamera() {
    window.plantScanner.startCamera()
  }
  
  function switchCamera() {
    window.plantScanner.switchCamera()
  }
  
  function captureImage() {
    window.plantScanner.captureImage()
  }
  
  function handleFileUpload(event) {
    window.plantScanner.handleFileUpload(event)
  }
  
  function waterNow() {
    window.plantScanner.waterNow()
  }
  
  function addToGarden() {
    window.plantScanner.addToGarden()
  }
  
  function saveAnalysis() {
    window.plantScanner.saveAnalysis()
  }
  
  // Initialize scanner when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    window.plantScanner = new PlantScanner()
  })
  