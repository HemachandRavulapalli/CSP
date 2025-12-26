<div align="center">
  <img src="frontend/public/logo.png" alt="SmartAgri Logo" width="120" />
  <h1>🌱 SmartAgri</h1>
  <p><strong>Intelligent Farm Management & Marketplace System</strong></p>

  <p>
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-screenshots">Screenshots</a>
  </p>
</div>

---

## 📖 Overview
**SmartAgri** (formerly IFMMS) is a comprehensive digital solution designed to bridge the gap between farmers and technology. It empowers farmers with real-time crop advisory, a direct marketplace, and precision farming tools, while providing consumers with traceable, fresh produce.

The platform is built with a **Mobile-First** design philosophy, featuring large touch-friendly controls, voice assistance, and regional language support capabilities.

## ✨ Features

### 🚜 For Farmers
- **🌾 Smart Crop Selection**: AI-driven rule engine suggests crops based on **Soil Type** (Clay, Loamy, etc.) and **Season** (Kharif, Rabi).
- **📅 Growth Calendar**: Interactive **Vertical Timeline** tracking crop lifecycle from Sowing to Harvesting for 10+ major crops.
- **🌦️ Weather Widget**: Real-time dashboard with humidity, wind speed, and daily farming tips.
- **📢 Marketplace**: List crops for sale with custom pricing and quantity.
- **🎙️ Voice Assistant**: Integrated voice navigation and screen reader for accessibility.

### 🛒 For Consumers
- **🛍️ Direct Buying**: Purchase fresh produce directly from farmers avoiding middlemen.
- **🚚 GPS Tracking**: Real-time order tracking on an interactive map with delivery status timeline.
- **🔔 Notifications**: Order updates and alerts.

### 🔐 Security & UX
- **Role-Based Access**: Distinct interfaces for Farmers and Consumers.
- **Glassmorphism UI**: Modern, premium aesthetic with `framer-motion` animations.
- **Secure Auth**: JWT-based authentication with OTP verification (Mock).

## 🛠 Tech Stack

### **Frontend**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

### **Middleware & Services**
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Web Speech API](https://img.shields.io/badge/Web_Speech_API-FF6F00?style=for-the-badge&logo=google&logoColor=white)

## 📂 Project Structure

```bash
SmartAgri/
├── BackEnd/
│   ├── config/         # SQLite DB connection & seeding
│   ├── routes/         # API Endpoints (Auth, Crops, GPS)
│   └── server.js       # Main entry point
├── frontend/
│   ├── public/         # Static assets (logo.png)
│   ├── src/
│   │   ├── components/ # Navbar, VoiceAssistant
│   │   ├── pages/      # Dashboard, Marketplace, Calendar
│   │   └── App.jsx     # Routing & Role Logic
│   └── index.html      # Entry HTML
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/HemachandRavulapalli/CSP.git
cd CSP
```

### 2. Setup Backend
```bash
cd BackEnd
npm install
node server.js
```
*The server will start on port 3000 and automatically seed the SQLite database.*

### 3. Setup Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*The app will run at `http://localhost:5173`.*

## 📸 Screenshots

<div align="center">
  <h3>Interactive Dashboard</h3>
  <img src="frontend/public/screenshots/dashboard.png" width="800" alt="Dashboard" />
</div>

<br/>

<div align="center">
  <img src="frontend/public/screenshots/my_crops.png" width="45%" alt="Smart Crop Selection" />
  <img src="frontend/public/screenshots/calendar.png" width="45%" alt="Calendar" />
</div>
<div align="center">
  <p><em>Smart Crop Recommendation & Vertical Growth Timeline</em></p>
</div>

<br/>

<div align="center">
  <h3>Digital Marketplace</h3>
  <img src="frontend/public/screenshots/marketplace.png" width="800" alt="Marketplace" />
</div>

<br/>

<div align="center">
  <h3>Live GPS Tracking</h3>
  <img src="frontend/public/screenshots/gps.png" width="800" alt="GPS Tracking" />
</div>

## 🤝 Contributing
Contributions are welcome! Please fork the repository and create a pull request.

## 📄 License
This project is licensed under the MIT License.
