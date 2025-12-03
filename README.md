# SIGEDOT - Sistema de Gestión de Documentos Tributarios

![Status](https://img.shields.io/badge/Status-MVP%20Enterprise-blue)
![Stack](https://img.shields.io/badge/Stack-MERN%2FPERN-green)

Plataforma integral para la carga, validación y auditoría de certificados tributarios, diseñada con una arquitectura basada en roles (RBAC) y altos estándares de seguridad.

## 🚀 Características Principales

- **Gestión de Roles Estricta:**
  - `Admin`: Gestión total y CRUD de usuarios.
  - `Auditor`: Validación y rechazo de documentos.
  - `Corredor`: Carga segura de archivos.
- **Seguridad Avanzada:** Autenticación JWT, Hashing Bcrypt y protección contra XSS.
- **Flujo de Trabajo:** Carga -> Pendiente -> Validación/Rechazo.

## 🛠️ Stack Tecnológico

- **Frontend:** React 18 + Vite + Tailwind CSS.
- **Backend:** Node.js + Express + Sequelize.
- **Base de Datos:** MySQL.
- **Seguridad:** Helmet, CORS, JWT.

## 📦 Instalación y Despliegue

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/Tomasv55/sigedot-proyecto.git](https://github.com/Tomasv55/sigedot-proyecto.git)