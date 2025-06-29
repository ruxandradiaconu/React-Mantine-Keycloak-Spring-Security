<div align="center">

# 🚀 Spring Boot + React + Keycloak Starter

**A complete full-stack application with modern authentication and authorization**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)
[![Keycloak](https://img.shields.io/badge/Keycloak-22.0.5-red.svg)](https://www.keycloak.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API](#-api-endpoints) • [Troubleshooting](#-troubleshooting)

</div>

---

## 🌟 Features

<table>
<tr>
<td width="50%">

### 🔧 **Backend (Spring Boot)**
- ✅ **Spring Boot 3.x** with Java 17
- ✅ **H2 Database** for development
- ✅ **Hibernate/JPA** for ORM
- ✅ **Keycloak OAuth2/OIDC** integration
- ✅ **Role-based Access Control** (USER, ADMIN)
- ✅ **RESTful API** for tutorial management
- ✅ **Admin API** for user role management

</td>
<td width="50%">

### ⚛️ **Frontend (React)**
- ✅ **React 18** with TypeScript
- ✅ **Mantine UI** components
- ✅ **React Router** for navigation
- ✅ **TanStack Query** for data management
- ✅ **Role-based UI** rendering
- ✅ **Tutorial CRUD** operations
- ✅ **Responsive Design**

</td>
</tr>
</table>

---

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Download |
|------|---------|----------|
| ☕ Java | 17+ | [Download](https://adoptium.net/) |
| 📦 Maven | 3.6+ | [Download](https://maven.apache.org/download.cgi) |
| 🟢 Node.js | 18+ | [Download](https://nodejs.org/) |
| 🔐 Keycloak | Latest | [Download](https://www.keycloak.org/downloads) |

### 🔥 Installation

#### 1️⃣ **Start Keycloak Server**

\`\`\`bash
# Navigate to your Keycloak installation directory
cd /path/to/keycloak

# Start Keycloak in development mode on port 8080
./bin/kc.sh start-dev --http-port=8080
\`\`\`

> 🌐 Keycloak will be accessible at: **http://localhost:8080**

#### 2️⃣ **Configure Keycloak**

Follow our detailed setup guide: **[📖 KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md)**

<details>
<summary>🔧 <strong>Quick Configuration Summary</strong></summary>

1. 🏠 Access admin console: http://localhost:8080
2. 🔑 Login with `admin/admin`
3. 🏢 Create realm: `demo-realm`
4. 📱 Create client: `demo-client` (public, standard flow enabled)
5. 👥 Create client roles: `USER`, `ADMIN`
6. 🔗 Configure client mapper to include roles in ID token
7. 👤 Create test user: `testuser/testuser` with appropriate roles

</details>

#### 3️⃣ **Start Backend**

\`\`\`bash
cd backend
mvn spring-boot:run
\`\`\`

> 🚀 Backend will be available at: **http://localhost:8081**

#### 4️⃣ **Start Frontend**

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

> 🎨 Frontend will be available at: **http://localhost:3000**

---

## 🌐 Port Configuration

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| 🔐 **Keycloak** | 8080 | http://localhost:8080 | Authentication server |
| 🔧 **Backend** | 8081 | http://localhost:8081 | Spring Boot API |
| ⚛️ **Frontend** | 3000 | http://localhost:3000 | React application |
| 🗄️ **H2 Console** | 8081 | http://localhost:8081/h2-console | Database console |

---

## 📚 API Endpoints

### 🌍 Public Endpoints
```http
GET /api/public/health          # Health check
